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
            'slug'           => ['nullable', 'string', 'unique:projects,slug'],
            'category'       => ['nullable', 'string', 'max:100'],
            'excerpt'        => ['nullable', 'string'],
            'content'        => ['required', 'string'],
            'tech_stack'     => ['nullable', 'array'],
            'tech_stack.*'   => ['string'],
            'live_url'       => ['nullable', 'url'],
            'github_url'     => ['nullable', 'url'],
            'order'          => ['nullable', 'integer', 'min:0'],
            'is_published'   => ['boolean'],
            'featured_image' => ['nullable', 'string'],
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $project = Project::create($data);

        return response()->json(new ProjectResource($project), 201);
    }

    // PUT /api/projects/{id}  — admin only
    public function update(Request $request, Project $project): JsonResponse
    {
        $data = $request->validate([
            'title'          => ['sometimes', 'string', 'max:255'],
            'slug'           => ['sometimes', 'string', 'unique:projects,slug,' . $project->id],
            'category'       => ['nullable', 'string', 'max:100'],
            'excerpt'        => ['nullable', 'string'],
            'content'        => ['sometimes', 'string'],
            'tech_stack'     => ['nullable', 'array'],
            'tech_stack.*'   => ['string'],
            'live_url'       => ['nullable', 'url'],
            'github_url'     => ['nullable', 'url'],
            'order'          => ['nullable', 'integer', 'min:0'],
            'is_published'   => ['boolean'],
            'featured_image' => ['nullable', 'string'],
        ]);

        $project->update($data);

        return response()->json(new ProjectResource($project));
    }

    // DELETE /api/projects/{id}  — admin only
    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json(['message' => 'Project deleted.']);
    }
}
