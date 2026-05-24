import { useNewCMAStore } from '@/lib/store';
import { searchComparables } from '@/lib/zillow';
import { supabase } from '@/lib/supabase';
import { Comparable } from '@/types';
import { formatCurrency } from '@/lib/cma';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Separator, Spinner, Text, XStack, YStack, View } from 'tamagui';

export default function CompsScreen() {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { subject, comps, setComps, toggleComp } = useNewCMAStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function fetchComps() {
    if (!subject) return;
    setLoading(true);
    setError('');
    try {
      const { data: user } = await supabase.auth.getUser();
      const apiKey = user.user?.user_metadata?.rapidapi_key ?? '';
      if (!apiKey) {
        setError('Add your RapidAPI key in Settings to fetch live comparables.');
        setLoading(false);
        setSearched(true);
        return;
      }
      const results = await searchComparables(
        {
          address: subject.address,
          zip: subject.zip,
          beds: subject.beds,
          baths: subject.baths,
          sqft: subject.sqft,
        },
        apiKey
      );
      setComps(results);
      setSearched(true);
    } catch (e: any) {
      setError(e.message ?? 'Failed to fetch comparables.');
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!searched && comps.length === 0) fetchComps();
  }, []);

  const includedCount = comps.filter((c) => c.included).length;

  return (
    <YStack flex={1} bg="#F4F6F8">
      <YStack px="$4" pt="$3" pb="$2" gap="$1">
        <Text fontSize={13} color="#2E86C1" fontWeight="700">STEP 2 OF 4</Text>
        <Text fontSize={20} fontWeight="800" color="#1B4F72">Find Comparables</Text>
        <Text fontSize={13} color="#7F8C8D">
          Select {includedCount} of {comps.length} comps • {subject?.address}
        </Text>
      </YStack>

      {error ? (
        <YStack mx="$4" bg="$orange2" br="$3" p="$3" mb="$2">
          <Text color="$orange10" fontSize={13}>{error}</Text>
        </YStack>
      ) : null}

      {loading ? (
        <YStack flex={1} jc="center" ai="center" gap="$3">
          <Spinner size="large" color="#1B4F72" />
          <Text color="#7F8C8D">Searching for comparables…</Text>
        </YStack>
      ) : (
        <FlatList
          data={comps}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 100 }}
          ListEmptyComponent={
            <YStack ai="center" mt="$8" gap="$4">
              <Text color="#7F8C8D" ta="center">No comparables found.{'\n'}Try searching again or add manually.</Text>
              <Button onPress={fetchComps} size="$4" bg="#1B4F72" color="white">Search Again</Button>
            </YStack>
          }
          renderItem={({ item }) => <CompCard comp={item} onToggle={() => toggleComp(item.id)} />}
        />
      )}

      {!loading && (
        <XStack
          pos="absolute"
          bottom={0}
          left={0}
          right={0}
          px="$4"
          pt="$3"
          pb={Math.max(bottomInset, 12)}
          bg="white"
          borderTopWidth={1}
          borderTopColor="#E8E8E8"
          gap="$3"
        >
          <Button
            flex={1}
            size="$5"
            variant="outlined"
            borderColor="#1B4F72"
            color="#1B4F72"
            onPress={fetchComps}
          >
            Refresh
          </Button>
          <Button
            flex={2}
            size="$5"
            bg="#1B4F72"
            color="white"
            disabled={includedCount === 0}
            onPress={() => router.push('/new-cma/adjust')}
          >
            Review ({includedCount})
          </Button>
        </XStack>
      )}
    </YStack>
  );
}

function CompCard({ comp, onToggle }: { comp: Comparable; onToggle: () => void }) {
  return (
    <TouchableOpacity onPress={onToggle}>
      <Card
        bg="white"
        br="$4"
        p="$4"
        opacity={comp.included ? 1 : 0.5}
        shadowColor="black"
        shadowOpacity={0.05}
        shadowRadius={6}
        shadowOffset={{ width: 0, height: 1 }}
      >
        <XStack gap="$3" ai="flex-start">
          <View
            w={28}
            h={28}
            br="$10"
            bg={comp.included ? '#1B4F72' : '#E8E8E8'}
            jc="center"
            ai="center"
            mt="$1"
          >
            {comp.included && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <YStack flex={1} gap="$2">
            <XStack jc="space-between" ai="flex-start">
              <YStack flex={1} mr="$2">
                <Text fontWeight="700" fontSize={15} color="#1B4F72" numberOfLines={1}>{comp.address}</Text>
                <Text fontSize={12} color="#7F8C8D">
                  {comp.city}, {comp.state}
                  {comp.distance_miles != null ? ` • ${comp.distance_miles.toFixed(1)} mi` : ''}
                </Text>
              </YStack>
              <YStack ai="flex-end">
                <Text fontWeight="800" fontSize={17} color="#D4AC0D">{formatCurrency(comp.sale_price)}</Text>
                <Text fontSize={11} color="#7F8C8D">{formatCurrency(comp.price_per_sqft)}/sqft</Text>
              </YStack>
            </XStack>
            <Separator />
            <XStack gap="$4" flexWrap="wrap">
              <Text fontSize={12} color="#7F8C8D">{comp.beds}bd / {comp.baths}ba</Text>
              <Text fontSize={12} color="#7F8C8D">{comp.sqft.toLocaleString()} sqft</Text>
              {comp.year_built ? <Text fontSize={12} color="#7F8C8D">Built {comp.year_built}</Text> : null}
              <Text fontSize={12} color="#7F8C8D">{comp.days_on_market} DOM</Text>
              <Text fontSize={12} color={comp.status === 'sold' ? '#27AE60' : '#2E86C1'} fontWeight="600">
                {comp.status.toUpperCase()}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </Card>
    </TouchableOpacity>
  );
}
