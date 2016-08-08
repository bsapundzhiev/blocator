
<?php
require_once('./PHP-Websockets/users.php');
require_once('./PHP-Websockets/websockets.php');
/*service*/
require_once('./message.php');
require_once('./messagepipe.php');
require_once('./channel.php');

interface ILocatorService {
  public function sendMessage($user, $message);
}

class LocatorServer extends WebSocketServer implements ILocatorService {
  protected $maxBufferSize = 4096;
  protected $logFile       = "log.txt";
  private   $chan          = null;

  public function __construct($addr, $port)
  {
    parent::__construct($addr, $port);
    $this->chan = new ChannelProxy($this);
  }

  protected function process ($user, $message) {
    //$this->send($user, $message);
    $this->chan->process($user, $message);
  }

  protected function connected ($user) {
    $this->chan->add($user);
  }

  protected function closed ($user) {
    $this->chan->remove($user);
  }

  protected function checkHost($hostName) {

    //$this->stdout($hostName);
    return true; // Override and return false if the host is not one that you would expect.
                 // Ex: You only want to accept hosts from the my-domain.com domain,
                 // but you receive a host from malicious-site.com instead.
  }
  //ILocatorService
  public function sendMessage($user, $message) {
    $this->send($user, $message);
  }

}

class Program {
    private static $service = null;
    public static function main($args) {
        try {
          self::$service = new LocatorServer("0.0.0.0", "9000");
          //self::$service->log("Sever started");
          /*$fd = @fopen("pidfile.pid", "w");
          if($fd) {
            fwrite($fd, getmypid());
            fclose($fd);
          }*/
          self::$service->run();
        }
        catch (Exception $e) {
          self::$service->stdout($e->getMessage());
          self::$service->log($e->getTraceAsString());
        }
    }
}

Program::main($argv);

?>