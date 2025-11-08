export class L {
  static s = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  static g = (k) => JSON.parse(localStorage.getItem(k) || null);
  static r = (k) => localStorage.removeItem(k);
  static c = () => localStorage.clear();
}
