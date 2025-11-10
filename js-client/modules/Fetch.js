export class F {
  static async p(f) {
    try {
     const r = await fetch('/', {
       method: 'post',
       headers: {'Content-Type': 'application/json'},
       body: JSON.stringify(f),
       credentials: 'include'
     });
      return r.ok ? (await r.json().catch(() => false)) : false;
    } catch {return false};
  }
  static async g(f) {
    try {
      const r = await fetch(`/?${String(f)}`, {method: 'get'});
      return r.ok ? (await r.json().catch(() => false)) : false;
    } catch {return false};
  }
}
