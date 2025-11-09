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
  
  async c() {
    const j = this.item.flatMap((a, k) => a[0].map(v => ({k, v, x:a[1], y:a[2]})));
    const k = j.map(k => k.k);//key
    const v = j.map(v => v.v);//value
    const x = j.map(x => x.x);//x
    const y = j.map(y => y.y);//y
    const l = await Promise.all(v.map(i => this.f(i)));//value map
    l.forEach((h, i) => {
      if (!h) return;
      this.c.mW = Math.max(this.c.mW, h.naturalWidth);
      this.c.mH = Math.max(this.c.mH, h.naturalHeight);
      if (v[i] === this.root) {
        this.c.rW = h.naturalWidth;
        this.c.rH = h.naturalHeight;
      }
    });
  }
}
