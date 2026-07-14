<?php

namespace App\Core\Auth\Http\Controllers;

use App\Core\Auth\Application\CreateUserAction;
use App\Core\Auth\Http\Requests\StoreUserRequest;
use App\Core\Auth\Http\Resources\UserResource;
use App\Core\Support\Http\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Admin management of *other* users' accounts - distinct from the /auth/*
 * endpoints, which are about the currently authenticated user's own
 * session. Simple CRUD (list + create only, per current scope), same
 * carve-out PropertyController uses for skipping a Service layer.
 */
class UserController
{
    public function __construct(private readonly CreateUserAction $createUser) {}

    public function index(Request $request): JsonResponse
    {
        $users = User::query()->with('roles')->paginate($request->integer('per_page', 15));

        return ApiResponse::success(
            UserResource::collection($users)->resolve(),
            ['pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]]
        );
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->createUser->execute($request->validated());

        return ApiResponse::success(new UserResource($user->load('roles')), status: 201);
    }
}
