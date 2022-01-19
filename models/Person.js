const mongoose=require('mongoose');
const Schema =mongoose.Schema;

const PersonSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String
    },
    profilepic:{
        type:String,
        default:"https://e7.pngegg.com/pngimages/1020/310/png-clipart-trollface-internet-troll-rage-comic-trolls-miscellaneous-template.png"
    },
    date:{
        type:Date,
        default:Date.now
    },
    gender:{
        type:String,
        default:'Male'
    }
});

module.exports=mongoose.model("PersonModel",PersonSchema);