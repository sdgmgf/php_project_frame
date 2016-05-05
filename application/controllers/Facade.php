<?php
/*
 * It is used for the Web Controller, extending CIController.
 * The name of the class must have first Character as Capital.
 *
**/
class Facade extends CI_Controller {
	function __construct()
	{
		parent::__construct();
	}

	public function index()
	{
		$this->load->view('facade');
	}

	public function test($p1){
		$this->load->library('RestApi');
		$result=$this->restapi->call('tokenlalala','GET','/weixin_refund'/*'/Vainity/ikenie'*/,array('param'=>$p1));
		print_r($result);
	}
}
?>