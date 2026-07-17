<?php

namespace App\Modules\Settings\Database\Seeders;

use App\Modules\Settings\Domain\Models\Setting;
use Illuminate\Database\Seeder;

/**
 * Seeds the single settings row with the exact values that were previously
 * hardcoded (messages/*.json + literal tel:/mailto: links in site-footer.tsx
 * and contact/page.tsx), so switching those pages over to read from this
 * module doesn't change anything the site currently shows - it just makes
 * it editable going forward.
 */
class SettingsSeeder extends Seeder
{
    private const TRANSLATIONS = [
        'address' => [
            'fr' => 'Avenue Mohammed VI, Marrakech, Maroc',
            'en' => 'Avenue Mohammed VI, Marrakech, Morocco',
            'ar' => 'شارع محمد السادس، مراكش، المغرب',
        ],
        'business_hours_weekdays' => [
            'fr' => 'Lundi – Vendredi : 9h – 18h',
            'en' => 'Monday – Friday: 9am – 6pm',
            'ar' => 'الاثنين – الجمعة: 9 صباحًا – 6 مساءً',
        ],
        'business_hours_saturday' => [
            'fr' => 'Samedi : 9h – 13h',
            'en' => 'Saturday: 9am – 1pm',
            'ar' => 'السبت: 9 صباحًا – 1 ظهرًا',
        ],
        'hero_eyebrow' => [
            'fr' => 'Marrakech · Immobilier premium',
            'en' => 'Marrakech · Premium real estate',
            'ar' => 'مراكش · عقارات فاخرة',
        ],
        'hero_title_before' => [
            'fr' => 'Trouvez le',
            'en' => 'Find the',
            'ar' => 'اعثر على',
        ],
        'hero_title_accent' => [
            'fr' => 'bien',
            'en' => 'property',
            'ar' => 'العقار',
        ],
        'hero_title_after' => [
            'fr' => 'qui vous ressemble',
            'en' => 'that fits you',
            'ar' => 'الذي يناسبك',
        ],
        'hero_subtitle' => [
            'fr' => "KHADMATONA Group sélectionne et présente des biens d'exception à Marrakech — villas, riads, appartements — et vous accompagne dans chaque visite, vente ou location.",
            'en' => 'KHADMATONA Group selects and showcases exceptional properties in Marrakech — villas, riads, apartments — and guides you through every visit, sale or rental.',
            'ar' => 'تختار مجموعة خدماتنا وتعرض عقارات استثنائية في مراكش — فيلات، رياضات، شقق — وترافقكم في كل زيارة أو بيع أو كراء.',
        ],
        'stat1_value' => ['fr' => '20+', 'en' => '20+', 'ar' => '+20'],
        'stat1_label' => [
            'fr' => 'Biens en vitrine',
            'en' => 'Showcased properties',
            'ar' => 'عقار في الواجهة',
        ],
        'stat2_value' => ['fr' => '48h', 'en' => '48h', 'ar' => '48 س'],
        'stat2_label' => [
            'fr' => 'Délai moyen de réponse',
            'en' => 'Average response time',
            'ar' => 'متوسط زمن الاستجابة',
        ],
        'stat3_value' => ['fr' => '100%', 'en' => '100%', 'ar' => '100%'],
        'stat3_label' => [
            'fr' => 'Biens vérifiés',
            'en' => 'Verified properties',
            'ar' => 'عقارات موثوقة',
        ],
        'stat4_value' => ['fr' => '1', 'en' => '1', 'ar' => '1'],
        'stat4_label' => [
            'fr' => 'Ville, Marrakech, pour commencer',
            'en' => 'City, Marrakech, to start with',
            'ar' => 'مدينة، مراكش، للبداية',
        ],
    ];

    public function run(): void
    {
        $setting = Setting::current();

        $setting->update([
            'contact_phone' => '+212 5 00 00 00 00',
            'contact_email' => 'contact@khadmatona.ma',
            'contact_whatsapp' => null,
            // Placeholder handles, matching what site-footer.tsx already
            // hardcoded - swap for the real accounts once they exist.
            'social_facebook' => 'https://facebook.com/khadmatona',
            'social_instagram' => 'https://instagram.com/khadmatona',
            'social_linkedin' => 'https://linkedin.com/company/khadmatona',
            'social_whatsapp' => 'https://wa.me/212600000000',
        ]);

        foreach (self::TRANSLATIONS as $field => $locales) {
            foreach ($locales as $locale => $value) {
                $setting->setTranslation($field, $locale, $value);
            }
        }
    }
}
