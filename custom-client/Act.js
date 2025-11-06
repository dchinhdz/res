export class Act {
  static _buffer(c, n) {
    const buffer = new ArrayBuffer(n+2);
    const q = new DataView(buffer);
    q.setUint16(0, c, true);//channel
    return q;
  }
  static _instanceof(d) {
    if (!(d instanceof ArrayBuffer)) return;
    return new DataView(d); 
  }
  static _channel() {
    let a = {};
    return a.channel = q.getUint16(0, true);
  }
  static move(map, x, y) {
    const q = this._buffer(1,9);
    q.setUint8(2, Number(map));//id map
    q.setFloat32(3, x, true);
    q.setFloat32(7, y, true);
    return q.buffer;
  }
  static cmd(c, id) {
    const q = this._buffer(c, 2);
    q.setUint16(2, Number(id), true);//id
    return q.buffer;
  }
  static str(c, id,  str) {
    const t = new TextEncoder().encode(str);
    const q = this._buffer(c, t.length+2);
    q.setUint16(2, Number(id), true);
    for (let i=0;i<t.length;i++) {
      q.setUint8(i+2, t[i]);
    }
    return q.buffer;
  }
  static onMove(data) {
    if (this._instanceof(data)) reutrn;
    let arr = this._channal();
    arr.mapId = q.getUint8(2);
    arr.x = q.getFloat32(3, true);
    arr.y = q.getFloat32(7, true);
    arr.userId = q.getUint16(11, true);
    return arr;
  }
  static onStr(data) {
    if (this._instanceof(data)) return;
    let arr = this._channel();
    arr.userId = q.getUint16(2, true);
    const t = new Uint8Array(q.slice(4));
    arr.str = new TextDecoder("utf-8").decode(t);
    return arr;
  }
  static onCmd(data) {
    return;
  }
}
