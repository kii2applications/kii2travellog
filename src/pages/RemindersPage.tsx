import React from 'react';
import { RemindersManager } from '@/components/RemindersManager';

const RemindersPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <RemindersManager />
    </div>
  );
};

export default RemindersPage;