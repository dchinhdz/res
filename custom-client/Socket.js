// Socket.js (thêm 1 dòng)
export class Socket {
  #ws; #url; #cb; #d = 1e3; #t;
  constructor(u = `wss://${location.host}/`, log) {
    if (!window.WebSocket) throw new Error("No WebSocket");
    this.#url = u; this.#log = log; this.#open();
  }
  #log = () => {};
  #open() {
    if (this.#ws?.readyState < 2) return;
    this.#ws?.close(); this.#ws = null;
    this.#log("[CONNECTING]", this.#url);
    try {
      this.#ws = new WebSocket(this.#url);
      this.#ws.binaryType = "arraybuffer";
      this.#ws.onopen = () => (this.#d = 1e3, this.#log("[OPEN]", "Connected"));
      this.#ws.onmessage = e => this.#cb?.(e.data);
      this.#ws.onerror = () => this.#log("[ERROR]", "Connection failed");
      this.#ws.onclose = e => {
        this.#ws = null;
        this.#log("[DISCONNECTED]", `[${e.code}] ${e.reason||""}`);
        clearTimeout(this.#t);
        this.#log("[RECONNECT]", `${this.#d}ms`);
        this.#t = setTimeout(() => this.#open(), this.#d);
        this.#d = Math.min(this.#d * 2, 1e4);
        this._resetUI?.();  // ← GỌI RESET NÚT CONNECT
      };
    } catch { this.#log("[INIT FAIL]", "Cannot create"); }
  }
  send(d) { this.#ws?.readyState === 1 && this.#ws.send(typeof d === "string" ? d : JSON.stringify(d)); }
  on(c) { this.#cb = c; }
  close() { this.#ws?.close(1000); clearTimeout(this.#t); }
}
