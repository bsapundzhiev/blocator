<?php 

/**
* Channel proxy
*/
class Channel {

    private $service;
    private $messagePipe;

    function __construct($service) {
        $this->service = $service;
        $this->messagePipe= new MessagePipeLine();
    }

    function process($client, $message) {
        //var_dump($client);

        $this->service->sendMessage($client, $message);
    }

    private function sendMessageToMaster() {

    }

    private function broadCastMessage() {

    }

}

?>
