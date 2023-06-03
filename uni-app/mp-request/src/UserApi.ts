import {useGetTokenApi} from './Requester'
import type {UseRequestReturn} from '@compose/uni-mp-adk'

/**
 * # 用户接口
 */
export const UserController = {
  /**
   * ## 账号密码登录
   * @param account 账户
   * @param password 密码
   * @returns 登录后的请求头
   */
  loginByAccount: (account: string, password: string): UseRequestReturn<unknown> =>
    useGetTokenApi(`v1/user/loginByAccount/${account}`).post({password}).formData(),
  /**
   * 通过微信 openId 登录
   * @param wechatCredentialsCode 微信登录 code 凭证
   * @returns
   */
  loginByWechatOpenId: (wechatCredentialsCode: string): UseRequestReturn<unknown> =>
    useGetTokenApi(`v1/user/loginByWechatOpenId`).post({wechatCredentialsCode}).formData()
}
