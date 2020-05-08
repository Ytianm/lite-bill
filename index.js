
window.onload = function () {
  const billUrl = 'https://raw.githubusercontent.com/xmindltd/hiring/master/frontend-1/bill.csv'
  const categoriesUrl = 'https://raw.githubusercontent.com/xmindltd/hiring/master/frontend-1/categories.csv'

  let bill = []
  // let categories = []

  // ajax({ url: billUrl }).then(res => {
  //   bill = csvToObject(res)

  //   ajax({ url: categoriesUrl }).then(res => {
  //     categories = csvToObject(res)
  //     init()
  //   })
  // })

  function init() {
    console.log(csvToObject(billStr));
    console.log(csvToObject(categoriesStr))

    bill = csvToObject(billStr)

    const contentEl = document.getElementById('content')
    let contentStr = ''

    bill.forEach(item => {
      let itemStr = `
      <li class="bill-item">
        <div>${dateFormat(item.time)}</div>
        <div>${billTypeToName(item.type)}</div>
        <div>${categoryToName(item.category)}</div>
        <div>${Number(item.amount).toFixed(2)}</div>
      </li>`

      contentStr += itemStr
    })

    contentEl.innerHTML = contentStr
  }

  init()
}

