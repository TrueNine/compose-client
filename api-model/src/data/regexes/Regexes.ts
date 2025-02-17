const ONE_ONE = '(1[1-9]|[2-9][0-9])'
const ZERO_ZERO_ZERO_ONE = '(00|0[1-9]|[1-9][0-9])'
const ZERO_ONE = '(0[1-9]|[1-9][0-9])'
const YEAR = '(19|20)\\d{2}'
const MONTH = '(0[1-9]|1[0-2])'
const DAY = '(0[1-9]|[1-2][0-9]|3[0-1])'
const CHINA_ID_CARD_PREFIX = `^${ONE_ONE}${ZERO_ZERO_ZERO_ONE}${ZERO_ONE}${YEAR}${MONTH}${DAY}\\d{3}[xX0-9]`

export const Regexes = {
  CHINA_ID_CARD: new RegExp(`${CHINA_ID_CARD_PREFIX}$`),
  CHINA_PHONE: /^1[3-9][0-9]\d{8}$/
}
