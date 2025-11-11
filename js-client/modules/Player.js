export class P {
  constructor() {
    this.cache = {};
    this.layer = [];
    this.obj = {item: [], draw: [], root: 0};
    this.c = {rW:0,rH:0,mW:0,mH:0,u:[],d:[],l:[],r:[]};
  }
  async run() {
    this._data();
    await this._loadRoot();
    await this._loadCacheItem();
    this._renderItemDraw();
    this._main();
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
    if (draw.length) draw.forEach((v, k) => {
      if (!Array.isArray(data[k+1]) || data[k+1].length < 3) return;             
      this.obj.draw.push(v);
      this.obj.item.push(data[k+1].slice(2));
    });
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
    const fps = 1000 / 5;
    let i = 0, last = 0;
    const canvas = document.createElement('canvas');
    canvas.width = maxW; canvas.height = maxH;
    const ctx = canvas.getContext('2d');
    const animate = (now) => {
      requestAnimationFrame(animate);
      if (now - last < fps) return;
      last = now;
      ctx.clearRect(0, 0, maxW, maxH);
      const layer = this.cache[arr[i]];
      if (layer) ctx.drawImage(layer, 0, 0, layer.naturalWidth, layer.naturalHeight);
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
        if (y < 0) this.c.u.push(-y);
        if (y > 0) this.c.d.push(y);
        if (x < 0) this.c.l.push(-x);
        if (x > 0) this.c.r.push(x);
      });
    });
    this.c.mW = Math.max(this.c.mW, (this.c.rW + Math.max(0,...this.c.l) + Math.max(0,...this.c.r)));
    this.c.mH = Math.max(this.c.mH, (this.c.rH + Math.max(0,...this.c.u) + Math.max(0,...this.c.d)));
  }
  _main() {
    if (!this.obj.root || !this.obj.item.length || !this.obj.draw.length ||  !Object.keys(this.cache).length) return;
    //code xử lý chính
    for (const i of this.obj.item) {
      this.layer.push(this._renderItemLayer(i));
    }
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
