<?php

class UserRole extends CI_Controller {
	function __construct() {
		parent::__construct();
		$this->load->library('Pager');
		$this->load->library('Helper');
	}

	public function index() {
		$cond = array();
		$user_id = $this->getInput("user_id");
		if(isset($user_id)){
			$out = $this->helper->get("/admin/adminUser/".$user_id);
			if($this->helper->isRestOk($out)){
				$cond['user'] = $out['user'];
			}
		}
		$data = $this->helper->merge($cond);
		$this->load->view('addUserRole',$data);
	}

	public function getdata() {
		$cond = array();
		$user_id = $this->getInput("user_id");
		if(isset($user_id)){
			$out = $this->helper->get("/admin/adminUser/".$user_id);
			if($this->helper->isRestOk($out)){
				$cond['user'] = $out['user'];
			}
		}
		
		$out = $this->helper->get("/admin/allfacilities"); 
	    if($this->helper->isRestOk($out)){
	    	$cond['facility_list'] = $out['facility_list'];
	    }else{
	    	$cond['facility_list'] = array();
	    }
	    
	    $out = $this->helper->get("/admin/area/list");
	    if($this->helper->isRestOk($out)){
	    	$cond['area_list'] = $out['area_list'];
	    }else{
	    	$cond['area_list'] = array();
	    }
	    
	    $out = $this->helper->get("/admin/roleList");
	    if($this->helper->isRestOk($out)){
	    	$cond['role_list'] = $out['role_list'];
	    }else{
	    	$cond['role_list'] = array();
	    }
        //title
	    $out = $this->helper->get("/admin/actionTitleList");
	    if($this->helper->isRestOk($out)){
	    	$cond['action_title_list'] = $out['action_title_list'];
	    }else{
	    	$cond['action_title_list'] = array();
	    }
	    //body
	    $out = $this->helper->get("/admin/actionBodyList");
	    if($this->helper->isRestOk($out)){
	    	$cond['action_body_list'] = $out['action_body_list'];
	    }else{
	    	$cond['action_body_list'] = array();
	    }


	    
	    $lists = $this->helper->get("/admin/shipping/enabled");
	    if( $this->helper->isRestOk($lists,'shipping_list') ){
	    	$cond['shipping_list'] = $lists['shipping_list'];
	    }else{
	    	$cond['shipping_list'] = array();
	    }
	    $cond['WEB_ROOT'] = $this->helper->getUrl();
		$data = $this->helper->merge($cond);
		// $data = (json_encode($data));
		echo json_encode($data);
		
	}
	
	public function userRoleList(){
		$con = $this->getCond();
		$con['offset'] = (intval($con['page_current'])-1)*intval($con['page_limit']);
		$con['size'] = $con['page_limit'];
		$out = $this->helper->get("/admin/userList", $con);
		$list = array();
		if( $this->helper->isRestOk($out,'user_list') ){
			$list = $out['user_list']['list'];
			$con['record_total'] = $out['user_list']['total'];
			$page_count = $con['page_current']+1;
			if( count($list) < $con['size'] ){
				$page_count = $con['page_current'];
			}
			if(!empty($record_total)){
				$con['record_total'] = $record_total;
				$page_count = ceil($record_total / $con['size'] );
			}
			$con['page_count'] = $page_count;
			$con['page'] = $this->pager->getPagerHtml($con['page_current'],$page_count);
		}else{
			if(isset($out['error_info'])){
				$con['error_info'] = $out['error_info'];
			}
		}
		
		$con['user_list'] = $list;
		//$con['WEB_ROOT'] = $this->helper->getUrl();
		$result = $this->helper->merge($con);
		$this->load->view('admin_user_list',$result);
	}

    public function updateUserStatus() {
        $con = array();
        $con['user_id'] = $this->getInput('user_id');
        $con['status'] = $this->getInput('status');
        $res = $this->helper->post("/admin/udpateUserStatus", $con);
        if ($this->helper->isRestOk($res)) {
            echo json_encode( array(
                    "success" => "true"
            ) );
        } else {
            echo json_encode( array(
                    "success" => "false",
                    "error_info" => $res['error_info'] ) );
        }
    }
	
	// 从页面获取查询条件 和 分页信息
	private function getCond(){
		$con = array();
		$name = $this->getInput('u_name');
		$name = trim($name);
		if(isset($name) && !empty($name)){
			$con['u_name'] = $name;
		}
		$con['offset'] = $this->getInput('offset');
		$con['size'] = $this->getInput('size');
		if(!isset($con['offset'])){
			$con['offset'] = 0;
		}
	
		if(!isset($con['size'])){
			$con['size'] = 20;
		}
	
		$con['page_current'] = $this->getInput('page_current');
		if(empty($con['page_current'])) {
			$con['page_current'] = 1;
		}
		$con['page_limit'] = $this->getInput('page_limit');
		if(empty($con['page_limit'])) {
			$con['page_limit'] = 2000;
		}
		return $con;
	}
	
	public function password(){
		$result['WEB_ROOT'] = $this->helper->getUrl();
		$this->load->view('user_password', $result);
	}
	
	public function passwordChange(){
		$record = array();
		$record['old_password'] = $this->getInput("old_password");
		$record['new_password'] = $this->getInput("new_password");
		$record['confirm_password'] = $this->getInput( "confirm_password");
		
		if($record['new_password'] != $record['confirm_password']){
			echo json_encode( array(
					"success" => "false",
					"error_info" => "新密码没有被确认！" ) );
		}else{
			$res = $this->helper->post("/admin/changePassword", $record);
			if($this->helper->isRestOk($res)){
				echo json_encode( array(
					"success" => "true" ) );
			}else{
				echo json_encode( array(
					"success" => "false",
					"error_info" => $res['error_info'] ) );
			}
		}
	}
	
	public function editUser(){
		$record = $this->getPostData();
		if(!isset($record['user_id']))
			$res = $this->helper->post("/admin/addUserRole", $record);
		else 
			$res = $this->helper->post("/admin/udpateUserRole", $record);
		$success = "false";
		if (!empty($res['user_id']) || (!empty($res['affected']) && $res['affected'] > 0)) {
			$success = "true";
			
			echo json_encode( array(
					"success" => $success
			) );
		} else {

			echo json_encode( array(
				    "res" => $res,
				    "record" => $record,
					"success" => $success,
					"error_info" => $res['error_info'] ) );
		}
	}
	
	public function getPostData() {
		$record = array();
		$user_id = $this->getInput("user_id");
		$temp = $this->input->post("facility_ids");
		$record['facility_ids']="";
		if(is_array($temp) && count($temp)>0){
			foreach($temp as $id){
				$record['facility_ids'] .= ($id.",");
			}
			$record['facility_ids'] = substr($record['facility_ids'], 0, strlen($record['facility_ids'])-1);
		}
        //quanxian
		$temp = $this->input->post("action_list");
		$record['action_list']="";
		if(is_array($temp) && count($temp)>0){
			foreach($temp as $id){
				$record['action_list'] .= ($id.",");
			}
			$record['action_list'] = substr($record['action_list'], 0, strlen($record['action_list'])-1);
		}
		
		$record['user_name'] = $this->getInput("user_name");
		if(!isset($user_id)){//仅仅在新建用户时，读取password
			$record['password'] = "888888";//$this->getInput( "password");
		}else{
			$record['user_id'] = $user_id;
		}
        $record['real_name'] = $this->getInput("real_name");
		$record['area_id'] = $this->getInput( "area_id");
		$shipping_id = $this->getInput( "shipping_id");
		if($shipping_id != 0 || isset($user_id))
			$record['shipping_id'] = $shipping_id;
		$temp = $this->input->post("role_ids");
		$record['role_ids'] = "";
		if(is_array($temp) && count($temp)>0){
			foreach($temp as $id){
				$record['role_ids'] .= ($id.",");
			}
			$record['role_ids'] = substr($record['role_ids'], 0, strlen($record['role_ids'])-1);
		}
		return $record ;
	}
	
	// 从 get 或 post 获取数据 优先从 post 没有返回 null
	private function getInput($name){
		$out = trim( $this->input->post($name) );
		if(isset($out) && $out!=""){
			return $out;
		}else{
			$out = trim($this->input->get($name));
			if(isset($out) && $out !="") return $out;
		}
		return null;
	}

	// 重置密码
	public function resetUserPassword() {
		$this->helper->chechActionList(array('resetUserPassword'),true);
        $con = array();
        $con['user_id'] = $this->getInput('user_id');
        $res = $this->helper->post("/admin/user/resetUserPassword", $con);
        if ($this->helper->isRestOk($res)) {
            echo json_encode(array("success" => "true"));
        } else {
            echo json_encode(array("success" => "false", "error_info" => $res['error_info']));
        }
    }
}
?>
