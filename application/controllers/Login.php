<?php
/*
 * It is used for the Web Controller, extending CIController.
 * The name of the class must have first Character as Capital.
 *
**/
class Login extends CI_Controller {
	function __construct()
	{
		parent::__construct();
 		// $this->load->helper('form');
        $this->load->helper('url');	
        $this->load->library('session');
      

	}

	public function index()
	{
		$url = $this->input->post('return_url');
        $return_url = substr($url,strrpos($url,'=')+1);

		$act = $this->input->post('act');
		$t = var_export("a",true);
		log_message('info', $act);
		
		if($act == "signin" ) {
			//redirect('../facade');
			if($this->checklogin()) {
				//redirect('../facade');
				if($return_url != null && $return_url != '/index.php') {
					redirect('..' . $return_url);
				} else {
					redirect('../facade');
				}
			}
			else {
				$this->load->view('login',array('info' => "用户名或密码错误，请重新登陆"));				
			}
			
		} else {
			$username = $this->session->userdata('username');
			if(isset($username)){
				redirect('../facade');
			}else{
				$this->load->view('login',array('info' => ""));
			}
			
		}
		
	}
	
	public function checklogin()
	{
        $_POST['username'] = isset($_POST['username']) ? trim($_POST['username']) : '';
        $_POST['password'] = isset($_POST['password']) ? trim($_POST['password']) : '';
               
		$this->load->library('RestApi');
		$result=$this->restapi->call("post",'/admin/login',array('username'=>$_POST['username'],'password'=>$_POST['password']));
		
	
		$result = json_decode($result,true);
		log_message('info', var_export($result,true));
		log_message('info', var_export(base_url(),true));
		
		if($result['result'] == 'ok' ) {
           $sessiondata = array(
                        'username'  => $_POST['username'],
                        'password'  => md5($_POST['password']),
                        'AccessToken' => $result['access_token'],
                        'action_list' => explode(',', $result['action_list']),
                        'facility_ids' => explode(',', $result['facility_ids']),
                       );
			$this->session->set_userdata($sessiondata);
			setcookie('AccessToken', $result['access_token'], $time = time() + 3600 * 5, '/', ".yqphh.com");
			setcookie('AccessType', 'shopadmin', $time = time() + 3600 * 5, '/', ".yqphh.com");
			return true;
		}               
        else {
           return false;
          // $this->load->view('login',array('info' => "用户名或密码错误，请重新登陆"));	
        }	  
 
	}
	
	public function logout()
	{
       /* 清除cookie */
	   foreach ($_COOKIE as $k => $v) {
	     	if ($k != 'OKTID')  	setcookie($k, '', 1, '/', "");
    	}		
		// $_SESSION = array();
		$this->session->sess_destroy();
		redirect('../login');
	}
}
?>
