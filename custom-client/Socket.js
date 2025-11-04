export class Socket {
  constructor(url) {
    this.ws = null;
    this.delay = 1000;
    this.url = url || `wss://${location.host}/`;
    this.#open();
  }
  #open () {
    if (this.ws) return;
    this.ws = new WebSocket(this.url);
  }
  #clean () {
    this.ws.onopen = this.ws.onmessage = this.ws.onerror = this.ws.onclose = null;
    this.ws = this.ws && (this.ws.close(), null);
    this.delay = 1000;
  }
  autoconnect() {
    if (this.ws.readyState < 2) return;
    
}
