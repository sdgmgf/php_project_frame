<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <title>查看库存</title>
    <link rel="stylesheet" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/css/normalize.css">
    <link rel="stylesheet" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/css/global.css">
    <link rel="stylesheet" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>assets/css/order.css">
    
    <link rel="stylesheet" type="text/css" href="http://cdn.datatables.net/1.10.7/css/jquery.dataTables.css"> 
    <link rel="stylesheet" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>/assets/css/dataTables.bootstrap.min.css">
	<link rel="stylesheet" href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>/assets/css/buttons.dataTables.css">
	
    <link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.min.css">
    <link rel="stylesheet" href="http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.min.css">
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
                <!-- Tab panes -->
                <div class="tab-content">
                	<form method="post" action="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>inventoryTransactionList/product_list">
                    
							<div class="row">
								<label for="start_time" class="col-sm-2 control-label">仓库</label>
								<div  class="col-sm-2 control-label">
									<select name="facility_id" id="facility_id" class="form-control">
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
								<label for="start_time" class="col-sm-2 control-label">库存状态</label>
								<div class="col-sm-2">
									<select class="form-control" id="inventory_status" name="inventory_status">
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
								<label for="product_type" class="col-sm-2 control-label">产品类型</label>
								<div  class="col-sm-2 control-label">
									<select  name="product_type" id="product_type" class="form-control">
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
								<label for="search_type" class="col-sm-2 control-label">子类型</label>
								<div class="col-sm-2">
									<select class="form-control" id="inventory_type" name="inventory_type">
										<option value="raw_material" <?php if(isset($inventory_type) && $inventory_type == "raw_material") echo " selected='true'"?>>原料</option>
										<?php if($product_type == 'goods') {?>
											<option value="finished" <?php if(isset($inventory_type) && $inventory_type == "finished") echo " selected='true'"?>>包裹</option>
											<option value="bad" <?php if(isset($inventory_type) && $inventory_type == "bad") echo " selected='true'"?>>坏果</option>
											<option value="defective" <?php if(isset($inventory_type) && $inventory_type == "defective") echo " selected='true'"?>>次果</option>
										<?php }?>
									</select>
								</div>
							</div>
							<div class="row">
								<label class="col-sm-2 control-label">指定时间点的库存</label>
								<div class="col-sm-2">
									<input class="form-control" type="text" name="end_time" id="end_time" autocomplete="off" value="<?php if(isset($end_time)) echo "{$end_time}"; ?>">
								</div>
								<label class="col-sm-2 control-label"></label>
								<div class="col-sm-2">
									<input type="hidden" name="act" id="act" value="query">
                                    <button type="button" class="btn btn-primary btn-sm"  id="query"  >查看 </button> 
                                    <span>&nbsp;</span>
                                    	<?php if($this->helper->chechActionList(array('inventoryTransactionListQoh'))) 
                                    	echo '<button type="button" class="btn btn-primary btn-sm"  id="download" >导出</button>'?>
								</div>
							</div>
                 	</form>
                    
                    
                        <!-- product list start -->
                        <div class="row  col-sm-12 " style="margin-top: 10px;">
                            <table id="product_list" class="table table-striped table-bordered ">
                                <thead>
                                    <tr>
                                    	<th>PRODUCT_ID </th>
                                        <th>商品 </th>
                                        <th>托盘数量 </th>
                                        <th>仓储数量</th>
                                        <th>仓储锁定数量</th>
                                        <th>仓储单位</th>
                                        <th>明细数量</th>
                                        <th>明细锁定数量</th>
                                        <th>明细单位</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                            	<?php
								if (!empty ($inventory_transaction_list)) {
									foreach ($inventory_transaction_list as $inventory_transaction) {
								?>
                            		<tr>
                            			<td class="product_cell"><?php echo $inventory_transaction['product_id']?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['product_name']?></td>
                            			<td class="product_cell"><?php echo $inventory_transaction['count_pallet_id']?></td>
                            			<td class="product_cell"><?php if($this->helper->chechActionList(array('inventoryTransactionListQoh'))) echo $inventory_transaction['quantity']?></td>
                            			<td class="product_cell"><?php if($this->helper->chechActionList(array('inventoryTransactionListQoh'))) echo $inventory_transaction['locked_quantity']?></td>
                            			<td class="product_cell"><?php echo ($inventory_type == "finished" ? "个" : $inventory_transaction['container_unit_code_name'])?></td>
                            			<td class="product_cell"><?php if($this->helper->chechActionList(array('inventoryTransactionListQoh'))) echo $inventory_transaction['qoh']?></td>
                            			<td class="product_cell"><?php if($this->helper->chechActionList(array('inventoryTransactionListQoh'))) echo $inventory_transaction['locked_qoh']?></td>
                            			<td class="product_cell"><?php echo ($inventory_type == "finished" ? "个" : $inventory_transaction['unit_code_name'])?></td>
                            			<td class="product_cell">
                            				<input type="button" class="btn btn-info detail_b" onClick="detail(<?php echo $inventory_transaction['product_id']?>);" value="查看库存明细">
                            				<input type="button" class="btn btn-info detail_b" onClick="detail_date(<?php echo $inventory_transaction['product_id']?>);" value="查看日期明细">
                            				<input type="button" class="btn btn-info detail_b" onClick="detail_batch(<?php echo $inventory_transaction['product_id']?>);" value="查看批次明细">
                            				<a href="<?php if(isset($WEB_ROOT))  echo $WEB_ROOT ; ?>inventoryTransactionList/product_detail_list?inventory_type=<?php echo isset($inventory_type)?$inventory_type:""?>&inventory_status=<?php echo isset($inventory_status)?$inventory_status:""?>&end_time=<?php echo isset($end_time)?$end_time:""?>&facility_id=<?php echo $facility_id?>&product_id=<?php echo $inventory_transaction['product_id']; ?>&product_type=<?php echo isset($product_type) ?$product_type : null?>"><input type="button" class="btn btn-info" value="查看流水"> </a>
                            			</td>
                            		</tr>
                            	<?php


									}
								}
								?>
                               </tbody>                             
                            </table>
                        </div>
                        <!-- product list end -->
                    </div>
                </div>
            </div>
        </div>
    </div>
<!-- Modal -->
<div>
<div class="modal fade ui-draggable" id="detail_modal"   role="dialog"  >
  <div class="modal-dialog">
    <div class="modal-content" style="min-width: 800px">
      <div class="modal-header">
        <button type="button" class="close" id="btnClose" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">库存详情</h4>
      </div>
      <div class="modal-body ">
      	<table id="detail_table" name="detail_table" border=3 style="width:100%">
			<tr>
				<th style="width:5%;">商品</th>
				<th style="width:5%;">库区</th>
				<th style="width:5%;">供应商</th>
				<th style="width:10%;">托盘批次号</th>
				<th style="width:10%;">规格 </th>
				<th style="width:10%;">仓储数量 </th>
				<th style="width:10%;">仓储锁定数量 </th>
				<th style="width:10%;">明细数量 </th>
				<th style="width:10%;">明细锁定数量 </th>
				<th style="width:10%;">入库日期</th>
				<th style="width:10%;">库存批次号</th>
				<th style="width:5%;">asn_id</th>
			</tr>
		</table>
      </div>
    </div>
  </div>
</div>
</div>
<!-- modal end  -->
<!-- Modal -->
<div>
<div class="modal fade ui-draggable" id="detail_date_modal"   role="dialog"  >
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" id="btnClose" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">库存情况</h4>
      </div>
      <div class="modal-body ">
      	<table id="detail_date_table" name="detail_date_table" border=3 style="width:100%">
			<tr>
				<th style="width:10%;text-align: center;">仓库名</th>
				<th style="width:10%;text-align: center;">供应商</th>
				<th style="width:12%;text-align: center;">商品名称 </th>
				<th style="width:12%;text-align: center;">商品单位 </th>
				<th style="width:12%;text-align: center;">入库日期 </th>
				<th style="width:12%;text-align: center;">明细数量 </th>
				<th style="width:12%;text-align: center;">明细锁定数量 </th>
			</tr>
		</table>
      </div>
    </div>
  </div>
</div>
</div>
<!-- modal end  -->
<!-- Modal -->
<div>
<div class="modal fade ui-draggable" id="detail_batch_modal"   role="dialog"  >
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" id="btnClose" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">库存情况</h4>
      </div>
      <div class="modal-body ">
        <table id="detail_batch_table" name="detail_batch_table" border=3 style="width:100%">
            <tr>
                <th style="width:10%;text-align: center;">仓库名</th>
                <th style="width:10%;text-align: center;">供应商</th>
                <th style="width:12%;text-align: center;">商品名称 </th>
                <th style="width:12%;text-align: center;">商品单位 </th>
                <th style="width:12%;text-align: center;">库存批次号 </th>                
                <th style="width:12%;text-align: center;">入库日期 </th>
                <th style="width:12%;text-align: center;">入库数量 </th>
                <th style="width:12%;text-align: center;">明细数量 </th>
                <th style="width:12%;text-align: center;">明细锁定数量 </th>
            </tr>
        </table>
      </div>
    </div>
  </div>
</div>
</div>
<!-- modal end  -->
<script src="http://cdn.bootcss.com/jquery/2.1.3/jquery.min.js"></script>
<script src="http://cdn.bootcss.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
<script type="text/javascript" charset="utf8" src="http://cdn.datatables.net/1.10.7/js/jquery.dataTables.js"></script>
<script type="text/javascript" src="<?php if(isset($WEB_ROOT)) echo $WEB_ROOT;?>assets/js/jquery.dataTables.js"></script>
<script type="text/javascript" src="<?php if(isset($WEB_ROOT)) echo $WEB_ROOT;?>assets/js/dataTables.bootstrap.min.js"></script>
<script type="text/javascript" src="<?php if(isset($WEB_ROOT)) echo $WEB_ROOT;?>assets/js/dataTables.buttons.js"></script>
<script type="text/javascript" src="<?php if(isset($WEB_ROOT)) echo $WEB_ROOT;?>assets/js/lhgcalendar.min.js"></script>
<script>
var property={
    divId:"demo1",
    needTime:true,
    yearRange:[1970,2030],
    week:['日','一','二','三','四','五','六'],
    month:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    format:"yyyy-MM-dd hh:mm:00"
};

(function(config){
    config['extendDrag'] = true; // 注意，此配置参数只能在这里使用全局配置，在调用窗口的传参数使用无效
    config['lock'] = true;
    config['fixed'] = true;
    config['okVal'] = 'Ok';
    config['format'] = 'yyyy-MM-dd HH:mm:ss';
    // [more..]
})($.calendar.setting);
$(document).ready(function(){
    $("#end_time").calendar({btnBar:true,
                   minDate:'2010-05-01', 
                   maxDate:'2022-05-01'});
});

function detail(product_id) {
	var facility_id = "<?php echo isset($facility_id) ? $facility_id : 0?>";
	var inventory_type = "<?php echo isset($inventory_type) ? $inventory_type : 0?>";
	var inventory_status = "<?php echo isset($inventory_status) ? $inventory_status : 0?>";
	var end_time = "<?php echo isset($end_time) ? $end_time : 0?>";
	var submit_data = {"product_id":product_id, "inventory_type":inventory_type, "inventory_status":inventory_status, "end_time":end_time, "facility_id":facility_id};
	var postUrl = $('#WEB_ROOT').val() + 'inventoryTransactionList/product_container_list';
	    $.ajax({
            url: postUrl,
            type: 'POST',
            data: submit_data, 
            dataType: "json", 
            xhrFields: {
              withCredentials: true
            }
	  }).done(function(data){
	   	  $("#detail_table tr.content").remove();
	      if(data.success == "success"){
	    		data.inventory_transaction_list.forEach(function(inventory_transaction){
	    			<?php if(! $this->helper->chechActionList(array('inventoryTransactionListQoh'))){?>
	    				inventory_transaction.quantity = "";
	    				inventory_transaction.qoh = "";
	    			<?php }?>
		    		var lineIndex = $("#detail_table tr.content").size();
			    	var tr = $("<tr>");
					tr.addClass('content');
					
					var td = $("<td>");
					td.html(inventory_transaction.product_name);
					tr.append(td);
					
					var td = $("<td>");
					td.html(inventory_transaction.inventory_status_name);
					tr.append(td);
					
					var td = $("<td>");
					td.html(inventory_transaction.supplier_name);
					tr.append(td);
					
					var td = $("<td>");

					td.html(inventory_transaction.pallet_sn);
					tr.append(td);
					
					var td = $("<td>");
					td.html(inventory_transaction.container_quantity + inventory_transaction.unit_code_name + "/" + inventory_transaction.container_unit_code_name);
					tr.append(td);
					
					var td = $("<td>");
					<?php if(! $this->helper->chechActionList(array('inventoryTransactionListQoh'))){?>
	    				inventory_transaction.container_unit_code_name = "";
	    				inventory_transaction.unit_code_name = "";
	    			<?php }?>
					td.html(inventory_transaction.quantity + inventory_transaction.container_unit_code_name);
					tr.append(td);
					
                    var td = $("<td>");
                    <?php if(! $this->helper->chechActionList(array('inventoryTransactionListQoh'))){?>
                        inventory_transaction.container_unit_code_name = "";
                        inventory_transaction.unit_code_name = "";
                    <?php }?>
                    td.html(inventory_transaction.locked_quantity + inventory_transaction.container_unit_code_name);
                    tr.append(td);					
					
					var td = $("<td>");
					td.html(inventory_transaction.qoh + inventory_transaction.unit_code_name);
					tr.append(td);

                    var td = $("<td>");
                    td.html(inventory_transaction.locked_qoh + inventory_transaction.unit_code_name);
                    tr.append(td);
					
					var td = $("<td>");
					td.html(inventory_transaction.time);
					tr.append(td);
					
					var td = $("<td>");
					td.html(inventory_transaction.batch_sn);
					tr.append(td);
					
	                var td = $("<td>");
                    td.html(inventory_transaction.asn_id);
                    tr.append(td);
                    				
					$("#detail_table tr").eq(lineIndex).after(tr);
		    	});
	    	  $('#detail_modal').modal('show').on();
	      }else{
	          alert(data.error_info);
	        }
	    }).fail(function(data){
		    alert('error');
	    }); 
}

function detail_date(product_id) {
	var facility_id = "<?php echo isset($facility_id) ? $facility_id : 0?>";
	var inventory_type = "<?php echo isset($inventory_type) ? $inventory_type : 0?>";
	var inventory_status = "<?php echo isset($inventory_status) ? $inventory_status : 0?>";
	var end_time = "<?php echo isset($end_time) ? $end_time : 0?>";
	var submit_data = {"product_id":product_id, "inventory_type":inventory_type, "inventory_status":inventory_status, "end_time":end_time, "facility_id":facility_id};
	var postUrl = $('#WEB_ROOT').val() + 'inventoryTransactionList/product_facility_date';
	    $.ajax({
            url: postUrl,
            type: 'POST',
            data: submit_data, 
            dataType: "json", 
            xhrFields: {
              withCredentials: true
            }
	  }).done(function(data){
	   	  $("#detail_date_table tr.content").remove();
	      if(data.success == "success"){
	    		data.inventory_facility_date.forEach(function(inventory_transaction){
	    			<?php if(! $this->helper->chechActionList(array('inventoryTransactionListQoh'))){?>
	    				inventory_transaction.quantity = "";
	    				inventory_transaction.qoh = "";
	    			<?php }?>
		    		var lineIndex = $("#detail_date_table tr.content").size();
			    	var tr = $("<tr>");
					tr.addClass('content');
					
					var td = $("<td>");
					td.html(inventory_transaction.facility_name);
					tr.append(td);
					
					var td = $("<td>");
					td.html(inventory_transaction.supplier_name);
					tr.append(td);
					
					var td = $("<td>");
					td.html(inventory_transaction.product_name);
					tr.append(td);
					
					var td = $("<td>");
					td.html(inventory_transaction.unit_code_name);
					tr.append(td);
					
					var td = $("<td>");
					td.html(inventory_transaction.time);
					tr.append(td);

					var td = $("<td>");
					td.html(inventory_transaction.qoh);
					tr.append(td);
					
                    var td = $("<td>");
                    td.html(inventory_transaction.locked_qoh);
                    tr.append(td);	
                    				
					$("#detail_date_table tr").eq(lineIndex).after(tr);
		    	});
	    	  $('#detail_date_modal').modal('show').on();
	      }else{
	          alert(data.error_info);
	        }
	    }).fail(function(data){
		    alert('error');
	    });
}


function detail_batch(product_id) {
    var facility_id = "<?php echo isset($facility_id) ? $facility_id : 0?>";
    var inventory_type = "<?php echo isset($inventory_type) ? $inventory_type : 0?>";
    var inventory_status = "<?php echo isset($inventory_status) ? $inventory_status : 0?>";
    var end_time = "<?php echo isset($end_time) ? $end_time : 0?>";
    var submit_data = {"product_id":product_id, "inventory_type":inventory_type, "inventory_status":inventory_status, "end_time":end_time, "facility_id":facility_id};
    var postUrl = $('#WEB_ROOT').val() + 'inventoryTransactionList/product_facility_batch';
        $.ajax({
            url: postUrl,
            type: 'POST',
            data: submit_data, 
            dataType: "json", 
            xhrFields: {
              withCredentials: true
            }
      }).done(function(data){
          $("#detail_batch_table tr.content").remove();
          if(data.success == "success"){
                data.inventory_facility_date.forEach(function(inventory_transaction){
                    <?php if(! $this->helper->chechActionList(array('inventoryTransactionListQoh'))){?>
                        inventory_transaction.quantity = "";
                        inventory_transaction.qoh = "";
                    <?php }?>
                    var lineIndex = $("#detail_batch_table tr.content").size();
                    var tr = $("<tr>");
                    tr.addClass('content');
                    
                    var td = $("<td>");
                    td.html(inventory_transaction.facility_name);
                    tr.append(td);
                    
                    var td = $("<td>");
                    td.html(inventory_transaction.supplier_name);
                    tr.append(td);
                    
                    var td = $("<td>");
                    td.html(inventory_transaction.product_name);
                    tr.append(td);
                    
                    var td = $("<td>");
                    td.html(inventory_transaction.unit_code_name);
                    tr.append(td);

                    var td = $("<td>");
                    td.html(inventory_transaction.batch_sn);
                    tr.append(td);
                                        
                    var td = $("<td>");
                    td.html(inventory_transaction.time);
                    tr.append(td);

                    var td = $("<td>");
                    td.html(inventory_transaction.in_quantity);
                    tr.append(td);

                    var td = $("<td>");
                    td.html(inventory_transaction.qoh);
                    tr.append(td);
                    
                    var td = $("<td>");
                    td.html(inventory_transaction.locked_qoh);
                    tr.append(td);  
                                    
                    $("#detail_batch_table tr").eq(lineIndex).after(tr);
                });
              $('#detail_batch_modal').modal('show').on();
          }else{
              alert(data.error_info);
            }
        }).fail(function(data){
            alert('error');
        });
}


//搜索
$(document).ready(function() {
	var table = $('#product_list').DataTable(
			{
			    dom: 'lBfrtip',
			    "columnDefs": [
			        {
				         "searchable": false, 
				         "targets": [2,3,4] 
				    }
			    ],
			    buttons: [
			        
			    ],
			    "aaSorting": [
					[ 1, "desc" ]
				],
			    language: {
			        "url": "<?php if(isset($WEB_ROOT)) echo $WEB_ROOT;?>assets/js/Chinese.lang"
			    },
			    aLengthMenu: [[20, 10, 50, -1], [20, 10, 50, "所有"]], 
				scrollY: '100%',
				scrollX: '100%',
			})
});
	//查看
	$("#query").click(function(){
        $("#act").val("query");
        $("form").submit();
    }); 
    
	 // 点击下载 excel 按钮 
     $('#download').click(function(){
        $("#act").val("download");
        $("form").submit();
     }); 
</script>
</body>
</html>
