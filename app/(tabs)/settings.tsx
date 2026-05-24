import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Input, Separator, Spinner, Text, XStack, YStack } from 'tamagui';

export default function Settings() {
  const [agent, setAgent] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [brokerage, setBrokerage] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [rapidApiKey, setRapidApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      const meta = data.user.user_metadata ?? {};
      setAgent(data.user);
      setFullName(meta.full_name ?? '');
      setBrokerage(meta.brokerage ?? '');
      setLicenseNumber(meta.license_number ?? '');
      setPhone(meta.phone ?? '');
      setRapidApiKey(meta.rapidapi_key ?? '');
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    await supabase.auth.updateUser({
      data: { full_name: fullName, brokerage, license_number: licenseNumber, phone, rapidapi_key: rapidApiKey },
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  }

  if (!agent) return <YStack flex={1} jc="center" ai="center"><Spinner color="#1B4F72" /></YStack>;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F4F6F8' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <YStack bg="#1B4F72" pt="$12" pb="$5" px="$5">
        <Text color="white" fontSize={22} fontWeight="800">Settings</Text>
        <Text color="rgba(255,255,255,0.7)" fontSize={13}>{agent?.email}</Text>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <YStack bg="white" br="$4" p="$4" gap="$4">
          <XStack gap="$2" ai="center">
            <Ionicons name="person-outline" size={18} color="#1B4F72" />
            <Text fontWeight="700" color="#1B4F72" fontSize={15}>Agent Profile</Text>
          </XStack>
          <Separator />
          <YStack gap="$3">
            <YStack gap="$1">
              <Text fontSize={12} color="#7F8C8D" fontWeight="600">Full Name</Text>
              <Input value={fullName} onChangeText={setFullName} placeholder="Your full name" size="$4" bg="#F4F6F8" />
            </YStack>
            <YStack gap="$1">
              <Text fontSize={12} color="#7F8C8D" fontWeight="600">Brokerage</Text>
              <Input value={brokerage} onChangeText={setBrokerage} placeholder="Your brokerage" size="$4" bg="#F4F6F8" />
            </YStack>
            <YStack gap="$1">
              <Text fontSize={12} color="#7F8C8D" fontWeight="600">License Number</Text>
              <Input value={licenseNumber} onChangeText={setLicenseNumber} placeholder="DRE / License #" size="$4" bg="#F4F6F8" />
            </YStack>
            <YStack gap="$1">
              <Text fontSize={12} color="#7F8C8D" fontWeight="600">Phone</Text>
              <Input value={phone} onChangeText={setPhone} placeholder="(555) 000-0000" keyboardType="phone-pad" size="$4" bg="#F4F6F8" />
            </YStack>
          </YStack>
        </YStack>

        <YStack bg="white" br="$4" p="$4" gap="$4">
          <XStack gap="$2" ai="center">
            <Ionicons name="key-outline" size={18} color="#1B4F72" />
            <Text fontWeight="700" color="#1B4F72" fontSize={15}>API Keys</Text>
          </XStack>
          <Separator />
          <YStack gap="$1">
            <Text fontSize={12} color="#7F8C8D" fontWeight="600">RapidAPI Key (Zillow)</Text>
            <Input
              value={rapidApiKey}
              onChangeText={setRapidApiKey}
              placeholder="Your RapidAPI key"
              secureTextEntry
              size="$4"
              bg="#F4F6F8"
            />
            <Text fontSize={11} color="#7F8C8D">
              Subscribe to Zillow Com1 on RapidAPI to fetch comparable sales.
            </Text>
          </YStack>
        </YStack>

        <Button
          size="$5"
          bg={saved ? '#27AE60' : '#1B4F72'}
          color="white"
          onPress={handleSave}
          disabled={saving}
          icon={saving ? <Spinner color="white" /> : undefined}
        >
          {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </Button>

        <Button
          size="$5"
          variant="outlined"
          borderColor="#E74C3C"
          color="#E74C3C"
          onPress={handleSignOut}
        >
          Sign Out
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
