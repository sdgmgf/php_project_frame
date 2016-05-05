<?php

/*
 * It is used for the Web Controller, extending CIController.
 * The name of the class must have first Character as Capital.
 *
**/
class CodeImg extends CI_Controller {
	function __construct() {
		parent :: __construct();
		$this->load->library('session');
		$this->load->library('Pager');
		$this->load->library('Helper');
		$this->load->model('order');
	}

	public function index() {
		
		if ($this->getInput("text") || $this->getInput("text") == 0)
			$text = $this->getInput("text");
		if ($this->getInput("format"))
			$format = $this->getInput("format");
		if ($this->getInput("quality"))
			$quality = $this->getInput("quality");
		if ($this->getInput("width"))
			$width = $this->getInput("width");
		if ($this->getInput("height"))
			$height = $this->getInput("height");
		if ($this->getInput("type"))
			$type = $this->getInput("type");
		if ($this->getInput("barcode"))
			$barcode = $this->getInput("barcode");

		if (!isset ($text))
			$text = 1;
		if (!isset ($type))
			$type = 1;
		if (empty ($quality))
			$quality = 100;
		if (empty ($width))
			$width = 240;
		if (empty ($height))
			$height = 120;
		if (!empty ($format))
			$format = strtoupper($format);
		else
			$format = "PNG";

		switch ($type) {
			default :
				$type = 1;
			case 1 :
				$this->Barcode39($barcode, $width, $height, $quality, $format, $text);
				break;
		}
	}

	//-----------------------------------------------------------------------------
	// Generate a Code 3 of 9 barcode
	//-----------------------------------------------------------------------------
	function Barcode39($barcode, $width, $height, $quality, $format, $text) {
		switch ($format) {
			default :
				$format = "JPEG";
			case "JPEG" :
				$this->output->set_header("Content-type: image/jpeg");
				break;
			case "PNG" :
				$this->output->set_header("Content-type: image/png");
				break;
			case "GIF" :
				$this->output->set_header("Content-type: image/gif");
				break;
		}
		$im = ImageCreate($width, $height) or die("Cannot Initialize new GD image stream");
		$White = ImageColorAllocate($im, 255, 255, 255);
		$Black = ImageColorAllocate($im, 0, 0, 0);
		//ImageColorTransparent ($im, $White);
		ImageInterLace($im, 1);

		$NarrowRatio = 20;
		$WideRatio = 55;
		$QuietRatio = 35;

		$nChars = (strlen($barcode) + 2) * ((6 * $NarrowRatio) + (3 * $WideRatio) + ($QuietRatio));
		$Pixels = $width / $nChars;
		$NarrowBar = (int) (20 * $Pixels);
		$WideBar = (int) (55 * $Pixels);
		$QuietBar = (int) (35 * $Pixels);

		$ActualWidth = (($NarrowBar * 6) + ($WideBar * 3) + $QuietBar) * (strlen($barcode) + 2);

		if (($NarrowBar == 0) || ($NarrowBar == $WideBar) || ($NarrowBar == $QuietBar) || ($WideBar == 0) || ($WideBar == $QuietBar) || ($QuietBar == 0)) {
			ImageString($im, 1, 0, 0, "Image is too small!", $Black);
			$this->OutputImage($im, $format, $quality);
			exit;
		}

		$CurrentBarX = (int) (($width - $ActualWidth) / 2);
		$Color = $White;
		$BarcodeFull = "*" . strtoupper($barcode) . "*";
		settype($BarcodeFull, "string");

		$FontNum = 3;
		$FontHeight = ImageFontHeight($FontNum);
		$FontWidth = ImageFontWidth($FontNum);
		if ($text != 0) {
			$CenterLoc = (int) (($width -1) / 2) - (int) (($FontWidth * strlen($BarcodeFull)) / 2);
			ImageString($im, $FontNum, $CenterLoc, $height - $FontHeight, "$BarcodeFull", $Black);
		} else {
			$FontHeight = -2;
		}

		for ($i = 0; $i < strlen($BarcodeFull); $i++) {
			$StripeCode = $this->Code39($BarcodeFull[$i]);

			for ($n = 0; $n < 9; $n++) {
				if ($Color == $White)
					$Color = $Black;
				else
					$Color = $White;

				switch ($StripeCode[$n]) {
					case '0' :
						ImageFilledRectangle($im, $CurrentBarX, 0, $CurrentBarX + $NarrowBar, $height -1 - $FontHeight -2, $Color);
						$CurrentBarX += $NarrowBar;
						break;

					case '1' :
						ImageFilledRectangle($im, $CurrentBarX, 0, $CurrentBarX + $WideBar, $height -1 - $FontHeight -2, $Color);
						$CurrentBarX += $WideBar;
						break;
				}
			}

			$Color = $White;
			ImageFilledRectangle($im, $CurrentBarX, 0, $CurrentBarX + $QuietBar, $height -1 - $FontHeight -2, $Color);
			$CurrentBarX += $QuietBar;
		}

		$this->OutputImage($im, $format, $quality);
	}

	//-----------------------------------------------------------------------------
	// Output an image to the browser
	//-----------------------------------------------------------------------------
	function OutputImage($im, $format, $quality) {
		switch ($format) {
			case "JPEG" :
				ImageJPEG($im, "", $quality);
				break;
			case "PNG" :
				ImagePNG($im);
				break;
			case "GIF" :
				ImageGIF($im);
				break;
		}
	}

	//-----------------------------------------------------------------------------
	// Returns the Code 3 of 9 value for a given ASCII character
	//-----------------------------------------------------------------------------
	function Code39($Asc) {
		switch ($Asc) {
			case ' ' :
				return "011000100";
			case '$' :
				return "010101000";
			case '%' :
				return "000101010";
			case '*' :
				return "010010100"; // * Start/Stop
			case '+' :
				return "010001010";
			case '|' :
				return "010000101";
			case '.' :
				return "110000100";
			case '/' :
				return "010100010";
			case '-' :
				return "010000101";
			case '0' :
				return "000110100";
			case '1' :
				return "100100001";
			case '2' :
				return "001100001";
			case '3' :
				return "101100000";
			case '4' :
				return "000110001";
			case '5' :
				return "100110000";
			case '6' :
				return "001110000";
			case '7' :
				return "000100101";
			case '8' :
				return "100100100";
			case '9' :
				return "001100100";
			case 'A' :
				return "100001001";
			case 'B' :
				return "001001001";
			case 'C' :
				return "101001000";
			case 'D' :
				return "000011001";
			case 'E' :
				return "100011000";
			case 'F' :
				return "001011000";
			case 'G' :
				return "000001101";
			case 'H' :
				return "100001100";
			case 'I' :
				return "001001100";
			case 'J' :
				return "000011100";
			case 'K' :
				return "100000011";
			case 'L' :
				return "001000011";
			case 'M' :
				return "101000010";
			case 'N' :
				return "000010011";
			case 'O' :
				return "100010010";
			case 'P' :
				return "001010010";
			case 'Q' :
				return "000000111";
			case 'R' :
				return "100000110";
			case 'S' :
				return "001000110";
			case 'T' :
				return "000010110";
			case 'U' :
				return "110000001";
			case 'V' :
				return "011000001";
			case 'W' :
				return "111000000";
			case 'X' :
				return "010010001";
			case 'Y' :
				return "110010000";
			case 'Z' :
				return "011010000";
			default :
				return "011000100";
		}
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

}
?>