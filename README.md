&emsp;&emsp;BIMFACE的离线数据包中含有一些预先压缩好的.gz文件，而实际浏览模型时需要的是解压后的文件。
为了能够正常浏览模型，需要在.gz文件的响应头(Response Headers)中加上“Content-Encoding: gzip”，这样浏览器在获取到这些.gz文件后就会自动作解压处理。

&emsp;&emsp;如何自定义.gz文件的响应头？不同WEB服务器的配置方法不一样，下面列举了几种常见的服务器的配置方法，以供参考。

# ngnix
**修改配置文件 nginx.conf**  
在http/server里面添加一个location节点，内容如下：
```
location ~* .*\.gz$ {
    root       /databags; # 数据包所在目录
    add_header Content-Encoding gzip;
} 
```
# apache
**修改配置文件 httpd.conf**  
加载 headers_module，即去掉此行前面的注释符号#：
```
LoadModule headers_module modules/mod_headers.so
```
在&lt;IfModule headers_module&gt;小节中添加 FilesMatch：
```xml
<IfModule headers_module>
    <FilesMatch "\.(gz)$">
        header set Content-Encoding "gzip"
    </FilesMatch>
</IfModule>
```
# nodejs
**参考以下 server.js 代码，为.gz文件添加 Content-Encoding 头:**
```js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.get('*', function getjs(req, res, next) {
  var path = req.path,
  arr = path.split('/'),
  dir = arr.slice(0,arr.length-1).join('/'),
  name = arr[arr.length-1];
  var files=fs.readdirSync(`./${dir}`);
files.forEach(function(item,index){
  console.log(`.${path}`)
  if(item==name){
    if(name.slice(-3)=='.gz'){
      fs.readFile(`.${path}`,function(err,data){
        res.writeHeader(200,{'Content-Encoding':'gzip','Content-Type':'application/octet-stream'})
        res.write(data)
      res.end();
      })    
    }else{
      res.sendFile(`${__dirname}${path}`);
    }
    return
  }
})

})

app.listen(8080, () => {
  console.log('ok')
})
```
# iis
$\color{red}{* 我们已经事先给每个离线数据包做好了此配置，如果你使用iis服务器则不需要再做此配置。}$  
**在含有.gz文件的目录中添加配置文件 web.config，内容如下：**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <httpProtocol>
            <customHeaders>
                <add name="Content-Encoding" value="gzip" />
            </customHeaders>
        </httpProtocol>
    </system.webServer>
</configuration>
```
