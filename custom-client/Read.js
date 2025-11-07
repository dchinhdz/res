export class Read {
  constructor(data) {
    this.data = data || null;
  }
  _isArray() {
    return this.data && Array.isArray(this.data);
    
  }
  _isObject() {
    return this.data && typeof this.data === "object" && !Array.isArray(this.data);
  }
  channel() {
    if (this._isArray()) return this.data[0];
    if (this._isObject()) return this.data.channel;
    return null;
  }
  userId() {
    if (this._isArray()) return this.data[1];
    if (this._isObject()) return this.data.channel;
    return null;
  }
}
