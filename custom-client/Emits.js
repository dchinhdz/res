export class Emits {
  constructor(socket) {
    this.ws = socket;
  }
  _buffer(c, n) {
    const buffer = new ArrayBuffer(n+1);
    const q = new DataView(buffer);
    q.setUint8(0, c);//channel
    return q;
  }
  uMove(x, y) {
    const q = this._buffer(1,8);
    q.setFloat32(1, x, true);
    q.setFloat32(5, y, true);
    return q.buffer;
  }
  uAttack(id) {
    return Number(id);
  }
  mBuy(id) {
    return Number(id);
  }
  mSell(id) {
    return Number(id);
  }
  mDrop(id) {
    return Number(id);
  }
  
  emit(...args) {
    this.ws.emit(...args);
  }
}
