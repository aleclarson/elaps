# elaps v2.0.0

Stopwatch for high-resolution timing

Powered by `process.hrtime()`

```js
const elaps = require('elaps');

// create a started timer
let t = elaps('do something');

// create a stopped timer
t = elaps().reset();

// choose where the elapsed time is printed
elaps('did something in %t').stop();

// print the number of laps
elaps('did something %n times').stop();

// util.format placeholders are supported
elaps('do something: %O', {meta:'data'}).stop();

// args without a placeholder default to %O
elaps('do something:', {meta:'data'}).stop();
```

## `Stopwatch` class

### Properties

### `lap: ?Lap`

The newest `Lap` object created by a `start()` call.

Equals `null` when the newest lap is stopped.

### `laps: number[]`

The array of lap times in order of stop time.

### `elapsed: number`

The time passed (in milliseconds) with 1+ laps counting.

Updated when a `pause()` or `stop()` call leads to `this.pending` being zero.

*Note:* This not the same as `sum()`, which combines the individual lap times.

### `pending: number`

The number of pending laps (neither paused nor stopped).

### `msg: string`

The message passed to the `elaps` constructor.

Printed by `stop(true)` and `print()` calls.

Use `%t` to print the elapsed time.

Use `%n` to print the number of laps.

### `log: Function`

The function called by the `print` method.

Defaults to `console.log`.

&nbsp;

### Methods

### `start(): Lap`

Start a new lap.

Update the value of `this.lap` to the new lap.

### `stop(print: boolean): this`

Stop the current lap.

Pass `true` to print the lap time.

### `print(time: ?number): this`

Print `this.msg` with given time (in milliseconds) or `this.elapsed`.

### `time(): number`

Get the updated value of `this.elapsed` without pausing/stopping every pending lap.

### `sum(): number`

Get the combined time (in milliseconds) of all stopped laps.

### `average(): number`

Get the average time (in milliseconds) of all stopped laps.

### `pause(): this`

Shorthand for `this.lap.pause()`

### `resume(): this`

Shorthand for `this.lap.resume()`

### `reset(): this`

Reset `this` to its initial state.

Any pending laps won't affect the new state.

&nbsp;

## `Lap` class

### Properties

### `elapsed: number`

The lap time. Updated by `pause()` and `stop()` calls.

### `paused: boolean`

Equals `true` when paused. 😉

### `timer: ?Stopwatch`

The associated `Stopwatch` object.

Equals `null` once stopped.

&nbsp;

### Methods

### `stop(print: boolean): this`

Stop counting.

Pass `true` to print the lap time.

### `time(): number`

Get the updated value of `this.elapsed` without pausing/stopping.

### `pause(): this`

Pause counting and allow for resuming in the future.

### `resume(): this`

Resume counting.

&nbsp;
