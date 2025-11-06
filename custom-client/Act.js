export class Act {
  static _emit(c, n) {
    const a = new ArrayBuffer(4+n);
    const d = new DataView(a);
    d.setUint16(0, c, true);//channel
    return d;
  }
  static _on(d) {
    if (!(d instanceof ArrayBuffer) || d.byteLength < 4) return null;
    let a = {g: {}, q: new DataView(d)};
    a.g = {channel: a.q.getUint16(0, true), userId: a.q.getUint16(2, true)};
    return a;
  }
  //=== EMIT/SEND ===
  static move(map, x, y) {
    const q = this._emit(1,9);
    q.setUint8(4, Number(map));//id map
    q.setFloat32(5, x, true);
    q.setFloat32(9, y, true);
    return q.buffer;
  }
  static cmd(c, id) {
    const q = this._emit(c, 2);
    q.setUint16(4, Number(id), true);//id
    return q.buffer;
  }
  //=== TYPE CHECK ===
  static isObject(v) {
    try {
      return typeof v === "string" && !!(v = JSON.parse(v)) && v.constructor === Object;
    } catch {
      return false;
    }
  }
  static isBinary(v) {
    try {
      return v instanceof ArrayBuffer || ArrayBuffer.isView(v);
    } catch {
      return false;
    }
  }
  //=== REVICE/ON ===
  static str(c, id,  str) {
    const t = new TextEncoder().encode(str);
    const q = this._buffer(c, t.length+2);
    q.setUint16(4, Number(id), true);
    t.forEach((b, i) => q.setUint8(6 + i, b));
    return q.buffer;
  }
  static onMove(data) {
    let a = this._parse(data);
    if (!a || a.g.channel !== 1) return null;
    a.g.mapId = a.q.getUint8(4);
    a.g.x = a.q.getFloat32(5, true);
    a.g.y = a.q.getFloat32(9, true);
    return a.g;
  }
  static onStr(data) {
    let a = this._parse(data);
    if !a return null;
    const t = new Uint8Array(a.q.buffer.slice(4));
    a.g.str = new TextDecoder("utf-8").decode(t);
    return a.g;
  }
  static onCmd(data) {
    if (!(data instanceof ArrayBuffer)) return;
    let a = this._bytes(data);
    a.g.data = a.q.buffer.slice(4);
    return a.g;
  }
}
