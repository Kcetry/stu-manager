var subject = require('../models/subject');
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
var util = require('util');

//查全部
router.route('/subject').get(function(req, res) {
	subject.find(function(err, subject) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		if(subject[0]) {
			res.json({code:"10000",message: 'get subject success',data:subject});
		}else {
			res.json({code:"10002",message: 'subject not found'});
		}
	});
});

//新增
router.route('/subject').post(function(req, res) {
	var imgDir = './public/img/subject/';
	var form = new multiparty.Form({
		uploadDir: imgDir
	});
	//此处应该是先验证字段成功后再保存图片 但是用form.parse就马上会保存图片 待解决
	form.parse(req, function(err, fields, files) {
		var filesTmp = JSON.stringify(files,null,2);
		var mainImg;
		if(!files.mainImg) {
			res.send("mainImg require");
			return;
		}else {
			mainImg = files.mainImg[0];
		}
		if (err) {
			res.send('parse error: ' + err);
			return;
		} 
		var subject = new subject({
			name:fields.name,
			title:fields.title,
			measure:fields.measure,
			mainImg:'img/subject/'+mainImg.originalFilename,
			type:fields.type,
			salePrice:parseInt(fields.salePrice, 10),
			retailPrice:parseInt(fields.retailPrice, 10),
			sold:parseInt(fields.sold, 10),
			stock:parseInt(fields.stock, 10),
			detailText:fields.detailText
		});
		subject.save(function(err) {
			if (err) {
				return showErrMsg(err.errors,res);
			}
			fs.rename(mainImg.path,imgDir+mainImg.originalFilename,function(err) {
				if(err) {console.log(err)}//重命名为原文件名
			});
			res.json({code:"10000",message: 'add subject success',data:subject});
		});
	});

});

//更新指定ID
router.route('/subject/:id').put(function(req, res) {
	var imgDir = './public/img/subject/';
	var form = new multiparty.Form({
		uploadDir: imgDir
	});
	form.parse(req, function(err, fields, files) {
		var filesTmp = JSON.stringify(files,null,2);
		if(files.mainImg) {
			var mainImg = files.mainImg[0];
			var mainImgName = mainImg.originalFilename;
			fields.mainImg = mainImgName;

			fs.rename(mainImg.path,imgDir+mainImgName,function(err) {
				if(err) {console.log(err)}//重命名为原文件名
			});
		}
		if (err) {
			console.log('parse error: ' + err);
		}
		subject.findOne({_id: req.params.id}, function(err, subject) {
			if (err) {
				return res.send(err);
			}
			if(fields.mainImg) {
				fs.unlink(imgDir+subject.mainImg);
			}
			for (prop in fields) {
				subject[prop] = fields[prop];
			}
			console.log(fields);
			subject.save(function(err) {
				if (err) {
					return res.send(err);
				}
				res.json({code:"10000",message: 'update subject success',data:subject});
			});
		});
	});
});

//查指定ID
router.route('/subject/:id').get(function(req, res) {
	subject.findOne({
		_id: req.params.id
	}, function(err, subject) {
		if (err) {
			return res.send(err);
		}
		res.json({code:"10000",message:'get subject success',data:subject});
	});
});

//删除指定ID
router.route('/subject/:id').delete(function(req, res) {
	subject.remove({
		_id: req.params.id
	}, function(err, subject) {
		if (err) {
			return res.send(err);
		}
		res.json({code:"10001",message: 'subject delete success'});
	});
});

function showErrMsg(errs,res) {
	var PropertyList='';
	for(i in errs) {
		PropertyList=PropertyList+errs[i].message+'\r';
	}
	res.json({code:"10001", message: PropertyList});
}

module.exports = router;