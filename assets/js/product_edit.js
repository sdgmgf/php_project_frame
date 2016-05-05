var url_base = $('#WEB_ROOT').val();
//初始化获取采购人列表
$(document).ready(function(){
	getRemoteData();
	getGoodsListByMerchant();
	getSuppliesFinishedList();
	getRawGoodsProductList();
	div_visible();
	
	
	refreshFacilityShippingTable();
	refreshSetPackageingTable();
	refreshDistributeShippingTable();
	refreshDistributeFacilityTable();
	refreshPackagingModal();
	
	getSuppliesProductList();
	var supplies_product_list = Array();
});
// getRemoteData remoteData1~6 产品初始ajax加载数据
function getRemoteData(){
	$.ajax({
		url:url_base+"productEdit/getRemoteDataAjax",
		type:"post",
		data:{
			"product_id":productJs['product_id'],
			"product_type":productJs['product_type'],
			"product_sub_type":productJs['product_sub_type']
		},
		dataType:"json",
		xhrFields: {
	        withCredentials: true
	    }
	}).done(function(data){
		if(data.success == "success"){
			productMapping(data.res["product_mapping"]);
			
			if(data.res["shipping_service_list"]&&data.res["shipping_service_list"].length>0)
				shippingServiceList(data.res["shipping_service_list"]);
			
			var selectedPlatformId=-1;
			if(data.res["merchant_list"]&&data.res["merchant_list"].length>0)
				selectedPlatformId=merchantList(data.res["merchant_list"]);
			
			if(data.res["platform_list"]&&data.res["platform_list"].length>0)
				platformList(data.res["platform_list"],selectedPlatformId);
			
			if(data.res["product_shipping"]) 
				productShipping(data.res["product_shipping"]);
			
		    if(data.res["specification"])
		    	specificationFunc(data.res["specification"]);
		    
			suppliesRawMaterialList(data.res["supplies_raw_material_list"]);
			
			var product_container_list=data.res["product_container_list"];
			$("#supplies_container_quantity").val(product_container_list[0]?product_container_list[0]['quantity']:"");	
		}else{
			alert("无结果");
		}
	}).fail(function(data){
		alert('内部服务器错误');
	});
}
function productMapping(product_mapping){
	var str="";
	for(var i in product_mapping){
		var item=product_mapping[i];
		str+="<tr class='content' data-product_component_id='"+item['product_component_id']+"'>";
			str+="<td>"+item['product_component_id']+"</td>";
			str+="<td>"+item['component_name']+"</td>";
			str+="<td>"+item['quantity']+"</td>";
			str+="<td>"+(item['unit_code_name']?item['unit_code_name']:'')+"</td>";
			str+="<td width='40px'>";
		if(productJs['status'] && productJs['status']=='INIT'){
			str+="<input type='button' class='btn btn-danger' value='删' style='width: 38px; height: 24px;'>";
		}
		str+="</td></tr>";
	}
	$("#product_mapping").append(str);
}
function shippingServiceList(shipping_service_list){
	var str="";
	for(var i in shipping_service_list){
		var item=shipping_service_list[i];
		str+="<option value='"+item['service_id']+"'";
		if(item['service_id']==(productJs['shipping_service_id']?productJs['shipping_service_id']:""))
			str+=" selected='selected' ";
		str+=">"+item['service_name']+"</option>";
	}
	$("#shipping_service_id").append(str);
}
function platformList(platform_list,selectedPlatformId){
	var str="<option value=''></option>";
	for(var i in platform_list){
		var item=platform_list[i];
		str+="<option value='"+item['platform_id']+"'";
		if(item['platform_id']==selectedPlatformId)
			str+=" selected='selected' ";
		str+=">"+item['platform_name']+"</option>";
	}
	$("#platform_id").append(str);
}
function merchantList(merchant_list){
	var selectedPlatformId=-1;
	var str="<option value=''></option>";
	for(var i in merchant_list){
		var item=merchant_list[i];
		str+="<option value='"+item['merchant_id']+"'";
		if(item['merchant_id']==productJs['merchant_id']){
			str+=" selected='selected' ";
			selectedPlatformId=item['platform_id'];
		}
		str+=">"+item['merchant_name']+"</option>";
	}
	$("#merchant_id").append(str);
	return selectedPlatformId;
}
function productShipping(product_shipping){
	var str="";
	
	if(!product_shipping['use_best_shipping']){
		str+="<option value=''>请选择</option>" +
				"<option value='1'>最优</option>" +
				"<option value='0'>人工</option>" ;
				
	}else{
		str+="<option value='1'";
		if(product_shipping['use_best_shipping']==='1'){
			str+=" selected='selected' ";
		}
		str+=">最优</option><option value='0'";
		
		if(product_shipping['use_best_shipping']==='0'){
			str+=" selected='selected' ";
		}
		str+=">人工</option>";
	}
	
	$("#use_best_shipping").append(str);

	
	if(product_shipping['use_best_shipping']&&product_shipping['use_best_shipping']==='0'){
		$("#general_link").show();
	}else{
		$("#general_link").hide();
	}

	if(product_shipping['use_best_shipping']&&product_shipping['use_best_shipping']==='1'){
		$("#best_link").show();
	}else{
		$("#best_link").hide();
	}

	weightObj={
		'quality':'',
		'price':'',
		'unreachable':'',
		'aftersale_rate':'',
		'timeliness':''
	};
	if(product_shipping['use_best_shipping']){
		weightObj['quality']=product_shipping['quality'];
		weightObj['price']=product_shipping['price'];
		weightObj['unreachable']=product_shipping['unreachable'];
		weightObj['aftersale_rate']=product_shipping['aftersale_rate'];
		weightObj['timeliness']=product_shipping['timeliness'];
	}

	str="";
	str+="<p>";
		str+="<label class='quality'>质量权重："+weightObj['quality']+"</label>";
		str+="<label class='price'>价格权重："+weightObj['price']+"</label>";
	str+="</p>";
	str+="<p>";
		str+="<label class='unreachable'>可达性权重："+weightObj['unreachable']+"</label>";
		str+="<label class='aftersale_rate'>售后率权重："+weightObj['aftersale_rate']+"</label>";
		str+="<label class='timeliness'>时效性权重："+weightObj['timeliness']+"</label>";
	str+="</p>";
	$("#best_link").append(str);
//modal
	str="";
	str+="<p>";
		str+="<label>质量权重：<input type='number' value='"+weightObj['quality']+"' class='form-control input-sm' name='quality' id='quality'></label>";
		str+="<label>价格权重：<input type='number' value='"+weightObj['price']+"' class='form-control input-sm' name='price' id='price'></label>";
	str+="</p>";
	str+="<p>";
		str+="<label>可达性权重：<input type='number' value='"+weightObj['unreachable']+"' class='form-control input-sm' name='unreachable' id='unreachable'></label>";
		str+="<label>售后率权重：<input type='number' value='"+weightObj['aftersale_rate']+"' class='form-control input-sm' name='aftersale_rate' id='aftersale_rate'></label>";
		str+="<label>时效性权重：<input type='number' value='"+weightObj['timeliness']+"' class='form-control input-sm' name='timeliness' id='timeliness'></label>";
	str+="</p>";
	$("#modalWeight").append(str);
}
function specificationFunc(specification){  
    $("#receiving_standard").val(specification['receiving_standard']?specification['receiving_standard']:"");
    $("#receiving_exception_handling").val(specification['receiving_exception_handling']?specification['receiving_exception_handling']:"");
    $("#storage_temperature").val(specification['storage_temperature']?specification['storage_temperature']:"");
    $("#storage_days").val(specification['storage_days']?specification['storage_days']:"");
    $("#storage_notes").val(specification['storage_notes']?specification['storage_notes']:"");
    $("#defective_standard").val(specification['defective_standard']?specification['defective_standard']:"");
    $("#bad_standard").val(specification['bad_standard']?specification['bad_standard']:"");
    $("#defective_handing").val(specification['defective_handing']?specification['defective_handing']:"");
    $("#specification").val(specification['specification']?specification['specification']:"");
}
function suppliesRawMaterialList(supplies_raw_material_list){
    var str="";
    for(var i in supplies_raw_material_list){
        var supplies_raw_material=supplies_raw_material_list[i];
        str+="<tr class='content' data-product_component_id='"+supplies_raw_material['product_component_id']+"'>";
        str+="<td>"+supplies_raw_material['product_component_id']+"</td>";
        str+="<td>"+supplies_raw_material['component_name']+"</td>";
        str+="<td>"+supplies_raw_material['quantity']+"</td>";
        str+="<td>"+supplies_raw_material['unit_code_name']+"</td>";
        str+="<td width='40px'>";
        if(productJs['status'] && productJs['status']=='INIT'){
        	str+="<input type='button' class='btn btn-danger' value='删' style='width: 38px; height: 24px;'>";
        }
		str+="</td></tr>";
    }
    $("#supplies_raw_material_list").append(str);
}
$('#add_supplies_finished_btn').click(function(){
	var lineIndex = $("#supplies_finished_table tr.content").size();
	if(lineIndex >= 1) {
		alert('包装方案不能有且仅有一条');
		return false;
	}
 	tr = $('<tr>');
	tr.addClass('content');
	td = $('<td>');
	td.addClass('supplies_finished_id');
	td.width($('#supplies_finished_id_title').width());
	input = $('<input>');
	input.attr('name','supplies_finished_ids[]');
	input.attr('readonly','readonly');
	td.append(input);
	tr.append(td);
	td = $('<td>');
	td.width($('#supplies_finished_name_title').width());
	td.addClass('supplies_finished_name');
	input = $('<input>');

	input.autocomplete(supplies_finished_list, {
	    minChars: 0,
	    width: 310,
	    max: 100,
	    matchContains: true,
	    autoFill: false,
	    formatItem: function(row, i, max) {
	        return row.product_id + "[" + row.product_name + "]";
	    },
	    formatMatch: function(row, i, max) {
	    	return row.product_id + "[" + row.product_name + "]";
	    },
	    formatResult: function(row) {
	    	return row.product_id + "[" + row.product_name + "]";
	    }
	}).result(function(event, row, formatted) {
		$(this).parent().parent().find('td.supplies_finished_id').find('input').val(row.product_id);
		$(this).val(row.product_name);
		$('.mapping_supplies_product_desc').html( '<i class="triangle_lf"></i>'+row.product_id+" 的描述："+row.product_desc );
		$('.mapping_supplies_product_desc').css('display','block');
	});
	input.width(td.width());
	td.append(input);
	tr.append(td);

	td = $('<td>');
	td.width($('#supplies_finished_operator_title').width());
	td.addClass('supplies_finished_operator');
	input = $('<input>');
	input.attr('type','button');
	input.addClass('btn');
	input.addClass('btn-danger');
	input.width(td.width());
	input.height('24px');
	input.val('删');
	//input.click(remove_tr);
	td.append(input);
	tr.append(td);
	$("#supplies_finished_table tr").eq(lineIndex).after(tr);
});

$('#merchant_goods_table').on('click','.btn-danger',function(){
	var $this = $(this),
		$product_goods_mapping_id_input = $('input[name="product_goods_mapping_id"]'),
		product_goods_mapping_id = $product_goods_mapping_id_input.val();
	if(product_goods_mapping_id){
		$product_goods_mapping_id_input.val( product_goods_mapping_id+','+$this.closest('tr').data('product_goods_mapping_id') );		
	}else{
		$product_goods_mapping_id_input.val( product_goods_mapping_id+$this.closest('tr').data('product_goods_mapping_id') );				
	}
	$this.closest('tr.content').remove();
});

$('#mapping_product_table').on('click','.btn-danger',function(){
	var $this = $(this),
		$product_component_id_input = $('input[name="product_component_id"]'),
		product_component_id = $product_component_id_input.val();
	if(product_component_id){
		$product_component_id_input.val( product_component_id+','+$this.closest('tr').data('product_component_id') );		
	}else{
		$product_component_id_input.val( product_component_id+$this.closest('tr').data('product_component_id') );				
	}
	$this.closest('tr.content').remove();
});

$('#supplies_finished_table').on('click','.btn-danger',function(){
	$('.mapping_supplies_product_desc').css('display','none');
	remove_tr.call(this);
});

$('#supplies_raw_material_list').on('click','.btn-danger',function(){
	var $this = $(this),
		$product_supplies_id_input = $('input[name="product_supplies_id"]'),
		product_supplies_id = $product_supplies_id_input.val();
	if(product_supplies_id){
		$product_supplies_id_input.val( product_supplies_id+','+$this.closest('tr').data('product_component_id') );		
	}else{
		$product_supplies_id_input.val( product_supplies_id+$this.closest('tr').data('product_component_id') );				
	}
	$this.closest('tr.content').remove();
});


$('.btn-danger').on('click',function(){
	$('.mapping_supplies_product_desc').css('display','none');
});

$('#add_merchant_goods_ids_btn').click(function(){
	if(merchant_goods_list.length == 0) {
		alert('无请求创建档案的OMS商品');
	}
	var lineIndex = $("#merchant_goods_table tr.content").size();
	tr = $('<tr>');
	tr.addClass('content');
	td = $('<td>');
	td.addClass('merchant_goods_id');
	td.width($('#merchant_goods_id_title').width());
	input = $('<input>');
	input.attr('name','merchant_goods_ids[]');
	input.autocomplete(merchant_goods_list, {
	    minChars: 0,
	    width: 310,
	    max: 100,
	    matchContains: true,
	    autoFill: false,
	    formatItem: function(row, i, max) {
	        return "[" + row.goods_id + "]";
	    },
	    formatMatch: function(row, i, max) {
	    	return "[" + row.goods_id + "]";
	    },
	    formatResult: function(row) {
	    	return "[" + row.goods_id + "]";
	    }
	}).result(function(event, row, formatted) {
		$(this).parent().parent().find('td.merchant_goods_name').html(row.goods_name);
		$(this).val(row.goods_id);
	});
	td.append(input);
	tr.append(td);
	td = $('<td>');
	td.width($('#merchant_goods_name_title').width());
	td.addClass('merchant_goods_name');
	tr.append(td);

	td = $('<td>');
	td.width($('#merchant_goods_operator_title').width());
	td.addClass('merchant_goods_operator');
	input = $('<input>');
	input.attr('type','button');
	input.addClass('btn');
	input.addClass('btn-danger');
	input.width(td.width());
	input.height('24px');
	input.val('删');
	input.click(remove_tr);
	td.append(input);
	tr.append(td);
	$("#merchant_goods_table tr").eq(lineIndex).after(tr);
});

$('#add_mapping_product_ids_btn').click(function(){
	var lineIndex = $("#mapping_product_table tr.content").size();
	tr = $('<tr>');
	tr.addClass('content');
	td = $('<td>');
	td.addClass('mapping_product_id');
	input = $('<input>');
	input.attr('name','product_component_ids[]');
	input.attr('readonly','readonly');
	td.append(input);
	tr.append(td);
	td = $('<td>');
	td.addClass('mapping_product_name');
	input = $('<input>');

	input.autocomplete(rawMaterialProductList, {
	    minChars: 0,
	    width: 310,
	    max: 100,
	    matchContains: true,
	    autoFill: false,
	    formatItem: function(row, i, max) {
	        return row.product_id + "[" + row.product_name + "]";
	    },
	    formatMatch: function(row, i, max) {
	    	return row.product_id + "[" + row.product_name + "]";
	    },
	    formatResult: function(row) {
	    	return row.product_id + "[" + row.product_name + "]";
	    }
	}).result(function(event, row, formatted) {
		$(this).parent().parent().find('td.mapping_product_id').find('input').val(row.product_id);
		$(this).parent().parent().find('td.mapping_product_unit').html(row.unit_code_name);
		$(this).val(row.product_name);
	});
	
	td.append(input);
	tr.append(td);
	td = $('<td>');
	td.addClass('mapping_product_quantity');
	input = $('<input>');
	input.attr('name','product_component_quantitys[]');
	input.attr('type','number');
	td.append(input);
	tr.append(td);
	
	td = $('<td>');
	td.addClass('mapping_product_unit');
	td.width(40);
	tr.append(td);

	td = $('<td>');
	td.addClass('mapping_product_operator');
	input = $('<input>');
	input.attr('type','button');
	input.addClass('btn');
	input.addClass('btn-danger');
	input.height('24px');
	input.val('删');
	input.click(remove_tr);
	td.append(input);
	tr.append(td);
	$("#mapping_product_table tr").eq(lineIndex).after(tr);
})

function getSuppliesFinishedList() {
	$.ajax({
		url:url_base+"product/getProductFinishedList",
		type:"get",
		async:false,
		dataType:"json",
		xhrFields: {
            withCredentials: true
        }
	}).done(function(data){
		if(data.success == "success"){
			supplies_finished_list = data.mapping_supplies_finished_list;
		} else{
			alert(data.error_info);
		}
	});
}

function getRawGoodsProductList() {
	$.ajax({
		url:url_base+"product/getProductList",
		type:"get",
		async:false,
		data:{product_type:'goods',product_sub_type:'raw_material'},
		dataType:"json",
		xhrFields: {
            withCredentials: true
        }
	}).done(function(data){
		if(data.res == "success"){
			rawMaterialProductList = data.product_list
		} else{
			alert(data.error_info);
		}
	});
}

function getGoodsListByMerchant(){
	$.ajax({
		url:url_base+"product/getGoodsListByMerchant",
		type:"get",
		data:{"merchant_id":$('#merchant_id').val()},
		dataType:"json",
		xhrFields: {
            withCredentials: true
        }
	}).done(function(data){
		if(data.success == "success"){
			merchant_goods_list = data.merchant_goods_list;
		}	
		else{
			alert(data.error_info);
		}
	});
}

function div_visible() {
	var product_type = $("[name='product_type']").filter(":checked").val();; 
	var product_sub_type = $("[name='product_sub_type']").filter(":checked").val();

	if(product_type == 'goods'){
		if(product_sub_type == 'raw_material'){
			$('#product_finish_div').addClass('hidden');
			$('#product_semi_finish_div').addClass('hidden');
			$('#product_raw_material_div').removeClass('hidden');
			$('#product_specification_div').removeClass('hidden');
			$('#product_supplies_div').addClass('hidden');
			$('#product_supplies_finished_div').addClass('hidden');
			$('#weight_div').appendTo($('#product_raw_material_div2'));
			$('#best_shipping_li').css('display','none');
            $('#scale_li').css('display','none');
			$('#specification_li').css('display','block');
			$('#product_district_li').hide();
		} else if(product_sub_type == 'semi_finished') {
			$('#product_finish_div').addClass('hidden');
			$('#product_semi_finish_div').removeClass('hidden');
			$('#product_raw_material_div').addClass('hidden');
			$('#product_specification_div').addClass('hidden');
			$('#product_supplies_div').addClass('hidden');
			$('#product_supplies_finished_div').addClass('hidden');
			$('#best_shipping_li').css('display','none');
            $('#scale_li').css('display','none');
			$('#specification_li').css('display','none');
			$('#product_district_li').hide();
		} else if(product_sub_type == 'finished') {
			$('#product_finish_div').removeClass('hidden');
			$('#product_semi_finish_div').addClass('hidden');
			$('#product_raw_material_div').addClass('hidden');
			$('#product_specification_div').addClass('hidden');
			$('#product_supplies_div').addClass('hidden');
			$('#product_supplies_finished_div').addClass('hidden');
			$('#best_shipping_li').css('display','block');
            $('#scale_li').css('display','block');
			$('#specification_li').css('display','none');
			$('#product_district_li').show();
		}
	} else if(product_type == 'supplies'){
		if(product_sub_type == 'raw_material') {
			$('#product_finish_div').addClass('hidden');
			$('#product_semi_finish_div').addClass('hidden');
			$('#product_raw_material_div').addClass('hidden');
			$('#product_specification_div').addClass('hidden');
			$('#product_supplies_finished_div').addClass('hidden');
			$('#product_supplies_div').removeClass('hidden');
			$('#weight_div').appendTo( $('#product_supplies_div') );
			$('#best_shipping_li').css('display','none');
            $('#scale_li').css('display','none');
			$('#specification_li').css('display','none');	
			$('#product_district_li').hide();	
		} else if(product_sub_type == 'finished') {
			$('#product_finish_div').addClass('hidden');
			$('#product_semi_finish_div').addClass('hidden');
			$('#product_raw_material_div').addClass('hidden');
			$('#product_specification_div').addClass('hidden');
			$('#product_supplies_div').addClass('hidden');
			$('#product_supplies_finished_div').removeClass('hidden');
			$('#best_shipping_li').css('display','none');
            $('#scale_li').css('display','none');
			$('#specification_li').css('display','none');
			$('#product_district_li').hide();
		}

	}
}

$('.btn-remove').click(function(){
		$(this).parent().parent().remove();
})

function remove_tr(){
	$(this).parent().parent().remove();
}
function validateSubmitData(){
	//基础数据
	var product_name_input = $("#product_name");
	if(product_name_input.val() == '') {
		alert("产品名称不能为空");
		product_name_input.focus();
		return false;
	}
	
	var product_desc_input = $("#product_desc");
	if(product_desc_input.val() == '') {
		alert("产品描述不能为空");
		product_desc_input.focus();
		return false;
	}
	var product_type_val = $("[name='product_type']").filter(":checked").val();; 
	var product_sub_type_val = $("[name='product_sub_type']").filter(":checked").val();
	if(product_type_val == '' || product_sub_type_val == '') {
		alert('参数错误');
		return false;
	}
    var net_weight_min_input = $("#net_weight_min");
	var net_weight_max_input = $("#net_weight_max");
	
	var producing_region_input = $("#producing_region");
	var purchasing_cycle_goods_raw = $("#purchasing_cycle_goods_raw");
	var purchasing_cycle_supplies_raw = $("#purchasing_cycle_supplies_raw");
	var purchasing_cycle_input = $("#purchasing_cycle");
	var supplies_unit_code_val = $('#supplies_unit_code option:selected').val();
	var supplies_unit_code_name_val = $('#supplies_unit_code option:selected').text();
	var width_input = $('#width');
	var height_input = $('#height');
	var length_input = $('#length');
	var supplier_container_quantity = $('#supplier_container_quantity');
	
	var merchant_id_input = $("#merchant_id");
	var merchant_goods_ids = new Array();
	$("#merchant_goods_table tr.content").each(function(){
		merchant_goods_id = $(this).find("td.merchant_goods_id").find('input').val();
		merchant_goods_ids.push(merchant_goods_id);
	});	
	
	var supplies_finished_ids = new Array();
	$("#supplies_finished_table tr.content").each(function(){
		supplies_finished_id = $(this).find("td.supplies_finished_id").find('input').val();
		supplies_finished_ids.push(supplies_finished_id);
	});
	
	var product_supplies_ids = new Array();
	$("#supplies_raw_material_list").each(function(){
		product_supplies_id = $(this).find('td.product_supplies_id').html();
		product_supplies_ids.push(product_supplies_id);
	});

	var secrect_code_input = $("#secrect_code");
	var shipping_service_id_input = $("#shipping_service_id");
	
	var unit_code_val = $('#unit_code option:selected').val();
	var unit_code_name_val = $('#unit_code option:selected').text();
	
	var parent_product_id_input = $("#parent_product_id");
	var parent_product_name_input = $("#parent_product_name");
    var valid_days = $('#product_raw_material_div2').find('.valid_days_input').val();
    var storage_days = $('#storage_days').val();

    var $facility_id_input = $('.facility_item').find('input[name=facilitys]').filter(':checked');

	switch (product_type_val) {
	case 'goods':
		switch (product_sub_type_val) {
		case 'raw_material':
			if( purchasing_cycle_goods_raw.val()=='' || purchasing_cycle_goods_raw.val()<0 ){
				alert('采购周期不能为空,而且必须为非负数');
				purchasing_cycle_goods_raw.focus();
				return;
			}
			purchasing_cycle_input.val(purchasing_cycle_goods_raw.val());
			if(producing_region_input.val() == '') {
				alert('产地不能为空');
				producing_region_input.focus();
				return false;
			}
			
			if(unit_code_val == '' || unit_code_name_val == '') {
				alert('请选择存储单位');
				return false;
			}

			if($('#purchase_unit_code') == '') {
				alert('请选择采购单位');
				return false;
			}

			if($('#sale_unit_code') == '') {
				alert('请选择销售单位');
				return false;
			}
            if( valid_days == '' ){
                alert('保质期不能为空');
                return false;
            }

			if( net_weight_min_input.val()=='' || net_weight_min_input.val()<0 ){
                alert('净重最小值必须为非负数且不能为空');
                net_weight_min_input.focus();
                return;
            }

            if( net_weight_max_input.val()=='' || net_weight_max_input.val()<0 ){
				alert('净重最大值必须为非负数且不能为空');
				net_weight_max_input.focus();
				return;
			}
			
			if( storage_days && storage_days<=0 ){
				alert('存储天数必须大于0');
				$('#storage_days').focus();
				return false;
			}
			break;
		case 'semi_finished':
			if(parent_product_id_input.val() == '') {
				alert('原料不能为空')
				parent_product_name_input.focus();
				return false;
			}
			break;
		case 'finished':
			if(product_name_input.val() != '') {
				var re = /^(【规格[：:].*】).*/;
				if( !re.test(product_name_input.val()) ){
					alert("请输入正确格式的产品名称");
					product_name_input.focus();
					return false;
				}
			}
			if(supplies_unit_code_val == '' || supplies_unit_code_name_val == '' ||
					merchant_id_input.val() == '' || shipping_service_id_input.val() == '') {
				alert('参数错误');
				return false;
			}
			if(secrect_code_input.val() == '') {
				alert('暗语不能为空');
				secrect_code_input.focus();
				return false;
			}
			if(merchant_goods_ids && merchant_goods_ids.length == 0) {
				alert("merchant goods 不能为空");
				return;
			}
			if(merchant_goods_ids && merchant_goods_ids.length != 0){
				var flag = false;
				var mstatus = 0;
				$("#merchant_goods_table tr.content").each(function(i){
				    if( $(this).find("td.merchant_goods_name").html() == ''){
				    	mstatus++;
				    };
				});
				if( mstatus > 0){
					var mcf=confirm( "商品名称存在空，确认录入?" );
					if(mcf==false){
						flag = true;
						return false;
					}
				}
				if(flag) return false;
			}

			break;
		default:
			break;
		}
		break;
	case 'supplies':
		switch (product_sub_type_val) {
			case 'finished':
				if(product_name_input.val() != '') {
					var re = /【(快递配|落地配|自配送)】$/;
					if( !re.test(product_name_input.val()) ){
						alert("请输入正确格式的产品名称");
						product_name_input.focus();
						return false;
					}
				}

				if( product_supplies_ids && product_supplies_ids.length!=0 ){
					var flag = false;
					$('#supplies_raw_material_list tr.content').each(function(){
						if( $(this).find('td.product_supplies_ids').find('input').val() =='' ){
							flag = true;
							alert('请不要自己随意输入耗材名字');
							return false;
						}
						if( $(this).find('td.supplies_quantitys').find('input').val() =='' ){
							flag = true;
							alert('数量不能为空');
							return false;
						} 
					});

					if(flag) return false;
				}
				break;
			case 'raw_material':
				if( purchasing_cycle_supplies_raw.val()=='' || purchasing_cycle_supplies_raw.val()<0 ){
					alert('采购周期不能为空去诶必须为非负数');
					purchasing_cycle_supplies_raw.focus();
					return;
				}
				purchasing_cycle_input.val(purchasing_cycle_supplies_raw.val());
				if( supplier_container_quantity.val()==''||supplier_container_quantity.val()<0 ){
					alert('规格不能为空且必须为非负数');
					supplier_container_quantity.focus();
					return;
				}
				if(width_input.val() == '') {
					alert('宽度不能为空');
					width_input.focus();
					return false;
				}
				if(height_input.val() == '') {
					alert('高度不能为空');
					height_input.focus();
					return false;
				}
				if(length_input.val() == '') {
					alert('长度不能为空');
					length_input.focus();
					return false;
				}
				if(supplier_container_quantity.val() == '') {
					alert('规格不能为空');
					supplier_container_quantity.focus();
					return false;
				}
				break;
		}
		break;
	default:
		alert('参数错误');
		break;
	}
	
	return true;
}

//js本地图片预览，兼容ie[6-9]、火狐、Chrome17+、Opera11+、Maxthon3
function PreviewImage(fileObj, imgPreviewId, divPreviewId) {
	var allowExtention = ".jpg,.bmp,.gif,.png"; //允许上传文件的后缀名document.getElementById("hfAllowPicSuffix").value;
	var extention = fileObj.value.substring(fileObj.value.lastIndexOf(".") + 1).toLowerCase();
	var browserVersion = window.navigator.userAgent.toUpperCase();
	if (allowExtention.indexOf(extention) > -1) {
		if (fileObj.files) {//HTML5实现预览，兼容chrome、火狐7+等
			if (window.FileReader) {
				var reader = new FileReader();
				reader.onload = function (e) {
					document.getElementById(imgPreviewId).setAttribute("src", e.target.result);
				}
				reader.readAsDataURL(fileObj.files[0]);
			} else if (browserVersion.indexOf("SAFARI") > -1) {
				alert("不支持Safari6.0以下浏览器的图片预览!");
			}
		} else if (browserVersion.indexOf("MSIE") > -1) {
			if (browserVersion.indexOf("MSIE 6") > -1) {//ie6
				document.getElementById(imgPreviewId).setAttribute("src", fileObj.value);
			} else {//ie[7-9]
				fileObj.select();
			if (browserVersion.indexOf("MSIE 9") > -1)
				fileObj.blur(); //不加上document.selection.createRange().text在ie9会拒绝访问
				var newPreview = document.getElementById(divPreviewId + "New");
				if (newPreview == null) {
					newPreview = document.createElement("div");
					newPreview.setAttribute("id", divPreviewId + "New");
				}
				var a = document.selection.createRange().text;
				newPreview.style.height = 390 + "px";
				newPreview.style.border = "solid 1px #eeeeee";
				newPreview.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src='" + document.selection.createRange().text + "')";
				var tempDivPreview = document.getElementById(divPreviewId);
				newPreview.style.display = "block";
				tempDivPreview.style.display = "none";
				
				}
			} else if (browserVersion.indexOf("FIREFOX") > -1) {//firefox
				var firefoxVersion = parseFloat(browserVersion.toLowerCase().match(/firefox\/([\d.]+)/)[1]);
				if (firefoxVersion < 7) {//firefox7以下版本
					document.getElementById(imgPreviewId).setAttribute("src", fileObj.files[0].getAsDataURL());
				} else {//firefox7.0+ 
					document.getElementById(imgPreviewId).setAttribute("src", window.URL.createObjectURL(fileObj.files[0]));
				}
			} else {
				document.getElementById(imgPreviewId).setAttribute("src", fileObj.value);
			}
			$("#" + divPreviewId ).removeAttr('hidden');
			imgDiv = $("#" + divPreviewId ).parents('.imgDiv').next('.imgDiv');
			if(imgDiv && imgDiv.length == 0) {
				imgDiv = $("#" + divPreviewId ).parents('.imgDiv').parent().next().find('.imgDiv').eq(0);
			}
//			imgDiv.removeAttr('hidden');
		} else {
			alert("仅支持" + allowExtention + "为后缀名的文件!");
			fileObj.value = ""; //清空选中文件
			if (browserVersion.indexOf("MSIE") > -1) {
				fileObj.select();
				document.selection.clear();
			}
// 			fileObj.outerHTML = fileObj.outerHTML;
		}
}


$('.delImg').click(function(){
	$(this).parents('.imgDiv').find('.img').val('');
	$(this).parent().attr('hidden','true');
	imgDiv = $(this).parents('.imgDiv');
	imgDiv =  $(this).parents('.imgDiv').next('.imgDiv');
	if(imgDiv && imgDiv.length == 0) {
		imgDiv = $(this).parents('.imgDiv').parent().next().find('.imgDiv').eq(0);
	}
	$(this).prev().find('input').remove();
});


$(".img", ".imgDiv").mouseover(function () {
	$(this).blur();
});

$(".img", ".imgDiv").change(function () {
	productImg =$(this).parent().siblings('.imgShow').children('.productImg').attr('id');
	imgHolder = $(this).parent().siblings('.imgShow').children('.productImg').children(0).children('.imgHolder').attr('id');
	PreviewImage(this, imgHolder, productImg);
});

$('#sub').click(function(){
	if(!validateSubmitData()){
		return false;
	}
	var cf = confirm( "是否确认?" );
	if (cf == false)
		return ;
	btn = $(this);
	btn.attr('disabled','disabled');
	if(productJs['status']!= 'INIT'){
		$("#platform_id").removeAttr('disabled');
		$("#merchant_id").removeAttr('disabled');
	}
	$('#product_form').submit();
});

$("#product_form").submit(function(){ 
	$('#supplies_unit_code_name').val($('#supplies_unit_code option:selected').text());
	$('#container_unit_code_name').val($('#container_unit_code option:selected').text());
	$('#unit_code_name').val($('#unit_code option:selected').text());

	var facilityJson = [],
        $facility_id_input = $('.facility_item').find('input[name="facilitys[]"]').filter(':checked');
    $facility_id_input.each(function(){
        var $this = $(this),
            i = 0,
            facility_id = $this.val();
        $this.parent('.facility_label').next('.shipping_item').find('input[name=shippings]').filter(':checked').each(function(){
            i++;
            var tempObj = {
                'facility_id' : facility_id,
                'shipping_id' : $(this).val()
            };
            facilityJson.push(tempObj);
        });
    });

    $('#facility_shipping_list').val(JSON.stringify(facilityJson));
	options = {
		dataType: 'json',
        success: function (data) {
        	if(data.success == 'success'){
        		if(productJs['status']!= 'INIT'){
        			$("#platform_id").attr('disabled','disabled');
        			$("#merchant_id").attr('disabled','disabled');
        		}
        		$('#sub').removeAttr('disabled');
            	alert('修改成功');
            	history.back(-1);
        	} else{
            	alert(data.error_info);
            	btn.removeAttr('disabled');
        	}
        }
    };
   $("#product_form").ajaxSubmit(options);
   return false;
});

$('#unit_code').on('change',function(){
    var $this = $(this);
    if($this.val()==='kg'){
        $('#net_weight_min').val(1);
        $('#net_weight_max').val(1);
        $('#net_weight_min').attr('readonly','readonly');
        $('#net_weight_max').attr('readonly','readonly');
    }else{
        $('#net_weight_min').removeAttr('readonly');
        $('#net_weight_max').removeAttr('readonly');
    }
});

$('.selectImg').on('click',function(){
    var $this = $(this),
        $tInput = $this.parents('.imgDiv').find("input[type='file']");
    $tInput.trigger('click');
});

