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
    this.parallels = 0;
    return this;
  }
  add(time) {
    this.laps += 1;
    this.total += time;
    return this;
  }
  start() {
    this.parallels++;
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
  print(time) {
    if (this.msg) {
      if (time == null) time = this.total;
      time = Number(time.toFixed(time < 100 ? 1 : 0));

      let msg = this.msg;
      if (lapsRE.test(msg)) {
        msg = format(msg.replace(lapsRE, '%O'), this.laps);
      }
      if (elapsedRE.test(msg)) {
        console.log(format(msg.replace(elapsedRE, '%O ms'), time));
      } else {
        console.log(format(msg + ' (%O ms)', time));
      }
    }
    return this;
  }
  pause() {
    if (this.started !== null) {
      if (--this.parallels) return this;
      this.lap += this.time();
      this.paused = true;
      this.started = null;
    }
    return this;
  }
  stop(print) {
    if (--this.parallels) return this;
    if (this.started || this.paused) {
      let time = this.lap += this.time();
      this.laps += 1;
      this.total += time;
      this.paused = false;
      this.started = null;
      print && this.print(time);
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
