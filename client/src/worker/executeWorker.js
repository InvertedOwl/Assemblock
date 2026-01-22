import { nodes } from '../nodes.js';

self.onmessage = (e) => {
  const { data } = e;
  if (data && data.type === 'execNode') {
    const { id, node, registers } = data;
    const def = nodes.find(n => n.title === node.title);
    let result = { updates: [], consoleLines: [], jump: false };
    if (def && typeof def.callback === 'function') {
      // call callback with params as values; callbacks return full result when no setRegister/addToConsole provided
      try {
        const res = def.callback(node.params || [], registers || []);
        if (res) result = res;
      } catch (err) {
        // swallow and return default result
        result = { updates: [], consoleLines: [], jump: false };
      }
    }
    self.postMessage({ type: 'nodeResult', id, payload: result });
  }
};
