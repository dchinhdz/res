export class P {
  constructor(arr) {
    this.item = arr || [];
    this.root = "002";
    this.c = {rW:0,rH:0,mW:0,mH:0,u:[],d:[],l:[],r:[]};
    this._demo();
  }
  _demo() {
    this.item.push([["10710"],41,-18]);//bieutuong
    this.item.push([["10728"],-15,45]);//haoquang
    this.item.push([["5900"],-28,0]);//canh
    this.item.push([["201", "202"],9,46]);//quan
    this.item.push([["193"],5,34]);//ao
    this.item.push([["002"],0,0]);//khuanmat
    this.item.push([["174"],12,15]);//mat
    this.item.push([["9351"],-5,-16]);//toc
    this.item.push([["0"],0,0]);//kinh
    this.item.push([["155"],21,25]);//matna
    this.item.push([["0"],0,0]);//non
    this.item.push([["115"],30,34]);//docamtay
    this.item.push([["10725", "10726"],-86,0]);//pet
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

  async _r() {
    const f = await this.f(this.root);
    if (!f) return;
    this.c.rW = f.naturalWidth;
    this.c.rH = f.naturalHeight;
  }
  
  async run() {
    await this._r();
    const j = this.item.flatMap((a, k) => a[0].map(v => ({k, v, x:a[1], y:a[2]})));
    const l = await Promise.all(j.map(i => this.f(i.v)));//load img by value map
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
}
