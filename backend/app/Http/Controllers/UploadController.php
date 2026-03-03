<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * CKEditor-compatible image upload endpoint.
     *
     * CKEditor 5 sends: POST /api/upload/image  (multipart, field = "upload")
     * Expected response: { "url": "https://..." }
     *
     * Admin-only: protected by auth:sanctum in routes/api.php
     */
    public function image(Request $request): JsonResponse
    {
        $request->validate([
            'upload' => ['required', 'image', 'max:5120'],  // max 5 MB
        ]);

        $path = $request->file('upload')->store('uploads', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
    }
}
