export class P {
  constructor() {
    this.cache = {};
    this.obj = {item: [], draw: [], root: 0};
    this.c = {rW:0,rH:0,mW:0,mH:0,u:[],d:[],l:[],r:[]};
  }
  async run() {
    this._data();
    await this._loadRoot();
    await this._loadCacheItem();
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
    const maxW = Math.max(...arr.map(i => this.cache[i].naturalWidth));
    const maxH = Math.max(...arr.map(i => this.cache[i].naturalHeight));
    const speed = 200;//ms
    const canvas = getContext("2d);
  }
  _main() {
    if (!this.obj.root || !this.obj.item.length || !this.obj.draw.length ||  !Object.keys(this.cache).length) return;
    //code xử lý chính
    this.cache.forEach();
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
  
  async run() {
    if (!await this._r()) return;
    let j = this.item.flatMap((a, k) => a[0].map(v => ({k, v, x:a[1], y:a[2]})));
    let l = await Promise.all(j.map(i => this.f(i.v)));//load img by value map
    j = j.filter((_, idx) => l[idx] !== null); // loại phần tử tương ứng
    l = l.filter(img => img !== null);
    if (!l.length) return;
    l.forEach((h, i) => {
      if (!h) return;
      const {naturalWidth:W,naturalHeight:H} = h;
      const {x,y} = j[i];
      this.c.mW = Math.max(this.c.mW, W);
      this.c.mH = Math.max(this.c.mH, H);
      //tinh toán phần dư up-down-left-right
      if (y < 0) this.c.u.push(-y);
      if (y > 0) this.c.d.push(y);
      if (x < 0) this.c.l.push(-x);
      if (x > 0) this.c.r.push(x);
    });
    //tính tổng Width/Height canvas
    this.c.mW = Math.max(this.c.mW, (this.c.rW + Math.max(0,...this.c.l) + Math.max(0,...this.c.r)));
    this.c.mH = Math.max(this.c.mH, (this.c.rH + Math.max(0,...this.c.u) + Math.max(0,...this.c.d)));
  }
