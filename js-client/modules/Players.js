export class P {
  static data = null;
  static canvas = {};
  static cache = {};
  static ready = false;

  static async start(d) {
    if (!d?.map || !Array.isArray(d.player)) return this.canvas;
    if (!Object.keys(d.map).length || !d.player.length) return this.canvas;

    this.data = structuredClone(d);
    await this.loadCacheItem();
    this.ready = true;
    this.drawCanvas();
    return this.canvas;
  }

  static addPlayer(p) {
    if (!this.ready || !p?.info?.userId) return null;
    if (this.data.player.some(x => x.info?.userId === p.info.userId)) return null;
    this.data.player.push(structuredClone(p));
    return this.start(this.data);
  }

  static updatePlayer(p) {
    if (!this.ready || !p?.info?.userId) return null;
    const id = p.info.userId;
    const idx = this.data.player.findIndex(x => x.info?.userId === id);
    if (idx === -1) {
      this.data.player.push(structuredClone(p));
    } else {
      this.data.player[idx] = {
        info: { ...this.data.player[idx].info, ...p.info },
        draw: p.draw ?? this.data.player[idx].draw ?? [],
        move: p.move ?? this.data.player[idx].move ?? [0, 0]
      };
    }
    return this.start(this.data);
  }

  static removePlayer(userId) {
    if (!this.ready || !userId) return null;
    this.data.player = this.data.player.filter(p => p.info?.userId !== userId);
    return this.start(this.data);
  }

  static drawCanvas() {
    // implement drawing logic here
  }

  static async loadCacheItem() {
    if (!this.data?.player?.length) return [];
    const toLoad = new Set();

    for (const p of this.data.player) {
      for (const d of p.draw ?? []) {
        for (const i of d.layer ?? []) {
          if ((typeof i === 'string' || typeof i === 'number') && !this.cache[i]) {
            toLoad.add(i);
          }
        }
      }
    }

    const results = await Promise.all(
      Array.from(toLoad, i => this.f(i).then(img => (img && (this.cache[i] = img), img)))
    );
    return results.filter(Boolean);
  }

  static f(i) {
    return new Promise(resolve => {
      if (i == null) return resolve(null);
      const img = new Image();
      img.src = `/img/item/hd/${i}.png`;
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
  }
}
