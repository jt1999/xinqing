// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //心情id
  var newsId=event.newsId;
  //点赞人
  var headerImg=event.likeLogo;
  var likeName=event.likeName;
  var likeTime=event.likeTime;
  var openId=event.openid
  return db.collection('likes').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      newsId:newsId,
      likeLogo:headerImg,
      likeName:likeName,
      likeTime:likeTime,
      openid: openId
    }
  })
    .then(res => {
      return res
    })
    .catch(console.error)
}