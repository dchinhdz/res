export class WS {
  static _instance
  static get(url, opt = {}) {
    if (!url) url = `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}`
    if (!this._instance) this._instance = new WS(url, opt)
    return this._instance
  }

  constructor(url, opt = {}) {
    this.url = url
    this.events = {}
    this.socket = null
    this.auto = false
    this.retryDelay = 3000
    this.maxRetry = Infinity
    this.retryCount = 0
  }

  on(e, f) { (this.events[e] ??= []).push(f) }
  emit(e, ...a) { this.events[e]?.forEach(f => f(...a)) }

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN) return
    this.socket = new WebSocket(this.url)
    this.socket.binaryType = 'arraybuffer'
    this.socket.onopen = e => { this.retryCount = 0; this.emit('open', e) }
    this.socket.onmessage = e => this.emit('message', e.data)
    this.socket.onerror = e => this.emit('error', e)
    this.socket.onclose = e => {
      this.emit('close', e)
      if (this.auto && this.retryCount < this.maxRetry)
        setTimeout(() => { this.retryCount++; this.reconnect() }, this.retryDelay)
    }
  }

  disconnect() { this.auto = false; this.socket?.close(); this.socket = null }
  reconnect() { this.disconnect(); this.connect(); this.emit('reconnect', this.retryCount) }

  auto(retryDelay = 3000, maxRetry = Infinity) { this.auto = true; this.retryDelay = retryDelay; this.maxRetry = maxRetry; this.retryCount = 0; this.connect() }

  send(d) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) throw new Error('Socket not open')
    const t = typeof d
    if (t === 'string' || t === 'number') this.socket.send(String(d))
    else if (Array.isArray(d) || (t === 'object' && d)) this.socket.send(JSON.stringify(d))
    else throw new Error('Invalid send type')
  }

  sendUint(v) { this._sendTyped(v, [Uint8Array, Uint16Array, Uint32Array, BigUint64Array]) }
  sendInt(v) { this._sendTyped(v, [Int8Array, Int16Array, Int32Array, BigInt64Array]) }
  sendFloat(v) { this._sendTyped(v, [Float32Array, Float64Array], true) }

  _sendTyped(v, types, isFloat = false) {
    if (!Array.isArray(v)) v = [v]
    let T = types[0]
    if (!isFloat) {
      const min = Math.min(...v.map(Number)), max = Math.max(...v.map(Number))
      if (types === types[0]) { /* auto select logic */ }
      if (types.includes(Uint16Array) && max > 255) T = types[1]
      if (types.includes(Uint32Array) && max > 65535) T = types[2]
      if (types.includes(BigUint64Array) && max > 4294967295) T = types[3]
    } else {
      T = v.some(n => Math.abs(n) > 3.4e38) ? Float64Array : Float32Array
    }
    this.socket.send(new T(v).buffer)
  }

  read(d) { if (typeof d === 'string') { try { return JSON.parse(d) } catch { return d } } if (d instanceof ArrayBuffer) return Array.from(new Uint8Array(d)); throw new Error('Invalid read type') }
  readUint(d) { return Array.from(new Uint8Array(d)) }
  readInt(d) { return Array.from(new Int32Array(d)) }
  readFloat(d) { return Array.from(new Float32Array(d)) }
}
