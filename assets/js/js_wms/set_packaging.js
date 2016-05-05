/**
 * 
 */

$('#setPackagingBtn').click(function(){
	$('#packaging_modal').modal('show');
});

$('#packaging_sub').click(function(){
	btn = $(this);
	btn.attr('disabled','disabled');
	var packagings = [];
	$('#packaging_modal_table tbody input.modal_packaging').each(function(index, item) {
		var packaging = {
			'facility_id':$(item).attr('data-fid'),
			'shipping_id':$(item).attr('data-sid'),
			'goods_product_id':$(item).attr('data-pid'),
			'supplies_product_id':$(item).parent().parent().find('td.supplies_product_id').html(),
			'supplies_product_name':$(item).val()
		};
		packagings.push(packaging);
	});
	
	submit_data = {'packagings': packagings};
	var postUrl =  $('#WEB_ROOT').val() + 'ProductEdit/productPackagingBatchUpdate';
	 $.ajax({
       url: postUrl,
       type: 'POST',
       data: submit_data,
       dataType: "json", 
       xhrFields: {
         withCredentials: true
       }
	  }).done(function(data){
		  if(data.res == 'success') {
			  refreshDistributeShippingTable();
			  refreshSetPackageingTable();
			  alert('更新成功');
			  btn.removeAttr('disabled');
			  $('#packaging_modal').modal('hide');
		  } else {
			  alert(data.error_info);
			  btn.removeAttr('disabled');
		  }
		}).fail(function(data){
			 alert('更新失败');
			 btn.removeAttr('disabled');
		});
})

function refreshPackagingModal( ) {
	$('#packaging_modal_table tbody').empty();
	$('#packaging_modal_table tbody').html(loadding);
	var param = {'product_id': $('#product_id').val()};
	$.ajax({
		url: WEB_ROOT + 'skuShipping/getPackagingList',
		type: 'POST',
		data: param,
		dataType: 'json',
	})
		.done(function(data) {
			$(".loadding").hide();
			drawPackagingModal(data);
		})
		.fail(function(s) {
			console.log("error" + s);
		})
		.always(function() {
			console.log("complete");
		});
}

function drawPackagingModal(data) {
    console.log( 'data1:' );
    console.log( data );
    var html = ''
    for (var x in data['packaging_list']) {
        var packageing_item = data['packaging_list'][x];
        var facility_id = packageing_item['facility_id'];
        var facility_name = packageing_item['facility_name'];
        for(var y in packageing_item['shipping_list']){
            var shipping_item = packageing_item['shipping_list'][y];
            html += '<tr>';
            html += '<td>'+shipping_item['product_name']+'</td>';
            html += '<td>'+facility_name+'</td>';
            html += '<td>'+( shipping_item["is_cod"]==1 ? "落地配" : "快递配" )+'</td>';
            html += '<td>'+shipping_item['shipping_name']+'</td>'; 
            html += '<td class="supplies_product_id">'+shipping_item['supplier_product_id']+'</td>';
            html += "<td><input type='text' class='modal_packaging' data-fid='"+ facility_id +"' data-sid='"+ shipping_item['shipping_id'] +"' data-pid='"+ shipping_item['product_id'] +"' data-tyid='"+ shipping_item['is_cod'] +"' value='" + shipping_item['supplier_product_name'] +"'></td>";
            html += '</tr>';
        }            
	}
    $('#packaging_modal_table tbody').append(html);
	$(".modal_packaging").focus(function(){
        autocom($(this)).result(function(event, row, formatted) {
            $(this).parent().parent().find('td.supplies_product_id').html(row.product_id);
            $(this).val(row.product_name);
        });
    });
	$('#packagingModalFacilitySel').empty();
	var str = '<option value="">全部</option>';
	for( var x in data['packaging_list']) {
		var facility_id = data['packaging_list'][x]['facility_id'];
		var facility_name = data['packaging_list'][x]['facility_name'];
		str += '<option value="' + facility_id + '">' + facility_name + '</option> ';
	}
	
	$('#packagingModalFacilitySel').append(str);
} 

function autocom($obj){
    $obj.autocomplete(supplies_product_list, {
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
    });
    return $obj;
}

function getSuppliesProductList(){
	var postUrl = $('#WEB_ROOT').val() + 'product/getProductList';
	 $.ajax({
        url: postUrl,
        type: 'GET',
        dataType: "json", 
		data: {"product_type":"supplies","product_sub_type":"finished"},
        xhrFields: {
          withCredentials: true
        }
	  }).done(function(data){
		  supplies_product_list = data.product_list;
		  autocom($('#packagingModalBatchInp')).result(function(event, row, formatted) {
		        $(this).val(row.product_name+ row.product_id);
		        batchSetPackaging(row.product_id, row.product_name);
		    });
	    }).fail(function(data){
	  });
}

function batchSetPackaging(product_id, product_name) {
	selFacility = $('#packagingModalFacilitySel').val();
	selShippingType= $('#packagingModalShippingTypeSel').val();
	
	$('#packaging_modal_table tbody tr').each(function(index ,item) {
		$(item).find('td input.modal_packaging').attr('data-tyid')
		if(selFacility != '' && $(item).find('td input.modal_packaging').attr('data-fid') != selFacility) 
			return true;
		
		if(selShippingType != '' && $(item).find('td input.modal_packaging').attr('data-tyid') != selShippingType) 
			return true;
		
		$(item).find('td.supplies_product_id').html(product_id);
		$(item).find('td input.modal_packaging').val(product_name);
	});
}
