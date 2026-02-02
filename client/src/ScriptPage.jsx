import { useState, useEffect } from 'react'
import SettingsPopup from './components/SettingsPopup';
import { Canvas } from './components/Canvas'
import Node from './components/Node'
import './ScriptPage.css'
import { nodes } from './nodes.js';
import { Registers } from './components/Registers.jsx';
import { Console } from './components/Console.jsx';
import { Memory } from './components/Memory.jsx';
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
    
    const [memory, setMemories] = useState({});
    const MAX_MEMORY_CELLS = 64;

    const [isOwner, setIsOwner] = useState(true);
    
    const [settings, setSettings] = useState({
      numRegisters: 10,
      executionSpeed: 500,
      hyperspeed: false,
    });

    const [rightNavPage, setRightNavPage] = useState('console');
    
    const [registers, setRegisters] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const setRegister = (index, value) => {
        setRegisters((prevRegisters) => {
            const newRegisters = [...prevRegisters];
            newRegisters[index] = value;
            return newRegisters;
        });
    }

    const setMemory = (address, value) => {
        setMemories((prevMemory) => {
            const newMemory = { ...prevMemory };
            newMemory[address] = value;
            return newMemory;
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
        const endedPalette = paletteDrag;
        setPaletteDrag(null);
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup', onUp);

        // Finalize placement: clamp to canvas and attempt merge with nearby blocks
        if (endedPalette && typeof endedPalette.blockId === 'number') {
          finalizePaletteBlock(endedPalette.blockId);
        }
        }

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);

        return () => {
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerup', onUp);
        };
    }, [paletteDrag]);

    // Finalize placement for a block created from the palette
    function finalizePaletteBlock(blockId) {
      const canvasEl = document.querySelector('.canvas');
      const canvasRect = canvasEl ? canvasEl.getBoundingClientRect() : null;
      if (!canvasRect) return;

      const selfBlock = document.querySelector(`.block[data-block-id="${blockId}"]`);
      if (!selfBlock) return;

      const selfBlockRect = selfBlock.getBoundingClientRect();

      const selfStart = selfBlockRect.left - canvasRect.left;
      const selfTop = selfBlockRect.top - canvasRect.top;
      const selfBottom = selfBlockRect.bottom - canvasRect.top;

      // Read grid offset from canvas backgroundPosition
      const bgPos = canvasEl ? (canvasEl.style.backgroundPosition || getComputedStyle(canvasEl).backgroundPosition) : "0px 0px";
      const parts = bgPos.split(" ");
      const gridX = parseInt(parts[0], 10) || 0;
      const gridY = parseInt(parts[1], 10) || 0;

      // If placed off the left edge, remove the block
      if (selfStart < 0) {
        setBlocks((prevBlocks) => {
          const newBlocks = [...prevBlocks];
          if (blockId < 0 || blockId >= newBlocks.length) return prevBlocks;
          newBlocks.splice(blockId, 1);
          return newBlocks;
        });
        return;
      }

      // Otherwise clamp to canvas bounds
      setBlocks((prevBlocks) => {
        const newBlocks = [...prevBlocks];
        if (!newBlocks[blockId]) return prevBlocks;
        const targetBlock = { ...newBlocks[blockId] };
        const offsetX = gridX || 0;
        const offsetY = gridY || 0;
        const maxX = canvasRect.width - (selfBlockRect?.width || 0) - offsetX;
        const maxY = canvasRect.height - (selfBlockRect?.height || 0) - offsetY;
        const minX = -offsetX;
        const minY = -offsetY;

        targetBlock.position = {
          x: Math.min(Math.max(targetBlock.position?.x || 0, minX), maxX),
          y: Math.min(Math.max(targetBlock.position?.y || 0, minY), maxY),
        };
        newBlocks[blockId] = targetBlock;
        return newBlocks;
      });

      // Attempt merge with nearby existing blocks
      setTimeout(() => {
        const canvasRect2 = canvasEl ? canvasEl.getBoundingClientRect() : null;
        if (!canvasRect2) return;

        const selfBlock2 = document.querySelector(`.block[data-block-id="${blockId}"]`);
        if (!selfBlock2) return;
        const selfBlockRect2 = selfBlock2.getBoundingClientRect();
        const selfStart2 = selfBlockRect2.left - canvasRect2.left;
        const selfTop2 = selfBlockRect2.top - canvasRect2.top;
        const selfBottom2 = selfBlockRect2.bottom - canvasRect2.top;

        const mergeZoneWidth = 30;

        for (let b = 0; b < blocks.length; b++) {
          if (b === blockId) continue;
          const blockEl = document.querySelector(`.block[data-block-id="${b}"]`);
          if (!blockEl) continue;
          const blockRect = blockEl.getBoundingClientRect();
          const blockRight = blockRect.right - canvasRect2.left;
          const blockTop = blockRect.top - canvasRect2.top;
          const blockBottom = blockRect.bottom - canvasRect2.top;

          if (
            selfStart2 >= blockRight - mergeZoneWidth &&
            selfStart2 <= blockRight + mergeZoneWidth &&
            selfTop2 < blockBottom &&
            selfBottom2 > blockTop
          ) {
            setBlocks((prevBlocks) => {
              const newBlocks = [...prevBlocks];
              if (!newBlocks[blockId] || !newBlocks[b]) return prevBlocks;

              const targetBlock = { ...newBlocks[blockId] };
              const sourceBlock = { ...newBlocks[b] };

              sourceBlock.children = sourceBlock.children.concat(targetBlock.children);
              newBlocks[blockId] = sourceBlock;

              newBlocks.splice(b, 1);
              return newBlocks;
            });
            break;
          }
        }
      }, 0);
    }

    useEffect(() => {
        const cookies = parseCookie(document.cookie || "");
        const urlParams = new URLSearchParams(window.location.search || "");
        const hashParams = new URLSearchParams((window.location.hash || "").split("?")[1] || "");
        const scriptId = urlParams.get("id") || hashParams.get("id") || cookies.script_id;

        // If no id, then new script and dont apply any saved data
        if (!scriptId) {
          return;
        }

        const getScript = async () => {
            const response = await fetch("/script/?id=" + encodeURIComponent(scriptId), {
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

            setIsOwner(data.is_owner || false);

            
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
  
  const saveScript = async (updatedFields = {}, removed = false) => {
    const scriptData = {
      "script_json": blocks,
      "title": title,
      "id": parseCookie(document.cookie).script_id || null,
      "favorited": updatedFields.favorited !== undefined ? updatedFields.favorited : favorited,
      "settings": settings,
      "unlisted": settings.unlisted || false,
      "removed": removed,
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
  }

  const newscript = async () => {
    document.cookie = `script_id=; path=/;`;
    window.location.href = '/';
  }

  

return (
    <div className="app scriptpage">

      <div className='title'>
        
        <div className='togetherforver'>
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
            <input type="text" className='titleinput' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
          <button className='newscript' onClick={newscript}>New Script</button>
        </div>
        <span className={"material-symbols-outlined lockicon" + (isOwner ? " " : " lockiconactive")} aria-label="Locked script" >
        lock
        </span>      
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
            setMemories(() => ({}));
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
        <Canvas settings={settings} className='canvas' playing={playing} setPlaying={setPlaying} blocks={blocks} setBlocks={setBlocks} registers={registers} setRegister={setRegister} addConsoleLine={addConsoleLine} memory={memory} setMemory={setMemory} ></Canvas>
        <div className='right'>

          <div className='rightnav'>
            <button className={rightNavPage === "console" ? "rightnav-button rightnav-active" : "rightnav-button"} onClick={() => setRightNavPage("console")}>Console</button>
            <button className={rightNavPage === "registers" ? "rightnav-button rightnav-active" : "rightnav-button"} onClick={() => setRightNavPage("registers")}>Registers</button>
            <button className={rightNavPage === "memory" ? "rightnav-button rightnav-active" : "rightnav-button"} onClick={() => setRightNavPage("memory")}>Memory</button>
          </div>
          <div className='console' style={{ display: rightNavPage === 'console' ? 'block' : 'none' }}>
            <Console lines={consoleLines}></Console>
          </div>
          <div className='registers' style={{ display: rightNavPage === 'registers' ? 'block' : 'none' }}>
            <Registers registers={registers}></Registers>
          </div>
          <div className='memory' style={{ display: rightNavPage === 'memory' ? 'block' : 'none' }}>
            <Memory memory={memory} maxMemoryCells={MAX_MEMORY_CELLS}></Memory>
          </div>
        </div>
      </div>

      
    </div>
  )
}
