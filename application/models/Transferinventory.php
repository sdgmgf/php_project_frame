<?php if (!defined('BASEPATH')) exit('No direct script access allowed'); 

// 处理订单相关的逻辑 为 订单控制器服务 
class Transferinventory extends CI_Model {

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
     
     public function addTransferInventory($params){
     	$out = $this->helper->post("/transferInventory/add",$params);
     	if($this->helper->isRestOk($out,'message')){
     		return 'success';
     	}
     	return $out['error_info'];
     }
     
     public function removeTransferInventory($ti_id){
     	$out = $this->helper->post("/transferInventory/remove/{$ti_id}");
     	if($this->helper->isRestOk($out,'message')){
     		return 'success';
     	}
     	return $out['error_info'];
     }
     
     public function getItemList($ti_id){
     	return $this->helper->get("/transferInventory/item/list/{$ti_id}");
     }
     
     public function getTransferInventoryList($cond,$offset,$limit){
     	if(empty($cond)){
     		$cond = array();
     	}
     	$cond['offset'] = $offset;
     	$cond['size'] = $limit;
     	$out =  $this->helper->get("/transferInventory/list",$cond);
     	$result = array();
     	if($this->helper->isRestOk($out)){
     		$result['data'] = $out['data'];
     	}else{
     		$result['error_info'] = $out['error_info'];
     	}
     	return $result;
     }
     
     public function getFacilityDiff($facility_id,$product_type) {
     	$out =  $this->helper->get("/transferInventory/facilityDiff/{$facility_id}/{$product_type}",array());
     	$result = array();
     	if($this->helper->isRestOk($out)){
     		$result['data'] = $out['data'];
     	}else{
     		$result['error_info'] = $out['error_info'];
     	}
     	return $result;
     }
     
     public function getTransferInventoryDetailList($cond,$offset,$limit){
     	if(empty($cond)){
     		$cond = array();
     	}
     	$cond['offset'] = $offset;
     	$cond['size'] = $limit;
     	$out =  $this->helper->get("/transferInventory/detail/list",$cond);
     	$result = array();
     	if($this->helper->isRestOk($out)){
     		$result['data'] = $out['data'];
     	}else{
     		$result['error_info'] = $out['error_info'];
     	}
     	return $result;
     }
     
     public function fixDiff($params){
     	return $this->helper->post("/transferInventory/fixDiff",$params);
     }
     
     public function transitVarianceIn($params) {
     	return $this->helper->post("/transferInventory/transitVarianceIn",$params);
     }
}