import {WGS84} from '@compose/api-model'

/**
 * # 腾讯地图 SDK挂载
 * 他妈的邪了门，居然就他妈挂载在 window 上
 * @author TrueNine
 * @since 2023-05-21
 */
declare global {
  export interface Window {
    TMap: unknown
  }
}

/**
 * ## 腾讯地图抽象事件接口
 */
export interface AbstractTencetnEvent<K extends string, E extends Event, T extends EventTarget> {
  type: K
  target: T
  originalEvent: E
}

// ====================================

/**
 * # 全局地图操作句柄
 */
export declare namespace TMap {
  // ====================================

  /**
   * # 地图缓动变化配置参数
   * 可控制动画时长等。
   */
  export interface EaseOptions {
    /**
     * ## 毫秒时长 默认 500 ms
     */
    duration?: number
  }

  type PointDataTyping = WGS84

  /**
   * ## x y 标记
   */
  export class Point implements PointDataTyping {
    x: number
    y: number
    getX(): number
    getY(): number
    equals(other: Point): boolean
    clone(): Point
    toString(): string
  }

  /**
   * ## 数据常量
   */
  export namespace constants {
    /**
     * ### 地图缩放类型
     */
    export enum MAP_ZOOM_TYPE {
      /**
       * 以鼠标指针为基点进行缩放
       */
      DEFAULT,
      /**
       * 以地图中心为基点
       */
      CENTER
    }
  }

  // ====================================

  /**
   * # MultiMarker的配置参数
   */
  export interface MultiMarkerOptions {
    /**
     * ## 图层id
     * 若没有会自动分配一个
     */
    id?: string
    map: Map
    zIndex?: number
    styles?: Record<string, string>

    /**
     * ## 开启内部标记碰撞
     */
    enableCollision?: boolean
    geometries?: unknown[]
  }

  /**
   * # 多 maker 图层
   */
  export class MultiMarker {
    constructor(options: MultiMarkerOptions)
    add(geometries: PointGeometry | PointGeometry[]): this
    setMap(map: Map): this
    setGeometries(geometries: PointGeometry[]): this
    setVisible(visible: boolean): this
    getMap(): Map
    getId(): string
    getGeometries(): PointGeometry[]
    getStyles(): unknown
    getVisible(): boolean
    getGeometryById(id: string): PointGeometry | null
    updateGeometries(geometry: PointGeometry[]): this
    remove(ids: string[]): this
    moveAlong(param: unknown, options: unknown): void
    stopMove(): this
    pauseMove(): this
    resumeMove(): this
    on<K extends keyof MultiMarkerEvents>(eventName: K, listener: (ev: MultiMarkerEvents[K]) => void): this
    off<K extends keyof MultiMarkerEvents>(eventName: K, listener: (ev: MultiMarkerEvents[K]) => void): this
  }

  /**
   * # 点图形数据
   */
  export interface PointGeometry {
    /**
     * ## 标注点的图层内绘制顺序
     */
    rank?: number
    position: LatLngDataTyping
    /**
     * ## 点图形数据的标志信息 不可重复
     * 若id重复后面的id会被重新分配一个新id
     *
     * 若没有会随机生成一个。
     */
    id?: string
    styleId?: MapStyleIds
    /**
     * ## 标注点属性顺序
     */
    properties?: object

    /**
     * ## 动画相关的，自己强转吧
     */
    markerAnimation?: unknown
  }

  export type GeometryOverlayEvent<K extends string> = {
    geometry: unknown
    latLng: LatLngDataTyping
    point: PointDataTyping
  } & AbstractTencetnEvent<K, MouseEvent | TouchEvent, EventTarget>

  export interface MultiMarkerEvents {
    click: GeometryOverlayEvent<'click'>
    dblclick: GeometryOverlayEvent<'dbclick'>
    mousedown: GeometryOverlayEvent<'mousedown'>
    mouseup: GeometryOverlayEvent<'mouseup'>
    mousemove: GeometryOverlayEvent<'mousemove'>
    hover: GeometryOverlayEvent<'hover'>
    touchstart: GeometryOverlayEvent<'touchstart'>
  }

  // ====================================

  /**
   * # 用于创建信息窗覆盖物
   */
  export class InfoWindow {
    constructor(options: InfoWindowOptions)
    setPosition(position: LatLngDataTyping): void
    setContent(content: string): void
    setMap(map: Map): void
    getMap(): Map
    open(): void
    close(): void
    destroy(): void
    on<K extends keyof InfoWindowEvents>(name: K, listener: (ev: InfoWindowEvents[K]) => void): this
  }

  /**
   * ## 信息窗口点击事件
   */
  export interface InfoWindowEvents {
    closeclick: null
  }

  /**
   * ## 信息窗配置参数
   */
  export interface InfoWindowOptions {
    map: Map
    position: LatLngDataTyping
    /**
     * ## 信息窗显示内容
     * 默认为空字符串
     *
     * 当 enableCustom 为 true 时，需传入信息窗体的dom字符串
     */
    content?: string
    enableCustom?: boolean
    zIndex?: number
    offset?: WGS84
  }

  // ====================================

  export interface LatLngDataTyping {
    /**
     * ## 维度
     */
    lat: number
    /**
     * ## 经度
     */
    lng: number
    /**
     * ## 高度??
     */
    readonly height?: number
  }

  /**
   * # 腾讯坐标系 采用 GCJ02
   *
   * [国测局，要抱怨找他们去](https://www.gov.cn/govweb/fwxx/bw/gjchj/)
   *
   * - lat 维度
   * - lng 经度
   *
   * *一定不要搞混*
   */
  export class LatLng implements LatLngDataTyping {
    /**
     * @param lat 维度
     * @param lng 精度
     * @param height 高度（选填）
     */
    constructor(lat: number, lng: number, height?: number)
    /**
     * ## 维度
     */
    lat: number
    /**
     * ## 经度
     */
    lng: number
    /**
     * ## 高度??
     */
    readonly height?: number
    getLat(): number
    getLng(): number
  }

  // ====================================

  /**
   * # 地图
   */
  export class Map {
    constructor(html: string | HTMLElement, mode: MapOptions)
    /**
     * ## 设置地图的显示模式
     * @param viewMode 显示模式 2d 3d
     */
    setViewMode(viewMode: ViewMode): this

    /**
     * ## 设置3d视角的俯仰角
     * @param pitch 3d视角的俯仰角
     */
    setPitch(pitch: number): this
    /**
     * ## 设置地图样式id
     * @param styleId 样式 id
     */
    setMapStyleId(styleId: MapStyleIds): this
    /**
     * ## 销毁地图
     */
    destroy(): void
    /**
     * ## 将地图中心平滑移动到指定的经纬度坐标
     * @param latLng 经纬度
     */
    panTo(latLng: TMap.LatLngDataTyping, ease?: TMap.EaseOptions): this

    zoomTo(zoom: number, opts: EaseOptions): this

    /**
     * ## 绑定地图事件
     * @param eventName 地图事件名
     * @param listener 地图事件回调
     */
    on<K extends keyof MapEvents>(eventName: K, listener: (ev: MapEvents[K]) => void): this

    startAnimation(keyFrames: unknown[], opts: unknown): this
    stopAnimation(): this
    getCenter(): LatLng
    setCenter(center: LatLngDataTyping): this
  }

  /**
   * 2d 3d 显示模式
   */
  export type ViewMode = '2D' | '3D' | '2d' | '3d'

  /**
   * 地图 样式id，需要去后台申请，然后自定义id
   */
  export type MapStyleIds = `style${number}`

  /**
   * ## 地图事件类型
   */
  export interface MapEvent<K extends string> extends AbstractTencetnEvent<K, Event, EventTarget> {
    latLng: LatLng
    poi: string | null
    point: WGS84 | null
  }

  /**
   * 地图事件
   */
  export interface MapEvents {
    /**
     * 地图进入空闲状态
     */
    idle: null
    /**
     * 可见瓦片加载完毕后
     */
    tilesloaded: null
    click: MapEvent<'click'>
    rightclick: MapEvent<'rightclick'>
    dblclick: MapEvent<'dblclick'>
  }

  /**
   * # 地图配置参数
   *
   * 通过这个参数来控制初始化地图的中心点、缩放级别、俯仰角度等
   */
  export interface MapOptions {
    /**
     * ## 设置地图中心点坐标
     */
    center: LatLngDataTyping
    /**
     * ## 地图中心与地图的偏移 xy
     */
    offset?: PointDataTyping
    /**
     * ## 地图俯仰角
     */
    pitch?: number
    /**
     * ## 设置地图缩放级别
     */
    zoom?: number
    /**
     * ## 2d/3d 展示模式
     */
    viewMode?: ViewMode
    /**
     * ## 地图样式 id
     */
    mapStyleId?: MapStyleIds
    /**
     * ## 最小缩放级别
     */
    minZone?: number
    /**
     * ## 最大缩放级别
     */
    maxZone?: number
    /**
     * ## 地图在水平面上的旋转角度
     * 顺时针方向为正，默认为0
     */
    rotation?: number
    /**
     * ## 地图俯仰角度
     * 取值范围为0~80，默认为0
     */
    scale?: number
    /**
     * ## 鼠标拖动地图是否支持
     */
    draggable?: boolean
    /**
     * ## 鼠标滚轮缩放是否支持
     */
    scrollable?: boolean
    /**
     * ## 调整俯仰角度是否支持
     */
    pitchable?: boolean
    /**
     * ## 俯仰角设置是否支持
     */
    rotatable?: boolean
    /**
     * ## 双击缩放是否支持
     */
    doubleClickZoom?: boolean
    /**
     * ## 地图控件是否显示
     */
    showControl?: boolean
    renderOptions?: unknown
    clip?: unknown
    /**
     * ## 地图缩放类型
     */
    mapZoomType?: constants.MAP_ZOOM_TYPE
  }
}
