export class Socket {
  static instance;
  constructor() {
      if (Socket.instance) return Socket.instance;
      this.ws = new WebSocket(`wss://${window.location.host}/`);
      Socket.instance = this;
  }
  
}
