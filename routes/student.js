var Student = require('../models/student');
var express = require('express');
var router = express.Router();

//passed
router.route('/student').get(function(req, res) {
	Student.find(function(err, student) {
		if (err)  return showErrMsg(err.errors,res);
		if(student[0]) {
			res.json({code:10000,message:"get students success",data:student});
		}else {
			res.json({code:10002,message:"student not found"});
		}
	});
});

//passed
router.route('/student').post(function(req, res) {
	var student = new Student(req.body);
	student.save(function(err) {
		if (err)  return showErrMsg(err.errors,res);
		res.json({code:10000 ,message:'add student success',data:student});
	});
});


//全部成绩信息
/*[
    {
      "_id": "565d4a434bd5046c2f589b01",
      "name": "徐小静",
      "number": "07140836",
      "scores": [
        {
          "subject": {
            "_id": "565d64a334473be82cf5be6a",
            "name": "AngularJS",
            "__v": 0
          },
          "score": "94"
        }
      ]
    }*/
//passed
router.route('/student/score').get(function(req, res) {
	Student.find({},'name number scores.subject scores.score').populate('scores.subject').exec(function(err, student) {
		if (err)  return showErrMsg(err.errors,res);
		if(student) {
			res.json({code:10000,message:"get students success",data:student});
		}else {
			res.json({code:10002,message:"student not found"});
		}
	});
});

//某学生的所有科目成绩
//passed
router.route('/student/:id/score/subject').get(function(req, res) {
	Student.findOne({_id: req.params.id}).populate('scores.subject').exec(function(err, student) {
		if (err)  return showErrMsg(err.errors,res);
		if(student) {
			res.json({code:10000,message:"get students success",data:student});
		}else {
			res.json({code:10002,message:"student not found"});
		}
	});
});

//某学生的某科目成绩
//	Student.findOne({'scores.subject':req.params.sid},{'scores.subject.$':1}).populate('scores.subject').exec(function(err, student) {
/*可以只返回成绩

    "_id": "565d4a434bd5046c2f589b01",
    "scores": [
      {
        "subject": {
          "_id": "565d6d7534473be82cf5be6b",
          "name": "ReactJS",
          "__v": 0
        },
        "score": "98",
        "_id": "565e96de1c64f5b81bca6c7b"
      }
    ]*/
router.route('/student/:uid/score/subject/:sid').get(function(req, res) {
	console.log(req.params);//{number:"07140836"}
	Student.findOne({_id: req.params.uid,'scores.subject':req.params.sid},{'name scores.subject.$':1}).populate('scores.subject').exec(function(err, student) {
		if (err)  return showErrMsg(err.errors,res);//,subject:req.params.sid
		if(student) {
			res.json({code:10000,message:"get student success",data:student});
		}else {
			res.json({code:10002,message:"student not found"});
		}
	});
});



//passed
router.route('/student/:id/score/subject/:id').post(function(req, res) {
	Student.findOne({_id:req.body.uid},function(err, student) {
		var flag = false;
	    if (err) return res.showErrMsg(err.errors,res);
	    if(!student) res.json({code:10002,message:"student not found"}); 
	    console.log(JSON.stringify(student));
	    for(var a in student.scores) {
	    	if(student.scores[a].subject == req.body.sid) {
	    		student.scores[a].score = req.body.score;
	    		flag = true;
	    	}
	    }
	    !flag && student.scores.push({subject:req.body.sid,score:req.body.score});
	    //console.log("student"+student);
		student.save(function(err) {
			if (err)  return showErrMsg(err.errors,res);
			res.json({code:10000,message:"add student success",data:student});
		})
	});
});


//更新
//passed
router.route('/student/:id').put(function(req, res) {
	Student.findOne({ _id: req.params.id}, function(err, student) {
	    if (err)  return res.showErrMsg(err.errors,res);
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
});


//删除
//passed
router.route('/student/:id').delete(function(req, res) {
	Student.remove({
		_id: req.params.id
	}, function(err, student) {
		if (err)  return showErrMsg(err.errors,res);
		res.json({code:10000,message: 'student successfully deleted'});
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