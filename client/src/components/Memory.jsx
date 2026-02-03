import "./Memory.css";
import React from "react";

export const Memory = (props) => {
    

    const [selectedCell, setSelectedCell] = React.useState(-1);

    const isRuntime = props.isRuntime;
    const setIsRuntime = props.setIsRuntime;

    function handleCellClick(address) {
        setSelectedCell(address);
    }

    const memoryToRender = isRuntime ? props.memory : props.preloadedMemory;

    // Add a ref to manage input focus
    const inputRef = React.useRef(null);

    // Focus the input when a cell is selected and isRuntime is false
    React.useEffect(() => {
        if (selectedCell !== -1 && !isRuntime && inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedCell, isRuntime]);

    return (
        <div className="memory-container">

            <h2 className="memory-title">Memory</h2>
            <div className="memory-mode-button-container">
                <button 
                    className={`memory-mode-button ${!isRuntime ? 'button-active' : ''}`}
                    onClick={() => setIsRuntime(false)}
                >
                    Preloaded
                </button>
                <button 
                    className={`memory-mode-button ${isRuntime ? 'button-active' : ''}`}
                    onClick={() => setIsRuntime(true)}
                >
                    Runtime
                </button>
            </div>

            <div className="memory-output">
                <table className="memory-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                    {Array.from({ length: props.maxMemoryCells/4 }, (_, i) => i * 4 ).map(num => ( // TEMP MAX MEMORY CELLS
                        <tr key={num}>
                            <td className="memory-location">{"#" + num.toString(16).padStart(2, "0")}</td>
                            {[0, 1, 2, 3].map((offset) => {
                                const address = num + offset;
                                return (
                                    <td
                                        key={address}
                                        className={`memory-value ${(memoryToRender[address] === undefined || memoryToRender[address] === 0 ? "unset" : "set")} ${selectedCell === address ? "highlighted" : ""}`}
                                        onClick={() => handleCellClick(address)}
                                    >
                                        {selectedCell === address && !isRuntime ? (
                                            <input
                                                type="text"
                                                className="memory-input"
                                                ref={inputRef} // Attach the ref to the input
                                                value={memoryToRender[address] === undefined ? "" : memoryToRender[address].toString(16).toUpperCase()}
                                                onChange={(e) => {
                                                    const value = e.target.value.toUpperCase();
                                                    if (/^[0-9A-F]{0,2}$/.test(value)) { // Allow only up to 2 base 16 characters
                                                        const parsedValue = parseInt(value, 16) || 0;
                                                        props.setPreloadedMemory((prev) => ({ ...prev, [address]: parsedValue }));
                                                    }
                                                }}
                                                onBlur={() => setSelectedCell(-1)}
                                            />
                                        ) : (
                                            memoryToRender[address] === undefined ? "00" : memoryToRender[address].toString(16).padStart(2, "0").toUpperCase()
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}

                    </tbody>
                </table>

                <hr style={{width: "100px"}}/>

                {selectedCell !== -1 &&  
                    <div className="translation">
                        <p>- #{selectedCell.toString(16).padStart(2, "0")} - </p>
                        <p>
                            Decimal: {memoryToRender[selectedCell] === undefined ? "00" : memoryToRender[selectedCell]} <br />
                            Hex: {memoryToRender[selectedCell] === undefined ? "00" : memoryToRender[selectedCell].toString(16).padStart(2, "0")} <br /> 
                            Binary: {memoryToRender[selectedCell] === undefined ? "00" : memoryToRender[selectedCell].toString(2).padStart(8, "0")} <br /></p>

                    </div>
            }
            </div>
        </div>
    );
};