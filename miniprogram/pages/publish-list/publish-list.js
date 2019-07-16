// pages/publish-list/publish-list.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    showload:true,
    pageIndex:1,
    totalPage:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow: function() {
    console.log('onshow')
    this.setData({
      hasMore: true,
      list: [],
      pageIndex: 1,
      totalPage: 1
    })
    this.selectList(1)
  },

  selectList: function(number) {
    let that=this;
   wx.cloud.callFunction({
     name:'select',
     data:{
       pageIndex:number,
       _openid: app.globalData.openid
     }
   }).then(res=>{
     console.log(res)
       var result = res.result.data;
      var myResult =that.data.list;
      //处理图片
      var img = [];
      result.forEach((item, i) => {
        if (item._openid == app.globalData.openid) {
          img = JSON.parse(item.images);
          
          var obj = {
            images: img,
            _id: item._id,
            title:item.title,
            createTime: item.createTime,
            avatarUrl: item.avatarUrl
          }
          if(img.length>0){
            obj.imgError=false
          }else{
            obj.imgError=true
          }
          myResult.push(obj)
        }
      })
      this.setData({
        list: myResult,
        showload:res.result.hasMore,
        totalPage: res.result.totalPage,
        pageIndex:number
      })
     wx.hideNavigationBarLoading()
     wx.stopPullDownRefresh()
    
   })
  },
  bindErrorImg:function(e){
    var index = e.currentTarget.dataset.errindex;
    var list=this.data.list;
    list[index].isError=true;
    this.setData({
      list:list
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    const that = this
    that.setData({
      hasMore:true,
      list:[],
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
    if(that.data.totalPage!=that.data.pageIndex){
      let number = that.data.pageIndex + 1;
      that.selectList(number)
    }
  },

})