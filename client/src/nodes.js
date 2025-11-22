const color = {
    "start": "#45CB85",
    "normal": "#57E2E5",
    "label": "#6A7FDB"
};

const nodes = [
    {"title": "Start", "params": [], "callback": () => {}, "type": "start", "color": color.start, "active": false},
    {"title": "Jump <param>", "params": [{"type": "text", "value": "label1", "name": "tolabel"}], "callback": () => {return true}, "type": "jump", "color": color.normal, "active": false},
    {"title": "Label <param>", "params": [{"type": "text", "value": "label1", "name": "labelname"}], "callback": () => {console.log('Node 3 callback')}, "type": "label", "color": color.label, "active": false}
];

export { nodes, color };