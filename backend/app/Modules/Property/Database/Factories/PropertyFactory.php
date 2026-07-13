<?php

namespace App\Modules\Property\Database\Factories;

use App\Modules\Property\Domain\Enums\PropertyStatus;
use App\Modules\Property\Domain\Enums\PropertyType;
use App\Modules\Property\Domain\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Property>
 */
class PropertyFactory extends Factory
{
    protected $model = Property::class;

    /**
     * Faker's fr_FR locale (APP_FAKER_LOCALE) doesn't know Moroccan
     * geography, so the city list is explicit here rather than generated.
     */
    private const CITIES = [
        'Marrakech', 'Casablanca', 'Rabat', 'Tanger', 'Agadir', 'Fès', 'Essaouira', 'Meknès',
    ];

    private const TITLES = [
        'appartement' => 'Appartement lumineux de :bedrooms chambres à :city',
        'villa' => 'Villa avec piscine à :city',
        'riad' => 'Riad traditionnel au cœur de :city',
        'maison' => 'Maison familiale à :city',
        'terrain' => 'Terrain constructible à :city',
        'bureau' => 'Bureau moderne à :city',
        'local' => 'Local commercial à :city',
    ];

    /**
     * Faker's paragraphs()/sentence() generate Latin lorem-ipsum text
     * regardless of locale (a Faker-wide quirk, not fr_FR-specific), so
     * property descriptions are composed from real French sentence
     * fragments instead.
     */
    private const DESCRIPTION_OPENERS = [
        'Idéalement situé(e) à :city, ce bien offre un cadre de vie exceptionnel.',
        'Rare sur le marché, ce bien se trouve dans un quartier calme et recherché de :city.',
        'Coup de cœur assuré pour ce bien lumineux au cœur de :city.',
        'Proche de toutes commodités, ce bien bénéficie d\'un emplacement privilégié à :city.',
    ];

    private const DESCRIPTION_DETAILS = [
        'Il dispose de :surface m² habitables, avec des finitions soignées et beaucoup de luminosité.',
        'L\'espace est optimisé sur :surface m², avec un agencement fonctionnel et lumineux.',
        'Sur :surface m², il séduit par ses volumes généreux et sa belle exposition.',
    ];

    private const DESCRIPTION_CLOSERS = [
        'Idéal pour une famille ou un investissement locatif.',
        'Une opportunité à ne pas manquer dans ce secteur prisé.',
        'Visite recommandée pour se rendre compte du potentiel des lieux.',
        'Parking et espace extérieur disponibles à proximité.',
    ];

    /**
     * Curated, individually-verified Unsplash photos (real photography,
     * Unsplash License - free to use) matching each property type, rather
     * than random unrelated placeholder images. One is picked at random
     * per property within its own type's pool for variety.
     */
    private const IMAGES = [
        'appartement' => [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
            'https://images.unsplash.com/photo-1554995207-c18c203602cb',
        ],
        'villa' => [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
            'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72',
        ],
        'riad' => [
            'https://images.unsplash.com/photo-1524230572899-a752b3835840',
            'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43',
        ],
        'maison' => [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
            'https://images.unsplash.com/photo-1464082354059-27db6ce50048',
        ],
        'terrain' => [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
        ],
        'bureau' => [
            'https://images.unsplash.com/photo-1497366216548-37526070297c',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
        ],
        'local' => [
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
            'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
        ],
    ];

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(PropertyType::cases());
        $city = fake()->randomElement(self::CITIES);
        $bedrooms = fake()->numberBetween(1, 6);
        $surface = fake()->numberBetween(45, 600);

        $title = strtr(self::TITLES[$type->value], [
            ':bedrooms' => $bedrooms,
            ':city' => $city,
        ]);

        $description = implode(' ', [
            strtr(fake()->randomElement(self::DESCRIPTION_OPENERS), [':city' => $city]),
            strtr(fake()->randomElement(self::DESCRIPTION_DETAILS), [':surface' => $surface]),
            fake()->randomElement(self::DESCRIPTION_CLOSERS),
        ]);

        return [
            'title' => $title,
            'type' => $type,
            'status' => fake()->randomElement(PropertyStatus::cases()),
            'city' => $city,
            'address' => fake()->streetAddress(),
            'price' => fake()->numberBetween(300_000, 8_000_000) * 100,
            'surface' => $surface,
            'bedrooms' => $bedrooms,
            'bathrooms' => fake()->numberBetween(1, max(1, min($bedrooms, 4))),
            'description' => $description,
            'image' => fake()->randomElement(self::IMAGES[$type->value]).'?w=1200&h=800&fit=crop&q=80',
        ];
    }
}
