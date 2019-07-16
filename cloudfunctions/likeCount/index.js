// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // var filter = event.filter ? event.filter : null;
  var newsId=event.newsId?event.newsId:null;
  var openId = event.openid ? event.openid:null
  const countResult = await db.collection('likes').where({ openid: openId }).where({ newsId: newsId}).count()
  const total = countResult.total

  //查询数据并返回
  return db.collection('likes').where({ openid: openId }).where({ newsId: newsId }).get().then(res => {
    res.likeCount = total;
    return res
  })
}