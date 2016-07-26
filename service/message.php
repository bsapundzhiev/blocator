<?php 

class Message {
    /**
     * @var private
     */
    private $key = '';
    private $data = array();

    public function __construct($key, $data) {
        $this->key = $key;
        $this->data = $data;    
    }

    public function getKey() {
        return $this->key;
    }

}

?>
