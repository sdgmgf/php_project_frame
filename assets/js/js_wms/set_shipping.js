
    var $use_best_shipping = $('#use_best_shipping'),
        $general_link = $('#general_link'),
        $best_link = $('#best_link'),
        $scale_div = $('#product_shipping_modal');

    $use_best_shipping.on('change',function(){
        var use_best_shipping = $(this).val();
        switch(use_best_shipping){
            case '':
            	alert('必须选择一项');
            	return false;
            break;
            case '0': 
                $general_link.css('display','block');
                $best_link.css('display','none');
            break;
            case '1':
            	if(!validatePackagingSetting()) {
            		$('#use_best_shipping').val('0');
            		alert('必须设置所有包装方案，才能选择最优快递')
            		return false;
        		}	
                $general_link.css('display','none');
                $best_link.css('display','block');
            break;
        }
        
        submit_data = {
        		"product_id": $('#product_id').val(),
        		"use_best_shipping": use_best_shipping,
        };
        setProductShipping(submit_data);
    });
    
function validatePackagingSetting() {
	var result = true;
	$('#set_packaging_table tbody tr').each(function(index, item){
		if($(item).find('td.setted_packaging').html()== '' ) {
			result = false;
			return false;
		}
	})
	return result;
}
    
    function setProductShipping(submit_data) {
       	var postUrl = $("#WEB_ROOT").val() + 'productEdit/setProductShipping';
       	$.ajax({
       		url: postUrl,
       		type: 'POST',
       		data: submit_data,
       		dataType: "json",
       		xhrFields: {
       			withCredentials: true
       		}
       	}).done(function(data) {
       		if (data.success != "success") {
       			alert("是否使用最优快递错误" );
       		}
       	}).fail(function(data) {
       		alert('是否使用最优快递错误');
       	});
    }
 
    $('.facility_item').on('change','input[name="facilitys[]"]',function(){
        var $this = $(this);
        if(!$this.prop('checked')){
            $this.parent('.facility_label').siblings('.shipping_item').find('input[name=shippings]').removeAttr('checked');
        }
        //alert($this.closest('.facility_item').data('merchant_id'));
    });

    $('#merchant_id').on('change',function(){
        var merchant_id = $(this).val(),
            $facility_item = $('.facility_item');
        if(merchant_id===''){
            $facility_item.addClass('hidden');
            $facility_item.find('input[type=checkbox]').removeAttr('name');
        }else{
            $facility_item.each(function(){
                if( merchant_id == $(this).data('merchant_id') ){
                    $(this).find('.facility_label input[type=checkbox]').attr('name','facilitys[]');
                    $(this).find('.shipping_label input[type=checkbox]').attr('name','shippings');
                    $(this).removeClass('hidden');
                }else{
                    $(this).find('input[type=checkbox]').removeAttr('name');
                    $(this).addClass('hidden');
                }
            });
        }
    })

    $('#product_shipping_modal').on('input propertychange','input[type=number]',function(ev){
        var $this = $(this),
            $quality = $("#quality"),
            $price = $("#price"),
            $unreachable = $("#unreachable"),
            $aftersale_rate = $("#aftersale_rate"),
            $timeliness = $("#timeliness"),
            value_unreachable = $unreachable.val(),
            value_aftersale_rate = $aftersale_rate.val(),
            value_timeliness = $timeliness.val();

        if(ev.target === $quality[0]){
            var value = $quality.val();
            if( value<0 || value>1 ){
                alert('质量权重为0-1之间的数字');
                $quality.val( $this.data('nub') );
                return;
            }
            $this.data('nub',value);
            $price.data('nub',sub(1,value));
            $price.val( sub(1,value) );
        } 

        if(ev.target === $price[0]){
            var value = $price.val();
            if( value<0 || value>1 ){
                alert('价格权重为0-1之间的数字');
                $price.val( $this.data('nub') );
                return;
            }
            $this.data('nub',value);
            $quality.data('nub',sub(1,value));
            $quality.val( sub(1,value));
        }  

        if(ev.target === $unreachable[0]){
            var value = $unreachable.val();
            if( value<0 || value>1 ){
                alert('可达性权重为0-1之间的数字');
                $unreachable.val( $this.data('nub') );
                return;
            } 

            $this.data('nub',value);           
        } 

        if(ev.target === $aftersale_rate[0]){
            var value = $aftersale_rate.val();
            if( value<0 || value>1 ){
                alert('售后率权重为0-1之间的数字');
                $aftersale_rate.val( $this.data('nub') );
                return;
            }
            $this.data('nub',value);
            $timeliness.val( sub(sub(1,value),value_unreachable));
        }

        if(ev.target === $timeliness[0]){
            var value = $timeliness.val();
            if( value<0 || value>1 ){
                alert('时效性权重为0-1之间的数字');
                $timeliness.val( $this.data('nub') );
                return;
            }            
            $this.data('nub',value);
        } 
        ev.preventDefault();

    });
    
    function validDataBestShipping(){
        var $quality = $scale_div.find('input[name=quality]'),
            $price = $scale_div.find('input[name=price]'),
            $unreachable = $scale_div.find('input[name=unreachable]'),
            $aftersale_rate = $scale_div.find('input[name=aftersale_rate]'),
            $timeliness = $scale_div.find('input[name=timeliness]');

        if( $quality.val() === '' ){
            alert('质量权重不能为空,且必须为0-1数字');
            $quality.focus();
            return false;
        }else if( $price.val() === '' ){
            alert('价格权重不能为空，且必须为0-1数字');
            $price.focus();
            return false;
        }else if( (+$quality.val())+(+$price.val()) != 1 ){
            alert('质量权重和价格权重加起来必须为1');
            $quality.focus();
            return false;
        }

        if( $unreachable.val() === '' || $unreachable.val()<0 || $unreachable.val()>1 ){
            alert('可达性权重不能为空,且必须为0-1数字');
            $unreachable.focus();
            return false;
        }else if( $aftersale_rate.val() === '' ||  $aftersale_rate.val()<0 || $aftersale_rate.val()>1 ){
            alert('售后率权重不能为空，且必须为0-1数字');
            $aftersale_rate.focus();
            return false;
        }else if( $timeliness.val() === '' || $timeliness.val()<0 || $timeliness.val()>1 ){
            alert('时效性权重不能为空，且必须为0-1数字');
            $timeliness.focus();
            return false;
        }else if( (+$unreachable.val())+(+$aftersale_rate.val())+(+$timeliness.val()) != 1 ){
            alert('可达性权重和售后率权重和时效性加起来必须为1');
            $unreachable.focus();
            return false;
        }
        return true;
    }
    
    $('#setProductFacilityShippingMapppingBtn').on('click',function(){
    	refreshFacilityShippingSettingTable();
   	 	$("#facility_shipping_modal").modal("show");
   });
   var prompter = $.prompter('正在提交，请稍后。。。');
   $('#facility_shipping_sub').on('click', function(){
   	var btn = $(this);
   	btn.attr("disabled","disabled");
   	var mappings = [];
   	$('#facility_shipping_setting_table input[type=checkbox]:checked').each(function(index, shippings){
   		mapping = {
   				'product_id': $('#product_id').val(),
   				'facility_id': $(shippings).attr('data-facility_id'),
   				'shipping_id': $(shippings).val(),
   				'is_cod': $(shippings).attr('data-is_cod'),
   				'shipping_name': $(shippings).attr('data-shipping_name'),
   		};
   		mappings.push(mapping);
   	});
   	submit_data = {
   			'mappings': mappings,
   			'product_id': $('#product_id').val(),
   	};
   	prompter.show();
   	var postUrl = $("#WEB_ROOT").val() + 'productEdit/setProductFacilityShippingMapping';
   	$.ajax({
   		url: postUrl,
   		type: 'POST',
   		data: submit_data,
   		dataType: "json",
   		xhrFields: {
   			withCredentials: true
   		}
   	}).done(function(data) {
   		console.log(data);
   		if (data.success == "success") {
   			refreshDistributeShippingTable();
   			refreshSetPackageingTable();
   			refreshDistributeFacilityTable();
   			refreshFacilityShippingTable();
   			refreshPackagingModal();
   			$("#facility_shipping_modal").modal("hide");
   			$("#facility_shipping_info_table .chosed_shippings").html('');
   			mappings.forEach(function(mapping, index) {
   				label = $('<label>');
   				label.html(mapping.shipping_name);
   				$("#facility_shipping_info_table td[data-facility="+mapping.facility_id+"][data-is_cod="+ mapping.is_cod+"]").append(label);
   			});
   		} else {
   			alert("错误!\n" + data.error_info);
   		}
   		btn.attr("disabled",false);
   		prompter.hide();
   	}).fail(function(data) {
   		console.log(data);
   		btn.attr("disabled",false);
   		prompter.hide();
   	});
   });

   $('#product_shipping_btn').on('click',function(){
   	$('#product_shipping_modal').modal('show');
   });

//设置权重
$('#product_shipping_sub').on('click', function() {
   	var btn = $(this);
   	
   	var mappings = [];
   	if(!validDataBestShipping()){
   		return false;
   	}
   	btn.attr("disabled","disabled");
   	submit_data = {
   			'product_id': $('#product_id').val(),
   			'use_best_shipping': $('#use_best_shipping').val(), 
   			'quality': $('#quality').val(),
   			'price': $('#price').val(),
   			'unreachable': $('#unreachable').val(),
   			'aftersale_rate': $('#aftersale_rate').val(),
   			'timeliness': $('#timeliness').val(),
   	};
   	
   	var postUrl = $("#WEB_ROOT").val() + 'productEdit/setProductShipping';
   	$.ajax({
   		url: postUrl,
   		type: 'POST',
   		data: submit_data,
   		dataType: "json",
   		xhrFields: {
   			withCredentials: true
   		}
   	}).done(function(data) {
   		console.log(data);
   		if (data.success == "success") {
   			$(".quality").html('质量权重：'+ submit_data.quality + ";");
   			$(".price").html('价格权重：'+ submit_data.price);
   			$(".unreachable").html('可达性权重：'+ submit_data.unreachable + ";");
   			$(".aftersale_rate").html('售后率权重：'+ submit_data.aftersale_rate + ";");
   			$(".timeliness").html('时效性权重：'+ submit_data.timeliness);
   			alert('设置成功');
   			$('#product_shipping_modal').modal('hide');
   		} else {
   			alert("错误。" + data.error_info);
   		}
   		btn.attr("disabled",false);
   	}).fail(function(data) {
   		console.log(data);
   		btn.attr("disabled",false);
   	});
   })

function refreshFacilityShippingSettingTable() {
	var param = {
		"product_id": $('#product_id').val(),
	};

	$.ajax({
		url: WEB_ROOT + 'productEdit/getFacilityShippingListByProduct',
		type: 'POST',
		data: param,
		dataType: 'json',
	})
	.done(function(data) {
		$(".loadding").hide();
		drawFacilityShippingSettingTable(data['list']);
	})
	.fail(function(s) {
		console.log("error" + s);
	})
	.always(function() {
		console.log("complete");
	});
}
   
function refreshFacilityShippingTable(){
	$('#facility_shipping_table tbody').empty();
	$('#facility_shipping_table tbody').html(loadding);
	
	var param = {
		"product_id": $('#product_id').val(),
	};

	$.ajax({
		url: WEB_ROOT + 'productEdit/getFacilityShippingListByProduct',
		type: 'POST',
		data: param,
		dataType: 'json',
	})
	.done(function(data) {
		$(".loadding").hide();
		drawFacilityShippingTable(data['checked_list']);
//		drawFacilityShippingSettingTable(data['list']);
	})
	.fail(function(s) {
		console.log("error" + s);
	})
	.always(function() {
		console.log("complete");
	});
}

function drawFacilityShippingSettingTable(facility_shipping_list){
	var tbody=$("#facility_shipping_setting_table tbody");
	tbody.empty();
	for(var i in facility_shipping_list){
	    var facility_shipping=facility_shipping_list[i];
	    var tr1=$("<tr>");
	    var td11=$("<td>");
	    var td12=$("<td>");
	    var td13=$("<td>");

	    td11.attr('rowspan',2);
	    td11.html(facility_shipping['facility_name']);
	    td12.html('落地配');
	    for(var j in facility_shipping['cod_shipping_info_list']){
	        var shipping=facility_shipping['cod_shipping_info_list'][j];
	        var label=$("<label>");
	        var input=$("<input>");
	        input.attr('type','checkbox');
	        input.attr('class','shippings');
	        input.attr('data-is_cod',1);
	        input.attr('data-facility_id',facility_shipping['facility_id']);
	        input.attr('data-shipping_name',shipping['shipping_name']);
	        input.attr('value',shipping['shipping_id']);
	        if(shipping['checked']==1) input.prop('checked',true);
	        label.append(input);
	        label.append(shipping['shipping_name']);
	        td13.append(label);
	    }
	    tr1.append(td11);
	    tr1.append(td12);
	    tr1.append(td13);


	    var tr2=$("<tr>");
	    var td21=$("<td>");
	    var td22=$("<td>");
	    td21.html('快递配');
	    for(var j in facility_shipping['not_cod_shipping_info_list']){
	        var shipping=facility_shipping['not_cod_shipping_info_list'][j];
	        var label=$("<label>");
	        var input=$("<input>");
	        input.attr('type','checkbox');
	        input.attr('class','shippings');
	        input.attr('data-is_cod',0);
	        input.attr('data-facility_id',facility_shipping['facility_id']);
	        input.attr('data-shipping_name',shipping['shipping_name']);
	        input.attr('value',shipping['shipping_id']);
	        if(shipping['checked']==1) input.prop('checked',true);
	        label.append(input);
	        label.append(shipping['shipping_name']);
	        td22.append(label);
	    }
	    tr2.append(td21);
	    tr2.append(td22);

	    tbody.append(tr1);
	    tbody.append(tr2);
	}
}
function drawFacilityShippingTable(data){
	for (var x in data) {
		var facility_id = data[x]['facility_id'];
		var facility_name = data[x]['facility_name'];
		var html = '<tr>';
		html += "<td rowspan='2'>" + facility_name + "</td>";
		html += "<td>落地配</td>";
		html += "<td>";
		for( var y in data[x]['cod_shipping_info_list']) {
			html += "<label>" +  data[x]['cod_shipping_info_list'][y]['shipping_name'] + "</label>" ;
		}
		html += "</td>";
		html += '</tr>';
		html += '<tr>';
		html += "<td>快递配</td>";
		html += "<td>";
		for( var y in data[x]['not_cod_shipping_info_list']) {
			html += "<label>" +  data[x]['not_cod_shipping_info_list'][y]['shipping_name'] + "</label>" ;
		}
		html += "</td>";
		html += "</tr>";
		
		$('#facility_shipping_table tbody').append(html);
	}
}


function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}
 
function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}
 
function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
 
function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}
