type LatLngDataTyping = TMap.LatLngDataTyping;
type MapStyleIds = TMap.MapStyleIds;

/**
 * # 点图形数据
 */
export interface PointGeometry {
    /**
     * ## 标注点的图层内绘制顺序
     */
    rank?: number;
    position: LatLngDataTyping;

    /**
     * ## 点图形数据的标志信息 不可重复
     * 若id重复后面的id会被重新分配一个新id
     *
     * 若没有会随机生成一个。
     */
    id?: string;
    styleId?: MapStyleIds;

    /**
     * ## 标注点属性顺序
     */
    properties?: object;

    /**
     * ## 动画相关的，自己强转吧
     */
    markerAnimation?: unknown;
}
