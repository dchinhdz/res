export class Socket {
  constructor(url) {
    this.ws = null;
    this.delay = 1000;
    this.url = url || `wss://${location.host}/`;
    this.#open();
  }
  #open () {
    if (this.ws) return;
    this.#clean();
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";
    this.ws.onclose = () => this.#autoConnect();
  }
  #clean () {
    this.ws.onopen = this.ws.onmessage = this.ws.onerror = this.ws.onclose = null;
    this.ws = this.ws && (this.ws.close(), null);
  }
    
  #autoConnect() {
    setTimeout(() => {
        this.#open();
        this.delay = Math.min(this.delay * 2, 30000);
    }, this.delay);
  }
  close() {
    if (this.ws.readyState > 1) return;
    this.#clean();
  }
}
