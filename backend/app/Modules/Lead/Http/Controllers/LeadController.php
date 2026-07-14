<?php

namespace App\Modules\Lead\Http\Controllers;

use App\Core\Support\Http\ApiResponse;
use App\Modules\Lead\Domain\Contracts\LeadRepositoryInterface;
use App\Modules\Lead\Domain\Models\Lead;
use App\Modules\Lead\Http\Filters\LeadFilter;
use App\Modules\Lead\Http\Requests\UpdateLeadStatusRequest;
use App\Modules\Lead\Http\Resources\AdminLeadResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Admin-only side of the Lead module - simple CRUD, no Service layer, same
 * carve-out PropertyController uses (PROJECT_RULES.md §6). The public
 * capture endpoint lives separately in StoreLeadController.
 */
class LeadController
{
    public function __construct(private readonly LeadRepositoryInterface $leads) {}

    public function index(Request $request, LeadFilter $filter): JsonResponse
    {
        $leads = $filter->apply()->paginate($request->integer('per_page', 15));

        return ApiResponse::success(
            AdminLeadResource::collection($leads)->resolve(),
            ['pagination' => [
                'current_page' => $leads->currentPage(),
                'last_page' => $leads->lastPage(),
                'per_page' => $leads->perPage(),
                'total' => $leads->total(),
            ]]
        );
    }

    public function show(Lead $lead): JsonResponse
    {
        return ApiResponse::success(new AdminLeadResource($lead));
    }

    public function updateStatus(UpdateLeadStatusRequest $request, Lead $lead): JsonResponse
    {
        $lead = $this->leads->update($lead, $request->validated());

        return ApiResponse::success(new AdminLeadResource($lead));
    }

    public function destroy(Lead $lead): JsonResponse
    {
        $this->leads->delete($lead);

        return ApiResponse::success();
    }
}
