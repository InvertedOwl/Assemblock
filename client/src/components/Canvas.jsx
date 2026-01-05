import { Block } from "./Block";
import "./Canvas.css";
import { color, nodes } from "../nodes.js";
import { useEffect, useRef, useState } from "react";
import ExecuteWorker from "../worker/executeWorker?worker";

export const Canvas = (props) => {
    // Blocks state
    // Callbacks for jumps should return a true or false for if it should jump
    const blocks = props.blocks;
    const setBlocks = props.setBlocks;
    const speed = props.settings.executionSpeed;

    
    // Use ref to be able to stop async function
    const playingRef = useRef(props.playing);
    const workerRef = useRef(null);
    const msgIdRef = useRef(0);
    const pendingRef = useRef({});

    useEffect(() => {
        playingRef.current = props.playing;
    }, [props.playing]);

    useEffect(() => {
        // initialize worker
        workerRef.current = new ExecuteWorker();
        workerRef.current.onmessage = (e) => {
            const { data } = e;
            if (!data) return;
            if (data.type === 'nodeResult') {
                const resolver = pendingRef.current[data.id];
                if (resolver) {
                    resolver(data.payload);
                    delete pendingRef.current[data.id];
                }
            }
        };

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
            pendingRef.current = {};
        };
    }, []);


    function setNodeActive(blockId, nodeIndex, active = true) {
        setBlocks(prevBlocks => {
            return prevBlocks.map((block, bIndex) => {
                if (bIndex !== blockId) return block;

                return {
                    ...block,
                    children: block.children.map((node, nIndex) => {
                        if (nIndex !== nodeIndex) return node;

                        return { ...node, active };
                    })
                };
            });
        });
    }

    const toexecute = [];
    const registersRef = useRef(props.registers);

    useEffect(() => {
        registersRef.current = props.registers;
    }, [props.registers]);

    useEffect(() => {
        if (props.playing) {
            console.log("Starting execution");
            
            for (let bIndex = 0; bIndex < blocks.length; bIndex++) {
                const block = blocks[bIndex];
                if (block.children[0].type === "start") {
                    toexecute.push({"blockid": bIndex, "nodeindex": 0});
                }
            }

            executeNodes();
        } else {
            toexecute.length = 0;
        }

    }, [props.playing]);

    async function executeNodes() {
        for (const item of toexecute) {
            const block = blocks[item.blockid];
            const node = block.children[item.nodeindex];

            
            if (!props.settings.hyperspeed) {
                setNodeActive(item.blockid, item.nodeindex, true);
                await new Promise(r => setTimeout(r, 1/speed * 1000));
            }

            // offload node execution to worker
            const minimalNode = { title: node.title, type: node.type, params: node.params.map(p => p.value) };
            const result = await new Promise((resolve) => {
                const id = ++msgIdRef.current;
                pendingRef.current[id] = resolve;
                workerRef.current.postMessage({ type: 'execNode', id, node: minimalNode, registers: registersRef.current });
            });

            // apply register updates returned from worker
            if (result && result.updates) {
                for (const u of result.updates) {
                    props.setRegister(u.reg, u.value);
                }
            }

            // apply console lines
            if (result && result.consoleLines) {
                for (const line of result.consoleLines) props.addConsoleLine(line);
            }
            
            if (!props.settings.hyperspeed) {
                setNodeActive(item.blockid, item.nodeindex, false);
            }

            if (!playingRef.current) {
                return;
            }

            if (node.type === "jump" && result && result.jump) 
            {
                // find label node with matching name
                for (let bIndex = 0; bIndex < blocks.length; bIndex++) {
                    const block = blocks[bIndex];
                    for (let nIndex = 0; nIndex < block.children.length; nIndex++) {
                        const n = block.children[nIndex];
                        if (n.type === "label" && n.params[0].value === node.params[0].value) {
                            toexecute.push({"blockid": bIndex, "nodeindex": nIndex});
                        }
                    }
                }
            } else if (item.nodeindex + 1 < block.children.length) {
                toexecute.push({"blockid": item.blockid, "nodeindex": item.nodeindex + 1});
            }
        }
        props.setPlaying(false);
    }

    const canvasRef = useRef(null);
    const [gridPosition, setGridPosition] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (e.button !== 2) return;
        e.preventDefault();
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;

        const deltaX = e.clientX - dragStart.current.x;
        const deltaY = e.clientY - dragStart.current.y;

        setGridPosition((prev) => ({
            x: prev.x + deltaX,
            y: prev.y + deltaY,
        }));

        dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e) => {
        if (e.button !== 2) return; // Only stop dragging on right-click release
        isDragging.current = false;
    };

    return (
        <div
            className="canvas"
            ref={canvasRef}
            style={{
                backgroundPosition: `${gridPosition.x}px ${gridPosition.y}px`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
        >
            {blocks.map((block, index) => (
                <Block key={index} blocks={blocks} id={index} setBlockData={setBlocks} canvasRef={canvasRef} gridoffset={gridPosition}></Block>
            ))}
        </div>
    );
}