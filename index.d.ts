interface ElapsedTime {
  /** The timestamp for the last `start` call */
  readonly started: NodeJS.HRTime | null
  /**
   * The elapsed time that accumulated between all `start` and `stop` calls.
   * The `stop` method must be called to update `elapsed`.
   */
  readonly elapsed: number
  /**
   * The `elapsed` time plus the time since `started` (if not null).
   */
  time(): number
}

export interface Stopwatch extends ElapsedTime {
  /** Unique identifier */
  readonly id: number
  /** The message printed when `print` receives no arguments */
  readonly msg: string
  /** The most recently created lap  */
  readonly lap: Lap | null
  /** The elapsed times of all finished laps */
  readonly laps: readonly number[]
  /** The number of unfinished laps */
  readonly pending: number
  /**
   * Reset all properties except `msg`.
   * The `id` is replaced only if there are pending laps.
   */
  reset(): this
  /** Start a new lap. */
  start(): Lap
  /** Print the `elapsed` time. */
  print(): this
  /** Print the `elapsed` time with a custom message. */
  print(msg: string, ...args: any[]): this
  /** Print a custom time and optional message. */
  print(time: number, msg?: string, ...args: any[]): this
  /** Pause the most recent lap. */
  pause(): this
  /** Resume the most recent lap. */
  resume(): this
  /** Stop the most recent lap. */
  stop(): this
  /**
   * Stop the most recent lap, and print the `elapsed`
   * time if `true` is passed.
   */
  stop(print: boolean): this
  /** Get the sum of all finished laps. */
  sum(): number
  /** Get the average of all finished laps. */
  average(): number
}

export interface Lap extends ElapsedTime {
  /** Is this lap paused? */
  readonly paused: boolean
  /** Pause timing and update the `elapsed` time. */
  pause(): this
  /** Continue timing if paused. */
  resume(): this
  /** Finish this lap. */
  stop(print?: boolean): this
}

declare const elaps: {
  /** Create a stopwatch and start it immediately. */
  (msg?: string, ...args: any[]): Stopwatch
  /** Create a paused stopwatch. */
  lazy(msg?: string, ...args: any[]): Stopwatch
  /**
   * The logging function.
   * @default console.log
   */
  log: Function
}

export default elaps
