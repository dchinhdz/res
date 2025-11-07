export class R {
  static s = (r) => JSON.stringify(r);
  static p = (r) => JSON.parse(r);
  static c = (r) => Array.isArray(r) ? r[0] : r?.channel ?? null;
  static u = (r) => Array.isArray(r) ? r[1] : r?.userId ?? null;
  static m = (r) => ({userId: r[1],  map: r[2], x: r[3], y: r[4]});
  static b = (r) => r[2] ?? null;
}
