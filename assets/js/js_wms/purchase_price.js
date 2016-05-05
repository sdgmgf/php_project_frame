product_type = $('#hidden_product_type').val();;

$(document).ready(function(){
    (function(config){
        config['extendDrag'] = true; // 注意，此配置参数只能在这里使用全局配置，在调用窗口的传参数使用无效
        config['lock'] = true;
        config['fixed'] = true;
        config['okVal'] = 'Ok';
        config['format'] = 'yyyy-MM-dd';
    })($.calendar.setting);

    $("#asn_date_start").calendar({btnBar:true,
                   minDate:'2010-05-01', 
                   maxDate:'2022-05-01'});
    $("#asn_date_end").calendar({btnBar:true,
        minDate:'#asn_date_start', 
        maxDate:'2022-05-01'});
    getAreaPurchaseManagerList();
}) ;

$("#query").click(function(){
    $("form").submit();
});

function set_hidden_col(purchase_unit){
	if(purchase_unit == 'jin'){
		$('#price_keyin_case_num_title').attr('hidden','hidden');
		$('#price_keyin_replenish_case_num_title').attr('hidden','hidden');
		$('#price_keyin_container_quantity_title').attr('hidden','hidden');
		$('#price_keyin_kg_num_title').removeAttr('hidden');
		$('#price_keyin_replenish_kg_num_title').removeAttr('hidden');

		$('.price_keyin_case_num_td').attr('hidden','hidden');
		$('.price_keyin_replenish_case_num_td').attr('hidden','hidden');
		$('.price_keyin_container_quantity_td').attr('hidden','hidden');
		$('.price_keyin_kg_num_td').removeAttr('hidden');
		$('.price_keyin_replenish_kg_num_td').removeAttr('hidden');
	} else {
		$('#price_keyin_kg_num_title').attr('hidden','hidden');
		$('#price_keyin_replenish_kg_num_title').attr('hidden','hidden');
		$('#price_keyin_case_num_title').removeAttr('hidden');
		$('#price_keyin_replenish_case_num_title').removeAttr('hidden');
		$('#price_keyin_container_quantity_title').removeAttr('hidden');

		$('.price_keyin_kg_num_td').attr('hidden','hidden');
		$('.price_keyin_replenish_kg_num_td').attr('hidden','hidden');
		$('.price_keyin_case_num_td').removeAttr('hidden');
		$('.price_keyin_replenish_case_num_td').removeAttr('hidden');
		$('.price_keyin_container_quantity_td').removeAttr('hidden');
	}
}

function set_detail_hidden_col(purchase_unit) {
	if(purchase_unit == 'jin'){
		$('#price_detail_case_num_title').attr('hidden','hidden');
		$('#price_detail_replenish_case_num_title').attr('hidden','hidden');
		$('#price_detail_container_quantity_title').attr('hidden','hidden');
		$('#price_detail_kg_num_title').removeAttr('hidden');
		$('#price_detail_replenish_kg_num_title').removeAttr('hidden');
		$('.price_detail_case_num_td').attr('hidden','hidden');
		$('.price_detail_replenish_case_num_td').attr('hidden','hidden');
		$('.price_detail_container_quantity_td').attr('hidden','hidden');
		$('.price_detail_kg_num_td').removeAttr('hidden');
		$('.price_detail_replenish_kg_num_td').removeAttr('hidden');
	} else {
		$('#price_detail_kg_num_title').attr('hidden','hidden');
		$('#price_detail_replenish_kg_num_title').attr('hidden','hidden');
		$('#price_detail_case_num_title').removeAttr('hidden');
		$('#price_detail_replenish_case_num_title').removeAttr('hidden');
		$('#price_detail_container_quantity_title').removeAttr('hidden');

		$('.price_detail_kg_num_td').attr('hidden','hidden');
		$('.price_detail_replenish_kg_num_td').attr('hidden','hidden');
		$('.price_detail_case_num_td').removeAttr('hidden');
		$('.price_detail_replenish_case_num_td').removeAttr('hidden');
		$('.price_detail_container_quantity_td').removeAttr('hidden');
	}
}

//添加单元格
function add_td(tr,input_name,input_val,input_width,is_hidden, type){
	my_input = $("<input>");
	my_input.attr('type', type);
	my_input.val(input_val);
	my_input.css('border','1px');
	my_input.width(input_width);
	td = $("<td>");
	td.addClass(input_name);
	td.append(my_input);
	tr.append(td);

	if(input_name == 'price_keyin_total_price_td' || input_name == 'price_keyin_case_num_td' || input_name == 'price_keyin_replenish_case_num_td'|| input_name == 'price_keyin_kg_num_td'|| input_name == 'price_keyin_replenish_kg_num_td') {
		my_input.on('input',calc_price_keyin_unit_price);
	}

	if(is_hidden){
		td.attr('hidden','hidden');
	}
	if(input_name == 'price_detail_container_quantity_td') {
		my_input.attr('readonly','true');
	}
	if(input_name == 'price_keyin_container_quantity_td') {
		my_input.attr('readonly','true');
	}
	if(input_name == 'price_keyin_product_supplier_name_td') {
		my_input.attr('readonly','true');
	}
	if(input_name == 'price_detail_product_supplier_name_td') {
		my_input.attr('readonly','true');
	}
	if(input_name == 'price_detail_purchase_user_td') {
		my_input.autocomplete(purchase_user_list, {
		    minChars: 0,
		    width: 310,
		    max: 100,
		    matchContains: true,
		    autoFill: false,
		    formatItem: function(row, i, max) {
		        return row.real_name;
		    },
		    formatMatch: function(row, i, max) {
		        return row.real_name ;
		    },
		    formatResult: function(row) {
		    	return (row.real_name);
		    }
		}).result(function(event, row, formatted) {
			$(this).parent().parent().find('td.price_detail_purchase_user_id_td').html(row.user_id);
			$(this).val(row.real_name);
		});
	}

	if(input_name == 'price_keyin_purchase_user_td') {
		my_input.autocomplete(purchase_user_list, {
		    minChars: 0,
		    width: 310,
		    max: 100,
		    matchContains: true,
		    autoFill: false,
		    formatItem: function(row, i, max) {
		        return row.real_name;
		    },
		    formatMatch: function(row, i, max) {
		        return row.real_name ;
		    },
		    formatResult: function(row) {
		    	return (row.real_name);
		    }
		}).result(function(event, row, formatted) {
			$(this).parent().parent().find('td.price_keyin_purchase_user_id_td').html(row.user_id);
			$(this).val(row.real_name);
		});
	}
	return tr;
}

function getAreaPurchaseManagerList(){
    product_type =  $('#hidden_product_type').val();
    submit_data = {
        'product_type': product_type
     };
	var postUrl = $('#WEB_ROOT').val() + 'purchasePrice/getAreaPurchaseManagerList';
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
	      purchase_user_list = data.manager_list;
      }else{
       }
    }).fail(function(data){
    });
}

function deltr(){
	$(this).parent().parent().remove();
}

//公共方法
function add_detail_td(tr,input_name,input_val,is_hidden){
	td = $("<td>");
	td.addClass(input_name);
	td.html(input_val);
	tr.append(td);

	if(is_hidden){
		td.attr('hidden','hidden');
	}
}