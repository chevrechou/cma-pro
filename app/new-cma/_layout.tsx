import { Stack } from 'expo-router';

export default function NewCMALayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#1B4F72' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Subject Property' }} />
      <Stack.Screen name="comps" options={{ title: 'Find Comparables' }} />
      <Stack.Screen name="adjust" options={{ title: 'Review & Adjust' }} />
      <Stack.Screen name="report" options={{ title: 'CMA Report' }} />
    </Stack>
  );
}
