export class Socket {
  static instance;
  static getInstance() {
    if (!Socket.instance) Socket.instance = new Socket();
    return Socket.instance;
  }
  constructor() {
    if (Socket.instance) return Socket.instance;
    this.ws = null;
    this.#open();
    Socket.instance = this;
  }
  #open () {
    if (this.ws && (this.ws.readyState === 0 || this.ws.readySate === 1)) return console.error('Error: Server is already');
    try {
      this.ws = new WebSocket(`wss://${location.host}/`);
      this.ws.onopen = () => console.log('Connected!');
      this.ws.onmessage = (e) => console.log(e.data); //welcome to...
      this.ws.onerror = (e) => console.error(`Error: ${e.target}`);
      this.ws.onclose = (e) => console.log(`Closed: [${e.code}] ${e.reason}`);
    } catch {
      console.error('Error: Not connect to Server');
    } finally {
      console.info('Server Connecting...');
    }
  }
  #clean () {
    if (!this.ws) return console.error('Not clean');
    this.ws.onopen = null;
    this.ws.onmessage = null;
    this.ws.onerror = null;
    this.ws.onclose = null;
    this.ws = null;
  }
  connect() {
    if (this.ws) return console.error('Error: WebSocket is open');
    if (this.ws.readState === 0 || this.ws.readyState === 1) return console.error('Error: Server is running');
    this.#open();
  }
  send(data) {
    if (!this.ws || this.ws.readyState !== 1) return console.error('Error: Cannot send');
    this.ws.send(data);
  }
  on(callback) {
    if (!this.ws) return console.error('Error: Cannot onMessage');
    this.ws.addEventListener("message", (e) => {
      console.log('Revice: ', e.data);
      if (callback) callback(e.data);
    });
  }
  close(code = 1000, message = "Server closed") {
    if (!this.ws) return console.error('Error: Cannot close');
    this.ws.close(code, message);
    this.#clean();
    console.log(`Closed: [${code}] ${message}`);
}
