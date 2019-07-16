// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var likeId=event.likeId;
  
  return db.collection('likes').doc(likeId).remove({
    success: res => {
       return res;
    },
    fail: err => {
    
      console.error('[数据库] [删除记录] 失败：', err)
    }
  })
}