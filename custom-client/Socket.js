export class Socket {
  constructor(url) {
    this.ws = null;
    this.delay = 1000;
    this.url = url || `wss://${location.host}/`;
    this.#open();
  }
  #open () {
    if (this.ws && this.ws.readyState < 2) return;
    this.#clean();
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";
    this.on("open", () => this.delay = 1000);
    this.on("close", () => this.autoConnect());
  }
  #clean () {
    if (this.ws && this.ws.readyState < 2) this.ws.close();
    if (this.ws) this.ws = null;
  }
    
  autoConnect() {
    setTimeout(() => {
        this.#open();
        this.delay = Math.min(this.delay * 2, 10000);
    }, this.delay);
  }
  close() {
    this.#clean();
  }
  addEventListener(...args) {
    this.ws.addEventListener(...args);
  }
  on(event, callback) {
    this.ws["on"+event] = callback;
  }
  emit(data) {
    this.ws.send(data);
  }
}
