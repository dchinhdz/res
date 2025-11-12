export class P {
  static data = {};
  static canvas = {};
  static cache = {};
  static ready = false;
  static async start(d) {
    if (!d || !d.map || !d.player) return this.canvas;
    if (!Object.keys(d.map).length || !Array.isArray(d.player)) return this.canvas;
    try {
      this.data = d;
      await this.loadCacheItem();
      this.ready = true;
      return this.canvas;
    } catch {
      return this.canvas;
    }
  }
  static addPlayer(d) {
    if (!this.ready || !d || !d.info || d.info.userId == null) return null;
    const e = this.data.player.some((p) => p.info && p.info.userId === d.info.userId);
    if (!e) this.data.player.push(d);
    this.start(this.data);//restart
  }
  static updatePlayer(d) {
    if (!this.ready || !d || !d.info || d.info.userId == null) return null;
    const u = d.info.userId;
    for (let i=0;i<this.data.player.length;i++) {
      let p = this.data.player[i];
      if (p.info && p.info.userId === u) {
        this.data.player[i] = {
          info: Object.assign({}, p.info, d.info || {}),
          draw: d.draw || p.draw || [],
          move: d.move || p.move || [0, 0]
        };
        return this.start(this.data);
      }
    }
    this.data.player.push({
      info: Object.assign({}, d.info),
      draw: d.draw || [],
      move: d.move || [0, 0]
    });
    this.start(this.data);
  }
  static removePlayer(userId) {
    if (!this.ready) return null;
    this.data.player = this.data.player.filter((p) => !(p.info && p.info.userId === userId);
    this.start(this.data);
  }
  //Phần xử lý canvas
  drawCanvas() {
  }
  //Phần xử lý cache Image
  async loadCacheItem() {
    if (!this.data || !this.data.player || !Array.isArray(this.data.player)) return null;
    const g = [];
    this.data.player.forEach(p => {
      (p.draw || []).forEach(d => {
        if (!d || !Array.isArray(d.layer)) return null;
        (d.layer || []).forEach(i => {
          if ((typeof i === "string" || typeof i === "number") && !this.cache[i]) g.push(i);
        });
      });
    });
    const l = await Promise.all(g.map(async i => {
      const f = await this.f(i);
      if (f) this.cache[i] = f;
      return f;
    }));
    return l.filter(Boolean);
  }
  f(i) {
    return new Promise(r => {
      const k = new Image();
      k.src = `/img/item/hd/${i}.png`;
      k.onload = () => r(k);
      k.onerror = () => r(null);
    });
  }
}
