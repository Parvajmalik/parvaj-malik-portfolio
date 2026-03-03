<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'featured_image',
        'excerpt',
        'content',
        'tech_stack',
        'live_url',
        'github_url',
        'order',
        'is_published',
    ];

    protected $casts = [
        'tech_stack'   => 'array',
        'is_published' => 'boolean',
        'order'        => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Project $project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
