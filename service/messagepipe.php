<?php

/**
* Message pipe
*/
class MessagePipeLine 
{
    private $service; 
    private $qmsg = array();
    private $arrayUsers = array();

    function __construct($service) { 
        /*ILocatorService*/
        $this->service = $service;
    }

    private function decode($jsonStrMsg) {

        return json_decode($jsonStrMsg, true);
    }
 
    private function encode($arrMsg) {

        return json_encode($arrMsg);
    }
	
    function add($client, $jsonStrMsg) {

        $message = $this->decode($jsonStrMsg);
        if($message) {
            array_push($this->qmsg, new Message($client, $message));
        } else {
            throw new Exception("Unknown message received", 1);
        }
    }

    function dispatch() {

        $message = end($this->qmsg);
        //TODO: track users
        if($message->getType() > MessageType::SERVICE_CMD) {
            array_push($this->arrayUsers, $message->getUser());     
        }

        if($message->getType() == MessageType::SERVICE) {
            $this->sendMessage($message);              
        } else if($message->getType() == MessageType::SERVICE_CMD) {
            //TODO: commands
            $this->ping($message);

        } else if($message->getType() == MessageType::BROADCAST) {
            $this->broadCast($message);
        } else {
            //throw new Exception('Unknown message type');
            echo 'Unknown message type'. $message->getType();
        }

        $this->remove($message);

        echo "q: ".count($this->qmsg)."\n";
    }

    private function remove($message) {

        if (($key = array_search($message, $this->qmsg)) !== false) {
            unset($this->qmsg[$key]);
        }

    }

    private function broadCast($message) {

        foreach ($this->qmsg as $msg) {
            $this->sendMessage($message, $msg->getClient());
        }
    }

    private function sendMessage($message, $client = NULL) {
        $jsonString = $this->encode($message->getData());
        $this->service->sendMessage($client ? $client : $message->getClient(), $jsonString);  
    }

    //cmd 
    private function ping($message) {
        $data = $message->getData();
        $data['message'] = "PONG";
        $data['users'] = $this->arrayUsers;
        $serviceMessage = new Message(null, $data);
        $this->sendMessage($serviceMessage,$message->getClient());
    }
}
?>
