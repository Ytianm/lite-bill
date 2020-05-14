1. 项目配置

   1. 在根目录下的index.js->config里设置是否使用node服务作为账单数据请求服务

      1. useNodeServer: true   // 使用(默认)
      2. useNodeServer: false  // 不使用

   2. 如果useNodeServer=== true，可在index.js->config里设置请求的数据源

      1. dataSource: "1"   // 请求GitHub上的文件（默认）
      2. dataSource: "2"   // 请求本地文件

   3. 如果useNodeServer=== false，则直接使用assets->data.js里定义的本地字符串数据。

      

2. 项目启动

   1. 通过node服务访问

      在项目根目录下打开命令行工具，输入node server.js，回车启动node服务，复制链接 http://localhost:2757/index.html 到浏览器打开。

   2. 直接在项目目录下打开index.html。

      

3. 启动说明：因为从GitHub上请求文件会有请求超时的情况，所以在本地也创建了账单CSV文件，如页面长时间loading，可通过1项目配置更改数据源为本地即可。

   

4. 项目功能说明

   1. 实现了账单数据的列表展示
   2. 账单列表默认展示当前月份数据
   3. 支持修改年份、月份，并展示所选日期的账单数据
   4. 账单金额统计
   5. 支持添加账单
   6. 添加账单校验



​	注：项目使用了CSS3及ES6的部分特性，请使用谷歌或者高版本IE（IE10+）浏览器访问。

