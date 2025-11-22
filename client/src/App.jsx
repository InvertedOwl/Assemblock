import { useState } from 'react'
import { Canvas } from './components/Canvas'
import './App.css'
import { nodes } from './nodes.js';

function App() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="app">
      {/* <div className="node-palette">
        {
          nodes.map((node, index) => (
            <Node key={index} node={node} 
            onDragStart={(e, rect) => handleDragStart(index, e, rect)}
            onDragEnd={(e, rect) => handleDragEnd(index, e, rect)}
            connectedleft={false}
            connectedright={false}/>
          ))
        }
      </div> */}

      <h1>Test</h1>
      <button onClick={() => setPlaying(!playing)}>{playing ? "Stop" : "Play"}</button>
      <Canvas playing={playing} setPlaying={setPlaying}>
        
      </Canvas>
    </div>
  )
}

export default App
