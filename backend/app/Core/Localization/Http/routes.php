<?php

use App\Core\Localization\Http\Controllers\I18nController;
use Illuminate\Support\Facades\Route;

Route::get('/i18n/{locale}', I18nController::class);
