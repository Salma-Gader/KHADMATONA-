<?php

namespace App\Core\Localization\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolves the active locale as: the authenticated user's stored
 * preference, then the Accept-Language header, then the app's
 * configured fallback. Guests never need to send a header for the
 * fallback to work.
 */
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $supported = array_filter(explode(',', (string) env('SUPPORTED_LOCALES', 'fr')));

        $locale = $request->user()?->locale
            ?? $this->fromAcceptLanguage($request, $supported)
            ?? config('app.fallback_locale');

        if (in_array($locale, $supported, true)) {
            app()->setLocale($locale);
        }

        return $next($request);
    }

    private function fromAcceptLanguage(Request $request, array $supported): ?string
    {
        $preferred = $request->getPreferredLanguage($supported);

        return $preferred;
    }
}
