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
      m = `🟢 <b style="color:green">${p} ms</b>`;
    } else if(p < 500) {
      m = `🟡 <b style="color:yellow">${p} ms</b>`;
    } else {
      m = `🔴 <b style="color:red">${p} ms</b>`;
    }
    this._q(q).textContent = m;
  }
}
