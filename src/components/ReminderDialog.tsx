import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Bell } from 'lucide-react';
import { useReminders } from '@/hooks/useReminders';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ReminderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: string;
    event_name: string;
    country: string;
    event_date: string;
    description?: string;
  };
}

export const ReminderDialog: React.FC<ReminderDialogProps> = ({
  isOpen,
  onOpenChange,
  event,
}) => {
  const { addReminder, isAddingReminder } = useReminders();
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [customMessage, setCustomMessage] = useState('');

  // Generate suggested reminder date (7 days before event)
  React.useEffect(() => {
    if (event && isOpen) {
      const eventDate = new Date(event.event_date);
      const suggestedDate = new Date(eventDate);
      suggestedDate.setDate(eventDate.getDate() - 7);
      setReminderDate(suggestedDate.toISOString().split('T')[0]);
      
      // Auto-generate message
      setCustomMessage(
        `Don't forget about ${event.event_name} in ${event.country}. Make sure to prepare for your trip!`
      );
    }
  }, [event, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reminderDate || !reminderTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the reminder.",
        variant: "destructive",
      });
      return;
    }

    // Combine date and time
    const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
    
    // Check if reminder is in the future
    if (reminderDateTime <= new Date()) {
      toast({
        title: "Invalid Date",
        description: "Reminder date must be in the future.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save reminder to database
      addReminder({
        title: `Reminder: ${event.event_name}`,
        message: customMessage,
        reminder_date: reminderDateTime.toISOString(),
        event_date: event.event_date,
        event_id: event.id,
        country: event.country,
        status: 'pending',
      });

      // Send test email notification
      try {
        const { error } = await supabase.functions.invoke('send-reminder-notification', {
          body: {
            reminderId: crypto.randomUUID(),
            title: `Reminder: ${event.event_name}`,
            message: customMessage,
            reminderDate: reminderDateTime.toISOString(),
            eventDate: event.event_date,
            country: event.country,
          }
        });

        if (error) {
          console.error('Email notification error:', error);
          toast({
            title: "Reminder Created",
            description: "Reminder saved but email notification failed to send.",
            variant: "default",
          });
        } else {
          toast({
            title: "Reminder Created",
            description: "Reminder saved and test email sent successfully!",
          });
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        toast({
          title: "Reminder Created",
          description: "Reminder saved but email notification failed.",
        });
      }

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create reminder",
        variant: "destructive",
      });
    }
  };

  const eventDate = new Date(event.event_date);
  const maxReminderDate = new Date(eventDate);
  maxReminderDate.setDate(eventDate.getDate() - 1); // At least 1 day before event

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-apple-background border-apple-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-apple-text flex items-center gap-2">
            <Bell className="h-5 w-5 text-apple-blue" />
            Set Reminder
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Info */}
          <div className="p-3 rounded-lg bg-apple-card border border-apple-border">
            <h3 className="font-medium text-apple-text mb-1">
              {event.event_name}
            </h3>
            <p className="text-sm text-apple-text-secondary">
              {event.country} • {format(eventDate, 'MMM d, yyyy')}
            </p>
          </div>

          {/* Reminder Date */}
          <div>
            <Label htmlFor="reminderDate" className="text-apple-text flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              Reminder Date
            </Label>
            <Input
              id="reminderDate"
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              max={maxReminderDate.toISOString().split('T')[0]}
              className="bg-apple-card border-apple-border text-apple-text"
              required
            />
          </div>

          {/* Reminder Time */}
          <div>
            <Label htmlFor="reminderTime" className="text-apple-text flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" />
              Reminder Time
            </Label>
            <Input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="bg-apple-card border-apple-border text-apple-text"
              required
            />
          </div>

          {/* Custom Message */}
          <div>
            <Label htmlFor="customMessage" className="text-apple-text mb-2 block">
              Custom Message (Optional)
            </Label>
            <Textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a custom reminder message..."
              className="bg-apple-card border-apple-border text-apple-text resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-apple-border text-apple-text hover:bg-apple-card"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAddingReminder}
              className="flex-1 bg-apple-blue hover:bg-apple-blue/90 text-white"
            >
              {isAddingReminder ? 'Creating...' : 'Create Reminder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};