const execall = require('@cush/execall');
const util = require('util');

const lapsRE = /(?<!%)%n/;
const elapsedRE = /(?<!%)%t/;
const placeholderRE = /((?<!%)%[sdifjoO])/g;
const format = function(msg, ...args) {
  if (args.length) {
    const count = execall(placeholderRE, msg).length;
    msg += ' %O'.repeat(Math.max(0, args.length - count));
  }
  return util.formatWithOptions({
    colors: !process.env.NO_COLOR
  }, msg, ...args);
};

class Lap {
  constructor(started, timer) {
    this.elapsed = 0;
    this.started = started;
    this.paused = false;
    this.timer = timer;
    this.timerId = timer.id;
  }
  pause() {
    if (this.timer) this.timer.pause(this);
    return this;
  }
  resume() {
    if (this.timer) this.timer.resume(this);
    return this;
  }
  stop(print) {
    if (this.timer) this.timer.stop(print, this);
    return this;
  }
}

let nextId = 1;

class Stopwatch {
  constructor(msg) {
    this.id = nextId++;
    this.reset();
    this.msg = msg || '';
    this.log = elaps.log || console.log;
  }
  reset() {
    if (this.pending) {
      this.id = nextId++;
    }
    this.lap = null;
    this.laps = [];
    this.elapsed = 0;
    this.started = null;
    this.pending = 0;
    return this;
  }
  start() {
    this.pending += 1;
    const lap = new Lap(process.hrtime(), this);
    if (!this.started) this.started = lap.started;
    return this.lap = lap;
  }
  print(...args) {
    let time = typeof args[0] === 'number' ? args.shift() : this.elapsed;
    let msg = typeof args[0] === 'string' ? format(...args) : this.msg;
    if (msg) {
      time = Number(time.toFixed(time < 100 ? 1 : 0));
      if (lapsRE.test(msg)) {
        msg = format(msg.replace(lapsRE, '%O'), this.laps.length);
      }
      if (elapsedRE.test(msg)) {
        this.log(format(msg.replace(elapsedRE, '%O ms'), time));
      } else {
        this.log(format(msg + ' (%O ms)', time));
      }
    }
    return this;
  }
  pause(lap = this.lap) {
    if (lap && lap.started) {
      lap.elapsed = lap.time();
      lap.started = null;
      lap.paused = true;

      if (lap.timerId === this.id && --this.pending === 0) {
        this.elapsed = this.time();
        this.started = null;
      }
    }
    return this;
  }
  resume(lap = this.lap) {
    if (lap && lap.paused) {
      lap.paused = false;
      lap.started = process.hrtime();

      if (lap.timerId === this.id && ++this.pending === 1) {
        this.started = lap.started;
      }
    }
    return this;
  }
  stop(print, lap = this.lap) {
    if (lap && lap.timer) {
      lap.timer = null;

      if (lap.paused) {
        lap.paused = false;
      } else if (lap.started) {
        lap.elapsed = lap.time();
        lap.started = null;
      }

      if (lap.timerId === this.id) {
        if (--this.pending === 0) {
          this.elapsed = this.time();
          this.started = null;
        }
        if (lap === this.lap) {
          this.lap = null;
        }
        this.laps.push(lap.elapsed);
        print && this.print(lap.elapsed);
      }
    }
    return this;
  }
  sum() {
    let sum = 0, i = 0;
    const laps = this.laps, len = laps.length;
    while (i < len) sum += laps[i++];
    return sum;
  }
  average() {
    return this.sum() / this.laps.length;
  }
}

Lap.prototype.time =
Stopwatch.prototype.time = function time() {
  if (this.started) {
    const time = process.hrtime(this.started);
    return this.elapsed + time[0] * 1e3 + time[1] * 1e-6;
  }
  return this.elapsed;
};

function elaps(...args) {
  const msg = args.length > 1 ? format(...args) : args[0];
  const timer = new Stopwatch(msg);
  timer.start();
  return timer;
}

elaps.lazy = function(...args) {
  const msg = args.length > 1 ? format(...args) : args[0];
  return new Stopwatch(msg);
};

module.exports = elaps;
