<?php

namespace App\Core\Auth\Application;

use App\Core\Auth\Domain\Contracts\UserRepositoryInterface;
use App\Models\User;

/**
 * Admin editing *someone else's* (or their own) account - mirrors
 * CreateUserAction's shape: a blank password leaves the existing hash
 * untouched (StoreUserRequest/UpdateUserRequest differ on whether password
 * is required), and role assignment is exclusive (syncRoles) rather than
 * additive (assignRole), so re-saving with a different role actually
 * replaces the old one instead of accumulating roles.
 */
class UpdateUserAction
{
    public function __construct(private readonly UserRepositoryInterface $users) {}

    /**
     * @param  array{name: string, email: string, password?: string|null, role: string}  $data
     */
    public function execute(User $user, array $data): User
    {
        $attributes = [
            'name' => $data['name'],
            'email' => $data['email'],
        ];

        if (! empty($data['password'])) {
            $attributes['password'] = $data['password'];
        }

        $user = $this->users->update($user, $attributes);
        $user->syncRoles([$data['role']]);

        return $user;
    }
}
