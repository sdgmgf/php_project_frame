<!doctype html>
<html>
<head>
<title>更改用户密码</title>
<meta charset="utf-8">
<meta name="viewport"
	content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<meta name="format-detection" content="telephone=no">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-store">
<meta http-equiv="Expires" content="0">
<link rel="stylesheet"
	href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/css/normalize.css">
<link rel="stylesheet"
	href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/css/global.css">
<link rel="stylesheet"
	href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/css/order.css">
<link rel="stylesheet"
	href="http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.min.css">
<link rel="stylesheet"
	href="http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.min.css">
<!--[if lt IE 9]>
<script src="http://assets.yqphh.com/assets/js/html5shiv.min-3.7.2.js"></script>
<![endif]-->
<style type="text/css">
.main {
	width: 100%;
	max-width: 640px;
	margin: 0 auto;
}

.date {
	float: right;
}

table {
	width: 100%;
	text-align: center;
	border: 5px;
	border-spacing: 0;
}

.text span {
	float: right;
}
td{
height: 45px;
margin:10px;
}
</style>
</head>
<body id="main">
	<div class="container">
		<section class="main">
			<form role="form" id="form-user-password" method="get" 
				action="<?php if(isset($WEB_ROOT)) echo $WEB_ROOT?>userRole/passwordChange">
				<table>
					<tr>
						<td style="width: 30%;text-align: right"><span class="required">*</span>旧密码：</td>
						<td><input type="password" id="old_password" required name="old_password" style="width: 80%;height:35px" placeholder="请填写旧密码"/>
                        </td>
					</tr>
					<tr>
						<td style="width: 30%;text-align: right"><span class="required">*</span>新密码：</td>
						<td><input type="password" id="new_password" required name="new_password" style="width: 80%;height:35px" placeholder="请填写新密码"/>
                        </td>
					</tr>
					<tr>
						<td style="width: 30%;text-align: right"><span class="required">*</span>确认密码：</td>
						<td><input type="password" id="confirm_password" required name="confirm_password" style="width: 80%;height:35px" placeholder="请确认密码"/>
                        </td>
					</tr>
				</table>
				<div style="position: relative">
					<button class="btn btn-primary" id="password-submit" style="float: right">
            			<i class="fa fa-check"></i>提交
        			</button>
        		</div>
			</form>
		</section>
	</div>
	<script src="http://cdn.bootcss.com/jquery/2.1.3/jquery.min.js"></script>
	<script src="http://cdn.bootcss.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	<script type="text/javascript">
$(document).ready(function(){
   	$("#form-user-password").submit(function(){
   	   	if($.trim($("#old_password").val()) == ""){
   	   	   	alert("旧密码不能为空");
   	   	   	return false;
   	   	}
   	 	if($.trim($("#new_password").val()) == ""){
	   	   	alert("新密码不能为空");
	   	   	return false;
	   	}
   		if($.trim($("#confirm_password").val()) == "" 
   	   		|| ($.trim($("#confirm_password").val()) != $.trim($("#new_password").val()))){
	   	   	alert("请确认新密码！");
	   	   	return false;
	   	}

   	 	var submit_data = {
   	    	 	"old_password":$.trim($("#old_password").val()),
   	    	 	"new_password":$.trim($("#new_password").val()),
				"confirm_password":$.trim($("#confirm_password").val())
			};

	   	 var postUrl = $("form").attr("action");
		    $.ajax({
	         url: postUrl,
	         type: 'POST',
	         data:submit_data, 
	         dataType: "json", 
	         xhrFields: {
	           withCredentials: true
	         }
		  }).done(function(data){
		      if(data.success == "true"){
			      alert("密码修改成功。");
			      window.location.href = "<?php if(isset($WEB_ROOT)) echo $WEB_ROOT?>login";
		      }else{
		          alert("密码修改失败. "+data.error_info);
	        }
	    });  
	    return false;
	});
	
}) ;  // end document ready function 

</script>
</body>