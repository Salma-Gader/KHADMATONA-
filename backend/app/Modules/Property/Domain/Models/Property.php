<?php

namespace App\Modules\Property\Domain\Models;

use App\Modules\Property\Database\Factories\PropertyFactory;
use App\Modules\Property\Domain\Enums\PropertyStatus;
use App\Modules\Property\Domain\Enums\PropertyType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @use HasFactory<PropertyFactory>
 */
class Property extends Model
{
    /** @use HasFactory<PropertyFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'type',
        'status',
        'city',
        'address',
        'price',
        'surface',
        'bedrooms',
        'bathrooms',
        'description',
        'image',
    ];

    protected function casts(): array
    {
        return [
            'type' => PropertyType::class,
            'status' => PropertyStatus::class,
            'price' => 'integer',
            'surface' => 'integer',
            'bedrooms' => 'integer',
            'bathrooms' => 'integer',
        ];
    }

    protected static function newFactory(): PropertyFactory
    {
        return PropertyFactory::new();
    }
}
