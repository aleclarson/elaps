# elaps v1.0.1

Stopwatch for high-resolution timing

```js
const elaps = require('elaps');

let t = elaps('doSomething');
doSomething();
t.stop(); // prints "(5.25 ms) doSomething"

typeof t.elapsed == 'number'; // true

t.start(); // begin a new "lap"
doSomething();
t.stop(); // prints "(5.25 ms) doSomething"

// the combined time of all laps
t.elapsed;

// the average time per lap
t.average();

// create a stopped timer
t = elaps('doSomething').reset();
```
