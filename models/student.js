var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var errString = "Path `{PATH}` ({VALUE}) can only be ";

var nameReg = [/^[\u4E00-\u9FA5\uF900-\uFA2D]{2,10}$/,errString+"Chinese or English character length 2-10"];
var numberReg =  [/^[0-9]{8}$/,errString+"number length 8"];
var classesReg =  [/^[0-9]{4}$/,errString+"number length 4"];
var scoreReg =  [/^[0-9]{1,3}$/,errString+"number length 1-3"];

var stuSchema = new Schema({
	name:{type:String,match:nameReg,required:true,trim:true},
	gender:{type: String, enum:['男','女'],required:true},
	classes:{type:String,match:classesReg,required:true,trim:true},
	number:{type:String,match:numberReg,required:true,trim:true},
	//把成绩当成订单的学生子文档
	scores:[{
		subject:{type: Schema.Types.ObjectId, ref: 'Subject'},
		score:{type: String,match:scoreReg,required:true,trim:true}
	}]
});

module.exports = mongoose.model('Student', stuSchema);