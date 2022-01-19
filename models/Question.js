const mongoose=require('mongoose');
const Schema =mongoose.Schema;

const QuestionSchema=new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "PersonModel"
    },
    textone:{
        type:String,
        required:true
    },
    texttwo:{
        type:String,
    },
    name:String,
    upvotes:[
        {
            user:{
                type: Schema.Types.ObjectId,
                ref: "PersonModel"
            } 
        }
    ],
    answers:[
        {
            user:{
                type: Schema.Types.ObjectId,
                ref: "PersonModel"
            },
            text:{
                type:String,
                required:true
            },
            name:String,
            date:{
                type:Date,
                default:Date.now
            }
        }
    ],
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports=Question=mongoose.model('myquestion',QuestionSchema);