
import React from 'react';
import { ThemePicker } from '@/components/ThemePicker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, isUpdatingSettings } = useUserSettings();
  const [monthValue, setMonthValue] = React.useState(settings?.custom_year_start_month || 4);
  const [dayValue, setDayValue] = React.useState(settings?.custom_year_start_day || 1);

  React.useEffect(() => {
    if (settings) {
      setMonthValue(settings.custom_year_start_month);
      setDayValue(settings.custom_year_start_day);
    }
  }, [settings]);

  const handleUpdateYear = () => {
    updateSettings({
      custom_year_start_month: monthValue,
      custom_year_start_day: dayValue,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-20 md:pb-8 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <ThemePicker />
      
      <Card>
        <CardHeader>
          <CardTitle>Custom Year Settings</CardTitle>
          <CardDescription>
            Set when your personal travel year starts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                type="number"
                min="1"
                max="12"
                value={monthValue}
                onChange={(e) => setMonthValue(parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Input
                id="day"
                type="number"
                min="1"
                max="31"
                value={dayValue}
                onChange={(e) => setDayValue(parseInt(e.target.value))}
              />
            </div>
          </div>
          <Button 
            onClick={handleUpdateYear}
            disabled={isUpdatingSettings}
          >
            {isUpdatingSettings ? 'Saving...' : 'Save Year Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
