import type { HttpUrl, SafeAny } from "@compose/api-types";

export class SseReceiver {
    private readonly _e: EventSource;
    private readonly _url: HttpUrl;
    private readonly _init?: EventSourceInit;

    get initParam() {
        return this._init;
    }

    get url() {
        return this._url;
    }

    get handle() {
        return this._e;
    }

    onOpen(c: (this: EventSource, ev: Event) => SafeAny) {
        this.handle.onopen = c;
    }

    onMessage<T = SafeAny>(c: (this: EventSource, ev: MessageEvent<T>) => SafeAny) {
        this.handle.onmessage = c;
    }

    onError(a: (this: EventSource, event: Event) => SafeAny) {
        this.handle.onerror = a;
    }

    constructor(url: HttpUrl, init?: EventSourceInit) {
        this._url = url;
        this._init = init;
        this._e = new EventSource(url, init);
    }
}
