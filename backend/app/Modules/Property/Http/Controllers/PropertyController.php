<?php

namespace App\Modules\Property\Http\Controllers;

use App\Core\Support\Http\ApiResponse;
use App\Modules\Property\Domain\Contracts\PropertyRepositoryInterface;
use App\Modules\Property\Domain\Models\Property;
use App\Modules\Property\Http\Filters\PropertyFilter;
use App\Modules\Property\Http\Requests\StorePropertyRequest;
use App\Modules\Property\Http\Requests\UpdatePropertyRequest;
use App\Modules\Property\Http\Resources\PropertyResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Simple CRUD only, per the current MVP scope - no Service/Action layer per
 * PROJECT_RULES.md §6's carve-out for modules with no business logic beyond
 * CRUD ("may skip the Service layer entirely and call the Repository
 * directly from the controller").
 */
class PropertyController
{
    public function __construct(private readonly PropertyRepositoryInterface $properties) {}

    public function index(Request $request, PropertyFilter $filter): JsonResponse
    {
        $properties = $filter->apply()->paginate($request->integer('per_page', 15));

        return ApiResponse::success(
            PropertyResource::collection($properties)->resolve(),
            ['pagination' => [
                'current_page' => $properties->currentPage(),
                'last_page' => $properties->lastPage(),
                'per_page' => $properties->perPage(),
                'total' => $properties->total(),
            ]]
        );
    }

    public function store(StorePropertyRequest $request): JsonResponse
    {
        [$attributes, $images] = $this->splitImages($request->validated());

        $property = $this->properties->create($this->toAttributes($attributes));
        $this->attachImages($property, $images);

        return ApiResponse::success(new PropertyResource($property->fresh()), status: 201);
    }

    public function show(Property $property): JsonResponse
    {
        return ApiResponse::success(new PropertyResource($property));
    }

    public function update(UpdatePropertyRequest $request, Property $property): JsonResponse
    {
        [$attributes, $images] = $this->splitImages($request->validated());

        $property = $this->properties->update($property, $this->toAttributes($attributes));
        $this->attachImages($property, $images);

        return ApiResponse::success(new PropertyResource($property->fresh()));
    }

    public function destroy(Property $property): JsonResponse
    {
        $this->properties->delete($property);

        return ApiResponse::success();
    }

    /**
     * Removes a single photo from a property's gallery without touching
     * the rest of the record - route-model-bound Media must actually
     * belong to the given Property, otherwise this 404s (implicit scoping
     * via the route's {property}/{media} nesting, checked explicitly here
     * since Spatie's Media model has no built-in route-scoping support).
     */
    public function destroyImage(Property $property, Media $media): JsonResponse
    {
        abort_unless($media->model_type === Property::class && $media->model_id === $property->id, 404);

        $media->delete();

        return ApiResponse::success();
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array{0: array<string, mixed>, 1: array<int, UploadedFile>}
     */
    private function splitImages(array $validated): array
    {
        $images = $validated['images'] ?? [];
        unset($validated['images']);

        return [$validated, $images];
    }

    /**
     * @param  array<int, UploadedFile>  $images
     */
    private function attachImages(Property $property, array $images): void
    {
        foreach ($images as $image) {
            $property->addMedia($image)->toMediaCollection('gallery');
        }
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function toAttributes(array $validated): array
    {
        // The API speaks MAD (decimal); the database stores integer cents
        // (PROJECT_RULES.md §13) - this is the one place that boundary is
        // crossed on the way in, mirroring PropertyResource on the way out.
        if (array_key_exists('price', $validated)) {
            $validated['price'] = (int) round($validated['price'] * 100);
        }

        return $validated;
    }
}
