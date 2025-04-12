import { Header } from '@/components/Header';
import {RootView} from '@/components/RootView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { useAuth } from '@/hooks/useAuth';
import { Redirect, Tabs } from 'expo-router';

export default function TabLayout() {
    const colors = useThemeColor()

    const user = useAuth();
    if (!user) {
        return <Redirect href="/login" />;
    }
    return (
        <Tabs
            initialRouteName="home" //autoRender home tab by default  
            backBehavior="history" //enable to go back based on history when clicking on a tab, rather than going to the initialRouteName tab
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: colors.gray900,
                tabBarInactiveBackgroundColor: colors.gray200,
                tabBarInactiveTintColor: colors.gray800,
                tabBarActiveBackgroundColor: colors.gray100,
                tabBarStyle: {
                    // backgroundColor: colors.gray900,
                    borderColor:colors.gray100,
                },
                header: () => <RootView>
                    <Header title={route.name} />
                </RootView>,
                headerShown: true
            })}>
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    title: 'Administration',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.pie" color={color} />,
                    // href: null,
                }}
            />
        </Tabs >
    );
}