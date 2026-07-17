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
            // International, not Morocco-only: an optional leading "+" plus
            // digits/spaces/()/- for formatting, and 7-15 actual digits once
            // that formatting is stripped - matches the E.164 length range
            // (max 15 digits) without forcing any single country's format.
            'phone' => ['nullable', 'string', 'max:30', 'regex:/^\+?[0-9\s\-().]+$/', function (string $attribute, mixed $value, \Closure $fail) {
                $digitCount = strlen((string) preg_replace('/\D/', '', (string) $value));
                if ($digitCount < 7 || $digitCount > 15) {
                    $fail('The :attribute must be a valid phone number.');
                }
            }],
            'message' => ['nullable', 'string', 'max:5000'],
            'property_id' => ['nullable', 'integer', 'exists:properties,id', 'required_if:type,visit_request'],
        ];
    }
}
