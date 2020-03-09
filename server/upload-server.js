var fs = require('fs');
var path = require('path')
var express = require('express');
var multer  = require('multer')

var app = express();
var upload = multer({ dest: 'upload/' });

// 单文件上传
app.post('/upload', upload.single('attachment'), function(req, res, next){
    res.send(JSON.stringify({
		'status': 0,
		'message': '上传成功',
		'file': {
			'filepath': './' + req.file.originalname,
			'filesize': '',
			'filename': '',
			'filetype': ''
		}
	}));
});

app.get('/', function(req, res, next){
    var form = fs.readFileSync('../index.html', {encoding: 'utf8'});
    res.send(form);
});

// 访问view页面
app.all('*',function (req,res) {
	console.log(req.url);
	var documentRoot = path.resolve(__dirname, '..');
	//需要访问的文件的存放目录
	var url = req.url; 
	//客户端输入的url，例如如果输入localhost:8888/index.html
	//那么这里的url == /index.html 

	// url == "/" ? "/index.html" : url; 
	var file = (documentRoot + url).split('?')[0];
	fs.readFile( file , function(err,data){
		/*
		一参为文件路径
		二参为回调函数
		  回调函数的一参为读取错误返回的信息，返回空就没有错误
		  二参为读取成功返回的文本内容
		*/
		if(err){
		  res.writeHeader(404,{
		    'content-type' : 'text/html;charset="utf-8"'
		  });
		  res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
		  res.end();
		}else{
		  var type = path.extname(file).replace(/\.(\w+)\??.*/,'$1');
		  switch(type){
		    case "js" : type = "application/x-javascript";break;
		    case "css" : type = "text/css";break;
		    case "html" : type = "text/html";break;
		    case "jpg" : type = "image/jpeg";break;
		    case "jpeg" : type = "image/jpeg";break;
		    case "gif" : type = "image/gif";break;
		    case "png" : type = "image/png";break;
		    default : type = "text/plain";
		  }
		  res.writeHeader(200,{
		    'content-type' : type + ';charset="utf-8"'
		  });
		  res.write(data);//将文件显示在客户端
		  res.end();
		}
	});
})

app.listen(3000);
console.log('listen in 3000...')