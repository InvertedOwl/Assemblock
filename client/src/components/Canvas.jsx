import { Block } from "./Block";
import "./Canvas.css";
import { color, nodes } from "../nodes.js";
import { useEffect, useRef, useState } from "react";

export const Canvas = (props) => {
    // Blocks state
    // Callbacks for jumps should return a true or false for if it should jump
    const blocks = props.blocks;
    const setBlocks = props.setBlocks;
    const speed = props.settings.executionSpeed;

    
    // Use ref to be able to stop async function
    const playingRef = useRef(props.playing);

    useEffect(() => {
        playingRef.current = props.playing;
    }, [props.playing]);


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
    const canvasRef = useRef(null);
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

            setNodeActive(item.blockid, item.nodeindex, true);
            await new Promise(r => setTimeout(r, 1/speed * 1000));
            const result = await node.callback(node.params.map(param => param.value), registersRef.current, props.setRegister, props.addConsoleLine);
            setNodeActive(item.blockid, item.nodeindex, false);

            if (!playingRef.current) {
                return;
            }

            if (node.type === "jump" && result) 
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


    return (
        <div className="canvas" ref={canvasRef}>
            {blocks.map((block, index) => (
                <Block key={index} blocks={blocks} id={index} setBlockData={setBlocks} canvasRef={canvasRef}></Block>
            ))}
        </div>
    );
}