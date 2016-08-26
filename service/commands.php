<?php
class CommandType {
    const SERVICE_CMD_PING = 2;
}

/**
 *  coomand iface
 */
interface ILocatorServiceCommand {
    public function execute($message);
    public function getType();
}
/**
 * Comand ping
 */
class PingCommand implements ILocatorServiceCommand {
    private $type;
    private $msgPipe;
    function __construct(&$msgService)
    {
        $this->type = CommandType::SERVICE_CMD_PING;
        $this->msgPipe = $msgService;
    }

    function execute($message) {

        $data = $message->getData();
        $data['message'] = "PONG";
        $data['users'] = $this->msgPipe->getUsers();
        $serviceMessage = new Message($message->getClient(), $data);
        return $serviceMessage;
    }

    function getType() {

        return $this->type;
    }
}

/**
 * command factory
 */
 class Commands
 {
    private $cmds = array();
    private $msgPipe;
    function __construct(&$service) {
        $this->msgPipe = $service;
    }

    /*ILocatorServiceCommand*/
    function add($icommand) {
        array_push($this->cmds, $icommand);
    }

    function exec($commandType, $message) {

        foreach ($this->cmds as $cmd) {
            if($cmd->getType() == $commandType) {
                $serviceMsg = $cmd->execute($message);
                $this->msgPipe->sendMessage($serviceMsg);
                break;
            }
        }
    }
 }

?>