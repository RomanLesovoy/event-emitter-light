import { EventEmitter, EventEmitterSingleton, IListener } from '../src/index';

describe('EventEmitter', () => {
  let eventEmitter: EventEmitter;

  beforeEach(() => {
    jest.clearAllMocks();  // Reset mock call history
    eventEmitter?.unsubscribeAll();
    eventEmitter = new EventEmitter();
  });

  test('should subscribe and emit events', () => {
    // Use a Jest mock function
    const mockListener = {
      on: 'testEvent',
      next: jest.fn(),
    };
  
    // Subscribe the listener
    eventEmitter.subscribe(mockListener);
    eventEmitter.emit('testEvent', 'testValue');

    expect(mockListener.next).toHaveBeenCalledWith('testValue');
    expect(mockListener.next).toHaveBeenCalledTimes(1);
  });

  test('should handle multiple listeners for the same event', () => {
    const mockListener1 = {
      on: 'testEvent',
      next: jest.fn(),
    };
    const mockListener2 = {
      on: 'testEvent',
      next: jest.fn(),
    };

    eventEmitter.subscribe(mockListener1);
    eventEmitter.subscribe(mockListener2);
    eventEmitter.emit('testEvent', 'testValue');

    expect(mockListener1.next).toHaveBeenCalledWith('testValue');
    expect(mockListener2.next).toHaveBeenCalledWith('testValue');
  });

  test('should unsubscribe a listener', () => {
    const mockListener = {
      on: 'testEvent',
      next: jest.fn(),
    };

    eventEmitter.subscribe(mockListener);
    eventEmitter.unsubscribe(mockListener);
    eventEmitter.emit('testEvent', 'testValue');

    expect(mockListener.next).not.toHaveBeenCalled();
  });

  test('should unsubscribe all listeners by key', () => {
    const mockListener = {
      on: 'testEvent',
      next: jest.fn(),
    };

    eventEmitter.subscribe(mockListener);
    eventEmitter.unsubscribeAllKey('testEvent');
    eventEmitter.emit('testEvent', 'testValue');

    expect(mockListener.next).not.toHaveBeenCalled();
  });

  test('should unsubscribe all listeners', () => {
    const mockListener1 = {
      on: 'testEvent',
      next: jest.fn(),
    };
    const mockListener2 = {
      on: 'anotherEvent',
      next: jest.fn(),
    };

    eventEmitter.subscribe(mockListener1);
    eventEmitter.subscribe(mockListener2);
    eventEmitter.unsubscribeAll();
    eventEmitter.emit('testEvent', 'testValue');
    eventEmitter.emit('anotherEvent', 'anotherValue');

    expect(mockListener1.next).not.toHaveBeenCalled();
    expect(mockListener2.next).not.toHaveBeenCalled();
  });

  test('should call error callback if next is not a function', () => {
    const mockListener = {
      on: 'testEvent',
      next: 'notAFunction', // This should trigger an error
      error: jest.fn(),
    };

    eventEmitter.subscribe(mockListener as unknown as IListener);
    eventEmitter.emit('testEvent', 'testValue');

    expect(mockListener.error).toHaveBeenCalledWith(new Error('method .next() must be a function'));
  });
});

describe('EventEmitterSingleton', () => {
  beforeEach(() => {
    new EventEmitterSingleton().destroy(); // Reset singleton between tests
  });

  test('should maintain a singleton instance', () => {
    const instance1 = new EventEmitterSingleton();
    const instance2 = new EventEmitterSingleton();

    expect(instance1).toBe(instance2);
  });

  test('should destroy the singleton instance', () => {
    const instance1 = new EventEmitterSingleton();
    instance1.destroy();

    const instance2 = new EventEmitterSingleton();

    expect(instance1).not.toBe(instance2); // After destroy, new instance should be created
  });

  test('should unsubscribe all listeners when singleton is destroyed', () => {
    const instance = new EventEmitterSingleton();
    const mockListener = {
      on: 'testEvent',
      next: jest.fn(),
    };

    instance.subscribe(mockListener);
    instance.destroy();
    instance.emit('testEvent', 'testValue');

    expect(mockListener.next).not.toHaveBeenCalled();
  });
});
