/**
 * 
 */

$('.price_keyin').click(function(){
		$("#price_keyin_table tr.price_keyin_list").remove();
		tr = $(this).parent().parent();
		cur_add_tr = tr;

		$('#price_keyin_inventory_qoh').val('');
		
		product_name = tr.find('td.product_name').html();
		case_num = tr.find('td.case_num').html();
		setoff_case_num = tr.find('td.setoff_case_num').html();
		arrival_case_num = tr.find('td.arrival_case_num').html();
		quantity = tr.find('td.quantity').html();
		product_unit_code = tr.find('td.product_unit_code').html();
		product_unit_code_name = tr.find('td.product_unit_code_name').html();
		price_keyin_product_id = tr.find('td.product_id').html();
		price_keyin_asn_item_id = tr.find('td.asn_item_id').html();
		price_keyin_bol_info = tr.find('td.bol_info').html();
		price_keyin_product_supplier_id = tr.find('td.product_supplier_id').html();
		price_keyin_product_supplier_name = tr.find('td.product_supplier_name').html();
		container_unit_code = tr.find('td.container_unit_code').html();

		$('#price_keyin_product_name').val(product_name);
		$('#price_keyin_commitment_case_num').val(case_num);
		$('#price_keyin_setoff_case_num').val(setoff_case_num);
		$('#price_keyin_arrival_case_num').val(arrival_case_num);
		$('#price_keyin_container_quantity').val(quantity);
		$('#price_keyin_product_unit_code').val(product_unit_code_name);
		$('#price_keyin_product_id').val(price_keyin_product_id);
		$('#price_keyin_asn_item_id').val(price_keyin_asn_item_id);
		$('#price_keyin_bol_info').val(price_keyin_bol_info);
		$('#price_keyin_product_supplier_id').val(price_keyin_product_supplier_id);
		$('#price_keyin_product_supplier_name').val(price_keyin_product_supplier_name);
		if(product_unit_code == 'kg' && product_type == 'goods'){
			$('#price_keyin_purchase_unit').val('jin');
			set_hidden_col('jin');
		} else {
			$('#price_keyin_purchase_unit').val(container_unit_code);
			set_hidden_col('case');
		}
		submit_data = {'asn_item_id':price_keyin_asn_item_id}
		//获取采购价格
		$('#price_keyin_bol_info_table tr.content').remove();
		var postUrl = $('#WEB_ROOT').val() + 'purchasePrice/getPurchaseInventoryList';
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
	    	  total_quanitity = 0;
		      total_case_num = 0;
		      $('.price_keyin_history_inventory_unit_price_td').html(data.history_inventory_unit_price);
		      $('#price_keyin_bol_info_table tr.content').remove();
		      data.inventory_list.forEach(function(e, index){
		    	  if(index == 0){
		    		  return true;
	    		  }
		    	 var lineIndex = $("#price_keyin_bol_info_table tr.content").size();
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
		 		 td.html(getValueByUnitCode(product_type, product_unit_code, e.unit_quantity));
//		 		 if(product_unit_code == 'kg' && product_type == 'goods'){
//			 		td.html(e.unit_quantity * 2);
//		 		 } else {
//		 			td.html(e.unit_quantity);
//		 		 }
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(e.created_user);
		 		 tr.append(td);
		 		 var td = $("<td>");
		 		 td.html(e.created_time);
		 		 tr.append(td);
		 		$("#price_keyin_bol_info_table tr").eq(lineIndex).after(tr);
		 		total_case_num += parseFloat(e.quantity);
		 		total_quanitity += e.quantity * e.unit_quantity;
		      });
		      
		      if(data.inventory_list.length > 0) {
		    	  	total_case_num += parseFloat(data.inventory_list[0].quantity);
			 		total_quanitity += data.inventory_list[0].quantity * data.inventory_list[0].unit_quantity;
			    	 var lineIndex = $("#price_keyin_bol_info_table tr.content").size();
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
			 		 td.html(getValueByUnitCode(product_type, product_unit_code, data.inventory_list[0].unit_quantity));
//			 		 if(product_unit_code == '斤'){
//			 			td.html(data.inventory_list[0].unit_quantity * 2);
//			 		 } else {
//			 			td.html(data.inventory_list[0].unit_quantity);
//			 		 }
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
			 		 td.html(getValueByUnitCode(product_type, product_unit_code, total_quanitity));
			 		 $("#price_keyin_inventory_qoh").val(getValueByUnitCode(product_type, product_unit_code, total_quanitity));
//			 		 if(product_unit_code == '斤'){
//			 		 	td.html(total_quanitity * 2);
//			 		 	$("#price_keyin_inventory_qoh").val(total_quanitity * 2);
//			 		 } else {
//			 			td.html(total_quanitity);
//			 			$("#price_keyin_inventory_qoh").val(total_quanitity);
//			 		 }
			 		 tr.append(td);
			 		 $("#price_keyin_bol_info_table tr").eq(0).after(tr);
				  }

		      virtual_total_quanitity = 0;
		      virtual_total_case_num = 0;
		      
		      $('#price_keyin_virtual_bol_info_table tr.content').remove();
		      data.virtual_inventory_list.forEach(function(e,index){
			      	if(index == 0) {
				      	return true;
			      	}
			    	 var lineIndex = $("#price_keyin_virtual_bol_info_table tr.content").size();
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
			 		$("#price_keyin_virtual_bol_info_table tr").eq(lineIndex).after(tr);
			 		virtual_total_case_num += parseFloat(e.quantity);
			 		virtual_total_quanitity += e.quantity * e.unit_quantity;
			  });
		      if(data.virtual_inventory_list.length > 0) {
		    	     virtual_total_case_num += parseFloat(data.virtual_inventory_list[0].quantity);
		    	  	 virtual_total_quanitity += data.virtual_inventory_list[0].quantity * data.virtual_inventory_list[0].unit_quantity;
			    	 var lineIndex = $("#price_keyin_virtual_bol_info_table tr.content").size();
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
			 		 $("#price_keyin_virtual_bol_info_table tr").eq(0).after(tr);
				  }
	      }else{
	          alert(data.error_info);
	       }
	    }).fail(function(data){
		    alert('内部服务器错误');
	    });
		$('#price_keyin_modal').modal('show').on();
		add_price_keyin_table_item('',price_keyin_product_supplier_name,arrival_case_num,'',quantity,'','','','','',price_keyin_product_supplier_id)
	});


function add_price_keyin_table_item(purchase_user,product_supplier_name,case_num,replenish_case_num,
		container_quantity,kg_num,replenish_kg_num,total_price,other_price,is_paid,product_supplier_id){
	 purchase_unit = $('#price_keyin_purchase_unit').val();
	 if(purchase_unit == 'jin'){
		 case_hidden = true;
		 kg_hidden = false;
	 } else {
		 case_hidden = false;
		 kg_hidden = true;
	 }

	 var lineIndex = $("#price_keyin_table tr.price_keyin_list").size();
	 var tr = $("<tr>");
	 tr.addClass('price_keyin_list');
	 add_td(tr,'price_keyin_purchase_user_td',purchase_user,$('#price_keyin_purchase_user_title').width(),false,'text');
	 add_td(tr,'price_keyin_product_supplier_name_td',product_supplier_name,$('#price_keyin_product_supplier_name_title').width(),false,'text');
	 add_td(tr,'price_keyin_case_num_td',case_num,$('#price_keyin_case_num_title').width(),case_hidden,'number');
	 add_td(tr,'price_keyin_replenish_case_num_td',replenish_case_num,$('#price_keyin_replenish_case_num_title').width(),case_hidden,'number');
	 add_td(tr,'price_keyin_container_quantity_td',container_quantity,$('#price_keyin_container_quantity_title').width(),case_hidden,'number');
	 add_td(tr,'price_keyin_kg_num_td',kg_num,$('#price_keyin_kg_num_title').width(),kg_hidden,'number');
	 add_td(tr,'price_keyin_replenish_kg_num_td',replenish_kg_num,$('#price_keyin_replenish_kg_num_title').width(),kg_hidden,'number');
	 add_td(tr,'price_keyin_total_price_td',total_price,$('#price_keyin_total_price_title').width(),false,'number');
	 add_td(tr,'price_keyin_other_price_td',other_price,$('#price_keyin_other_price_title').width(),false,'number');
	 td = $("<td>");
	 td.addClass("price_keyin_unit_price_td");
	 td.html("");
	 td.css('text-align','center');
	 tr.append(td);
	 
	 td = $("<td>");
	 td.addClass("price_keyin_history_inventory_unit_price_td");
	 td.html("无记录");
	 td.css('text-align','center');
	 tr.append(td);

	 paid_checkbox = $("<input>");
	 paid_checkbox.attr("type","checkbox");
	 paid_checkbox.attr('value','1');
	 paid_checkbox.width($('#price_keyin_is_paid_title').width());
	 paid_checkbox.css('border','0px');
	 td = $("<td>");
	 td.addClass("price_keyin_is_paid_td");
	 td.append(paid_checkbox);
	 td.css('text-align','center');
	 tr.append(td);
	 
	 td = $("<td>");
	 td.addClass("price_keyin_product_supplier_id_td");
	 td.html(product_supplier_id);
	 td.css('text-align','center');
	 td.attr('hidden','hidden');
	 tr.append(td);

	 td = $("<td>");
	 td.addClass("price_keyin_purchase_user_id_td");
	 td.css('text-align','center');
	 td.attr('hidden','hidden');
	 tr.append(td);
	 
	 delbtn = $("<input>");
		 delbtn.val('删');
		 delbtn.attr("type","button");
		 delbtn.addClass("btn-danger");
		 delbtn.addClass("price_keyin_modal_deltr");
		 delbtn.width($('#price_keyin_operator_title').width());
		 delbtn.css('border','0px');
		 delbtn.click(deltr);
		 td = $("<td>");
	 td.append(delbtn);
	 tr.append(td);
	 $("#price_keyin_table tr").eq(lineIndex).after(tr);
}

function calc_price_keyin_unit_price(){
    unit_code = $('#price_keyin_purchase_unit').val();
    
    case_num = $(this).parent().parent().find('td.price_keyin_case_num_td').find('input').val();
    replenish_case_num = $(this).parent().parent().find('td.price_keyin_replenish_case_num_td').find('input').val();
    kg_num = $(this).parent().parent().find('td.price_keyin_kg_num_td').find('input').val();
    replenish_kg_num = $(this).parent().parent().find('td.price_keyin_replenish_kg_num_td').find('input').val();
    total_price = $(this).parent().parent().find('td.price_keyin_total_price_td').find('input').val();
    if(unit_code == 'jin') {
        unit_price = total_price/(parseFloat((replenish_kg_num==''?0:replenish_kg_num)) + parseFloat((kg_num=='')?0:kg_num));
    } else {
        unit_price = total_price/(parseFloat((case_num==''?0:case_num)) + parseFloat((replenish_case_num=='')?0:replenish_case_num));
    }
    unit_price = unit_price.toFixed(2);
    $(this).parent().parent().find('td.price_keyin_unit_price_td').html(unit_price);
} 

$('#price_keyin_sub').click(function(){
	var price_items = new Array();
	var asn_item_id = $('#price_keyin_asn_item_id').val();
	var product_id = $('#price_keyin_product_id').val();
	var purchase_unit = $('#price_keyin_purchase_unit').val();
	var facility_id = $('#facility_id').val();

	var available = true;
	var total_num = 0;
	$("#price_keyin_table tr.price_keyin_list").each(function(){
		product_supplier_name = $.trim($(this).find("td.price_keyin_product_supplier_name_td").find('input').val());
		product_supplier_id = $(this).find("td.price_keyin_product_supplier_id_td").html();
		purchase_user_id = $(this).find("td.price_keyin_purchase_user_id_td").html();
		purchase_user = $.trim($(this).find("td.price_keyin_purchase_user_td").find('input').val());
		purchase_place = $.trim($(this).find("td.price_keyin_purchase_place_td").find('input').val());
		case_num = $.trim($(this).find("td.price_keyin_case_num_td").find('input').val());
		replenish_case_num = $.trim($(this).find("td.price_keyin_replenish_case_num_td").find('input').val());
		container_quantity = $.trim($(this).find("td.price_keyin_container_quantity_td").find('input').val());
		kg_num = $.trim($(this).find("td.price_keyin_kg_num_td").find('input').val());
		replenish_kg_num = $.trim($(this).find("td.price_keyin_replenish_kg_num_td").find('input').val());
		unit_price = $.trim($(this).find("td.price_keyin_unit_price_td").find('input').val());
		total_price = $.trim($(this).find("td.price_keyin_total_price_td").find('input').val());
		other_price = $.trim($(this).find("td.price_keyin_other_price_td").find('input').val());
		is_paid = $(this).find("td.price_keyin_is_paid_td").find('input').prop('checked');
		
		inventory_qoh = $("#price_keyin_inventory_qoh").val();
		history_inventory_unit_price = $.trim($(this).find("td.price_keyin_history_inventory_unit_price_td").html());
		
		if(purchase_unit == 'jin'){
			purchase_unit_price =
								(parseFloat((total_price != '')?total_price:0) + parseFloat((other_price != '')?other_price:0))
									/
								(parseFloat(kg_num) + parseFloat((replenish_kg_num != '')?replenish_kg_num:0));
			if (inventory_qoh != '') {
				inventory_unit_price = 
								(parseFloat((total_price != '')?total_price:0) + parseFloat((other_price != '')?other_price:0))
									/
								(parseFloat(inventory_qoh));
			} else {
				inventory_unit_price = 0; 
			}
		} else {
			purchase_unit_price =
								(parseFloat((total_price != '')?total_price:0) + parseFloat((other_price != '')?other_price:0))
									/
								((parseFloat(case_num) + parseFloat((replenish_case_num != '')?replenish_case_num:0)) * parseFloat(container_quantity));
			if (inventory_qoh != '') {
				inventory_unit_price = 
								(parseFloat((total_price != '')?total_price:0) + parseFloat((other_price != '')?other_price:0))
									/
								(parseFloat(inventory_qoh));
			} else {
				inventory_unit_price = 0; 
			}
		}
		confirm_message = "单价计算结果：\n" +
						"       本次录入采购单价:" + purchase_unit_price.toFixed(2) + "\n" + 
						"       本次实体仓入库单价:" + inventory_unit_price.toFixed(2) + "\n" +
						"       最近几次实体仓单价:" + history_inventory_unit_price ;
		if (! confirm(confirm_message)) {
			available = false;
			return false;
		}
		
		if(purchase_unit == 'jin'){
			a_purchase_unit = 'kg';
			total_num += (parseFloat(kg_num) + parseFloat((replenish_kg_num != '')?replenish_kg_num:0));
			kg_num = parseFloat(kg_num)/2;
			replenish_kg_num = parseFloat(replenish_kg_num)/2;
		} else {
			a_purchase_unit = purchase_unit;
			total_num += (parseFloat(case_num) + parseFloat((replenish_case_num != '')?replenish_case_num:0)) * parseFloat(container_quantity);
		} 

		if(purchase_user == '' || purchase_user_id == ''){
			available = false;
			alert('采购员不能为空');
			return false;
		}
		
		var price_item = {
				"asn_item_id":asn_item_id,
				"product_id":product_id,
	   			"product_supplier_name":product_supplier_name,
	   			"product_supplier_id":product_supplier_id,
	   			"purchase_user":purchase_user,
			   	"case_num":case_num,
			   	"replenish_case_num":replenish_case_num,
			   	"container_quantity":container_quantity,
			   	"kg_num":kg_num,
			   	"replenish_kg_num":replenish_kg_num,
			   	"total_price":total_price,
			   	"other_price":other_price,
			   	"is_paid":is_paid?'PAID':'UNPAID',
				"purchase_unit":a_purchase_unit,
				"purchase_user_id":purchase_user_id,
				"facility_id":facility_id
			};
		price_items.push(price_item);
	});

	if(available == false ){
		return false;
	}
	price_keyin_arrival_case_num = parseFloat($('#price_keyin_arrival_case_num').val());
	var tips = '是否确认?';
	if((total_num - parseFloat($('#price_keyin_arrival_case_num').val()) * parseFloat($('#price_keyin_container_quantity').val())) > 0.000001
			&& (total_num - parseFloat($('#price_keyin_setoff_case_num').val()) * parseFloat($('#price_keyin_container_quantity').val())) > 0.000001){
		tips = '数量与入库数量不匹配，' + tips;
		alert('数量与入库数量或装车数量都不匹配');
		return false;
	}

	var submit_data = {
			"asn_item_id": asn_item_id,
			"product_type": product_type,
			"price_items": price_items
		};
	var cf=confirm(tips);
	if (cf==false)
		return false;
	$('#price_keyin_sub').attr('disabled',"true");
	var postUrl = $('#WEB_ROOT').val() + 'purchasePrice/addPurchasePrice';
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
		  $('#price_keyin_modal').modal('hide');
		  cur_add_tr.find('.price_detail_td').removeAttr('hidden');
		  cur_add_tr.find('.price_keyin_td').attr('hidden','hidden');
		  $('#price_keyin_sub').removeAttr('disabled');
		  unit_price_text = '';
		  submit_data.price_items.forEach(function(data){
			  if(data.purchase_unit == 'kg' && product_type == 'goods') {
				  unit_price_text += "总价:" + data.total_price + "<br>";
			  } else {
				  unit_price_text += "箱规:" + data.container_quantity + "|总价:" + data.total_price + "<br>";
			  }
		  });
		  cur_add_tr.find('.unit_price_td').html(unit_price_text);
      }else{
    	  $('#price_keyin_sub').removeAttr('disabled');
          alert(data.error_info);
       }
    }).fail(function(data){
    	 $('#price_keyin_sub').removeAttr('disabled');
    	 alert('提交失败');
    });
});