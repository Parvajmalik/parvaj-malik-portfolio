<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlogResource;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    // GET /api/blogs  — public, returns all published blogs
    public function index(): JsonResponse
    {
        $blogs = Blog::published()
            ->orderByDesc('published_at')
            ->get();

        return response()->json(BlogResource::collection($blogs));
    }

    // GET /api/blogs/all  — admin only, returns all (published + drafts)
    public function all(): JsonResponse
    {
        $blogs = Blog::orderByDesc('created_at')->get();

        return response()->json(BlogResource::collection($blogs));
    }

    // GET /api/blogs/{slug}  — public
    public function show(string $slug): JsonResponse
    {
        $blog = Blog::where('slug', $slug)->firstOrFail();

        return response()->json(new BlogResource($blog));
    }

    // POST /api/blogs  — admin only
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'slug'           => ['nullable', 'string', 'max:255'],
            'category'       => ['nullable', 'string', 'max:100'],
            'author'         => ['nullable', 'string', 'max:100'],
            'excerpt'        => ['nullable', 'string'],
            'content'        => ['required', 'string'],
            'is_published'   => ['boolean'],
            'published_at'   => ['nullable', 'date'],
            'featured_image' => ['nullable', 'string'],
        ]);

        $base = Str::slug(!empty($data['slug']) ? $data['slug'] : $data['title']);
        $data['slug']     = $this->uniqueSlug($base);
        $data['category'] = !empty($data['category']) ? $data['category'] : 'General';
        $data['author']   = !empty($data['author'])   ? $data['author']   : 'Parvej Malik';

        $blog = Blog::create($data);

        return response()->json(new BlogResource($blog), 201);
    }

    // PUT /api/blogs/{id}  — admin only
    public function update(Request $request, Blog $blog): JsonResponse
    {
        $data = $request->validate([
            'title'          => ['sometimes', 'required', 'string', 'max:255'],
            'slug'           => ['nullable', 'string', 'max:255'],
            'category'       => ['nullable', 'string', 'max:100'],
            'author'         => ['nullable', 'string', 'max:100'],
            'excerpt'        => ['nullable', 'string'],
            'content'        => ['sometimes', 'required', 'string'],
            'is_published'   => ['boolean'],
            'published_at'   => ['nullable', 'date'],
            'featured_image' => ['nullable', 'string'],
        ]);

        if (isset($data['slug'])) {
            $base = Str::slug($data['slug'] ?: ($data['title'] ?? $blog->title));
            $data['slug'] = $this->uniqueSlug($base, $blog->id);
        }
        if (array_key_exists('category', $data) && empty($data['category'])) {
            $data['category'] = 'General';
        }
        if (array_key_exists('author', $data) && empty($data['author'])) {
            $data['author'] = 'Parvej Malik';
        }

        $blog->update($data);

        return response()->json(new BlogResource($blog));
    }

    // DELETE /api/blogs/{id}  — admin only
    public function destroy(Blog $blog): JsonResponse
    {
        $blog->delete();

        return response()->json(['message' => 'Blog deleted.']);
    }

    private function uniqueSlug(string $base, ?int $excludeId = null): string
    {
        $slug = $base;
        $counter = 2;
        while (Blog::where('slug', $slug)
            ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
            ->exists()
        ) {
            $slug = $base . '-' . $counter++;
        }
        return $slug;
    }
}
