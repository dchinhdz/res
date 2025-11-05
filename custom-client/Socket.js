// Socket.js
export class Socket {
  constructor(url) {
    this.u = url || `wss://${location.host}/`;
    this.d = 1000;
    this.h = { open: [], close: [], message: [], error: [] };
    this._connect();
  }

  _connect() {
    if (this.ws?.readyState < 2) return;
    this._cleanup();

    this.ws = new WebSocket(this.u);
    this.ws.binaryType = "arraybuffer";

    this.ws.onopen = () => {
      this.d = 1000;
      this.h.open.forEach(h => h());
    };
    this.ws.onclose = () => {
      this.h.close.forEach(h => h());
      this._reconnect();
    };
    this.ws.onmessage = e => this.h.message.forEach(h => h(e));
    this.ws.onerror = e => this.h.error.forEach(h => h(e));
  }

  _cleanup() {
    if (this.ws) {
      this.ws.onopen = this.ws.onclose = this.ws.onmessage = this.ws.onerror = null;
      if (this.ws.readyState === 1) this.ws.close();
      this.ws = null;
    }
  }

  _reconnect() {
    setTimeout(() => {
      this._connect();
      this.d = Math.min(this.d * 2, 10000);
    }, this.d);
  }

  on(e, c) {
    if (this.h[e]) this.h[e].push(c);
  }

  emit(d) {
    this.ws?.readyState === 1 && this.ws.send(d);
  }

  close() {
    this._cleanup();
  }
}
