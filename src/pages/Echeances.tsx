/**
 * Page dédiée aux échéances comptables
 * Interface moderne et accessible
 */

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SuiviEcheancesSimple from '@/components/planning/SuiviEcheancesSimple';

const Echeances = () => {
  return (
    <DashboardLayout>
      <SuiviEcheancesSimple />
    </DashboardLayout>
  );
};

export default Echeances;
