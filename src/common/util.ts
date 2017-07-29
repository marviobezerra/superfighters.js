export interface Action {
    (): void;
}

export interface Action01<T> {
    (item: T): void;
}

export interface Action02<T01, T02> {
    (item01: T01, item02: T02): void;
}

export interface Func<T, TResult> {
    (item: T): TResult;
}

export interface Map<TValue> {
    [K: string]: TValue;
}