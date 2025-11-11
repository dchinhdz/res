export class P {
  constructor() {
    this.cache = {};
    //this.layer = [];
    this.obj = {item: [], draw: [], root: 0};
    this.c = {rW:0,rH:0,mW:0,mH:0,u:0,d:0,l:0,r:0};
  }
  async run() {
    this._data();
    await this._loadRoot();
    await this._loadCacheItem();
    this._renderItemDraw();
    return this._main();
  }
  _data() {
    const data = [102,
                  [41, -18, 10710, 10711, 10712],
                  [-15, 45, 10728, 10729],
                  [-28, 0, 5900, 5901],
                  [9, 46, 201],
                  [5, 34, 193],
                  [0, 0, 102],
                  [12, 15, 174],
                  [-5, -16, 9351],
                  [21, 25, 155],
                  [30, 34, 115, 116, 117],
                  [-86, 0, 10725, 10726]];
    if (!Array.isArray(data) || data.length < 2) return;
    if (data[0]) this.obj.root = data[0];
    const draw = data.slice(1).map(i => ({x:i[0], y:i[1]}));
    if (draw.length) for(const [k, v] of draw.entries()) {
      const d = data[k+1];
      if (!Array.isArray(d) || d.length < 3) continue;             
      this.obj.draw.push(v);
      this.obj.item.push(d.slice(2));
    };
  }

  async _loadRoot() {
    const f = await this.f(this.obj.root);
    if (!f) return;
    this.c.rW = f.naturalWidth;
    this.c.rH = f.naturalHeight;
  }
  async _loadCacheItem() {
    if (!this.obj.item.length) return;
    for (const i of this.obj.item.flat()) {
      this.cache[i] = await this.f(i);
    }
  }
  _renderItemLayer(arr) {
    if (!arr || !arr.length) return null;
    const maxW = Math.max(...arr.map(i => this.cache[i].naturalWidth || 0));
    const maxH = Math.max(...arr.map(i => this.cache[i].naturalHeight || 0));
    const canvas = document.createElement('canvas');
    canvas.width = maxW; canvas.height = maxH;
    const ctx = canvas.getContext('2d');
    if (arr.length === 1) {
      const layer = this.cache[arr[i]];
      ctx.drawImage(layer, 0, 0, layer.naturalWidth, layer.naturalHeight);
      return canvas;
    }
    const fps = 1000 / arr.length;
    let i = 0, last = 0;
    const animate = (now) => {
      requestAnimationFrame(animate);
      if (now - last < fps) return;
      last = now;
      ctx.clearRect(0, 0, maxW, maxH);
      const layer = this.cache[arr[i]];
      ctx.drawImage(layer, 0, 0, layer.naturalWidth, layer.naturalHeight);
      i = (i + 1) % arr.length;
      };
    requestAnimationFrame(animate);
    return canvas;
  }
  _renderItemDraw() {
    if (!this.obj.item.length || !this.obj.draw.length ||  !Object.keys(this.cache).length) return;
    this.obj.item.forEach((l, k) => {
      l.forEach(i => {
        if (!this.cache[i]) return;
        this.c.mW = Math.max(this.c.mW, this.cache[i].naturalWidth);
        this.c.mH = Math.max(this.c.mH, this.cache[i].naturalHeight);
        // tính toán phần dư
        const {x, y} = this.obj.draw[k];
        if (y < 0) this.c.u = Math.max(this.c.u, -y);
        if (y > 0) this.c.d = Math.max(this.c.d, y);
        if (x < 0) this.c.l = Math.max(this.c.l, -x);
        if (x > 0) this.c.r = Math.max(this.c.r, x);
      });
    });
    this.c.mW = Math.max(this.c.mW, (this.c.rW + this.c.l + this.c.r));
    this.c.mH = Math.max(this.c.mH, (this.c.rH + this.c.u + this.c.d));
  }
  _main() {
    if (!this.obj.root || !this.obj.item.length || !this.obj.draw.length ||  !Object.keys(this.cache).length) return;
    /*
    for (const i of this.obj.item) {
      this.layer.push(this._renderItemLayer(i));
    }*/
    const canvas = document.createElement('canvas');
    canvas.width = this.c.mW; canvas.height = this.c.mH;
    const ctx = canvas.getContext('2d');
    if (this.obj.item.length !== this.obj.draw.length) return canvas;
    for (const [k, v] of this.obj.draw.entries()) {
      const layer = this._renderItemLayer(this.obj.item[k]);
      const pixelX = this.c.l + v.x;
      const pixelY = this.c.u + v.y;
      if (v.x < 0) pixelX = this.c.l + v.x
      ctx.drawImage(layer, pixelX, pixelY, layer.width, layer.height);
    }
    return canvas;
  }
  //f = (i) => Object.assign(new Image(), { src: `/img/item/hd/${i}.png` });
  f(i) {
    return new Promise(r => {
      const k = new Image();
      k.src = `/img/item/hd/${i}.png`;
      k.onload = () => r(k);
      k.onerror = () => r(null);
    });
  }
}
