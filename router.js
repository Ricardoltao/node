var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/', function (req, res) {
    // console.log(req.session.user)
    res.render('index.html',{
        user:req.session.user
    })
})

// 登录
router.get('/login', function (req, res) {
    res.render('login.html')
})
router.post('/login', function (req, res) {
    // 1.获取表单数据
    // 2.查询数据库用户名密码是否正确
    // 3.发送响应数据
    // console.log(req.body)
    var body = req.body
    User.findOne({
        email:body.email,
        password:md5(body.password)
    },function(err,user){
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }

        if(!user){
            return res.status(200).json({
                err_code:1,
                message:'Email or password is invalid.'
            })
        }

        // 用户存在，登录成功通过 Session记录登录状态
        req.session.user = user

        res.status(200).json({
            err_code:0,
            message:'OK'
        })
    })
})

// 注册
router.get('/register', function (req, res) {
    res.render('register.html')
})
router.post('/register', function (req, res) {
    // 1.获取表单提交的数据
    //  req.body
    // 2.操作数据库
    //  判断用户是否存在
    // 3.发送响应
    var body = req.body
    User.findOne({
        $or: [{
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: 'Internal error'
            })
        }
        if (data) {
            // 邮箱或者昵称已存在
            return res.status(200).json({
                err_code: 1,
                message: 'email or nickname already exists.'
            })
        }

        // 对密码进行加密
        body.password = md5(body.password)

        new User(body).save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Internal error'
                })
            }

            // 注册成功，使用Session记录用户登录的状态
            req.session.user = user

            // Express 提供了一个响应方法：json
            // 该方法接收一个对象作为参数，它会将该对象转换为字符串发送给浏览器
            res.status(200).json({
                err_code: 0,
                message: 'ok'
            })

            // 服务端重定向只对同步请求有效，异步请求无效
            // res.redirect('/')
        })
    })

})

// 退出
router.get('/logout',function(req,res){
    // 清除登录状态
    // 重定向到登录页
    req.session.user = null
    res.redirect('/login')
})


module.exports = router