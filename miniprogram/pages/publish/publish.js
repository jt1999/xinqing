// pages/publish/publish.js
const app = getApp();
const utils = require('../../utils/util.js');
var fileIDs = new Array();

const amapWx = require('../../utils/amap-wx.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    uploadImgs: [],
    images: [],
    openid: '',
    userInfo: {},
    hiddenUpload: false,
    id: null,
    isClick: false,
    location: '',
    isLocation: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(app.globalData.userInfo)
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid,
        userInfo: app.globalData.userInfo,
      })
    }
    if (options.id) {
      this.setData({
        id: options.id
      })
      this.selectById(options.id)
    }
    let that = this;
    var locationString = app.globalData.location.longitude + "," + app.globalData.location.latitude;
    var myAmapFun = new amapWx.AMapWX({
      key: '0c8fd5d93101af71dc84fbc63805f05b'
    });
    myAmapFun.getRegeo({
      location: locationString,
      success: function(data) {
        var result = data;
        if (result.length > 0) {
          that.setData({
            location: result[0].desc //
          })
        }
      },
      fail: function(info) {
        //失败回调
        console.log(info)
      }
    })

  },
  sendMessage: function(openId, formId) {
    let that=this;
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + app.globalData.access_token,
      method:'post',
      data:{
        access_token:app.globalData.access_token,
        touser:openId,
        template_id:'NafoeqSeD1GQNlJ9FLqEVhTOLGeKwjVkBuvWS2NnkFY',
        form_id:formId,
        data: {
          "keyword1": {
            "value": "339208499"
          },
          "keyword2": {
            "value": "2015年01月05日 12:30"
          },
          "keyword3": {
            "value": "腾讯微信总部"
          },
          "keyword4": {
            "value": "广州市海珠区新港中路397号"
          }
        },
      }
    })
    // const cloud = require('wx-server-sdk')
    // cloud.init()
    // exports.main = async(event, context) => {
    //   try {
    //     const result = await cloud.openapi.templateMessage.send({
    //       touser: openId,
    //       page: 'index',
    //       data: {
    //         keyword1: {
    //           value: '339208499'
    //         },
    //         keyword2: {
    //           value: '2015年01月05日 12:30'
    //         },
    //         keyword3: {
    //           value: '腾讯微信总部'
    //         },
    //         keyword4: {
    //           value: '广州市海珠区新港中路397号'
    //         }
    //       },
    //       templateId: 'NafoeqSeD1GQNlJ9FLqEVhTOLGeKwjVkBuvWS2NnkFY',
    //       formId: formId,
    //       // emphasisKeyword: 'keyword1.DATA'
    //     })
    //     console.log(result)
    //     return result
    //   } catch (err) {
    //     console.log(err)
    //     return err
    //   }
    // }
  },
  selectById(id) {
    let that = this;
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('news').where({
      _id: id
    }).get({
      success: res => {
        var result = res.data[0];
        that.setData({
          title: result.title,
          content: result.content,
          uploadImgs: JSON.parse(result.images)
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  deleteById: function() {
    let that = this;
    const db = wx.cloud.database()
    db.collection('news').doc(that.data.id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
          duration: 2000,
          success: function() {
            setTimeout(function() {
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
  commit: function(e) {

    let that = this;

    if (that.data.title == "") {
      wx.showToast({
        title: '标题不能为空！',
        icon: 'none'
      })
      return;
    }
    if (that.data.content == "") {
      that.data.content = '今天心情还不错呀！'
    }
    console.log(fileIDs)

    //取图片地址
    wx.cloud.getTempFileURL({
      fileList: fileIDs,
      success: res => {

      },
      fail: err => {
        // handle error
      },
      complete: com => {
        let imageList = [];
        for (let i = 0; i < com.fileList.length; i++) {
          imageList.push({
            url: com.fileList[i].tempFileURL,
            fileId: com.fileList[i].fileID
          })
        }
        that.addData(imageList, e.detail.formId);
      }
    })

    that.setData({
      isClick: true
    })
  },
  addData(imageList, formId) {
    let that = this;
    const db = wx.cloud.database();
    var params = {
      title: that.data.title,
      content: that.data.content,
      images: JSON.stringify(imageList),
      author: that.data.userInfo.nickName,
      avatarUrl: that.data.userInfo.avatarUrl,
      count: 0,
      createTime: utils.getNowDate(new Date())
    }
    if (that.data.isLocation) {
      params.location = that.data.location
    }
    if (that.data.id) {
      db.collection('news').doc(that.data.id).update({
        data: params,
        success: res => {
          wx.showToast({
            title: '更新心情成功',
          })
          that.setData({
            isClick: false
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '更新记录失败'
          })
          that.setData({
            isClick: false
          })
          console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    } else {
      db.collection('news').add({
        data: params,
        success: res => {
          wx.showToast({
            title: '新增心情成功',
            duration: 2000,
            success: function() {

              // that.sendMessage(that.data.openid, formId)
              setTimeout(function() {
                that.setData({
                  isClick: false
                })
                wx.redirectTo({
                  url: '../publish-list/publish-list'
                })
              }, 2000);
            }
          })

          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          that.setData({
            isClick: false
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    }
  },
  deleteImg: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let fileId = e.currentTarget.dataset.fileid;
    var uploadImgs = this.data.uploadImgs;
    wx.showModal({
      title: '提示',
      content: '确认删除图片吗？',
      success(res) {
        if (res.confirm) {
          wx.cloud.deleteFile({
            fileList: [fileId]
          }).then(res => {
            fileIDs.splice(index, 1);
            uploadImgs.splice(index, 1);
            that.setData({
              uploadImgs: uploadImgs
            })
          }).catch(error => {
            // handle error
            console.log(error)
          })


        }
      }
    })
  },
  uploadImg: function() {
    let that = this;

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0];
        var cloudPath = 'news/' + new Date().getTime() + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            // console.log('[上传文件] 成功：', res)
            fileIDs.push(res.fileID);
            var images = that.data.uploadImgs
            images.push({
              url: filePath,
              fileId: res.fileID
            })
            that.setData({
              uploadImgs: images
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  inputTitle: function(e) {
    this.setData({
      title: e.detail.value
    })
  },
  inputContent: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  bindChangeLocation: function(e) {
    this.setData({
      isLocation: e.detail.value
    })
  }
})