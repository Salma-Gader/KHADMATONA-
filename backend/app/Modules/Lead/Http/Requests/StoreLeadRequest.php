<?php

namespace App\Modules\Lead\Http\Requests;

use App\Modules\Lead\Domain\Enums\LeadType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(LeadType::class)],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            // Moroccan format: +212 or local 0-prefixed (PROJECT_RULES.md §11).
            'phone' => ['nullable', 'string', 'regex:/^(?:\+212|0)[5-7]\d{8}$/'],
            'message' => ['nullable', 'string', 'max:5000'],
            'property_id' => ['nullable', 'integer', 'exists:properties,id', 'required_if:type,visit_request'],
        ];
    }
}
