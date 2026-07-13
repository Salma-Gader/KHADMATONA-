<?php

use App\Models\User;
use App\Modules\Property\Domain\Models\Property;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('a guest cannot list properties', function () {
    $this->getJson('/api/v1/properties')->assertStatus(401);
});

test('an authenticated user can list properties', function () {
    Property::factory()->count(3)->create();

    $response = $this->actingAs($this->user)->getJson('/api/v1/properties');

    $response->assertOk()->assertJsonCount(3, 'data');
});

test('the property list is paginated', function () {
    Property::factory()->count(20)->create();

    $response = $this->actingAs($this->user)->getJson('/api/v1/properties?per_page=5');

    $response->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonPath('meta.pagination.total', 20);
});

test('properties can be searched by title or city', function () {
    Property::factory()->create(['title' => 'Villa unique à Essaouira', 'city' => 'Essaouira']);
    Property::factory()->create(['title' => 'Appartement à Rabat', 'city' => 'Rabat']);

    $response = $this->actingAs($this->user)->getJson('/api/v1/properties?filter[search]=Essaouira');

    $response->assertOk()->assertJsonCount(1, 'data');
});

test('an authenticated user can create a property', function () {
    $payload = [
        'title' => 'Villa avec piscine à Marrakech',
        'type' => 'villa',
        'status' => 'disponible',
        'city' => 'Marrakech',
        'address' => 'Route de l\'Ourika',
        'price' => 3_500_000,
        'surface' => 320,
        'bedrooms' => 4,
        'bathrooms' => 3,
        'description' => 'Une magnifique villa.',
    ];

    $response = $this->actingAs($this->user)->postJson('/api/v1/properties', $payload);

    $response->assertCreated()
        ->assertJsonPath('data.title', $payload['title'])
        ->assertJsonPath('data.price', 3_500_000);

    $this->assertDatabaseHas('properties', [
        'title' => $payload['title'],
        'price' => 350_000_000, // stored as cents
    ]);
});

test('creating a property requires the mandatory fields', function () {
    $response = $this->actingAs($this->user)->postJson('/api/v1/properties', []);

    $response->assertStatus(422)->assertJsonValidationErrors(['title', 'type', 'city', 'address', 'price', 'surface']);
});

test('an authenticated user can view a single property', function () {
    $property = Property::factory()->create();

    $response = $this->actingAs($this->user)->getJson("/api/v1/properties/{$property->id}");

    $response->assertOk()->assertJsonPath('data.id', $property->id);
});

test('an authenticated user can update a property', function () {
    $property = Property::factory()->create(['status' => 'disponible']);

    $response = $this->actingAs($this->user)->putJson("/api/v1/properties/{$property->id}", [
        'title' => $property->title,
        'type' => $property->type->value,
        'status' => 'vendu',
        'city' => $property->city,
        'address' => $property->address,
        'price' => 1_000_000,
        'surface' => $property->surface,
    ]);

    $response->assertOk()->assertJsonPath('data.status', 'vendu');
    $this->assertDatabaseHas('properties', ['id' => $property->id, 'status' => 'vendu']);
});

test('an authenticated user can delete a property', function () {
    $property = Property::factory()->create();

    $response = $this->actingAs($this->user)->deleteJson("/api/v1/properties/{$property->id}");

    $response->assertOk();
    $this->assertSoftDeleted('properties', ['id' => $property->id]);
});
