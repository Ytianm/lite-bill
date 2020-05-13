
window.onload = function () {
  const yearDom = document.getElementById('year')
  const yearListDom = document.getElementsByClassName('year-list')[0]
  const monthDom = document.getElementById('month')
  const monthListDom = document.getElementsByClassName('month-list')[0]
  const incomeDom = document.getElementsByClassName('income')[0]
  const outlayDom = document.getElementsByClassName('outlay')[0]
  const addBillDom = document.getElementsByClassName('add-bill')[0]
  const addBillWrapperDom = document.getElementById('add-bill-wrapper')
  const categorySelectDom = document.getElementsByClassName('category-select')
  const cancelBtnDom = document.getElementById('cancel-btn')
  const saveBtnDom = document.getElementById('save-btn')
  const addBillListDom = document.getElementById('add-bill-list')
  const addBillItemDom = document.getElementsByClassName('add-bill-item')
  const bgDom = document.getElementById('bg')

  let curYear = new Date().getFullYear()
  let curMonth = new Date().getMonth() + 1
  let curDate = dateFormat(new Date().getTime())
  let totalIncome = 0
  let totalOutlay = 0

  const dateReg = /^\d{4}\/\d{2}\/\d{2}$/g
  const numReg = /^\d$/g

  let categories // 账单分类
  let billSrc // 所有账单数据
  let billObj = []

  let billUrl,categoriesUrl

  // 账单数据来源
  if (0) { // 本地
    billUrl = '/assets/bill.csv'
    categoriesUrl = '/assets/categories.csv'
  } else { // GitHub
    billUrl = 'https://raw.githubusercontent.com/xmindltd/hiring/master/frontend-1/bill.csv'
    categoriesUrl = 'https://raw.githubusercontent.com/xmindltd/hiring/master/frontend-1/categories.csv'
  }

  function getCsvData() {
    bgDom.style.display = 'block'
    ajax({ url: billUrl }).then(res => {
      billSrc = csvToObject(res)

      ajax({ url: categoriesUrl }).then(res => {
        categories = csvToObject(res)

        bgDom.style.display = 'none'
        // 初始化
        init()
      }).catch(err => {
        bgDom.style.display = 'none'
        console.log(err);
      })
    }).catch(err => {
      bgDom.style.display = 'none'
      console.log(err);
    })
  }

  /**
   * 年份选择
   */
  yearDom.onclick = function (e) {
    // e.stopPropagation()
    // yearListDom.style.display = 'block'
    // monthListDom.style.display = 'none'
  }

  yearListDom.addEventListener('click', e => {
    yearDom.innerText = curYear = e.target.innerText
    // yearListDom.style.maxHeight = '0'

    // 更新账单
    handleBill(curYear, curMonth)
  })

  /**
   * 月份选择
   */
  monthDom.onclick = function (e) {
    // e.stopPropagation()
    // monthListDom.style.display = 'block'
    // yearListDom.style.display = 'none'
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
    addBillWrapperDom.style.display = 'block'
    // 先清空账单列表
    addBillListDom.innerHTML = ''

    // 再添加一条默认账单
    addBillListDom.appendChild(createBillItm(true))

    // 下拉选项赋值
    renderCategorySelectList()
  })

  /**
   * 渲染账单分类下拉选项
   */
  function renderCategorySelectList() {
    let optionStr = ''
    categories.forEach(c => {
      let itemStr = `
        <option>${c.name}</option>
      `
      optionStr += itemStr
    })

    Array.from(categorySelectDom).forEach(c => {
      c.innerHTML = optionStr
    })
  }

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
      }
    }
    if (flag) {
      addBillWrapperDom.style.display = 'none'

      // 刷新
      handleBill(curYear, curMonth)
    }
  })

  /**
   * 新增账单：+新增一行
   * 基于事件委托，为动态添加的账单按钮绑定事件
   */
  addBillListDom.addEventListener('click', e => {
    if (e.target.dataset.type === 'plus') { // +  
      addBillListDom.appendChild(createBillItm(false))
      renderCategorySelectList()
    }

    if (e.target.dataset.type === 'minus') { // -
      addBillListDom.removeChild(e.target.parentElement.parentElement);
    }
  })

  /**
   * 创建一条新增账单
   */
  function createBillItm(flag) {
    let btnEl = flag ? '<button class="plus-btn btn" data-type="plus">+</button>' 
      : '<button class="minus-btn btn" data-type="minus">-</button>'

    let li = document.createElement('li')
    li.setAttribute('class', 'add-bill-item')
    li.innerHTML = `
      <div>
        <input type="text" class="bill-time input-value" 
          data-typeName="账单时间" data-type="time" placeholder="yyyy/mm/dd">
      </div>
      <div>
        <select name="" class="type-select select-value" data-type="type">
          <option>收入</option>
          <option>支出</option>
        </select>
      </div>
      <div>
        <select name="" class="type-select select-value category-select" 
          data-type="category">
        </select>
      </div>
      <div>
        <input type="text" class="bill-catagory input-value" 
          data-typeName="账单金额" data-type="amount">
      </div>
      <div class="plus-minus">
        ${btnEl}
      </div>
    `        
    return li
  }

  /**
   * 监听账单时间输入
   */
  addBillListDom.addEventListener('input', e => {
    const value = e.target.value
    if (e.target.dataset.type === 'time') { // 账单时间输入
      // 所有账单时间
      const amountDomArr = addBillListDom.getElementsByClassName('bill-time')

      // 时间长度输入正确后再校验
      if (value.length < 10 || amountDomArr.length === 1) return

      let count = 0
      Array.from(amountDomArr).forEach(item => {
        if (value === item.value) {
          count++
        }
      })
      if (count > 1) {
        alert('已存在相同日期的账单')
        e.target.value = ''
      }
    }
  })


  /**
   * 初始化
   */
  function init() {
    // 处理数据
    billSrc.forEach(bill => {
      billObj.push({
        time: dateFormat(bill.time),
        type: billTypeToName(bill.type),
        category: categoryToName(bill.category, categories),
        amount: Number(bill.amount).toFixed(2)
      })
    })

    yearDom.innerText = curYear
    monthDom.innerText = curMonth

    // 账单筛选
    handleBill(curYear, curMonth)
  }

  document.addEventListener('click', e => {
    // yearListDom.style.display = 'none'
    // monthListDom.style.display = 'none'
  })

  // 获取账单csv数据
  getCsvData()
}

