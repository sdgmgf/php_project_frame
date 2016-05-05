angular.module('shippingTemplateApp',['ngResource'],function($compileProvider){
  	 
})

.factory('restGetShippings', ['$resource', function(resource){
	return resource("./shippingTemplate/shippingList");
}])

.factory('restRegions', ['$resource', function(resource){
	return resource("./region/all");
}])


.factory('saveOneShipping', ['$resource', function(resource){
	return resource("./shippingTemplate/saveOneShippingTemplate");
}])

    // 根据 template_id 更新或者 插入一条 template_details 的记录 
.factory('updateOnetemplate_details', ['$resource', function(resource){
	return resource("./shippingTemplate/updateOnetemplate_details");
}])
  // 根据 template_id template_detail_id 删除 
.factory('dropOneArea', ['$resource', function(resource){
	return resource("./shippingTemplate/dropOneArea");
}])

  // 根据 template_id 删除 一个 shipping  
.factory('dropOneShipping', ['$resource', function(resource){
	return resource("./shippingTemplate/dropOneshippingTemplate");
}])
 	
  //   获取城市列表 
.factory('cityFactory', ['$http', function(http){
	 
	var service = {};
	//  获取所有的省份   参数 cities 按地址传递 
	service.province = function(cities){
		if(cities == undefined || cities.length <1 ){
			http.get('./region/provinceList')
				.success(function(data){ 
					if(data.OK){
					  if(cities == undefined || cities.length < 1 ){
						  angular.forEach(data.data,function(city){
						  	cities.push(city); 
						  }); 
					  }
				 	}else{
			 			alert("从服务器获取数据异常");
				 	}
				}); 
		}
		return cities;
	}
    // end get all the province 
    //  获取省份下的城市  参数 cities 按地址传递 
	service.city = function(cities,parent_id){
		var exist = false;
		parent_id = parseInt(parent_id); 
		 // 该省份下的城市是否已经被加载 否则从服务器加载 
		angular.forEach(cities,function(city){
			if(parseInt(city.parent_id) == parent_id ){
				exist = true;
				return;
			}
		}); 
		if(exist == false ){  // 从服务器加载
			http.get('./region/cityList?parent_id='+parent_id)
				.success(function(data){
					if(data.OK){
						 // 如果确实不存在则加入 
						angular.forEach(cities,function(city){
							if(parseInt(city.parent_id) == parent_id ){
								return;
							}
						}); 

						angular.forEach(data.data,function(city){
					  	cities.push(city); 
					  });
					}
				});  
		} // end 从服务器加载 
		return cities;
	}
    // end get all the province  

	return service;
}]) 
     // 获取运费模板列表 
.factory('shippingTemplateFactory', ['$http','$sce', function(http,$sce){
	var service = {};
	service.list = function(status,offset,limit,page_count,scope,fun){
		http.get('./shippingTemplate/templateList?&status='+status+"&offset="+offset+"&limit="+limit+
					"&page_count="+page_count)
				.success(function(data){ 
					if(data.OK){
						scope.shippingTemplates = data.data;
						scope.page =  data.page ;
						scope.page_count = data.page_count;
						fun();
				 	}else{
			 			alert("从服务器获取数据异常");
				 	}
		}); 
	}
	return service; 
}]) 
 

.controller('templatesController', ['$scope','$http','restGetShippings','restRegions',
	'saveOneShipping','updateOnetemplate_details', "dropOneArea" , "dropOneShipping","cityFactory",
	'shippingTemplateFactory', 
	function(scope,http,restGetShippings,restRegions,
		saveOneShipping,updateOnetemplate_details,dropOneArea,dropOneShipping,cityFactory,shippingTemplateFactory) {
    
      
	 scope.cities = [];        // 所有的城市数据  
	 scope.shippingTemplates = [];     // 所有的模板  
	 scope.status = "OK";     // 模板状态 
     scope.offset = 0;         // 分页   偏移量 
     scope.limit = 2;          // 每页大小
     scope.currentPage = 1 ;   // 当前为第几页 
     scope.page_count = 2;     //总页数 刚开始假定 只有2页 
     scope.page = "" ;         //  分页 
     scope.isNowAdd = false ;  // 现在是否正在添加一个新的模板 
     scope.currentProvinceId = -1 ; // 当前选择的省份 根据该值列出城市列表 
      scope.shippingTemplates = shippingTemplateFactory.list(scope.status,scope.offset,scope.limit,scope.page_count,scope,function(){ });
     
     scope.input = { 
     	isChanged:{},           // 数据是否被改变  那个表格的数据被改变了 
     	old:""                  // 当前正在填写的 input 输入框 在鼠标刚进入时候的值 用来判断值是否变换 
      }; 
     scope.dialog = {       // 记录是否显示 弹出城市选择对话框  
     	currentBig:-1,        //   当前第几个表格大的弹出框显示 
     	currentSmall:-1        //  当前那个省份下的城市列表显示    
     }; 

     scope.mouseClick = {
     	x:-1,                    // 鼠标点击时间 发生的位置 
     	y:-1   // 鼠标点击时间 发生的位置 
     }

     scope.initPage = function(){
     	scope.offset = 0;
     	scope.currentPage = 1;
     	scope.pageArray = [1]; 
     }

      // input 输入框 鼠标进入时  shipping_row 表示第几个 表格 0 1 2 ... 
     scope.inputMousedown = function(value,shipping_row){
     	scope.input.old = name;
     }
     	// 输入框 按键弹起 
     scope.inputKeyup = function(value,shipping_row){
     	if(scope.input.old != value ) {
     		scope.input.isChanged[shipping_row] = true; 
     	}
     }

     scope.viewDeleteClick = function(shippings){
     	scope.status ="DELETE";
     	scope.initPage(); 
     	scope.getShippingList();

     }

     scope.viewOkClick = function(shippings){
     	scope.status ="OK";
     	scope.initPage(); 
     	scope.getShippingList();	
     }

      // 从服务器中获取 运费模板列表  
     scope.getShippingList = function( ){
     	shippingTemplateFactory.list(scope.status,scope.offset,scope.limit,scope.page_count,scope,function(){ });
     }
     


  //    restGetShippings.save({
  //    	 'status':scope.status, 
  //        'offset':scope.offset,
  //    	 'limit':scope.limit,
  //    	 'count':scope.count 
  //        }).$promise
		// .then(function(data) {
		// 	if(data.OK){
		// 		 if(scope.isNowAdd == true &&scope.shippingTemplates != undefined ){
		//      	 		angular.forEach(data.data,function(shipping){
		//      	 			scope.shippingTemplates.push(shipping); 
		//      	 		}); 
		//      	 }else{
		//      	 		scope.shippingTemplates = data.data;
		//      	  }
				 
		// 	}else{
		// 		alert("从服务器获取数据异常");
		// 	}
		// }).catch(function(){
		// 	alert('与服务器链接出现异常');
		// });
    
	
	// 删除表格中的一行数据 
	scope.deleteClick = function(shipping,detail,area_row){
		var confim =  confirm("您确定要删除吗?");
		if(confim == false ) return;
         // 如果不是更新则直接删除  
         if(detail.shipping_template_detail_id  == undefined || detail.shipping_template_detail_id =="" ){
         	shipping.detail.splice(area_row,1);
         }else{  // 如果是已经存在在记录 提交到服务器删除  
         	 var data = {
         	 	"shipping_template_id":shipping.shipping_template_id,
         	 	"shipping_template_detail_id":detail.shipping_template_detail_id
         	 }; 

         	// 提交到后台 
		    dropOneArea.save(data).$promise
			 .then(function(data) {
					if(data.OK){
						 shipping.detail.splice(area_row,1);
						 alert("删除成功");
					}else{
						alert("删除失败");
					}
				}).catch(function(){
					alert('与服务器链接出现异常');
			});
         		// end 
         }
          
	 }
    
    // 保存表格中的一行 数据
	scope.saveClick = function(shipping,detail,area_row){
		 if((detail.regions  == undefined || detail.regions == [])){
		 	alert("请选择地区后点击保存");
		 	return ;
		 }

         var saveData = {
         	"shipping_template_id":shipping.shipping_template_id,
         	"shipping_template_detail_id":detail.shipping_template_detail_id,
         	"first_weight":detail.first_weight,
         	"first_fee":detail.first_fee,
         	"continued_weight":detail.continued_weight,
         	"continued_fee":detail.continued_fee,
         	"region_ids":[]
         } 
         // 把 region_id 放到一起 组成数组 
         saveData.region_ids = []; 
         angular.forEach(detail.regions,function(region){
         	saveData.region_ids.push(region.region_id);
         });
       
         scope.postDetail(shipping,detail,area_row,saveData); 
	}

	 scope.postDetail = function(shipping,detail,area_row,saveData){
	 		// 提交到后台 
		 updateOnetemplate_details.save(saveData).$promise
		.then(function(data) {
			if(data.OK){
				if(detail.shipping_template_detail_id !==  undefined ){
					alert("更新成功");
				}else{
					if(data.shipping_template_detail_id == "-1"){
						alert("插入一行数据出现错误，请重新保存");
						return true; 
					}else{
						detail.shipping_template_detail_id = data.shipping_template_detail_id;
				   	    alert("添加一行记录成功 shippig_template_detail_id为"+data.shipping_template_detail_id);
					}
					
				}
			}else{
				alert("无法保存到服务器,请重新保存"); 
			}
		}).catch(function(){
			alert('与服务器连接出现异常');
		});
	 }

    // 这个注释掉的 东西 还有 用 
	   // // 把某个 detail 的 DELETE 状态变为 OK 
    //  scope.activeClick = function(shipping,area,area_row){
    //  	   var saveData = {
    //      	"template_id":shipping.template_id,
    //      	"template_detail_id":shipping.template_detail_id,
    //      	"first_weight":area.first_weight,
    //      	"first_fee":area.first_fee,
    //      	"continued_weight":area.continued_weight,
    //      	"continued_fee":area.continued_fee,
    //      	"region_ids":[],
    //      	"status":"OK"
    //      } 
    //      // 把 region_id 放到一起 组成数组 
    //      saveData.region_ids = []; 
    //      angular.forEach(area.regions,function(region){
    //      	saveData.region_ids.push(region.region_id);
    //      });
    //  	var succ = scope.postDetail(shipping,area,area_row,saveData); 
    //  	if( succ ){
    //  		area.status ="OK"; 
    //  	}
    //  }

	// 保存一个完整 的 shipping 数据 
	scope.saveOneShippingTemplateClick =function(shipping,row){
       if( shipping.detail == undefined || shipping.detail.length ==0 
       		|| shipping.shipping_template_name == undefined || shipping.shipping_template_name ==""){
       	 alert("请填入模板名称和数据后，点击【保存该模板】");
       	 return;
       }
       scope.isNowAdd = false;  // 现在是否正在添加一个 模板  标记 变为 false 
       
        // 把 region_id 组成一个数组  
	   angular.forEach(shipping.detail ,function(area){
	   		area.region_ids  = [];
	   		angular.forEach(area.regions,function(region){
	   			area.region_ids.push(region.region_id);
	   		});

	   });
	   saveOneShipping.save(shipping).$promise
		.then(function(data) {
			if(data.OK){
				if(data.shipping_template_id == undefined ){
					alert("保存失败，请重新保存");
					return ; 
				}
				shipping.shipping_template_id = data.shipping_template_id ;
				var index = 0; 
				var message = ""; 
				angular.forEach(data.shipping_template_detail_ids,function(template_detail_id){
					if(template_detail_id !== "-1"){
						shipping.detail[index].shipping_template_detail_id = template_detail_id; 
					}else{
						message +=" "+(index+1)+""; 
					}
					index++;
				}); 
				if(message !== ""){
					alert("该表格中的第 "+message+"行未保存成功，请点击改行的保存按钮");
				}else{
					alert("保存成功"); 
					scope.input.isChanged[row] = false;  // 提交保存后 把该表单的 改变标志 变为 false 
				}

			}else{
				alert("保存失败，请重新点击保存按钮");
			}
			 
		}).catch(function(){
			alert('与服务器链接出现异常');
		});

	}


	// 显示城市选择框  修改  area 为 area对象 area_row 为在表格中的第几行  
	scope.areaUpdateClick = function(shipping_id,area,shippingTemplate_row,area_row,event){
		if( scope.cities == undefined ||  scope.cities.length ==0 ){
			scope.cities = cityFactory.province(scope.cities); 
		}
		var x = event.x - event.offsetX;
		var y = angular.element(event.target).parent()[0].offsetHeight - 10 ;
		scope.mouseClick.x = x ;
		scope.mouseClick.y = y ; 
		scope.dialog.currentBig = shippingTemplate_row+'-'+area_row; // 标记 显示城市选择对话框 
		 // scope.cities = cityFactory.cities;
		 if(area.regions == undefined ){
		 	area.regions = []; 
		 }
	}
	
    // 关闭 城市 选择 div 
	scope.areaDetailClose = function(event){
		scope.dialog.currentBig = -1; // 标记 关闭  城市选择对话框 
	}

    // 点击省份省份旁边的弹出 城市选择框 
    //   把已经选择的城市加入 
    scope.oneProvinceShow = function(event,shippingTemplate_row,area_row,parent_id){
    	scope.cities = cityFactory.city(scope.cities,parent_id); 
    	if ( scope.currentProvinceId == parent_id ){
    		scope.currentProvinceId = -1 ;
    	}else{
    		scope.currentProvinceId = parent_id;
    	}

    	if( scope.dialog.currentSmall == shippingTemplate_row+'-'+area_row+'-'+parent_id ){
    		scope.dialog.currentSmall = -1;
    	}else{
    		scope.dialog.currentSmall = shippingTemplate_row+'-'+area_row+'-'+parent_id;
    	}
    	// angular.element(event.target).next().css("display","block");
    }

	// 点击省份旁边弹出城市列表后 点击 确定 隐藏 
	scope.oneProvinceOk = function(event){
		angular.element(event.target).parent().css("display","none");
	}

	// 当一个省份被选中时 把该省的市加入 
	scope.provinceChange = function(province,isChecked,regions,shipping_row){
		scope.input.isChanged[shipping_row] = true;
		var parent_id =  parseInt(province.region_id);
		scope.cities = cityFactory.city(scope.cities,parent_id); 
		var index = 0;  
		var indexArray = [];
		// 把该省份下的已经加入的城市先 去掉 
		// var newOne = []; 
		scope.currentProvinceId = -1; 
		angular.forEach(regions,function(my){
			if( parseInt(my.parent_id) == parent_id ){
				indexArray.push(index);
			} 
			index++;
		});
		 
        index = 0; 
		angular.forEach(indexArray,function(i){
			regions.splice(i-index,1); 
			index++; 
		}); 
		
		//regions = newOne; 
		// 把该省份下的所有城市加入
		if(isChecked == true ){
			scope.currentProvinceId = parent_id; 
			angular.forEach(scope.cities,function(ct){
				if(parseInt(ct.parent_id) == parent_id){
					if(regions == undefined){
						regions = []; 
					}
				    regions.push(ct);
				}
             });
		}
		 
	}

	// scope.patternShow = function(form,name){
	// 	 return form.name.$error.pattern; 
	// }

	// 当选中一个城市时 把城市加入列表中 
	scope.cityChange = function(city,isChecked,regions,shipping_row){
		scope.input.isChanged[shipping_row] = true;
		var index = 0;
		// 先把该城市去掉 
		if(regions != undefined ){
			angular.forEach(regions,function(my){
			if(my.region_id == city.region_id ){
				regions.splice(index,1);
			}
			index++;
			});
		}
		
        if(isChecked){
        	if(regions == undefined ) {
        		regions = []; 
        	}
        	regions.push(city);
        }
	}

   
    // 判断该城市是否应该被选中  
	scope.isCityChecked = function(city,regions){
		var is = false;
		angular.forEach(regions,function(my){
			if(city.region_id == my.region_id){
				is = true;
				return ;
			}
		}) 
		return is;
	}

	// 新建一个 空的  shipping 
	scope.newOneShippingTemplateClick = function(){
		var newChange = []; 
		 angular.forEach(scope.input.isChanged,function(change,key){
		 	newChange[key+1] = change;
		 }); 
		 scope.input.isChanged = newChange; 
		if(scope.shippingTemplates == undefined ){
			scope.shippingTemplates  = [{'template_name':''}] ;
		}else{
			scope.shippingTemplates.unshift({'template_name':''});
		}
		
	}

	// 删除一个运费模板 
	scope.deleteOneShippingTemplateClick = function(shippings,shipping,shipping_row){
		var confim =  confirm("您确定要删除吗?");
		if(confim == false ) return;
		// 如果是新建的 还未保存则直接删除  
		if(shipping.shipping_template_id == undefined || shipping.shipping_template_id ==""){
			shippings.splice(shipping_row,1);
			scope.input.isChanged[shipping_row] = false;
			var newChange = [ ]; // 需要重新标记已经改变的表格的位置 
			angular.forEach(scope.input.isChanged,function(change,key){
				if(key < shipping_row ){
					newChange[key] = change;
				}else if(key > shipping_row) {
					newChange[key-1] = change; 
				}
			}); 
			scope.input.isChanged = newChange; 
		}else{  // 提交到服务器删除 
			var  data ={
				"shipping_template_id":shipping.shipping_template_id
			};
			// 提交到后台 
		  dropOneShipping.save(data).$promise
			 .then(function(data) {
					if(data.OK){
						 shippings.splice(shipping_row,1);
						 alert("删除成功");
						 scope.input.isChanged[shipping_row] = false; 
					}else{
						alert("删除失败");
					}
				}).catch(function(){
					alert('与服务器链接出现异常');
			}); // end 

		} // end  if else 

	}

	 // 点击 上一页的 事件 
	scope.prevPageClick = function(){
		 scope.currentPage--;
		 scope.offset = scope.offset - scope.limit;
		 scope.getShippingList(); // 从服务器加载数据 
	}

    // 点击 下一页的 事件  只有点击下一夜才需要在 pageArray 中 加入数据 
    scope.nextPageClick = function( ){
    	scope.offset = scope.offset + scope.limit;
    	scope.currentPage++; 
    	scope.getShippingList(); // 从服务器加载数据 
    }

     // 页面底部 分页 点击时跳转到该页 
	scope.pageClick = function(page){
		if(isNaN(page)) return;
		scope.offset = (page-1)*scope.limit; 
		scope.currentPage = page;
		scope.getShippingList(); // 从服务器加载数据 
	}

    // 点击 增加 增加一行 detail 数据  
	scope.addAreaClick = function(shipping){
		if(shipping.detail !== undefined ){
			shipping.detail.push({});
		}else{
			 shipping.detail =[];
		}
		
	}
}])
  // 根据类别 省 市 过滤 
.filter('typeFilter',function(){
	return function(data,type_id){
		var filterData = [];
		angular.forEach(data,function(obj){
			if(obj.region_type == type_id){
				filterData.push(obj);
			}
		});
		return filterData;
	}
})
  // 过滤出该省份下的所有城市 
.filter('cityFilter',function(){
	return function(data,parent){
		var filterData = [];
		angular.forEach(data,function(obj){
			if(obj.parent_id == parent){
				filterData.push(obj);
			}
		});
		return filterData;
	}
});
 
