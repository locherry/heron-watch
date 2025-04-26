import { SecureStorage } from '@/classes/SecureStorage';
import { Header } from '@/components/layout/Header';
import { RootView } from '@/components/layout/RootView';
import { IconSymbol } from '@/components/ui/Icon/IconSymbol';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { useAuth } from '@/hooks/useAuth';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
    const colors = useThemeColor()

    const [userRole, setUserRole] = useState('default')


    const user = useAuth();
    
    // user.then(isLogged => !isLogged? <Redirect href="/login" />:null)
    // user.then(isLogged => !isLogged ? <Redirect href="/login" />:null)

    // if (!user) {
    //     return <Redirect href="/login" />;
    // }

    const {t} = useTranslation()

    useEffect(()=>{
        SecureStorage.get('userSession').then(
            userSession => userSession? setUserRole(userSession.role) : null
        )
    })

    return <Tabs
        initialRouteName="home" //autoRender home tab by default  
        backBehavior="history" //enable to go back based on history when clicking on a tab, rather than going to the initialRouteName tab
        screenOptions={({ route }) => ({
            tabBarActiveTintColor: colors.gray900,
            tabBarInactiveBackgroundColor: colors.gray200,
            tabBarInactiveTintColor: colors.gray800,
            tabBarActiveBackgroundColor: colors.gray100,
            tabBarLabelStyle:{
                textTransform:"capitalize"
            },
            tabBarStyle: {
                // backgroundColor: colors.gray900,
                borderColor: colors.gray100,
            },
            header: () => <RootView>
                <Header title={t(`tabBar.${route.name}`)} />
            </RootView>,
            headerShown: true
        })}>
        <Tabs.Screen
            name="settings"
            options={{
                title: t('tabBar.settings'),
                tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={focused ? "gearshape.fill" : "gearshape"} color={color} />,
            }}
        />
        <Tabs.Screen
            name="home"
            options={{
                title: t('tabBar.home'),
                tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={focused ? 'house.fill' : 'house'} color={color} />,
            }}
        />
        <Tabs.Screen
            name="admin"
            options={{
                title: t('tabBar.admin'),
                tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name={focused ? 'shield.fill' : 'shield'} color={color} />,
                href: userRole == 'admin' ? '/admin' : null,
            }}
        />
    </Tabs >
}