<?php 

/**
* Channel proxy
*/
class Channel {

    private $messagePipe;

    function __construct($service) {
        
        $this->messagePipe = new MessagePipeLine($service);
    }

    function process($client, $message) {
        //var_dump($client);
        try {
            $this->messagePipe->add($client, $message);
            $this->messagePipe->dispatch();

        } catch (Exception $e) {
            echo 'Channel process error: ',  $e->getMessage(), "\n";
        }
    }
}

?>
