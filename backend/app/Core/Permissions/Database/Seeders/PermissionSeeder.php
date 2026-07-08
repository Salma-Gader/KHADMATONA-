<?php

namespace App\Core\Permissions\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Seeds only what the MVP needs: an Admin role and the permissions the
 * current modules (Property, Lead, Lookup, Settings) actually check.
 * Future roles (Agent, Owner, Client, Artisan, ...) are added later as
 * data, not as changes to this seeder's structure.
 */
class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Required by spatie/laravel-permission: a stale cached permission
        // list (e.g. warmed empty by an earlier request) would otherwise
        // shadow the rows this seeder is about to create.
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'access-admin-panel',
            'manage-properties',
            'manage-leads',
            'manage-lookups',
            'manage-settings',
            'manage-users',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        $admin = Role::findOrCreate('Admin');
        $admin->syncPermissions($permissions);
    }
}
