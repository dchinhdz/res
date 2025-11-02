export class WS {
  static #pool = new Map();
  static #defaults = { max: 5, delay: 3000 };

  #url; #opt; #ws; #connected = false; #auto = false; #retry = 0; #events = new Map();

  constructor(url, opt = {}) {
    this.#url = url || `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/`;
    this.#opt = { ...WS.#defaults, ...opt };
    if (WS.#pool.has(this.#url)) return WS.#pool.get(this.#url);
    WS.#pool.set(this.#url, this);
  }

  #emit(e, ...a) { this.#events.get(e)?.forEach(f => f(...a)); }
  on(e, f) { (this.#events.has(e) ? this.#events.get(e) : this.#events.set(e, new Set()).get(e)).add(f); }
  #reset() { this.#ws = this.#connected = this.#auto = null; this.#retry = 0; }

  connect() {
    if (this.#connected || this.#ws?.readyState === 1) return this.#emit("error", new Error("Already connected"));
    this.#auto = false;

    try {
      const ws = this.#ws = new WebSocket(this.#url);
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        this.#connected = true;
        this.#retry = 0;
        this.#emit("open");
      };

      ws.onerror = e => this.#emit("error", e);
      ws.onclose = () => {
        const wasConnected = this.#connected;
        this.#ws = null;
        this.#connected = false;
        this.#emit("close");
        if (this.#auto && wasConnected) this.#reconnect();
      };
      ws.onmessage = e => this.#handle(e);
    } catch (err) {
      this.#emit("error", err);
      throw err;
    }
  }

  disconnect() {
    if (!this.#connected && (!this.#ws || this.#ws.readyState === 3)) return this.#emit("error", new Error("Not connected"));
    this.#auto = false;
    this.#ws?.close(1000);
    this.#reset();
    WS.#pool.delete(this.#url);
  }

  reconnect() { this.disconnect(); this.connect(); }

  autoconnect(delay = this.#opt.delay, max = this.#opt.max) {
    if (this.#connected || this.#ws?.readyState === 1) return this.#emit("error", new Error("Already connected"));
    this.#auto = true; this.#opt.delay = delay; this.#opt.max = max;
    this.#reconnect();
  }

  #reconnect = () => {
    if (this.#retry++ >= this.#opt.max) return this.#auto = false, this.#emit("reconnectfailed");
    setTimeout(() => this.connect(), this.#opt.delay * this.#retry);
  };

  #handle(e) {
    let d = e.data;
    if (typeof d === "string") try { d = JSON.parse(d); } catch {}
    else if (d instanceof Blob) return void d.arrayBuffer().then(b => this.#emit("message", b));
    this.#emit("message", d);
  }

  send(data) {
    if (!this.#connected) throw new Error("WebSocket not open");
    this.#ws.send(typeof data === "object" ? JSON.stringify(data) : String(data));
  }

  sendBytes(data) {
    if (!this.#connected) throw new Error("WebSocket not open");
    if (!(data instanceof ArrayBuffer) && !ArrayBuffer.isView(data)) throw new TypeError("sendBytes: ArrayBuffer or TypedArray required");
    const buf = data instanceof ArrayBuffer ? data : data.buffer;
    const off = data.byteOffset || 0;
    const len = data.byteLength || buf.byteLength;
    this.#ws.send(buf.slice(off, off + len));
  }
}
