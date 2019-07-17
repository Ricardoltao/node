var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

var userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    nickname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    created_time:{
        type:Date,
        default:Date.now
    },
    last_modified_time:{
        type:Date,
        default:Date.now
    },
    avatar:{
        type:String,
        default:'/public/img/avatar-default.png'
    },
    bio:{
        type:String,
        default:''
    },
    gender:{
        type:Number,
        enum:[,-1,0,1],
        default:-1
    },
    birthday:{
        type:Date
    },
    status:{
        type:Number,
        // 0没有权限设置
        // 1不可以评论
        // 2不可以登录
        enum:[0,1,2],
        default:0
    }
})

module.exports = mongoose.model('User',userSchema)