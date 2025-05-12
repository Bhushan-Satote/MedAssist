<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\Appointment;
use App\Notifications\AppointmentReminder;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            // Get current time
            $now = Carbon::now();

            // Define reminder windows (12h and 3h)
            $reminderWindows = [
                '12' => $now->copy()->addHours(12), // 12 hours from now
                '3' => $now->copy()->addHours(3),   // 3 hours from now
            ];

            foreach ($reminderWindows as $hoursBefore => $targetTime) {
                // Find appointments within a 10-minute window of the target time
                $appointments = Appointment::where('request_status', 'accepted')
                    ->where('appointment_status', 'scheduled')
                    ->whereRaw("STR_TO_DATE(CONCAT(appointment_date, ' ', start_time), '%Y-%m-%d %H:%i') BETWEEN ? AND ?", [
                        $targetTime->copy()->subMinutes(5),
                        $targetTime->copy()->addMinutes(5),
                    ])
                    ->with(['patient', 'doctor'])
                    ->get();

                foreach ($appointments as $appointment) {
                    // Send reminder notification
                    Notification::send($appointment->patient, new AppointmentReminder($appointment, $hoursBefore));
                }
            }
        })->everyTenMinutes(); // Run every 10 minutes to catch appointments in the window
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}