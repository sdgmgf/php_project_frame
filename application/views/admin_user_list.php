<!doctype html>
<html>
<head>
<title></title>
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
	href="http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.min.css">
<link rel="stylesheet"
	href="http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.min.css">
<!-- <link rel="stylesheet" type="text/css" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/js/calendar/GooCalendar.css"/> -->
</head>
<body id="main">
	<div class="container">
        <input type="hidden" id="WEB_ROOT"  <?php if(isset($WEB_ROOT)) echo "value={$WEB_ROOT}"; ?> >
		<section class="main">
			<form style="width: 60%; text-align: center" method="get" 
				action="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>userRole/userRoleList">
				 
				<label>用户名:</label><input type="text" id="u_name" name="u_name" <?php if(isset($u_name)) echo "value=".$u_name;?>>
				<button class="btn btn-primary " id="query" name="query">
					展示
				</button>
				
				<input type="hidden"  id="page_current" name="page_current"  
                    <?php if(isset($page_current)) echo "value={$page_current}"; ?> /> 
                <input type="hidden"  id="page_count" name="page_count"   
                    <?php if(isset($page_count)) echo "value={$page_count}"; ?> />
                <input type="hidden"  id="page_limit" name="page_limit" 
                    <?php if(isset($page_limit)) echo "value={$page_limit}"; ?> /> 
			</form>
			<!-- admin user list start -->
			<div class="row  col-sm-12 " style="margin-top: 10px;">
				<table class="table table-striped table-bordered ">
					<thead>
						<tr>
							<th style="display: none;">用户id</th>
							<th style="width: 10%;">用户名</th>
                            <th style="width: 10%;">真实姓名</th>
							<th style="width: 10%;">大区</th>
							<th style="width: 10%;">仓库名</th>
							<th style="width: 10%;">快递名</th>
							<th style="width: 20%;">角色名</th>
                            <th style="width: 20%;">创建时间</th>
							<th style="width: 10%;">操作</th>
						</tr>
					</thead>
					<tbody>
						<?php if(isset($user_list)) {foreach($user_list as $user){?>
						<tr>
							<td style="display: none;"><?php echo $user['user_id'];?></td>
							<td><?php echo $user['user_name'];?></td>
                            <td><?php echo $user['real_name'];?></td>
							<td><?php echo $user['area_name'];?></td>
							<td><?php echo $user['facility_ids'];?></td>
							<td><?php echo $user['shipping_name'];?></td>
							<td><?php echo $user['role_ids'];?></td>
                            <td><?php echo $user['add_time'];?></td>
                            <td>
                            <?php if($user['status'] == 'OK') { ?>
                                <a class="btn btn-primary btn-sm" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>userRole?user_id=<?php echo $user['user_id'];?>" target="_blank">编辑用户</a>
                                <br/><br/>
                                <button type="button" class="btn btn-warning btn-sm" onClick="resetUserPassword(this, <?php echo $user['user_id'];?>);" >重置密码</button>
                                <br/><br/>
                                <button type="button" class="btn btn-danger btn-sm" onClick="updateUserStatus(this, 'DELETE', <?php echo $user['user_id'];?>);" >删除用户</button>
                            <?php } else { ?>
                            <button type="button" class="btn btn-primary btn-sm" onClick="updateUserStatus(this, 'OK', <?php echo $user['user_id'];?>);" >恢复用户</button>
                            <?php }?>
                           
                            </td>
						</tr>
						<?php }}?>
					</tbody>
				</table>
				<div class="row">
					<nav style="float: right; margin-top: -7px;">
						<ul class="pagination">
							<li><a href="#" id="page_prev"> <span aria-hidden="true">&laquo;</span>
							</a></li><?php if(isset($page)) echo $page; ?><li><a href="#"
								id="page_next"> <span aria-hidden="true">&raquo;</span>
							</a></li>
							<li><a href='#'>
							<?php if (isset( $page_count )) echo "共{$page_count}页 &nbsp;"; 
							if (isset( $record_total )) echo "共{$record_total}条记录";?>
                            </a></li>
						</ul>
					</nav>
				</div>
			</div>
		</section>
	</div>
	<script src="http://cdn.bootcss.com/jquery/2.1.3/jquery.min.js"></script>
	<script
		src="http://cdn.bootcss.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
	<script type="text/javascript">
    function updateUserStatus(button, user_status, user_id) {
        $(button).attr("disabled", true);
        var myurl = $("#WEB_ROOT").val()+"userRole/updateUserStatus";
        var mydata = {"user_id":user_id, "status":user_status};
        $.ajax({
            url: myurl,
            type: 'POST',
            data: mydata,
            dataType: "json",
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data){
            if(data.success == "true"){
                window.location.reload();
            }else{
              alert("修改电话状态失败: "+data.error_info);
            }
        });  
    }

    function resetUserPassword(button, user_id) {
        $(button).attr("disabled", true);
        var myurl = $("#WEB_ROOT").val()+"userRole/resetUserPassword";
        var mydata = {"user_id":user_id};
        $.ajax({
            url: myurl,
            type: 'POST',
            data: mydata,
            dataType: "json",
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data) {
            if (data.success == "true") {
                alert("重置密码成功!初始密码为888888");
                window.location.reload();
            } else {
              alert("重置密码失败: " + data.error_info);
              $(button).attr('disabled',false);
            }
        });  
    }

	$("#query").click(function(){
        $("#page_current").val("1");
        $("form").submit();
    }); 
	
	// 分页 
    $('a.page').click(function(){
        var page =$(this).attr('p');
        $("#page_current").val(page); 
        $("form").submit();
    }); 

 // 上一页
    $('a#page_prev').click(function(){
        var page = $("#page_current").val();
        if(page != parseInt(page) ) {
            $('#page_current').val(1);
            page = 1; 
        }else{
            page = parseInt(page); 
            if(page > 1 ){
                page = page - 1; 
               $('#page_current').val(page);
               $("form").submit();  
            }
        }
    }); 

    // 下一页
    $('a#page_next').click(function(){
        var page = $("#page_current").val();
        page = parseInt(page);
        var page_count = $("#page_count").val(); 
        page_count = parseInt(page_count);
        if(page < page_count ){
            page = page + 1; 
            $("#page_current").val(page);
            $("form").submit(); 
        }
    });
</script>
</body>
</html>
