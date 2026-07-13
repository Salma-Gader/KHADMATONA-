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
        $property = $this->properties->create($this->toAttributes($request->validated()));

        return ApiResponse::success(new PropertyResource($property), status: 201);
    }

    public function show(Property $property): JsonResponse
    {
        return ApiResponse::success(new PropertyResource($property));
    }

    public function update(UpdatePropertyRequest $request, Property $property): JsonResponse
    {
        $property = $this->properties->update($property, $this->toAttributes($request->validated()));

        return ApiResponse::success(new PropertyResource($property));
    }

    public function destroy(Property $property): JsonResponse
    {
        $this->properties->delete($property);

        return ApiResponse::success();
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
