export type SubscriberFunction<C> = (state: C, prevState: C) => void;
export type SetStateFunction<C> = (state: C) => C;
