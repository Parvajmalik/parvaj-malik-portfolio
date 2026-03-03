<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    protected $signature = 'admin:create
                            {--name=Admin : Admin display name}
                            {--email= : Admin email address}
                            {--password= : Admin password}';

    protected $description = 'Create the portfolio admin user (no registration endpoint needed)';

    public function handle(): int
    {
        $name     = $this->option('name');
        $email    = $this->option('email')    ?? $this->ask('Email address');
        $password = $this->option('password') ?? $this->secret('Password');

        if (User::where('email', $email)->exists()) {
            $this->warn("A user with email [{$email}] already exists.");

            if (! $this->confirm('Update their password?', false)) {
                $this->info('Aborted.');
                return self::SUCCESS;
            }

            User::where('email', $email)->update(['password' => Hash::make($password)]);
            $this->info("Password updated for [{$email}].");
            return self::SUCCESS;
        }

        User::create([
            'name'     => $name,
            'email'    => $email,
            'password' => Hash::make($password),
        ]);

        $this->info("Admin user created:");
        $this->table(['Name', 'Email'], [[$name, $email]]);
        $this->newLine();
        $this->comment('Login via POST /api/auth/login with { email, password }');

        return self::SUCCESS;
    }
}

