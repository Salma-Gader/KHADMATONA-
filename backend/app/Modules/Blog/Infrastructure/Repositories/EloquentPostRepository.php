<?php

namespace App\Modules\Blog\Infrastructure\Repositories;

use App\Core\Support\Repositories\BaseRepository;
use App\Modules\Blog\Domain\Contracts\PostRepositoryInterface;
use App\Modules\Blog\Domain\Enums\PostStatus;
use App\Modules\Blog\Domain\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentPostRepository extends BaseRepository implements PostRepositoryInterface
{
    protected function model(): string
    {
        return Post::class;
    }

    public function paginateForAudience(bool $includeDrafts, int $perPage): LengthAwarePaginator
    {
        $query = Post::query()->latest('published_at');

        if (! $includeDrafts) {
            $query->where('status', PostStatus::Published)->where('published_at', '<=', now());
        }

        return $query->paginate($perPage);
    }
}
