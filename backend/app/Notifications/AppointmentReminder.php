<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Appointment;

class AppointmentReminder extends Notification implements ShouldQueue
{
    use Queueable;

    protected $appointment;
    protected $hoursBefore;

    public function __construct(Appointment $appointment, $hoursBefore)
    {
        $this->appointment = $appointment;
        $this->hoursBefore = $hoursBefore;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
{
    return (new MailMessage)
        ->subject('Appointment Reminder: ' . $this->hoursBefore . ' Hours to Go')
        ->greeting('Hello ' . $this->appointment->patient->patient->first_name . ',')
        ->line('This is a reminder for your upcoming appointment.')
        ->line('Doctor: ' . $this->appointment->doctor->doctor->first_name . ' ' . $this->appointment->doctor->doctor->last_name)
        ->line('Date: ' . $this->appointment->appointment_date->format('Y-m-d'))
        ->line('Time: ' . $this->appointment->start_time . ' - ' . $this->appointment->end_time)
        ->line('Notes: ' . ($this->appointment->notes ?? 'None'))
        ->action('View Appointment', url('/dashboard/appointments'))
        ->line('Please arrive on time. Thank you for using MedAssist!');
}

public function toArray($notifiable)
{
    return [
        'appointment_id' => $this->appointment->id,
        'doctor_name' => $this->appointment->doctor->doctor->first_name . ' ' . $this->appointment->doctor->doctor->last_name,
        'date' => $this->appointment->appointment_date->format('Y-m-d'),
        'start_time' => $this->appointment->start_time,
        'end_time' => $this->appointment->end_time,
        'hours_before' => $this->hoursBefore,
    ];
}
}