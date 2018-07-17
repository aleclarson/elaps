const execall = require('@cush/execall');
const util = require('util');

const elapsedRE = /(?<!%)%t/;
const placeholderRE = /((?<!%)%[sdifjoO])/g;
const format = function(msg, ...args) {
  if (args.length) {
    const count = execall(placeholderRE, msg).length;
    msg += ' %O'.repeat(Math.max(0, args.length - count));
  }
  return util.formatWithOptions({colors: true}, msg, ...args);
};

class Stopwatch {
  constructor(msg) {
    this.msg = msg || '';
    this.reset();
  }
  reset() {
    this.lap = null;
    this.laps = 0;
    this.total = 0;
    this.paused = false;
    this.started = null;
    return this;
  }
  start() {
    if (this.started === null) {
      this.paused ? (this.paused = false) : (this.lap = 0);
      this.started = process.hrtime();
    }
    return this;
  }
  time() {
    if (this.started === null) return 0;
    const time = process.hrtime(this.started);
    return time[0] * 1e3 + time[1] * 1e-6;
  }
  pause() {
    if (this.started !== null) {
      this.lap += this.time();
      this.paused = true;
      this.started = null;
    }
    return this;
  }
  stop() {
    if (this.started === null && !this.paused) {
      return this;
    }

    let time = this.lap += this.time();
    this.laps += 1;
    this.total += time;
    this.paused = false;
    this.started = null;
 
    if (this.msg) {
      time = Number(time.toFixed(time < 100 ? 1 : 0));
      if (elapsedRE.test(this.msg)) {
        console.log(format(this.msg.replace(elapsedRE, '%O ms'), time));
      } else {
        console.log(format(this.msg + ' (%O ms)', time));
      }
    }
    return this;
  }
  average() {
    return this.total / this.laps;
  }
}

function elaps(...args) {
  const msg = args.length > 1 ? format(...args) : args[0];
  return new Stopwatch(msg).start();
}

module.exports = elaps;
