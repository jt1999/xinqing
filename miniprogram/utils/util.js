const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = date => {
  if (!date) return '';
  var data = date.toString().replace(/\-/g, '/')
  var year = data.split(' ')[0].split('/')[0];
  var month = data.split(' ')[0].split('/')[1];
  var day = data.split(' ')[0].split('/')[2];
  var hours = data.split(' ')[1].split(':')[0];
  var min = data.split(' ')[1].split(':')[1];

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hours, min].map(formatNumber).join(':')
}

const getNowDate=date=>{
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getNowDate: getNowDate
}
