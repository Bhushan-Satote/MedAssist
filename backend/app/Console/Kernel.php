<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\Appointment;
use App\Notifications\AppointmentReminder;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            try {
                $now = Carbon::now();
                Log::info('Scheduler running', ['time' => $now->toDateTimeString()]);
                $reminderWindows = [
                    '12' => $now->copy()->addHours(12),
                    '3' => $now->copy()->addHours(3),
                ];

                foreach ($reminderWindows as $hoursBefore => $targetTime) {
                    $appointments = Appointment::where('request_status', 'accepted')
                        ->where('appointment_status', 'scheduled')
                        ->whereRaw("STR_TO_DATE(CONCAT(appointment_date, ' ', start_time), '%Y-%m-%d %H:%i:%s') BETWEEN ? AND ?", [
                            $targetTime->copy()->subMinutes(5),
                            $targetTime->copy()->addMinutes(5),
                        ])
                        ->whereDoesntHave('reminders', function ($query) use ($hoursBefore) {
                            $query->where('hours_before', $hoursBefore);
                        })
                        ->with(['patient', 'doctor'])
                        ->get();

                    Log::info('Appointments found for ' . $hoursBefore . '-hour reminder', [
                        'target_time' => $targetTime->toDateTimeString(),
                        'appointments' => $appointments->toArray(),
                    ]);

                    foreach ($appointments as $appointment) {
                        Log::info('Sending ' . $hoursBefore . '-hour reminder', ['appointment_id' => $appointment->id]);
                        Notification::send($appointment->patient, new AppointmentReminder($appointment, $hoursBefore));
                        \DB::table('appointment_reminders')->insert([
                            'appointment_id' => $appointment->id,
                            'hours_before' => $hoursBefore,
                            'sent_at' => $now,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]);
                    }
                }
            } catch (\Exception $e) {
                Log::error('Scheduler failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            }
        })->everyMinute(); // Temporary for testing
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}