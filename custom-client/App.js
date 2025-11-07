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
      this.s.o('m', () => (e) => N.s(e.data));
      this.s.o('o', () => N.s('Connected!'));
      this.s.o('e', () => N.s('Error!'));
      this.s.o('c', () => N.s('Disconnect!'));
    } catch {
      N.s('Not open Websocket!');
    }
  }
}
const app = new App();
