<?php
session_start();

try {
    $previousData = $_SESSION['result_table'] ?? array();
    header('Content-type: application/json');
    echo json_encode($previousData);
    http_response_code(200);
} catch(Exception $er) {
    header('Content-type: application/json');
    echo json_encode(['message' => 'Что-то пошло не так']);
    http_response_code(500);
}