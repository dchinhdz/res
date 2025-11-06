export class Act {
  _buffer(c, n) {
    const buffer = new ArrayBuffer(n+1);
    const q = new DataView(buffer);
    q.setUint8(0, c);//channel
    return q;
  }
  move(map, x, y) {
    const q = this._buffer(1,9);
    q.setUint8(1, map);//id map
    q.setFloat32(2, x, true);
    q.setFloat32(6, y, true);
    return q.buffer;
  }
  cmd(c, id) {
    const q = this._buffer(c, 2);
    q.setUint16(1, id, true);//id
    return q.buffer;
  }
}
