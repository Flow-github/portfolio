<?php

header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

$_POST = json_decode(file_get_contents("php://input"), true);

$texte = 'date : ' . date('Y-m-d H:i:s') . "\n";
$texte .= 'nom : ' . $_POST['name'] . "\n";
$texte .= 'prénom : ' . $_POST['firstName'] . "\n";
$texte .= 'mail : ' . $_POST['mail'] . "\n";
$texte .= 'message : ' . $_POST['message'] . "\n";
$texte .= "-------------- \n";

$fichier = fopen('message.txt', 'a+');
if($fichier){
	fwrite($fichier, $texte);
	fclose($fichier);
}

//echo $texte;