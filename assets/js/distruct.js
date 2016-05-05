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
				$('#region_modal').modal('hide');
				alert(title_name + "的区域快递还未设置！");
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