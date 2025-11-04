export class Socket {
  constructor(url) {
    this.ws = null;
    this.url = url || `wss://${location.host}/`;
    this.#open;
  }
  #open () {
    if (this.ws) return;
    this.ws = new WebSocket(this.url);
  }
  #clean () {
    try {
      this.ws.close();
    } catch {
      this.ws.onopen = this.ws.onmessage = this.ws.onerror = this.onclose = null;
    }
}
