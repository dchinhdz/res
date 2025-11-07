export class Read {
  static channel(data) {
    if (Array.isArray(data)) return data[0];
    return data?.channel ?? null;
  }
  static userId(data) {
    if (Array.isArray(data)) return data[1];
    return data?.userId ?? null;
  }
  static move(data) {
    return {userId: data[1],  map: data[2], x: data[3], y: data[4]};
  }
  static str(data) {
    return data[2] ?? null;
  }
  static cmd(data) {
    return data[2] ?? null;
  }
}
