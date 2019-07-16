// pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    showload: true,
    pageIndex: 1,
    totalPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSessionKey();
  },
  onShow: function() {
    this.setData({
      list: [],
      showload: true,
      pageIndex: 1,
      totalPage: 1
    })
    this.selectList(1)
  },
  getSessionKey: function() {
    let that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxa56b0c68dfeeb48f&secret=1e89cee20b86c1afb68b2299f5e092bd',
      success: function(res) {
        console.log(res)
        app.globalData.access_token = res.data.access_token;
      }
    })
  },

  selectList: function(number) {
    let that = this;
    wx.cloud.callFunction({
      name: 'select',
      data: {
        pageIndex: number
      }
    }).then(res => {
      console.log(res)
      var result = res.result.data;
      var myResult = that.data.list;
      //处理图片
      var img = [];
      result.forEach((item, i) => {

        img = JSON.parse(item.images);
        var obj = {
          images: img,
          _id: item._id,
          title: item.title,
          createTime: item.createTime
        }
        if (img.length > 0) {
          obj.imgError = false
        } else {
          obj.imgError = true
        }
        myResult.push(obj)

      })
      this.setData({
        list: myResult,
        showload: res.result.hasMore,
        totalPage: res.result.totalPage,
        pageIndex: number
      })
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()

    })
  },
  bindErrorImg: function(e) {
    var index = e.currentTarget.dataset.errindex;
    var list = this.data.list;
    list[index].isError = true;
    this.setData({
      list: list
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    const that = this
    that.setData({
      hasMore: true,
      list: [],
      pageIndex: 1,
      totalPage: 1
    })
    that.selectList(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    const that = this
    if (that.data.totalPage != that.data.pageIndex) {
      let number = that.data.pageIndex + 1;
      that.selectList(number)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this;
    let sharePath = 'pages/home/home'
    return {
      title: '萝卜亭心情',
      path: sharePath,
      success: function() {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '分享失败',
        })
      }
    }
  }
})