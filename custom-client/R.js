export class R {
  static s = (s) => JSON.stringify(s);
  static c = (c) => Array.isArray(c) ? c[0] : c?.channel ?? null;
  static u = (u) => Array.isArray(u) ? u[1] : u?.userId ?? null;
  static m = (m) => ({userId: m[1],  map: m[2], x: m[3], y: m[4]});
  static b = (b) => b[2] ?? null;
}
