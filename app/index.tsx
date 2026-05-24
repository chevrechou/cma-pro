import { supabase } from '@/lib/supabase';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Spinner } from 'tamagui';

export default function Index() {
  const [session, setSession] = useState<any>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <Spinner size="large" color="$blue10" mt="$10" />;
  if (session) return <Redirect href="/(tabs)/dashboard" />;
  return <Redirect href="/(auth)/login" />;
}
