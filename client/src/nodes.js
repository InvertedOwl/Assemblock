/* https://coolors.co/palette/ef476f-ffd166-06d6a0-118ab2-073b4c */
const color = {
    "comment": "#adb5bd",
    "start": "#06d6a0",
    "normal": "#FFD166",
    "special": "#712F79",
    "label": "#ef476f",
    "action": "#118AB2",
};

const nodes = [
    // Comment
    {"title": "Comment", "text": "<param>", "params": [{"type": "text", "value": "This is a comment", "name": "comment", "width": 120}], "callback": () => {}, "type": "comment", "color": color.comment, "active": false},

    // Triggers
    {"title": "Start", "params": [], "callback": () => {}, "type": "start", "color": color.start, "active": false},

    {"title": "User Input", "text": "Input > $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}], "callback": () => {}, "type": "start", "color": color.start, "active": false},

    // Register edit
    {"title": "AddI", "text": "$<param> < $<param>+<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel", max: 32768}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const target = n(pvals[0]);
        const src = n(pvals[1]);
        const imm = n(pvals[2]);
        const updates = [{ reg: target, value: (registers && registers[src] || 0) + imm }];
        const consoleLines = [];
        const jump = false;
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump };
    }, "type": "normal", "color": color.normal, "active": false}, 
    {"title": "Add", "text": "$<param> < $<param> + $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const target = n(pvals[0]);
        const a = n(pvals[1]);
        const b = n(pvals[2]);
        const updates = [{ reg: target, value: (registers && registers[a] || 0) + (registers && registers[b] || 0) }];
        const consoleLines = [];
        const jump = false;
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump };
    }, "type": "normal", "color": color.normal, "active": false}, 
    {"title": "Subtract", "text": "$<param> < $<param> - $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const target = n(pvals[0]);
        const a = n(pvals[1]);
        const b = n(pvals[2]);
        const updates = [{ reg: target, value: (registers && registers[a] || 0) - (registers && registers[b] || 0) }];
        const consoleLines = [];
        const jump = false;
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump };
    }, "type": "normal", "color": color.normal, "active": false}, 
    {"title": "Multiply", "text": "$<param> < $<param> * $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const target = n(pvals[0]);
        const a = n(pvals[1]);
        const b = n(pvals[2]);
        const updates = [{ reg: target, value: (registers && registers[a] || 0) * (registers && registers[b] || 0) }];
        const consoleLines = [];
        const jump = false;
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump };
    }, "type": "normal", "color": color.normal, "active": false},
    {"title": "Divide", "text": "$<param> < $<param> / $<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const target = n(pvals[0]);
        const a = n(pvals[1]);
        const b = n(pvals[2]);
        const updates = [{ reg: target, value: (registers && (registers[b] || 0)) === 0 ? 0 : (registers && registers[a] || 0) / (registers && registers[b] || 0) }];
        const consoleLines = [];
        const jump = false;
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump };
    }, "type": "normal", "color": color.normal, "active": false},

        {"title": "LoadI", "text": "$<param> < [<param>]", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel", "max": "64"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const target = n(pvals[0]);
        const a = n(pvals[1]);
        const updates = [{ reg: target, value: memory[a] }];
        const consoleLines = [];
        const jump = false;
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump };
    }, "type": "normal", "color": color.normal, "active": false},

        {"title": "StoreI", "text": "$<param> > [<param>]", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel", "max": "64"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const target = n(pvals[0]);
        const a = n(pvals[1]);
        const updates = [{}];
        const memoryUpdates = [{ address: a, value: registers[target] || 0}];
        const consoleLines = [];
        const jump = false;
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        if (setMemory) memoryUpdates.forEach(m => setMemory(m.address, m.value));
        return (setRegister || addToConsole || setMemory) ? jump : { updates, consoleLines, jump, setMemory: memoryUpdates };
    }, "type": "normal", "color": color.normal, "active": false},

            {"title": "LoadD", "text": "$<param> < [$<param>]", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const target = n(pvals[0]);
        const a = n(pvals[1]);
        const val = registers && (registers[a] || 0);
        const updates = [{ reg: target, value: memory[val] }];
        const consoleLines = [];
        const jump = false;
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump };
    }, "type": "normal", "color": color.normal, "active": false},
                {"title": "StoreD", "text": "$<param> > [$<param>]", "params": [{"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": 0, "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const target = n(pvals[0]);
        const a = n(pvals[1]);
        const val = registers && (registers[a] || 0);
        const updates = [{ reg: target, value: memory[val] }];
        const consoleLines = [];
        const jump = false;
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump };
    }, "type": "normal", "color": color.normal, "active": false},
    

    // Jmps
    {"title": "Label", "text": "<param>", "params": [{"type": "text", "value": "name", "name": "labelname"}], "callback": () => {console.log('Node 3 callback')}, "type": "label", "color": color.label, "active": false},    
    {"title": "Jump", "text": "<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const updates = [];
        const consoleLines = [];
        const jump = true;
        const label = pvals[0];
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump, label };
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if Less", "text": "<param> $<param> < $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const a = n(pvals[1]);
        const b = n(pvals[2]);
        const jump = (registers && (registers[a] || 0)) < (registers && (registers[b] || 0));
        const label = pvals[0];
        const updates = [];
        const consoleLines = [];
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump, label };
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if Greater", "text": "<param> $<param> != $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const a = n(pvals[1]);
        const b = n(pvals[2]);
        const jump = (registers && (registers[a] || 0)) > (registers && (registers[b] || 0));
        const label = pvals[0];
        const updates = [];
        const consoleLines = [];
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump, label };
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if Equal", "text": "<param> $<param> = $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const a = n(pvals[1]);
        const b = n(pvals[2]);
        const jump = (registers && (registers[a] || 0)) == (registers && (registers[b] || 0));
        const label = pvals[0];
        const updates = [];
        const consoleLines = [];
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump, label };
    }, "type": "jump", "color": color.label, "active": false},
    {"title": "Jump if not Equal", "text": "<param> $<param> != $<param>", "params": [{"type": "text", "value": "name", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}, {"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const a = n(pvals[1]);
        const b = n(pvals[2]);
        const jump = (registers && (registers[a] || 0)) != (registers && (registers[b] || 0));
        const label = pvals[0];
        const updates = [];
        const consoleLines = [];
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump, label };
    }, "type": "jump", "color": color.label, "active": false},

    // Actions
    {"title": "Print I", "text": "<param>", "params": [{"type": "text", "value": "Hello, World!", "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const updates = [];
        const consoleLines = [`${pvals[0]}`];
        const jump = false;
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump };
    }, "type": "action", "color": color.action, "active": false},

    {"title": "Print", "text": "$<param>", "params": [{"type": "number", "value": "0", "name": "tolabel"}], "callback": 
    (params, registers, memory, setRegister, addToConsole, setMemory) => {
        const pvals = (params || []).map(p => (p && typeof p === 'object') ? p.value : p);
        const n = (v) => { const x = Number(v); return Number.isNaN(x) ? 0 : x };
        const a = n(pvals[1]);
        const updates = [];
        const consoleLines = [`${registers[a] || 0}`];
        const jump = false;
        if (addToConsole) consoleLines.forEach(l => addToConsole(l));
        if (setRegister) updates.forEach(u => setRegister(u.reg, u.value));
        return (setRegister || addToConsole) ? jump : { updates, consoleLines, jump };
    }, "type": "action", "color": color.action, "active": false},
];
    

export { nodes, color };