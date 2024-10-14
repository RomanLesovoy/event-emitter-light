# event-emitter-light
EventEmitter class allows emit and subscribe to events + EventEmitterSingleton class

## Examples

* General
```ts
import { EventEmitter } from '@js-emitter/event-emitter-light';
const emitter = new EventEmitter();

const subscription = emitter.subscribe({ on: 'testEvent', next: (value) => {
  console.log(value); // testValue
} })

emitter.emit('testEvent', 'testValue');

// remove current subscriber
emitter.unsubscribe(subscription);

// remove all subscribers for provided event name
emitter.unsubscribeAllKey('testEvent');

// remove all subscribers
emitter.unsubscribeAll();
```

* Singleton
```ts
import { EventEmitterSingleton } from '@js-emitter/event-emitter-light';

const subscription = new EventEmitterSingleton().subscribe({ on: 'testEvent', next: (value) => {
  console.log(value) // testValue
} })

new EventEmitterSingleton().emit('testEvent', 'testValue')

new EventEmitterSingleton().unsubscribe(subscription);
```

### License

event-emitter-light [Apache-2.0 licensed](./LICENSE).
