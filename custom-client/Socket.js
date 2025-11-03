export class Socket {
  static #i;
  static get() { return Socket.#i || (Socket.#i = new Socket()); }

  #ws; #url; #cb; #d = 1e3; #t;

  constructor(u = `wss://${location.host}/`) {
    if (Socket.#i) throw 0;
    this.#url = u;
    this.#open();
    Socket.#i = this;
  }

  #open() {
    if (this.#ws?.readyState < 2) return;
    this.#ws = new WebSocket(this.#url);
    this.#ws.binaryType = "arraybuffer";

    this.#ws.onopen = () => this.#d = 1e3;
    this.#ws.onmessage = e => this.#cb?.(e.data);
    this.#ws.onclose = () => {
      this.#ws = null;
      clearTimeout(this.#t);
      this.#t = setTimeout(() => this.#open(), this.#d);
      this.#d = Math.min(this.#d * 2, 1e4);
    };
  }

  send(d) { this.#ws?.readyState === 1 && this.#ws.send(typeof d === "string" ? d : JSON.stringify(d)); }
  on(c) { this.#cb = c; }
  close() { this.#ws?.close(1e3); clearTimeout(this.#t); }
}
