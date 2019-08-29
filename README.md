BIMFACE的离线数据包中含有一些预先压缩好的.gz文件，而实际浏览模型时需要的是解压后的文件。  
如果在.gz文件的响应头(Response Headers)中加上“Content-Encoding: gzip”，浏览器在获取到这些.gz文件后就会首先作解压处理，模型才能正常浏览。  
如何自定义.gz文件的响应头？不同WEB服务器的配置方法不一样，下面列举了常见的几种服务器的配置方法，以供参考。  
# ngnix
**修改配置文件 nginx.conf**  
在http/server里面添加一个location节点，内容如下：
```bash
location ~* .*\.gz$ {
    root       /databags; # 数据包所在目录
    add_header Content-Encoding gzip;
} 
```
# apache
**修改配置文件 httpd.conf**  
加载 headers_module，即去掉此行前面的注释符号#：
```bash
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
**执行 server.js 脚本即可:**
```bash
$ node server.js
```
\* 已提供 server.js 文件
# iis
**在存在.gz文件的目录中添加配置文件 web.config，内容如下：**
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
$\color{red}{每个离线数据包都已经事先添加好了配置文件 web.config，如果使用iis服务器不需要额外配置。}$