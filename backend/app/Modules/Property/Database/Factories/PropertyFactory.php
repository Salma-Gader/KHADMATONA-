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
            'image' => 'https://picsum.photos/seed/'.fake()->unique()->uuid().'/800/600',
        ];
    }
}
