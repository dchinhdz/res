//Display to DOM class
export class D {
  static _q = (q) => document.querySelector(q);
  //notice
  static n(q, t) {
    this._q(q).textContent = `📢: ${String(t)}`;
  }
  //ping (ms)
  static p(q, t) {
    let m, p = Number(t);
    if (p >= 0 && p < 200) {
      m = `🟢 ${p} ms`;
    } else if(p < 500) {
      m = `🟡 ${p} ms`;
    } else {
      m = `🔴 ${p} ms`;
    }
    this._q(q).textContent = m;
  }
}
