/**
 * 
 */
var delPpIds = new Array();
$('.price_detail').click(function(){
	delPpIds = new Array();
	tr = $(this).parent().parent();
	cur_add_tr = tr;
	$("#price_detail_table tr.price_detail_list").remove();
	
	product_name = tr.find('td.product_name').html();
	case_num = tr.find('td.case_num').html();
	setoff_case_num = tr.find('td.setoff_case_num').html();
	arrival_case_num = tr.find('td.arrival_case_num').html();
	quantity = tr.find('td.quantity').html();
	product_unit_code = tr.find('td.product_unit_code').html();
	product_unit_code_name = tr.find('td.product_unit_code_name').html();
	price_detail_product_id = tr.find('td.product_id').html();
	price_detail_asn_item_id = tr.find('td.asn_item_id').html();
	price_detail_bol_info = tr.find('td.bol_info').html();
	price_datail_product_supplier_id = tr.find('td.product_supplier_id').html();
	price_datail_product_supplier_name = tr.find('td.product_supplier_name').html();
	container_unit_code = tr.find('td.container_unit_code').html();
	
	if(product_unit_code == 'kg' && product_type == 'goods'){
		$('#price_detail_purchase_unit').val('jin');
		set_detail_hidden_col('jin');
	} else {
		$('#price_detail_purchase_unit').val(container_unit_code);
		set_detail_hidden_col(product_unit_code);
	}

	$('#price_detail_product_name').val(product_name);
	$('#price_detail_commitment_case_num').val(case_num);
	$('#price_detail_setoff_case_num').val(setoff_case_num);
	$('#price_detail_arrival_case_num').val(arrival_case_num);
	$('#price_detail_container_quantity').val(quantity);
	$('#price_detail_product_unit_code').val(product_unit_code_name);
	$('#price_detail_product_id').val(price_detail_product_id);
	$('#price_detail_asn_item_id').val(price_detail_asn_item_id);
	$('#price_datail_bol_info').val(price_detail_bol_info);
	$('#price_detail_product_supplier_id').val(price_datail_product_supplier_id);
	$('#price_detail_product_supplier_name').val(price_datail_product_supplier_name);

	var submit_data = { "asn_item_id":price_detail_asn_item_id };

	//获取采购价格
	var postUrl = $('#WEB_ROOT').val() + 'purchasePrice/getPurchasePriceList';
    $.ajax({
        url: postUrl,
        type: 'POST',
        data:submit_data, 
        dataType: "json", 
        xhrFields: {
          withCredentials: true
        }
  	}).done(function(data){
      if(data.success == "success"){
    	  $("#price_detail_table tr.price_detail_list").remove();
		      data.purchase_price_list.forEach(function(e){
		    	  if(e.purchase_unit == 'kg' && product_type == 'goods') {
		    		  e.replenish_kg_num = e.replenish_kg_num * 2;
		    		  e.kg_num = e.kg_num * 2;
			      } else {
			    	  $('#price_detail_purchase_unit').val(e.purchase_unit);
			      }
		    	  add_price_detail_table_item(e.purchase_user, e.product_supplier_name,
		    			  e.case_num,e.replenish_case_num,e.quantity, e.kg_num,
		    			  e.replenish_kg_num,e.total_price,e.other_price,e.pay_status,e.pp_id);
			  });
	      $('#price_detail_modal').modal('show').on();
      }else{
          alert(data.error_info);
       }
    }).fail(function(data){
	    alert('内部服务器错误');
    });

    
	var postUrl = $('#WEB_ROOT').val() + 'purchasePrice/getPurchaseInventoryList';
	$('#price_datail_bol_info_table tr.content').remove();
    $.ajax({
        url: postUrl,
        type: 'POST',
        data:submit_data, 
        dataType: "json", 
        xhrFields: {
          withCredentials: true
        }
  	}).done(function(data){
      if(data.success == "success"){
	      $('#price_datail_bol_info_table tr.content').remove();
	      total_quanitity = 0;
	      total_case_num = 0;
	      data.inventory_list.forEach(function(e,index){
	    	  if(index == 0){
	    		  return true;
    		  }
	    	 var lineIndex = $("#price_datail_bol_info_table tr.content").size();
	    	 var tr = $("<tr>");
	    	 tr.addClass('content');
	    	 var td = $("<td>");
	 		 td.html(e.facility_name);
	 		 tr.append(td);
	 		 var td = $("<td>");
	 		 td.html(e.bol_sn);
	 		 tr.append(td);
	 		 var td = $("<td>");
	 		 td.html(e.quantity);
	 		 tr.append(td);
	 		 var td = $("<td>");
	 		 td.html(getValueByUnitCode(product_type, product_unit_code, e.unit_quantity))
//	 		 if(product_unit_code == 'kg' ){
//	 		 	td.html(e.unit_quantity * 2);
//	 		 } else {
//	 			td.html(e.unit_quantity);
//	 		 }
	 		 tr.append(td);
	 		 var td = $("<td>");
	 		 td.html(e.created_user);
	 		 tr.append(td);
	 		 var td = $("<td>");
	 		 td.html(e.created_time);
	 		 tr.append(td);
	 		$("#price_datail_bol_info_table tr").eq(lineIndex).after(tr);
	 		total_case_num += parseFloat(e.quantity);
	 		total_quanitity += e.quantity * e.unit_quantity;
	      });

	      if(data.inventory_list.length > 0) {
	    	  total_case_num += parseFloat(data.inventory_list[0].quantity);
		 		total_quanitity += data.inventory_list[0].quantity * data.inventory_list[0].unit_quantity;
		    	 var lineIndex = $("#price_datail_bol_info_table tr.content").size();
		    	 var tr = $("<tr>");
		    	 tr.addClass('content');
		    	 var td = $("<td>");
		 		 td.html(data.inventory_list[0].facility_name);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(data.inventory_list[0].bol_sn);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(data.inventory_list[0].quantity);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(getValueByUnitCode(product_type, product_unit_code, data.inventory_list[0].unit_quantity))
//		 		 if(product_unit_code == '斤'){
//		 			td.html(data.inventory_list[0].unit_quantity * 2);
//		 		 } else {
//		 			td.html(data.inventory_list[0].unit_quantity);
//		 		 }
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(data.inventory_list[0].created_user);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(data.inventory_list[0].created_time);
		 		 tr.append(td);
		 		 var td = $("<td rowspan='"+((data.inventory_list.length==0)?1:data.inventory_list.length)+"'>");
		 		 td.html(total_case_num);
		 		 tr.append(td);
		 		 var td = $("<td rowspan='"+((data.inventory_list.length==0)?1:data.inventory_list.length)+"'>");
		 		 td.html(getValueByUnitCode(product_type, product_unit_code, total_quanitity))
//		 		 if(product_unit_code == '斤'){
//			 			td.html(total_quanitity * 2);
//			 		 } else {
//			 			td.html(total_quanitity);
//			 		 }
		 		 tr.append(td);
		 		 $("#price_datail_bol_info_table tr").eq(0).after(tr);
			  }

	      virtual_total_quanitity = 0;
	      virtual_total_case_num = 0;
	      $('#price_datail_virtual_bol_info_table tr.content').remove();
	      data.virtual_inventory_list.forEach(function(e,index){
		    	  if(index == 0){
		    		  return true;
	    		  }
		    	 var lineIndex = $("#price_datail_virtual_bol_info_table tr.content").size();
		    	 var tr = $("<tr>");
		    	 tr.addClass('content');
		    	 var td = $("<td>");
		 		 td.html(e.facility_name);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(e.bol_sn);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(e.quantity);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(e.created_user);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(e.created_time);
		 		 tr.append(td);
		 		$("#price_datail_virtual_bol_info_table tr").eq(lineIndex).after(tr);
		 		virtual_total_case_num += parseFloat(e.quantity);
		 		virtual_total_quanitity += e.quantity * e.unit_quantity;
		      });

	      if(data.virtual_inventory_list.length > 0) {
	    	 	 virtual_total_case_num += parseFloat(data.virtual_inventory_list[0].quantity);
	    	  	 virtual_total_quanitity += data.virtual_inventory_list[0].quantity * data.virtual_inventory_list[0].unit_quantity;
		    	 var lineIndex = $("#price_datail_virtual_bol_info_table tr.content").size();
		    	 var tr = $("<tr>");
		    	 tr.addClass('content');
		    	 var td = $("<td>");
		 		 td.html(data.virtual_inventory_list[0].facility_name);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(data.virtual_inventory_list[0].bol_sn);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(data.virtual_inventory_list[0].quantity);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(data.in_transit_variance_quantity);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(data.in_stock_variance_quantity);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(data.virtual_inventory_list[0].created_user);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(data.virtual_inventory_list[0].created_time);
		 		 tr.append(td);
		 		 var td = $("<td rowspan='"+((data.virtual_inventory_list.length==0)?1:data.virtual_inventory_list.length)+"'>");
		 		 td.html(virtual_total_case_num);
		 		 tr.append(td);
		 		 $("#price_datail_virtual_bol_info_table tr").eq(0).after(tr);
			  }
      } else {
          alert(data.error_info);
      }
    }).fail(function(data){
	    alert('内部服务器错误');
    });
});

$('#price_detail_sub').click(function(){
	var add_price_items = new Array();
	var asn_item_id = $('#price_detail_asn_item_id').val();
	var product_id = $('#price_detail_product_id').val();
	var purchase_unit = $('#price_detail_purchase_unit').val();
	var facility_id = $('#facility_id').val();

	var available = true;
	$("#price_detail_table tr.price_detail_new_list").each(function(){
		purchase_user = $.trim($(this).find("td.price_detail_purchase_user_td").find('input').val());
		product_supplier_name = $.trim($(this).find("td.price_detail_product_supplier_name_td").find('input').val());
		case_num = $.trim($(this).find("td.price_detail_case_num_td").find('input').val());
		replenish_case_num = $.trim($(this).find("td.price_detail_replenish_case_num_td").find('input').val());
		container_quantity = $.trim($(this).find("td.price_detail_container_quantity_td").find('input').val());
		kg_num = $.trim($(this).find("td.price_detail_kg_num_td").find('input').val());
		replenish_kg_num = $.trim($(this).find("td.price_detail_replenish_kg_num_td").find('input').val());
		total_price = $.trim($(this).find("td.price_detail_total_price_td").find('input').val());
		other_price = $.trim($(this).find("td.price_detail_other_price_td").find('input').val());
		is_paid = $(this).find("td.price_detail_is_paid_td").find('input').prop('checked');
		product_supplier_id = $(this).find("td.price_detail_product_supplier_id_td").html();
		purchase_user_id = $(this).find("td.price_detail_purchase_user_id_td").html();

		if(purchase_unit == 'jin') {
			a_purchase_unit = 'kg';
			kg_num = parseFloat(kg_num)/2;
			replenish_kg_num = parseFloat((replenish_kg_num != '')?replenish_kg_num:0)/2;
		} else {
			a_purchase_unit = purchase_unit;
		}

		if(purchase_user == '' || purchase_user_id == ''){
			available = false;
			alert('采购员不能为空');
			return false;
		}

		var price_item = {
				"asn_item_id":asn_item_id,
				"product_id":product_id,
				"purchase_user":purchase_user,
				"purchase_user_id":purchase_user_id,
				"product_supplier_id":product_supplier_id,
	   			"product_supplier_name":product_supplier_name,
			   	"case_num":case_num,
			   	"replenish_case_num":replenish_case_num,
			   	"container_quantity":container_quantity,
			   	"kg_num":kg_num,
			   	"replenish_kg_num":replenish_kg_num,
			   	"total_price":total_price,
			   	"other_price":other_price,
			   	"is_paid":is_paid?'PAID':'UNPAID',
				"purchase_unit":a_purchase_unit,
				"facility_id":facility_id
			};
		add_price_items.push(price_item);
	});

	if(available == false ){
		return false;
	}

	if($("#price_detail_table tr.price_detail_list").length != 1){
		alert('必须添加一条记录');
		return false;
	}

	var total_num = 0;
	unit_price_text = '';
	
	$("#price_detail_table tr.price_detail_list").each(function(){
		if($(this).hasClass('price_detail_new_list')){
			case_num = $.trim($(this).find("td.price_detail_case_num_td").find('input').val());
			replenish_case_num = $.trim($(this).find("td.price_detail_replenish_case_num_td").find('input').val());
			container_quantity = $.trim($(this).find("td.price_detail_container_quantity_td").find('input').val());
			kg_num = $.trim($(this).find("td.price_detail_kg_num_td").find('input').val());
			replenish_kg_num = $.trim($(this).find("td.price_detail_replenish_kg_num_td").find('input').val());
			unit_price = $.trim($(this).find("td.price_detail_unit_price_td").find('input').val())
		} else {
			case_num = $.trim($(this).find("td.price_detail_case_num_td").html());
			replenish_case_num = $.trim($(this).find("td.price_detail_replenish_case_num_td").html());
			container_quantity = $.trim($(this).find("td.price_detail_container_quantity_td").html());
			kg_num = $.trim($(this).find("td.price_detail_kg_num_td").html());
			replenish_kg_num = $.trim($(this).find("td.price_detail_replenish_kg_num_td").html());
			unit_price = $.trim($(this).find("td.price_detail_unit_price_td").html());
		}
		
		if(purchase_unit == 'jin') {
			unit_price_text += "总价:" + total_price + "<br>";
			total_num += (parseFloat(kg_num) + parseFloat((replenish_kg_num != '')?replenish_kg_num:0));
		} else {
			unit_price_text += "箱规:" + container_quantity + "|总价:" + total_price + "<br>";
			total_num += (parseFloat(case_num) + parseFloat((replenish_case_num != '')?replenish_case_num:0)) * parseFloat(container_quantity);
		}
		
	});

	var tips = '是否确认?';

	if((total_num - parseFloat($('#price_detail_arrival_case_num').val()) * parseFloat($('#price_detail_container_quantity').val())) > 0.000001
			&& (total_num - parseFloat($('#price_detail_setoff_case_num').val()) * parseFloat($('#price_detail_container_quantity').val())) > 0.000001){
		alert('数量与入库数量或装车数量都不匹配');
		return false;
	}
	
	var submit_data = {
			"asn_item_id":asn_item_id,
			"add_price_items":add_price_items,
			"product_type": product_type,
			"remove_price_items":delPpIds
		};
	var cf=confirm(tips);
	if (cf==false)
		return false;
	$('#price_detail_sub').attr('disabled',"true");
	var postUrl = $('#WEB_ROOT').val() + 'purchasePrice/modifyPurchasePrice';
    $.ajax({
        url: postUrl,
        type: 'POST',
        data:submit_data, 
        dataType: "json", 
        xhrFields: {
          withCredentials: true
        }
  	}).done(function(data){
      if(data.success == "success"){
	      alert("提交成功");
	      $('#price_detail_sub').attr('disabled',"true");
	      $('#price_detail_modal').modal('hide');
	      $('#price_detail_sub').removeAttr('disabled');
	      if(data.is_priced == 0){
	    	  cur_add_tr.find("td.price_detail_td").attr('hidden','hidden');
	    	  cur_add_tr.find("td.price_keyin_td").removeAttr('hidden');
	      }
	      cur_add_tr.find('.unit_price_td').html(unit_price_text);
      }else{
    	  $('#price_detail_sub').removeAttr('disabled');
          alert(data.error_info);
       }
    }).fail(function(data){
    	 $('#price_detail_sub').removeAttr('disabled');
    });
});


$('#price_detail_add_product').click(function(){
	if($("#price_detail_table tr.price_detail_list").length >= 1) {
		alert('不能添加多条记录');
		return false;
	}
	
	product_supplier_id = $('#price_detail_product_supplier_id').val();
	product_supplier_name = $('#price_detail_product_supplier_name').val();
	container_quantity = $('#price_detail_container_quantity').val();
	add_price_detail_table_new_item('',product_supplier_name,'','',container_quantity,'','','','','',product_supplier_id);
	
});

function add_price_detail_table_new_item(purchase_user, product_supplier_name,case_num,replenish_case_num,
		container_quantity,kg_num,replenish_kg_num,total_price,other_price,is_paid,product_supplier_id) {
	 purchase_unit = $('#price_detail_purchase_unit').val();
	 if(purchase_unit == 'jin'){
		 case_hidden = true;
		 kg_hidden = false;
	 } else {
		 case_hidden = false;
		 kg_hidden = true;
	 }

	 var lineIndex = $("#price_detail_table tr.price_detail_list").size();
	 var tr = $("<tr>");
	 tr.addClass('price_detail_list');
	 tr.addClass('price_detail_new_list');
	 add_td(tr,'price_detail_purchase_user_td',purchase_user,$('#price_detail_purchase_user_title').width(),false);
	 add_td(tr,'price_detail_product_supplier_name_td',product_supplier_name,$('#price_detail_product_supplier_name_title').width(),false);
	 add_td(tr,'price_detail_case_num_td',case_num,$('#price_detail_case_num_title').width(),case_hidden);
	 add_td(tr,'price_detail_replenish_case_num_td',replenish_case_num,$('#price_detail_replenish_case_num_title').width(),case_hidden);
	 add_td(tr,'price_detail_container_quantity_td',container_quantity,$('#price_detail_container_quantity_title').width(),case_hidden);
	 add_td(tr,'price_detail_kg_num_td',kg_num,$('#price_detail_kg_num_title').width(),kg_hidden);
	 add_td(tr,'price_detail_replenish_kg_num_td',replenish_kg_num,$('#price_detail_replenish_kg_num_title').width(),kg_hidden);
	 add_td(tr,'price_detail_total_price_td',total_price,$('#price_detail_total_price_title').width(),false);
	 add_td(tr,'price_detail_other_price_td',other_price,$('#price_detail_other_price_title').width(),false);
	 
	 paid_checkbox = $("<input>");
	 paid_checkbox.attr("type","checkbox");
	 paid_checkbox.attr('value','1');
	 paid_checkbox.width($('#price_detail_is_paid_title').width());
	 paid_checkbox.css('border','0px');
	 td = $("<td>");
	 td.addClass("price_detail_is_paid_td");
	 td.append(paid_checkbox);
	 td.css('text-align','center');
	 tr.append(td);

	 td = $("<td>");
	 td.addClass("price_detail_product_supplier_id_td");
	 td.html(product_supplier_id);
	 td.css('text-align','center');
	 td.attr('hidden','hidden');
	 tr.append(td);

	 td = $("<td>");
	 td.addClass("price_detail_purchase_user_id_td");
	 td.css('text-align','center');
	 td.attr('hidden','hidden');
	 tr.append(td);

	 delbtn = $("<input>");
	 delbtn.val('删除');
	 delbtn.attr("type","button");
	 delbtn.addClass("btn-danger");
	 delbtn.addClass("price_detail_modal_deltr");
	 delbtn.width('40px');
	 delbtn.css('border','0px');
	 delbtn.click(deltr);
	 td = $("<td>");
	 td.append(delbtn);
	 tr.append(td);
	 $("#price_detail_table tr").eq(lineIndex).after(tr);
}

function add_price_detail_table_item(purchase_user,product_supplier_name,case_num,replenish_case_num,
		container_quantity,kg_num,replenish_kg_num,total_price,other_price,pay_status,pp_id){
	 purchase_unit = $('#price_detail_purchase_unit').val();
	 if(purchase_unit == 'jin'){
		 case_hidden = true;
		 kg_hidden = false;
	 } else {
		 case_hidden = false;
		 kg_hidden = true;
	 }

	 var lineIndex = $("#price_detail_table tr.price_detail_list").size();
	 var tr = $("<tr>");
	 tr.addClass('price_detail_list');
	 add_detail_td(tr,'price_detail_purchase_user_td',purchase_user,false);
	 add_detail_td(tr,'price_detail_product_supplier_name_td',product_supplier_name,false);
	 add_detail_td(tr,'price_detail_case_num_td',case_num,case_hidden);
	 add_detail_td(tr,'price_detail_replenish_case_num_td',replenish_case_num,case_hidden);
	 add_detail_td(tr,'price_detail_container_quantity_td',container_quantity,case_hidden);
	 add_detail_td(tr,'price_detail_kg_num_td',kg_num,kg_hidden);
	 add_detail_td(tr,'price_detail_replenish_kg_num_td',replenish_kg_num,kg_hidden);
	 add_detail_td(tr,'price_detail_total_price_td',total_price,false);
	 add_detail_td(tr,'price_detail_other_price_td',other_price,false);
	 add_detail_td(tr,'price_detail_pp_id_td',pp_id,true);
	 

	 if(pay_status == 'PAID') {
		 add_detail_td(tr,'price_detail_is_paid_td','PAID',false);
	 } else if (pay_status = 'UNPAID') {
		 paybtn = $("<input>");
		 paybtn.val('付款');
		 paybtn.attr("type","button");
		 paybtn.addClass("btn-primary");
		 paybtn.addClass("price_detail_modal_paytr");
		 paybtn.width('60px');
		 paybtn.css('border','0px');
		 paybtn.click(paytr);
 		 td = $("<td>");
		 td.append(paybtn);
		 tr.append(td);
	 }
	
	 delbtn = $("<input>");
		 delbtn.val('删除');
		 delbtn.attr("type","button");
		 delbtn.addClass("btn-danger");
		 delbtn.addClass("price_detail_modal_deltr");
		 delbtn.width('40px');
		 delbtn.css('border','0px');
		 delbtn.click(deltrDetail);
		 td = $("<td>");
	 td.append(delbtn);
	 tr.append(td);
	 $("#price_detail_table tr").eq(lineIndex).after(tr);
}

function paytr(){
	pp_id = $(this).parent().parent().find('td.price_detail_pp_id_td').html();
	pay_td = $(this).parent();
	pay_input = $(this);
	var submit_data = {
			"pp_id":pp_id
		};
	pay_input.attr('disabled','true');
	var postUrl = $('#WEB_ROOT').val() + 'purchasePrice/payPurchasePrice';
	var cf=confirm('是否确认');
	if (cf==false)
		return false;
    $.ajax({
        url: postUrl,
        type: 'POST',
        data:submit_data, 
        dataType: "json", 
        xhrFields: {
          withCredentials: true
        }
  	}).done(function(data){
      if(data.success == "success"){
    	  alert('付款成功');
    	  pay_td.html('PAID');
      }else{
          alert(data.error_info);
          pay_input.removeAttr('disabled');
       }
    }).fail(function(data){
    	pay_input.removeAttr('disabled');
	    alert('内部服务器错误');
    });
}

function deltrDetail(){
	pp_id = $(this).parent().parent().find('td.price_detail_pp_id_td').html();
	delPpIds.push(pp_id);
	$(this).parent().parent().remove();
}