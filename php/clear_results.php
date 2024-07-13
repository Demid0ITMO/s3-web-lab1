<?php
session_start();

try {
    unset($_SESSION['result_table']);
    $success = ["message" => "Успешно"];
    header('Content-type: application/json');
    echo json_encode($success);
    http_response_code(200);
} catch (Exception $er) {
    $error = ["message" => "Что-то пошло не так"];
    header('Content-type: application/json');
    echo json_encode($error);
    http_response_code(500);
}