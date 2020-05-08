// csv字符串转换成对象数组
function csvToObject(csvString) {
  let csvArr = csvString.split(/\n/g)
  let headerArr = csvArr[0].split(",")
  let contentArr = csvArr.slice(1)
  let csvObj = []

  for (let item of contentArr) {
    let obj = {}
    let temp = item.split(',')
    for (let i = 0; i < temp.length; i++) {
      obj[headerArr[i]] = temp[i]
    }
    csvObj.push(obj)
  }

  return csvObj
}

// 格式化日期
function dateFormat(time, showSec) {
  if (!time) return ''

  const date = new Date(time - 0)

  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let min = date.getMinutes()
  let sec = date.getSeconds()

  month = month > 10 ? month : `0${month}`
  day = day > 10 ? day : `0${day}`
  hour = hour > 10 ? hour : `0${hour}`
  min = min > 10 ? min : `0${min}`
  sec = sec > 10 ? sec : `0${sec}`

  return showSec ? `${year}-${month}-${day} ${hour}:${min}:${sec}`
    : `${year}-${month}-${day}`
}

// 账单类型
function billTypeToName(type) {
  const typeList = {
    "0": '支出',
    "1": '收入',
  }
  return typeList[type]
}

// 账单分类
function categoryToName(type) {
  const categories = csvToObject(categoriesStr)
  const categoriesList = {}

  categories.forEach(item => {
    categoriesList[item.id] = item.name
  })

  return categoriesList[type]
}