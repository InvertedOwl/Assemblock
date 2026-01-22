import "./Memory.css";
import React from "react";

export const Memory = (props) => {
    

    const [selectedCell, setSelectedCell] = React.useState(-1);


    function handleCellClick(address) {
        setSelectedCell(address);
    }

    return (
        <div className="memory-container">

            <h2 className="memory-title">Memory</h2>
            <div className="memory-output">
                <table className="memory-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                    {Array.from({ length: 16 }, (_, i) => i * 4 ).map(num => ( // TEMP MAX MEMORY CELLS
                        <tr key={num}>
                            <td className="memory-location">{"#" + num.toString(16).padStart(2, "0")}</td>
                            <td className={"memory-value " + (props.memory[num] === undefined ? "unset" : "set")} onClick={() => handleCellClick(num)}>{props.memory[num] === undefined ? "00" : props.memory[num].toString(16).padStart(2, "0")}</td>
                            <td className={"memory-value " + (props.memory[num + 1] === undefined ? "unset" : "set")} onClick={() => handleCellClick(num + 1)}>{props.memory[num + 1] === undefined ? "00" : props.memory[num + 1].toString(16).padStart(2, "0")}</td>
                            <td className={"memory-value " + (props.memory[num + 2] === undefined ? "unset" : "set")} onClick={() => handleCellClick(num + 2)}>{props.memory[num + 2] === undefined ? "00" : props.memory[num + 2].toString(16).padStart(2, "0")}</td>
                            <td className={"memory-value " + (props.memory[num + 3] === undefined ? "unset" : "set")} onClick={() => handleCellClick(num + 3)}>{props.memory[num + 3] === undefined ? "00" : props.memory[num + 3].toString(16).padStart(2, "0")}</td>
                        </tr>
                    ))}

                    </tbody>
                </table>

                <hr style={{width: "100px"}}/>

                {selectedCell !== -1 &&  
                    <div className="translation">
                        <p>- #{selectedCell.toString(16).padStart(2, "0")} - </p>
                        <p>
                            Decimal: {props.memory[selectedCell] === undefined ? "00" : props.memory[selectedCell]} <br />
                            Hex: {props.memory[selectedCell] === undefined ? "00" : props.memory[selectedCell].toString(16).padStart(2, "0")} <br /> 
                        Binary: {props.memory[selectedCell] === undefined ? "00" : props.memory[selectedCell].toString(2).padStart(8, "0")} <br /></p>

                    </div>
            }
            </div>
        </div>
    );
};