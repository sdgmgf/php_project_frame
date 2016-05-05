<?php if (!defined('BASEPATH')) exit('No direct script access allowed'); 

class Inventorytransaction extends CI_Model {

    private $CI;
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
    
    public function createPurchaseTransaction($cond = array()){
        $out =  $this->helper->post("/admin/create_purchase_transaction",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    
    
    public function createSaleReturnTransaction($cond = array()){
        $out =  $this->helper->post("/admin/create_sale_return_transaction",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    public function createPackageInTransaction($cond = array()){
        $out =  $this->helper->post("/admin/create_package_in_transaction",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    
    public function createVarianceOutTransaction($cond = array()){
        $out =  $this->helper->post("/admin/create_variance_out_transaction",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    
    public function getInventoryTransactionProductList($cond = array()) {
        $out =  $this->helper->getInventory("/inventory/inventory_transaction_product_list",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    
    public function getInventoryTransactionProductContainerList($cond = array()) {
        $out =  $this->helper->getInventory("/inventory/inventory_transaction_product_container_list",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    
	public function getInventoryTransactionProductFacilityList($cond = array()) {
        $out =  $this->helper->getInventory("/inventory/inventory_transaction_product_facility_date",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }

    public function getInventoryTransactionProductFacilityBatchList($cond = array()) {
        $out =  $this->helper->getInventory("/inventory/inventory_transaction_product_facility_batch",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    
    public function getInventoryTransactionProductDetailList($cond = array(),$offset,$limit) {
        $cond['offset'] = $offset;
        $cond['size'] = $limit; 
        $out =  $this->helper->getInventory("/inventory/inventory_transaction_product_detail_list",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    
    public function getCanSaleProductList($cond = array()){
        $out =  $this->helper->get("/admin/can_sale_product_list",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    
    public function getCanSaleInventoryItemList($cond = array()){
        $out =  $this->helper->get("/admin/can_sale_inventory_item_list",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    
    public function getCanSaleReturnProductList($cond = array()){
        $out =  $this->helper->get("/admin/can_sale_return_product_list",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    
    public function createProductionOutTransaction($cond = array()){
        $out =  $this->helper->post("/admin/create_production_out_transaction",$cond); 
        $result = array();  
        if($this->helper->isRestOk($out)){
            $result['data'] = $out;
        }else{
            $result['error_info'] = $out['error_info'];
        }
        return $result; 
    }
    
}

  
