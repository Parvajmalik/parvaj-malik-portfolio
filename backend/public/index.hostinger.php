<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// On Hostinger, this file lives at: public_html/api/index.php
// Laravel app lives at: ~/laravel_app/ (two levels up from public_html/api/)

if (file_exists($maintenance = __DIR__.'/../../laravel_app/storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../../laravel_app/vendor/autoload.php';

$app = require_once __DIR__.'/../../laravel_app/bootstrap/app.php';

$app->handleRequest(Request::capture());
