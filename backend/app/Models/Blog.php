<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'author',
        'featured_image',
        'excerpt',
        'content',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    // Auto-generate slug from title if not provided
    protected static function booted(): void
    {
        static::creating(function (Blog $blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title);
            }
            if ($blog->is_published && empty($blog->published_at)) {
                $blog->published_at = now();
            }
        });

        static::updating(function (Blog $blog) {
            if ($blog->is_published && empty($blog->published_at)) {
                $blog->published_at = now();
            }
        });
    }

    // Scope: only published records
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
