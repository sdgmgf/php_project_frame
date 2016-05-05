/**
 * 设置分仓规则
 */

function refreshDistributeFacilityTable(){
	var product_id = $("#product_id").val();
	$('#distribute_facility_table tbody').empty();
	$('#distribute_facility_table tbody').html(loadding);

	var param = {
		"product_id": product_id
	};

	$.ajax({
		url: WEB_ROOT + 'skuRegionFacility/getSkuRegionFacilityListData',
		type: 'POST',
		data: param,
		dataType: 'json',
	})
		.done(function(data) {
			$(".loadding").hide();
			html = "";
			for (var x in data['list']) {
				html += "<tr>";
				var product_id = data['list'][x]['product_id'];
				var product_name = data['list'][x]['product_name'];
				var length = data['list'][x]['length'];
				html += "<td rowspan=" + length + ">" + product_id + "</td>";
				html += "<td rowspan=" + length + ">" + product_name + "</td>";
				var p_first = 1;
				for (var y in data['list'][x]['facilitys']) {
					if (p_first != 1) {
						html += "<tr>";
					}
					var facility = data['list'][x]['facilitys'];
					var length = facility[y]['length'];
					html += "<td rowspan=" + length + ">" + facility[y]['facility_name'] + "</td>";
					p_first = 0;

					var f_first = 1;
					var last = 1;
					if (facility[y]['provinces'].length == 0) {
						if (f_first != 1) {
							html += "<tr>";
						}
						html += "<td></td><td></td>";
						f_first = 0;
						html += "<td rowspan=" + length + ">" + "<button type='button' class='btn btn-primary btn-sm sdfm_detail'  data-target='#sdfm_region_modal' data-fid="+facility[y]['facility_id']+ " data-pid="+product_id+" data-pname="+product_name+" data-fname="+facility[y]['facility_name']+">操作</button>" + "</td>";
					} else {
						for (var z in facility[y]['provinces']) {
							if (f_first != 1) {
								html += "<tr>";
								console.log("a");
							}
							var province = facility[y]['provinces'][z];
							var city = '';
							html += "<td>" + province['province_name'] + "</td>";
							for (var w in province['citys']) {
								city += province['citys'][w]['city_name'] + ' ';
							}
							html += "<td>" + city + "</td>";
							f_first = 0;
							if (last == 1) {
								html += "<td rowspan=" + length + ">" + "<button type='button' class='btn btn-primary btn-sm sdfm_detail' data-toggle='modal' data-target='#sdfm_region_modal' data-fid="+facility[y]['facility_id']+ " data-pid="+product_id+" data-pname="+product_name+" data-fname="+facility[y]['facility_name']+">操作</button>" + "</td>";
								last = 0;
							}
						}
					}
				}
				html += "</tr>";
			}
			$('#distribute_facility_table tbody').append(html);
			$(".sdfm_detail").each(function() {
				$(this).on('click', function() {
					var getUrl = "skuRegionFacility/getSkuFacilityAvaiableRegion";
					var title = $(this).attr("data-pname") + ' ' + $(this).attr("data-fname");

					onSdfmEdit($(this).attr("data-fid"), $(this).attr("data-pid"), title, getUrl);
				});
			});
		})
		.fail(function(s) {
			console.log("error" + s);
		})
		.always(function() {
			console.log("complete");
		});
}

function onSdfmSave() {
	$("#sdfm_package_sub").prop("disabled",true);
	var facility_id = $("#sdfm_facility_id1").val();
	var product_id = $("#sdfm_product_id1").val();
	var citys = [];
	$("#sdfm_district_info_table input.sdfm_city").each(function() {
		if ($(this).prop("checked")) {
			if (parseInt($(this).val()) > 0) {
				citys.push($(this).val());
			}
		};
	});
	var submit_data = {
		"facility_id": facility_id,
		"product_id": product_id,
		"city_ids": citys
	};

	var postUrl = $("#WEB_ROOT").val() + 'skuRegionFacility/addSkuRegionFacility';
	$.ajax({
		url: postUrl,
		type: 'POST',
		data: submit_data,
		dataType: "json",
		xhrFields: {
			withCredentials: true
		}
	}).done(function(data) {
		$("#sdfm_package_sub").prop("disabled",false);
		console.log(data);
		if (data.success == "true") {
			alert("保存成功。");
			$('#sdfm_region_modal').modal('hide');
			refreshDistributeFacilityTable();
		} else {
			alert("保存失败。" + data.error_info);
		}
	}).fail(function(data) {
		console.log(data);
	});
}

function onSdfmEdit(facility_id, product_id, title_name, getUrl) {
	$('#sdfm_district_info_table tr.content').remove();
	var submit_data = {
		"facility_id": facility_id,
		"product_id": product_id
	};
	$("#sdfm_facility_id1").val(facility_id);
	$("#sdfm_product_id1").val(product_id);
	$("#sdfm_region_title").text(title_name + '覆盖区域设置');
	$("#sdfm_district_info_table").empty();
	$("#sdfm_district_info_table").append("<tr><th id='sdfm_province_title' style='width: 30%'>省</th><th id='sdfm_city_title' style='width: 70%'>市</th></tr>");

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
		var html = '';
		if(data.list.length == 0){
			$('#sdfm_region_modal').modal('hide');
			alert("请先设置分快递规则！");
			return false;
		}
		$('#sdfm_region_modal').modal('show');
		for(var x in data.list){
			var province = data.list[x];
			html += "<tr>";
			html += "<td><label><input type='checkbox' class='sdfm_province' value="+province['province_id']+">"+province['province_name']+"</label></td>";
			html += "<td>";
			for(var y in province['citys']) {
				var city = province['citys'][y];
				if(city['is_already_set'] == 0){
					html += "<label><input type='checkbox' class='sdfm_city' value="+city['city_id']+">"+city['city_name']+"</label>";
				} else {
					html += "<label><input type='checkbox' class='sdfm_city' checked value="+city['city_id']+">"+city['city_name']+"</label>";
				}
				
			}
			html += "</td>";
		}
		$("#sdfm_district_info_table").append(html);
		$("#sdfm_district_info_table input.sdfm_province").each(function(){
			if($(this).parents('td').next().find(".sdfm_city").length == $(this).parents('td').next().find(".sdfm_city:checked").length){
					$(this).prop("checked",true);
				}else {
					$(this).prop("checked",false);
				}
			$(this).on("change",function(){
				
				if($(this).prop("checked")==true){
					$(this).parents('td').next().find(".sdfm_city").prop("checked",true);
				}else {
					$(this).parents('td').next().find(".sdfm_city").prop("checked",false);
				}
			});
		});

		$("#sdfm_district_info_table input.sdfm_city").on("change",function(){
			if($(this).parents('td').find('.sdfm_city').length == $(this).parents('td').find('.sdfm_city:checked').length){
				$(this).parents('td').prev().find('.sdfm_province').prop("checked",true);
			} else {
				$(this).parents('td').prev().find('.sdfm_province').prop("checked",false);
			}
		});

	});
}
