import type { SetStateFunction, SubscriberFunction } from './interfaces/observerInterfaces';

/**
 * An observer pattern which has a generic type for the type of state. It also has a list of subscribers, When state is
 * changed, All the subscribers are called with the new state.
 */
class Observer<C> {
  public debug!: boolean;
  protected state: C;
  protected subscribers: {
    id: string;
    cb: SubscriberFunction<C>;
  }[];

  public constructor(initialState: C) {
    this.state = initialState;
    this.subscribers = [];
  }

  /**
   * Updates the current state and calls all the subscribers with the new value of the state.
   * @param state A callback which gets the last value of the state. This function must return a new state.
   */
  public setState(state: SetStateFunction<C>): void {
    const newState = state(this.state);
    if (Object.is(newState, this.state)) return;
    if (this.debug)
      console.trace(
        `[Observer: ${this.constructor.name}] State is being updated. \n\tPrev: "${JSON.stringify(this.state)}" (${typeof this.state})\n\tNew: "${JSON.stringify(newState)}" (${typeof newState})`,
      );
    this.subscribers.forEach((subscriber) => {
      subscriber.cb(newState, this.state);
    });
    this.state = newState;
  }

  /**
   * Gets the last value of the state.
   * @returns Current state of observer
   */
  public getState(): C {
    return this.state;
  }

  /**
   * Gets a callback and adds it to the subscribers of the observer and assigns a unique id to it.
   * @param cb A subscriber function which gets the current state as argument and performs a custom logic
   * @param initalCall An optional flag which indicates whether the subscriber should be called after subscribed.
   * @returns the unique id of the subscriber. It's used for unsubscribe the subscriber from the observer.
   *
   */
  public subscribe(cb: SubscriberFunction<C>, initalCall?: boolean): string {
    const id = Math.floor(Math.random() * 1000000).toString();
    if (this.debug)
      console.trace(`[Observer: ${this.constructor.name}] New subscriber added. id: "${id}"`);
    this.subscribers.push({ id, cb });
    if (initalCall) cb(this.state, this.state);
    return id;
  }

  /**
   * Unsubscribes a subscriber with it's id.
   * @param id The subscriber Id
   */
  public unsubscribe(id: string | string[]): void {
    if (typeof id === 'string') {
      this.subscribers = this.subscribers.filter((subscriber) => subscriber.id !== id);
    } else {
      this.subscribers = this.subscribers.filter((subscriber) => !id.includes(subscriber.id));
    }
    if (this.debug)
      console.trace(
        `[Observer: ${this.constructor.name}] Subscriber with id(s): "${JSON.stringify(id)}" has been removed`,
      );
  }

  /**
   * Removes all subscribers
   */
  public unsubscribeAll(): void {
    this.subscribers = [];
    console.trace(`[Observer: ${this.constructor.name}] All subscribers has been removed`);
  }
}

export default Observer;
