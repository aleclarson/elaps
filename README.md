# elaps v1.0.0

Stopwatch for high-resolution timing

```js
const elaps = require('elaps');

const t = elaps('doSomething');
doSomething();
t.stop(); // prints "(5.25 ms) doSomething"

typeof t.elapsed == 'number'; // true

t.start(); // begin a new "lap"
doSomething();
t.stop(); // prints "(5.25 ms) doSomething"

// the combined time of all laps
t.elapsed;

// the average
t.average();
```
