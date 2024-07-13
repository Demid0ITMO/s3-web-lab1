<?php

header("Access-Control-Allow-Origin: *");
date_default_timezone_set(timezone_name_from_abbr("", $_GET['timezone']*60, false));
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $initialTime = microtime(true);
    $x = $_GET['x'];
    $y = $_GET['y'];
    $r = $_GET['r'];

    $previousData = $_SESSION['result_table'] ?? array();

    if (validate($x, $y, $r)) {
        $x = floatval($x);
        $y = floatval($y);
        $r = floatval($r);
        $result = isHit($x, $y, $r);
        $currentTime = date('H:i:s');
        $executionTime = number_format($initialTime - $_SERVER['REQUEST_TIME_FLOAT'], 6);

        $receivedData = [
            'x' => $x,
            'y' => $y,
            'r' => $r,
            'currentTime' => $currentTime,
            'executionTime' => $executionTime,
            'result' => $result
        ];

        $_SESSION['result_table'][] = $receivedData;

        http_response_code(200);
    } else {
        $error = [
            'message' => 'Неверные типы параметров или они не попадают в ограничения'
        ];

        header('Content-Type: application/json');
        echo json_encode($error);

        http_response_code(400);
    }
} else {
    http_response_code(400);
}

function validate($x, $y, $r) : bool {
    if (!(is_numeric($x) && is_numeric($y) && is_numeric($r))) return false;
    $x = floatval($x);
    $y = floatval($y);
    $r = floatval($r);
    if (!(-2 <= $x && $x <= 2)) return false;
    if (!(-5 <= $y && $y <= 5)) return false;
    if (!(2 <= $r && $r <= 5)) return false;
    return true;
}

function isHit($x, $y, $r): bool {
    if (inTriangle($x, $y, $r) || inRectangle($x, $y, $r) || inCircle($x, $y, $r)) return true;
    else return false;
}

function inRectangle($x, $y, $r) : bool {
    if (0 <= $x && $x <= $r && 0 <= $y && $y <= $r/2) return true;
    else return false;
}

function inTriangle($x, $y, $r) : bool {
    if (0 >= $x && 0 <= $y && $y <= $x + $r) return true;
    else return false;
}

function inCircle($x, $y, $r) : bool {
    if (0 <= $x && 0 >= $y && $x^2 + $y^2 <= ($r/2)^2) return true;
    else return false;
}