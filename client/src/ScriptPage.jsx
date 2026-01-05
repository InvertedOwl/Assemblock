import { useState, useEffect } from 'react'
import SettingsPopup from './components/SettingsPopup';
import { Canvas } from './components/Canvas'
import Node from './components/Node'
import './ScriptPage.css'
import { nodes } from './nodes.js';
import { Registers } from './components/Registers.jsx';
import { Console } from './components/Console.jsx';
import { parse as parseCookie } from 'cookie';

export function ScriptPage() {
    const [playing, setPlaying] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [blocks, setBlocks] = useState([
    ]);

    const [title, setTitle] = useState("");
    const [favorited, setFavorited] = useState(false);
    
    const [consoleLines, setConsoleLines] = useState([]);
    const MAX_CONSOLE_LINES = 256;
    
    const [settings, setSettings] = useState({
      numRegisters: 10,
      executionSpeed: 500,
      hyperspeed: false,
    });
    
    const [registers, setRegisters] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const setRegister = (index, value) => {
        setRegisters((prevRegisters) => {
            const newRegisters = [...prevRegisters];
            newRegisters[index] = value;
            return newRegisters;
        });
    }

    const addConsoleLine = (line) => {
      setConsoleLines((prevLines) => {
        const newLines = [...prevLines, line];
        if (newLines.length > MAX_CONSOLE_LINES) {
          return newLines.slice(newLines.length - MAX_CONSOLE_LINES);
        }
        return newLines;
      });
    }

  useEffect(() => {
        if (playing) {
        setConsoleLines([]);
        }
    }, [playing]);

    const [paletteDrag, setPaletteDrag] = useState(null);

    function handlePaletteDragStart(node, e, nodeRect) {
        const startNodeOffsetX = nodeRect ? (e.clientX - nodeRect.left) : 0;
        const startNodeOffsetY = nodeRect ? (e.clientY - nodeRect.top) : 0;

        setBlocks((prev) => {
            const newBlocks = [...prev];
            const nodeCopy = JSON.parse(JSON.stringify(node));
            nodeCopy.callback = node.callback
            const canvasEl = document.querySelector('.canvas');
            const canvasRect = canvasEl ? canvasEl.getBoundingClientRect() : null;
            const clientX = e.clientX;
            const clientY = e.clientY;
            // Read grid offset from the canvas backgroundPosition (set inline by Canvas)
            const bgPos = canvasEl ? (canvasEl.style.backgroundPosition || getComputedStyle(canvasEl).backgroundPosition) : "0px 0px";
            const parts = bgPos.split(" ");
            const gridX = parseInt(parts[0], 10) || 0;
            const gridY = parseInt(parts[1], 10) || 0;
            const x = canvasRect ? clientX - canvasRect.left - startNodeOffsetX - gridX : clientX - startNodeOffsetX - gridX;
            const y = canvasRect ? clientY - canvasRect.top - startNodeOffsetY - gridY : clientY - startNodeOffsetY - gridY;

            newBlocks.push({ children: [nodeCopy], position: { x, y } });
            const newIndex = newBlocks.length - 1;
            setPaletteDrag({ blockId: newIndex, startNodeOffsetX, startNodeOffsetY, lastX: clientX, lastY: clientY });
            return newBlocks;
        });
    }

  useEffect(() => {
        if (!paletteDrag) return;

        function onMove(e) {
        const canvasEl = document.querySelector('.canvas');
        const canvasRect = canvasEl ? canvasEl.getBoundingClientRect() : null;
        const clientX = e.clientX;
        const clientY = e.clientY;
        const bgPos = canvasEl ? (canvasEl.style.backgroundPosition || getComputedStyle(canvasEl).backgroundPosition) : "0px 0px";
        const parts = bgPos.split(" ");
        const gridX = parseInt(parts[0], 10) || 0;
        const gridY = parseInt(parts[1], 10) || 0;
        const x = canvasRect ? clientX - canvasRect.left - (paletteDrag.startNodeOffsetX || 0) - gridX : clientX - (paletteDrag.startNodeOffsetX || 0) - gridX;
        const y = canvasRect ? clientY - canvasRect.top - (paletteDrag.startNodeOffsetY || 0) - gridY : clientY - (paletteDrag.startNodeOffsetY || 0) - gridY;

        setBlocks((prev) => {
            if (!prev[paletteDrag.blockId]) return prev;
            const newBlocks = [...prev];
            newBlocks[paletteDrag.blockId] = { ...newBlocks[paletteDrag.blockId], position: { x, y } };
            return newBlocks;
        });

        setPaletteDrag((p) => p ? { ...p, lastX: clientX, lastY: clientY } : p);
        }

        function onUp() {
        setPaletteDrag(null);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);

        return () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        };
    }, [paletteDrag]);

    useEffect(() => {
      console.log(parseCookie(document.cookie).script_id);

        const getScript = async () => {
            const response = await fetch("/script/?id=" + (parseCookie(document.cookie).script_id || ""), {
            method: "GET",
            credentials: 'same-origin',
            });
            const data = await response.json();
            if (data.script_json) {
              setBlocks(data.script_json);
            }

            setTitle(data.title || "");
            setFavorited(data.favorited || false);
            setSettings(data.settings || {
              numRegisters: 10,
              executionSpeed: 500,
              hyperspeed: false,
            });

            // Go through and reattach callbacks
            setBlocks((prevBlocks) => {
              return prevBlocks.map((block) => {
                const newChildren = block.children.map((node) => {
                    const nodeDef = nodes.find((n) => n.title === node.title);
                    if (nodeDef) {
                      return { ...node, callback: nodeDef.callback };
                    }
                    return node;
                });
                return { ...block, children: newChildren };
              });
            });          
        };
        
      getScript();
    }, []);
  
  const saveScript = async (updatedFields = {}) => {
    const scriptData = {
      "script_json": blocks,
      "title": title,
      "id": parseCookie(document.cookie).script_id || null,
      "favorited": updatedFields.favorited !== undefined ? updatedFields.favorited : favorited,
      "settings": settings,
    };
    const scriptJSON = JSON.stringify(scriptData, null, 2);


    const response = await fetch("/script/", {
      method: "POST",
        headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": parseCookie(document.cookie).csrftoken
      },
      credentials: 'same-origin',
      body: scriptJSON,
    })

    const data = await response.json();
    if (data.script_id) {
      document.cookie = `script_id=${data.script_id}; path=/;`;
    }

    console.log(scriptJSON);
  }

  

return (
    <div className="app">

      <div className='title'>
        
        <button
          className={"material-icons favorite" + (favorited ? " favorite-active" : "")}
          aria-label="Favorite"
          onClick={() => {
            setFavorited((prev) => {
              const newFavorited = !prev;
              saveScript({ favorited: newFavorited });
              return newFavorited;
            });
          }}
        >
          favorite
        </button>        
        <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className='newscript'>New Script</button>
      </div>


      <span
        className={"material-symbols-outlined settings" + (showSettings ? " settingsactive" : "")}
        role="button"
        aria-label="Open settings"
        tabIndex={0}
        onClick={() => setShowSettings((s) => !s)}
      >
        discover_tune
      </span>
      {showSettings && <SettingsPopup saveScript={saveScript} favorited={favorited} blocks={blocks} title={title} settings={settings} setSettings={setSettings} />}

      <button
        className={"control-button " + (playing ? "stop-button" : "play-button")}
        onClick={() => {
            setPlaying((prev) => !prev)
            setRegisters(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            console.log("Clicked play/stop " + settings.executionSpeed)
          }}>{playing ? "Stop" : "Play"}</button>



      <div className='body'>
        <div className='left'>

            <div className='list'>
            {
              nodes.map((node, index) => (
                <Node 
                key={index} 
                node={node} 
                onDragStart={(e, rect) => handlePaletteDragStart(node, e, rect)}
                connectedleft={false}
                connectedright={false}
                display={true}
                />
              ))
            }
          
            </div>

        </div>
        <Canvas settings={settings} className='canvas' playing={playing} setPlaying={setPlaying} blocks={blocks} setBlocks={setBlocks} registers={registers} setRegister={setRegister} addConsoleLine={addConsoleLine}></Canvas>
        <div className='right'>
          <Registers registers={registers}></Registers>
          <Console lines={consoleLines}></Console>
        </div>
      </div>

      
    </div>
  )
}
