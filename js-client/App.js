import {S} from './_modules/Socket.js';
import {D} from './_modules/Display.js';
import {A} from './_modules/Action.js';
class App {
  constructor() {
    this.u = "wss://websocket-echo.com";
    this._i();
  }
  _i() {
    try {
      this.s = new S(this.u);
      this.s.o('m', (e) => this._run(e.data));
      this.s.o('o', () => D.n('Connected!'));
      this.s.o('e', () => D.n('Error!'));
      this.s.o('c', () => D.n('Disconnect!'));
    } catch {
      N.s('Not open Websocket!');
    }
  }
  ping() {
    this.p = performance.now();
    this.s?.e(A.p());
  }
  _run(e) {
    if (A.iB(e) && A.iP(e)) {
      const ms = (performance.now() - this.p).toString().split('.')[1] || '0';
      return D.n(parseInt(ms.slice(-3), 10));
    }
    D.n(e);
  }
}
const app = new App();
setInterval(app.ping.bind(app), 5000);
