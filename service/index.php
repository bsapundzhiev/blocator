<?php 

require_once('locationservice.php');

$error_types = array( 
    //PHP extension errors
    1=>'EXTERROR The uploaded file exceeds the upload_max_filesize directive in php.ini.', 
    2=>'EXTERROR The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form.', 
    3=>'EXTERROR The uploaded file was only partially uploaded.', 
    4=>'EXTERROR No file was uploaded.', 
    6=>'EXTERROR Missing a temporary folder.', 
    7=>'EXTERROR Failed to write file to disk.', 
    8=>'EXTERROR A PHP extension stopped the file upload.' 
);

$service = new LocationService();
$service->SetTempName("LocationService.json");

$JSONresult = array('success'=>'', 'error' => '');

try {

    if(isset($_FILES['image'])) 
    {
        $JSONresult['success'] = "OK";    
    } 
    else {
        if(isset($_FILES['image']['error'])) {
            throw new LocationServiceException( $error_types[$_FILES['image']['error']] ) ;
        }
        else {
            throw new LocationServiceException("Service general error");
        }
    }

}
catch(LocationServiceException $e) {
    
    $JSONresult['error'] = $service->TempFileName;//$e->getMessage();
    //$service->LogMessage($JSONresult['error']);
}

echo json_encode($JSONresult, JSON_FORCE_OBJECT);
unset($error_types);
?>
