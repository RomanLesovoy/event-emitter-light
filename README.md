# event-emitter-light
EventEmitter class allows emit and subscribe to events + EventEmitterSingleton class

## Examples

```ts
import { EventEmitterSingleton } from '@js-emitter/event-emitter-light'

new EventEmitterSingleton().subscribe({ on: 'testEvent', next: (value) => {
  console.log(value)
} })

new EventEmitterSingleton().emit('testEvent', 'testValue')
```

```ts
import { EventEmitter } from '@js-emitter/event-emitter-light'
const emitter = new EventEmitterSingleton();

emitter.subscribe({ on: 'testEvent', next: (value) => {
  console.log(value)
} })

emitter.emit('testEvent', 'testValue')
```

### License

event-emitter-light [Apache-2.0 licensed](./LICENSE).
