<?php 
if (!defined('BASEPATH')) exit('No direct script access allowed'); 

/**
*  
*/
class Pager  
{
	/**
	 *  根据当前页数 和 总页数 返回 页面下方显示的 页面点击的 html 代码 
	 * @param  [type] $page_current [当前页]
	 * @param  [type] $page_count   [总页数]
	 * @return [type]               [html ]
	 */
	public function  getPagerHtml($page_current,$page_count){
		$i = 1;
	    $page = " "; 
	    for($i=1;$i < $page_current && $i<=3;$i++){    // 1 2 3 
	      $page .="<li> <a  class='page'  p={$i} href='#'>{$i} </a> </li>" ;
	    }
        // 不够 3 条 记录 就已经到 current 了 
	    if($i == $page_current ){
	      for($i = $page_current; $i < $page_current+3 && $i < $page_count;$i++){
	          if($i == $page_current ){
	            $page .="<li class='active'> <a class='page currentPage'  p={$i} href='#'>{$i}  </a> </li>" ;
	          }else{
	             $page .="<li> <a class='page'  p={$i} href='#'>{$i} </a> </li>" ;
	          }
	        }
	    }else{
	        $page.="<li><a href='#'>...</a></li>"; 
	        for($i = $page_current -1; $i < $page_current +2 && $i < $page_count;$i++){
	          if($i == $page_current ){
	            $page .="<li class='active'> <a class='page currentPage'  p={$i} href='#'>{$i} </a> </li>" ;
	          }else{
	             $page .="<li> <a class='page'  p={$i} href='#'>{$i} </a> </li>" ;
	          }
	        }
	    }
	    

	    if($i <= $page_count -1 ){ 
	        $page.="<li> <a href='#'> ... </a> </li>";
		    for($i = $page_count -1;$i <= $page_count;$i++){
		        if($i == $page_current ){
		            $page .="<li class='active'> <a class='page currentPage'  p={$i} href='#'>{$i} </a> </li>" ;
		          }else{
		            if($i > 1 )
		             $page .="<li> <a class='page'  p={$i} href='#'>{$i}</a> </li>" ;
		          }
		    }
	    }else{
	    	if($i == $page_current ){
	    		$page .="<li class='active'> <a class='page currentPage'  p={$i} href='#'>{$i} </a> </li>" ;
	    	}else{
	    		$page .="<li > <a class='page'  p={$i} href='#'>{$i} </a> </li>" ;
	    	}
	    } 
	    return $page;
	}

    // 获取分页 页数列表 
    public function  getPageArray($page_current,$page_count){
		$i = 1;
	    $page = array(); 
	    for($i=1;$i < $page_current && $i<=3;$i++){    // 1 2 3 
	      $page[] = $i;
	    }
        // 不够 3 条 记录 就已经到 current 了 
	    if($i == $page_current ){
	      for($i = $page_current; $i < $page_current+3 && $i < $page_count;$i++){
	          if($i == $page_current ){
	           $page[] = $i;
	          }else{
	            $page[] = $i;
	          }
	        }
	    }else{
	        $page[] = "...";
	        for($i = $page_current -1; $i < $page_current +2 && $i < $page_count;$i++){
	          if($i == $page_current ){
	            $page[] = $i;
	          }else{
	            $page[] = $i;
	          }
	        }
	    }
	    

	    if($i <= $page_count -1 ){ 
	        $page[] = '...';  
		    for($i = $page_count -1;$i <= $page_count;$i++){
		        if($i == $page_current ){
		           $page[] = $i;
		          }else{
		            if($i > 1 )
		            $page[] = $i;
		          }
		    }
	    }else{
	    	if($i == $page_current ){
	    		$page[] = $i;
	    	}else{
	    		$page[] = $i;
	    	}
	    } 
	    return $page;
	}
}


?>