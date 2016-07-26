<?php

/**
* Message pipe
*/
class MessagePipeLine 
{
    
    private $qmsg = array();

    function __construct() { 
    // code...
    }

    function decode($jsonStrMsg) {

        return json_decode($jsonStrMsg);
    }
 
    function encode($arrMsg) {

        return json_encode($arrMsg);
    }
	
    function add($client, $message) {

        array_push($qmsg, new Message($client, decode($message)));
    }
}
?>
