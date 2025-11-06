export class Act {
  static _emit(channel, bytes) {
    const buffer = new ArrayBuffer(2+bytes);
    const emit = new DataView(buffer);
    emit.setUint16(0, channel, true);//channel
    return emit;
  }
  static _on(data) {
    if (data.byteLength < 3) return null;
    let obj = {set: {}, on: new DataView(data)};
    obj.set = {channel: obj.on.getUint16(0, true), userId: obj.on.getUint16(2, true)};
    return obj;
  }
  //=== EMIT/SEND ===
  static move(map, x, y) {
    const emit = this._emit(1,9);
    emit.setUint8(2, Number(map));//id map
    emit.setFloat32(3, x, true);
    emit.setFloat32(7, y, true);
    return emit.buffer;
  }
  static cmd(channel, cmd) {
    const emit = this._emit(channel, 2);
    emit.setUint16(2, Number(cmd), true);//cmd-id
    return emit.buffer;
  }
  static str(channel, string) {
    const str = new TextEncoder().encode(string);
    const emit = this._emit(channel, str.length);
    emit.forEach((bytes, i) => emit.setUint8(2+i, bytes));
    return emit.buffer;
  }
  //=== TYPE CHECK ===
  static isObject(data) {
    try {
      return typeof data === "string" && !!(data = JSON.parse(data)) && data.constructor === Object;
    } catch {
      return false;
    }
  }
  static isBinary(data) {
    try {
      return data instanceof ArrayBuffer || ArrayBuffer.isView(data);
    } catch {
      return false;
    }
  }
  //=== CHANNEL CHECK ===
  static getChannel(data) {
    
  }
  //=== REVICE/ON ===
  static onMove(data) {
    let a = this._on(data);
    if (!a || a.g.channel !== 1) return null;
    a.g.mapId = a.q.getUint8(4);
    a.g.x = a.q.getFloat32(5, true);
    a.g.y = a.q.getFloat32(9, true);
    return a.g;
  }
  static onStr(data) {
    let a = this._on(data);
    if !a return null;
    const t = new Uint8Array(a.q.buffer.slice(4));
    a.g.str = new TextDecoder("utf-8").decode(t);
    return a.g;
  }
  static onCmd(data) {
    if (!(data instanceof ArrayBuffer)) return;
    let a = this._on(data);
    a.g.data = a.q.buffer.slice(4);
    return a.g;
  }
}
