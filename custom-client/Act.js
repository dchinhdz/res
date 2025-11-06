export class Act {
  static _emit(channel, bytes) {
    const buffer = new ArrayBuffer(2+bytes);
    const emit = new DataView(buffer);
    emit.setUint16(0, channel, true);//channel
    return emit;
  }
  static _on(data) {
    const get = new DataView(data);
    return {get, set: {channel: get.getUint16(0, true)}};
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
    for (let i=0;i<str.length;i++) {
      emit.setUint8(2+i, str[i]);
    }
    return emit.buffer;
  }
  //=== TYPE CHECK ===
  static isObject(data) {
    if (typeof data !== "string") return false;
    try {
      const obj = JSON.parse(data);
      return obj && obj.constructor === Object;
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
  //=== GET CHANNEL ===
  static getChannel(data) {
    if (data.byteLength < 4) return null;
    return this._on(data).set.channel;
  }
  //=== REVICE/ON ===
  static onMove(data) {
    let on = this._on(data);
    on.set.userId = on.get.getUint16(2, true);
    on.set.mapId = on.get.getUint8(4);
    on.set.x = on.get.getFloat32(5, true);
    on.set.y = on.get.getFloat32(9, true);
    return on.set;
  }
  static onStr(data) {
    let on = this._on(data);
    on.set.userId = on.get.getUint16(2, true);
    const str = new Uint8Array(on.get.buffer.slice(4));
    on.set.text = new TextDecoder("utf-8").decode(str);
    return on.set;
  }
  static onCmd(data) {
    let on = this._on(data);
    on.set.userId = on.get.getUint16(2, true);
    on.set.data = on.get.buffer.slice(4);
    return on.set;
  }
  static onObj(data) {
    return JSON.parse(data);
  }
}
