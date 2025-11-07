export class Read {
  static channel(data) {
    if (Array.isArray(data)) return this.data[0];
    return this.data?.channel ?? null;
  }
  static userId(data) {
    if (Array.isArray(data)) return this.data[1];
    return this.data?.channel ?? null;
  }
  static move(data) {
    if (Array.isArray(data)) {
    return {userId: data[1],  map: data[2], x: data[3], y: data[4]};
    }
    return null;
  }
  static str(data) {
    if (Array.isArray(data)) return data[2] ?? null;
  }
  static cmd(data) {
    if (Array.isArray(data)) return data[2] ?? null;
  }
}
