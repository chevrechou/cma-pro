import { formatCurrency, formatDate } from '@/lib/cma';
import { supabase } from '@/lib/supabase';
import { CMAReport } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Separator, Spinner, Text, View, XStack, YStack } from 'tamagui';

export default function Dashboard() {
  const { top: topInset } = useSafeAreaInsets();
  const [reports, setReports] = useState<CMAReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const fetchReports = useCallback(async () => {
    const { data, error } = await supabase
      .from('cma_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setFetchError(error.message);
    } else {
      setFetchError('');
      setReports(data as CMAReport[]);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  if (loading) {
    return (
      <YStack flex={1} jc="center" ai="center" bg="#F4F6F8">
        <Spinner size="large" color="#1B4F72" />
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="#F4F6F8">
      <XStack bg="#1B4F72" pt={topInset + 16} pb="$4" px="$5" jc="space-between" ai="center">
        <YStack>
          <Text color="white" fontSize={22} fontWeight="800">CMA Pro</Text>
          <Text color="rgba(255,255,255,0.7)" fontSize={13}>Market Analysis Reports</Text>
        </YStack>
        <Button
          size="$4"
          bg="#D4AC0D"
          color="white"
          br="$10"
          onPress={() => router.push('/new-cma')}
        >
          + New CMA
        </Button>
      </XStack>

      {fetchError ? (
        <View bg="$red2" mx="$4" mt="$3" br="$3" p="$3">
          <Text color="$red10" fontSize={13}>{fetchError}</Text>
        </View>
      ) : null}

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id ?? item.created_at ?? item.subject?.address ?? ''}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReports(); }} />
        }
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={
          <YStack ai="center" jc="center" mt="$10" gap="$4">
            <Ionicons name="trending-up-outline" size={56} color="#CBD5E0" />
            <Text color="#7F8C8D" fontSize={16} ta="center">No reports yet.{'\n'}Create your first CMA to get started.</Text>
            <Button
              size="$5"
              bg="#1B4F72"
              color="white"
              br="$10"
              onPress={() => router.push('/new-cma')}
            >
              Create CMA
            </Button>
          </YStack>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/cma/${item.id}`)}>
            <Card
              bg="white"
              br="$4"
              p="$4"
              shadowColor="black"
              shadowOpacity={0.06}
              shadowRadius={8}
              shadowOffset={{ width: 0, height: 2 }}
            >
              <YStack gap="$2">
                <XStack jc="space-between" ai="flex-start">
                  <YStack flex={1} mr="$3">
                    <Text fontWeight="700" fontSize={16} color="#1B4F72" numberOfLines={1}>
                      {item.subject?.address}
                    </Text>
                    <Text color="#7F8C8D" fontSize={13}>
                      {item.subject?.city}, {item.subject?.state} {item.subject?.zip}
                    </Text>
                  </YStack>
                  <YStack ai="flex-end">
                    <Text fontSize={18} fontWeight="800" color="#D4AC0D">
                      {formatCurrency(item.suggested_price)}
                    </Text>
                    <Text color="#7F8C8D" fontSize={11}>Suggested Price</Text>
                  </YStack>
                </XStack>

                <Separator />

                <XStack gap="$4">
                  <YStack>
                    <Text fontSize={12} color="#7F8C8D">Beds</Text>
                    <Text fontWeight="600" color="#1B4F72">{item.subject?.beds}</Text>
                  </YStack>
                  <YStack>
                    <Text fontSize={12} color="#7F8C8D">Baths</Text>
                    <Text fontWeight="600" color="#1B4F72">{item.subject?.baths}</Text>
                  </YStack>
                  <YStack>
                    <Text fontSize={12} color="#7F8C8D">Sqft</Text>
                    <Text fontWeight="600" color="#1B4F72">{item.subject?.sqft?.toLocaleString()}</Text>
                  </YStack>
                  <YStack>
                    <Text fontSize={12} color="#7F8C8D">Comps</Text>
                    <Text fontWeight="600" color="#1B4F72">{item.comps?.filter((c) => c.included).length ?? 0}</Text>
                  </YStack>
                  <YStack ml="auto">
                    <Text fontSize={11} color="#7F8C8D">{item.created_at ? formatDate(item.created_at) : ''}</Text>
                    {item.client_name && <Text fontSize={11} color="#2E86C1">{item.client_name}</Text>}
                  </YStack>
                </XStack>
              </YStack>
            </Card>
          </TouchableOpacity>
        )}
      />
    </YStack>
  );
}
