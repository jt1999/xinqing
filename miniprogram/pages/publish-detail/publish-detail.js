// pages/publish-detail/publish-detail.js
const app = getApp();
const db = wx.cloud.database()
const utils=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: null,
    images:[],
    id: "",
    openid: null,
    isLike:false,
    likeMyMessage:null,
    isMy:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.id) {
      this.setData({
        id: options.id,
        openid:app.globalData.openid
      })
      this.selectById(options.id)
    }
    if(options.type=='my'){
      this.setData({
        isMy:true
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  deleteById: function () {
    let that = this;
    const db = wx.cloud.database()
    db.collection('news').doc(that.data.id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000);
          }
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },
  selectById:function(id){
    wx.showLoading({
      title: '正在加载',
    })
    let that=this;
    db.collection('news').where({
      _id: id
    }).get({
      success: res => {
        console.log("详情："+id,res)
        var result = res.data[0];
        console.log(result)
        that.setData({
          message:result,
          images: JSON.parse(result.images)
        })
        this.selectCount()
        wx.hideLoading()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
        wx.hideLoading()
      }
    })
  },
  like:function(){
    //判断是否授权
    if(app.globalData.userInfo==null){
      wx.showModal({
        title: '系统提示',
        content: '您暂未授权，请前往【个人中心】授权',
        success:function(res){
            if(res.confirm){
              wx.switchTab({
                url: '../center/center'
              })
            }
        }
      })
    }
    
    const newCount = Number(this.data.message.count )+ 1
    db.collection('news').doc(this.data.id).update({
      data: {
        count: newCount
      },
      success: res => {
        this.setData({
          ["message.count"]: newCount,
          isLike:true
        })
        wx.showToast({
          title: '哇哦！简直就是我知音呀~~~',
          icon:'none'
        })
        this.addLike()
      },
      fail: err => {
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  cancelLike(){
    const newCount = Number(this.data.message.count) - 1
    db.collection('news').doc(this.data.id).update({
      data: {
        count: newCount
      },
      success: res => {
        this.setData({
          ["message.count"]: newCount,
          isLike: false
        })
        wx.showToast({
          title: '很可惜~你失去了我！',
          icon: 'none'
        })
        this.removeLike()
      },
      fail: err => {
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  addLike:function(){
    wx.cloud.callFunction({
      name: 'addLike',
      data: {
        newsId: this.data.id,
        likeLogo: app.globalData.userInfo.avatarUrl,
        likeName: app.globalData.userInfo.nickName,
        likeTime: utils.getNowDate(new Date()),
        openid:this.data.openid
      }
    }).then(res => {
      console.log(res)
      })
  },
  removeLike:function(){
    wx.cloud.callFunction({
      name: 'removeLike',
      data: {
        likeId: this.data.likeMyMessage._id,
      }
    }).then(res => {
      console.log(res)
    })
  },
  selectCount:function(){
    wx.cloud.callFunction({
      name: 'likeCount',
      data: {
        newsId: this.data.id,
        openid: this.data.openid
      }
    }).then(res => {
      //已经点过赞了
      if(res.result.likeCount!=0){
        this.setData({
          isLike:true,
          likeMyMessage:res.result.data[0]
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this;
    let sharePath = 'pages/publish-detail/publish-detail?id=' + that.data.id;
    if(that.data.isMy){
      sharePath=sharePath+'&type=my'
    }
    return {
      title: '萝卜亭心情',
      path: sharePath,
      success: function () {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '分享失败',
        })
      }
    }
  }
})