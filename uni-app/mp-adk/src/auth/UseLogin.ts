import {type Ref, ref, shallowRef} from 'vue'

export interface LoginInfo {
  code: Ref<string | null>
  authProvider: Ref<string>
  meta: Ref<unknown | null>
}

export async function useLogin(): Promise<LoginInfo> {
  const code = ref(null)
  const authProvider = ref(null)
  const meta = shallowRef(null)

  // 获取 OAuth2 登录服务提供商
  const oauth2Provider = await uni.getProvider({service: 'oauth'})
  const providerName = [...oauth2Provider.provider][0]
  // 如果存在服务提供商，则进行登录操作
  if (providerName)
    return await new Promise((resolve, reject) => {
      uni.login({
        scopes: 'auth_user', // 授权类型，暂定为 auth_user
        timeout: 1000000,
        success: result => {
          code.value = result.code
          meta.value = result
          // 登录凭证 credentials，拿来换取 openId
          resolve({
            code,
            meta,
            authProvider
          })
        },
        fail: reject
      })
    })
  else return Promise.reject('获取平台失败失败')
}
