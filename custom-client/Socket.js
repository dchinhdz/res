export class Socket {
  static instance;
  constructor() {
    this.ws = null;
    if (Socket.instance) return Socket.instance;
    this.#open();
    Socket.instance = this;
  }
  async #open () {
    try {
      this.ws = await new WebSocket(`wss://${location.host}/`);
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
  #clean () {
    if (!this.ws) return;
    this.ws.onopen = null;
    this.ws.onmessage = null;
    this.ws.onerror = null;
    this.ws.onclose = null;
    this.ws.close();
    this.ws = null;
  }
  async connect() {
    if (this.ws.readyState === 1) return console.error('Error: Server is running');
    await this.#clean();
    this.#open();
  }  
}
