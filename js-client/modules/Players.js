export class P {
  static data = {};
  static cacheImage = {};
  static start(d) {
    if (d === null || typeof d !== "object" || Array.isArray(d)) return this.data;
    if (!Object.keys(d).length || !d.map || !d.player) return this.data;
    this.data = d;
    return true;
  }
  static update(d) {
    if (d === null || typeof d !== "object" || !d.player) return null;
    this.data = Object.assign(this.data, d);
  }
  addPlayer() {
  }
  removePlayer() {
  }
  movePlayer() {
  }
  drawCanvas() {
  }
}
