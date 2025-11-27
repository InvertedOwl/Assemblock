/* https://coolors.co/palette/ef476f-ffd166-06d6a0-118ab2-073b4c */
const color = {
    "start": "#06d6a0",
    "normal": "#f1c253ff",
    "label": "#ef476f"
};

const nodes = [
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

    // Special
    {"title": "Label", "text": "<param>", "params": [{"type": "text", "value": "name", "name": "labelname"}], "callback": () => {console.log('Node 3 callback')}, "type": "label", "color": color.label, "active": false},    
];

export { nodes, color };