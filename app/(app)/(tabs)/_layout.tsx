import { Tabs, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import ChatIconFilled from '~/assets/svg/chat-filled.svg';
import ChatIcon from '~/assets/svg/chat.svg';
import HomeFilled from '~/assets/svg/home-filled.svg';
import HomeIcon from '~/assets/svg/home.svg';
import LibraryFilled from '~/assets/svg/library-filled.svg';
import LibraryIcon from '~/assets/svg/library.svg';
import PostIconFilled from '~/assets/svg/post-filled.svg';
import PostIcon from '~/assets/svg/post.svg';
import MusicPlayer from '~/components/MusicPlayer';
import Avatar from '~/components/ui/avatar';
import { useAudioPlayer } from '~/store/useAudioPlayer';
import { useUserStore } from '~/store/useUser';

export default function TabsLayout() {
  const { user } = useUserStore();
  const { currentAudio } = useAudioPlayer();
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url ?? '');
  const pathname = usePathname();
  const isHomeTab = pathname === '/home' || pathname === '/';

  useEffect(() => {
    if (user) setAvatarUrl(user.avatar_url);
  }, [user]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: '#121212',
            height: 60,
            borderTopWidth: 0,
          },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (focused ? <HomeFilled /> : <HomeIcon />),
          }}
        />

        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ focused }) => (focused ? <LibraryFilled /> : <LibraryIcon />),
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            title: 'Post',
            tabBarIcon: ({ focused }) => (focused ? <PostIconFilled /> : <PostIcon />),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarIcon: ({ focused }) => (focused ? <ChatIconFilled /> : <ChatIcon />),
          }}
        />
        {user?.avatar_url && (
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <View className="rounded-full border-2 border-foreground">
                    <Avatar avatarUrl={avatarUrl} size={28} />
                  </View>
                ) : (
                  <Avatar avatarUrl={avatarUrl} size={28} />
                ),
            }}
          />
        )}
      </Tabs>
      {currentAudio && !isHomeTab && (
        <View style={{ position: 'absolute', bottom: 60, left: 0, right: 0 }}>
          <MusicPlayer />
        </View>
      )}
    </View>
  );
}
