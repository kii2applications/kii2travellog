import { useState } from 'react';
import { useReminders, Reminder } from '@/hooks/useReminders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Edit, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ReminderFormData {
  title: string;
  message?: string;
  reminder_date: string;
  event_date?: string;
  country?: string;
  status: 'pending' | 'sent' | 'cancelled';
}

export const RemindersManager = () => {
  const { reminders, isLoading, addReminder, updateReminder, deleteReminder } = useReminders();
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ReminderFormData>({
    defaultValues: {
      title: '',
      message: '',
      status: 'pending',
    },
  });

  const onSubmit = (data: ReminderFormData) => {
    if (editingReminder) {
      updateReminder({
        id: editingReminder.id,
        reminder: {
          ...data,
          reminder_date: data.reminder_date,
          event_date: data.event_date,
        },
      });
    } else {
      addReminder({
        ...data,
        reminder_date: data.reminder_date,
        event_date: data.event_date,
      });
    }
    handleCloseDialog();
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    const reminderDate = new Date(reminder.reminder_date);
    const eventDate = reminder.event_date ? new Date(reminder.event_date) : undefined;
    
    form.reset({
      title: reminder.title,
      message: reminder.message || '',
      reminder_date: reminderDate.toISOString().slice(0, 16), // Format for datetime-local
      event_date: eventDate ? eventDate.toISOString().slice(0, 16) : undefined,
      country: reminder.country || '',
      status: reminder.status,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingReminder(null);
    form.reset({
      title: '',
      message: '',
      status: 'pending',
    });
  };

  const createTestReminder = () => {
    const now = new Date();
    const testTime = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes from now
    
    addReminder({
      title: 'Test Reminder',
      message: 'This is a test reminder to verify the system is working',
      reminder_date: testTime.toISOString(),
      status: 'pending',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500';
      case 'sent': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading reminders...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Reminders</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={createTestReminder}>
            Create Test Reminder
          </Button>
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingReminder(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Reminder
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Reminder title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Reminder message (optional)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reminder_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminder Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="event_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Related country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingReminder ? 'Update' : 'Create'} Reminder
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
           </DialogContent>
          </Dialog>
        </div>
      </div>

      {reminders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No reminders yet. Create your first reminder to get started!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{reminder.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(reminder.status)}>
                      {reminder.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(reminder)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reminder.message && (
                    <p className="text-sm text-muted-foreground">{reminder.message}</p>
                  )}
                   <div className="flex items-center gap-4 text-sm">
                     <span className="flex items-center gap-1">
                       <CalendarIcon className="w-4 h-4" />
                       {format(new Date(reminder.reminder_date), "PPP p")} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                     </span>
                    {reminder.country && (
                      <span className="text-muted-foreground">📍 {reminder.country}</span>
                    )}
                  </div>
                  {reminder.event_date && (
                    <div className="text-sm text-muted-foreground">
                      Event: {format(new Date(reminder.event_date), "PPP")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};