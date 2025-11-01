export class WS {
  static pool = new Map();

  static get(url, opt = {}) {
    if (!this.pool.has(url)) this.pool.set(url, new WS(url, opt));
    return this.pool.get(url);
  }

  constructor(url, opt = {}) {
    this.url = url;
    this.protocols = opt.protocols;
    this.auto = opt.auto ?? false;
    this.max = opt.max ?? 5;
    this.delay = opt.delay ?? 1000;
    this.debug = opt.debug ?? false;
    this.events = {};
    this.onceEvents = {};
    this.retry = 0;
    this.manual = false;
    this.ws = null;
  }

  on(e, f) {
    (this.events[e] ??= new Set()).add(f);
  }

  off(e, f) {
    this.events[e]?.delete(f);
  }

  once(e, f) {
    (this.onceEvents[e] ??= new Set()).add(f);
  }

  emit(e, ...a) {
    if (this.debug) console.log(`[WS] ${e}`, ...a);
    this.events[e]?.forEach(fn => fn(...a));
    if (this.onceEvents[e]) {
      this.onceEvents[e].forEach(fn => fn(...a));
      delete this.onceEvents[e];
    }
  }

  connect() {
    if (this.ws && [0, 1].includes(this.ws.readyState)) return;
    this.manual = false;
    const ws = new WebSocket(this.url, this.protocols);
    ws.binaryType = "arraybuffer";
    ws.onopen = e => { this.retry = 0; this.emit("open", e); };
    ws.onerror = e => this.emit("error", e);
    ws.onclose = e => { this.emit("close", e); this.ws = null; if (!this.manual && this.auto) this.reconnect(); };
    ws.onmessage = e => this.handleMsg(e);
    this.ws = ws;
  }

  handleMsg(e) {
    let d = e.data;
    if (typeof d === "string") {
      try { d = JSON.parse(d); } catch {}
      this.emit("message", d, e);
    } else if (d instanceof Blob) {
      d.arrayBuffer().then(b => this.emit("message", b, e));
    } else {
      this.emit("message", d, e);
    }
  }

  disconnect(code = 1000, reason = "bye") {
    this.manual = true;
    this.ws?.close(code, reason);
    WS.pool.delete(this.url);
  }

  reconnect() {
    if (this.retry >= this.max) return;
    this.retry++;
    setTimeout(() => { if (!this.manual) this.connect(); }, this.delay * this.retry);
  }

  send(v) {
    this.ensure();
    if (typeof v === "string") this.ws.send(v);
    else if (v instanceof ArrayBuffer || ArrayBuffer.isView(v)) this.ws.send(this.toBuf(v));
    else this.ws.send(JSON.stringify(v));
  }

  sendTyped(t, d) {
    const T = {
      int8: Int8Array, uint8: Uint8Array, int16: Int16Array, uint16: Uint16Array,
      int32: Int32Array, uint32: Uint32Array, float32: Float32Array, float64: Float64Array,
      bigint64: BigInt64Array, biguint64: BigUint64Array
    }[t.toLowerCase()];
    if (!T) throw new Error("Bad type");
    if (typeof d === "number") d = new T(d);
    else if (Array.isArray(d)) {
      d = (T.BYTES_PER_ELEMENT === 8)
        ? new T(d.map(x => BigInt(x)))
        : new T(d);
    }
    this.send(d);
  }

  ensure() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
      throw new Error("WebSocket not open");
  }

  toBuf(v) {
    return ArrayBuffer.isView(v)
      ? v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength)
      : v;
  }
}
