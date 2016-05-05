<?php

// 库存
class InventoryTransactionList extends CI_Controller {
    function __construct() {
      date_default_timezone_set("Asia/Shanghai");
      parent::__construct();
      $this->load->library('Pager'); 
      $this->load->model('common');
      $this->load->library('Excel'); 
      $this->load->model('productmodel');
      $this->load->model('inventorytransaction');
      $this->helper->chechActionList(array('inventoryTransactionList'),true);
    }
    
    public function getProductTypeList(){
    	$product_type_list =  array();
    	if($this->helper->chechActionList(array('wuliaoManager','caigouManager','transferManager'))) {
    		$item['product_type'] = 'goods';
    		$item['product_type_name'] = '商品';
    		$product_type_list[] = $item;
    	}
    	if($this->helper->chechActionList(array('suppliesInventoryManager', 'suppliesCaigouManager'))) {
    		$item['product_type'] = 'supplies';
    		$item['product_type_name'] = '耗材';
    		$product_type_list[] = $item;
    	}
    	return $product_type_list;
    }
    
    public function product_list() {
        $product_type_list = $this->getProductTypeList();
        if(empty($product_type_list)) {
            die("无查看库存权限");
        }
        $cond = $this->getQueryCondition();
        $facility_list = $this->common->getFacilityList();
        $facility_id = $this->getInput('facility_id');
        $product_type = $this->getInput('product_type');
        $inventory_type = $this->getInput('inventory_type');
        $end_time = $this->getInput('end_time');
        $inventory_status = $this->getInput('inventory_status');
        if (isset($facility_id)) {
            $cond['facility_id'] = $facility_id;
            foreach($facility_list['facility_list'] as $facility){
                if($facility['facility_id']==$facility_id){
                    $cond['facility_type']=$facility['facility_type'];
                    $facility_name=$facility['facility_name'];
                }
            }
        } else {
            $cond['facility_id'] = $facility_list['facility_list'][0]['facility_id'];
            $cond['facility_type'] = $facility_list['facility_list'][0]['facility_type'];
            $facility_name = $facility_list['facility_list'][0]['facility_name'];
        }
        
        if ( !isset($cond['product_type'])) {
            $cond['product_type'] = $product_type_list[0]['product_type'];
            $product_type_name = $product_type_list[0]['product_type_name'];
        }else{
            foreach($product_type_list as $productType){
                if($productType['product_type']==$product_type){
                    $product_type_name=$productType['product_type_name'];
                }
            }
        }
        if (!isset($cond['inventory_type'])) {
            $cond['inventory_type'] = "raw_material";
            $inventory_type_name = "原料";
        }else{
            if($inventory_type=='raw_material'){
                $inventory_type_name = "原料";
            }elseif($inventory_type=='finished'){
                $inventory_type_name = "包裹";
            }elseif($inventory_type=='bad'){
                $inventory_type_name = "坏果";
            }elseif($inventory_type=='defective'){
                $inventory_type_name = "次果";
            }
        }
        
        if (!isset($end_time)) {
            $end_time = date("YmdHis",time());
        } else {
            $end_time = date("YmdHis",strtotime($end_time));
        }
        if (!isset($inventory_status)) {
            $inventory_status_name = "暂存库";
        }else{
            if($inventory_status=='in_stock'){
                $inventory_status_name = "暂存库";
            }else{
                $inventory_status_name = "在途库";
            }
            
        }
        //导出excel
        if ($this->getInput('act') == "download") {
            
              $out = $this->inventorytransaction->getInventoryTransactionProductList($cond);
              $this->exportExcel($end_time,$out,$facility_name,$product_type_name,$inventory_type_name,$inventory_status_name);
              return ;
          }
        
        
        $out = $this->inventorytransaction->getInventoryTransactionProductList($cond);
        if (isset($out['error_info'])) {
            echo "查询失败" . $out['error_info'];
            die();
        }
        
        $cond['inventory_transaction_list'] = $out['data']['inventory_transaction_list'];
        $cond['product_type_list'] = $product_type_list;
        $cond['facility_list'] = $facility_list['facility_list'];
        $data = $this->helper->merge($cond); 
        $this->load->view('inventory_transaction_product_list',$data);
    }
    
    public function product_container_list() {
    	$cond = $this->getQueryCondition();
    	$cond['facility_id'] = $this->getInput('facility_id');
        $cond['product_id'] = $this->getInput('product_id');
        $out = $this->inventorytransaction->getInventoryTransactionProductContainerList($cond);
    	if (isset($out['error_info'])) {
    		echo json_encode($out);
    		exit;
    	}
    	echo json_encode(array("success"=>"success", "inventory_transaction_list" => $out['data']['inventory_transaction_list']));
    	exit;
    }
    
    public function product_detail_list() {
        $product_type_list = $this->getProductTypeList();
        if(empty($product_type_list)) {
            die("无查看库存权限");
        }
        $cond = $this->getQueryCondition();
        $facility_list = $this->common->getFacilityList();
        if (empty($facility_list)) {
            die("没有仓库权限");
        }
        $pallet_sn = $this->getInput('pallet_sn');
        if (isset($pallet_sn)) {
            $cond['pallet_sn'] = $pallet_sn;
        } else {
            $cond['pallet_sn'] = "";
        }
        $facility_id = $this->getInput('facility_id');
        if (isset($facility_id)) {
            $cond['facility_id'] = $facility_id;
        } else {
            $cond['facility_id'] = $facility_list['data'][0]['facility_id'];
        }
        $cond['product_id'] = $this->getInput('product_id');
        if (!$cond['product_id']) {
            $cond['product_id'] = 0;
        }
        if ( !isset($cond['product_type'])) {
            $cond['product_type'] = $product_type_list[0]['product_type'];
        }
        if ($cond['product_type'] == 'goods') {
            $cond['product_type_name'] = '商品';
            $cond['product_type_name2'] = '水果';
            $cond['product_type_name3'] = '好果';//不同的地方显示不同的词语，真是太坑了
        } else {
            $cond['product_type_name'] = '耗材';
            $cond['product_type_name2'] = '耗材';
            $cond['product_type_name3'] = '耗材';
        }
        if (! isset($cond['inventory_type'])) {
            $cond['inventory_type'] = "raw_material";
        }
        $offset = (intval($cond['page_current'])-1)*intval($cond['page_limit']);
        $limit = $cond['page_limit'];
        $out = $this->inventorytransaction->getInventoryTransactionProductDetailList($cond,$offset,$limit);
        if (isset($out['error_info'])) {
            echo "查询失败" . $out['error_info'];
            die();
        }
        $cond['product_type_list'] = $product_type_list;
        $cond['inventory_transaction_list'] = $out['data']['inventory_transaction_list'];
        $cond['quantity'] = $out['data']['quantity'];
        $cond['product_name'] = $out['data']['product_name'];
        $cond['facility_list'] = $facility_list['facility_list'];
        
        $record_total = $out['data']['total'];
        $page_count = $cond['page_current']+3;
        if(count($cond['inventory_transaction_list']) < $limit ){
            $page_count = $cond['page_current'];
        }
        if(!empty($record_total)){
            $cond['record_total'] = $record_total;
            $page_count = ceil($record_total / $limit );
        }
        $cond['page_count'] = $page_count;
        $cond['page'] = $this->pager->getPagerHtml($cond['page_current'],$page_count);
        
        $data = $this->helper->merge($cond); 
        $this->load->view('inventory_transaction_product_detail_list',$data);
    }
    private function getQueryCondition() {
    	$cond = array();
    	$start_time = $this->getInput('start_time');
        if (isset($start_time) && $start_time) {
        	$cond['start_time'] = $start_time;
        }
        
        $end_time = $this->getInput('end_time');
        if (isset($end_time) && $end_time) {
        	$cond['end_time'] = $end_time;
        }
        
        $transaction_type = $this->getInput('search_type');
        if(isset($transaction_type) && $transaction_type) {
        	$cond['transaction_type'] = $transaction_type;
        }
        
        $inventory_type = $this->getInput('inventory_type');
        if(isset($inventory_type) && $inventory_type) {
        	$cond['inventory_type'] = $inventory_type;
        } else {
        	$cond ['inventory_type'] = "raw_material";
        }
        
        $inventory_status = $this->getInput('inventory_status');
        if(isset($inventory_status) && $inventory_status) {
        	$cond['inventory_status'] = $inventory_status;
        } else {
        	$cond ['inventory_status'] = "in_stock";
        }
        
        $product_type = $this->getInput('product_type');
        if(isset($product_type)) {
        	$cond['product_type'] = $product_type;
        }
        
        $page_current = $this->getInput('page_current');
        if(!empty($page_current)) {
          $cond['page_current'] = $page_current;
        }else{
          $cond['page_current'] = 1;
        }
        $page_limit = $this->getInput('page_limit');    
        if(!empty($page_limit)) {
          $cond['page_limit'] = $page_limit;
        }else{
          $cond['page_limit'] = 50;
        }
        return $cond;
    }
    
     // 从 get 或 post 获取数据 优先从 post 没有返回 null 
    private function getInput($name) {
        $out = trim($this->input->post($name));
        if(isset($out) && $out!=""){
          return $out;
        }else{
          $out = trim($this->input->get($name));
          if(isset($out) && $out !="") return $out;
        }
        return null;
    }
    
   public function product_facility_date() {
    	$cond = $this->getQueryCondition();
    	$cond['facility_id'] = $this->getInput('facility_id');
        $cond['product_id'] = $this->getInput('product_id');
        $out = $this->inventorytransaction->getInventoryTransactionProductFacilityList($cond);
    	if (isset($out['error_info'])) {
    		echo json_encode($out);
    		exit;
    	}
    	echo json_encode(array("success"=>"success", "inventory_facility_date" => $out['data']['inventory_facility_date']));
    	exit;
    }


   public function product_facility_batch() {
        $cond = $this->getQueryCondition();
        $cond['facility_id'] = $this->getInput('facility_id');
        $cond['product_id'] = $this->getInput('product_id');
        $out = $this->inventorytransaction->getInventoryTransactionProductFacilityBatchList($cond);
        if (isset($out['error_info'])) {
            echo json_encode($out);
            exit;
        }
        echo json_encode(array("success"=>"success", "inventory_facility_date" => $out['data']['inventory_facility_date']));
        exit;
    }
    
   public function getProductList(){
   	$subTypes[] = array('subType'=>'raw_material');
   	$subTypes[] = array('subType'=>'finished');
   	$cond['subTypes'] = $subTypes;
   	$cond['product_type'] = $this->getInput('product_type');
   	$out = $this->productmodel->getGoodsProductBySubType($cond);
   	if($this->helper->isRestOk($out)) {
   		echo json_encode( array( 'success'=>'success', 'product_list' => $out['product_list']));
   	} else {
   		echo json_encode( array( 'success' => 'fail','error_info'=>!empty($out)?$out:'服务器内部错误' ) );
   	}
   }
   
   private function exportExcel($end_time,$out,$facility_name,$product_type_name,$inventory_type_name,$inventory_status_name){
      $head = array(
          '仓库',
          '仓库状态',
          '产品类型',
          '子类型',    
          'PRODUCT_ID',
        '商品名称',
        '仓储数量',
        '仓储锁定数量',
        '仓储单位',
        '明细数量',
        '明细锁定数量',
        '明细单位',);
      $body = array();
      if(isset($out['data'])){
          $orders = $out['data']['inventory_transaction_list'];
          foreach ($orders as $key => $order) {
            $body[$key][] = $facility_name;
            $body[$key][] = $inventory_status_name;
            $body[$key][] = $product_type_name;
            $body[$key][] = $inventory_type_name;
            $body[$key][] = $order['product_id'];
            $body[$key][] = $order['product_name'];
            $body[$key][] = $order['quantity'];
            $body[$key][] = $order['locked_quantity'];
            $body[$key][] = $order['container_unit_code_name'];
            $body[$key][] = $order['qoh'];
            $body[$key][] = $order['locked_qoh'];
            $body[$key][] = $order['unit_code_name'];
          }
      }
    $this->download($head,$body,$facility_name."库存列表", $end_time);
  }
  
     // 导出 excel 
    private function download($head,$body,$fileName, $fileTime){
        $excel =  $this->excel;
        $excel->addHeader($head);
        $excel->addBody( $body);
        $excel->downLoad($fileName, $fileTime);
    }

}
?>