<?php

namespace App\Modules\Property\Http\Requests;

use App\Modules\Property\Domain\Enums\PropertyStatus;
use App\Modules\Property\Domain\Enums\PropertyType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePropertyRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(PropertyType::class)],
            'status' => ['sometimes', Rule::enum(PropertyStatus::class)],
            'city_id' => ['required', 'integer', 'exists:cities,id'],
            'district_id' => ['nullable', 'integer', 'exists:districts,id'],
            'address' => ['required', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
            'surface' => ['required', 'integer', 'min:0'],
            'bedrooms' => ['sometimes', 'integer', 'min:0', 'max:255'],
            'bathrooms' => ['sometimes', 'integer', 'min:0', 'max:255'],
            'description' => ['nullable', 'string'],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
