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
          reject && reject()
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