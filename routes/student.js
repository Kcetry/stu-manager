var student = require('../models/student');
var express = require('express');
var router = express.Router();

// Model.find

// Model.find(query, fields, options, callback)
// // fields 和 options 都是可选参数
// 简单查询

// Model.find({ 'csser.com': 5 }, function (err, docs) { // docs 是查询的结果数组 });
// 只查询指定键的结果

// Model.find({}, ['first', 'last'], function (err, docs) {
//   // docs 此时只包含文档的部分键值
// })


//全部学生信息 没有成绩
/*[
{name:"zhangsan",gender:"男",classes:"1405",number:"14"},
{name:"Lisi",gender:"女",classes:"1406",number:"26"}
]*/
router.route('/student').get(function(req, res) {
	student.find(function(err, student) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		if(student[0]) {
			res.json({code:10000,message:"get students success",data:student});
		}else {
			res.json({code:10002,message:"student not found"});
		}
	});
});

//全部成绩信息 包含学生信息 一条成绩信息 包含一条学生信息
/*[
{name:"zhangsan",number:"07140536",subject:"AngularJS",score:"96"},
{name:"zhangsan",number:"07140536",subject:"ExtJS",score:"98"},
{name:"Lisi",classes:"1406",subject:"ExtJS",score:"98"}
]*/
router.route('/student/score').get(function(req, res) {
	student.find({user:req.params.id},function(err, student) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		if(student[0]) {
			res.json({code:10000,message:"get students success",data:student});
		}else {
			res.json({code:10002,message:"student not found"});
		}
	});
});

//某学生的所有科目成绩
//[{name:"ExtJS",score:"99"},{name:"AngularJS",score:"86"},{name:"ReactJS",score:"80"}]
router.route('/student/:id/score/subject/:id').get(function(req, res) {
	student.find({user:req.params.id},function(err, student) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		if(student[0]) {
			res.json({code:10000,message:"get student success",data:student});
		}else {
			res.json({code:10002,message:"student not found"});
		}
	});
});

//某学生的某科目成绩 不包含学生信息
//{name:"ExtJS",score:"99"}
router.route('/student/:id/score/subject/:id').get(function(req, res) {
	student.find({user:req.params.id},function(err, student) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		if(student[0]) {
			res.json({code:10000,message:"get student success",data:student});
		}else {
			res.json({code:10002,message:"student not found"});
		}
	});
});

//指定id的某订单
router.route('/student/:id').get(function(req, res) {
	student.findOne({
		_id: req.params.id
	}, function(err, student) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		res.json({code:10000,message:"get student success",data:student});
	});
});

//新增 用户_id 商品_id 数量quantity
router.route('/student').post(function(req, res) {
	//问题一:客户端ajax提交的是data对象时, 只能解释一层,JSON.stringify(req.body)的detail是"[object Object]"字符串
	//解决方案:ajax提交data字符串 然后再parse 应该是body.parse的问题
	//问题二:req.body获取的字符串[]被换成了":{"和":""
	//解决方案:replace配合正则替换
	var string = JSON.stringify(req.body);
	string = string.replace(/\\/g, "");
	string = string.substring(2,string.length-1);
	string = string.replace(/":{"/,"[");
	string = string.replace(/":""/,"]");
	var body = JSON.parse(string);
	var student = new student(body);
	student.save(function(err) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		res.json({code:10000,message:"add student success",data:student});
	});
});


//更新指定ID的订单状态
router.route('/student/:id').put(function(req, res) {
	if(req.body.state && !req.body.user && !req.body.detail && !req.body.comment) {
		student.findOne({ _id: req.params.id }, function(err, student) {
		    if (err) {
		      return res.send(err);
		    }
		    for (prop in req.body) {
		      student[prop] = req.body[prop];
		    }
		    student.save(function(err) {
				if (err) {
					return showErrMsg(err.errors,res);
				}
				res.json({code:10000,message:'student state updated!',data:student});
		    });
		});		
	}else {
		res.json({code:"10003",message:'only update student state'});
	}

});

router.route('/student/:id').post(function(req, res) {
	if(req.body.state && !req.body.user && !req.body.detail && !req.body.comment) {
		student.findOne({ _id: req.params.id }, function(err, student) {
		    if (err) {
		      return res.send(err);
		    }
		    for (prop in req.body) {
		      student[prop] = req.body[prop];
		    }
		    student.save(function(err) {
				if (err) {
					return showErrMsg(err.errors,res);
				}
				res.json({code:10000, message: 'student state updated!',data:student});
		    });
		});		
	}else {
		res.json({code:"10003",message:'only update student state'});
	}

});

//订单评论  并且订单状态为received才能评论 用户只能提交评论 cms只能提交状态
router.route('/student/:id/comment').post(function(req, res) {
	var content = req.body.content;
	var state = req.body.state;
	var date = req.body.date;
	student.findOne({
		_id: req.params.id
	}, function(err, student) {
		if (err) {
			return showErrMsg(err.errors,res);
		}
		//客户端提交评论
		if(content && !state && !date) {
			if(student.state=="received") {
				student.comment.content = content;
				student.comment.date = Date.now();
				save();	
			}else {
				res.json({code:"10004", message: "your student wasn't confirmed"});
			}
		}//CMS更改评论状态
		else if(state && !content && !date){

			student.comment.state = state;
			save();
		}else {
			res.json({code:"10003", message: "permission denied"});
		}
		function save() {
		    student.save(function(err) {
				if (err) {
					return showErrMsg(err.errors,res);
				}
				res.json({code:10000, message: "add student comment success", data:student});
		    });			
		}
	});
});

// //删除指定ID
// router.route('/student/:id').delete(function(req, res) {
// 	student.remove({
// 		_id: req.params.id
// 	}, function(err, student) {
// 		if (err) {
// 			return showErrMsg(err.errors,res);
// 		}
// 		res.json({
// 			message: 'Successfully deleted'
// 		});
// 	});
// });

function showErrMsg(errs,res) {
	var PropertyList='';
	for(i in errs) {
		PropertyList=PropertyList+errs[i].message+'\r\n';
	}
	res.json({code:10001, message: PropertyList});
}

module.exports = router;