<?php

namespace App\Modules\Settings\Infrastructure\Repositories;

use App\Core\Support\Repositories\BaseRepository;
use App\Modules\Settings\Domain\Contracts\SettingRepositoryInterface;
use App\Modules\Settings\Domain\Models\Setting;

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

        return $setting->fresh('translations');
    }
}
