<?php

namespace App\Modules\Lead\Http\Resources;

use App\Modules\Lead\Domain\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Admin-only view of a lead - unlike LeadResource (the public echo-back
 * used by the unauthenticated capture endpoint), this exposes every
 * column. Only ever returned from routes behind auth:sanctum + role:Admin.
 *
 * @mixin Lead
 */
class AdminLeadResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'status' => $this->status->value,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'message' => $this->message,
            'property_id' => $this->property_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
