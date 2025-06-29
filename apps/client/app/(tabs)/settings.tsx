import React from 'react';
import { Image } from 'expo-image';
import { User } from '@/features/user';
import { excerpt } from '@/utils/excerpt';
import { Border, Space } from '@/constants';
import { Settings } from '@/features/settings';
import { Box, Heading, Safe, Scroll, Text } from '@/components';

const SettingsPage = () => {
  const { user } = User.useUser();

  return (
    <React.Fragment>
      <Safe
        bg='bg.subtle'
        style={{ flex: 1 }}
      >
        <Box
          mt='4xl'
          px='xl'
          py='xl'
          style={{
            gap: Space.xl,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            style={{
              width: 56,
              aspectRatio: '1/1',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: Border.radius.full,
            }}
            source={require('@/assets/images/avatars/default.png')}
          />

          <Box style={{ flex: 1 }}>
            <Heading
              size='2xl'
              leading='xl'
              align='left'
              weight='medium'
              style={{ textTransform: 'capitalize' }}
            >
              {excerpt(user?.name || 'Guest', 5)}
            </Heading>
            <Text
              size='sm'
              leading='sm'
              style={{ textTransform: 'capitalize', maxWidth: 240 }}
            >
              {user?.name}
            </Text>
          </Box>
        </Box>

        <Scroll
          px='xl'
          mb='xl'
          mt='3xl'
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Settings.List />
        </Scroll>
      </Safe>
    </React.Fragment>
  );
};

export default SettingsPage;
