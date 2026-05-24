import { supabase } from '@/lib/supabase';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Input, Spinner, Text, View, XStack, YStack } from 'tamagui';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [brokerage, setBrokerage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, brokerage } },
    });
    setLoading(false);
    if (err) return setError(err.message);
    if (data.session) router.replace('/(tabs)/dashboard');
    else setError('Check your email to confirm your account.');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F4F6F8' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <YStack flex={1} jc="center" px="$5" gap="$4">
        <YStack gap="$1" mb="$2">
          <Text fontSize={28} fontWeight="800" color="#1B4F72">Create Account</Text>
          <Text fontSize={15} color="#7F8C8D">Set up your agent profile</Text>
        </YStack>

        {error ? (
          <View bg="$red2" br="$3" p="$3">
            <Text color="$red10" fontSize={14}>{error}</Text>
          </View>
        ) : null}

        <YStack gap="$3">
          <Input placeholder="Full Name *" value={fullName} onChangeText={setFullName} size="$5" bg="white" />
          <Input placeholder="Email *" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" size="$5" bg="white" />
          <Input placeholder="Password *" value={password} onChangeText={setPassword} secureTextEntry size="$5" bg="white" />
          <Input placeholder="Brokerage (optional)" value={brokerage} onChangeText={setBrokerage} size="$5" bg="white" />
        </YStack>

        <Button
          size="$5"
          bg="#1B4F72"
          color="white"
          onPress={handleRegister}
          disabled={loading}
          icon={loading ? <Spinner color="white" /> : undefined}
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>

        <XStack jc="center" gap="$2">
          <Text color="#7F8C8D">Already have an account?</Text>
          <Link href="/(auth)/login">
            <Text color="#2E86C1" fontWeight="600">Sign In</Text>
          </Link>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}
