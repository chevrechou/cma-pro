import { formatCurrency, formatDate } from '@/lib/cma';
import { supabase } from '@/lib/supabase';
import { CMAReport } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Card, Separator, Spinner, Text, View, XStack, YStack } from 'tamagui';

export default function CMADetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<CMAReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    supabase
      .from('cma_reports')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) setReport(data as CMAReport);
        setLoading(false);
      });
  }, [id]);

  function handleDelete() {
    Alert.alert('Delete Report', 'This CMA report will be permanently deleted.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          const { error } = await supabase.from('cma_reports').delete().eq('id', id);
          if (error) {
            setDeleting(false);
            setDeleteError(error.message);
          } else {
            router.replace('/(tabs)/dashboard');
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <YStack flex={1} jc="center" ai="center" bg="#F4F6F8">
        <Spinner size="large" color="#1B4F72" />
      </YStack>
    );
  }

  if (!report) {
    return (
      <YStack flex={1} jc="center" ai="center" bg="#F4F6F8" gap="$4">
        <Text color="#7F8C8D">Report not found.</Text>
        <Button onPress={() => router.back()} size="$4" color="#1B4F72">Go Back</Button>
      </YStack>
    );
  }

  const included = report.comps.filter((c) => c.included);

  return (
    <YStack flex={1} bg="#F4F6F8">
      <XStack bg="#1B4F72" pt="$12" pb="$4" px="$5" jc="space-between" ai="center">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <YStack flex={1} mx="$3">
          <Text color="white" fontWeight="700" fontSize={15} numberOfLines={1}>{report.subject.address}</Text>
          <Text color="rgba(255,255,255,0.7)" fontSize={12}>
            {report.subject.city}, {report.subject.state}
            {report.created_at ? ` • ${formatDate(report.created_at)}` : ''}
          </Text>
        </YStack>
        <TouchableOpacity onPress={handleDelete} disabled={deleting}>
          <Ionicons name="trash-outline" size={22} color="#E74C3C" />
        </TouchableOpacity>
      </XStack>

      {deleteError ? (
        <View bg="$red2" mx="$4" mt="$3" br="$3" p="$3">
          <Text color="$red10" fontSize={13}>{deleteError}</Text>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        <Card bg="#1B4F72" br="$5" p="$5" ai="center" gap="$2">
          <Ionicons name="trending-up" size={28} color="#D4AC0D" />
          <Text color="rgba(255,255,255,0.7)" fontSize={12} fontWeight="600">SUGGESTED LIST PRICE</Text>
          <Text color="#D4AC0D" fontSize={38} fontWeight="900">{formatCurrency(report.suggested_price)}</Text>
          <XStack gap="$4">
            <YStack ai="center">
              <Text color="rgba(255,255,255,0.5)" fontSize={11}>LOW</Text>
              <Text color="white" fontWeight="700" fontSize={15}>{formatCurrency(report.suggested_low)}</Text>
            </YStack>
            <YStack ai="center">
              <Text color="rgba(255,255,255,0.5)" fontSize={11}>HIGH</Text>
              <Text color="white" fontWeight="700" fontSize={15}>{formatCurrency(report.suggested_high)}</Text>
            </YStack>
          </XStack>
        </Card>

        <Card bg="white" br="$4" p="$4" gap="$3">
          <Text fontWeight="700" color="#1B4F72" fontSize={15}>Subject Property</Text>
          <Separator />
          <XStack gap="$4" flexWrap="wrap">
            <YStack><Text fontSize={11} color="#7F8C8D">Beds</Text><Text fontWeight="700">{report.subject.beds}</Text></YStack>
            <YStack><Text fontSize={11} color="#7F8C8D">Baths</Text><Text fontWeight="700">{report.subject.baths}</Text></YStack>
            <YStack><Text fontSize={11} color="#7F8C8D">Sqft</Text><Text fontWeight="700">{report.subject.sqft.toLocaleString()}</Text></YStack>
            {report.subject.year_built ? <YStack><Text fontSize={11} color="#7F8C8D">Built</Text><Text fontWeight="700">{report.subject.year_built}</Text></YStack> : null}
            <YStack><Text fontSize={11} color="#7F8C8D">Condition</Text><Text fontWeight="700" textTransform="capitalize">{report.subject.condition}</Text></YStack>
          </XStack>
        </Card>

        <Card bg="white" br="$4" p="$4" gap="$3">
          <Text fontWeight="700" color="#1B4F72" fontSize={15}>Market Statistics</Text>
          <Separator />
          <XStack gap="$4" flexWrap="wrap">
            <YStack>
              <Text fontSize={11} color="#7F8C8D">Avg Sale Price</Text>
              <Text fontWeight="700">{formatCurrency(report.market_stats.avg_sale_price)}</Text>
            </YStack>
            <YStack>
              <Text fontSize={11} color="#7F8C8D">Median Price</Text>
              <Text fontWeight="700">{formatCurrency(report.market_stats.median_sale_price)}</Text>
            </YStack>
            <YStack>
              <Text fontSize={11} color="#7F8C8D">Avg $/Sqft</Text>
              <Text fontWeight="700">{formatCurrency(report.market_stats.avg_price_per_sqft)}</Text>
            </YStack>
            <YStack>
              <Text fontSize={11} color="#7F8C8D">Avg DOM</Text>
              <Text fontWeight="700">{report.market_stats.avg_days_on_market} days</Text>
            </YStack>
            <YStack>
              <Text fontSize={11} color="#7F8C8D">List/Sale Ratio</Text>
              <Text fontWeight="700">{(report.market_stats.avg_list_to_sale_ratio * 100).toFixed(1)}%</Text>
            </YStack>
          </XStack>
        </Card>

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
                    {comp.sale_date ? ` • ${formatDate(comp.sale_date)}` : ''}
                  </Text>
                </YStack>
                <YStack ai="flex-end">
                  <Text fontWeight="700" fontSize={14} color="#D4AC0D">{formatCurrency(comp.sale_price)}</Text>
                  <Text fontSize={11} color="#7F8C8D">{formatCurrency(comp.price_per_sqft)}/sqft</Text>
                </YStack>
              </XStack>
            </YStack>
          ))}
        </Card>

        {report.client_name ? (
          <Card bg="white" br="$4" p="$4" gap="$2">
            <Text fontWeight="700" color="#1B4F72" fontSize={15}>Client</Text>
            <Separator />
            <Text fontWeight="600">{report.client_name}</Text>
            {report.client_email ? <Text color="#7F8C8D" fontSize={13}>{report.client_email}</Text> : null}
          </Card>
        ) : null}
      </ScrollView>
    </YStack>
  );
}
