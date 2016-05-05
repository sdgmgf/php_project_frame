<?php if (!defined('BASEPATH')) exit('No direct script access allowed'); 

class Helper {

	 
    private $CI  ;
    private $restapi;
    private $systemParams;
    function __construct(){
        if(!isset($this->CI)){
            $this->CI = & get_instance();
        }
        if(!isset($this->restapi)){
           $this->CI->load->library('RestApi'); 
           $this->restapi = $this->CI->restapi;
        }

        if(!isset($this->systemParams)){
             $this->systemParams = array("WSAPI_URL"=>$this->CI->config->item('wsapi_url'),
                                "WEB_ROOT" =>$this->getWebRoot()
                                ); 
        }

        
     }
    
    public function getSystemParams(){
        return $this->systemParams; 
    }
    
    // 判断调用 restapi 是否返回正确的结果 
    public function isRestOk($out,$name=""){
      if( !isset($name) || $name ==""){
        return $out["result"] == "ok";
      }else{
        return  $out["result"] == "ok" && isset($name);
      }
    }

    // 把数据数组 和 系统参数数组合并 
    public function merge($data){
        return array_merge($this->getSystemParams(), $data);
    }
    
    // 打印日志 
    public function log($data){
        log_message('info', var_export($data,true));
    }
    
    public function getInventory($path,$fields=array()){
       return json_decode( $this->restapi->call("get",$path,$fields, 'inventory_url'), true  );
    }
    
    public function get($path,$fields=array()){
       return json_decode( $this->restapi->call("get",$path,$fields), true  );
    }

    public function getJson($path,$fields=array()){
       return json_decode( $this->restapi->call("get",$path,$fields), true  );
    }

    
    public function post($path,$fields=array()){
       return json_decode( $this->restapi->call("post",$path,$fields), true  );
    }

    public function delete($path,$fields=array()){
       return json_decode( $this->restapi->call("delete",$path,$fields), true  );
    }

    public function put($path,$fields=array()){
       return json_decode( $this->restapi->call("put",$path,$fields), true  );
    }
    
      // 从 get 或 post 获取数据 优先从 post 没有返回 null 
    public function getInput($name){
      $out = trim( $this->input->post($name) );
      if(isset($out) && $out!=""){
        return $out;
      }else{
        $out = trim($this->input->get($name));
        if(isset($out) && $out !="") return $out;
      }
      return null;
    }
    

     public function token( )
    {
    	$CI =& get_instance();
    	$CI->load->library('session'); 
    	 $sessiondata = array(
                        'W-ACCESS-TOKEN' => 'TEST-TOKEN-SINRI',
                        "AccessType"=>"shopadmin"
                       );           
        $CI->session->set_userdata($sessiondata);
	}	 


	public function getWebRoot(){
        $WEB_ROOT = substr(realpath(dirname(__FILE__).'/../../'), strlen(realpath($_SERVER['DOCUMENT_ROOT'])));
        if (trim($WEB_ROOT, '/\\')) {
            $WEB_ROOT = '/'.trim($WEB_ROOT, '/\\').'/';
        } else {
            $WEB_ROOT = '/';
        }
        $WEB_ROOT = str_replace("\\", "/", $WEB_ROOT);
        return $WEB_ROOT; 
    } 
    
    
    public function getUrl(){
    	return "http://" . $_SERVER['SERVER_NAME'] . "/";
    }
    
    public function chechActionList($action_list,$needDie=false) {
        $CI =& get_instance();
        $CI->load->library('session'); 
        $default_password = md5('888888');
        $user_password = $CI->session->userdata('password');
        $dieString = '无 ';
        if($default_password == $user_password) {
            return false;
        }
        if (in_array('all', $CI->session->userdata('action_list'))) {
            return true;
        }
        foreach ($action_list as $action) {
            if (in_array($action, $CI->session->userdata('action_list'))) {
                return true;
            }
        } 
        if($needDie){
            foreach($action_list as $action) {
                $out = $this->get("/admin/user/getActionNameByActionCode", array( 'action_code' => $action ));
                $dieString .= $out['action_name'].' ';
            }
            die($dieString."权限");
        }else{
            return false;
        }
	}

	public function isAllFacilityAction() {
    	$CI =& get_instance();
    	$CI->load->library('session'); 
        $default_password = md5('888888');
        $user_password = $CI->session->userdata('password');
        if($default_password == $user_password) {
            return false;
        }


		if (in_array('all', $CI->session->userdata('facility_ids'))) {
			return true;
		}
		return false;
	}
 
}

 