<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::findOrCreate('Admin');
    $this->admin = User::factory()->create();
    $this->admin->assignRole('Admin');
});

test('a guest cannot list or create users', function () {
    $this->getJson('/api/v1/users')->assertStatus(401);
    $this->postJson('/api/v1/users', [])->assertStatus(401);
});

test('an authenticated user without the Admin role cannot list or create users', function () {
    $nonAdmin = User::factory()->create();

    $this->actingAs($nonAdmin)->getJson('/api/v1/users')->assertStatus(403);
    $this->actingAs($nonAdmin)->postJson('/api/v1/users', [])->assertStatus(403);
});

test('a role-authorization failure returns the standard API error envelope, not a raw exception', function () {
    $nonAdmin = User::factory()->create();

    $response = $this->actingAs($nonAdmin)->getJson('/api/v1/users');

    $response->assertStatus(403)->assertJson([
        'success' => false,
        'code' => 'forbidden',
    ])->assertJsonStructure(['success', 'message', 'errors', 'code']);
});

test('an admin can list users with their roles', function () {
    $response = $this->actingAs($this->admin)->getJson('/api/v1/users');

    $response->assertOk()
        ->assertJsonPath('data.0.email', $this->admin->email)
        ->assertJsonPath('data.0.roles.0', 'Admin');
});

test('an admin can create a user and assign a role', function () {
    $payload = [
        'name' => 'Nadia Fassi',
        'email' => 'nadia@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'role' => 'Admin',
    ];

    $response = $this->actingAs($this->admin)->postJson('/api/v1/users', $payload);

    $response->assertCreated()
        ->assertJsonPath('data.email', 'nadia@example.com')
        ->assertJsonPath('data.roles.0', 'Admin');

    $this->assertDatabaseHas('users', ['email' => 'nadia@example.com']);
    expect(User::where('email', 'nadia@example.com')->first()->hasRole('Admin'))->toBeTrue();
});

test('creating a user rejects a duplicate email', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/v1/users', [
        'name' => 'Duplicate',
        'email' => $this->admin->email,
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'role' => 'Admin',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['email']);
});

test('creating a user rejects an unknown role', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/v1/users', [
        'name' => 'Test',
        'email' => 'test@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
        'role' => 'SuperAdmin',
    ]);

    $response->assertStatus(422)->assertJsonValidationErrors(['role']);
});

test('an admin can list available roles', function () {
    $response = $this->actingAs($this->admin)->getJson('/api/v1/roles');

    $response->assertOk()->assertJsonFragment(['data' => ['Admin']]);
});
