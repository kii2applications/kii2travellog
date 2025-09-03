
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useEvents, UserEvent } from '@/hooks/useEvents';
import { EventForm } from '@/components/events/EventForm';
import { format } from 'date-fns';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { events, addEvent, updateEvent, deleteEvent, isAddingEvent, isUpdatingEvent, isDeletingEvent } = useEvents();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UserEvent | null>(null);

  const handleAddEvent = (eventData: any) => {
    addEvent(eventData);
    setIsAddDialogOpen(false);
  };

  const handleUpdateEvent = (eventData: any) => {
    if (editingEvent) {
      updateEvent({ id: editingEvent.id, event: eventData });
      setEditingEvent(null);
    }
  };

  const handleEditEvent = (event: UserEvent) => {
    setEditingEvent(event);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-apple-background min-h-screen p-4 space-y-6">
      {/* Profile Header */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-apple-text">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-apple-blue via-apple-purple to-apple-pink p-0.5">
              <div className="w-full h-full rounded-full bg-apple-background flex items-center justify-center">
                <span className="text-2xl font-semibold text-apple-text">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-apple-text">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </h2>
              <p className="text-sm text-apple-text-secondary">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Section */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-apple-text">Important Events</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-apple-blue hover:bg-apple-blue/90">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-apple-background border-apple-border">
                <DialogHeader>
                  <DialogTitle className="text-apple-text">Add New Event</DialogTitle>
                </DialogHeader>
                <EventForm 
                  onSubmit={handleAddEvent} 
                  isLoading={isAddingEvent}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-apple-text-secondary opacity-50" />
              <p className="text-apple-text-secondary">No events added yet</p>
              <p className="text-sm text-apple-text-secondary mt-1">
                Add important events to track them on your timeline
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {events
                .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
                .map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg bg-apple-card border border-apple-border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-apple-text mb-1">
                          {event.event_name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-apple-text-secondary mb-2">
                          <MapPin className="h-3 w-3" />
                          <span>{event.country}</span>
                          <span>•</span>
                          <span>{format(new Date(event.event_date), 'MMM d, yyyy')}</span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-apple-text-secondary">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          className="h-8 w-8 p-0 text-apple-text-secondary hover:text-apple-text"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={isDeletingEvent}
                          className="h-8 w-8 p-0 text-apple-text-secondary hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="bg-apple-background border-apple-border">
          <DialogHeader>
            <DialogTitle className="text-apple-text">Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <EventForm 
              onSubmit={handleUpdateEvent} 
              isLoading={isUpdatingEvent}
              initialData={{
                event_name: editingEvent.event_name,
                country: editingEvent.country,
                event_date: editingEvent.event_date,
                description: editingEvent.description || '',
              }}
              submitButtonText="Update Event"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
