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
        $this->commandExecuter = new Commands($this);
        $this->commandExecuter->add(new PingCommand($this));
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
        if(!array_key_exists($message->getClient(), $this->arrayUsers)) {
            $this->arrayUsers[$message->getClient()] = $message->getUser();
        }

        if($message->getType() == MessageType::SERVICE) {
            $this->sendMessage($message);
        } else if($message->getType() == MessageType::SERVICE_CMD) {
            //TODO: command type
            $this->commandExecuter->exec(MessageType::SERVICE_CMD, $message);
        } else if($message->getType() == MessageType::BROADCAST) {
            $this->broadCast($message);
        } else {
            //throw new Exception('Unknown message type');
            echo 'Unknown message type'. $message->getType();
        }

        $this->remove($message);
    }

    function removeClient($client) {
        if(array_key_exists($client->id, $this->arrayUsers)) {
           unset($this->arrayUsers[$client->id]);
        }
    }

    private function remove($message) {

        if (($key = array_search($message, $this->qmsg)) !== false) {
            unset($this->qmsg[$key]);
        }
    }

    public function broadCast($message) {
        $encoded = $this->encode($message->getData());
        $this->channel->broadCastMessage($encoded);
    }

    public function sendMessage($message) {
        $jsonString = $this->encode($message->getData());
        $this->channel->sendMessage($message->getClient(), $jsonString);
    }

    public function getUsers() {
        return $this->arrayUsers;
    }
}

?>
