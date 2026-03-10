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
        // Check if PHP itself dropped the file (upload_max_filesize exceeded)
        if ($request->hasFile('upload') === false && $request->getMethod() === 'POST') {
            return response()->json([
                'message' => 'Image is too large. Maximum allowed size is 5 MB.',
                'errors'  => ['upload' => ['Image is too large. Maximum allowed size is 5 MB.']],
            ], 422);
        }

        $request->validate([
            'upload' => ['required', 'file', 'extensions:jpg,jpeg,png,gif,webp,svg,bmp', 'max:5120'],
        ], [
            'upload.required'   => 'No image file was received.',
            'upload.file'       => 'The uploaded item is not a valid file.',
            'upload.extensions' => 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, SVG, BMP.',
            'upload.max'        => 'Image is too large. Maximum allowed size is 5 MB.',
        ]);

        $path = $request->file('upload')->store('uploads', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
        ]);
    }
}
