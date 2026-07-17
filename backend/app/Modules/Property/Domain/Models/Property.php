<?php

namespace App\Modules\Property\Domain\Models;

use App\Core\Lookup\Domain\Models\City;
use App\Core\Lookup\Domain\Models\District;
use App\Core\Media\Concerns\HasMediaConversions;
use App\Modules\Property\Database\Factories\PropertyFactory;
use App\Modules\Property\Domain\Enums\PropertyStatus;
use App\Modules\Property\Domain\Enums\PropertyType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;

/**
 * City/District are Core reference data, not a peer business module -
 * PROJECT_RULES.md §3's "never import another module's class" applies to
 * business modules (Lead deliberately avoids a Property relation for this
 * reason), not to Core, which is meant to be depended on by every module.
 *
 * @use HasFactory<PropertyFactory>
 */
class Property extends Model implements HasMedia
{
    /** @use HasFactory<PropertyFactory> */
    use HasFactory, HasMediaConversions, SoftDeletes;

    protected $fillable = [
        'title',
        'type',
        'status',
        'city_id',
        'district_id',
        'address',
        'price',
        'surface',
        'bedrooms',
        'bathrooms',
        'description',
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

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    protected static function newFactory(): PropertyFactory
    {
        return PropertyFactory::new();
    }
}
