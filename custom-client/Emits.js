export class Emits {
  constructor(socket) {
    this.ws = socket;
    this.channel = {attack: 1, buy: 2, sell: 3, drop: 4, use: 5};
    this.map = {g: 1};
  }
  _buffer(c, n) {
    const buffer = new ArrayBuffer(n+1);
    const q = new DataView(buffer);
    q.setUint8(0, c);//channel
    return q;
  }
  uMove(id, x, y) {
    if (!this.map[id]) return;
    const q = this._buffer(0,9);
    q.setUint8(1, this.map[id]);
    q.setFloat32(2, x, true);
    q.setFloat32(6, y, true);
    return q.buffer;
  }
  uAtc(c, id) {
    if (!this.channel[c]) return;
    const q = this._buffer(this.channel[c], 2);
    q.setUint16(1, id, true);
    return q.buffer;
  } 
  emit(...args) {
    this.ws.emit(...args);
  }
}
