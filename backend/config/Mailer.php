<?php
namespace GhostSec\Config;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer {
    private static $instance = null;
    private $mailer;

    private function __construct() {
        $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
        $dotenv->load();

        $this->mailer = new PHPMailer(true);
        
        // Server settings
        $this->mailer->isSMTP();
        $this->mailer->Host = $_ENV['SMTP_HOST'];
        $this->mailer->SMTPAuth = true;
        $this->mailer->Username = $_ENV['SMTP_USER'];
        $this->mailer->Password = $_ENV['SMTP_PASS'];
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port = $_ENV['SMTP_PORT'];
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function sendMail($to, $subject, $body, $from = null) {
        try {
            $this->mailer->clearAddresses();
            $this->mailer->clearAttachments();
            
            $this->mailer->setFrom($from ?? $_ENV['SMTP_USER']);
            $this->mailer->addAddress($to);
            
            $this->mailer->isHTML(true);
            $this->mailer->Subject = $subject;
            $this->mailer->Body = $body;
            
            return $this->mailer->send();
        } catch (Exception $e) {
            throw new \Exception("Message could not be sent. Mailer Error: {$this->mailer->ErrorInfo}");
        }
    }
}
