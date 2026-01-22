import "./Console.css";

export const Console = (props) => {
    


    return (
        <div className="console-container">

            <h2>Console</h2>
            <div className="console-output">
                {props.lines.slice().reverse().map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>            
        </div>
    );
};