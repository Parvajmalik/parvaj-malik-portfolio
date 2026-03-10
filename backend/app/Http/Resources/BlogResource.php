<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
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
            'author'         => $this->author,
            'featured_image' => $this->featured_image
                ? (str_starts_with($this->featured_image, 'http') ? $this->featured_image : asset('storage/' . $this->featured_image))
                : null,
            'excerpt'        => $this->excerpt,
            'content'        => $this->when($request->routeIs('blogs.show') || $request->user(), $this->content),
            'is_published'   => $this->is_published,
            'published_at'   => $this->published_at?->toDateString(),
            'created_at'     => $this->created_at->toDateTimeString(),
        ];
    }
}
