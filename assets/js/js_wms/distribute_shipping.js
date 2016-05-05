/**
 * 设置分快递规则
 */
function refreshDistributeShippingTable() {
	$('#distribute_shipping_table tbody').empty();
	$('#distribute_shipping_table tbody').html(loadding);
	
	var param = {
		"product_id": $('#product_id').val(),
	};

	$.ajax({
		url: WEB_ROOT + 'productEdit/getSkuRegionShippingList',
		type: 'POST',
		data: param,
		dataType: 'json',
	})
		.done(function(data) {
			$(".loadding").hide();
			drawDistributeShippingTable(data);			
		})
		.fail(function(s) {
			console.log("error" + s);
		})
		.always(function() {
			console.log("complete");
		});
}

function refreshSetPackageingTable(){
	$('#set_packaging_table tbody').empty();
	$('#set_packaging_table tbody').html(loadding);
	var param = {
		"product_id": $('#product_id').val(),
	};

	$.ajax({
		url: WEB_ROOT + 'skuShipping/getPackagingList',
		type: 'POST',
		data: param,
		dataType: 'json',
	}).done(function(data) {
		$(".loadding").hide();
		drawPackagingTable(data);	
	}).fail(function(s) {
		console.log("error" + s);
	}).always(function() {
		console.log("complete");
	});
}

function drawPackagingTable(data) {
	console.log('data:');
	console.log(data);
	var str = ''
	for (var x in data['packaging_list']) {
		var facility_id = data['packaging_list'][x]['facility_id'];
		var facility_name = data['packaging_list'][x]['facility_name'];
		var iNow = 0;
		var shipping_list = data['packaging_list'][x]['shipping_list'];
		var count = Object.keys(shipping_list).length;
		for (var y in shipping_list) {
			var html = '<tr>';
			if( iNow == 0 ){
				html += "<td rowspan=" + count + ">" + data['packaging_list'][x]['facility_name'] + "</td>";
			}
			var shippings = shipping_list[y];
			var ship_name = shippings['shipping_name'];
			if (shippings['supplier_product_id'] != "0") {
				var ship_product = shippings['supplier_product_name'];
			} else {
				var ship_product = '';
			}
			
			html += "<td >" + ship_name + "</td>";
			html += "<td class='setted_packaging'>" + ship_product + "</td>";	
			html += "</tr>";
			str += html;
			iNow++;
		}
	}
	$('#set_packaging_table tbody').append(str);
}

function drawDistributeShippingTable(data) {
	for (var x in data['list']) {
		var facility_id = data['list'][x]['facility_id'];
		var facility_name = data['list'][x]['facility_name'];
		for (var y in data['list'][x]['products']) {
			var html = '<tr>';
			var count = data['list'][x]['products'][y]['length'];
			html += "<td rowspan=" + count + ">" + data['list'][x]['facility_name'] + "</td>";
			html += "<td rowspan=" + count + ">" + data['list'][x]['products'][y]['product_name'] + "</td>";
			var p_first = 1; //判断头
			var s_first = 1; //判断尾
			for (var z in data['list'][x]['products'][y]['shippings']) {
				var shippings = data['list'][x]['products'][y]['shippings'][z];
				var ship_name = shippings['shipping_name'];
				if (shippings['supplies_product_id'] != "0") {
					var ship_product = shippings['supplies_product_name'];
				} else {
					var ship_product = '';
				}
				
				var s_first = 1; //判断尾
				if (shippings['provinces'].length == 0) { //判断省
					html += "<td></td><td></td>";
					if (s_first == 1) {
						html += "<td rowspan=" + shippings['length'] + ">" + ship_name + "</td>";
						html += "<td rowspan=" + shippings['length'] + ">" + ship_product + "</td>";
						if (shippings['supplies_product_id'] != "0") {
							html += "<td rowspan=" + shippings['length'] + ">" + "<button type='button' class='btn btn-primary btn-sm detail'  data-target='#myModal' data-sid=" + shippings['shipping_id'] + " data-pid=" + data['list'][x]['products'][y]['product_id'] + " data-fid=" + facility_id + " data-sname=" + shippings['shipping_name'] + " data-pname=" + data['list'][x]['products'][y]['product_name'] + " data-fname=" + facility_name + " >详情 </button>" + "</td>";
						} else {
							html += "<td rowspan=" + shippings['length'] + "></td>";
						}
						s_first = 0;
					}

					html += "</tr>";
				} else {
					for (var w in shippings['provinces']) {
						var city = ''; //市
						if (p_first != 1) { //判断不是第一个，则加上<tr>
							html += "<tr>";
						}
						html += "<td>" + shippings['provinces'][w]['province_name'] + "</td>";
						p_first = 0;
						for (var q in shippings['provinces'][w]['citys']) {
							city += shippings['provinces'][w]['citys'][q]['city_name'] + ' ';
						}
						html += "<td>" + city + "</td>";
						if (s_first == 1) {
							html += "<td rowspan=" + shippings['length'] + ">" + ship_name + "</td>";
							html += "<td rowspan=" + shippings['length'] + ">" + ship_product + "</td>";
							if (shippings['supplies_product_id'] != "0") {
								html += "<td rowspan=" + shippings['length'] + ">" + "<button type='button' class='btn btn-primary btn-sm detail'  data-target='#myModal' data-sid=" + shippings['shipping_id'] + " data-pid=" + data['list'][x]['products'][y]['product_id'] + " data-fid=" + facility_id + " data-sname=" + shippings['shipping_name'] + " data-pname=" + data['list'][x]['products'][y]['product_name'] + " data-fname=" + facility_name + " >详情 </button>" + "</td>";
							} else {
								html += "<td rowspan=" + shippings['length'] + "></td>";
							}
							s_first = 0;
						}

						html += "</tr>";
					}
				}
			}
			$('#distribute_shipping_table tbody').append(html);
		}
	}
	
	$(".detail").each(function() {
		$(this).on('click', function() {
			var getUrl = "skuShipping/getDistributionShippingDetail";
			var title = $(this).attr("data-fname") + ' ' + $(this).attr("data-pname") + ' ' + $(this).attr("data-sname");

			onEdit($(this).attr("data-fid"), $(this).attr("data-sid"), $(this).attr("data-pid"), title, getUrl);
		});
	});
}

function onEdit(facility_id, shipping_id,product_id,title_name,getUrl) {
	$('#district_info_table tr.content').remove();
	var submit_data = {
		"facility_id": facility_id,
		"shipping_id": shipping_id,
		"product_id": product_id
	};
	$("#facility_id1").val(facility_id);
	$("#shipping_id1").val(shipping_id);
	$("#product_id1").val(product_id);
	$("#region_title").text(title_name + '覆盖区域设置');
	$("#district_info_table").empty();
	$("#district_info_table").append("<tr><th id='province_title' style='width: 10%'>省</th><th id='city_title' style='width: 10%'>市</th><th id='district_title' style='width: 80%'>区县</th></tr>");

	var postUrl = $("#WEB_ROOT").val() + getUrl;
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
		if (data.result == 'ok') {
			data = data.list;


			if (data.length == 0) {
//				$('#region_modal').modal('hide');
				alert("商品服务区域与仓库快递覆盖无交集");
				return false;
			}
			$('#region_modal').modal('show');

			for (var province_id in data) {
				var is_first = 1;
				var province_name = data[province_id].province_name;
				var tr = $("<tr>");
				var td = $("<td>");
				td.attr('rowspan', data[province_id].length);

				var label = $("<label>");
				label.css('min-width', '15.7%');
				var input = $("<input>");
				input.attr('type', 'checkbox');
				input.attr('value', province_id);
				input.attr('class', 'province');
				label.append(input);
				label.append(province_name);
				td.append(label);
				tr.append(td);
				for (var city_id in data[province_id].citys) {
					var city_name = data[province_id].citys[city_id].city_name;
					if (!is_first) {
						var tr = $("<tr>");
					}
					var td = $("<td>");
					var label = $("<label>");
					label.css('min-width', '15.7%');
					var input = $("<input>");
					input.attr('type', 'checkbox');
					input.attr('value', city_id);
					input.attr('class', 'city');
					input.attr('data-parentID', province_id);
					input.attr('data-rootID', province_id);
					label.append(input);
					label.append(city_name);
					td.append(label);
					tr.append(td);
					var td = $("<td>");
					for (var district_id in data[province_id].citys[city_id].districts) {
						var district_name = data[province_id].citys[city_id].districts[district_id].district_name;
						var is_already_set = data[province_id].citys[city_id].districts[district_id].is_already_set;
						var label = $("<label>");
						label.css('min-width', '15.7%');
						label.css('text-align', 'left');
						var input = $("<input>");
						input.attr('type', 'checkbox');
						input.attr('value', district_id);
						input.attr('class', 'district');
						input.attr('data-parentID', city_id);
						input.attr('data-rootID', province_id);
						if (is_already_set == 1) {
							input.attr('checked', 'checked');
						}
						label.append(input);
						label.append(district_name);
						td.append(label);
					}
					tr.append(td);
					$("#district_info_table").append(tr);
					is_first = 0;
				}
			}
			$("input.city").each(function() {
				var length = $(this).parents(td).next('td').find("input.district:checked").length;
				if ($(this).parents(td).next('td').find("input.district").length == length) {
					$(this).prop("checked", true);
				}
			});

			$("input.province").each(function() {
				var val = $(this).attr("value");
				var length = $(this).parents("tbody").find("input.city[data-parentID=" + val + "]:checked").length;
				if ($(this).parents("tbody").find("input.city[data-parentID=" + val + "]").length == length) {
					$(this).prop("checked", true);
				}
			});

			$("#region_modal").modal("show");
			$("input.province").each(function() {
				$(this).on('change', function() {
					if ($(this).prop("checked") == true) {
						var parentID = $(this).val();
						$("input[data-rootID=" + parentID + "]").each(function() {
							$(this).prop("checked", true);
						});
					} else {
						var parentID = $(this).val();
						$("input[data-rootID=" + parentID + "]").each(function() {
							$(this).prop("checked", false);
						});
					}
				});
			});
			$("input.city").each(function() {
				$(this).on('change', function() {
					if ($(this).prop("checked") == true) {
						var parentID = $(this).val();
						$("input[data-parentID=" + parentID + "]").each(function() {
							$(this).prop("checked", true);
						});
					} else {
						var parentID = $(this).val();
						$("input[data-parentID=" + parentID + "]").each(function() {
							$(this).prop("checked", false);
						});
					}
				});
			});

			$("input.district").on("change", function() {
				if ($(this).parents("td").find("input.district").length == $(this).parents("td").find("input.district:checked").length) {
					$("input[value=" + $(this).attr('data-parentID') + "]").prop("checked", true);
				} else {
					$("input[value=" + $(this).attr('data-parentID') + "]").prop("checked", false);
				}
			});

			$("input.city").on("change", function() {
				var dataP = $(this).attr("data-parentID");
				if ($(this).parents("tbody").find("input.city[data-parentID=" + dataP + "]").length == $(this).parents("tbody").find("input.city[data-parentID=" + dataP + "]:checked").length) {
					$("input[value=" + $(this).attr('data-parentID') + "]").prop("checked", true);
				} else {
					$("input[value=" + $(this).attr('data-parentID') + "]").prop("checked", false);
				}
			});
		} else {
			alert("错误" + data.error_info);
		}
	});
}


function onSave(btn) {
	var facility_id = $("#facility_id1").val();
	var shipping_id = $("#shipping_id1").val();
	var product_id = $("#product_id1").val();
	var districts = [];
	$("input.district").each(function() {
		if ($(this).prop("checked")) {
			if (parseInt($(this).val()) > 0) {
				districts.push($(this).val());
			}
		};
	});
	var submit_data = {
		"facility_id": facility_id,
		"shipping_id": shipping_id,
		"product_id": product_id,
		"district_ids": districts
	};
	$(btn).attr('disabled','disabled');

	var postUrl = $("#WEB_ROOT").val() + 'productEdit/setSkuRegionShipping';
	$.ajax({
		url: postUrl,
		type: 'POST',
		data: submit_data,
		dataType: "json",
		xhrFields: {
			withCredentials: true
		}
	}).done(function(data) {
		$("#package_sub").prop("disabled",false);
		console.log(data);
		if (data.result == "ok") {
			alert("保存成功。");
			$('#region_modal').modal('hide');
			$(btn).removeAttr('disabled');
			refreshDistributeShippingTable();
   			refreshDistributeFacilityTable();
   			
		} else {
			alert("保存失败。" + data.error_info);
			$(btn).removeAttr('disabled');
		}
	}).fail(function(data) {
		console.log(data);
		$(btn).removeAttr('disabled');
	});
}
