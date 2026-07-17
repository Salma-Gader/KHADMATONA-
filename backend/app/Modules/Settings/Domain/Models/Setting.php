<?php

namespace App\Modules\Settings\Domain\Models;

use App\Core\Localization\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasTranslations;

    /**
     * Single source of truth for which fields live in the translations
     * table rather than as a plain column - shared by SettingEditResource
     * (building the admin per-locale payload) and UpdateSettingRequest
     * (validating it).
     */
    public const TRANSLATABLE_FIELDS = [
        'address',
        'business_hours_weekdays',
        'business_hours_saturday',
        'hero_eyebrow',
        'hero_title_before',
        'hero_title_accent',
        'hero_title_after',
        'hero_subtitle',
        // Stat *values* are translatable too, not just their labels - the
        // Arabic figures use different digit/unit conventions than French/
        // English (e.g. "20+" vs "+20", "48h" vs "48 س"), not just a
        // translated label next to the same literal value.
        'stat1_value',
        'stat1_label',
        'stat2_value',
        'stat2_label',
        'stat3_value',
        'stat3_label',
        'stat4_value',
        'stat4_label',
    ];

    protected $fillable = [
        'contact_phone',
        'contact_email',
        'contact_whatsapp',
        'social_facebook',
        'social_instagram',
        'social_linkedin',
        'social_whatsapp',
    ];

    /**
     * There is always exactly one settings row - callers never look it up
     * by id, they just want "the" settings.
     */
    public static function current(): self
    {
        return static::query()->with('translations')->first() ?? static::create();
    }
}
