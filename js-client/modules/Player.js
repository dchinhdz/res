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
    this.item.push([["201"],9,46]);//quan
    this.item.push([["193"],5,34]);//ao
    this.item.push([["002"],0,0]);//khuanmat
    this.item.push([["174"],12,15]);//mat
    this.item.push([["9351"],-5,-16]);//toc
    this.item.push([["0"],0,0]);//kinh
    this.item.push([["155"],21,25]);//matna
    this.item.push([["0"],0,0]);//non
    this.item.push([["115"],30,34]);//docamtay
    this.item.push([["10725"],-86,0]);//pet
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
    const j = this.item.flatMap(k => k[0]);
    const l = await Promise.all(j.map(i => this.f(i)));
    l.forEach((i, k) => {
      if (!i) return;
      this.c.mW = Math.max(this.c.mW, i.naturalWidth);
      this.c.mH = Math.max(this.c.mH, i.naturalHeight);
      if (j[k] === this.root) {
        this.c.rW = i.naturalWidth;
        this.c.rH = i.naturalHeight;
      }
    });
  }
}
