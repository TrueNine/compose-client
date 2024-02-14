/**
 * ## 腾讯地图抽象事件接口
 */
export interface ITencentEvent<K extends string, E extends Event, T extends EventTarget> {
    type: K;
    target: T;
    originalEvent: E;
}
