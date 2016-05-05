<!doctype html>
<html lang="zh-CN">
<head>
<title>拼好货WMS</title>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<meta name="format-detection" content="telephone=no">
<link rel="stylesheet" type="text/css" href="assets/css/normalize.css">
<link rel="stylesheet" type="text/css" href="assets/css/global.css">
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.min.css">
<link rel="stylesheet" href="http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="assets/css/ace.css">
<style>
    #login-layout{
        background-color: #10A4D0;
    }
    #login{
        position: relative;
        height: 250px;
        width: 360px;
        top: 20%;
        left: 50%;
        margin-left: -180px;
        background-color: #ffffff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    legend.title{
        height: 47px;
        line-height: 47px;
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #CACACA;
        background-color: #F4F4F5;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        margin-bottom: 15px;
    }
    #theForm{
        padding: 0 20px;
    }
    #theForm label{
        margin-top: 25px;
        box-shadow: 0 0 0 8px #f4f4f4;
    }
</style>
</head>
<!-- <body id="body-login">

  <div class="loginMain">
    <h1>
      <img src="assets/img/logo.png" alt="拼好货WMS" />
    </h1>
    
    <form method="post" action="./login" name='theForm' id='theForm'>
        <p class="error-tips"><?php echo $info; ?> </p>
        <div class="input-wrap">
          <img src="assets/img/admin.png" class="icon-input" />
          <input type="text" name="username" id='username' placeholder="Username"/>
        </div>
        <div class="input-wrap">
          <img src="assets/img/password.png" class="icon-input" />
          <input type="password" name="password" id="password" placeholder="Password"/>
        </div>
	   <input type="hidden" name="return_url" value="<?php echo $_SERVER['QUERY_STRING'];?>"/>
       <input type="submit" value="" class="signInBtn" />
        <input type="hidden" name="act" value="signin" />
        
    </form>
  </div>
</body> -->
<body id="login-layout">
    <div id="login">
        <fieldset>
            <legend class="title">拼好货仓配管理系统</legend>
        </fieldset>
        <form method="post" action="./login" name='theForm' id='theForm'>
            <fieldset>
                <label class="block clearfix">
                    <span class="block input-icon input-icon-right">
                        <input type="text" name="username" id='username' class="form-control" placeholder="Username">
                        <i class="ace-icon fa fa-user"></i>
                    </span>
                </label>

                <label class="block clearfix">
                    <span class="block input-icon input-icon-right">
                        <input type="password" name="password" id="password" class="form-control" placeholder="Password">
                        <i class="ace-icon fa fa-lock"></i>
                    </span>
                </label>

                <div class="space"></div>

                <div class="clearfix">
                    <button type="submit" class="width-30 pull-right btn btn-sm btn-primary">
                        <span class="bigger-110">登录</span>
                    </button>
                    <input type="hidden" name="act" value="signin" />
                    <input type="hidden" name="return_url" value="<?php echo $_SERVER['QUERY_STRING'];?>"/>
                </div>

                <div class="space-4"></div>
            </fieldset>
        </form>
    </div>
</body>
</html>
