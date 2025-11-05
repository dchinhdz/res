export class Socket {
  constructor(url) {
    this.url = url || `wss://${location.host}/`;
    this.delay = 1000;
    this.handlers = { open: [], close: [], message: [], error: [] };
    this.#connect();
  }

  #connect() {
    if (this.ws?.readyState < 2) return;
    this.#cleanup();
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = () => {
      this.delay = 1000;
      this.handlers.open.forEach(h => h());
    };
    this.ws.onclose = () => {
      this.handlers.close.forEach(h => h());
      this.#reconnect();
    };
    this.ws.onmessage = e => this.handlers.message.forEach(h => h(e));
    this.ws.onerror = e => this.handlers.error.forEach(h => h(e));
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
      this.delay = Math.min(this.delay * 2, 10000);
    }, this.delay);
  }

  on(event, cb) {
    if (this.handlers[event]) this.handlers[event].push(cb);
  }

  emit(data) {
    this.ws?.readyState === 1 && this.ws.send(data);
  }

  close() {
    this.#cleanup();
  }
}
