<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'slug'           => $this->slug,
            'category'       => $this->category,
            'featured_image' => $this->featured_image
                ? asset('storage/' . $this->featured_image)
                : null,
            'excerpt'        => $this->excerpt,
            'content'        => $this->when($request->routeIs('projects.show'), $this->content),
            'tech_stack'     => $this->tech_stack ?? [],
            'live_url'       => $this->live_url,
            'github_url'     => $this->github_url,
            'order'          => $this->order,
            'is_published'   => $this->is_published,
            'created_at'     => $this->created_at->toDateTimeString(),
        ];
    }
}
