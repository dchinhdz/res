export class A {
  static _e(c, n) {
    const b = new ArrayBuffer(4+n);
    const e = new DataView(b);
    e.setUint16(0, c, true);//channel
    e.setUint16(2, 0, true);//userId
    return e;
  }
  static _o(a) {
    const g = new DataView(a);
    return {g, s: [g.getUint16(0, true)]};
  }
  //=== EMIT/SEND ===
  static m(a, x, y) {
    const e = this._e(1,9);
    e.setUint8(4, Number(a));//id map
    e.setFloat32(5, x, true);
    e.setFloat32(9, y, true);
    return e.buffer;
  }
  static c(c, a) {
    const e = this._e(c, 2);
    e.setUint16(4, Number(a), true);//cmd-id
    return e.buffer;
  }
  static s(c, a) {
    const s = new TextEncoder().encode(a);
    const e = this._e(c, s.length);
    for (let i=0;i<s.length;i++) {
      e.setUint8(4+i, s[i]);
    }
    return e.buffer;
  }
  //=== TYPE CHECK ===
  static iO(a) {
    if (typeof a !== "string") return false;
    try {
      const o = JSON.parse(a);
      return o && o.constructor === Object;
    } catch {
      return false;
    }
  }
  static iB(a) {
    try {
      return a instanceof ArrayBuffer || ArrayBuffer.isView(a);
    } catch {
      return false;
    }
  }
  //=== GET CHANNEL ===
  static gC(a) {
    if (a.byteLength < 4) return null;
    return this._o(a).set[0];
  }
  //=== REVICE/ON ===
  static M(a) {
    let o = this._o(a);
    o.s.push(o.g.getUint16(2, true));//userId
    o.s.push(o.g.getUint8(4));//mapId
    o.s.push(Math.round(o.g.getFloat32(5, true) * 100) / 100);//x
    o.s.push(Math.round(o.g.getFloat32(9, true) * 100) / 100);//y
    return o.s;
  }
  static S(a) {
    let o = this._o(a);
    o.s.push(o.g.getUint16(2, true));
    const s = new Uint8Array(o.g.buffer.slice(4));
    o.s.push(new TextDecoder("utf-8").decode(s));
    return o.s;
  }
  static C(a) {
    let o = this._o(a);
    o.s.push(o.g.getUint16(2, true));
    o.s.push(o.g.getUint16(4, true));
    return o.s;
  }
}
