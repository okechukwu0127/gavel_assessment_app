/**
 * GAVEL APP
 */

import ENV from './utils/env';
import API from './utils/api';
import { log, error } from './utils/helpers';
import { Text, Icon } from './utils/styles';

import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, StatusBar, Platform, Alert, LogBox } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

// Hide ReactNative Debug Warnings in simulator
LogBox.ignoreAllLogs(true);

import ReactNavigation, { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { enableScreens } from 'react-native-screens';
enableScreens();

// SCREENS
const FullscreenStack = createStackNavigator(); // https://reactnavigation.org/docs/modal
const MaintabsStack = createBottomTabNavigator(); // https://reactnavigation.org/docs/tab-based-navigation

import SplashScreen from './screens/SplashScreen';
import ConnectionScreen from './screens/ConnectionScreen';

import BasicsScreen from './screens/1BasicsScreen';
import ShowScreen from './screens/2ShowScreen';
import PersonalityScreen from './screens/3PersonalityScreen';

/*
 * Tabbed Main-Screens
 */

function MainScreens() {
  // wrap all non-fullscreen views in safespace
  // -> triggers strange re-renders because of loosing ref due to anonymous functions
  // so we added the safeSpace inside the certain screens

  // const ShowsScreenSafe = () => { return <SafeAreaView style={style.safeSpace}><ShowsScreen /></SafeAreaView> }
  // const SalesScreenSafe = () => { return <SafeAreaView style={style.safeSpace}><SalesScreen /></SafeAreaView> }
  // const CreateScreenSafe = () => { return <SafeAreaView style={style.safeSpace}><CreateScreen /></SafeAreaView> }
  // const CartScreenSafe = () => { return <SafeAreaView style={style.safeSpace}><CartScreen /></SafeAreaView> }
  // const DiscoverScreenSafe = () => { return <SafeAreaView style={style.safeSpace}><DiscoverScreen /></SafeAreaView> }

  // use safespace bottom-padding to make tabbar higher, not using safespace to have the tabbar color also within the safespace padding
  const safePadding = useSafeAreaInsets();
  
  return(
    <MaintabsStack.Navigator
      tabBarOptions={{
        showLabel: true,
        activeTintColor: colors.nav.label.active,
        inactiveTintColor: colors.nav.label.inactive,
        style: {
          height: 60+safePadding.bottom, // Platform.OS==='ios' ? 90 : 60,
          paddingBottom: safePadding.bottom+3, // kills the default ios homebar padding and overlaps the homebar
          backgroundColor: colors.nav.background,
          borderTopColor: colors.nav.border,
          borderTopWidth: 1,
        }
      }}
      screenOptions={
        ({ route }) => ({
          'tabBarIcon': ({ focused, color, size }) => {
            return {
              'Basics': <Icon.basics size={30} color={focused?colors.nav.icon.active:colors.nav.icon.inactive} active={focused?true:false} style={style.tabBarIcon} />,
              'Optimize': <Icon.optimize size={30} color={focused?colors.nav.icon.active:colors.nav.icon.inactive} active={focused?true:false} style={style.tabBarIcon} />,
              'Personality': <Icon.personality size={30} color={focused?colors.nav.icon.active:colors.nav.icon.inactive} active={focused?true:false} style={style.tabBarIcon} />,
            }[route.name];
          }
        })
      }
    >
      <MaintabsStack.Screen name='Basics' component={BasicsScreen} />
      <MaintabsStack.Screen name='Optimize' component={ShowScreen} />
      <MaintabsStack.Screen name='Personality' component={PersonalityScreen} />
    </MaintabsStack.Navigator>
  )
}

const App = () => {
  const [hiddenStatusbar, setHiddenStatusbar] = useState(false);

  const navigationRef = React.useRef<ReactNavigation.NavigationContainerRef>(null); // typecast https://stackoverflow.com/questions/55677600/typescript-how-to-pass-object-is-possibly-null-error
  const navigationChanged = () => {
    if(navigationRef.current !== null){
      const route = navigationRef.current?.getCurrentRoute()?.name;
      if(route && (route == 'Optimize' || route == 'Login')) setHiddenStatusbar(true);
      else setHiddenStatusbar(false);
    }
  }

  const checkConnection = async () => {
    log('app connection '+ENV.BACKEND_URL+'/api/info');
    API.get('/api/info')
    .then((response:any) => {
      if(response.data.success) navigationRef.current?.navigate('App');
      else navigationRef.current?.navigate('Connection');
    })
    .catch((error) => {
      log('app has no connection. please start the node server and set the IP address in env.json', error);
      navigationRef.current?.navigate('Connection');
    });
  }

  useEffect(() => {
    log('gavel mounted');
    checkConnection();

    return ()=> log('gavel unmounted');
  }, []);

  /*
   * Fullscreen Screens
   */

  // modal mode confuses safearea <FullscreenStack.Navigator headerMode='none' mode='modal'>
  return (
    <>
      <NavigationContainer theme={DarkTheme} ref={navigationRef} onStateChange={navigationChanged}>
        <StatusBar hidden={hiddenStatusbar} animated={true} showHideTransition='slide' translucent={true} backgroundColor='transparent' barStyle='light-content' />
        <FullscreenStack.Navigator headerMode='none'>
        
          <FullscreenStack.Screen name='Splash' component={SplashScreen}/>
          <FullscreenStack.Screen name='Connection' component={ConnectionScreen} />
          <FullscreenStack.Screen name='App' component={MainScreens}/>

        </FullscreenStack.Navigator>
      </NavigationContainer>
    </>
  );
};

// child<>parent https://www.akashmittal.com/passing-state-calling-functions-between-parent-children-reactjs/

import { styles, colors } from './utils/styles';
const style = StyleSheet.create({
  safeSpace: {
    flex: 1,
    backgroundColor: colors.container.safespace,
    marginTop: Platform.OS==='android' ? StatusBar.currentHeight : 0 // top bar in android is not excluded in safespace area
  },
  poppingIcon: {
    marginTop: -8,
    paddingTop: 0,
    paddingLeft: 5
  },
  tabBarIcon: {
    paddingTop: 5,
    paddingLeft: 0
  }
});

export default App;
