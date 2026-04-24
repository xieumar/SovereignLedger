import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Transaction } from '../types';
import { transactionsToCSV } from './index';

import { useToastStore } from '@/store/toast';

export const exportTransactionsCSV = async (transactions: Transaction[]) => {
  const toast = useToastStore.getState();
  const csv = transactionsToCSV(transactions);
  const filename = `SovereignLedger_Export_${new Date().toISOString().slice(0, 10)}.csv`;
  const fileUri = `${FileSystem.documentDirectory}${filename}`;

  try {
    await FileSystem.writeAsStringAsync(fileUri, csv, { 
      encoding: FileSystem.EncodingType.UTF8 
    });
    
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Transactions',
        UTI: 'public.comma-separated-values-text',
      });
      toast.show('Data exported successfully!', 'success');
    } else {
      toast.show('Sharing is not available on this device', 'error');
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    toast.show('Failed to export data', 'error');
  }
};
