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
    <style>
        .sub-menu li a:hover {
            -webkit-transition : text-indent 0.5s;
            transition : text-indent 0.5s;
            text-indent: 10px;
            font-size: 10px;
            font-weight: bold;
            background: #9FB6CD !important;
            border-radius: 14px;
            color: #fff !important;
        }
        .has-sub-menu{
            position: relative;
        }
        #main-menu>.has-sub-menu>a{
            font-size: 15px;
        }
        i.chevron{
            z-index: 999;
        }
        #main-menu>.has-sub-menu>.sub-menu>.has-sub-menu>.sub-menu{
            padding-left: 15px;
        }
    </style>
</head>
<body id="body-menu" style="overflow-y:scroll;">  
<div id="menu-wrap">
    <ul id="main-menu" class="first-menu">
    	<?php if($this->helper->chechActionList(array("wuliaoManager"))) {?>
    	<li class="has-sub-menu">
            <i class="fa fa-chevron-right chevron"></i>
            <a href="javascript:void(0)">
    			<i class="fa fa-laptop"></i>物料管理
    		</a>
    		<ul class="sub-menu sub-menu-hidden">
            <?php if($this->helper->chechActionList(array('loadingBillList'))) {?>
                <li class="has-sub-menu">
                    <i class="fa fa-chevron-right chevron"></i>
                    <a href="javascript:void(0)">
                        采购入库
                    </a>
                    <ul class="sub-menu sub-menu-hidden">
                        <li>
                            <a href="./loadingBillList" target="main-frame" >bol装车单列表</a>
                        </li>
                        <li>
                            <a href="./taskList/show?product_type=goods&task_type=BOLInGroup" target="main-frame" >收货任务列表</a>
                        </li>
                        
                    </ul>
                </li>
            <?php }?>
            <?php if($this->helper->chechActionList(array('inventoryTransactionList'))) {?>
                <li>
                    <a href="./inventoryTransactionList/product_list" target="main-frame" >查看库存</a>
                </li>
            <?php }?>
	    	</ul>
    	</li>
    	<?php }?>
    </ul>
</div>
<script src="http://cdn.bootcss.com/jquery/2.1.3/jquery.min.js"></script>
<script>
	$(document).ready(function(){
		
         $("#main-menu .has-sub-menu a").on("click",function(){
			$(this).next().stop().slideToggle(300);
			$(this).parent().children(".chevron").toggleClass("rotate-up");
			$(this).parent().siblings().find(".chevron").removeClass("rotate-up");

			$(this).parent().toggleClass("active")
			.siblings().removeClass("active").find(".sub-menu").stop().slideUp(300);
		});

		$(".sub-menu a").on("click",function(){
			$(this).addClass("active")
			.parent().siblings().find("a").removeClass("active")
			.end()
			.parents(".has-sub-menu").siblings().find(".sub-menu a").removeClass("active");
		});
	});
</script>
</body>
</html>
