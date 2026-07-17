<?php

// Every module's routes are wired here - the single, reviewable manifest
// of what endpoints exist, alongside bootstrap/providers.php for modules.
require __DIR__.'/../app/Core/Auth/Http/routes.php';
require __DIR__.'/../app/Core/Localization/Http/routes.php';
require __DIR__.'/../app/Core/Lookup/Http/routes.php';
require __DIR__.'/../app/Modules/Property/Http/routes.php';
require __DIR__.'/../app/Modules/Lead/Http/routes.php';
require __DIR__.'/../app/Modules/Lookup/Http/routes.php';
require __DIR__.'/../app/Modules/Settings/Http/routes.php';
require __DIR__.'/../app/Modules/Blog/Http/routes.php';
