import { SubjectProperty, PropertyCondition, PropertyStyle } from '@/types';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Select, Separator, Text, YStack } from 'tamagui';
import { useNewCMAStore } from '@/lib/store';

const CONDITIONS: { label: string; value: PropertyCondition }[] = [
  { label: 'Excellent', value: 'excellent' },
  { label: 'Good', value: 'good' },
  { label: 'Average', value: 'average' },
  { label: 'Fair', value: 'fair' },
  { label: 'Poor', value: 'poor' },
];

const STYLES: { label: string; value: PropertyStyle }[] = [
  { label: 'Single Family', value: 'single_family' },
  { label: 'Condo', value: 'condo' },
  { label: 'Townhouse', value: 'townhouse' },
  { label: 'Multi-Family', value: 'multi_family' },
];

function FieldLabel({ label }: { label: string }) {
  return <Text fontSize={12} color="#7F8C8D" fontWeight="600" mb="$1">{label}</Text>;
}

export default function SubjectPropertyForm() {
  const { setSubject } = useNewCMAStore();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [sqft, setSqft] = useState('');
  const [lotSqft, setLotSqft] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [condition, setCondition] = useState<PropertyCondition>('good');
  const [style, setStyle] = useState<PropertyStyle>('single_family');
  const [garage, setGarage] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [error, setError] = useState('');

  function validate() {
    if (!address || !city || !state || !zip) return 'Please enter the full address.';
    if (!beds || !baths || !sqft) return 'Beds, baths, and sqft are required.';
    if (isNaN(Number(beds)) || isNaN(Number(baths)) || isNaN(Number(sqft))) return 'Beds, baths, and sqft must be numbers.';
    return '';
  }

  function handleNext() {
    const err = validate();
    if (err) { setError(err); return; }
    const subject: SubjectProperty = {
      address, city, state, zip,
      beds: Number(beds),
      baths: Number(baths),
      sqft: Number(sqft),
      lot_sqft: lotSqft ? Number(lotSqft) : undefined,
      year_built: yearBuilt ? Number(yearBuilt) : undefined,
      condition,
      style,
      garage: garage ? Number(garage) : undefined,
    };
    setSubject(subject, clientName, clientEmail);
    router.push('/new-cma/comps');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F4F6F8' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
        {/* Step indicator */}
        <YStack gap="$1" mb="$2">
          <Text fontSize={13} color="#2E86C1" fontWeight="700">STEP 1 OF 4</Text>
          <Text fontSize={20} fontWeight="800" color="#1B4F72">Subject Property</Text>
          <Text fontSize={13} color="#7F8C8D">Enter the details of the home being evaluated.</Text>
        </YStack>

        {error ? (
          <YStack bg="$red2" br="$3" p="$3">
            <Text color="$red10" fontSize={14}>{error}</Text>
          </YStack>
        ) : null}

        <YStack bg="white" br="$4" p="$4" gap="$3">
          <Text fontWeight="700" color="#1B4F72">Address</Text>
          <Separator />
          <YStack gap="$2">
            <YStack>
              <FieldLabel label="Street Address" />
              <Input value={address} onChangeText={setAddress} placeholder="123 Main St" size="$4" bg="#F4F6F8" />
            </YStack>
            <YStack>
              <FieldLabel label="City" />
              <Input value={city} onChangeText={setCity} placeholder="Los Angeles" size="$4" bg="#F4F6F8" />
            </YStack>
            <YStack fd="row" gap="$2">
              <YStack flex={1}>
                <FieldLabel label="State" />
                <Input value={state} onChangeText={setState} placeholder="CA" maxLength={2} autoCapitalize="characters" size="$4" bg="#F4F6F8" />
              </YStack>
              <YStack flex={2}>
                <FieldLabel label="ZIP Code" />
                <Input value={zip} onChangeText={setZip} placeholder="90210" keyboardType="number-pad" size="$4" bg="#F4F6F8" />
              </YStack>
            </YStack>
          </YStack>
        </YStack>

        <YStack bg="white" br="$4" p="$4" gap="$3">
          <Text fontWeight="700" color="#1B4F72">Property Details</Text>
          <Separator />
          <YStack gap="$2">
            <YStack fd="row" gap="$2">
              <YStack flex={1}>
                <FieldLabel label="Bedrooms" />
                <Input value={beds} onChangeText={setBeds} placeholder="3" keyboardType="decimal-pad" size="$4" bg="#F4F6F8" />
              </YStack>
              <YStack flex={1}>
                <FieldLabel label="Bathrooms" />
                <Input value={baths} onChangeText={setBaths} placeholder="2" keyboardType="decimal-pad" size="$4" bg="#F4F6F8" />
              </YStack>
              <YStack flex={1}>
                <FieldLabel label="Garage" />
                <Input value={garage} onChangeText={setGarage} placeholder="2" keyboardType="number-pad" size="$4" bg="#F4F6F8" />
              </YStack>
            </YStack>
            <YStack fd="row" gap="$2">
              <YStack flex={1}>
                <FieldLabel label="Living Sqft" />
                <Input value={sqft} onChangeText={setSqft} placeholder="1800" keyboardType="number-pad" size="$4" bg="#F4F6F8" />
              </YStack>
              <YStack flex={1}>
                <FieldLabel label="Lot Sqft" />
                <Input value={lotSqft} onChangeText={setLotSqft} placeholder="6000" keyboardType="number-pad" size="$4" bg="#F4F6F8" />
              </YStack>
            </YStack>
            <YStack>
              <FieldLabel label="Year Built" />
              <Input value={yearBuilt} onChangeText={setYearBuilt} placeholder="1995" keyboardType="number-pad" size="$4" bg="#F4F6F8" />
            </YStack>

            <YStack>
              <FieldLabel label="Condition" />
              <Select value={condition} onValueChange={(v) => setCondition(v as PropertyCondition)} disablePreventBodyScroll>
                <Select.Trigger iconAfter={<Ionicons name="chevron-down" size={16} color="#7F8C8D" />} bg="#F4F6F8">
                  <Select.Value placeholder="Select condition" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Viewport>
                    {CONDITIONS.map((c, i) => (
                      <Select.Item key={c.value} value={c.value} index={i}>
                        <Select.ItemText>{c.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select>
            </YStack>

            <YStack>
              <FieldLabel label="Property Type" />
              <Select value={style} onValueChange={(v) => setStyle(v as PropertyStyle)} disablePreventBodyScroll>
                <Select.Trigger iconAfter={<Ionicons name="chevron-down" size={16} color="#7F8C8D" />} bg="#F4F6F8">
                  <Select.Value placeholder="Select type" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Viewport>
                    {STYLES.map((s, i) => (
                      <Select.Item key={s.value} value={s.value} index={i}>
                        <Select.ItemText>{s.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select>
            </YStack>
          </YStack>
        </YStack>

        <YStack bg="white" br="$4" p="$4" gap="$3">
          <Text fontWeight="700" color="#1B4F72">Client Info (Optional)</Text>
          <Separator />
          <YStack gap="$2">
            <YStack>
              <FieldLabel label="Client Name" />
              <Input value={clientName} onChangeText={setClientName} placeholder="Jane Smith" size="$4" bg="#F4F6F8" />
            </YStack>
            <YStack>
              <FieldLabel label="Client Email" />
              <Input value={clientEmail} onChangeText={setClientEmail} placeholder="jane@email.com" keyboardType="email-address" autoCapitalize="none" size="$4" bg="#F4F6F8" />
            </YStack>
          </YStack>
        </YStack>

        <Button
          size="$5"
          bg="#1B4F72"
          color="white"
          onPress={handleNext}
          iconAfter={<Ionicons name="chevron-forward" size={18} color="white" />}
        >
          Find Comparables
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
