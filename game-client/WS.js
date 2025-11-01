export class WS {
  static #pool = new Map();

  static get(url = null, opt = {}) {
    if (!window.WebSocket) throw new Error("WebSocket not supported");
    if (!url) {
      const p = location.protocol === "https:" ? "wss" : "ws";
      url = `${p}://${location.host}/`;
    }
    if (this.#pool.has(url)) return this.#pool.get(url);
    const instance = new WS(url, opt);
    this.#pool.set(url, instance);
    return instance;
  }

  #url; #opt; #ws = null; #connected = false; #auto = false; #retry = 0; #events = new Map();

  constructor(url, opt = {}) {
    this.#url = url;
    this.#opt = { max: opt.max ?? 5, delay: opt.delay ?? 3000 };
    if (!window.WebSocket) throw new Error("WebSocket not supported");
  }

  #emit(e, ...a) {
    this.#events.get(e)?.forEach(f => f(...a));
  }

  on(e, f) {
    if (!this.#events.has(e)) this.#events.set(e, new Set());
    this.#events.get(e).add(f);
  }

  #clear() {
    this.#ws = null;
    this.#connected = false;
    this.#auto = false;
    this.#retry = 0;
  }

  connect() {
    if (this.#connected || this.#ws?.readyState === WebSocket.OPEN) {
      this.#emit("error", new Error("Already connected"));
      return;
    }
    this.#auto = false;
    const ws = new WebSocket(this.#url);
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
      this.#connected = true;
      this.#retry = 0;
      this.#emit("open");
    };
    ws.onerror = e => this.#emit("error", e);
    ws.onclose = () => {
      this.#ws = null;
      this.#connected = false;
      this.#emit("close");
      if (this.#auto) this.#reconnect();
    };
    ws.onmessage = e => this.#handle(e);
    this.#ws = ws;
  }

  disconnect() {
    if (!this.#connected && (!this.#ws || this.#ws.readyState === WebSocket.CLOSED)) {
      this.#emit("error", new Error("Not connected"));
      return;
    }
    this.#auto = false;
    this.#ws?.close(1000);
    this.#clear();
    WS.#pool.delete(this.#url);
  }

  reconnect() {
    if (this.#connected) {
      this.disconnect();
    }
    this.connect();
  }

  autoconnect(delay = this.#opt.delay, max = this.#opt.max) {
    if (this.#connected || this.#ws?.readyState === WebSocket.OPEN) {
      this.#emit("error", new Error("Already connected"));
      return;
    }
    this.#auto = true;
    this.#opt.delay = delay;
    this.#opt.max = max;
    this.#reconnect();
  }

  #reconnect = () => {
    if (this.#retry >= this.#opt.max) {
      this.#auto = false;
      this.#emit("reconnectfailed");
      return;
    }
    this.#retry++;
    setTimeout(() => this.connect(), this.#opt.delay * this.#retry);
  };

  #handle(e) {
    let d = e.data;
    if (typeof d === "string") {
      try { d = JSON.parse(d); } catch {}
    } else if (d instanceof Blob) {
      d.arrayBuffer().then(b => this.#emit("message", b));
      return;
    }
    this.#emit("message", d);
  }

  send(data) {
    if (!this.#connected) throw new Error("WebSocket not open");
    if (typeof data === "string" || typeof data === "number")
      this.#ws.send(String(data));
    else if (Array.isArray(data) || (data && typeof data === "object"))
      this.#ws.send(JSON.stringify(data));
    else
      throw new TypeError("send() requires string, number, array, or object");
  }

  sendBytes(data) {
    if (!this.#connected) throw new Error("WebSocket not open");
    if (!(data instanceof ArrayBuffer) && !ArrayBuffer.isView(data))
      throw new TypeError("sendBytes() requires ArrayBuffer or TypedArray");

    let buffer, offset, length;
    if (data instanceof ArrayBuffer) {
      buffer = data;
      offset = 0;
      length = data.byteLength;
    } else {
      buffer = data.buffer;
      offset = data.byteOffset;
      length = data.byteLength;
    }
    this.#ws.send(buffer.slice(offset, offset + length));
  }
}
