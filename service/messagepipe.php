<?php

/**
* Message pipe
*/
class MessagePipeLine
{
    private $channel = null;
    private $qmsg = array();
    private $arrayUsers = array();

    function __construct(&$channel) {

        $this->channel = $channel;
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
            throw new Exception("Unknown message received");
        }
    }

    function dispatch() {

        $message = end($this->qmsg);
        //TODO: track users
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

        //echo "qmsg: ".count($this->qmsg)."\n";
    }

    private function remove($message) {

        if (($key = array_search($message, $this->qmsg)) !== false) {
            unset($this->qmsg[$key]);
        }
    }

    private function broadCast($message) {
        $encoded = $this->encode($message->getData());
        $this->channel->broadCastMessage($encoded);
    }

    private function sendMessage($message) {
        $jsonString = $this->encode($message->getData());
        $this->channel->sendMessage($message->getClient(), $jsonString);
    }

    //cmd
    private function ping($message) {
        $data = $message->getData();
        $data['message'] = "PONG";
        $data['users'] = $this->arrayUsers;
        $serviceMessage = new Message($message->getClient(), $data);
        $this->sendMessage($serviceMessage);
    }
}

?>
