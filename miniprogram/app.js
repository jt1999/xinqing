//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    } 
    // 获取用户信息
    wx.getSetting({
      success: res => {
        var that = this;
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log(res)
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          wx.switchTab({
            url: '../center/center'
          })
        }

      }
    })
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude:true,
      success(res) {
        console.log(res)
        let location={
          latitude: res.latitude,
          longitude: res.longitude
        }
        that.globalData.location = location
      }
    })
    this.onGetOpenid();
    // this.globalData = {}
  },
  onGetOpenid: function () {
    let that=this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        that.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  globalData:{
    userInfo:null,
    openid:null,
    location:null,
    access_token:null
  }
})
