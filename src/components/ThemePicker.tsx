
import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ThemePicker: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: 'light' as const,
      name: 'Light',
      description: 'Light mode',
      icon: Sun,
    },
    {
      id: 'dark' as const,
      name: 'Dark',
      description: 'Dark mode',
      icon: Moon,
    },
    {
      id: 'system' as const,
      name: 'System',
      description: 'Follow system preference',
      icon: Monitor,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>Choose your preferred theme</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            const isSelected = theme === themeOption.id;
            
            return (
              <Button
                key={themeOption.id}
                variant={isSelected ? "default" : "outline"}
                className="h-auto flex-col gap-2 p-4"
                onClick={() => setTheme(themeOption.id)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{themeOption.name}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
