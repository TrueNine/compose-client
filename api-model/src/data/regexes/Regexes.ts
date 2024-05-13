export class Regexes {
  private static ONE_ONE = '(1[1-9]|[2-9][0-9])'
  private static ZERO_ONE = '(0[1-9]|[1-9][0-9])'
  private static ZERO_ZERO_ZERO_ONE = '(00|0[1-9]|[1-9][0-9])'
  private static YEAR = '(19|20)\\d{2}'
  private static MONTH = '(0[1-9]|1[0-2])'
  private static DAY = '(0[1-9]|[1-2][0-9]|3[0-1])'
  private static CHINA_ID_CARD_PREFIX = `^${this.ONE_ONE}${this.ZERO_ZERO_ZERO_ONE}${this.ZERO_ONE}${this.YEAR}${this.MONTH}${this.DAY}`

  static CHINA_ID_CARD = new RegExp(`${this.CHINA_ID_CARD_PREFIX}$`)
}
