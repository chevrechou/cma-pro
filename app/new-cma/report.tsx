import { calcMarketStats, calcSuggestedRange, formatCurrency } from '@/lib/cma';
import { useNewCMAStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Separator, Spinner, Text, XStack, YStack } from 'tamagui';

function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <YStack flex={1} bg="white" br="$4" p="$3" ai="center" gap="$1">
      <Text fontSize={11} color="#7F8C8D" fontWeight="600" ta="center">{label}</Text>
      <Text fontSize={18} fontWeight="800" color="#1B4F72">{value}</Text>
      {sub ? <Text fontSize={11} color="#7F8C8D">{sub}</Text> : null}
    </YStack>
  );
}

export default function ReportScreen() {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { subject, comps, clientName, clientEmail, reset } = useNewCMAStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  if (!subject) {
    return (
      <YStack flex={1} jc="center" ai="center" bg="#F4F6F8" gap="$4">
        <Text color="#7F8C8D">No subject property found.</Text>
        <Button onPress={() => router.replace('/new-cma')} size="$4" bg="#1B4F72" color="white">
          Start Over
        </Button>
      </YStack>
    );
  }

  const included = comps.filter((c) => c.included);
  const stats = calcMarketStats(included);
  const { low, high, suggested } = calcSuggestedRange(subject, included);

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const { data: userData } = await supabase.auth.getUser();
      const agentId = userData.user?.id;
      if (!agentId) throw new Error('Not authenticated. Please sign in again.');
      const { error: err } = await supabase.from('cma_reports').insert({
        agent_id: agentId,
        subject,
        comps,
        market_stats: stats,
        suggested_low: low,
        suggested_high: high,
        suggested_price: suggested,
        client_name: clientName || null,
        client_email: clientEmail || null,
      });
      if (err) throw err;
      if (mountedRef.current) setSaved(true);
      setTimeout(() => {
        if (!mountedRef.current) return;
        reset();
        router.replace('/(tabs)/dashboard');
      }, 1500);
    } catch (e: any) {
      if (mountedRef.current) setError(e.message ?? 'Failed to save report.');
    }
    if (mountedRef.current) setSaving(false);
  }

  return (
    <YStack flex={1} bg="#F4F6F8">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 120 }}>
        <YStack gap="$1" mb="$1">
          <Text fontSize={13} color="#2E86C1" fontWeight="700">STEP 4 OF 4</Text>
          <Text fontSize={20} fontWeight="800" color="#1B4F72">CMA Report</Text>
          <Text fontSize={13} color="#7F8C8D">{subject.address}, {subject.city}, {subject.state}</Text>
        </YStack>

        <Card bg="#1B4F72" br="$5" p="$5" ai="center" gap="$2">
          <Ionicons name="trending-up" size={32} color="#D4AC0D" />
          <Text color="rgba(255,255,255,0.7)" fontSize={13} fontWeight="600">SUGGESTED LIST PRICE</Text>
          <Text color="#D4AC0D" fontSize={40} fontWeight="900" letterSpacing={-1}>
            {formatCurrency(suggested)}
          </Text>
          <XStack gap="$4">
            <YStack ai="center">
              <Text color="rgba(255,255,255,0.5)" fontSize={11}>LOW</Text>
              <Text color="white" fontWeight="700" fontSize={16}>{formatCurrency(low)}</Text>
            </YStack>
            <YStack ai="center">
              <Text color="rgba(255,255,255,0.5)" fontSize={11}>HIGH</Text>
              <Text color="white" fontWeight="700" fontSize={16}>{formatCurrency(high)}</Text>
            </YStack>
          </XStack>
          <Text color="rgba(255,255,255,0.5)" fontSize={11} ta="center">
            Based on {included.length} comparable sales • Condition: {subject.condition}
          </Text>
        </Card>

        <Card bg="white" br="$4" p="$4" gap="$3">
          <Text fontWeight="700" color="#1B4F72" fontSize={15}>Subject Property</Text>
          <Separator />
          <XStack gap="$4" flexWrap="wrap">
            <YStack><Text fontSize={11} color="#7F8C8D">Beds</Text><Text fontWeight="700">{subject.beds}</Text></YStack>
            <YStack><Text fontSize={11} color="#7F8C8D">Baths</Text><Text fontWeight="700">{subject.baths}</Text></YStack>
            <YStack><Text fontSize={11} color="#7F8C8D">Sqft</Text><Text fontWeight="700">{subject.sqft.toLocaleString()}</Text></YStack>
            {subject.year_built ? <YStack><Text fontSize={11} color="#7F8C8D">Built</Text><Text fontWeight="700">{subject.year_built}</Text></YStack> : null}
            <YStack><Text fontSize={11} color="#7F8C8D">Condition</Text><Text fontWeight="700" textTransform="capitalize">{subject.condition}</Text></YStack>
          </XStack>
        </Card>

        <YStack gap="$2">
          <Text fontWeight="700" color="#1B4F72" fontSize={15} mx="$1">Market Statistics</Text>
          <XStack gap="$2">
            <StatBox label="Avg Sale Price" value={formatCurrency(stats.avg_sale_price)} />
            <StatBox label="Median Price" value={formatCurrency(stats.median_sale_price)} />
          </XStack>
          <XStack gap="$2">
            <StatBox label="Avg $/Sqft" value={formatCurrency(stats.avg_price_per_sqft)} />
            <StatBox label="Avg DOM" value={String(stats.avg_days_on_market)} sub="days" />
            <StatBox label="List/Sale" value={`${(stats.avg_list_to_sale_ratio * 100).toFixed(1)}%`} />
          </XStack>
        </YStack>

        <Card bg="white" br="$4" p="$4" gap="$3">
          <Text fontWeight="700" color="#1B4F72" fontSize={15}>Comparables ({included.length})</Text>
          <Separator />
          {included.map((comp, i) => (
            <YStack key={comp.id} gap="$2">
              {i > 0 && <Separator />}
              <XStack jc="space-between" ai="flex-start">
                <YStack flex={1} mr="$2">
                  <Text fontWeight="600" fontSize={13} color="#1B4F72" numberOfLines={1}>{comp.address}</Text>
                  <Text fontSize={11} color="#7F8C8D">
                    {comp.beds}bd/{comp.baths}ba • {comp.sqft.toLocaleString()} sqft • {comp.days_on_market} DOM
                  </Text>
                </YStack>
                <YStack ai="flex-end">
                  <Text fontWeight="700" fontSize={14} color="#D4AC0D">{formatCurrency(comp.sale_price)}</Text>
                  {(comp.adjustment ?? 0) !== 0 && (
                    <Text fontSize={11} color={(comp.adjustment ?? 0) > 0 ? '#27AE60' : '#E74C3C'}>
                      Adj: {(comp.adjustment ?? 0) > 0 ? '+' : ''}{formatCurrency(comp.adjustment ?? 0)}
                    </Text>
                  )}
                </YStack>
              </XStack>
            </YStack>
          ))}
        </Card>

        {clientName ? (
          <Card bg="white" br="$4" p="$4" gap="$2">
            <Text fontWeight="700" color="#1B4F72" fontSize={15}>Prepared For</Text>
            <Separator />
            <Text fontWeight="600">{clientName}</Text>
            {clientEmail ? <Text color="#7F8C8D" fontSize={13}>{clientEmail}</Text> : null}
          </Card>
        ) : null}

        {error ? (
          <YStack bg="$red2" br="$3" p="$3">
            <Text color="$red10" fontSize={14}>{error}</Text>
          </YStack>
        ) : null}
      </ScrollView>

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
        <Button flex={1} size="$5" variant="outlined" borderColor="#E8E8E8" color="#7F8C8D" onPress={() => router.back()}>
          Back
        </Button>
        <Button
          flex={2}
          size="$5"
          bg={saved ? '#27AE60' : '#D4AC0D'}
          color="white"
          onPress={handleSave}
          disabled={saving || saved}
          icon={saving ? <Spinner color="white" /> : undefined}
        >
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Report'}
        </Button>
      </XStack>
    </YStack>
  );
}
