const execall = require('@cush/execall');
const util = require('util');

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
    this.msg = msg;
    this.lap = null;
    this.laps = 0;
    this.total = 0;
    this.started = null;
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
    this.started = null;

    time = time[0] * 1e3 + time[1] * 1e-6;
    this.lap = time;
    this.laps += 1;
    this.total += time;
 
    if (this.msg) {
      time = time.toFixed(time < 100 ? time < 10 ? 0 : 1 : 2);
      console.log(format('(%O ms) ' + this.msg, Number(time)));
    }
    return this;
  }
  average() {
    return this.total / this.laps;
  }
}

function elaps(...args) {
  return new Stopwatch(format(...args)).start();
}

module.exports = elaps;
