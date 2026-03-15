<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

// ── Health check ──────────────────────────────────────────────────────────────
Route::get('/', function () {
    return response()->json([
        'message'      => 'Welcome to Parvaj Malik Portfolio API',
        'owner'        => 'Parvaj Malik',
        'developer'    => 'Pradyumna Mahajan',
        'frontend_url' => 'https://parvajmalik.ibngroup.in',
        'status'       => 'working',
    ]);
});

// ── Auth ──────────────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('login',  [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me',      [AuthController::class, 'me']);
    });
});

// ── Public routes ─────────────────────────────────────────────────────────────
Route::get('blogs/{slug}',    [BlogController::class,    'show'])->name('blogs.show');
Route::get('blogs',           [BlogController::class,    'index']);
Route::get('projects/{slug}', [ProjectController::class, 'show'])->name('projects.show');
Route::get('projects',        [ProjectController::class, 'index']);

// ── Admin routes (Sanctum protected) ─────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Blog admin
    Route::get('admin/blogs',        [BlogController::class, 'all']);
    Route::post('admin/blogs',       [BlogController::class, 'store']);
    Route::put('admin/blogs/{blog}', [BlogController::class, 'update']);
    Route::delete('admin/blogs/{blog}', [BlogController::class, 'destroy']);

    // Project admin
    Route::get('admin/projects',           [ProjectController::class, 'all']);
    Route::post('admin/projects',          [ProjectController::class, 'store']);
    Route::put('admin/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('admin/projects/{project}', [ProjectController::class, 'destroy']);

    // CKEditor image upload
    Route::post('upload/image', [UploadController::class, 'image']);
});

