export default class Timer {
    constructor() {
      this.subscribers = [];
      this.running = false;
      this.lastTime = null;
    }
  
    start() {
      if (!this.running) {
        this.running = true;
        this.lastTime = null;
        requestAnimationFrame(this.run);
      }
    }
  
    stop = () => {
      this.running = false;
    };
  
    run = (time) => {
      if (!this.running) return;
      if (this.lastTime == null) this.lastTime = time;
      const delta = time - this.lastTime;
      this.lastTime = time;
      this.subscribers.forEach((cb) => cb(time, delta));
      requestAnimationFrame(this.run);
    };
  
    subscribe(cb) {
      this.subscribers.push(cb);
    }
  
    unsubscribe(cb) {
      this.subscribers = this.subscribers.filter((f) => f !== cb);
    }
}