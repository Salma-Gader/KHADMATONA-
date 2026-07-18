<?php

use App\Core\Auth\CoreAuthServiceProvider;
use App\Core\Localization\CoreLocalizationServiceProvider;
use App\Core\Lookup\CoreLookupServiceProvider;
use App\Core\Media\CoreMediaServiceProvider;
use App\Core\Permissions\CorePermissionsServiceProvider;
use App\Modules\Blog\BlogServiceProvider;
use App\Modules\Lead\LeadServiceProvider;
use App\Modules\Lookup\LookupServiceProvider;
use App\Modules\Property\PropertyServiceProvider;
use App\Modules\Settings\SettingsServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,

    // Core (cross-cutting, shared by every module)
    CoreAuthServiceProvider::class,
    CoreLocalizationServiceProvider::class,
    CoreLookupServiceProvider::class,
    CoreMediaServiceProvider::class,
    CorePermissionsServiceProvider::class,

    // MVP business modules
    PropertyServiceProvider::class,
    LeadServiceProvider::class,
    LookupServiceProvider::class,
    SettingsServiceProvider::class,
    BlogServiceProvider::class,
];
