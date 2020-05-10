
window.onload = function () {
  const billUrl = 'https://raw.githubusercontent.com/xmindltd/hiring/master/frontend-1/bill.csv'
  const categoriesUrl = 'https://raw.githubusercontent.com/xmindltd/hiring/master/frontend-1/categories.csv'

  const yearDom = document.getElementById('year')
  const yearListDom = document.getElementsByClassName('year-list')[0]
  const monthDom = document.getElementById('month')
  const monthListDom = document.getElementsByClassName('month-list')[0]
  const incomeDom = document.getElementsByClassName('income')[0]
  const outlayDom = document.getElementsByClassName('outlay')[0]
  const addBillDom = document.getElementsByClassName('add-bill')[0]
  const contentDom = document.getElementById('content')
  const addBillWrapperDom = document.getElementById('add-bill-wrapper')
  const categorySelectDom = document.getElementById('category-select')
  const cancelBtnDom = document.getElementById('cancel-btn')
  const saveBtnDom = document.getElementById('save-btn')
  const addBillItemDom = document.getElementsByClassName('add-bill-item')

  let curYear = new Date().getFullYear()
  let curMonth = new Date().getMonth() + 1
  let curDate = dateFormat(new Date().getTime())
  let totalIncome = 0
  let totalOutlay = 0

  const dateReg = /^\d{4}\/\d{2}\/\d{2}$/g
  const numReg = /^\d$/g

  console.log(csvToObject(billStr));
  console.log(csvToObject(categoriesStr))
  let categories = csvToObject(categoriesStr) // 账单分类
  let billSrc = csvToObject(billStr) // 所有账单数据
  let billObj = []

  billSrc.forEach(bill => {
    billObj.push({
      time: dateFormat(bill.time),
      type: billTypeToName(bill.type),
      category: categoryToName(bill.category),
      amount: Number(bill.amount).toFixed(2)
    })
  })

  // let categories = []

  // ajax({ url: billUrl }).then(res => {
  //   bill = csvToObject(res)

  //   ajax({ url: categoriesUrl }).then(res => {
  //     categories = csvToObject(res)
  //     renderBill()
  //   })
  // })

  /**
   * 年份选择
   */
  yearDom.onclick = function(e) {
    e.stopPropagation()
    yearListDom.style.display = 'block'
  }

  yearListDom.addEventListener('click', e => {
    yearDom.innerText = curYear = e.target.innerText
    
    // 更新账单
    handleBill(curYear, curMonth)
  })

  /**
   * 月份选择
   */
  monthDom.onclick = function(e) {
    e.stopPropagation()
    monthListDom.style.display = 'block'
  }

  monthListDom.addEventListener('click', e => {
    monthDom.innerText = curMonth = e.target.innerText

    // 更新账单
    handleBill(curYear, curMonth)
  })

  /**
   * 账单筛选
   * @param {*} curYear 当前年
   * @param {*} curMonth 当前月
   */
  function handleBill(curYear, curMonth) {
    let billTemp = []

    billTemp = billObj.filter(b => {
      let dateArr = b.time.split('/')
      if (curYear === 'All' && curMonth === 'All') { // 年-all && 月-all
        return true
      } if (curYear === 'All' && curMonth !== 'All') { // 年-all
        return dateArr[1] == curMonth
      } else if (curYear !== 'All' && curMonth === 'All') { // 月-all
        return dateArr[0] == curYear
      } else {
        return dateArr[0] == curYear && dateArr[1] == curMonth
      }
    })

    console.log(billTemp);
    renderBill(billTemp)
  }

  /**
   * 渲染账单列表
   * @param {*} bill 账单数据
   */
  function renderBill(bill) {
    const contentEl = document.getElementById('content')
    let contentStr = ''
    totalIncome = 0
    totalOutlay = 0

    if (bill && bill.length === 0) {
      contentEl.innerHTML = '<p class="nobill-tips">当前日期还没有任何账单哦~</p>'
      incomeDom.innerText = totalIncome.toFixed(2)
      outlayDom.innerText = totalOutlay.toFixed(2)
      return
    }

    bill.forEach(item => {
      let itemStr = `
      <li class="bill-item">
        <div>${item.time}</div>
        <div>${item.type}</div>
        <div>${item.category}</div>
        <div>${item.amount}</div>
      </li>`

      contentStr += itemStr

      if (item.type === '收入') { // 收入
        totalIncome += Number(item.amount)
      }
      if (item.type === '支出') { // 支出
        totalOutlay += Number(item.amount)
      }
    })

    contentEl.innerHTML = contentStr
    incomeDom.innerText = Number(totalIncome).toFixed(2)
    outlayDom.innerText = Number(totalOutlay).toFixed(2)
  }

  /**
   * 添加账单
   */
  addBillDom.addEventListener('click', e => {
    // let el = document.createElement('li')
    // el.setAttribute('class', 'bill-item')
    // el.innerHTML = '<div>13456</div>'
    // contentDom.appendChild(el)
    addBillWrapperDom.style.display = 'block'
    
    let optionStr = ''
    categories.forEach(c => {
      let itemStr = `
        <option>${c.name}</option>
      `
      optionStr += itemStr
    })

    categorySelectDom.innerHTML = optionStr
  })

  /**
   * 新增账单-取消
   */
  cancelBtnDom.addEventListener('click', e => {
    addBillWrapperDom.style.display = 'none'
  })

  /**
   * 新增账单-保存
   */
  saveBtnDom.addEventListener('click', e => {
    let flag = true
    let addArr = []
    let addBillItemDomArr = Array.from(addBillItemDom)
    outFor:
    for (let item of addBillItemDomArr) {
      let obj = {}
      // 需要校验的input
      let inputArr = Array.from(item.getElementsByClassName('input-value'))
      inFor:
      for (let i of inputArr) {
        const typeName = i.getAttribute('data-typeName')
        const type = i.getAttribute('data-type')
        if (!i.value) {
          flag = false
          alert(typeName + '不能为空！');
          break outFor
        }
        dateReg.lastIndex = 0
        if (type === 'time' && !dateReg.test(i.value)) {
          flag = false
          alert('账单时间格式有误，正确格式为：yyyy/mm/dd')
          break outFor
        }

        obj[type] = i.value
      }

      // 需要校验的select
      let selectArr = Array.from(item.getElementsByClassName('select-value'))
      for (let i of selectArr) {
        const type = i.getAttribute('data-type')

        obj[type] = i.value
      }
      if (flag) {
        billObj.push(obj)
        addBillWrapperDom.style.display = 'none'
      }
    }
  })

  /**
   * 初始化
   */
  function init() {
    yearDom.innerText = curYear
    monthDom.innerText = curMonth

    // 账单筛选
    handleBill(curYear, curMonth)
  }

  document.addEventListener('click', e => {
    yearListDom.style.display = 'none'
    monthListDom.style.display = 'none'
  })

  // 初始化
  init()


}

