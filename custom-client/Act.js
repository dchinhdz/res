export class Act {
  static _buffer(c, n) {
    const buffer = new ArrayBuffer(n+2);
    const q = new DataView(buffer);
    q.setUint16(0, c, true);//channel
    return q;
  }
  static _bytes(d) {
    let a = {g: {}, q: {}};
    a.q = new DataView(d);
    a.g.channel = a.q.getUint16(0, true);
    a.g.userId = a.q.getUint16(2, true);
    return a;
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
    if (!(data instanceof ArrayBuffer)) reutrn;
    let a = this._bytes(data);
    a.g.mapId = q.getUint8(4);
    a.g.x = a.q.getFloat32(5, true);
    a.g.y = a.q.getFloat32(9, true);
    return a.g;
  }
  static onStr(data) {
    if (!(data instanceof ArrayBuffer)) reutrn;
    let a = this._bytes(data);
    const t = new Uint8Array(a.q.slice(4));
    a.g.str = new TextDecoder("utf-8").decode(t);
    return a.g;
  }
  static onCmd(data) {
    if (!(data instanceof ArrayBuffer)) reutrn;
    let a = this._bytes(data);
    a.g.data = a.q.slice(4);
    return a.g;
  }
}
