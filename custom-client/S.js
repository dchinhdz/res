// Websocket
class S {
  constructor(u) {
    this.u = u || `wss://${location.host}/`;
    this.d = 1000;
    this.h = {o: [], c: [], m: [], e: []};
    this._C();
  }
  //connect
  _C() {
    if (this.w?.readyState < 2) return;
    this._c();
    this.w = new WebSocket(this.u);
    this.w.binaryType = "arraybuffer";
    this.w.onopen = () => {
      this.d = 1000;
      this.h.o.forEach(h => h());
    };
    this.w.onclose = () => {
      this.h.c.forEach(h => h());
      this._R();
    };
    this.w.onmessage = e => this.h.m.forEach(h => h(e));
    this.w.onerror = e => this.h.e.forEach(h => h(e));
  }
  //clean
  _c() {
    if (this.w) {
      this.w.onopen = this.w.onclose = this.w.onmessage = this.w.onerror = null;
      if (this.w.readyState === 1) this.w.close();
      this.w = null;
    }
  }
  //auto reconnect
  _R() {
    setTimeout(() => {
      this._C();
      this.d = Math.min(this.d * 2, 10000);
    }, this.d);
  }
  //=== o: on, e: emit, s: status, c: close ===
  o = (e, c) => this.h[e]?.push(c);
  e = (d) => this.w?.readyState === 1 && this.w.send(d);
  s = () => this.w?.readyState;
  c = () => this._c();
}
export const S = new S();
