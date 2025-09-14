<?php
// orcamento/processa-orcamento.php

// Configurações
$minDescriptionLength = 10;
$maxDescriptionLength = 500;
$maxRequestsPerHour = 5; // Limite de envios por IP
$adminEmail = 'seu-email@dominio.com'; // Seu email para receber os orçamentos

// Função para verificar palavras suspeitas
function containsSuspiciousContent($text)
{
  $suspiciousPatterns = [
    '/http(s)?:\/\//i',
    '/www\./i',
    '/\.(com|net|org|br)\b/i',
    '/[0-9]{5,}/',
    '/promo|ofert(a|as)|desconto|compre|venda|ganhe|grátis|barato|aproveite/i',
    '/@[^\s]+@/',
    '/bit\.ly|tinyurl|goo\.gl|shorturl/i'
  ];

  foreach ($suspiciousPatterns as $pattern) {
    if (preg_match($pattern, $text)) {
      return true;
    }
  }
  return false;
}

// Função para verificar limite de envios por IP
function checkRateLimit($ip, $limit)
{
  $filename = "rate_limit_$ip.txt";
  $currentTime = time();

  if (file_exists($filename)) {
    $lastRequestTime = file_get_contents($filename);
    $timeDiff = $currentTime - $lastRequestTime;

    // Se fez muitas requisições em menos de 1 hora
    if ($timeDiff < 3600 / $limit) {
      return false;
    }
  }

  // Atualizar registro
  file_put_contents($filename, $currentTime);
  return true;
}

// Função para validar e sanitizar dados
function sanitizeInput($data)
{
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

// Função para validar email
function isValidEmail($email)
{
  return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Função para enviar email
function sendBudgetEmail($formData)
{
  global $adminEmail;

  $subject = "Novo Orçamento Solicitado - " . $formData['name'];

  $message = "Novo orçamento solicitado através do site:\n\n";
  $message .= "Nome: " . $formData['name'] . "\n";
  $message .= "Email: " . $formData['email'] . "\n";
  $message .= "Telefone: " . $formData['phone'] . "\n";
  $message .= "Data do Evento: " . $formData['eventDate'] . "\n";
  $message .= "Produtos de Interesse: " . $formData['products'] . "\n";
  $message .= "Número de Convidados: " . $formData['guests'] . "\n";
  $message .= "Faixa de Orçamento: " . $formData['budgetRange'] . "\n";
  $message .= "Detalhes: " . $formData['details'] . "\n";

  $headers = "From: " . $formData['email'] . "\r\n";
  $headers .= "Reply-To: " . $formData['email'] . "\r\n";
  $headers .= "X-Mailer: PHP/" . phpversion();

  return mail($adminEmail, $subject, $message, $headers);
}

// Processamento do formulário
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $ip = $_SERVER['REMOTE_ADDR'];

  // Verificar rate limiting
  if (!checkRateLimit($ip, $maxRequestsPerHour)) {
    http_response_code(429);
    die("Muitas solicitações. Tente novamente mais tarde.");
  }

  // Verificar campos honeypot
  if (!empty($_POST['url']) || !empty($_POST['name2'])) {
    http_response_code(400);
    die("Requisição inválida.");
  }

  // Validar e sanitizar dados
  $name = sanitizeInput($_POST['name']);
  $email = sanitizeInput($_POST['email']);
  $phone = sanitizeInput($_POST['phone']);
  $eventDate = sanitizeInput($_POST['eventDate']);
  $products = sanitizeInput($_POST['products']);
  $guests = sanitizeInput($_POST['guests']);
  $budgetRange = sanitizeInput($_POST['budgetRange']);
  $details = sanitizeInput($_POST['details']);
  $captcha = sanitizeInput($_POST['captcha']);

  // Validar campos obrigatórios
  if (empty($name) || empty($email) || empty($phone) || empty($guests) || empty($budgetRange) || empty($captcha)) {
    http_response_code(400);
    die("Por favor, preencha todos os campos obrigatórios.");
  }

  // Validar email
  if (!isValidEmail($email)) {
    http_response_code(400);
    die("Por favor, insira um email válido.");
  }

  // Validar comprimento da descrição
  if (strlen($details) < $minDescriptionLength || strlen($details) > $maxDescriptionLength) {
    http_response_code(400);
    die("Descrição muito curta ou muito longa.");
  }

  // Verificar conteúdo suspeito
  if (containsSuspiciousContent($details)) {
    http_response_code(400);
    die("Conteúdo suspeito detectado.");
  }

  // Se passou por todas as validações, processar o orçamento
  $formData = [
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'eventDate' => $eventDate,
    'products' => $products,
    'guests' => $guests,
    'budgetRange' => $budgetRange,
    'details' => $details
  ];

  // Enviar email
  if (sendBudgetEmail($formData)) {
    // Redirecionar para página de sucesso
    header('Location: /obrigado.html');
    exit();
  } else {
    http_response_code(500);
    die("Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.");
  }
} else {
  http_response_code(405);
  die("Método não permitido.");
}
