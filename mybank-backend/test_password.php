<?php
// Simple password verification test
$password = 'Azerty1!';
$hash = '$2y$13$Dzexd2NGjpim4wGaJ1QofuoDikgqN1R0dHmMUnqzqF.S1wTivEMQy';
$result = password_verify($password, $hash);
echo 'Password verification result: ' . ($result ? 'SUCCESS' : 'FAILED') . PHP_EOL;
echo 'Hash: ' . $hash . PHP_EOL;
echo 'Password: ' . $password . PHP_EOL;
?>
