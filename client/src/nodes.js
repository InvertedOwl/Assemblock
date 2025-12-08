/* https://coolors.co/palette/ef476f-ffd166-06d6a0-118ab2-073b4c */
const color = {
    "comment": "#adb5bd",
    "start": "#06d6a0",
    "normal": "#f1c253ff",
    "label": "#ef476f",
    "action": "#118AB2",
    "special": "#8B85C1"
};

const nodes = [
    // Comment
    {"title": "Comment", "text": "<param>", "params": [{"type": "text", "value": "This is a comment", "name": "comment", "width": 100}], "callback": () => {}, "type": "comment", "color": color.comment, "active": false},

    // Triggers
    {"title": "Start", "params": [], "callback": () => {}, "type": "start", "color": color.start, "active": false},

    // Register edit
    {"title": "AddI", "text": "$<param> = $<param> + <param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel", max: 1024}], "callback": 
    (params, registers, setRegister) => {
        console.log(params)
        setRegister(params[0], registers[params[1]] + params[2]);
    }, "type": "normal", "color": color.normal, "active": false}, 
    {"title": "Add", "text": "$<param> = $<param> + $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, setRegister) => {
        console.log(params)
        setRegister(params[0], registers[params[1]] + registers[params[2]]);
    }, "type": "normal", "color": color.normal, "active": false}, 
    {"title": "Subtract", "text": "$<param> = $<param> - $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, setRegister) => {
        console.log(params)
        setRegister(params[0], registers[params[1]] - registers[params[2]]);
    }, "type": "normal", "color": color.normal, "active": false}, 
    {"title": "Multiply", "text": "$<param> = $<param> x $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, setRegister) => {
        console.log(params)
        setRegister(params[0], registers[params[1]] * registers[params[2]]);
    }, "type": "normal", "color": color.normal, "active": false},
    {"title": "Divide", "text": "$<param> = $<param> / $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, setRegister) => {
        console.log(params)
        setRegister(params[0], registers[params[1]] / registers[params[2]]);
    }, "type": "normal", "color": color.normal, "active": false},
    

    // Jmps
    {"title": "Label", "text": "<param>", "params": [{"type": "text", "value": "name", "name": "labelname"}], "callback": () => {console.log('Node 3 callback')}, "type": "label", "color": color.label, "active": false},    
    {"title": "Jump", "text": "<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister) => {
        return true;
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if Less", "text": "<param> $<param> < $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister) => {
        return registers[params[1]] < registers[params[2]];
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if Greater", "text": "<param> $<param> != $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister) => {
        return registers[params[1]] > registers[params[2]];
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if Equal", "text": "<param> $<param> = $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister) => {
        return registers[params[1]] == registers[params[2]];
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if not Equal", "text": "<param> $<param> != $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister) => {
        return registers[params[1]] != registers[params[2]];
    }, "type": "jump", "color": color.label, "active": false},

    // Actions
    {"title": "Print I", "text": "<param>", "params": [{"type": "text", "value": "Hello, World!", "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        addToConsole(`${params[0]}`);
    }, "type": "action", "color": color.action, "active": false},
    {"title": "Print", "text": "$<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        addToConsole(registers[params[0]] + "");
    }, "type": "action", "color": color.action, "active": false},
];

export { nodes, color };