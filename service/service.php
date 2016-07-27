
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
  //protected $maxBufferSize = (1024 * 1024); 
  private $chan = null;

  public function __construct($addr, $port)
  {
    parent::__construct($addr, $port);
    $this->chan = new Channel($this);
  }

  protected function process ($user, $message) {
    //$this->send($user, $message);
    $this->chan->process($user, $message);
  }

  protected function connected ($user) {
    // Do nothing: This is just an echo server, there's no need to track the user.
    // However, if we did care about the users, we would probably have a cookie to
    // parse at this step, would be looking them up in permanent storage, etc.
  }

  protected function closed ($user) {
    // Do nothing: This is where cleanup would go, in case the user had any sort of
    // open files or other objects associated with them.  This runs after the socket
    // has been closed, so there is no need to clean up the socket itself here.
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

$echo = new LocatorServer("0.0.0.0","9000");

try {
  $echo->run();
}
catch (Exception $e) {
  $echo->stdout($e->getMessage());
}
