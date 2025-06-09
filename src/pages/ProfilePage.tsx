
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Target, Settings, Trash2 } from 'lucide-react';
import { EventForm } from '@/components/events/EventForm';
import { CountryTargetForm } from '@/components/targets/CountryTargetForm';
import { useEvents } from '@/hooks/useEvents';
import { useCountryTargets } from '@/hooks/useCountryTargets';
import { format } from 'date-fns';

export const ProfilePage: React.FC = () => {
  const { events, addEvent, deleteEvent, isAddingEvent } = useEvents();
  const { targets, addTarget, deleteTarget, isAddingTarget } = useCountryTargets();
  const [activeTab, setActiveTab] = useState('events');

  const handleEventSubmit = (data: any) => {
    addEvent({
      ...data,
      event_date: format(data.event_date, 'yyyy-MM-dd'),
    });
  };

  const handleTargetSubmit = (data: any) => {
    addTarget(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your travel events and country targets</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="targets" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Country Targets
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Event</CardTitle>
                  <CardDescription>
                    Add important events in countries you plan to visit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EventForm onSubmit={handleEventSubmit} isLoading={isAddingEvent} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Events</CardTitle>
                  <CardDescription>
                    Upcoming events and important dates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {events.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No events added yet
                      </p>
                    ) : (
                      events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium">{event.event_name}</h4>
                            <p className="text-sm text-muted-foreground">{event.country}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(event.event_date), 'PPP')}
                            </p>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="targets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Country Target</CardTitle>
                  <CardDescription>
                    Set minimum days targets for countries you want to visit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CountryTargetForm onSubmit={handleTargetSubmit} isLoading={isAddingTarget} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Country Targets</CardTitle>
                  <CardDescription>
                    Minimum days you want to spend in each country
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {targets.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No targets set yet
                      </p>
                    ) : (
                      targets.map((target) => (
                        <div
                          key={target.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{target.country}</h4>
                            <p className="text-sm text-muted-foreground">
                              Minimum {target.minimum_days} days
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTarget(target.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Travel Year Settings</CardTitle>
                <CardDescription>
                  Configure your custom travel year settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Settings functionality will be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
