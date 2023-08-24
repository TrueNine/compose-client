declare module 'coordtransform' {
  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
   * 即 百度 转 谷歌、高德
   * @param bd_lng
   * @param bd_lat
   * @returns {*[]}
   */
  export function bd09togcj02(bd_lon: number, bd_lat: number): [number, number]
  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即 谷歌、高德 转 百度
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  export function gcj02tobd09(lng: number, lat: number): [number, number]
  /**
   * GCJ-02 转换为 WGS-84
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  export function gcj02towgs84(lng: number, lat: number): [number, number]
  /**
   * WGS-84 转 GCJ-02
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  export function wgs84togcj02(lng: number, lat: number): [number, number]
}
