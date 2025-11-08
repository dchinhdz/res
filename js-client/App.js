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
      this.s.o('c', () => D.n('Disconnect!'));
    } catch {
      D.n('Not open Websocket!');
    }
  }
  ping() {
    if (this.s?.s !== 1) return; 
    this.p = performance.now();
    this.s.e(A.p());
  }
  _run(e) {
    if (this.s?.s === 1 && A.iB(e) && A.iP(e)) return D.p(Math.round(performance.now() - this.p));
    if (this.s?.s !== 1) return D.p(999);
    D.n(e);
  }
}
const app = new App();
setInterval(app.ping.bind(app), 5000);
