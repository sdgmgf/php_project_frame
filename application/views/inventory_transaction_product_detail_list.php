<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <title>拼好货WMS</title>
    <link rel="stylesheet" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/css/normalize.css">
    <link rel="stylesheet" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/css/global.css">
    <link rel="stylesheet" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/css/order.css">
    <link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <link rel="stylesheet" href="http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/css/autocomplete.css">
    <!-- <link rel="stylesheet" type="text/css" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/js/calendar/GooCalendar.css"/> -->
    <link rel="stylesheet" type="text/css" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/css/lhgcalendar.css"/>
    
    <style type="text/css">
        tr td.product_cell{
            text-align: center;
            vertical-align:middle;
            height: 100%;
        }
       .order{
            border: 1px solid gray;
            margin-top:2px;
            margin-bottom: 2px;
       }

       .order_head{
            background-color: #cccccc;
       }


      .currentPage{
       font-weight: bold;
       font-size: 120%; 
       }
    </style>
    <!--[if lt IE 9]>
        <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <![endif]-->
</head>
<body>  
    
    <div class="container-fluid" style="margin-left: -18px;padding-left: 19px;" >
        <div role="tabpanel" class="row tab-product-list tabpanel" >
            <div class="col-md-12">
                <!-- Nav tabs -->
                <input type="hidden" id="WEB_ROOT"  <?php if(isset($WEB_ROOT)) echo "value={$WEB_ROOT}"; ?> >
                <a class='btn btn-primary btn-sm' href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>./inventoryTransactionList/product_list">返回查看库存</a>
                <!-- Tab panes -->
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="onsale">


                        <form style="width:100%;" method="post" 
                                action="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>inventoryTransactionList/product_detail_list">

                         <div class="row">
								<label for="start_time" class="col-sm-2 control-label"><h4>开始时间</h4></label>
								<div class="col-sm-3">
									<input required="required" type="text" class="form-control" name="start_time" id="start_time" autocomplete="off" value="<?php if(isset($start_time)) echo "{$start_time}"; ?>">
								</div>
								<label for="end_time" class="col-sm-2 control-label"><h4>结束时间</h4></label>
								<div class="col-sm-3">
									<input required="required" type="text" class="form-control" name="end_time" id="end_time" autocomplete="off" value="<?php if(isset($end_time)) echo "{$end_time}"; ?>">
								</div>
							</div>
							<div class="row">
							<label for="start_time" class="col-sm-2 control-label"><h4>仓库</h4></label>
								<div class="col-sm-3">
									<select class="form-control" name="facility_id" id="facility_id" class="form-control">
                                    	<?php
										foreach ($facility_list as $facility) {
											if (isset ($facility_id) && $facility['facility_id'] == $facility_id) {
												echo "<option value=\"{$facility['facility_id']}\" selected='true'>{$facility['facility_name']}</option>";
											} else {
												echo "<option value=\"{$facility['facility_id']}\">{$facility['facility_name']}</option>";
											}
										}
										?>
                                    </select>
								</div>
							<label for="product_type" class="col-sm-2 control-label"><h4>库存状态</h4></label>
								<div class="col-sm-3">
									<select name="inventory_status" id="inventory_status" class="form-control">
										<option value="in_temp" <?php if(isset($inventory_status) && $inventory_status == "in_temp") echo " selected='true'"?>>暂存库</option>
										<option value="in_stock" <?php if(isset($inventory_status) && $inventory_status == "in_stock") echo " selected='true'"?>>库存库</option>
										<option value="in_filter" <?php if(isset($inventory_status) && $inventory_status == "in_filter") echo " selected='true'"?>>拣选库</option>
										<option value="in_production" <?php if(isset($inventory_status) && $inventory_status == "in_production") echo " selected='true'"?>>生产库</option>
										<option value="in_shipping" <?php if(isset($inventory_status) && $inventory_status == "in_shipping") echo " selected='true'"?>>发运库</option>
										<option value="in_bad" <?php if(isset($inventory_status) && $inventory_status == "in_bad") echo " selected='true'"?>>坏果库</option>
										<option value="in_defective" <?php if(isset($inventory_status) && $inventory_status == "in_defective") echo " selected='true'"?>>次果库</option>
										<option value="in_transit" <?php if(isset($inventory_status) && $inventory_status == "in_transit") echo " selected='true'"?>>在途库</option>
                                    </select>
								</div>
							</div>
							<div class="row">
								<label for="product_type" class="col-sm-2 control-label"><h4>产品类型</h4></label>
								<div class="col-sm-3">
									<select name="product_type" id="product_type" class="form-control">
                                    	<?php
										foreach ($product_type_list as $item) {
											if (isset ($product_type) && $item['product_type'] == $product_type) {
												echo "<option value=\"{$item['product_type']}\" selected='true'>{$item['product_type_name']}</option>";
											} else {
												echo "<option value=\"{$item['product_type']}\">{$item['product_type_name']}</option>";
											}
										}
										?>
                                    </select>
								</div>
								<label for="search_type" class="col-sm-2 control-label"><h4>子类型:</h4></label>
								<div class="col-sm-3">
									<select class="form-control" id="inventory_type" name="inventory_type">
										<option value="raw_material" <?php if(isset($inventory_type) && $inventory_type == "raw_material") echo " selected='true'"?>>原料</option>
										<?php if($product_type == 'goods') { ?>
											<option value="finished" <?php if(isset($inventory_type) && $inventory_type == "finished") echo " selected='true'"?>>成品</option>
											<option value="bad" <?php if(isset($inventory_type) && $inventory_type == "bad") echo " selected='true'"?>>坏果</option>
											<option value="defective" <?php if(isset($inventory_type) && $inventory_type == "defective") echo " selected='true'"?>>次果</option>
										<?php }?>
									</select>
								</div>
							</div>
							<div class="row">
								<label for="search_type" class="col-sm-2 control-label"><h4>出入库类型:</h4></label>
								<div class="col-sm-3">
									<select class="form-control" id="search_type" name="search_type">
										<option value="">全部</option>
										<option value="purchase_in" <?php if(isset($transaction_type) && $transaction_type == "purchase_in") echo " selected='true'"?>>收<?php echo $product_type_name2?></option>
										<option value="production_out" <?php if(isset($transaction_type) && $transaction_type == "production_out") echo " selected='true'"?>>产线提货</option>
										<option value="production_in" <?php if(isset($transaction_type) && $transaction_type == "production_in") echo " selected='true'"?>><?php echo $product_type_name3?>入库</option>
										<?php if($product_type == 'goods') { ?>
										<option value="package_in" <?php if(isset($transaction_type) && $transaction_type == "package_in") echo " selected='true'"?>>包裹入库</option>
										<option value="package_out" <?php if(isset($transaction_type) && $transaction_type == "package_out") echo " selected='true'"?>>领包裹</option>
										<?php }?>
										<option value="variance_in" <?php if(isset($transaction_type) && $transaction_type == "variance_in") echo " selected='true'"?>>调整入库</option>
										<option value="variance_out" <?php if(isset($transaction_type) && $transaction_type == "variance_out") echo " selected='true'"?>>调整出库</option>
										<?php if($product_type == 'goods') { ?>
										<option value="transfer_in" <?php if(isset($transaction_type) && $transaction_type == "transfer_in") echo " selected='true'"?>>调拨入库</option>
										<option value="transfer_out" <?php if(isset($transaction_type) && $transaction_type == "transfer_out") echo " selected='true'"?>>调拨出库</option>
										<option value="transfer_return" <?php if(isset($transaction_type) && $transaction_type == "transfer_return") echo " selected='true'"?>>调拨退回</option>
										<option value="transit_in" <?php if(isset($transaction_type) && $transaction_type == "transit_in") echo " selected='true'"?>>在途入库</option>
										<option value="transit_out" <?php if(isset($transaction_type) && $transaction_type == "transit_out") echo " selected='true'"?>>在途出库</option>
										<option value="transit_return" <?php if(isset($transaction_type) && $transaction_type == "transit_return") echo " selected='true'"?>>在途追回</option>
										<option value="bad_in" <?php if(isset($transaction_type) && $transaction_type == "bad_in") echo " selected='true'"?>>坏果入库</option>
										<option value="defective_in" <?php if(isset($transaction_type) && $transaction_type == "defective_in") echo " selected='true'"?>>次果入库</option>
										<?php }?>
										<option value="supplier_return" <?php if(isset($transaction_type) && $transaction_type == "supplier_return") echo " selected='true'"?>>供应商退货</option>
									</select>
								</div>
								<label for="search_type" class="col-sm-2 control-label"><h4>产品名字</h4></label>
								<div class="col-sm-3">
								<input type="text" class="form-control" id="product_name" name="product_name" <?php if(isset($product_name)) echo "value=\"{$product_name}\""; ?> >
                                <input type="hidden" id="product_id" name="product_id" <?php if(isset($product_id)) echo "value=\"{$product_id}\""; ?>/>
                                </div>
							</div>
							<div  class="row">
								<label for="search_type" class="col-sm-2 control-label"><h4>托盘批次号</h4></label>
								<div class="col-sm-3">
									<input type="text" class="form-control" id="pallet_sn" name="pallet_sn" <?php if(isset($pallet_sn)) echo "value=\"{$pallet_sn}\""; ?> >
								</div>
							</div>
							
                         <div style="width: 100%;float:left;">
                                <div style="width:66%;float:left;text-align: center;">
                                    <button type="button" class="btn btn-primary btn-sm"  id="query"  >搜索 </button> 
                                </div>
                                <input type="hidden"  id="page_current" name="page_current"  
                                        <?php if(isset($page_current)) echo "value={$page_current}"; ?> /> 
                                <input type="hidden"  id="page_count" name="page_count"  
                                        <?php if(isset($page_count)) echo "value={$page_count}"; ?> />
                                <input type="hidden"  id="page_limit" name="page_limit"
                                        <?php if(isset($page_limit)) echo "value={$page_limit}"; ?> /> 
                                <!-- 隐藏的 input  end  -->
                         </div>

                        </form>
        
<br/><br/>
<h4><?php if(isset($product_id) && ! empty($product_id) && $this->helper->chechActionList(array('inventoryTransactionListQoh'))) echo "截止" . (isset($end_time) ? $end_time : "现在") . " 库存数量:{$quantity}"?></h4>
                        <!-- product list start -->
                        <div class="row col-sm-15 " style="margin-top: 10px;">
                            <table class="table table-striped table-bordered ">
                                <thead>
                                    <tr>
                                        <th>仓库</th>
                                        <th>供应商</th>
                                        <th>托盘批次号</th>
                                        <th>PRODUCT_ID</th>
                                        <th>产品 </th>
                                        <th>时间 </th>
                                        <th>类型</th>
                                        <th>出入库数量</th>
                                        <th>单位</th>
                                        <th>单位换算前数量</th>
                                        <th>规格</th>
                                        <th>操作人</th>
                                        <th>库存批次号</th>
                                        <th>备注</th>
                                    </tr>
                                </thead>
                            <?php if (! empty($inventory_transaction_list)) {
                            	foreach ($inventory_transaction_list as $inventory_transaction) {
                            		?>
                            		<tr>
                            			<td class="product_cell"><?php echo $inventory_transaction['facility_name']?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['supplier_name']?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['pallet_sn']?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['product_id'] ?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['product_name']?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['created_time']?></td>
                            			<td class="product_cell"><?php 
                            			if ($inventory_transaction['inventory_type'] == "raw_material") echo "(原料) ";
                            			if ($inventory_transaction['inventory_type'] == "finished") echo "(包裹) ";
                            			if ($inventory_transaction['inventory_type'] == "bad") echo "(坏果) ";
                            			if ($inventory_transaction['inventory_type'] == "defective") echo "(次果) ";
                            			if ($inventory_transaction['transaction_type'] == "purchase_in") {
                            				echo "收{$product_type_name2}";
                            			}else if ($inventory_transaction['transaction_type'] == "production_out") {
                            				echo "产线提货";
                            			}else if ($inventory_transaction['transaction_type'] == "production_in") {
                            				echo "{$product_type_name3}入库";
                            			}else if ($inventory_transaction['transaction_type'] == "package_in") {
                            				echo "包裹入库";
                            			}else if ($inventory_transaction['transaction_type'] == "package_out") {
                            				echo "领包裹";
                            			}else if($inventory_transaction['transaction_type'] == "variance_in") {
                            				echo "调整入库";
                            			}else if ($inventory_transaction['transaction_type'] == "variance_out") {
                            				echo "调整出库";
                            			}else if($inventory_transaction['transaction_type'] == "transfer_in") {
                            				echo "调拨入库";
                            			}else if ($inventory_transaction['transaction_type'] == "transfer_out") {
                            				echo "调拨出库";
                            			}else if ($inventory_transaction['transaction_type'] == "transfer_return") {
                            				echo "调拨退回";
                            			}else if ($inventory_transaction['transaction_type'] == "transit_in") {
                            				echo "在途入库";
                            			}else if ($inventory_transaction['transaction_type'] == "transit_out") {
                            				echo "在途出库";
                            			}else if ($inventory_transaction['transaction_type'] == "transit_return") {
                            				echo "在途退回";
                            			}else if ($inventory_transaction['transaction_type'] == "bad_in") {
                            				echo "坏果入库";
                            			}else if ($inventory_transaction['transaction_type'] == "defective_in") {
                            				echo "次果入库";
                            			}else if ($inventory_transaction['transaction_type'] == "supplier_return") {
                            				echo "供应商退货";
                            			} else {
                            				echo  $inventory_transaction['transaction_type'];
                            			}
                            			
                            			?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['qoh']?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['unit_code_name']?></td>
                            			<td class="product_cell"><?php 
                            			if ($inventory_transaction['transaction_unit'] == "package") {
                            				echo $inventory_transaction['quantity'] . "包裹";
                            			} elseif ($inventory_transaction['transaction_unit'] == "box") {
                            				echo $inventory_transaction['quantity'] . $inventory_transaction['container_unit_code_name'];
                            			} else {
                            				echo $inventory_transaction['quantity'] . $inventory_transaction['unit_code_name'];
                            			}?></td>
                            			
                            			<td class="product_cell"><?php 
                            			if ($inventory_transaction['transaction_unit'] == "package") {
                            				echo "包裹(" . $inventory_transaction['secrect_code'] . ")";
                            			} elseif ($inventory_transaction['transaction_unit'] == "box") {
                            				echo $inventory_transaction['container_quantity'] . $inventory_transaction['unit_code_name'] . "/".$inventory_transaction['container_unit_code_name'];
                            			}?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['created_user']?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['batch_sn']?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['note']?></td>
                            		</tr>
                            		<?php
                            	}
                            }?>
                                                            
                            </table>
                                    <div class="row">
                                            <nav style="float: right;margin-top: -7px;">
                                                <ul class="pagination">
                                                    <li>
                                                        <a href="#"   id="page_prev">
                                                            <span aria-hidden="true">&laquo;</span>
                                                        </a>
                                                    </li>
                                                    <?php if(isset($page)) echo $page; ?>
                                                    <li>
                                                        <a href="#" id="page_next" >
                                                            <span aria-hidden="true">&raquo;</span>
                                                        </a>
                                                    </li>
                                                    <li><a href='#'>
                                                     <?php if(isset($page_count)) echo "共{$page_count}页 &nbsp;"; 
                                                          if(isset($record_total))  echo  "共{$record_total}条记录"; 
                                                     ?>
                                                     </a></li>
                                                </ul>
                                            </nav>
                                    </div>
                                      
                        </div>
                        <!-- product list end -->
                    </div>
                    <div role="tabpanel" class="tab-pane" id="undercarriage">
                         
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    

	<script src="http://cdn.bootcss.com/jquery/2.1.3/jquery.min.js"></script>
	<script type="text/javascript" src="<?php if(isset($WEB_ROOT)) echo $WEB_ROOT;?>assets/js/autocomplete.js"></script>
	<script src="http://cdn.bootcss.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>

	<script type="text/javascript" src="<?php if(isset($WEB_ROOT)) echo $WEB_ROOT;?>assets/js/lhgcalendar.min.js"></script>
	<script type="text/javascript">
$(document).ready(function(){
    (function(config){
        config['extendDrag'] = true; // 注意，此配置参数只能在这里使用全局配置，在调用窗口的传参数使用无效
        config['lock'] = true;
        config['fixed'] = true;
        config['okVal'] = 'Ok';
        config['format'] = 'yyyy-MM-dd HH:mm:ss';
    })($.calendar.setting);

    $("#start_time").calendar({btnBar:true,
                   minDate:'2010-05-01', 
                   maxDate:'2022-05-01'});
    $("#end_time").calendar({btnBar:true,
                   minDate:'2010-05-01', 
                   maxDate:'2022-05-01'});
    getProductList();
});
  // 
 $("#query").click(function(){
     $("#act").val("query");
     if ($("#product_name").val() == null || $("#product_name").val().trim() == "") {
     	$("#product_id").val("");
     }
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


var WEB_ROOT = "<?php if(isset($WEB_ROOT)) echo $WEB_ROOT; ?>";
var product_type = "<?php echo $product_type?>";
function getProductList(){
	$.ajax({
		url:WEB_ROOT + "inventoryTransactionList/getProductList?product_type="+product_type,
		type:"get",
		dataType:"json",
		xhrFields: {
            withCredentials: true
        }
	}).done(function(data){
		if(data.success == "success"){
			$('#product_name').autocomplete(data.product_list, {
			    minChars: 0,
			    width: 310,
			    max: 100,
			    matchContains: true,
			    autoFill: false,
			    formatItem: function(row, i, max) {
			    	return(row.product_name);
			    },
			    formatMatch: function(row, i, max) {
			    	return(row.product_name);
			    },
			    formatResult: function(row) {
			    	return(row.product_name);
			    }
			}).result(function(event, row, formatted) {
				$('#product_id').val(row.product_id);
			});
		}	
	});
}

</script>
</body>
</html>
