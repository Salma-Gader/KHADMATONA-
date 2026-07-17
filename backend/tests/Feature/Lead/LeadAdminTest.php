<?php

use App\Models\User;
use App\Modules\Lead\Domain\Models\Lead;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::findOrCreate('Admin');
    $this->admin = User::factory()->create();
    $this->admin->assignRole('Admin');

    $this->createLead = fn (array $overrides = []) => Lead::create(array_merge([
        'type' => 'contact',
        'status' => 'new',
        'name' => 'Test Lead',
        'email' => 'lead@example.com',
    ], $overrides));
});

test('a guest cannot list leads', function () {
    $this->getJson('/api/v1/leads')->assertStatus(401);
});

test('an authenticated user without the Admin role cannot list leads', function () {
    $nonAdmin = User::factory()->create();

    $this->actingAs($nonAdmin)->getJson('/api/v1/leads')->assertStatus(403);
});

test('an admin can list leads with full details', function () {
    ($this->createLead)(['name' => 'Yasmine El Amrani', 'phone' => '+212600000000']);

    $response = $this->actingAs($this->admin)->getJson('/api/v1/leads');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.status', 'new')
        ->assertJsonPath('data.0.phone', '+212600000000')
        ->assertJsonPath('meta.pagination.total', 1);
});

test('leads can be filtered by type and status', function () {
    ($this->createLead)(['type' => 'contact', 'status' => 'new']);
    ($this->createLead)(['type' => 'sell_request', 'status' => 'closed']);

    $byType = $this->actingAs($this->admin)->getJson('/api/v1/leads?filter[type]=sell_request');
    $byType->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.type', 'sell_request');

    $byStatus = $this->actingAs($this->admin)->getJson('/api/v1/leads?filter[status]=closed');
    $byStatus->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.status', 'closed');
});

test('an admin can view a single lead', function () {
    $lead = ($this->createLead)();

    $response = $this->actingAs($this->admin)->getJson("/api/v1/leads/{$lead->id}");

    $response->assertOk()->assertJsonPath('data.id', $lead->id);
});

test('an admin can update a lead status', function () {
    $lead = ($this->createLead)(['status' => 'new']);

    $response = $this->actingAs($this->admin)->patchJson("/api/v1/leads/{$lead->id}", [
        'status' => 'contacted',
    ]);

    $response->assertOk()->assertJsonPath('data.status', 'contacted');
    $this->assertDatabaseHas('leads', ['id' => $lead->id, 'status' => 'contacted']);
});

test('updating a lead status rejects an invalid value', function () {
    $lead = ($this->createLead)();

    $response = $this->actingAs($this->admin)->patchJson("/api/v1/leads/{$lead->id}", [
        'status' => 'archived',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['status']);
});

test('an admin can delete a lead', function () {
    $lead = ($this->createLead)();

    $response = $this->actingAs($this->admin)->deleteJson("/api/v1/leads/{$lead->id}");

    $response->assertOk();
    $this->assertSoftDeleted('leads', ['id' => $lead->id]);
});

test('a guest cannot update or delete a lead', function () {
    $lead = ($this->createLead)();

    $this->patchJson("/api/v1/leads/{$lead->id}", ['status' => 'closed'])->assertStatus(401);
    $this->deleteJson("/api/v1/leads/{$lead->id}")->assertStatus(401);
});
