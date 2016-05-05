<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <title>拼好货WMS</title>
    <link rel="stylesheet" href="assets/css/normalize.css">
    <link rel="stylesheet" href="assets/css/global.css">
    <link rel="stylesheet" href="http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.min.css">
    <!--[if lt IE 9]>
        <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <![endif]-->
</head>
<body>  
<div id="header-wrap">
    <?php
        $CI =& get_instance();
        $CI->load->library('session');
        $default_password = md5('888888');
        $user_password = $CI->session->userdata('password');
        if($default_password == $user_password) {
            echo "<h1 align='left'><font color='red'>初始密码过于简单，请立即修改, 修改后将看到菜单</font></h1>";
        }
    ?>
    <h1 id="title-h1">
        <div class="imgLogo">
            <img src="assets/img/PINHAOHUO.jpg" id="logo">
        </div>
    </h1>
    <nav id="top-nav">
        <?php 
            $CI =& get_instance();
            $CI->load->library('session');
            echo $CI->session->userdata('username');
        ?>
        <a href="javascript:window.top.frames['main-frame'].document.location.reload()" id="refresh" class="topAct">    <i class="fa fa-repeat"></i>刷 新
        </a>
        <a href="./userRole/password" target="_top" id="mpassword" class="topAct">
            <i class="fa fa-paint-brush"></i>修改密码
        </a>
        <a href="./login/logout" target="_top" id="logout" class="topAct">
            <i class="fa fa-power-off"></i>退 出
        </a>
        <a href="javascript:void(0)" target="main-frame" id="cog" class="topAct">
            <i class="fa fa-cog"></i>设 置
        </a>
    </nav>
</div>


<script src="http://cdn.bootcss.com/jquery/2.1.3/jquery.min.js"></script>
<script>
    $(function(){
        var img_width = $("#logo").width();
        var img_height = $("#logo").height();
        var set_width = 80;
        $("#logo").css({"width":set_width},{"height":img_height/img_width*set_width});
    })
</script>
</body>
</html>
