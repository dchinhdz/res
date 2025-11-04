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
  }
  #clean () {
    this.ws.onopen = this.ws.onmessage = this.ws.onerror = this.ws.onclose = null;
    this.ws = this.ws && (this.ws.close(), null);
  }
    
  autoconnect() {
    const auto = setInterval(() => {
      if (this.ws.readyState < 2) {
        clearInterval(auto);
        this.delay = 1000;
      } else {
        this.#open();
        this.delay = this.delay <== 30000 ? this.delay * 2 : 30000;
      }
    }, this.delay);
  }
  close() {
    if (this.ws.readyState > 1) return;
    this.#clean();
  }
}
