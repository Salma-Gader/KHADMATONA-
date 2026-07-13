<?php

use App\Modules\Property\Domain\Models\Property;

test('a guest can submit a contact lead', function () {
    $payload = [
        'type' => 'contact',
        'name' => 'Yasmine El Amrani',
        'email' => 'yasmine@example.com',
        'phone' => '+212600000000',
        'message' => "Je souhaite plus d'informations.",
    ];

    $response = $this->postJson('/api/v1/leads', $payload);

    $response->assertCreated()
        ->assertJsonPath('data.type', 'contact')
        ->assertJsonPath('data.name', $payload['name']);

    $this->assertDatabaseHas('leads', [
        'type' => 'contact',
        'email' => 'yasmine@example.com',
    ]);
});

test('a guest can submit a sell request', function () {
    $response = $this->postJson('/api/v1/leads', [
        'type' => 'sell_request',
        'name' => 'Karim Bennani',
        'email' => 'karim@example.com',
    ]);

    $response->assertCreated()->assertJsonPath('data.type', 'sell_request');
    $this->assertDatabaseHas('leads', ['type' => 'sell_request', 'email' => 'karim@example.com']);
});

test('a guest can submit a rent request', function () {
    $response = $this->postJson('/api/v1/leads', [
        'type' => 'rent_request',
        'name' => 'Sara Idrissi',
        'email' => 'sara@example.com',
    ]);

    $response->assertCreated()->assertJsonPath('data.type', 'rent_request');
    $this->assertDatabaseHas('leads', ['type' => 'rent_request', 'email' => 'sara@example.com']);
});

test('a guest can submit a visit request tied to a property', function () {
    $property = Property::factory()->create();

    $response = $this->postJson('/api/v1/leads', [
        'type' => 'visit_request',
        'name' => 'Omar Tazi',
        'email' => 'omar@example.com',
        'property_id' => $property->id,
    ]);

    $response->assertCreated()->assertJsonPath('data.type', 'visit_request');
    $this->assertDatabaseHas('leads', [
        'type' => 'visit_request',
        'property_id' => $property->id,
    ]);
});

test('a visit request without a property is rejected', function () {
    $response = $this->postJson('/api/v1/leads', [
        'type' => 'visit_request',
        'name' => 'Omar Tazi',
        'email' => 'omar@example.com',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['property_id']);
});

test('submitting a lead requires the mandatory fields', function () {
    $response = $this->postJson('/api/v1/leads', []);

    $response->assertStatus(422)->assertJsonValidationErrors(['type', 'name', 'email']);
});

test('submitting a lead rejects an invalid type', function () {
    $response = $this->postJson('/api/v1/leads', [
        'type' => 'not_a_real_type',
        'name' => 'Test',
        'email' => 'test@example.com',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['type']);
});

test('submitting a lead rejects a malformed phone number', function () {
    $response = $this->postJson('/api/v1/leads', [
        'type' => 'contact',
        'name' => 'Test',
        'email' => 'test@example.com',
        'phone' => '123',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['phone']);
});
