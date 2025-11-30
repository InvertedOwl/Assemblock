import { useState, useEffect } from 'react'
import SettingsPopup from './components/SettingsPopup';
import { Canvas } from './components/Canvas'
import Node from './components/Node'
import './ScriptPage.css'
import { nodes } from './nodes.js';
import { color } from './nodes.js';
import { Nav } from './components/Nav.jsx';
import { Registers } from './components/Registers.jsx';
import { Console } from './components/Console.jsx';

export function ScriptPage() {
  const [playing, setPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [blocks, setBlocks] = useState([
      { 
          children: [
              {"title": "Start", "params": [{"type": "number", "value": 0, "name": "param1"}], "callback": (params) => {}, "type": "start", "color": color.start, "active": false},

              {"title": "AddI", "text": "$<param> = $<param> + <param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 1, "name": "tolabel"}], "callback": 
              (params, registers, setRegister) => {
                console.log(params)
                setRegister(params[0], registers[params[1]] + params[2]);
              }, "type": "normal", "color": color.normal, "active": false}, 

                            {"title": "AddI", "text": "$<param> = $<param> + <param>", "params": [{"type": "number", "value": 1, "name": "tolabel"}, {"type": "number", "value": 1, "name": "tolabel"}, {"type": "number", "value": 64, "name": "tolabel", "max": 1024}], "callback": 
              (params, registers, setRegister) => {
                console.log(params)
                setRegister(params[0], registers[params[1]] + params[2]);
              }, "type": "normal", "color": color.normal, "active": false}, 

              {"title": "Label", "text": "<param>", "params": [{"type": "text", "value": "label1", "name": "labelname"}], "callback": () => {console.log('Node 3 callback')}, "type": "label", "color": color.label, "active": false},

              

              {"title": "Add", "text": "$<param> = $<param> + $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
              (params, registers, setRegister) => {
                console.log(params)
                setRegister(params[0], registers[params[1]] + registers[params[2]]);
              }, "type": "normal", "color": color.normal, "active": false}, 
              
              
              {"title": "Jump if Less", "text": "<param> $<param> < $<param>", "params": [{"type": "text", "value": "label1", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "1", "name": "tolabel"}], "callback": 
              (params, registers, setRegister) => {
                return registers[params[1]] < registers[params[2]];
              }, "type": "jump", "color": color.normal, "active": false}], 
          position: { x: 50, y: 50 } 
      }
  ]);

  const [registers, setRegisters] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const [consoleLines, setConsoleLines] = useState(["test1", "test2"]);

  const [settings, setSettings] = useState({
    numRegisters: 10,
    executionSpeed: 500,
    hyperspeed: false,
  });

  const setRegister = (index, value) => {
    setRegisters((prevRegisters) => {
      const newRegisters = [...prevRegisters];
      newRegisters[index] = value;
      return newRegisters;
    });
  }

  const addConsoleLine = (line) => {
    setConsoleLines((prevLines) => [...prevLines, line]);
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
      const x = canvasRect ? clientX - canvasRect.left - startNodeOffsetX : clientX - startNodeOffsetX;
      const y = canvasRect ? clientY - canvasRect.top - startNodeOffsetY : clientY - startNodeOffsetY;

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
      const x = canvasRect ? clientX - canvasRect.left - (paletteDrag.startNodeOffsetX || 0) : clientX - (paletteDrag.startNodeOffsetX || 0);
      const y = canvasRect ? clientY - canvasRect.top - (paletteDrag.startNodeOffsetY || 0) : clientY - (paletteDrag.startNodeOffsetY || 0);

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

  return (
    <div className="app">

      <span
        className={"material-symbols-outlined settings" + (showSettings ? " settingsactive" : "")}
        role="button"
        aria-label="Open settings"
        tabIndex={0}
        onClick={() => setShowSettings((s) => !s)}
      >
        discover_tune
      </span>
      {showSettings && <SettingsPopup/>}

      <button
        className={"control-button " + (playing ? "stop-button" : "play-button")}
        onClick={() => {
            setPlaying((prev) => !prev)
            setRegisters(() => [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
          }}>{playing ? "Stop" : "Play"}</button>



      <div className='body'>
        <div className='left'>

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
        <Canvas className='canvas' playing={playing} setPlaying={setPlaying} blocks={blocks} setBlocks={setBlocks} registers={registers} setRegister={setRegister} addConsoleLine={addConsoleLine}></Canvas>
        <div className='right'>
          <Registers registers={registers}></Registers>
          <Console lines={consoleLines}></Console>
        </div>
      </div>

      
    </div>
  )
}
