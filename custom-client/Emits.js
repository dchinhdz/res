export class Emits {
  constructor(socket) {
    this.ws = socket;
    this.u = {move: 1, attack: 2, buy: 3, sell: 4, drop: 5};
  }
  _buffer(c, n) {
    const buffer = new ArrayBuffer(n+1);
    const q = new DataView(buffer);
    q.setUint8(0, c);//channel
    return q;
  }
  uMove(x, y) {
    const q = this._buffer(this.u.move,8);
    q.setFloat32(1, x, true);
    q.setFloat32(5, y, true);
    return q.buffer;
  }
  uAct(c, id) {
    if (!this.u[c]) return;
    const q = this._buffer(this.u[c], 2);
    q.setUint16(1, id, true);
    return q.buffer;
  } 
  emit(...args) {
    this.ws.emit(...args);
  }
}
