export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  errorColor: string
  warningColor: string
  /**
   * 亮色主题
   */
  light: ThemeConfig
  /**
   * 暗色主题
   */
  dark: ThemeConfig
}
