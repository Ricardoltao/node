var express = require('express')
var path = require('path')
var router = require('./router')
var bodyParser = require('body-parser')
var session = require('express-session')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules')))

// 在node中，有很多第三方模板引擎都可以使用
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认就是./views目录

// 配置解析表单POST请求体插件
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())


// 在express这个框架中，默认不支持session 和 cookie
// 需要引入第三方中间件：express-session
// 添加session数据：req.session.foo = 'bar'
// 访问session数据：req.session.foo
app.use(session({
    secret: 'keyboard cat',  //配置加密字符串，他会在原有基础上和这个字符串拼接起来加密
    resave: false,
    saveUninitialized: true  //无论你是否使用Session，我都默认直接分配给你一把钥匙
}))

// 把路由挂载到app中
app.use(router)

app.listen(3000, function () {
    console.log('Running....')
})