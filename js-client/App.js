import {S} from './modules/Socket.js';
import {D} from './modules/Display.js';
import {A} from './modules/Action.js';
class App {
  constructor() {
    this.u = "wss://websocket-echo.com";
    this._i();
  }
  _i() {
    try {
      this.s = new S(this.u);
      this.s.o('m', (e) => this._main(e.data));
      this.s.o('o', () => this._run());
      this.s.o('e', () => this._err());
      this.s.o('c', () => this._dis());
    } catch {
      D.n('Not open Websocket!');
    }
  }
  
  p() {
    this.ping = setInterval(() => {
      this.n = performance.now();
      this.s?.e(A.p());
    }, 3000);
  }
  
  _main(e) {
    if (A.iB(e) && A.iP(e)) return D.p(Math.round(performance.now() - this.n));
    D.n(e);D.p(535);
  }
  _run() {
    D.n('Connected!');
    this.p();
  }
  _err() {
    D.n('Error!');
    clearInterval(this.ping);
    D.p(999);
  }
  _dis() {
    D.n('Disconnect!');
    clearInterval(this.ping);
    D.p(999);
  }
}
const app = new App();
