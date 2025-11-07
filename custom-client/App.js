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
      this.s?.o('o', () => N.s('Connected!'));
      this.s?.o('e', () => N.s('Error!'));
      this.s?.o('c', () => N.s('Disconnect!'));
      this.s?.e('Hello Server!');
    } catch {
      N.s('Not open Websocket!');
    }
  }
  run() {
    if (this.s && this.s.s() !== 1) return N.s('Websocket chưa sẵn sàng');
    this.s?.o('m', (e) => N.s(e.data));
  }
}
const App = new App().run();
