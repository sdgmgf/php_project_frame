var url_base = $('#WEB_ROOT').val();
//初始化获取采购人列表
$(document).ready(function(){
    div_visible();
    getRawSuppliesProductList();
	getRawGoodsProductList();
	getMerchantListByPlatform();
}) ;

$("#platform_id").change(function(){
	getMerchantListByPlatform();
});
$('#add_supplies_btn').click(function(){
    var lineIndex = $("#supplies_raw_material_list tr.content").size();
    tr = $('<tr>');
    tr.addClass('content');
    td = $('<td>');
    td.addClass('product_supplies_ids');
    input = $('<input>');
    input.attr('id','product_supplies_ids[]');
    input.attr('name','product_supplies_ids[]');
    input.attr('readonly','readonly');
    input.attr('placeholder','ID只读');
    input.css('cursor','not-allowed');
    td.append(input);
    tr.append(td);
    
    td = $('<td>');
    td.width($('#product_name_title').width());
    td.addClass('product_supplies_names');
    input = $('<input>');
    input.attr('id','product_supplies_names[]');
    input.attr('name','product_supplies_names[]');
	autocoms($(input), rawSuppliesProductList, productFormatOpt)
	.result(function(event, row, formatted) {
        $(this).parent().parent().find('td.product_supplies_ids').find('input').val(row.product_id);
        $(this).parent().parent().find('td.supplies_product_unit').html(row.unit_code_name);
        $(this).val(row.product_name);
    });
    
    td.append(input);
    tr.append(td);
    td = $('<td>');
    td.width($('#quantity_title').width());
    td.addClass('supplies_quantitys');
    input = $('<input>');
    input.attr('type','number');
    input.attr('id','supplies_quantitys[]');
    input.attr('name','supplies_quantitys[]');
    td.append(input);
    tr.append(td);
    
    td = $('<td>');
    td.addClass('supplies_product_unit');
    td.width(40);
    tr.append(td);

    td = $('<td>');
    td.width($('#operator_title').width());
    td.addClass('operator');
    input = $('<input>');
    input.attr('type','button');
    input.addClass('btn');
    input.addClass('btn-danger');
    input.height('24px');
    input.css('border','none');
    input.css('lineHeight','14px');
    input.val('删');
    input.click(remove_tr);
    td.append(input);
    tr.append(td);
    $("#supplies_raw_material_list tr").eq(lineIndex).after(tr);
})

$('#add_mapping_products_btn').click(function(){
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
	autocoms($(input), rawGoodsProductList, productFormatOpt)
    .result(function(event, row, formatted) {
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

$('#add_merchant_goods_ids_btn').click(function(){
    if($('#merchant_id').val()===''){
        alert('只有当商城不为空的时候才允许此操作');
        return false;
    }
    if(merchant_goods_list.length == 0) {
        alert('无请求创建档案的OMS商品');
    }
    var lineIndex = $("#merchant_goods_table tr.content").size();
    tr = $('<tr>');
    tr.addClass('content');
    td = $('<td>');
    td.addClass('merchant_goods_id');
    input = $('<input>');
    input.attr('name','merchant_goods_ids[]');
    autocoms(input, merchant_goods_list, goodsFormatOpt)
    .result(function(event, row, formatted) {
        $(this).parent().parent().find('td.merchant_goods_name').html(row.goods_name);
        $(this).val(row.goods_id);
    });
    
    td.append(input);
    
    tr.append(td);
    td = $('<td>');
    td.addClass('merchant_goods_name');
    tr.append(td);

    td = $('<td>');
    td.addClass('merchant_goods_operator');
    input = $('<input>');
    input.attr('type','button');
    input.addClass('btn');
    input.addClass('btn-danger');
    input.height('24px');
    input.val('删');
    input.click(remove_tr);
    td.append(input);
    tr.append(td);
    $("#merchant_goods_table tr").eq(lineIndex).after(tr);
})

$('#merchant_goods_table').on('click','input.btn-danger',function(){
    remove_tr.call(this);
});

$('#mapping_supplies_finished_table').on('click','.btn-danger ',function(){
    $('.mapping_supplies_product_desc').css('display','none');
    remove_tr.call(this);
});

$('#merchant_id').change(function(){
    $('#merchant_goods_table').find('tr.content').remove();
    getGoodsListByMerchant();
});

function getGoodsListByMerchant(){
    merchant_goods_list = {};
    if($('#merchant_id').val() == '') {
        return ;
    }
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
            autocoms($('#merchant_goods_table input[name="merchant_goods_ids[]"]'), merchant_goods_list, goodsFormatOpt)
            .result(function(event, row, formatted) {
	            $(this).parent().parent().find('td.merchant_goods_name').html(row.goods_name);
	            $(this).val(row.goods_id);
	        });
        }   
        else{
            alert(data.error_info);
        }
    });
}

$('.product_type').change(function(){
    div_visible();
});

$('.product_sub_type').change(function(){
    div_visible();
});

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
        } else if(product_sub_type == 'semi_finished') {
            $('#product_finish_div').addClass('hidden');
            $('#product_semi_finish_div').removeClass('hidden');
            $('#product_raw_material_div').addClass('hidden');
            $('#product_specification_div').addClass('hidden');
            $('#product_supplies_div').addClass('hidden');
            $('#product_supplies_finished_div').addClass('hidden');
            $('#specification_li').css('display','none');
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
        }

    }
}

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
    
    var mapping_products = new Array();;
    $("#mapping_product_table tr.content").each(function(){
        mapping_product_id = $(this).find("td.mapping_product_id").find('input').val();
        mapping_product_quantity = $(this).find('td.mapping_product_quantity').find('input').val();
        var mapping_product = {
                "mapping_product_id":mapping_product_id,
                "mapping_product_quantity":mapping_product_quantity
            };
        mapping_products.push(mapping_product);
    });
    
    var mapping_supplies_finished_ids = new Array();
    $("#mapping_supplies_finished_table tr.content").each(function(){
        mapping_supplies_finished_id = $(this).find("td.mapping_supplies_finished_id").find('input').val();
        mapping_supplies_finished_ids.push(mapping_supplies_finished_id);
    });
    var product_supplies_ids = new Array();
    $("#supplies_raw_material_list").each(function(){
        product_supplies_id = $(this).find('td.product_supplies_id').html();
        product_supplies_ids.push(product_supplies_id);
    });
    
    var product_supplies_ids = [];
    $('#supplies_raw_material_list tr.content').each(function(){
        product_supplies_ids.push( $(this).find('td.product_supplies_ids').find('input').val() );
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
    var $use_best_shipping_input = $('#use_best_shipping');

    var isGoodsEmpty = 0;
    switch (product_type_val) {
    case 'goods':
        switch (product_sub_type_val) {
        case 'raw_material':
            if( purchasing_cycle_goods_raw.val()=='' || purchasing_cycle_goods_raw.val()<0 ){
            	purchasing_cycle_input.val(purchasing_cycle_goods_raw.val());
            }
            
            if(producing_region_input.val() == '') {
                alert('产地不能为空');
                producing_region_input.focus();
                return false;
            }

            if(unit_code_val == '' || unit_code_name_val == '') {
                alert('请选择存储单位');
                return false;
            }

            if($('#purchase_unit_code').val==''){
                alert('请选择采购单位');
                return false;
            }

            if($('#sale_unit_code').val==''){
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
            
            if(shipping_service_id_input.val() == '') {
                alert('服务不能为空');
                shipping_service_id_input.focus();
                return false;
            }
            if(secrect_code_input.val() == '') {
                alert('暗语不能为空');
                secrect_code_input.focus();
                return false;
            }
            if(merchant_id_input.val() == '') {
                alert('商城不能为空');
                merchant_id_input.focus();
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
                    }else{
                        isGoodsEmpty = 1;
                    }
                }
                if(flag) return false;
            }
            if(mapping_products && merchant_goods_ids.length != 0){
                var flag = false;
                $("#mapping_product_table tr.content").each(function(i){
                    if( $(this).find("td.mapping_product_id").find('input').val() == ''){
                        alert('产品名称不能自己随意输入');
                        flag = true;
                        $(this).find('td.mapping_product_name').find('input').focus();
                        return false;
                    };
                    if( $(this).find("td.mapping_product_quantity").find('input').val() == '' ){
                        alert('添加映射原料时数量不能为空');
                        flag = true;
                        $(this).find('td.mapping_product_quantity').find('input').focus();
                        return false;
                    }
                });
                if(flag) return false;
            }
            if(mapping_products && mapping_products.length == 0) {
                alert('原料映射不能为空');
                return ;
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
                if(product_supplies_ids.length == 0) {
                    alert('耗材不能为空');
                    return false;
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
                    var length1 = product_supplies_ids.length;
                    var tempArr = product_supplies_ids;
                    var length2 = $.unique(tempArr).length;
                    if( length1 != length2 ){
                        alert('耗材不能重复');
                        return false;
                    }
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
    
    if(isGoodsEmpty==1){
        return isGoodsEmpty;
    }else{
        return true;
    }   
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
//          imgDiv.removeAttr('hidden');
        } else {
            alert("仅支持" + allowExtention + "为后缀名的文件!");
            fileObj.value = ""; //清空选中文件
            if (browserVersion.indexOf("MSIE") > -1) {
                fileObj.select();
                document.selection.clear();
            }
//          fileObj.outerHTML = fileObj.outerHTML;
        }
}

$(".img", ".imgDiv").mouseover(function () {
    $(this).blur();
});

$(".img", ".imgDiv").change(function () {
    productImg =$(this).parent().siblings('.imgShow').children('.productImg').attr('id');
    imgHolder = $(this).parent().siblings('.imgShow').children('.productImg').children(0).children('.imgHolder').attr('id');
    PreviewImage(this, imgHolder, productImg);
});

function remove_tr(){
    $(this).parent().parent().remove();
}

$('.delImg').click(function(){
    $(this).parents('.imgDiv').find('.img').val('');
    $(this).parent().attr('hidden','true');
    imgDiv = $(this).parents('.imgDiv');
    imgDiv =  $(this).parents('.imgDiv').next('.imgDiv');
    if(imgDiv && imgDiv.length == 0) {
        imgDiv = $(this).parents('.imgDiv').parent().next().find('.imgDiv').eq(0);
    }
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

$('#sub').click(function(){
    var result = validateSubmitData();

    if(!result){
        return false;
    }else if(result!==1){
        var cf=confirm( "是否确认?" )
        if(!cf){
            return;
        }
    }
            
    btn = $(this);
    btn.attr('disabled','disabled');
    $('#product_form').submit();
});

$("#product_form").submit(function(){ 
    $('#supplies_unit_code_name').val($('#supplies_unit_code option:selected').text());
    $('#container_unit_code_name').val($('#container_unit_code option:selected').text());
    $('#unit_code_name').val($('#unit_code option:selected').text());

    options = {
        dataType: 'json',
        success: function (data) {
            if(data.success == 'success'){
                alert('创建成功');
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

$('.selectImg').on('click',function(){
    var $this = $(this),
        $tInput = $this.parents('.imgDiv').find("input[type='file']");
    $tInput.trigger('click');
});

function getRawGoodsProductList(){
	$.ajax({
		url: url_base + 'product/getProductList',
		type: 'get',
		dataType: 'json',
		data: {product_type: 'goods', product_sub_type: 'raw_material'},
		xhrFields: {
			withCredentials:true
		}
	}).done(function(data){
		if(data.res == 'success') {
			rawGoodsProductList = data.product_list;
		}
	});
}

function getMerchantListByPlatform(){
	$("#merchant_id").empty();
	$.ajax({
		url:url_base+"productNew/getMerchantListByPlatform",
		type:"post",
		data:{"platform_id":$("#platform_id").val()},
		dataType:"json",
		xhrFields: {
	        withCredentials: true
	    }
	}).done(function(data){
		if(data.success == "success"){
			$("#merchant_id").empty();
			var str="<option></option>";
			for(var i in data.platform_merchant_list){
				var item=data.platform_merchant_list[i];
				str+="<option value='"+item['merchant_id']+"'>"+item['merchant_name']+"</option>";
			}
			
			$("#merchant_id").append(str);
		}else{
			alert("无结果");
		}
	}).fail(function(data){
		alert('内部服务器错误');
	});
}
function getRawSuppliesProductList(){
    $.ajax({
        url:url_base+"product/getProductList",
        type:"get",
		data:{"product_type":"supplies","product_sub_type":"raw_material","product_status":"OK"},
        dataType:"json",
        xhrFields: {
            withCredentials: true
        }
    }).done(function(data){
        if(data.res == "success"){
            rawSuppliesProductList = data.product_list;
        }   
        else{
            alert(data.error_info);
        }
    });
}

function goodsFormatOpt(row, i, max) {
	 return "[" + row.goods_id + "]";
}

function productFormatOpt(row, i, max) {
	return row.product_id + "[" + row.product_name + "]";
}
