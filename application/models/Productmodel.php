<?php if (!defined('BASEPATH')) exit('No direct script access allowed'); 

class Productmodel extends CI_Model {

    private $CI  ;
    private $helper;
    function __construct(){
    	 parent::__construct();
    	 if(!isset($this->CI)){
            $this->CI = & get_instance();
        }
         if(!isset($this->helper)){
           $this->CI->load->library('Helper'); 
           $this->helper = $this->CI->helper;
        }
     }
  /*
   * getgoodsproduct 模块
   */
 public function getGoodsProduct($cond){
       $out = $this->helper->get('/admin/goodsproduct', $cond);
       if ($this->helper->isRestOk($out)) {
           $result['data'] = $out['data'];
       } else {
           $result['error_info']  = $out['error_info']; 
       }
       return $result;
  }
  
  /*
   * 申请商品档案
   */
  public function addGoodsApply($params) {
  	return $this->helper->post('/admin/addGoodsApply', $params);
  }
  /*
  * 申请商品档案列表list
  */
  public function goodsApplyList($params) {
    return $this->helper->get('/product/goodsApplyList', $params);
  }
  /*
   * 获取申请商品档案
   */
  public function goodsApply($params = null) {
  	return $this->helper->get('/admin/goodsApply', $params);
  }
  /*
   * 取消申请商品
   */
  public function removeGoodsApply($params) {
  	return $this->helper->post('/admin/removeGoodsApply', $params);
  }
  public function showProductList($cond) {
  	$out = $this->helper->get("/admin/product/list/show", $cond);
  	if($this->helper->isRestOk($out)){
  		$result['data'] = $out['data'];
  	}else{
  		$result['error_info'] = $out['error_info'];
  	}
  	return $result;
  }
  public function getPlatformList($params) {
  	return $this->helper->get("/product/getPlatformList", $params);
  }
  public function removeProduct($product_id){
  	return $this->helper->delete("/admin/product/".$product_id);
  }
  
  public function addProduct($params){
   	return $this->helper->post("/admin/product/new", $params);
  }
  
  public function addMapping($params){
  	$out = $this->helper->post("/admin/mapping/new", $params);
  	if( $this->helper->isRestOk($out, "mapping_id")){
  		echo json_encode(array("SUCCESS"=>"true"));
  	}else{
  		echo json_encode(array("error_info"=>$out['error_info']));
  	}
  }
  
  public function getMaterialProduct(){
  	$out = $this->helper->get("/admin/product/allMaterial");
  	$result = array();
  	if($this->helper->isRestOk($out)){
  		$result['list'] = $out['list'];
  	}else{
  		$result['error_info'] = $out['error_info'];
  	}
  	return $result;
  }
  
  public function getMerchantList($params) {
  	return $this->helper->get("/product/getMerchantList", $params);
  }
  
  public function getProductMapping($product_id, $mapping_type = null){
  	$params['mapping_type'] = $mapping_type;
  	$out = $this->helper->get('/admin/product/mapping/'.$product_id, $params);
  	$result = array();
  	if($this->helper->isRestOk($out)){
  		$result['product_mapping'] = $out['product_mapping'];
  	}else{
  		$result['error_info'] = $out['error_info'];
  	}
  	return $result;
  }
  
  public function getProductByID($product_id){
  	$out = $this->helper->get('/admin/product/'.$product_id);
  	$result = array();
  	if($this->helper->isRestOk($out)) {
  		$result['product'] = $out['product'];
  		$result['merchant_goods_ids'] = $out['merchant_goods_ids'];
  	} else {
  		$result['error_info'] = $out['error_info'];
  	}
  	return $result;
  }
  
  public function getGoodsProductBySubType($params) {
  	return $this->helper->post('/admin/product/goods/subTypes', $params);
  }
  
  public function editProduct($params){
  	return $this->helper->post('/admin/product/edit', $params);
  }
  // 更新状态
  public function checkProductStatus( $params ) {
    return $this->helper->post('/admin/product/check', $params );
  }
  public function getPurchasingUserList(){
  	$params = Array('action_name' => 'purchaseCommit');
  	return $this->helper->get('/admin/user/list/action',$params);
  }
  // 已弃用
  public function getUnBindGoodsListByMerchant($merchant_id ){
  	return $this->helper->get('/unBind/goods/list/merchant/'.$merchant_id);
  }
  
  public function getProductList($params){
  	return $this->helper->get('/admin/product/list', $params);
  }
  
  public function getSpecificationByProduct($product_id) {
  	return $this->helper->get('/admin/product/specification/'.$product_id);
  }
  
  public function getProductContainerList($product_id) {
  	return $this->helper->get('/admin/product/container/list/'.$product_id);
  }
  
  public function getStockUpProduct($po_id, $product_type) {
  	$params['product_type'] = $product_type;
  	$out = $this->helper->get("/admin/product/List/stockUp/".$po_id, $params);
  	if($this->helper->isRestOk($out)){
  		return $out['product_list'];
  	}
  	return null;
  }
  
  public function getProductPurchaseUserList($area_id){
    $params['area_id'] = $area_id;
  	return $this->helper->get('/admin/product/productPurchaseUserList', $params);
  }
  
  public function updateProductPurchase($cond){
  	$out = $this->helper->post('/admin/product/updateProductPurchase', $cond);
  	return $out;
  }
  
  public function productListForPrint($cond){
  	return $this->helper->get("/admin/product/forPrint",$cond);
  }
  
  public function getProductContainer($cond){
  	$out = $this->helper->get("/admin/productContainer", $cond);
  	if( $this->helper->isRestOk($out) ) {
  		return $out['containers'];
  	}
  	return null;
  }
  
  public function productListFromBatchPick($facility_id){
  	return $this->helper->get("/admin/product/fromBatchPick/".$facility_id);
  }
  
  public function searchProduct($product_name, $product_type, $product_sub_type){
  	$params = array();
  	if(!empty($product_name)) {
  		$params['product_name'] = $product_name;
  	}
  	if(!empty($product_type)) {
  		$params['product_type'] = $product_type;
  	}
  	if(!empty($product_sub_type)) {
  		$params['product_sub_type'] = $product_sub_type;
  	}
  	$out =  $this->helper->get("/admin/product/searchProduct",$params);
  	$product_list = $out['product_list'];
  	return  $product_list;
  }

	public function getFinishedProductListByFacilityID($facility_id) {
	   return $this->helper->get("/admin/product/finishedProductList/".$facility_id); 
	}
	
	public function getProductListByMerchant($merchant_id) {
		return $this->helper->get("/admin/product/list/merchant/".$merchant_id);
	}
  public function getProductListByMerchantProductName($merchant_id) {
  	$params['merchant_id'] = $merchant_id;
  	return $this->helper->get("/admin/product/list/merchantProductName", $params);
  }
  
  public function getProductPackageList($params) {
  	return $this->helper->get("/admin/productPackaging", $params);
  }
  
  public function getProductPackagingName($params) {
  	return $this->helper->get("/admin/productPackagingName", $params);
  }
  public function getFacilityAvaiableProducts($params) {
  	return $this->helper->get("/admin/product/list/facility_avaiable", $params);
  }

  public function getProductMappingAndGoodsMapping( $params, $offset, $limit ) {
    $params['offset'] = $offset;
    $params['size'] = $limit;
    return $this->helper->get("/admin/product/productMappingAndGoodsMapping", $params );
  }
  
  public function getProductUnit($params){//根据unit_code_type和product_type来获取unit
  	return $this->helper->get("/admin/product/productUnit",$params);
  }
  
  public function getProductFacilityShippingMappingGroupByFacility($product_id) {
  	return $this->helper->get("/product/getProductFacilityShippingMappingGroupByFacility/".$product_id);
  }
  
  public function getFacilityShippingListByProduct($product_id){
  	return $this->helper->get('/product/getFacilityShippingList/'.$product_id);
  }
  
  public function setProductFacilityShippingMapping($params) {
  	return $this->helper->post('/product/setProductFacilityShippingMapping', $params);
  }
  
  public function setProductShipping($params) {
  	return $this->helper->post('/product/setProductShipping', $params);
  }
  
  public function setDeliveryFacilityType($params) {
  	return $this->helper->post('/product/setDeliveryFacilityType', $params);
  }
  
  public function getProductShipping($product_id) {
  	return $this->helper->get('/product/getProductShipping/'.$product_id);
  }
  
  public function productPackagingBatchUpdate( $params) {
  	return $this->helper->post('/product/productPackaingBatchUpdate', $params);
  }
  
  public function productToInit($product_id) {
  	return $this->helper->post('/product/productToInit/'.$product_id);
  }
  
  public function productForceToInit($product_id) {
  	return $this->helper->post('/product/productForceToInit/'.$product_id);
  }
  
  public function getProductFacilityShippingList($params) {
  	return $this->helper->get('/product/prodcutFacilityShippingList', $params);
  }

  //获取商品覆盖区域选项(不允许跨区)
  public function getAreaProductDistrict($product_id){
    $out = $this->helper->get('/product/district/area/'.$product_id);
    if($this->helper->isRestOk($out)){
        echo json_encode(array("SUCCESS"=>"true","district_list"=>$out['data']));
    }else{
        echo json_encode(array("error_info"=>$out['error_info']));
    }
  }

    //获取商品覆盖区域选项(允许跨区)
    public function getAllProductDistrict($product_id){
        $out = $this->helper->get('/product/district/all/'.$product_id);
        if($this->helper->isRestOk($out)){
            echo json_encode(array("SUCCESS"=>"true","district_list"=>$out['data']));
        }else{
            echo json_encode(array("error_info"=>$out['error_info']));
        }
    }
   //获取当前商品覆盖区域
    public function getProductDistrict($product_id){
        $out = $this->helper->get('/product/district/current/'.$product_id);
        if($this->helper->isRestOk($out)){
            echo json_encode(array("SUCCESS"=>"true","district_list"=>$out['data']));
        }else{
            echo json_encode(array("error_info"=>$out['error_info']));
        }
  }

    //获取默认的商户覆盖区域
    public function getDefaultProductDistrict($product_id){
        $out = $this->helper->get('/product/district/default/'.$product_id);
        if($this->helper->isrestOk($out)){
            echo json_encode(array("SUCCESS"=>"true","district_list"=>$out['data']));
        }else{
            echo json_encode(array("error_info"=>$out['error_info']));
        }
    }

    //为商品添加默认的服务区域
    public function addDefaultProductDistrict($product_id){
        $params['product_id'] = $product_id;
        $out = $this->helper->post('/product/district/default',$params);
        if($this->helper->isRestOk($out)){
            echo json_encode(array("SUCCESS"=>"true"));
        }else{
            echo json_encode(array("error_info"=>$out['error_info']));
        }
    }


  //更新商品覆盖区域
  public function updateProductDistrict($params){
      $out = $this->helper->post('/product/district/update',$params);
      if($this->helper->isRestOk($out)){
          echo json_encode(array("SUCCESS"=>"true"));
      }else{
          echo json_encode(array("error_info"=>$out['error_info']));
      }
  }
  //获取Mapping中商品覆盖区域(格式化)
  public function getProductDistrictList($product_id){
      $out = $this->helper->get('/product/district/list/'.$product_id);
      if($this->helper->isRestOk($out)){
          echo json_encode(array("SUCCESS"=>"true","district_list"=>$out['data']));
      }else{
          echo json_encode(array("error_info"=>$out['error_info']));
      }
  }
  
  public function setSkuRegionShipping($params){
  	$out = $this->helper->post("/product/setSkuRegionShipping", $params);
  	if($this->helper->isRestOk($out)) {
  		return $out;
  	}else{
  		return array("success"=>"false","error_info"=>$out['error_info']);
  	}
  }
  
  public function getSkuRegionShippingList($product_id){
  	$out = $this->helper->get("/product/getSkuRegionShippingList/".$product_id);
  	if($this->helper->isRestOk($out)) {
  		return $out;
  	}else{
  		return array("success"=>"false","error_info"=>$out['error_info']);
  	}
  }


}
