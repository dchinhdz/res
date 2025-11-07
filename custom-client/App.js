import {S} from './S.js';
import {N} from './N.js';
class App {
  constructor() {
    this.u = "wss://websocket-echo.com";
    this._i();
  }
  _i() {
    try {
      this.s = new S(this.u);
      this.s.o('m', () => (e) => this._run(e.data));
      this.s.o('o', () => N.s('Connected!'));
      this.s.o('e', () => N.s('Error!'));
      this.s.o('c', () => N.s('Disconnect!'));
    } catch {
      N.s('Not open Websocket!');
    }
  }
  ping() {
    this.p = Date.now();
    this.s?.e(0);
  }
  _run(e) {
    if (e == "0") return N.s(Date.now() - this.p);
    return N.s(e);
  }
}
const app = new App();
setInterval(app.ping.bind(app), 5000);
