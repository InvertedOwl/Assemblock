import "./Block.css";

import Node from "./Node";
import { useRef, useEffect } from "react";


export const Block = (props) => {
    const blockData = props.blocks[props.id];
    const setBlockData = props.setBlockData;

    const dragRef = useRef({ active: false, blockId: null, nodeIndex: null, lastX: 0, lastY: 0, startX: 0, startY: 0 });

    const getCanvasCoords = (e) => {
        const canvasRect = props.canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return { x: e.clientX, y: e.clientY }; // fallback

        return {
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top,
        };
    };


    // Remove event listeners after unmount
    useEffect(() => {
        return () => {
            if (dragRef.current.active) {
                document.removeEventListener("mousemove", handleDocumentMove);
                document.removeEventListener("mouseup", handleDocumentUp);
                dragRef.current.active = false;
            }
        };
    }, []);

    // Handle mouse move even accross entire document
    // This is on the document because if it was on the node, it would not drag while the cursor is outside the node
    const handleDocumentMove = (e) => {
        if (!dragRef.current.active) return;
        const { lastX, lastY, blockId, nodeIndex } = dragRef.current;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        dragRef.current.lastX = e.clientX;
        dragRef.current.lastY = e.clientY;

        nodeMove(nodeIndex, dx, dy, blockId);
    };

    // Handle mouse up even accross entire document
    const handleDocumentUp = (e) => {
        if (!dragRef.current.active) return;
        document.removeEventListener("mousemove", handleDocumentMove);
        document.removeEventListener("mouseup", handleDocumentUp);
        dragRef.current.active = false;
    };

    // Handle click event from node
    function handleDragStart(nodeIndex, e, nodeRect) {
        const startNodeOffsetX = nodeRect ? (e.clientX - nodeRect.left) : 0;
        const startNodeOffsetY = nodeRect ? (e.clientY - nodeRect.top) : 0;

        dragRef.current = {
            active: true,
            blockId: props.id,
            nodeIndex,
            lastX: e.clientX,
            lastY: e.clientY,
            startX: e.clientX,
            startY: e.clientY,
            startNodeOffsetX,
            startNodeOffsetY,
        };

        document.addEventListener("mousemove", handleDocumentMove);
        document.addEventListener("mouseup", handleDocumentUp);
    }

    // NOTE TO PROFESSOR:
    // Im having to grab from the actual dom here because the node widths are calculated on the fly based on their content
    // So I have to grab their widths after the render.
    // It's kinda gross, but I'd rather do this than having the widths be fixed.

    // Handle un-drag from node
    function handleDragEnd(nodeIndex, e, nodeRect) {
        const { x: canvasX, y: canvasY } = getCanvasCoords(e);
        const canvasRect = props.canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        for (let b = 0; b < props.blocks.length; b++) {
            // Ignore self
            if (b === props.id) continue;

            // Find the actual DOM element for this block
            const blockEl = document.querySelector(`.block[data-block-id="${b}"]`);
            if (!blockEl) continue;

            const blockRect = blockEl.getBoundingClientRect();
            const blockRight = blockRect.right - canvasRect.left;
            const blockTop = blockRect.top - canvasRect.top;
            const blockBottom = blockRect.bottom - canvasRect.top;

            const blockWidth = blockRect.width;

            const mergeZoneWidth = blockWidth * 0.75;

            if (
                canvasX >= blockRight &&
                canvasX <= blockRight + mergeZoneWidth &&
                canvasY >= blockTop &&
                canvasY <= blockBottom
            ) {
                // move all children from block[b] to current block
                setBlockData((prevBlocks) => {
                    const newBlocks = [...prevBlocks];

                    const targetBlock = { ...newBlocks[props.id] };
                    const sourceBlock = { ...newBlocks[b] };

                    // Append target children to the source
                    sourceBlock.children = sourceBlock.children.concat(
                    targetBlock.children
                    );
                    newBlocks[props.id] = sourceBlock;

                    // Remove source block
                    newBlocks.splice(b, 1);
                    return newBlocks;
                });
            }
        }
    }


    // Move node from the mouse move event
    function nodeMove(nodeIndex, dx, dy, blockId = props.id) {
        if (nodeIndex === 0) {
            setBlockData((prevBlocks) => {
            const newBlocks = [...prevBlocks];
            const targetBlock = { ...newBlocks[blockId] };
            targetBlock.position = {
                x: (targetBlock.position?.x || 0) + dx,
                y: (targetBlock.position?.y || 0) + dy,
            };
            newBlocks[blockId] = targetBlock;
            return newBlocks;
            });
            return;
        }

        // For other nodes, perform split. We must ensure dragRef points to the correct new block if we move the node.
        setBlockData((prevBlocks) => {
            const newBlocks = [...prevBlocks];
            const currentBlock = { ...newBlocks[blockId] };
            const before = currentBlock.children.slice(0, nodeIndex);
            const after = currentBlock.children.slice(nodeIndex);

            currentBlock.children = before;
            newBlocks[blockId] = currentBlock;

            // Convert cursor position from client → canvas
            const canvasRect = props.canvasRef.current?.getBoundingClientRect();
            const cursorClientX = dragRef.current.lastX || dragRef.current.startX || 0;
            const cursorClientY = dragRef.current.lastY || dragRef.current.startY || 0;
            const cursorX = canvasRect
            ? cursorClientX - canvasRect.left
            : cursorClientX;
            const cursorY = canvasRect
            ? cursorClientY - canvasRect.top
            : cursorClientY;

            const startNodeOffsetX = dragRef.current.startNodeOffsetX || 0;
            const startNodeOffsetY = dragRef.current.startNodeOffsetY || 0;

            const newBlock = {
                children: after,
                position: {
                    x: cursorX - startNodeOffsetX,
                    y: cursorY - startNodeOffsetY,
                },
            };

            newBlocks.push(newBlock);

            const newBlockIndex = newBlocks.length - 1;
            dragRef.current.blockId = newBlockIndex;
            dragRef.current.nodeIndex = 0;

            return newBlocks;
        });
    }


return (
    <div
    className="block"
    data-block-id={props.id}
    style={{
        transform: `translate(${blockData.position.x}px, ${blockData.position.y}px)`,
    }}
    >
        {blockData.children.map((child, index) => (
        <Node
        key={index}
        node={child}
        onDragStart={(e, rect) => handleDragStart(index, e, rect)}
        onDragEnd={(e, rect) => handleDragEnd(index, e, rect)}
        blocks={props.blocks}
        blockid={props.id}          // <--- use props.id, not props.index
        nodeid={index}
        setBlockData={setBlockData} // <--- pass the function you actually have
        connectedleft={index > 0}
        connectedright={
            index < blockData.children.length - 1 &&
            blockData.children.length > 1
        }
        />


        ))}
    </div>
    );
};