export class Emits {
  constructor(ws) {
    this.ws = ws;
  }
  _buffer(c, n) {
    const buffer = new ArrayBuffer(n);
    const q = new DataView(buffer);
    q.setUint8(0, c);//channel
    return q;
  }
  uMove(x, y) {
    const q = this._buffer(1,9);
    q.setFloat32(1, x, true);
    q.setFloat32(5, y, true);
    return q.buffer;
  }
  emit(...args) {
    this.ws.emit(...args);
  }
}
