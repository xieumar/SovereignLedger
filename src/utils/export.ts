import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Transaction } from '../types';
import { transactionsToCSV } from './index';

export const exportTransactionsCSV = async (transactions: Transaction[]) => {
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
    } else {
      console.error('Sharing is not available');
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
};
