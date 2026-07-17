<?php

namespace App\Modules\Lead\Http\Controllers;

use App\Core\Support\Http\ApiResponse;
use App\Modules\Lead\Domain\Contracts\LeadRepositoryInterface;
use App\Modules\Lead\Http\Requests\StoreLeadRequest;
use App\Modules\Lead\Http\Resources\LeadResource;
use Illuminate\Http\JsonResponse;

/**
 * Single-action controller mirroring Core/Auth's style (LoginController,
 * RegisterController, ...) - capturing a lead is the module's only public
 * action for now, so no Service/Action layer per PROJECT_RULES.md §6's
 * CRUD-only carve-out.
 */
class StoreLeadController
{
    public function __construct(private readonly LeadRepositoryInterface $leads) {}

    public function __invoke(StoreLeadRequest $request): JsonResponse
    {
        $lead = $this->leads->create($request->validated());

        return ApiResponse::success(new LeadResource($lead), status: 201);
    }
}
