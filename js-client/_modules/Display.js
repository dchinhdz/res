//Display to DOM class
export class D {
  _q = (q) => document.querySelector(q);
  //notice
  static n = (n) => alert(String(n));
  //ping (ms)
  static p = (p) => this.q(q);
}
