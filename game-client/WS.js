export class WS {
  static pool = new Map();

  static get(url=null,opt={}) {
    if(!url){const p=location.protocol==="https:"?"wss":"ws";url=`${p}://${location.host}/`;}
    if(!this.pool.has(url)) this.pool.set(url,new WS(url,opt));
    return this.pool.get(url);
  }

  constructor(url,opt={}) {
    this.url=url;this.auto=opt.auto??false;this.max=opt.max??5;
    this.delay=opt.delay??1000;this.debug=opt.debug??false;
    this.events={};this.onceEvents={};this.retry=0;this.manual=false;this.ws=null;
  }

  on(e,f){(this.events[e]??=new Set()).add(f);}
  once(e,f){(this.onceEvents[e]??=new Set()).add(f);}
  off(e,f){this.events[e]?.delete(f);}
  emit(e,...a){if(this.debug)console.log(`[WS] ${e}`,...a);
    this.events[e]?.forEach(fn=>fn(...a));
    if(this.onceEvents[e]){this.onceEvents[e].forEach(fn=>fn(...a));delete this.onceEvents[e];}
  }

  connect(){
    if(this.ws&&[0,1].includes(this.ws.readyState))return;
    this.manual=false;
    const ws=new WebSocket(this.url);
    ws.binaryType="arraybuffer";
    ws.onopen=e=>{this.retry=0;this.emit("open",e);};
    ws.onerror=e=>this.emit("error",e);
    ws.onclose=e=>{this.emit("close",e);this.ws=null;if(!this.manual&&this.auto)this.reconnect();};
    ws.onmessage=e=>this.handleMsg(e);
    this.ws=ws;
  }

  disconnect(code=1000,reason="bye"){this.manual=true;this.ws?.close(code,reason);WS.pool.delete(this.url);}
  reconnect(){if(this.retry>=this.max)return;this.retry++;setTimeout(()=>{if(!this.manual)this.connect();},this.delay*this.retry);}
  ensure(){if(!this.ws||this.ws.readyState!==WebSocket.OPEN)throw new Error("WebSocket not open");}

  handleMsg(e){
    let d=e.data;
    if(typeof d==="string"){try{d=JSON.parse(d);}catch{}}
    else if(d instanceof Blob)return d.arrayBuffer().then(b=>this.emit("message",b,e));
    this.emit("message",d,e);
  }

  send(data){
    try{
      this.ensure();
      if(typeof data==="string"||typeof data==="number")this.ws.send(String(data));
      else if(Array.isArray(data))this.ws.send(JSON.stringify(data));
      else if(data&&typeof data==="object")this.ws.send(JSON.stringify(data));
      else throw new TypeError("send() requires string, number, array, or object");
    }catch(err){this.emit("senderror",err,{data});throw err;}
  }

  sendUint(data){try{this.ensure();const arr=this._autoUint(data);this.ws.send(this._buffer(arr));}
    catch(err){this.emit("senderror",err,{data});throw err;}}

  sendInt(data){try{this.ensure();const arr=this._autoInt(data);this.ws.send(this._buffer(arr));}
    catch(err){this.emit("senderror",err,{data});throw err;}}

  sendFloat(data){try{this.ensure();const arr=this._autoFloat(data);this.ws.send(this._buffer(arr));}
    catch(err){this.emit("senderror",err,{data});throw err;}}

  read(data){
    if(typeof data==="string"){try{return JSON.parse(data);}catch{return data;}}
    if(data instanceof ArrayBuffer)return this._autoDetectTyped(data);
    if(ArrayBuffer.isView(data))return data;
    if(Array.isArray(data))return data;
    if(typeof data==="object"&&data)return data;
    if(typeof data==="number")return data;
    throw new TypeError("read() invalid data type");
  }

  readUint(data){try{return this._autoDetectUint(data);}catch(err){throw err;}}
  readInt(data){try{return this._autoDetectInt(data);}catch(err){throw err;}}
  readFloat(data){try{return this._autoDetectFloat(data);}catch(err){throw err;}}

  _buffer(v){return ArrayBuffer.isView(v)?v.buffer.slice(v.byteOffset,v.byteOffset+v.byteLength):v;}

  _autoUint(d){
    if(d==null)throw new TypeError("Missing data");
    if(typeof d==="number"||typeof d==="bigint")d=[d];
    if(!Array.isArray(d))throw new TypeError("Uint requires array or number");
    const max=Math.max(...d.map(Number));
    if(max<=255)return new Uint8Array(d);
    if(max<=65535)return new Uint16Array(d);
    if(max<=4294967295)return new Uint32Array(d);
    return new BigUint64Array(d.map(v=>BigInt(v)));
  }

  _autoInt(d){
    if(d==null)throw new TypeError("Missing data");
    if(typeof d==="number"||typeof d==="bigint")d=[d];
    if(!Array.isArray(d))throw new TypeError("Int requires array or number");
    const min=Math.min(...d.map(Number)),max=Math.max(...d.map(Number));
    if(min>=-128&&max<=127)return new Int8Array(d);
    if(min>=-32768&&max<=32767)return new Int16Array(d);
    if(min>=-2147483648&&max<=2147483647)return new Int32Array(d);
    return new BigInt64Array(d.map(v=>BigInt(v)));
  }

  _autoFloat(d){
    if(d==null)throw new TypeError("Missing data");
    if(typeof d==="number")d=[d];
    if(!Array.isArray(d))throw new TypeError("Float requires array or number");
    const precise=d.some(v=>Math.abs(v)>3.4e38);
    return precise?new Float64Array(d):new Float32Array(d);
  }

  _autoDetectTyped(b){
    if(!(b instanceof ArrayBuffer))throw new TypeError("Expected ArrayBuffer");
    const len=b.byteLength;
    if(len%8===0)return new Float64Array(b);
    if(len%4===0)return new Float32Array(b);
    if(len%2===0)return new Uint16Array(b);
    return new Uint8Array(b);
  }

  _autoDetectUint(b){
    if(!(b instanceof ArrayBuffer))throw new TypeError("Expected ArrayBuffer");
    const len=b.byteLength;
    if(len%8===0)return new BigUint64Array(b);
    if(len%4===0)return new Uint32Array(b);
    if(len%2===0)return new Uint16Array(b);
    return new Uint8Array(b);
  }

  _autoDetectInt(b){
    if(!(b instanceof ArrayBuffer))throw new TypeError("Expected ArrayBuffer");
    const len=b.byteLength;
    if(len%8===0)return new BigInt64Array(b);
    if(len%4===0)return new Int32Array(b);
    if(len%2===0)return new Int16Array(b);
    return new Int8Array(b);
  }

  _autoDetectFloat(b){
    if(!(b instanceof ArrayBuffer))throw new TypeError("Expected ArrayBuffer");
    const len=b.byteLength;
    return len%8===0?new Float64Array(b):new Float32Array(b);
  }
}
