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
    if(name.slice(-2)=='gz'){
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