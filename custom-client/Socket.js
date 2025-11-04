export class Socket {
  static instance;
  constructor(url) {
    if (Socket.instance) return Socket.instance;
    this.ws = null;
    this.url = url || `wss://${location.host}/`;
    this.status = null;
    Socket.instance = this;
  }
  
}
