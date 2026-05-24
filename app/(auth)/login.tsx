import { supabase } from '@/lib/supabase';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Input, Spinner, Text, View, XStack, YStack } from 'tamagui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) return setError(err.message);
    router.replace('/(tabs)/dashboard');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F4F6F8' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <YStack flex={1} jc="center" px="$5" gap="$4">
        <YStack gap="$1" mb="$4">
          <Text fontSize={32} fontWeight="800" color="#1B4F72">
            CMA Pro
          </Text>
          <Text fontSize={16} color="#7F8C8D">
            Comprehensive Market Analysis for Agents
          </Text>
        </YStack>

        {error ? (
          <View bg="$red2" br="$3" p="$3">
            <Text color="$red10" fontSize={14}>{error}</Text>
          </View>
        ) : null}

        <YStack gap="$3">
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            size="$5"
            bg="white"
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            size="$5"
            bg="white"
          />
        </YStack>

        <Button
          size="$5"
          bg="#1B4F72"
          color="white"
          onPress={handleLogin}
          disabled={loading}
          icon={loading ? <Spinner color="white" /> : undefined}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>

        <XStack jc="center" gap="$2">
          <Text color="#7F8C8D">Don't have an account?</Text>
          <Link href="/(auth)/register">
            <Text color="#2E86C1" fontWeight="600">Sign Up</Text>
          </Link>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}
