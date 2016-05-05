//通知 样式
// var PHH = {
//     success: function(msg,callback){
//         notie.alert(1, msg?msg:'Success!',2,callback);
//     },
//     warning: function(msg,callback){
//         notie.alert(2, msg?msg:'Warning!',2,callback);
//     },
//     error: function(msg,callback){
//         notie.alert(3, msg?msg:'Error!',2,callback);
//     },
//     info: function(msg,callback){
//         notie.alert(4, msg?msg:'Information!',2,callback);
//     },
//     confirm: function(msg,yseMsg,noMsg,callback1,callback2){
//         notie.confirm(msg?msg:'是否确定?', '确定', '取消', function() {
//             notie.alert(1, (yseMsg?yseMsg:'操作完成'), 2,callback1);
//         }, function() {
//             if (noMsg) {
//                 notie.alert(3, noMsg, 2,callback2);
//             }else{
//                 if (callback2) {callback2();}
//             }
//         });
//     },
//     input: function(msg,placeholder,callback1,callback2){
//         notie.input({
//             type: 'text',
//             placeholder: placeholder
//             // prefilledValue: ''
//         }, msg, '确定', '取消', function(valueEntered) {
//             callback1(valueEntered);
//         }, function(valueEntered) {
//             callback2(valueEntered);
//         });
//     }
// }

function scrollToTop(){
    var offset = 300,
        scroll_top_duration = 500,
        $back_to_top = $('.cd-top');

    $(window).scroll(function(){
        ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible');
    });
    $back_to_top.on('click', function(event){
        event.preventDefault();
        $('body,html').animate({
            scrollTop: 0 ,
            }, scroll_top_duration
        );
    });
}

// 从url中分离所有的参数，返回数组
function GetRequests() {
    var url = location.search, // 获取url中"?"符后的字串
        params = {};
    if (url.indexOf("?") != -1) {   // 判断是否有参数
        var str = url.substr(1).split("&");      // 从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
        for (var i = 0; i < str.length; i++) {
            var _str = str[i].split("=");
            params[_str[0]] = _str[1];
        }
        return params;      
    }else {
        return false;
    }
}

function isNullOrEmpty(strVal) {
	if ( strVal == null ||  strVal == undefined || strVal == '') {
		return true;
	} else {
		return false;
	}
}

function autocom(obj, list, formatItem, formatMatch, formatResult){
    obj.autocomplete(list, {
        minChars: 0,
        width: 310,
        max: 100,
        matchContains: true,
        autoFill: false,
        formatItem: formatItem,
        formatMatch: formatMatch,
        formatResult: formatResult
    });
    return obj;
}

function autocoms(obj, list, format) {
	return autocom(obj, list, format, format, format)
}

function TwoDecimal(num){   //2位小数
    return Number(num) ? Number(num).toFixed(2) : 0
}

function getJsonAjax(url, type, param, callback, complete){
    $.ajax({
        url: url,
        type: type,
        data: param,
        dataType: "json",
        beforeSend: function(){
            // $("body").append('<div id="ajaxLoadding"></div>');
        },
        complete: function(){
            // $("#ajaxLoading").remove();
            typeof(complete)=='function' ?  complete(): '';
        },
        success: function(data){
            if (data && data.result=='ok') {
                callback(data);
            }else{
                alert(data ? data.error_info : "返回值为空");
            }
        },
        fail: function(){
            alert('请求出错啦！');
        }
    })
}

function getCodeImg(task_sn){
  var html = "<div style='width:350px;display:inline-block;margin-left: -20px;' class='codeImg'><img class='center-block' src="+WEB_ROOT+"codeImg?barcode="+task_sn+"&height=95&width=550&text=0"+"><p class='barcode center-block'>"+task_sn+"</p></div>";
  return html;
}

function getConfig(callback){ //配置task
    var url = WEB_ROOT + 'TaskList/getConfig';
    getJsonAjax(url,"post",{},function(data){
        if (typeof(StatusName)!='undefined') { //任务状态
            for(var key in data.status){
                StatusName[key] = data.status[key];
            }
        }
        if (typeof(task_type)!='undefined') { //parent任务类型
            for(var key in data.task_type){
                task_type[key] = data.task_type[key];
            }
        }
        if (typeof(inventory_status)!='undefined') { //库区
            for(var key in data.inventory_status){
                inventory_status[key] = data.inventory_status[key]
            }
        }
        if (typeof(inventory_type)!='undefined') { //水果类型
            for(var key in data.inventory_type){
                inventory_type[key] = data.inventory_type[key]
            }
        }
        if (typeof(load_pallet_task_type)!='undefined') { //码托盘类型
            for(var key in data.load_pallet_task_type){
                load_pallet_task_type[key] = data.load_pallet_task_type[key]
            }
        }
        if (typeof(virtual_facility_type)!='undefined') { //仓库类型虚拟仓
            virtual_facility_type=data.virtual_facility_type
        }
    },function(){
        typeof(callback)=='function' ?  callback(): '';
    })
}
//获取自己的实体仓库（单个）
function getFacility(callback) {
    var url = WEB_ROOT + 'Commons/getFacilityList';
    getJsonAjax(url,"post",{},function(data){
        if (data.data.length==0) {
            alert('该账号没有实体仓库');
        }else if (data.data.length>1) {
            alert('多仓库权限不能操作');
            return false;
        }else{
            $("#facility_id").append("<option value='" + data.data[0].facility_id + "'>" + data.data[0].facility_name + "</option>");
        }
    },function(){
        typeof(callback)=='function' ?  callback(): '';
    })
}
//获取自己的仓库（多个）
function getMyFacilityList(type,callback) {
    var url = WEB_ROOT + 'Commons/getUserFacilityList';
    getJsonAjax(url,"post",{},function(data){
        
        switch (type){
            case "all" :
             $.each(data.facility_list,function(index,elem){
                $("#facility_id").append("<option value='" + elem.facility_id + "'>" + elem.facility_name + "</option>");
            });
            break;
            case "real" :
            $.each(data.facility_list,function(index,elem){
                if(elem.facility_type != "5" && elem.facility_type != "3" && elem.facility_type != "4"){
                    $("#facility_id").append("<option value='" + elem.facility_id + "'>" + elem.facility_name + "</option>");
                } 
            });
            break;
            case "vertical" :
            $.each(data.facility_list,function(index,elem){
                if(elem.facility_type == "5" || elem.facility_type == "3" ||elem.facility_type == "4"){
                    $("#facility_id").append("<option value='" + elem.facility_id + "'>" + elem.facility_name + "</option>");
                } 
            });
            break;
            default :
            alert("type参数错误");
        }
        
       
        
    },function(){
        typeof(callback)=='function' ?  callback(): '';
    })
}

//获取全部可用仓库
function getFacilityList(callback) {
    var url = WEB_ROOT + 'Commons/getAllfacilities';
    getJsonAjax(url,"post",{},function(data){
        $.each(data.facility_list,function(index,elem){
            $("#facility_list").append("<option value='" + elem.facility_id + "'>" + elem.facility_name + "</option>");
        }); 
        
        
    },function(){
        typeof(callback)=='function' ?  callback(): '';
    })
}
//获取自己的快递
function getShipping(callback) {
    var url = WEB_ROOT + 'Commons/getRealShippingList';
    getJsonAjax(url,"post",{},function(data){
        if (data.shipping_list.length!=1) {
            alert('多快递权限不能操作');
            return false;
        }else{
            $("#shipping_id").append("<option value='" + data.shipping_list[0].shipping_id + "'>" + data.shipping_list[0].shipping_name + "</option>");
        }
    },function(){
        typeof(callback)=='function' ?  callback(): '';
    })
}
//获取全部可用快递
function getRealShippingList(callback){
    var url = WEB_ROOT + 'Commons/getUserRealShippingList';
    getJsonAjax(url,"get",{},function(data){
        var html = '<option value="">请选择快递</option>'
        $.each(data.shipping_list,function(index,elem){
            html += "<option value='" + elem.shipping_id + "'>" + elem.shipping_name + "</option>";
        }); 
        $("#shipping_id").append(html);
    },function(){
        typeof(callback)=='function' ?  callback(): '';
    })
}
//商品数组（product_list）去重
if(!Array.prototype.uniqueProduct){
    Object.defineProperty(Array.prototype,'uniqueProduct',{
        value: function(){
            var arr = [];
            var really = [];
            for (var i = 0; i < this.length; i++) {
                //判断有没有数组在里面，没有就放进去
                if(this[i].product_id && this[i].product_name){
                    if (arr.indexOf(this[i].product_id) == -1) {
                        really.push({
                            "product_id": this[i].product_id,
                            "product_name": this[i].product_name
                        });
                        arr.push(this[i].product_id);
                    }
                }else if(this[i].product.product_id && this[i].product.product_name){
                    if (arr.indexOf(this[i].product.product_id) == -1) {
                        really.push({
                            "product_id": this[i].product.product_id,
                            "product_name": this[i].product.product_name
                        });
                        arr.push(this[i].product.product_id);
                    }
                }
            }
            return really;
        },
        enumerable: false
    })
}

var palletType = {
    "BadGoodsLoadPallet": "坏果码托盘",
    "DefectiveGoodsLoadPallet": "次果码托盘",
    "RawMaterialGoodsLoadPallet": "好果码托盘",
    "RawMaterialGoodsInventoryVariance": "好果盘亏",
    "FinishedGoodsLoadPallet": "包裹码托盘",
    "RawMaterialSuppliesLoadPallet": "耗材码托盘"
}
var load_inventory_status = {
    "in_bad": "坏果库",
    "in_defective": "次果库",
    "in_filter": "拣选库",
    "in_production": "生产库",
    "in_return": "退货库",
    "in_shipping": "发运库",
    "in_stock": "库存库",
    "in_temp": "暂存库",
    "in_transit": "在途库"
};
var issueType = {
    "RawMaterialGoodsIssue": '提水果',
    "FinishedGoodsIssue": '提包裹',
    "RawMaterialSuppliesIssue": '提耗材'
}
function initIssueTask(obj, task_id, task_type, title, callback){
    obj.append('<div id="loadding"><img src='+WEB_ROOT+'assets/img/loadding.gif></div>');
    var thtml = '';
    var url = WEB_ROOT + 'TaskDetail/issueBody',
        submit_data = {
            "task_id": task_id,
            "task_type": task_type
        };
    getJsonAjax(url,'get',submit_data,function(data){
        var codeImg = getCodeImg(data.task.task_sn);
        if(title){
            thtml = '<h3>'+issueType[task_type]+'任务';
            if (data.task.status=='FINISH') {
                thtml += '<span style="font-size:14px;">(已完结)</span></h3>';
            }else{
                thtml += '</h3>';
            }
        }
        data.container_unit_code_name = (data.container_unit_code_name == undefined ? "箱": data.container_unit_code_name);
        thtml += '<div class="issue_task_head_info"><span class="task_sn">'+codeImg+'</span><span class="product_name" style="margin-left: 10px;">商品名：'+data.product.product_name+'</span><span class="product_quantity" style="margin-left: 20px;">数量：'+TwoDecimal(data.product.quantity)+data.container_unit_code_name+'</span></div>';
        thtml += '<table class="table table-striped table-bordered"><thead><tr><th>托盘号</th><th>箱规</th><th>总量</th><th>已提</th></tr></thead><tbody>';
        $.each(data.pallets,function(index,item){
            data.container_unit_code_name = (data.container_unit_code_name == undefined ? "箱": data.container_unit_code_name);
            thtml += '<tr><td>'+item.pallet_sn+'</td><td>'+(item.unit_quantity?(TwoDecimal(item.unit_quantity)+data.product.unit_code_name+'/'+data.container_unit_code_name):'-')+'</td><td>'+TwoDecimal(item.quantity)+data.container_unit_code_name+'</td><td>'+TwoDecimal(Math.abs(item.out_quantity))+data.container_unit_code_name+'</td></tr>';
        })
        thtml += '</tbody></table>';
        obj.find("#loadding").remove();
        obj.append(thtml);
    },function(){
        if (callback) {callback()};
    })
}

function initLoadPalletTask(obj, task_id, task_type, title,callback){
    obj.append('<div id="loadding"><img src='+WEB_ROOT+'assets/img/loadding.gif></div>');
    var thtml = '';
    var url = WEB_ROOT + 'TaskDetail/LoadPalletBody',
        submit_data = {
            "task_id": task_id,
            "task_type": task_type
        };
    getJsonAjax(url,'get',submit_data,function(data){
        var codeImg = getCodeImg(data.task.task_sn);
        if(title){
            thtml = '<h3>'+palletType[task_type]+'任务';
            if (data.task.status=='FINISH') {
                thtml += '<span style="font-size:14px;">(已完结)</span></h3>';
            }else{
                thtml += '</h3>';
            }
        }
        thtml += '<div class="issue_task_head_info"><span class="task_sn">'+codeImg+'</span><span class="product_name" style="margin-left: 10px;">商品名：'+data.detail.product_name+'</span><span class="load_inventory_status" style="margin-left: 20px;">库区：'+load_inventory_status[data.task.to_inventory_status]+'</span><span class="product_quantity" style="margin-left: 20px;">数量：'+TwoDecimal(data.detail.quantity)+(data.container.container_unit_code_name?data.container.container_unit_code_name:'')+'</span></div>';
        if (data.task.task_type=="RawMaterialSuppliesLoadPallet") {
            thtml += '<table class="table table-striped table-bordered"><thead><tr><th>箱规</th><th>数量</th></tr></thead><tbody>';
            $.each(data.pallet,function(index,item){
                thtml += '<tr><td>'+(item.unit_quantity?(TwoDecimal(item.unit_quantity)+item.unit_code_name+'/'+item.container_unit_code_name):'-')+'</td><td>'+TwoDecimal(item.quantity)+(item.unit_quantity?item.container_unit_code_name:item.unit_code_name)+'</td></tr>';
            })
        }else{
            thtml += '<table class="table table-striped table-bordered"><thead><tr><th>托盘号</th><th>箱规</th><th>数量</th><th>毛重</th><th>箱皮</th><th>托拍重量</th><th>净重</th></tr></thead><tbody>';
            $.each(data.pallet,function(index,item){
                thtml += '<tr><td>'+item.pallet_sn+'</td><td>'+(item.unit_quantity?(TwoDecimal(item.unit_quantity)+item.unit_code_name+'/'+item.container_unit_code_name):'-')+'</td><td>'+TwoDecimal(item.quantity)+(item.unit_quantity?item.container_unit_code_name:item.unit_code_name)+'</td><td>'+(item.gross_weight)+' kg</td><td>'+(item.container_unit_weight)+' kg</td><td>'+(item.pallet_weight)+' kg</td><td>'+(item.net_weight)+' kg</td></tr>';
            })
        }
        thtml += '</tbody></table>';
        obj.find("#loadding").remove();
        obj.append(thtml);
    },function(){
        if (callback) {callback()};
    })
}

//record_tasks
function initRecordTask(obj,task_id){
    var inventory_type = {
        'finished': '包裹',
        'raw_material': '好果',
        'bad': '坏果',
        'defective': '次果'
    };
    obj.append('<div id="loadding"><img src='+WEB_ROOT+'assets/img/loadding.gif></div>');
    var url = WEB_ROOT + 'TaskDetail/RecordBody',
        submitData =  {
            "task_id" : task_id
        };
    getJsonAjax(url,"get",submitData,function(data){
        if (data.task.status=='FINISH') {
            var str = '<h3 class="section" id="s1">结果记录</h3><table class="table table-striped table-bordered record_table"><thead><tr><th>商品ID</th>'
                    + '<th>商品名称</th><th>商品类型</th><th>数量</th></tr></thead><tbody>'
            $.each(data.task_data,function(index,elem){
                str += "<tr><td>"+elem.product_id+"</td><td>"+elem.product_name+"</td><td>"+(elem.product_type=='goods'?inventory_type[elem.inventory_type]:'耗材')+"</td><td>"+ (elem.unit_quantity?(TwoDecimal(elem.quantity)+elem.container_unit_code_name):(TwoDecimal(elem.quantity)+ elem.unit_code_name))+ "</td></tr>";
            });
            str += '</tbody></table>';
            obj.append(str);
        }
        obj.find("#loadding").remove();
    })
}
function accSub(arg1, arg2) {//减法函数
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

Number.prototype.sub = Number.prototype.sub || function (arg) {
    return accSub(arg, this);
};

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

(function($){//提示器基于jquery,一个页面只能有一个，用法参考merchant_edit.php
    $.extend({
        prompter : function(str){
            if( str === '' ){
                alert('您到底要什么提示词？');
                return;
            }
            (function (str){
                var $prompter = $('#prompter');
                if( $prompter.length == 1 ){
                    $prompter.html(str);
                }else{
                    var html = '<div id="prompter">'+str+'</div>';
                    $('body').append(html);
                }
            })(str);
            function show(){
                $('#prompter').addClass('prompter_show');
            }
            function hide(){
                $('#prompter').removeClass('prompter_show');
            }
            function remove(){
                $('#prompter').remove();
            }
            return {
                show : show,
                hide : hide,
                remove : remove
            };
        }
    });
})(jQuery);
function isEmpty(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
};

