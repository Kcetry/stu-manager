var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var subSchema = new Schema({
	name:{type:String,enum:['ExtJS','NodeJS','AngularJS','ReactJS','EmberJS'],required:true,trim:true},
});

module.exports = mongoose.model('Subject', subSchema);