// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //条件
  var filter=event.filter?event.filter:null;
  //第几页
  var pageIndex=event.pageIndex?event.pageIndex:1;
  //一页显示多少条
  var pageSize=10;
  // 先取出集合记录总数
  const countResult = await db.collection('news').where(filter).count()
  const total = countResult.total
  // 计算多少页
  const totalPage = Math.ceil(total / 10)
  //提示前端是否还有数据
  var hasMore;
  if(pageIndex>totalPage||pageIndex==totalPage){
    hasMore=false
  }else{
    hasMore=true
  }
  //查询数据并返回
  return db.collection('news').where(filter).orderBy('createTime', 'desc').skip((pageIndex - 1)*pageSize).limit(pageSize).get().then(res=>{
    res.hasMore=hasMore;
    res.totalPage=totalPage;
    return res
  })
}