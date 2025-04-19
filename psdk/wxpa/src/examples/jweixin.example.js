!(function (e, n) {
  typeof define == 'function' && (define.amd || define.cmd)
    ? define(() => {
        return n(e)
      })
    : n(e, !0)
})(this, (r, e) => {
  let a, c, n, i, t, o, s, d, l, u, p, f, m, g, h, S, y, I, v, _, w, T
  if (!r.jWeixin) {
    return (
      (a = {
        config: 'preVerifyJSAPI',
        onMenuShareTimeline: 'menu:share:timeline',
        onMenuShareAppMessage: 'menu:share:appmessage',
        onMenuShareQQ: 'menu:share:qq',
        onMenuShareWeibo: 'menu:share:weiboApp',
        onMenuShareQZone: 'menu:share:QZone',
        previewImage: 'imagePreview',
        getLocation: 'geoLocation',
        openProductSpecificView: 'openProductViewWithPid',
        addCard: 'batchAddCard',
        openCard: 'batchViewCard',
        chooseWXPay: 'getBrandWCPayRequest',
        openEnterpriseRedPacket: 'getRecevieBizHongBaoRequest',
        startSearchBeacons: 'startMonitoringBeacons',
        stopSearchBeacons: 'stopMonitoringBeacons',
        onSearchBeacons: 'onBeaconsInRange',
        consumeAndShareCard: 'consumedShareCard',
        openAddress: 'editAddress',
      }),
      (c = (function () {
        let e
        const n = {}
        for (e in a) {
          n[a[e]] = e
        }
        return n
      })()),
      (n = r.document),
      (i = n.title),
      (t = navigator.userAgent.toLowerCase()),
      (f = navigator.platform.toLowerCase()),
      (o = !(!f.match('mac') && !f.match('win'))),
      (s = t.includes('wxdebugger')),
      (d = t.includes('micromessenger')),
      (l = t.includes('android')),
      (u = t.includes('iphone') || t.includes('ipad')),
      (p = (f = t.match(/micromessenger\/(\d+\.\d+\.\d+)/) || t.match(/micromessenger\/(\d+\.\d+)/)) ? f[1] : ''),
      (m = { initStartTime: L(), initEndTime: 0, preVerifyStartTime: 0, preVerifyEndTime: 0 }),
      (g = {
        version: 1,
        appId: '',
        initTime: 0,
        preVerifyTime: 0,
        networkType: '',
        isPreVerifyOk: 1,
        systemType: u ? 1 : l ? 2 : -1,
        clientVersion: p,
        url: encodeURIComponent(location.href),
      }),
      (h = {}),
      (S = { _completes: [] }),
      (y = { state: 0, data: {} }),
      O(() => {
        m.initEndTime = L()
      }),
      (I = !1),
      (v = []),
      (_ = {
        config(e) {
          C('config', (h = e))
          const o = !1 !== h.check
          O(() => {
            if (o) {
              k(
                a.config,
                { verifyJsApiList: A(h.jsApiList), verifyOpenTagList: A(h.openTagList) },
                ((S._complete = function (e) {
                  ;(m.preVerifyEndTime = L()), (y.state = 1), (y.data = e)
                }),
                (S.success = function (e) {
                  g.isPreVerifyOk = 0
                }),
                (S.fail = function (e) {
                  S._fail ? S._fail(e) : (y.state = -1)
                }),
                (t = S._completes).push(() => {
                  B()
                }),
                (S.complete = function (e) {
                  for (let n = 0, i = t.length; n < i; ++n) {
                    t[n]()
                  }
                  S._completes = []
                }),
                S),
              ),
              (m.preVerifyStartTime = L())
            } else {
              y.state = 1
              for (let e = S._completes, n = 0, i = e.length; n < i; ++n) {
                e[n]()
              }
              S._completes = []
            }
            let t
          }),
          _.invoke
          || ((_.invoke = function (e, n, i) {
            r.WeixinJSBridge && WeixinJSBridge.invoke(e, P(n), i)
          }),
          (_.on = function (e, n) {
            r.WeixinJSBridge && WeixinJSBridge.on(e, n)
          }))
        },
        ready(e) {
          ;(y.state != 0 || (S._completes.push(e), !d && h.debug)) && e()
        },
        error(e) {
          p < '6.0.2' || (y.state == -1 ? e(y.data) : (S._fail = e))
        },
        checkJsApi(e) {
          k(
            'checkJsApi',
            { jsApiList: A(e.jsApiList) },
            ((e._complete = function (e) {
              l && (i = e.checkResult) && (e.checkResult = JSON.parse(i))
              let n
              var i = e
              const t = i.checkResult
              for (n in t) {
                const o = c[n]
                o && ((t[o] = t[n]), delete t[n])
              }
            }),
            e),
          )
        },
        onMenuShareTimeline(e) {
          M(
            a.onMenuShareTimeline,
            {
              complete() {
                k(
                  'shareTimeline',
                  {
                    title: e.title || i,
                    desc: e.title || i,
                    img_url: e.imgUrl || '',
                    link: e.link || location.href,
                    type: e.type || 'link',
                    data_url: e.dataUrl || '',
                  },
                  e,
                )
              },
            },
            e,
          )
        },
        onMenuShareAppMessage(n) {
          M(
            a.onMenuShareAppMessage,
            {
              complete(e) {
                e.scene === 'favorite'
                  ? k('sendAppMessage', {
                      title: n.title || i,
                      desc: n.desc || '',
                      link: n.link || location.href,
                      img_url: n.imgUrl || '',
                      type: n.type || 'link',
                      data_url: n.dataUrl || '',
                    })
                  : k(
                      'sendAppMessage',
                      {
                        title: n.title || i,
                        desc: n.desc || '',
                        link: n.link || location.href,
                        img_url: n.imgUrl || '',
                        type: n.type || 'link',
                        data_url: n.dataUrl || '',
                      },
                      n,
                    )
              },
            },
            n,
          )
        },
        onMenuShareQQ(e) {
          M(
            a.onMenuShareQQ,
            {
              complete() {
                k('shareQQ', { title: e.title || i, desc: e.desc || '', img_url: e.imgUrl || '', link: e.link || location.href }, e)
              },
            },
            e,
          )
        },
        onMenuShareWeibo(e) {
          M(
            a.onMenuShareWeibo,
            {
              complete() {
                k('shareWeiboApp', { title: e.title || i, desc: e.desc || '', img_url: e.imgUrl || '', link: e.link || location.href }, e)
              },
            },
            e,
          )
        },
        onMenuShareQZone(e) {
          M(
            a.onMenuShareQZone,
            {
              complete() {
                k('shareQZone', { title: e.title || i, desc: e.desc || '', img_url: e.imgUrl || '', link: e.link || location.href }, e)
              },
            },
            e,
          )
        },
        updateTimelineShareData(e) {
          k('updateTimelineShareData', { title: e.title, link: e.link, imgUrl: e.imgUrl }, e)
        },
        updateAppMessageShareData(e) {
          k('updateAppMessageShareData', { title: e.title, desc: e.desc, link: e.link, imgUrl: e.imgUrl }, e)
        },
        startRecord(e) {
          k('startRecord', {}, e)
        },
        stopRecord(e) {
          k('stopRecord', {}, e)
        },
        onVoiceRecordEnd(e) {
          M('onVoiceRecordEnd', e)
        },
        playVoice(e) {
          k('playVoice', { localId: e.localId }, e)
        },
        pauseVoice(e) {
          k('pauseVoice', { localId: e.localId }, e)
        },
        stopVoice(e) {
          k('stopVoice', { localId: e.localId }, e)
        },
        onVoicePlayEnd(e) {
          M('onVoicePlayEnd', e)
        },
        uploadVoice(e) {
          k('uploadVoice', { localId: e.localId, isShowProgressTips: e.isShowProgressTips == 0 ? 0 : 1 }, e)
        },
        downloadVoice(e) {
          k('downloadVoice', { serverId: e.serverId, isShowProgressTips: e.isShowProgressTips == 0 ? 0 : 1 }, e)
        },
        translateVoice(e) {
          k('translateVoice', { localId: e.localId, isShowProgressTips: e.isShowProgressTips == 0 ? 0 : 1 }, e)
        },
        chooseImage(e) {
          k(
            'chooseImage',
            { scene: '1|2', count: e.count || 9, sizeType: e.sizeType || ['original', 'compressed'], sourceType: e.sourceType || ['album', 'camera'] },
            ((e._complete = function (e) {
              if (l) {
                const n = e.localIds
                try {
                  n && (e.localIds = JSON.parse(n))
                } catch (e) {}
              }
            }),
            e),
          )
        },
        getLocation(e) {
          ;(e = e || {}),
          k(
            a.getLocation,
            { type: e.type || 'wgs84' },
            ((e._complete = function (e) {
              delete e.type
            }),
            e),
          )
        },
        previewImage(e) {
          k(a.previewImage, { current: e.current, urls: e.urls }, e)
        },
        uploadImage(e) {
          k('uploadImage', { localId: e.localId, isShowProgressTips: e.isShowProgressTips == 0 ? 0 : 1 }, e)
        },
        downloadImage(e) {
          k('downloadImage', { serverId: e.serverId, isShowProgressTips: e.isShowProgressTips == 0 ? 0 : 1 }, e)
        },
        getLocalImgData(e) {
          !1 === I
            ? ((I = !0),
              k(
                'getLocalImgData',
                { localId: e.localId },
                ((e._complete = function (e) {
                  let n
                  ;(I = !1), v.length > 0 && ((n = v.shift()), wx.getLocalImgData(n))
                }),
                e),
              ))
            : v.push(e)
        },
        getNetworkType(e) {
          k(
            'getNetworkType',
            {},
            ((e._complete = function (e) {
              const n = e
              var e = n.errMsg
              var i = ((n.errMsg = 'getNetworkType:ok'), n.subtype)
              if ((delete n.subtype, i)) {
                n.networkType = i
              } else {
                var i = e.indexOf(':')
                const t = e.substring(i + 1)
                switch (t) {
                  case 'wifi':
                  case 'edge':
                  case 'wwan':
                    n.networkType = t
                    break
                  default:
                    n.errMsg = 'getNetworkType:fail'
                }
              }
            }),
            e),
          )
        },
        openLocation(e) {
          k(
            'openLocation',
            { latitude: e.latitude, longitude: e.longitude, name: e.name || '', address: e.address || '', scale: e.scale || 28, infoUrl: e.infoUrl || '' },
            e,
          )
        },
        hideOptionMenu(e) {
          k('hideOptionMenu', {}, e)
        },
        showOptionMenu(e) {
          k('showOptionMenu', {}, e)
        },
        closeWindow(e) {
          k('closeWindow', {}, (e = e || {}))
        },
        hideMenuItems(e) {
          k('hideMenuItems', { menuList: e.menuList }, e)
        },
        showMenuItems(e) {
          k('showMenuItems', { menuList: e.menuList }, e)
        },
        hideAllNonBaseMenuItem(e) {
          k('hideAllNonBaseMenuItem', {}, e)
        },
        showAllNonBaseMenuItem(e) {
          k('showAllNonBaseMenuItem', {}, e)
        },
        scanQRCode(e) {
          k(
            'scanQRCode',
            { needResult: (e = e || {}).needResult || 0, scanType: e.scanType || ['qrCode', 'barCode'] },
            ((e._complete = function (e) {
              let n
              u && (n = e.resultStr) && ((n = JSON.parse(n)), (e.resultStr = n && n.scan_code && n.scan_code.scan_result))
            }),
            e),
          )
        },
        openAddress(e) {
          k(
            a.openAddress,
            {},
            ((e._complete = function (e) {
              ;((e = e).postalCode = e.addressPostalCode),
              delete e.addressPostalCode,
              (e.provinceName = e.proviceFirstStageName),
              delete e.proviceFirstStageName,
              (e.cityName = e.addressCitySecondStageName),
              delete e.addressCitySecondStageName,
              (e.countryName = e.addressCountiesThirdStageName),
              delete e.addressCountiesThirdStageName,
              (e.detailInfo = e.addressDetailInfo),
              delete e.addressDetailInfo
            }),
            e),
          )
        },
        openProductSpecificView(e) {
          k(a.openProductSpecificView, { pid: e.productId, view_type: e.viewType || 0, ext_info: e.extInfo }, e)
        },
        addCard(e) {
          for (var n = e.cardList, i = [], t = 0, o = n.length; t < o; ++t) {
            var r = n[t]
            var r = { card_id: r.cardId, card_ext: r.cardExt }
            i.push(r)
          }
          k(
            a.addCard,
            { card_list: i },
            ((e._complete = function (e) {
              if ((n = e.card_list)) {
                for (var n, i = 0, t = (n = JSON.parse(n)).length; i < t; ++i) {
                  const o = n[i]
                  ;(o.cardId = o.card_id), (o.cardExt = o.card_ext), (o.isSuccess = !!o.is_succ), delete o.card_id, delete o.card_ext, delete o.is_succ
                }
                ;(e.cardList = n), delete e.card_list
              }
            }),
            e),
          )
        },
        chooseCard(e) {
          k(
            'chooseCard',
            {
              app_id: h.appId,
              location_id: e.shopId || '',
              sign_type: e.signType || 'SHA1',
              card_id: e.cardId || '',
              card_type: e.cardType || '',
              card_sign: e.cardSign,
              time_stamp: `${e.timestamp}`,
              nonce_str: e.nonceStr,
            },
            ((e._complete = function (e) {
              ;(e.cardList = e.choose_card_info), delete e.choose_card_info
            }),
            e),
          )
        },
        openCard(e) {
          for (var n = e.cardList, i = [], t = 0, o = n.length; t < o; ++t) {
            var r = n[t]
            var r = { card_id: r.cardId, code: r.code }
            i.push(r)
          }
          k(a.openCard, { card_list: i }, e)
        },
        consumeAndShareCard(e) {
          k(a.consumeAndShareCard, { consumedCardId: e.cardId, consumedCode: e.code }, e)
        },
        chooseWXPay(e) {
          k(a.chooseWXPay, x(e), e), B({ jsApiName: 'chooseWXPay' })
        },
        openEnterpriseRedPacket(e) {
          k(a.openEnterpriseRedPacket, x(e), e)
        },
        startSearchBeacons(e) {
          k(a.startSearchBeacons, { ticket: e.ticket }, e)
        },
        stopSearchBeacons(e) {
          k(a.stopSearchBeacons, {}, e)
        },
        onSearchBeacons(e) {
          M(a.onSearchBeacons, e)
        },
        openEnterpriseChat(e) {
          k('openEnterpriseChat', { useridlist: e.userIds, chatname: e.groupName }, e)
        },
        launchMiniProgram(e) {
          k(
            'launchMiniProgram',
            {
              targetAppId: e.targetAppId,
              path: (function (e) {
                let n
                if (typeof e == 'string' && e.length > 0) {
                  return (n = e.split('?')[0]), (n += '.html'), void 0 !== (e = e.split('?')[1]) ? `${n}?${e}` : n
                }
              })(e.path),
              envVersion: e.envVersion,
            },
            e,
          )
        },
        openBusinessView(e) {
          k(
            'openBusinessView',
            { businessType: e.businessType, queryString: e.queryString || '', envVersion: e.envVersion },
            ((e._complete = function (n) {
              if (l) {
                const e = n.extraData
                if (e) {
                  try {
                    n.extraData = JSON.parse(e)
                  } catch (e) {
                    n.extraData = {}
                  }
                }
              }
            }),
            e),
          )
        },
        miniProgram: {
          navigateBack(e) {
            ;(e = e || {}),
            O(() => {
              k('invokeMiniProgramAPI', { name: 'navigateBack', arg: { delta: e.delta || 1 } }, e)
            })
          },
          navigateTo(e) {
            O(() => {
              k('invokeMiniProgramAPI', { name: 'navigateTo', arg: { url: e.url } }, e)
            })
          },
          redirectTo(e) {
            O(() => {
              k('invokeMiniProgramAPI', { name: 'redirectTo', arg: { url: e.url } }, e)
            })
          },
          switchTab(e) {
            O(() => {
              k('invokeMiniProgramAPI', { name: 'switchTab', arg: { url: e.url } }, e)
            })
          },
          reLaunch(e) {
            O(() => {
              k('invokeMiniProgramAPI', { name: 'reLaunch', arg: { url: e.url } }, e)
            })
          },
          postMessage(e) {
            O(() => {
              k('invokeMiniProgramAPI', { name: 'postMessage', arg: e.data || {} }, e)
            })
          },
          getEnv(e) {
            O(() => {
              e({ miniprogram: r.__wxjs_environment === 'miniprogram' })
            })
          },
        },
      }),
      (w = 1),
      (T = {}),
      n.addEventListener(
        'error',
        (e) => {
          let n, i, t
          l
          || ((t = (n = e.target).tagName), (i = n.src), t != 'IMG' && t != 'VIDEO' && t != 'AUDIO' && t != 'SOURCE')
          || (i.includes('wxlocalresource://')
            && (e.preventDefault(),
            e.stopPropagation(),
            (t = n['wx-id']) || ((t = w++), (n['wx-id'] = t)),
            T[t]
            || ((T[t] = !0),
            wx.ready(() => {
              wx.getLocalImgData({
                localId: i,
                success(e) {
                  n.src = e.localData
                },
              })
            }))))
        },
        !0,
      ),
      n.addEventListener(
        'load',
        (e) => {
          let n
          l || ((n = (e = e.target).tagName), e.src, n != 'IMG' && n != 'VIDEO' && n != 'AUDIO' && n != 'SOURCE') || ((n = e['wx-id']) && (T[n] = !1))
        },
        !0,
      ),
      e && (r.wx = r.jWeixin = _),
      _
    )
  }
  function k(n, e, i) {
    r.WeixinJSBridge
      ? WeixinJSBridge.invoke(n, P(e), (e) => {
          V(n, e, i)
        })
      : C(n, i)
  }
  function M(n, i, t) {
    r.WeixinJSBridge
      ? WeixinJSBridge.on(n, (e) => {
          t && t.trigger && t.trigger(e), V(n, e, i)
        })
      : C(n, t || i)
  }
  function P(e) {
    return (
      ((e = e || {}).appId = h.appId),
      (e.verifyAppId = h.appId),
      (e.verifySignType = 'sha1'),
      (e.verifyTimestamp = `${h.timestamp}`),
      (e.verifyNonceStr = h.nonceStr),
      (e.verifySignature = h.signature),
      e
    )
  }
  function x(e) {
    return { timeStamp: `${e.timestamp}`, nonceStr: e.nonceStr, package: e.package, paySign: e.paySign, signType: e.signType || 'SHA1' }
  }
  function V(e, n, i) {
    ;(e != 'openEnterpriseChat' && e !== 'openBusinessView') || (n.errCode = n.err_code), delete n.err_code, delete n.err_desc, delete n.err_detail
    let t = n.errMsg
    var e
        = (t
          || ((t = n.err_msg),
          delete n.err_msg,
          (t = (function (e, n) {
            let i = c[e]
            i && (e = i)
            i = 'ok'
            {
              let t
              n
              && ((t = n.indexOf(':')),
              ((i = (i = (i
                    = (i
                      = (i = (i = (i = n.substring(t + 1)) == 'confirm' ? 'ok' : i) == 'failed' ? 'fail' : i).includes('failed_')
                    ? i.substring(7)
                    : i).includes('fail_')
                  ? i.substring(5)
                  : i).replace(/_/g, ' ')).toLowerCase())
                != 'access denied'
                && i != 'no permission to execute')
              || (i = 'permission denied'),
              (i = e == 'config' && i == 'function not exist' ? 'ok' : i) == '')
            && (i = 'fail')
            }
            return (n = `${e}:${i}`)
          })(e, t)),
          (n.errMsg = t)),
        (i = i || {})._complete && (i._complete(n), delete i._complete),
        (t = n.errMsg || ''),
        h.debug && !i.isInnerInvoke && alert(JSON.stringify(n)),
        t.indexOf(':'))
    switch (t.substring(e + 1)) {
      case 'ok':
        i.success && i.success(n)
        break
      case 'cancel':
        i.cancel && i.cancel(n)
        break
      default:
        i.fail && i.fail(n)
    }
    i.complete && i.complete(n)
  }
  function A(e) {
    if (e) {
      for (let n = 0, i = e.length; n < i; ++n) {
        var t = e[n]
        var t = a[t]
        t && (e[n] = t)
      }
      return e
    }
  }
  function C(e, n) {
    let i
    !h.debug || (n && n.isInnerInvoke) || ((i = c[e]) && (e = i), n && n._complete && delete n._complete, console.log(`"${e}",`, n || ''))
  }
  function B(n) {
    let i
    o
    || s
    || h.debug
    || p < '6.0.2'
    || g.systemType < 0
    || ((i = new Image()),
    (g.appId = h.appId),
    (g.initTime = m.initEndTime - m.initStartTime),
    (g.preVerifyTime = m.preVerifyEndTime - m.preVerifyStartTime),
    _.getNetworkType({
      isInnerInvoke: !0,
      success(e) {
        g.networkType = e.networkType
        e
            = `https://open.weixin.qq.com/sdk/report?v=${
            g.version
          }&o=${
            g.isPreVerifyOk
          }&s=${
            g.systemType
          }&c=${
            g.clientVersion
          }&stepNodes=${
            g.appId
          }&n=${
            g.networkType
          }&i=${
            g.initTime
          }&p=${
            g.preVerifyTime
          }&u=${
            g.url
          }&jsapi_name=${
            n ? n.jsApiName : ''}`
        i.src = e
      },
    }))
  }
  function L() {
    return new Date().getTime()
  }
  function O(e) {
    d && (r.WeixinJSBridge ? e() : n.addEventListener && n.addEventListener('WeixinJSBridgeReady', e, !1))
  }
})
