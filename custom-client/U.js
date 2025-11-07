export class U {
  static u = (u) => /^[a-zA-Z0-9]{4,20}$/.test(String(u));
  static p = (p) => /^.{6,16}$/.test(String(p));
  static e = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).toLowerCase());
  static P = (p) => /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/.test(String(p));
  static c = (c) => /^.{1,200}$/.test(String(c));
}
