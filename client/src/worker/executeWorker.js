import { executeNode } from '../nodes.js';

self.onmessage = (e) => {
  const { data } = e;
  if (data && data.type === 'execNode') {
    const { id, node, registers } = data;
    const result = executeNode(node, registers || []);
    self.postMessage({ type: 'nodeResult', id, payload: result });
  }
};
