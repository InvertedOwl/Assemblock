import "./Node.css";
import { useRef } from "react";

export default function Node(props) {
    const downRef = useRef(false);
    const nodeRef = useRef(null);

    const handleMouseDown = (e) => {
        if (e.target.closest(".nodrag")) return;
        downRef.current = true;

        const rect = nodeRef.current?.getBoundingClientRect();
        props.onDragStart(e, rect);
    };

    const handleMouseUp = (e) => {
        downRef.current = false;
        const rect = nodeRef.current?.getBoundingClientRect();
        props.onDragEnd(e, rect);            
    };

    const text = props.node.text || "";
    const titleParts = text.split("<param>");
    const params = props.node.params || [];

    // Edit block data param value
    function handleParamChange(paramIndex, e) {
        if (props.display === true) return;

        const { value } = e.target;

        console.log(props.blocks)

        props.setBlockData((prevBlocks) =>
            prevBlocks.map((block, bIndex) => {
                if (bIndex !== props.blockid) return block;

                return {
                    ...block,
                    children: block.children.map((child, nIndex) => {
                        if (nIndex !== props.nodeid) return child;

                        const updatedParams = (child.params || []).map(
                            (param, pIndex) => {
                                if (pIndex !== paramIndex) return param;

                                let newValue = value;
                                if (param.type === "number") {
                                    newValue = value === "" ? "" : Number(value);
                                    newValue = Math.min(Math.max(newValue, 0), child.params[pIndex].max || 9);
                                }

                                return {
                                    ...param,
                                    value: newValue,
                                };
                            }
                        );

                        return {
                            ...child,
                            params: updatedParams,
                        };
                    }),
                };
            })
        );
    }

    return (
        <div
            style={{ backgroundColor: props.node.color }}
            ref={nodeRef}
            className={
                "node" +
                (props.node.active ? " active" : "") +
                (props.connectedleft ? " connectedleft" : "") +
                (props.connectedright ? " connectedright" : "") +
                (props.connectedright && props.connectedleft ? " connectedboth" : "")
            }
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            {/* Text */}
            <h2 className="param-title">{props.node.title}</h2>
            <div className="param-block">
                {titleParts.map((part, index) => {
                    const isLastPart = index === titleParts.length - 1;
                    const hasParamHere = !isLastPart;
                    const paramIndex = index;

                    return (
                        <div key={index} className="title-part-with-param">
                            <p className="spacer">{part}</p>
                            {hasParamHere && params[paramIndex] && (
                                <input
                                    className={"param nodrag"}
                                    style={{
                                        width: params[paramIndex].width || (params[paramIndex].type === "number" ? Math.log10(params[paramIndex].max || 7) * 7 : undefined)
                                    }}
                                    type={params[paramIndex].type === "number" ? "number" : "text"}
                                    value={
                                        params[paramIndex].type === "number"
                                            ? (params[paramIndex].value === "" ? "" : String(Number(params[paramIndex].value)))
                                            : (params[paramIndex].value ?? "")
                                    }
                                    onChange={(e) => handleParamChange(paramIndex, e)}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
