
export type ResolveFunction = {
  (arg: any): void;
}

export type RejectFunction = {
  (arg: any): void;
}

export interface Deferred<T> extends Promise<T> {
  resolve: ResolveFunction;
  reject: RejectFunction;
}

export const deferred = <T>({ timeout, id }: { timeout?: number; id?: string } = {}): Deferred<T> => {

  let resolve: Function;
  let reject: Function;
  let timeoutId: any;

  const promise = new Promise<T>((resolver, rejector) => {
    resolve = resolver;
    reject = rejector;
  });

  (promise as any).resolve = (arg: any) => {
    clearTimeout(timeoutId);
    resolve(arg);
  };

  (promise as any).reject = (arg: any) => {
    clearTimeout(timeoutId);
    reject(arg);
  };

  if (typeof timeout === "number") {
    const tId = id || "anonymous deferred";
    timeoutId = setTimeout(
      () => reject({ reason: `timeout (${timeout}) reached on "${tId}"` }),
      timeout
    );
  }

  return promise as Deferred<T>;
};
