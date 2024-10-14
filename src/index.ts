/**
 * IListener interface
 * 
 * on: key reference
 * next: callback when emitted event with provided key
 * error: calback if EventEmitter catches an error;
 */
export interface IListener {
  on: string;
  next: (arg: any) => void;
  error?: (err: Error) => void;
}

/**
 * EventEmitter constructor options
 */
interface Options {
  debug: 'error' | null | 'all';
}

/**
 * EventEmitter
 * 
 * DOESN'T keep values, only transmit to subscribers
 * (emit before subscribe doesn't make any sense);
 * 
 * @option _listeners
 * @option _options
 */
export class EventEmitter {
  protected _listeners = new Map<string, Array<IListener>>();
  protected _options: Options = { debug: null };
  
  constructor(options?: Options) {
    if (options) {
      this._options = options;
    }

    return this;
  }

  /**
   * Debug, uses 2 levels (info or error), provided for each method;
   * 
   * @param type 
   * @param v 
   * @param action 
   */
  protected debug(type: 'error' | 'info', v: any, action: string) {
    if (this._options.debug) {
      if (type === 'info' && (this._options.debug === 'all')) {
        console.info(`%c ${action}`, "color:blue;", v);
      }
      if (type === 'error' && (this._options.debug === 'all' || this._options.debug === 'error')) {
        console.info(`%c ${action}`, "color:red;", v);
      }
    }
  }

  /**
   * Emits value to subscribers by key;
   * 
   * @param key 
   * @param val 
   */
  public emit(key: string, val: any): void {
    try {
      const listenersOn = this._listeners.get(key);
      if (listenersOn?.length) {
        listenersOn.forEach((l) => {
          this.debug('info', { l, key, val }, 'emit');
          typeof l.next === 'function'
            ? l.next(val)
            : l.error && l.error(new Error('method .next() must be a function'));
        });
      }
    } catch (e) {
      this.debug('error', e, 'emit error');
    }
  }

  /**
   * Subscribe to all events with provided key (listener.on);
   * 
   * @param listener 
   * @returns
   */
  public subscribe(listener: IListener): IListener {
    try {
      if (this._listeners.has(listener.on)) {
        this._listeners.set(
          listener.on,
          [...this._listeners.get(listener.on)!, listener],
        );
      } else {
        this._listeners.set(listener.on, [listener]);
      }
      this.debug('info', { listeners: this._listeners }, 'subscribe');
      return listener;
    } catch (e) {
      this.debug('error', e, 'subscribe error');
      listener.error && listener.error(e as Error);
      return listener;
    }
  }

  /**
   * Unsubscribe by subscriber referer
   * 
   * @param listener 
   */
  public unsubscribe(listener: IListener): void {
    try {
      const listenersOn = this._listeners.get(listener.on);
      if (listenersOn?.length) {
        this._listeners.set(listener.on, listenersOn.filter((l) => l !== listener));
      }
      this.debug('info', { listeners: this._listeners }, 'unsubscribe');
    } catch (e) {
      this.debug('error', e, 'unsubscribe error');
      listener.error && listener.error(e as Error);
    }
  }

  /**
   * Remove all subscribers for provided key
   * 
   * @param key 
   */
  public unsubscribeAllKey(key: string): void {
    try {
      this._listeners.delete(key);
    } catch (e) {
      this.debug('error', e, 'unsubscribeAllKey error');
    }
  }

  /**
   * Remove ALL subscribers
   */
  public unsubscribeAll(): void {
    try {
      this._listeners.clear();
    } catch (e) {
      this.debug('error', e, 'unsubscribeAll error');
    }
  }
}

/**
 * Singleton, every new instance would refer to existed one;
 */
export class EventEmitterSingleton extends EventEmitter {
  static #instance: null | EventEmitterSingleton = null;

  constructor(options?: Options) {
    super(options);

    if (EventEmitterSingleton.#instance) {
      return EventEmitterSingleton.#instance;
    }
    EventEmitterSingleton.#instance = this;

    return this;
  }

  /**
   * Destroy singleton reference and remove all subscribers
   */
  public destroy(): void {
    try {
      this.unsubscribeAll();
      EventEmitterSingleton.#instance = null;
    } catch (e) {
      this.debug('error', e, 'destroy error');
    }
  }
}

export default {
  EventEmitterSingleton,
  EventEmitter
}
