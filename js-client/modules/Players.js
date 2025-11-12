export class P {
  static data = {};
  static canvas = {};
  static cacheItem = {};
  static ready = false;
  static async start(d) {
    if (!d || !d.map || !d.player) return this.canvas;
    if (!Object.keys(d.map).length || !Array.isArray(d.player)) return this.canvas;
    try {
      this.data = d;
      await this.loadCacheItem();
      this.ready = true;
      return true;
    } catch {
      return this.data;
    }
  }
  static addPlayer(d) {
    if (!this.ready || !d || !d.info || d.info.userId == null) return null;
    const e = this.data.player.some((p) => p.info && p.info.userId === d.info.userId);
    if (!e) this.data.player.push(d);
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
        return;
      }
    }
    this.data.player.push({
      info: Object.assign({}, d.info),
      draw: d.draw || [],
      move: d.move || [0, 0]
    });
  }
  static removePlayer(userId) {
    if (!this.ready) return null;
    this.data.player = this.data.player.filter((p) => !(p.info && p.info.userId === userId);
  }
  //Phần xử lý canvas
  drawCanvas() {
  }
  //Phần xử lý cache Image
  async loadCacheItem() {
    if (d === null || typeof d !== "object" || !d.player) return null;
    const l = await Prosime.all();
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
