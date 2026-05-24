import { calcAdjustedPrice, formatCurrency } from '@/lib/cma';
import { useNewCMAStore } from '@/lib/store';
import { Comparable } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, Input, Separator, Text, XStack, YStack } from 'tamagui';

export default function AdjustScreen() {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { comps, updateCompAdjustment } = useNewCMAStore();
  const included = comps.filter((c) => c.included);

  if (included.length === 0) {
    return (
      <YStack flex={1} jc="center" ai="center" bg="#F4F6F8" gap="$4" px="$5">
        <Ionicons name="home-outline" size={48} color="#CBD5E0" />
        <Text color="#7F8C8D" fontSize={16} ta="center">No comparables selected.{'\n'}Go back and include at least one comp.</Text>
        <Button size="$5" bg="#1B4F72" color="white" onPress={() => router.back()}>
          Back to Comps
        </Button>
      </YStack>
    );
  }

  const [editing, setEditing] = useState<Comparable | null>(null);
  const [adjAmount, setAdjAmount] = useState('');
  const [adjNotes, setAdjNotes] = useState('');

  function openEdit(comp: Comparable) {
    setEditing(comp);
    setAdjAmount(comp.adjustment ? String(comp.adjustment) : '');
    setAdjNotes(comp.adjustment_notes ?? '');
  }

  function saveAdj() {
    if (!editing) return;
    updateCompAdjustment(editing.id, Number(adjAmount) || 0, adjNotes);
    setEditing(null);
  }

  const avgAdjustedPrice =
    included.length > 0
      ? Math.round(included.reduce((s, c) => s + calcAdjustedPrice(c), 0) / included.length)
      : 0;

  return (
    <YStack flex={1} bg="#F4F6F8">
      <YStack px="$4" pt="$3" pb="$2" gap="$1">
        <Text fontSize={13} color="#2E86C1" fontWeight="700">STEP 3 OF 4</Text>
        <Text fontSize={20} fontWeight="800" color="#1B4F72">Review & Adjust</Text>
        <Text fontSize={13} color="#7F8C8D">Add dollar adjustments for differences vs. subject property.</Text>
      </YStack>

      <YStack mx="$4" mb="$3" bg="#1B4F72" br="$4" p="$4" gap="$1">
        <Text color="rgba(255,255,255,0.7)" fontSize={12} fontWeight="600">AVG ADJUSTED PRICE</Text>
        <Text color="white" fontSize={28} fontWeight="800">{formatCurrency(avgAdjustedPrice)}</Text>
        <Text color="rgba(255,255,255,0.7)" fontSize={12}>{included.length} comps included</Text>
      </YStack>

      <FlatList
        data={included}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Card bg="white" br="$4" p="$4" shadowColor="black" shadowOpacity={0.05} shadowRadius={6} shadowOffset={{ width: 0, height: 1 }}>
            <YStack gap="$3">
              <XStack jc="space-between" ai="flex-start">
                <YStack flex={1} mr="$2">
                  <Text fontWeight="700" fontSize={15} color="#1B4F72" numberOfLines={1}>{item.address}</Text>
                  <Text fontSize={12} color="#7F8C8D">{item.beds}bd / {item.baths}ba • {item.sqft.toLocaleString()} sqft</Text>
                </YStack>
                <TouchableOpacity onPress={() => openEdit(item)}>
                  <Ionicons name="create-outline" size={22} color="#2E86C1" />
                </TouchableOpacity>
              </XStack>

              <Separator />

              <XStack jc="space-between">
                <YStack>
                  <Text fontSize={11} color="#7F8C8D">Sale Price</Text>
                  <Text fontWeight="700" fontSize={16} color="#1B4F72">{formatCurrency(item.sale_price)}</Text>
                </YStack>
                <YStack ai="center">
                  <Text fontSize={11} color="#7F8C8D">Adjustment</Text>
                  <Text
                    fontWeight="700"
                    fontSize={16}
                    color={(item.adjustment ?? 0) >= 0 ? '#27AE60' : '#E74C3C'}
                  >
                    {(item.adjustment ?? 0) >= 0 ? '+' : ''}{formatCurrency(item.adjustment ?? 0)}
                  </Text>
                </YStack>
                <YStack ai="flex-end">
                  <Text fontSize={11} color="#7F8C8D">Adjusted Price</Text>
                  <Text fontWeight="800" fontSize={16} color="#D4AC0D">{formatCurrency(calcAdjustedPrice(item))}</Text>
                </YStack>
              </XStack>

              {item.adjustment_notes ? (
                <Text fontSize={12} color="#7F8C8D" fontStyle="italic">{item.adjustment_notes}</Text>
              ) : null}
            </YStack>
          </Card>
        )}
      />

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
      >
        <Button
          flex={1}
          size="$5"
          bg="#1B4F72"
          color="white"
          onPress={() => router.push('/new-cma/report')}
        >
          Generate Report
        </Button>
      </XStack>

      <Modal visible={!!editing} transparent animationType="slide">
        <YStack flex={1} jc="flex-end" bg="rgba(0,0,0,0.4)">
          <YStack bg="white" br="$6" p="$5" gap="$4" mx="$2" mb="$4">
            <Text fontWeight="800" fontSize={17} color="#1B4F72">Adjust Comparable</Text>
            <Text fontSize={14} color="#7F8C8D" numberOfLines={1}>{editing?.address}</Text>
            <Separator />

            <YStack gap="$1">
              <Text fontSize={12} fontWeight="600" color="#7F8C8D">ADJUSTMENT AMOUNT ($)</Text>
              <Text fontSize={11} color="#7F8C8D">+ for upgrades vs. subject, − for inferior features</Text>
              <XStack gap="$2" ai="center">
                <TouchableOpacity onPress={() => setAdjAmount(String((Number(adjAmount) || 0) - 1000))}>
                  <YStack w={40} h={40} bg="#F4F6F8" br="$10" jc="center" ai="center">
                    <Ionicons name="remove" size={18} color="#1B4F72" />
                  </YStack>
                </TouchableOpacity>
                <Input
                  flex={1}
                  value={adjAmount}
                  onChangeText={setAdjAmount}
                  keyboardType="numbers-and-punctuation"
                  placeholder="0"
                  size="$5"
                  bg="#F4F6F8"
                  textAlign="center"
                />
                <TouchableOpacity onPress={() => setAdjAmount(String((Number(adjAmount) || 0) + 1000))}>
                  <YStack w={40} h={40} bg="#F4F6F8" br="$10" jc="center" ai="center">
                    <Ionicons name="add" size={18} color="#1B4F72" />
                  </YStack>
                </TouchableOpacity>
              </XStack>
            </YStack>

            <YStack gap="$1">
              <Text fontSize={12} fontWeight="600" color="#7F8C8D">NOTES</Text>
              <Input
                value={adjNotes}
                onChangeText={setAdjNotes}
                placeholder="e.g. Pool +$15k, smaller lot -$5k"
                size="$4"
                bg="#F4F6F8"
                multiline
                numberOfLines={2}
              />
            </YStack>

            <XStack gap="$3">
              <Button flex={1} size="$5" variant="outlined" borderColor="#E8E8E8" onPress={() => setEditing(null)}>
                Cancel
              </Button>
              <Button flex={1} size="$5" bg="#1B4F72" color="white" onPress={saveAdj}>
                Save
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </Modal>
    </YStack>
  );
}
