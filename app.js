//使用expess
var express = require('express');

var path = require('path');
//使用bodyParser,用于解析客户端请求的body中的内容,使用JSON编码处理,url编码处理以及对于文件的上传处理
var bodyParser = require('body-parser');

var ccap = require('ccap')();

//使用日志
var logger = require('morgan');

//引入mongoose 方便操作mongodb
var mongoose = require('mongoose');

//引用路由
var student = require('./routes/student');
var subject = require('./routes/subject');

//创建express应用
var app = express(); 

//连接mongodb
var connectionString = 'mongodb://localhost:27017/sm';
mongoose.connect(connectionString);

//使用日志
app.use(logger('dev'));

//使用bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//bodyParser后才添加路由
app.use('/', student, subject);

//第一次请求返回静态页面,之后通过json交换数据
app.use(express.static(path.join(__dirname, 'public')));

//错误url请求处理
// app.use(function(req, res, next) {
//   res.json({err_code:"404",msg:"bad url request"});
// });

var vcode = "";

app.get('/code',function(req,res){
	var ary = ccap.get();
    var txt = ary[0];
    var buf = ary[1];
	res.writeHead('200', {'Content-Type': 'image/jpeg'}); 
    res.write(buf,'binary');
    vcode = txt;
    console.log(txt)
});

app.post('/login',function(req,res){
	console.log(req.body)
	if(req.body.vcode == vcode) {
		if(req.body.name == "admin" && req.body.passwd == "123") {
			res.json({code:10000,message:"login success"})
		}else {
			res.json({code:10001,message:"your name or password is wrong"})
		}
		
	}else {
		res.json({code:10001,message:"your verify code is wrong"})
	}
});

module.exports = app;