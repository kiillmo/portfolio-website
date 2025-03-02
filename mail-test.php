<?php
$result = mail("contact@mohamedelhag.com", "Test Email", "This is a test email from your server");
if($result) {
    echo "Mail sent successfully!";
} else {
    echo "Mail failed to send.";
}
?>