<?php
/*
 * It is used for the Web Controller, extending CIController.
 * The name of the class must have first Character as Capital.
 *
**/
class Menu extends CI_Controller {
	function __construct()
	{
		parent::__construct();
		$this->load->library('Helper'); 
	}

	public function index()
	{
		$this->load->view('menu');
	}
}
?>