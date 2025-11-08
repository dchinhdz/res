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
      this.s.o('m', (e) => this._run(e.data));
      this.s.o('o', () => D.n('Connected!'));
      this.s.o('e', () => D.n('Error!'));
      this.s.o('c', () => this._dis());
    } catch {
      D.n('Not open Websocket!');
    }
  }
  ping() {
    this.p = performance.now();
    this.s?.e(A.p());
  }
  _run(e) {
    if (A.iB(e) && A.iP(e)) return D.p(Math.round(performance.now() - this.p));
    D.n(e);
  }
  _dis() {
    D.n('Disconnect!');
    D.q(999);
}
}
const app = new App();
setInterval(app.ping.bind(app), 5000);
