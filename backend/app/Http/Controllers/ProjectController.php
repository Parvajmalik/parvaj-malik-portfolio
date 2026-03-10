<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    // GET /api/projects  — public, published only
    public function index(): JsonResponse
    {
        $projects = Project::published()
            ->orderBy('order')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(ProjectResource::collection($projects));
    }

    // GET /api/projects/all  — admin only, all records
    public function all(): JsonResponse
    {
        $projects = Project::orderBy('order')->get();

        return response()->json(ProjectResource::collection($projects));
    }

    // GET /api/projects/{slug}  — public
    public function show(string $slug): JsonResponse
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        return response()->json(new ProjectResource($project));
    }

    // POST /api/projects  — admin only
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'          => ['required', 'string', 'max:255'],
            'slug'           => ['nullable', 'string', 'max:255'],
            'category'       => ['nullable', 'string', 'max:100'],
            'excerpt'        => ['nullable', 'string'],
            'content'        => ['required', 'string'],
            'tech_stack'     => ['nullable', 'array'],
            'tech_stack.*'   => ['string', 'max:100'],
            'live_url'       => ['nullable', 'url', 'max:500'],
            'github_url'     => ['nullable', 'url', 'max:500'],
            'order'          => ['nullable', 'integer', 'min:0'],
            'is_published'   => ['boolean'],
            'featured_image' => ['nullable', 'string'],
        ]);

        $base = Str::slug(!empty($data['slug']) ? $data['slug'] : $data['title']);
        $data['slug']     = $this->uniqueSlug($base);
        $data['category'] = !empty($data['category']) ? $data['category'] : 'General';

        $project = Project::create($data);

        return response()->json(new ProjectResource($project), 201);
    }

    // PUT /api/projects/{id}  — admin only
    public function update(Request $request, Project $project): JsonResponse
    {
        $data = $request->validate([
            'title'          => ['sometimes', 'required', 'string', 'max:255'],
            'slug'           => ['nullable', 'string', 'max:255'],
            'category'       => ['nullable', 'string', 'max:100'],
            'excerpt'        => ['nullable', 'string'],
            'content'        => ['sometimes', 'required', 'string'],
            'tech_stack'     => ['nullable', 'array'],
            'tech_stack.*'   => ['string', 'max:100'],
            'live_url'       => ['nullable', 'url', 'max:500'],
            'github_url'     => ['nullable', 'url', 'max:500'],
            'order'          => ['nullable', 'integer', 'min:0'],
            'is_published'   => ['boolean'],
            'featured_image' => ['nullable', 'string'],
        ]);

        if (isset($data['slug'])) {
            $base = Str::slug($data['slug'] ?: ($data['title'] ?? $project->title));
            $data['slug'] = $this->uniqueSlug($base, $project->id);
        }
        if (array_key_exists('category', $data) && empty($data['category'])) {
            $data['category'] = 'General';
        }

        $project->update($data);

        return response()->json(new ProjectResource($project));
    }

    // DELETE /api/projects/{id}  — admin only
    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json(['message' => 'Project deleted.']);
    }

    private function uniqueSlug(string $base, ?int $excludeId = null): string
    {
        $slug = $base;
        $counter = 2;
        while (Project::where('slug', $slug)
            ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
            ->exists()
        ) {
            $slug = $base . '-' . $counter++;
        }
        return $slug;
    }
}
