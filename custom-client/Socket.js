export class Socket {
  #ws; #url; #cb; #d = 1e3; #t;
  constructor(u = `wss://${location.host}/`, log = console.log) {
    if (!window.WebSocket) throw new Error("No WebSocket");
    this.#url = u; this.#log = log; this.#open();
  }
  #log = () => {};
  #open() {
    this.#ws?.readyState < 2 || (this.#ws?.close(), this.#ws = null);
    try {
      this.#ws = new WebSocket(this.#url);
      this.#ws.binaryType = "arraybuffer";
      this.#ws.onopen = () => (this.#d = 1e3, this.#log("[OPEN]", this.#url));
      this.#ws.onmessage = e => this.#cb?.(e.data);
      this.#ws.onerror = () => this.#log("[ERR]", "connect");
      this.#ws.onclose = () => {
        this.#ws = null; this.#log("[CLOSE]"); clearTimeout(this.#t);
        this.#log("[RECONNECT]", `${this.#d}ms`);
        this.#t = setTimeout(() => this.#open(), this.#d);
        this.#d = Math.min(this.#d * 2, 1e4);
      };
    } catch { this.#log("[INIT FAIL]"); }
  }
  send(d) { this.#ws?.readyState === 1 && this.#ws.send(typeof d === "string" ? d : JSON.stringify(d)); }
  on(c) { this.#cb = c; }
  close() { this.#ws?.close(1000); clearTimeout(this.#t); }
}
