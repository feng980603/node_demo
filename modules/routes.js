const fs = require('fs');
const path = require('path');
const qs = require('querystring');

//引人mongodb模块
const MongoClient = require('mongodb').MongoClient;
//构建mongodb的连接地址
const url = 'mongodb://localhost:27017';

module.exports = {
    login(req,res){
        var data = fs.readFileSync(path.resolve(__dirname,'../views/login.html'));
        res.writeHead(200,{
            'Content-Type':'text/html; charset=utf-8'
        });
        res.write(data);
        res.end();
    },
    register(req,res){
        var data = fs.readFileSync(path.resolve(__dirname,'../views/register.html'));
        res.writeHead(200,{
            'Content-Type':'text/html; charset=utf-8'
        });
        res.write(data);
        res.end();
    },
    home(req,res){
        res.writeHead(200,{
            'Content-Type':'text/html; charset=utf-8'
        });
        res.write('首页');
        res.end();
    },
    //注册请求
    registerFn(req,res){
        //1.得到页面传递过来的用户名和密码
        var newData = '';
        req.on('data',function(chunk){
            newData += chunk;
        });
        req.on('end',function(){
            var params = qs.parse(newData);
            //2.将用户名和密码写入到数据库中
            //2.1连接数据库
            MongoClient.connect(url,{useNewUrlParser:true},
            function(error,client){
                if(error){
                    console.log('连接数据库失败');
                }else{
                    console.log('连接数据库成功');
                    //选择数据库
                    var db = client.db('aaa');
                    //选择集合并操作
                    db.collection('table1').insertOne({
                        name:params.username,
                        pwd:params.password
                    },function(err){
                        if(err){
                            console.log('注册失败');
                        }else{
                            console.log('注册成功');
                        }
                         //记得关闭连接
                         client.close();
                         //关闭请求
                         res.end();
                    });
                   
                }

                
            });
        });
    },

    loginFn(req,res){
        res.writeHead(200,{
            'Content-Type':'text/html; charset=utf-8'
        });
        var newData = '';
        req.on('data',function(chunk){
            newData += chunk;
        });
        req.on('end',function(){
            var params = qs.parse(newData);

            MongoClient.connect(url,{useNewUrlParser:true},
                function(error,client){
                    if(error){
                        console.log('连接数据库失败');
                        res.write('连接数据库失败');
                    }else{
                        console.log('连接数据库成功');
                        var db = client.db('aaa');
                        db.collection('table1').find({
                            name:params.username,
                            pwd:params.password
                        }).count(function(err,num){
                            if(err){
                                console.log('查询失败');
                            }else{
                                console.log('查询成功');
                                //判断查找到的条数
                                if(num === 1){
                                    console.log('登录成功');
                                    res.write('登录成功');
                                }else{
                                    console.log('登录失败');
                                    res.write('用户名或密码不正确');
                                }
                            }
                            client.close();
                            res.end();
                        });
                        
                    
                    
                    }
                });
        });
    }
}