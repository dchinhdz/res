export class Socket {
  constructor(url) {
    this.u = url || `wss://${location.host}/`;
    this.d = 1000;
    this.h = { o: [], c: [], m: [], e: [] };
    this.#connect();
  }

  #connect() {
    if (this.ws?.readyState < 2) return;
    this.#cleanup();
    this.ws = new WebSocket(this.u);
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = () => {
      this.d = 1000;
      this.h.o.forEach(h => h());
    };
    this.ws.onclose = () => {
      this.h.c.forEach(h => h());
      this.#reconnect();
    };
    this.ws.onmessage = e => this.h.m.forEach(h => h(e));
    this.ws.onerror = e => this.h.e.forEach(h => h(e));
  }

  #cleanup() {
    if (this.ws) {
      this.ws.onopen = this.ws.onclose = this.ws.onmessage = this.ws.onerror = null;
      if (this.ws.readyState < 2) this.ws.close();
      this.ws = null;
    }
  }

  #reconnect() {
    setTimeout(() => {
      this.#connect();
      this.d = Math.min(this.d * 2, 10000);
    }, this.d);
  }

  on(e, c) {
    if (this.h[e]) this.h[e].push(c);
  }

  emit(e) {
    this.ws?.readyState === 1 && this.ws.send(e);
  }

  close() {
    this.#cleanup();
  }
}
