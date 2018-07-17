const execall = require('@cush/execall');
const util = require('util');

const elapsedRE = /(?:^|[^%])%t/;
const placeholderRE = /((?:^|[^%])%[sdifjoO])/g;
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
    this.started = null;
    return this;
  }
  start() {
    if (this.started === null) {
      this.started = process.hrtime();
    }
    return this;
  }
  stop() {
    if (this.started === null) {
      return this;
    }

    let time = process.hrtime(this.started);
    this.lap = time =
      time[0] * 1e3 + time[1] * 1e-6;

    this.laps += 1;
    this.total += time;
    this.started = null;
 
    if (this.msg) {
      time = Number(time.toFixed(time < 100 ? 1 : 0));
      if (elapsedRE.test(this.msg)) {
        console.log(format(this.msg.replace(elapsedRE, '%Oms'), time));
      } else {
        console.log(format(this.msg + ' (%Oms)', time));
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
