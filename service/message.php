<?php

class MessageType {
    const SERVICE = 1;
    const SERVICE_CMD = 2;
    const BROADCAST = 3;
};
/**
 * {
 *   type: integer,
 *   user: string,
 *   message: string
 * }
 */
class Message {
    /**
     * @var private
     */
    private $client = null;
    private $data = null;

    public function __construct($client, $data) {
        $this->client = $client;
        $this->data = $data;
    }

    public function getClient() {

        return $this->client;
    }

    public function getData() {

        return $this->data;
    }

    public function getType() {

        return $this->data['type'];
    }

    public function getUser() {

        return $this->data['user'];
    }

    public function getID() {

        return $this->data['id'];
    }
}

?>
