# elaps v1.3.0

Stopwatch for high-resolution timing

```js
const elaps = require('elaps');

// new timers start automatically
let t = elaps('doSomething');
doSomething();

// pause the current lap
t.pause();
t.start(); // and resume

// stop the timer and print its message (if one exists)
t.stop(); // prints "(5.25 ms) doSomething"

// get the lap time without pausing or stopping
t.time();

// begin a new lap once stopped
t.start();

// the combined time of all laps
t.elapsed;

// the average time per lap
t.average();

// create a stopped timer
t = elaps('doSomething').reset();

// choose where the elapsed time is printed
elaps('doSomething took %t').stop();

// manually add a new lap (useful for parallel aggregate timing)
t.add(1000);
```
