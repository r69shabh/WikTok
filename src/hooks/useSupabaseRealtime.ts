import { useEffect, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const useSupabaseRealtime = (
  table: string,
  filter: string,
  filterValue: string | number,
  callback: (payload: any) => void
) => {
  const stableCallback = useCallback(callback, []);

  useEffect(() => {
    let channel: RealtimeChannel;
    let timeoutId: NodeJS.Timeout;

    const setupSubscription = async () => {
      if (channel) {
        await supabase.removeChannel(channel);
      }

      channel = supabase
        .channel(`${table}_${filterValue}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: `${filter}=eq.${filterValue}`,
          },
          stableCallback
        )
        .subscribe();
    };

    timeoutId = setTimeout(setupSubscription, 100);

    return () => {
      clearTimeout(timeoutId);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, filter, filterValue, stableCallback]);
};