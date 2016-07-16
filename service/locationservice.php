<?php

class LocationServiceException extends Exception { }

class LocationService {

    var $TempFileName;
    var $MaximumFileSize;
    var $logFileName;
    
    function  __construct()
    {
        $this->ValidExtensions = null;
        $this->SetLogName();
    }
    
    function LogMessage($message) 
    {
        $Date = date("Y-m-d H:i:s");
        $RemoteAddr = $_SERVER['REMOTE_ADDR'];
        $logMessage = "[$Date] ($RemoteAddr) $message\r\n";
        error_log($logMessage, 3, $this->logFileName);
    }

    
    function ValidateSize()
    {
        $MaximumFileSize = $this->MaximumFileSize;
        $TempFileSize = filesize($this->TempFileName);

        if($MaximumFileSize == "") {
            $this->LogMessage("WARNING There is no size restriction.");
            return $this;
        }

        if ($MaximumFileSize <= $TempFileSize) {
            throw new LocationServiceException("ERROR The file is too big. It must be less than $MaximumFileSize and it is $TempFileSize.");
        }

        return $this;
    }
    

    function SetLogName($log= NULL)
    {
        if(!$log) {
            $tmp = ini_get('upload_tmp_dir') ? ini_get('upload_tmp_dir') : sys_get_temp_dir ();
            $log = $tmp.dirname("/")."LocatorService.log";
        }
        
        $this->logFileName = $log;
    }
    

    function SetTempName($tempName) 
    {
        $this->TempFileName = sys_get_temp_dir().dirname("/").trim($tempName);
    }

    function SetMaximumFileSize($argv)
    {
        $this->MaximumFileSize = $argv;
    }

}

?>
