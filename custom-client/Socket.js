export class Socket {
  constructor(url) {
    this.ws = null;
    this.delay = 1000;
    this.url = url || `wss://${location.host}/`;
    this.#open();
  }
  #open () {
    if (this.ws && this.readyState < 3) return;
    this.#clean();
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";
  }
  #clean () {
    this.ws = this.ws && (this.ws.close(), null);
  }
    
  autoConnect() {
    setTimeout(() => {
        this.#open();
        this.delay = Math.min(this.delay * 2, 30000);
    }, this.delay);
  }
  close() {
    if (!this.ws && this.ws.readyState > 1) return;
    this.#clean();
  }
  addEventListener(...args) {
    this.ws.addEventListener(...args);
  }
  on(event, callback) {
    this.ws["on"+event] = callback;
  }
}
