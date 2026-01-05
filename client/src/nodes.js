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
    {"title": "AddI", "text": "$<param> = $<param> + <param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel", max: 32768}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'AddI', params }, registers || []);
        if (res.updates) res.updates.forEach(u => setRegister(u.reg, u.value));
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        return res.jump;
    }, "type": "normal", "color": color.normal, "active": false}, 
    {"title": "Add", "text": "$<param> = $<param> + $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'Add', params }, registers || []);
        if (res.updates) res.updates.forEach(u => setRegister(u.reg, u.value));
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        return res.jump;
    }, "type": "normal", "color": color.normal, "active": false}, 
    {"title": "Subtract", "text": "$<param> = $<param> - $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'Subtract', params }, registers || []);
        if (res.updates) res.updates.forEach(u => setRegister(u.reg, u.value));
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        return res.jump;
    }, "type": "normal", "color": color.normal, "active": false}, 
    {"title": "Multiply", "text": "$<param> = $<param> x $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'Multiply', params }, registers || []);
        if (res.updates) res.updates.forEach(u => setRegister(u.reg, u.value));
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        return res.jump;
    }, "type": "normal", "color": color.normal, "active": false},
    {"title": "Divide", "text": "$<param> = $<param> / $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'Divide', params }, registers || []);
        if (res.updates) res.updates.forEach(u => setRegister(u.reg, u.value));
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        return res.jump;
    }, "type": "normal", "color": color.normal, "active": false},
    

    // Jmps
    {"title": "Label", "text": "<param>", "params": [{"type": "text", "value": "name", "name": "labelname"}], "callback": () => {console.log('Node 3 callback')}, "type": "label", "color": color.label, "active": false},    
    {"title": "Jump", "text": "<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'Jump', params }, registers || []);
        if (res.updates) res.updates.forEach(u => setRegister && setRegister(u.reg, u.value));
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        return res.jump;
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if Less", "text": "<param> $<param> < $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'Jump if Less', params }, registers || []);
        if (res.updates) res.updates.forEach(u => setRegister && setRegister(u.reg, u.value));
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        return res.jump;
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if Greater", "text": "<param> $<param> != $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'Jump if Greater', params }, registers || []);
        if (res.updates) res.updates.forEach(u => setRegister && setRegister(u.reg, u.value));
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        return res.jump;
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if Equal", "text": "<param> $<param> = $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'Jump if Equal', params }, registers || []);
        if (res.updates) res.updates.forEach(u => setRegister && setRegister(u.reg, u.value));
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        return res.jump;
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if not Equal", "text": "<param> $<param> != $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'Jump if not Equal', params }, registers || []);
        if (res.updates) res.updates.forEach(u => setRegister && setRegister(u.reg, u.value));
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        return res.jump;
    }, "type": "jump", "color": color.label, "active": false},

    // Actions
    {"title": "Print I", "text": "<param>", "params": [{"type": "text", "value": "Hello, World!", "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'Print I', params }, registers || []);
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        if (res.updates) res.updates.forEach(u => setRegister && setRegister(u.reg, u.value));
        return res.jump;
    }, "type": "action", "color": color.action, "active": false},
    {"title": "Print", "text": "$<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, setRegister, addToConsole) => {
        const res = executeNode({ title: 'Print', params }, registers || []);
        if (res.consoleLines) res.consoleLines.forEach(l => addToConsole && addToConsole(l));
        if (res.updates) res.updates.forEach(u => setRegister && setRegister(u.reg, u.value));
        return res.jump;
    }, "type": "action", "color": color.action, "active": false},
];

export { nodes, color };

export function executeNode(node, registers) {
    const title = node.title;
    const params = (node.params || []).map(p => (p && typeof p === 'object') ? p.value : p);

    const updates = [];
    const consoleLines = [];
    let jump = false;
    let label = undefined;

    const num = (v) => {
        const n = Number(v);
        return Number.isNaN(n) ? 0 : n;
    };

    switch (title) {
        case 'AddI': {
            const target = num(params[0]);
            const src = num(params[1]);
            const imm = num(params[2]);
            updates.push({ reg: target, value: (registers[src] || 0) + imm });
            break;
        }
        case 'Add': {
            const target = num(params[0]);
            const a = num(params[1]);
            const b = num(params[2]);
            updates.push({ reg: target, value: (registers[a] || 0) + (registers[b] || 0) });
            break;
        }
        case 'Subtract': {
            const target = num(params[0]);
            const a = num(params[1]);
            const b = num(params[2]);
            updates.push({ reg: target, value: (registers[a] || 0) - (registers[b] || 0) });
            break;
        }
        case 'Multiply': {
            const target = num(params[0]);
            const a = num(params[1]);
            const b = num(params[2]);
            updates.push({ reg: target, value: (registers[a] || 0) * (registers[b] || 0) });
            break;
        }
        case 'Divide': {
            const target = num(params[0]);
            const a = num(params[1]);
            const b = num(params[2]);
            updates.push({ reg: target, value: (registers[b] || 0) === 0 ? 0 : (registers[a] || 0) / (registers[b] || 0) });
            break;
        }

        case 'Jump': {
            jump = true;
            label = params[0];
            break;
        }
        case 'Jump if Less': {
            const a = num(params[1]);
            const b = num(params[2]);
            jump = (registers[a] || 0) < (registers[b] || 0);
            label = params[0];
            break;
        }
        case 'Jump if Greater': {
            const a = num(params[1]);
            const b = num(params[2]);
            jump = (registers[a] || 0) > (registers[b] || 0);
            label = params[0];
            break;
        }
        case 'Jump if Equal': {
            const a = num(params[1]);
            const b = num(params[2]);
            jump = (registers[a] || 0) == (registers[b] || 0);
            label = params[0];
            break;
        }
        case 'Jump if not Equal': {
            const a = num(params[1]);
            const b = num(params[2]);
            jump = (registers[a] || 0) != (registers[b] || 0);
            label = params[0];
            break;
        }
        case 'Print I': {
            consoleLines.push(`${params[0]}`);
            break;
        }
        case 'Print': {
            const a = num(params[0]);
            consoleLines.push(`${registers[a] || 0}`);
            break;
        }
        default: {
            // comment/label/start and unknown nodes do nothing
            break;
        }
    }

    return { updates, consoleLines, jump, label };
}