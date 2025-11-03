export class Socket {
  static instance;
  constructor() {
    if (Socket.instance) return Socket.instance;
    this.#open();
    Socket.instance = this;
  }
  #open () {
    try {
      this.ws = new WebSocket(`wss://${location.host}/`);
      this.ws.onopen = () => console.log('Connected!');
      this.ws.onmessage = (e) => console.log(e.message); //welcome to...
      this.ws.onerror = (e) => console.error(`Error: ${e.target}`);
      this.ws.onclose = (e) => console.log(`Closed: ${e.code} - ${e.reason}`);
    } catch {
    console.error('Error: Not Connect to Server');
    } finally {
      console.info('Server Connecting...');
    }
  }
}
