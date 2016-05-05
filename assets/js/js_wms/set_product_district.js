/**
 * 用于商户服务区域的设置
 */
var district_array = new Array();

var base_url = "getAreaProductDistrict";
var select_url = "getProductDistrict";

$(document).ready(function(){

    var sync = $('#sync_to_merchant_district').val();
    var facility = $('#cross_regional').val();
    if(sync=="1"){ //同步
        base_url = "getAreaProductDistrict";
        select_url = "getDefaultProductDistrict";
        $('#sync_district_sub').show();
        $('#setProductDistrictBtn').attr('disabled','disabled');
        $('#cross_regional').attr('disabled','disabled');
    }
    getDistrictForView();

    $('.district_status').change(function(){
        manageClickStatus();
    });

    //管理点击事件
    function manageClickStatus(){
        var sync = $('#sync_to_merchant_district').val();
        if(sync=="0"){ //不同步
            $('#sync_district_sub').hide();
            $('#setProductDistrictBtn').removeAttr('disabled');
            $('#cross_regional').removeAttr('disabled');
        }else if(sync=="1"){ //同步
            $('#sync_district_sub').show();
            $('#setProductDistrictBtn').attr('disabled','disabled');
            $('#cross_regional').attr('disabled','disabled');
        }
    }

    $('#setProductDistrictBtn').click(function(){
        $('#district_table').html('');
        var sync = $('#sync_to_merchant_district').val();
        var facility = $('#cross_regional').val();
        if(sync=="1"){ //同步
            base_url = "getAreaProductDistrict";
            select_url = "getDefaultProductDistrict";
        }else if(sync=="0" && facility=="0"){ //不同步且不跨区域
            base_url = "getAreaProductDistrict";
            select_url = "getProductDistrict";
        }else if(sync=="0" && facility=="1"){ //不同步且允许跨区域
            base_url = "getAllProductDistrict";
            select_url = "getProductDistrict";
        }
        var product_id = $('#product_id').val();

        //getBaseProductDiscrict(base_url,product_id);
        $.when( getBaseProductDiscrict(base_url,product_id),getCurrentProductDistrict(select_url,product_id) ).done(function(baseDiscrict,currentDiscrict){
            var baseData = baseDiscrict[0],
                currentData = currentDiscrict[0];
            if( baseData.SUCCESS != "true" ){
                $("#loading_hits").text("获取数据失败!");
            }else if( currentData.SUCCESS != "true" ){
                alert("当前服务区域数据获取失败！");
            }else{
                var district_list = baseData.district_list;
                $("#loading_hits").hide();
                drawProductDistrict(district_list);
                district_array = [];
                for(var district_id in currentData.district_list){
                    district_array.push(district_id);
                    $("#"+district_id).addClass("btn-primary");
                }
            }
        });

    });

    //绘制当前服务区域的表格
    function getDistrictForView(){
        $('.wait_loading').attr('disabled','disabled');
        var product_id = $('#product_id').val();
        $.ajax({
            url:$('#WEB_ROOT').val()+"product/getProductDistrictList",
            type:"get",
            data:{"product_id":product_id},
            dataType:'json',
        }).done(function(data){
            if(data.SUCCESS == "true"){
                $("#loading_table").hide();
                $('.wait_loading').removeAttr('disabled');
                manageClickStatus();
                var district_list = data.district_list;
                drawDistrictForView(district_list);
            }else{
                $("#loading_table").text("服务区域数据获取失败");
            }
        }).fail(function(data){
            alert("内部服务器错误");
        });
    }

    function drawDistrictForView(district_list){
        $("#product_district_table").empty();
        var thead = "<tr><td style='width:10%'>省</td><td style='width:10%'>市</td><td style='width:80%'>区</td></tr>"
        var tbody = "";
        $("#product_district_table").append(thead);
        for(var pid in district_list){
            province_id = district_list[pid]["province_id"];
            province_name = district_list[pid]["province_name"];
            city_list = district_list[pid]["city_list"];
            var city_num = Object.keys(district_list[pid]['city_list']).length;
            var flag = 1;
            for(var cid in city_list){
                city_id = district_list[pid]["city_list"][cid]["city_id"];
                city_name = district_list[pid]["city_list"][cid]["city_name"];
                districts = district_list[pid]["city_list"][cid]["district_list"];
                var district_str = "";
                for(var did in districts){
                    district_id = district_list[pid]["city_list"][cid]["district_list"][did]["district_id"];
                    district_name = district_list[pid]["city_list"][cid]["district_list"][did]["district_name"];
                    district_str += " <span>"+district_name+"</span> ";
                }
                if(flag == 1){
                    tbody = "<tr><td rowspan="+city_num+"><span>"+province_name+"</span></td><td><span>"+city_name
                        +"</span></td><td>"+district_str+"</td></tr>";
                    flag =0;
                    continue;
                }
                tbody += "<tr><td><span>"+city_name +"</sapn></td><td>"+district_str+"</td></tr>";
            }
            $("#product_district_table").append(tbody);
        }
    }

    //用于区域选择表格的绘制
    function drawProductDistrict(district_list){
        var thead = "<tr><td style='width:10%'>省</td><td style='width:10%'>市</td><td style='width:80%'>区</td></tr>"
        var tbody = "";
        $("#district_table").append(thead);
        for(var pid in district_list){
            province_id = district_list[pid]["province_id"];
            province_name = district_list[pid]["province_name"];
            city_list = district_list[pid]["city_list"];
            var city_num = Object.keys(district_list[pid]['city_list']).length;

            var flag = 1;
            for(var cid in city_list){
                city_id = district_list[pid]["city_list"][cid]["city_id"];
                city_name = district_list[pid]["city_list"][cid]["city_name"];
                districts = district_list[pid]["city_list"][cid]["district_list"];
                var district_str = "";
                for(var did in districts){
                    district_id = district_list[pid]["city_list"][cid]["district_list"][did]["district_id"];
                    district_name = district_list[pid]["city_list"][cid]["district_list"][did]["district_name"];
                    district_str += " <span class='district_type' id="+district_id+">"+district_name+"</span> ";
                }
                if(flag == 1){
                    tbody = "<tr><td rowspan="+city_num+"><span class='province_type' id="+province_id
                        +">"+province_name+"</span></td><td name='"+province_id+"'><span class='city_type'  id="+city_id+">"+city_name
                        +"</span></td><td class='district_list' name='"+province_id+"'>"+district_str+"</td></tr>";
                    flag =0;
                    continue;
                }
                tbody += "<tr><td name='"+province_id+"'><span class='city_type'  id="+city_id
                    +">"+city_name +"</sapn></td><td class='district_list' name='"+province_id+"'>"+district_str+"</td></tr>";
            }
            $("#district_table").append(tbody);
        }

    }

    //获取服务区域选项
    function getBaseProductDiscrict(url,product_id){
        return $.ajax({
            url:$('#WEB_ROOT').val()+"product/"+url,
            type:"get",
            data:{"product_id":product_id},
            dataType:"json",
            xhrFields:{
                withCredentials:true
            }
        })/*.done(function(data){
            if(data.SUCCESS == "true"){
                var district_list = data.district_list;
                $("#loading_hits").hide();
                drawProductDistrict(district_list);
                getCurrentProductDistrict(select_url,product_id);
            }else{
                $("#loading_hits").text("获取数据失败!");
            }
        })*/.fail(function(data){
            //alert('内部服务器错误');
        });
    }

    //获取当前商品服务区域
    function getCurrentProductDistrict(url,product_id){
        return $.ajax({
            url:$('#WEB_ROOT').val()+"product/"+url,
            type:"post",
            data:{"product_id":product_id},
            dataType:"json",
            xhrFields:{
                withCredentials:true
            }
        })/*.done(function(data){
            if(data.SUCCESS == "true"){
                district_array = [];
                for(var district_id in data.district_list){
                    district_array.push(district_id);
                    $("#"+district_id).addClass("btn-primary");
                }
            }else{
                alert("当前服务区域数据获取失败！");
            }
        })*/.fail(function(data){
            alert('内部服务器错误');
        });
    }

    //用于商品服务区域的提交
    $('#product_district_sub').click(function(){

        $('#product_district_sub').attr('disabled','disabled');

        var sync_to_merchant_district = $('#sync_to_merchant_district').val();
        var cross_regional = $('#cross_regional').val();
        var product_id = $('#product_id').val();
        var district_array = [];

        var district_item = $('#district_table').find("[class='district_type btn-primary']");
        $(district_item).each(function(){
            district_array.push($(this).attr("id"));
        });

        $.ajax({
            url:$('#WEB_ROOT').val()+"product/updateProductDistrict",
            type:"post",
            data:{"product_id":product_id,
                "district_array":district_array,
                "sync_to_merchant_district":sync_to_merchant_district,
                "cross_regional":cross_regional },
            dataType:"json",
            xhrFields:{
                withCredentials:true
            }
        }).done(function(data){
            if(data.SUCCESS == "true"){
                alert("提交成功");
                $('#product_district_sub').removeAttr('disabled');
                getDistrictForView();
                $('#product_district_modal').modal("hide");
            }else{
                alert("提交失败" + data.error_info);
                $('#product_district_sub').removeAttr('disabled');
            }
        }).fail(function(data){
            alert('内部服务器错误');
            $('#product_district_sub').removeAttr('disabled');
        });
    });

    //默认服务区域的提交
    $('#sync_district_sub').click(function(){
        $('#sync_district_sub').attr('disabled','disabled');
        var product_id = $('#product_id').val();
        $.ajax({
            url:$('#WEB_ROOT').val()+"product/addDefaultProductDistrict",
            type:"post",
            data:{"product_id":product_id},
            dataType:"json",
            xhrFields:{
                withCredentials:true
            }
        }).done(function(data){
            if(data.SUCCESS == "true"){
                alert("服务区域同步成功");
                $('#sync_district_sub').removeAttr('disabled');
                getDistrictForView();
            }else{
                alert("同步失败");
                $('#sync_district_sub').removeAttr('disabled');
            }
        }).fail(function(data){
            $('#sync_district_sub').removeAttr('disabled');
            alert('内部服务器错误');
        })
    });

    function changeDistrictStatus(target){
        if($(target).hasClass('btn-primary')){
            $(target).removeClass("btn-primary");
        }else{
            $(target).addClass("btn-primary");
        }
    }
    function changeCityStatus(target){
        var district_target = $(target.parentNode.parentNode).find("[class='district_list']");
        if($(target).hasClass('btn-primary')){
            $(target).removeClass("btn-primary");
            district_target.find("span").removeClass("btn-primary");
        }else{
            $(target).addClass("btn-primary");
            district_target.find("span").addClass("btn-primary");
        }
    }
    function changeProvinceStatus(target){
        var proid = $(target).attr("id");
        var district_target = $(target.parentNode.parentNode.parentNode).find("[name='"+proid+"']");
        if($(target).hasClass('btn-primary')){
            $(target).removeClass("btn-primary");
            district_target.find("span").removeClass("btn-primary");
        }else{
            $(target).addClass("btn-primary");
            district_target.find("span").addClass("btn-primary");
        }
    }

    $('#district_table').click(function(e){
        if($(e.target).hasClass('district_type')){
            changeDistrictStatus(e.target);

        }else if($(e.target).hasClass('city_type')){
            changeCityStatus(e.target);
        }else if($(e.target).hasClass('province_type')){
            changeProvinceStatus(e.target);
        }
    });
});

$('#delivery_facility_type').change(function(){
	setDeliveryFacilityType();
	refreshFacilityShippingSettingTable();
});

function setDeliveryFacilityType(){
	product_id = $('#product_id').val();
	delivery_facility_type = $('#delivery_facility_type').val();
	 $.ajax({
         url:$('#WEB_ROOT').val()+"productEdit/setDeliveryFacilityType",
         type:"post",
         data:{
        	 "product_id":product_id,
        	 "delivery_facility_type":delivery_facility_type
         },
         dataType:"json",
         xhrFields:{
             withCredentials:true
         }
     }).done(function(data){
         if(data.success == "true"){
             alert("发货仓库更改成功");
         }else{
             alert('发货仓库更改失败');
         }
     }).fail(function(data){
         alert('内部服务器错误');
     })
}
