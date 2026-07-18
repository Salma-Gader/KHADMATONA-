<?php

namespace App\Modules\Settings\Infrastructure\Repositories;

use App\Core\Support\Repositories\BaseRepository;
use App\Modules\Settings\Domain\Contracts\SettingRepositoryInterface;
use App\Modules\Settings\Domain\Models\Setting;
use Illuminate\Support\Facades\Cache;

class EloquentSettingRepository extends BaseRepository implements SettingRepositoryInterface
{
    protected function model(): string
    {
        return Setting::class;
    }

    public function current(): Setting
    {
        return Setting::current();
    }

    public function updateCurrent(array $attributes, array $translations): Setting
    {
        $setting = $this->current();
        $setting->update($attributes);

        foreach ($translations as $locale => $fields) {
            foreach ($fields as $field => $value) {
                $setting->setTranslation($field, $locale, $value);
            }
        }

        // Setting::current() caches forever - without this, every public
        // page would keep serving the pre-update settings (contact info,
        // hero text, stats) until the cache happened to be cleared some
        // other way.
        Cache::forget(Setting::CACHE_KEY);

        return $setting->fresh('translations');
    }
}
