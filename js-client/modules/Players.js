export class P {
  static data = {};
  static start(d) {
    if (d === null || typeof d !== "object" || Array.isArray(d)) return this.data;
    if (d.
    this.data = d;
    return true;
  }
}
