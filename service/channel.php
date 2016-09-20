<?php

class ChannelType {
    const SERVICE = 1;
    const CLIENT = 2;
};

/**
 * Channels
 */
class Channel
{
    private $type = ChannelType::CLIENT;
    private $client = null;

    function __construct($client) {
        $this->client = $client;
        if(strcasecmp ( $client->requestedResource , "/service" ) == 0){
            $this->type = ChannelType::SERVICE;
        }
    }

    function getType() {
        return $this->type;
    }

    function getClient() {
        return $this->client;
    }
}

/**
 * Channel proxy
 */
class ChannelProxy {

    private $channels = array();
    private $service  = null;
    private $messagePipe = null;
    private $commandExecuter = null;

    function __construct(&$service) {
        $this->service = $service;
        $this->messagePipe = new MessagePipeLine($this);
    }

    function process($client, $message) {
        //var_dump($client);
        try {
            $this->messagePipe->add($client->id, $message);
            $this->messagePipe->dispatch();
        } catch (Exception $e) {
            echo 'Channel process error: ',  $e->getMessage(), "\n";
        }
    }

    function add($client) {
        $this->channels[$client->id] = new Channel($client);
    }

    function remove($client) {
        $this->messagePipe->removeClient($client);
        unset($this->channels[$client->id]);
    }

    function getChannelByID($id) {

       return $this->channels[$client->id];
    }

    function sendMessage($clientID, $message) {

        //$channel = $this->channels[$clientID];
        foreach ($this->channels as $channel) {

            if ($channel->getType() ==  ChannelType::SERVICE) {
                $this->service->sendMessage($channel->getClient(), $message);
            }
        }
    }

    function broadCastMessage($message) {

        foreach ($this->channels as $channel) {
            $this->sendMessage($channel->getClient(), $message);
        }
    }
}

?>
