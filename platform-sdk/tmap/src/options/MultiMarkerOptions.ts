import Map = TMap.Map;
/**
 * # MultiMarker的配置参数
 */
export interface MultiMarkerOptions {
    /**
     * ## 图层id
     * 若没有会自动分配一个
     */
    id?: string;
    map: Map;
    zIndex?: number;
    styles?: Record<string, string>;

    /**
     * ## 开启内部标记碰撞
     */
    enableCollision?: boolean;
    geometries?: unknown[];
}
