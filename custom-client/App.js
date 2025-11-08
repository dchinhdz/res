import {S} from './S.js';
import {N} from './N.js';
import {A} from './A.js';
class App {
  constructor() {
    this.u = "wss://websocket-echo.com";
    this._i();
  }
  _i() {
    try {
      this.s = new S(this.u);
      this.s.o('m', (e) => this._run(e.data));
      this.s.o('o', () => N.s('Connected!'));
      this.s.o('e', () => N.s('Error!'));
      this.s.o('c', () => N.s('Disconnect!'));
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
      return N.s(parseInt(ms.slice(-3), 10));
    }
    N.s(e);
  }
}
const app = new App();
setInterval(app.ping.bind(app), 5000);
