var Subject = require('../models/subject');
var express = require('express');
var router = express.Router();

//获取全部科目信息
router.route('/subject').get(function(req, res) {
	Subject.find(function(err, subject) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		if(subject[0]) {
			res.json({code:10000,message:"get subjects success",data:subject});
		}else {
			res.json({code:10002,message:"subject not found"});
		}
	});
});

//添加科目信息
router.route('/subject').post(function(req, res) {
	var subject = new Subject(req.body);
	subject.save(function(err) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		res.json({code:10000 ,message:'add subject success',data:subject});
	});
});

//更新科目信息
router.route('/subject/:id').put(function(req, res) {
	Subject.findOne({ _id: req.params.id}, function(err, subject) {
	    if (err) {
	      return res.send(err);
	    }
	    for (prop in req.body) {
	      subject[prop] = req.body[prop];
	    }
	    subject.save(function(err) {
			if (err) {
				return showErrMsg(err.errors,res);
			}
			res.json({code:10000,message:'subject state updated!',data:subject});
	    });
	});
});

//删除科目信息
router.route('/subject/:id').delete(function(req, res) {
	Subject.remove({
		_id: req.params.id
	}, function(err, subject) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		res.json({code:10000,message: 'subject successfully deleted'});
	});
});

function showErrMsg(errs,res) {
	var PropertyList='';
	for(i in errs) {
		PropertyList=PropertyList+errs[i].message;
	}
	res.json({code:10001, message: PropertyList});
}

module.exports = router;