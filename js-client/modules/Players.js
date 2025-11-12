export class P {
  static data = {};
  static start(data) {
    if (data === null || typeof data !== "object" || Array.isArray(data)) return this.data;
    this.data = data;
  }
}
  
