<!doctype html>
<html>
<head>
<title>新增用户权限</title>
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
.action dl {
	margin-top: 27px;
}
.action-detail {
	display: inline-block;
	max-width: 100%;
    margin-bottom: 5px;
	text-align: left;
	height: 32px;
    line-height: 32px;
    text-align: right;
    min-width: 90px;

}
.action-title {
	display: block;
	text-align: left;
	margin: 25px 0px 0px 0px;
	color: #337AB7;
}

tr>td {
	vertical-align: top;
	width:10%;
	text-align: left;
}
tr>td input {
	width: 100%;
}
tr td:nth-child(2) {
	width:90%;
}
 
tr td:nth-child(2) label {
	width: 25%;
	text-align: left;
	white-space: nowrap;  
    overflow: hidden;  
    text-overflow: ellipsis;

}	
tr td:nth-child(2) label input {
	text-align: left;
	width: 20%;
}	
tr td:nth-child(2) dd {
	text-align: left;
	width: 25%;
}
tr td:nth-child(2) dd label {
	width: 100%;
}


</style>
</head>
<body id="main">
	<div id="loadding"><img src="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/img/loadding.gif"></div>
	<div class="container">
		
		<section class="main">
			<form role="form" id="form-user-role-edit" method="post" 
				action="<?php if(isset($WEB_ROOT)) echo $WEB_ROOT?>userRole/editUser<?php if(isset($user)) echo '?user_id='.$user['user_id'];?>">
				<table>
					<tr>
						<td ><span class="required">*</span>用户名：</td>
						<td><input type="text" id="user_name" required name="user_name" style="height:35px;width:200px" placeholder="请填写用户名称,例如khchen" />
                        </td>
					</tr>
                    <tr>
						<td ><span class="required">*</span>真实姓名：</td>
						<td><input type="text" id="real_name" required name="real_name" style="height:35px;width:200px" placeholder="请填写真实姓名,例如陈开湖" />
                        </td>
					</tr>

					<tr style="display:none">
						<td ><span class="required">*</span>用户密码：</td>
						<td><input type="text" id="password" name="password" style="height:35px" placeholder="请填写用户密码"/>
                        </td>
					</tr>
					<tr>
						<td ><span class="required">*</span>区域：</td>
						<td><select id="area_id" name="area_id" required style="height:35px;width:200px" placeholder="请选择大区">
                            	<option value="0">请选择大区</option>
                            </select>
                        </td>
					</tr>
					<tr>
						<td ><span class="required">*</span>仓库：</td>
						<td><label><input type="checkbox" class="facility" id="f_all" value="all" data-area="all"/>全部仓</label>
                        </td>
					</tr>
					<tr>
						<td >快递方式：</td>
						<td><select id="shipping_id" name="shipping_id" style="height:35px;width:200px" placeholder="请选择快递">
								<option value="0" selected="true">请选择快递</option> 
                            	
                            </select>
                        </td>
					</tr>
					<tr>
						<td ><span class="required">*</span>角色：</td>
						<td class="juese">
							
						</td>
					</tr>
					<tr>
						<td ><span class="required">*</span>权限：</td>
						<td class="action">
							<dl>
							</dl>
						</td>
					</tr>
					
				</table>
				<div style="position: relative">
					<button class="btn btn-primary" id="purchase-submit" style="float: right">
            			<i class="fa fa-check"></i>提交
        			</button>
        		</div>
			</form>
		</section>
	</div>
	<script src="http://cdn.bootcss.com/jquery/2.1.3/jquery.min.js"></script>
	<script src="http://cdn.bootcss.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	<script type="text/javascript">
	$(window).load(function(){
		$.ajax({
			url: '<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>userRole/getdata<?php if(isset($user)) echo "?user_id=".$user["user_id"];?>',
			type: 'GET',
			dataType: 'json',
		})
		.done(function(data) {
			$("#loadding").remove();
			console.log("success");
			console.log(data);
			if(data["user"]){
				$("#user_name").val(data["user"]["user_name"]);
				$("#real_name").val(data["user"]["real_name"]);
			}
			var html = '';
			$.each(data["area_list"],function(index,elem){
				if(data["user"]&&(data["user"]["area_id"]==elem["area_id"])){
					html += '<option value='+ elem["area_id"] +' selected>'+elem["area_name"]+'</option>';
				} else {
					html += '<option value='+ elem["area_id"] +'>'+elem["area_name"]+'</option>';
				}
				
				
			});
			$("#area_id").append(html);
			html = '';
			$.each(data["facility_list"],function(index,elem){
                if(data["user"]&&(data["user"]["facility_ids"]=="all")){
                	html += '<label><input type="checkbox" class="facility"  value='+elem["facility_id"]+' checked data-area='+elem["area_id"]+' />'+elem["facility_name"]+'</label>';
                } else {
	                if(data["user"]&&(data["user"]["facility_ids"].split(",").indexOf(elem["facility_id"])!=-1)){
						html += '<label><input type="checkbox" class="facility"  value='+elem["facility_id"]+' checked data-area='+elem["area_id"]+' />'+elem["facility_name"]+'</label>';
					} else {
						html += '<label><input type="checkbox" class="facility"  value='+elem["facility_id"]+' data-area='+elem["area_id"]+' />'+elem["facility_name"]+'</label>';					
					}	
                }
				
			});
			 if(data["user"]&&(data["user"]["facility_ids"]=="all")) {
			 	$("#f_all").prop("checked","checked");
			 }
			$("#f_all").parent("label").after(html);
			html = '';

			$.each(data["shipping_list"],function(index,elem){
				if(data["user"]&&(data["user"]["shipping_id"]==elem["shipping_id"])){
					html += '<option value='+ elem["shipping_id"] +' selected>'+elem["shipping_name"]+'</option>';
				} else {
					html += '<option value='+ elem["shipping_id"] +'>'+elem["shipping_name"]+'</option>';
				}
			});
			$("#shipping_id").append(html);
			html ='';
			$.each(data["role_list"],function(index,elem){
	            if(data["user"]&&(data["user"]["role_ids"].split(",").indexOf(elem["role_id"])!=-1)){
					html += '<label><input type="checkbox" class="role"  value='+elem["role_id"]+' checked/>'+elem["role_name"]+'</label>';
				} else {
					html += '<label><input type="checkbox" class="role"  value='+elem["role_id"]+' />'+elem["role_name"]+'</label>';					
				}	
		
			});
			$('.juese').append(html);
			html ='';

			$.each(data["action_title_list"],function(index,elem){
	            html += '<dt class="action-title clearfix" id='+elem["action_id"]+'>'+elem["action_name"]+'</dt>';
			});
			$('.action dl').append(html);
			html ='';

			$.each(data["action_body_list"],function(index,elem){
                if(data["user"]&&(data["user"]["action_list"].split(",").indexOf(elem["action_code"])!=-1)){

                	html += '<dd class="action-detail"><label><input type="checkbox" class="action-input" value='+elem["action_code"]+' checked/>'+elem["action_name"]+'</label></dd>';
                }
                else{
                	html += '<dd class="action-detail"><label><input type="checkbox" class="action-input" value='+elem["action_code"]+' />'+elem["action_name"]+'</label></dd>';
                }

                var parent_ids = elem["parent_id"].split(",");
                $.each(parent_ids,function(index,elem){
                		$('#'+elem).after(html);
                });
	            
	            html ='';	

	            $("#f_all").on('change' ,function(){
					if ($(this).prop("checked") == true){
						$(".facility").each(function(){
							$(this).prop("checked",true);
						});
					}else{
						$(".facility").each(function(){
							$(this).prop("checked",false);
						});
					}
				});

			});
		})
		.fail(function(s) {
			console.log("error"+s);
		})
		.always(function() {
			console.log("complete");
		});
	});

$(document).ready(function(){
// 	$(".role").on('change' ,function(){
// 		$(this).parent().remove();
// 	});
    
	
	
   	$("#form-user-role-edit").submit(function(){
   	   	var roles = [];
   	   	var pause = false;
   		$(".role").each(function(){
   	   		if($(this).val() == 20 && $(this).prop("checked") == true 
   	    	   		&& $("#shipping_id option:selected").val() == 0){//发运组必须指定快递
   	   	   		alert("发运组必须指定快递方式.");
   	   	   		pause = true;
   	   	   		return false;
   	   	   	}
   	   	   	if($(this).prop("checked") == true){
   	   			roles.push($(this).val());
   	   	   	}
   	   	});
   	   	if(pause)
   	   	   	return false;
   	   	if ($("#area_id option:selected").val()==0) {
   	   		alert("请选择大区");
   	   		return false;
   	   	}

   	   	var facility_ids = [];
   	   	if($("#f_all").prop("checked") == true){
			facility_ids.push("all");
			if($("#area_id option:selected").val()!=8){
				alert("大区与仓库不符");
				facility_ids=[];
				return false;
			}
			
   	   	}
   	   	else{
	   	 	$(".facility:not(#f_all):checked").each(function(){
		   		facility_ids.push($(this).val());
		   		console.log($("#area_id option:selected").val());
		   		console.log($(this).attr("data-area"));
		   		if($("#area_id option:selected").val()!=8&&($("#area_id option:selected").val()!=$(this).attr("data-area"))){
		   			alert("大区与仓库不符");
		   			facility_ids=[];
					return false;
		   		}
		   		
		   	});
   	   	}

   	   	if(facility_ids.length==0){
   	   		alert("请选择正确的仓库");
   	   		return false;
   	   	}   	   	

   	   	var action_list = [];
   	   	$(".action-input").each(function(){
   	   	   	if($(this).prop("checked") == true){
   	   			action_list.push($(this).val());
   	   	   	}
   	   	});
   	   	
   	   	
//    	   	if(roles.length==0){
//    	   		alert("角色必须选");
//    	   		return false;   	   		
//    	   	}
   	 	var submit_data = {
   	    	 	"user_name":$("#user_name").val(),
//    	    	 	"password":$("#password").val(),
                "real_name":$("#real_name").val(),
   	    	 	"area_id":$("#area_id option:selected").val(),
				"facility_ids":facility_ids,
				"shipping_id":$("#shipping_id option:selected").val(),
				"role_ids":roles,
				"action_list":action_list
			};

	   	 var postUrl = $("form").attr("action");
		    $.ajax({
	         url: postUrl,
	         type: 'POST',
	         data:submit_data, 
	         dataType: "json", 
	         xhrFields: {
	           withCredentials: true
	         },
		  }).done(function(data){
		  	  console.log(data);
		      if(data.success == "true"){
			  	  <?php if(!isset($user)) echo 'alert("用户添加成功。");';
			  	  else echo 'alert("用户编辑成功。");';?>
			      location.reload();
		      }else{
		    	  <?php if(!isset($user)) echo 'alert("用户添加失败. "+data.error_info);';
			  	  else echo 'alert("用户编辑失败. "+data.error_info); console.log(submit_data)';?>
	        }
	    });  
	    return false;
	});

	

		
	
	
}) ;  // end document ready function 

</script>
</body>
