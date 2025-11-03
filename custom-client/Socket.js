export class Socket {
  #ws; #url; #cb; #d = 1e3; #t; #log;

  constructor(url = `wss://${location.host}/`, logger = console) {
    if (!('WebSocket' in window)) throw new Error('WebSocket not supported');
    this.#url = url;
    this.#log = logger;
    this.#open();
  }

  #open() {
    if (this.#ws?.readyState < 2) return;            // 0/1 → đang kết nối / đã kết nối
    this.#ws && this.#ws.close();                    // ĐÓNG HOÀN TOÀN cũ
    this.#ws = null;

    try {
      this.#ws = new WebSocket(this.#url);
      this.#ws.binaryType = 'arraybuffer';

      this.#ws.onopen = () => {
        this.#d = 1e3;
        this.#log('WS OPEN', this.#url, '#0f0');
      };

      this.#ws.onmessage = e => this.#cb?.(e.data);

      this.#ws.onerror = e => this.#log('WS ERROR', e.message || 'unknown', '#f00');

      this.#ws.onclose = ev => {
        this.#ws = null;
        this.#log('WS CLOSED', `[${ev.code}] ${ev.reason||''}`, '#ff0');
        clearTimeout(this.#t);
        this.#log('RECONNECTING...', `in ${this.#d}ms`, '#ff0');
        this.#t = setTimeout(() => this.#open(), this.#d);
        this.#d = Math.min(this.#d * 2, 1e4);
      };
    } catch (err) {
      this.#log('WS INIT FAIL', err.message, '#f00');
    }
  }

  send(d) {
    if (this.#ws?.readyState !== 1) return this.#log('SEND DROP', 'not connected', '#f80');
    this.#ws.send(typeof d === 'string' ? d : JSON.stringify(d));
  }
  on(c) { this.#cb = c; }
  close() { this.#ws?.close(1000); clearTimeout(this.#t); }
}
