
1. 项目启动方式

   1. 默认请求GitHub仓库的csv文件，直接在项目目录下打开index.html即可启动项目。


   2. 如果通过方式1启动项目出现长时间loading或者请求失败的情况，请到index.js里设置config.dataSource的值为“2”，将账单文件源改为本地csv文件，再通过命令行工具运行node server.js，启动node文件服务器，启动完成后复制链接 http://localhost:2757/index.html 到浏览器打开。

      
   3. 如果本地没有安装node，可在index.js里设置config.dataSource的值为“3”，将直接使用本地字符串数据作为项目的数据源，再打开index.html即可。

   启动方式说明：因为从GitHub上请求文件常有请求超时的情况，所以在本地也创建了账单CSV文件。

   

3. 项目功能说明

   1. 实现了账单数据的列表展示
   2. 账单列表默认展示当前月份数据
   3. 支持修改年份、月份，并展示所选日期的账单数据
   4. 账单金额统计
   5. 支持添加账单
   6. 添加账单校验



​	注：项目使用了CSS3及ES6的部分特性，请使用谷歌或者高版本IE（IE10+）浏览器访问。

