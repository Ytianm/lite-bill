/**
 * 原生请求方法封装
 * @param {object} options 
 */
function ajax(options) {
  const method = options.method || 'GET'
  const async = options.async || true
  let url = options.url
  let data = options.data

  let xhr
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else {
    xhr = new ActiveXObject('Microsoft.XMLHttp')
  }

  xhr.open(method, url)

  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
          resolve && resolve(xhr.responseText)
        } else {
          reject && reject('ERROR')
        }
      }
    }

    let dataArr = []
    let paramStr
    if (data instanceof Object) {
      for (let key in data) {
        dataArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      }
      paramStr = dataArr.join('&')
    }

    if (method === 'GET') {
      let index = url.indexOf('?')
      if (index === -1) {
        url += '?'
      } else {
        url += '&'
      }
      url += paramStr
    }

    xhr.open(method, url, async)

    if (method === 'GET') {
      xhr.send(null)
    } else if (method === 'POST') {
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      xhr.send(paramStr)
    }
  })
}

/**
 * csv字符串转换成对象数组
 * @param {string} csvString 
 */
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

/**
 * 格式化日期
 * @param {timestamp} time 
 * @param {Boolean} showSec 
 */
function dateFormat(time, showSec) {
  if (!time) return ''

  const date = new Date(time - 0)

  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let min = date.getMinutes()
  let sec = date.getSeconds()

  month = month < 10 ? `0${month}` : month
  day = day < 10 ? `0${day}` : day
  hour = hour < 10 ? `0${hour}` : hour
  min = min < 10 ? `0${min}`: min
  sec = sec < 10 ? `0${sec}` : sec

  return showSec 
    ? `${year}/${month}/${day} ${hour}:${min}:${sec}`
    : `${year}/${month}/${day}`
}

/**
 * 账单类型
 * @param {string} type 
 */
function billTypeToName(type) {
  const typeList = {
    "0": '支出',
    "1": '收入',
  }
  return typeList[type]
}

/**
 * 账单分类
 * @param {string} type 
 * @param {array} categories 
 */
function categoryToName(type, categories) {
  let categoriesList = {}

  categories.forEach(item => {
    categoriesList[item.id] = item.name
  })

  return categoriesList[type]
}