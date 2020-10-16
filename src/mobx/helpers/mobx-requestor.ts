import { observable, computed, action, makeObservable } from "mobx";

export type MobxRequestorArgs<T> = {
  call(...args: any[]): Promise<T>;
  onResponse?(): Promise<void>;
  autoClear?: boolean;
  defaultResponse?: any;
};

type CallbackFn = {
  (): void;
};

type MobxRequestorState = "initial" | "fetching" | "success" | "error";

type UploadDownloadProgressArgs = {
  percentage: number;
}

type OnResponseCallbackArgs = {
  prevResponse: any;
  response: any,
  state: MobxRequestorState,
  fetchId: string,
  params: any,
  error: any,
}

type OnResponseCallback = {
  (args: OnResponseCallbackArgs): Promise<void>
}

export class MobxRequestor<T> {
  fetchId: string = "";

  requestPromise?: Promise<T>;

  onResponse?: OnResponseCallback;

  call;

  lastSentPayload: any;

  onAbort?: CallbackFn;

  state: MobxRequestorState = "initial";

  storedResponse?: T;

  defaultResponse?: any;

  error: any;

  requestCount = 0;

  autoClear?: boolean = true;

  downloadProgress = 0;

  uploadProgress = 0;

  resetUploadProgress() {
    this.uploadProgress = 0;
  }

  resetDownloadProgress() {
    this.downloadProgress = 0;
  }

  resetProgressReport() {
    this.resetUploadProgress();
    this.resetDownloadProgress();
  }

  get uploadComplete() {
    return this.uploadProgress === 100;
  }

  get downloadComplete() {
    return this.downloadProgress === 100;
  }

  reportUploadProgress = (args: UploadDownloadProgressArgs) => {
    this.uploadProgress = args.percentage;
  };

  reportDownloadProgress = (args: UploadDownloadProgressArgs) => {
    this.downloadProgress = args.percentage;
  };

  get loading() {
    return this.state === "fetching";
  }

  get success() {
    return this.state === "success";
  }

  get initialOrLoading() {
    const { state, loading } = this;
    return state === "initial" || loading;
  }

  setResponse = (response: T) => {
    this._setResult(response, "success", null);
  };

  clearResponse = () => {
    this._setResult(undefined, "initial", null);
  };

  async setResult(args: any) {
    const { fetchId } = args;
    // ignore request that is not current
    if (this.fetchId !== fetchId) return;

    const executeOnResponse = action(async (providedArgs: any) => {
      try {
        await this.onResponse?.(providedArgs);
      } catch (execError) {
        console.error("executeResponse error: ", execError);
      }
    });

    const providedArgs = { ...args, prevResponse: this.storedResponse };

    if (this.onResponse) {
      await executeOnResponse(providedArgs);
    }

    const { response, state, error } = providedArgs;

    this._setResult(response, state, error);
  }

  _setResult = (response: T | undefined, state: MobxRequestorState, error: any) => {
    this.storedResponse = response;
    this.state = state;
    this.requestPromise = undefined;

    if (error) {
      this.error = error;
    }
  };

  get response() {
    return this.storedResponse || this.defaultResponse;
  }

  /**
   * stores the last payload sent to this request. It stores all the arguments passed to execCall
   */
  get lastPayloadSent() {
    return this.lastSentPayload;
  }

  abort() {
    const { requestPromise, onAbort } = this;
    // TODO: should be abortable promise
    if ((requestPromise as any)?.abort) {
      (requestPromise as any).abort();

      onAbort?.();
    }
  }

  clearError() {
    this.error = null;
  }

  async _handleError(responseError: any, fetchId: string, params: any) {
    const { sender } = responseError;
    if (sender?.status === 0) {
      // ignore abort errors
      this._setResult(undefined, "error", undefined);
      return;
    }

    console.error(
      "error requesting data for",
      this.fetchId,
      params,
      responseError
    );

    const error =
      sender?.response?.token ||
      sender?.statusText ||
      responseError ||
      "UNKNOWN_ERROR";

    await this.setResult({
      response: null,
      state: "error",
      fetchId,
      params,
      error,
    });
  }

  async execCall(...args: any[]) {
    let fetchId: string;

    this.requestCount++;

    fetchId = this.fetchId = `${this.requestCount}`;

    try {
      this.state = "fetching";
      this.error = null;

      if (this.autoClear) {
        this.storedResponse = {} as T;
      }

      this.abort();

      const { call: theActualPromisedFunction } = this;

      if (!theActualPromisedFunction) {
        throw new Error('"call" method not set');
      }

      if (typeof theActualPromisedFunction !== "function") {
        throw new Error(
          `"call" is expected to be a function. Received ${theActualPromisedFunction}`
        );
      }

      const p = theActualPromisedFunction(...args);

      this.resetProgressReport();

      if (!p) throw new Error(`no promise returned when calling ${theActualPromisedFunction}`);

      (p as any).onUploadProgress = this.reportUploadProgress;
      (p as any).onDownloadProgress = this.reportDownloadProgress;

      this.requestPromise = p;

      this.lastSentPayload = args;

      p?.catch?.((error) => {
        this._handleError(error, fetchId, args);
      });

      const response = await p;

      await this.setResult({
        response,
        state: "success",
        fetchId,
        params: args,
      });
    } catch (error) {
      await this._handleError(error, fetchId, args);
    }
  }

  constructor(opts: MobxRequestorArgs<T>) {
    makeObservable(this, {
      state: observable,
      storedResponse: observable.shallow,
      error: observable,
      downloadProgress: observable,
      uploadProgress: observable,
      resetUploadProgress: action,
      resetDownloadProgress: action,
      resetProgressReport: action,
      uploadComplete: computed,
      downloadComplete: computed,
      reportUploadProgress: action,
      reportDownloadProgress: action,
      loading: computed,
      success: computed,
      initialOrLoading: computed,
      setResponse: action,
      clearResponse: action,
      setResult: action,
      _setResult: action,
      response: computed,
      lastPayloadSent: computed,
      clearError: action,
      _handleError: action,
      execCall: action,
    });

    const { call, onResponse, autoClear, defaultResponse } = opts;
    if (!call) {
      throw new Error('"call" parameter should be defined');
    }

    this.call = call;
    this.onResponse = onResponse;
    this.autoClear = autoClear;
    this.defaultResponse = defaultResponse;
  }
}
