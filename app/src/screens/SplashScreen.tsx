import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, TextInput, TouchableOpacity, Button, Alert, ActivityIndicator, ImageBackground } from 'react-native';

import { Text, Icon } from '../utils/styles';
import { log } from '../utils/helpers';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();
  const blurrybackground = require('../assets/elements/blurrybackground.jpg'); // { uri: "https://letsgavel.com/assets/blurrybackground.jpg" }

  // read component params
  type RouteParams = { 'Message': {message: string;} };
  const route = useRoute<RouteProp<RouteParams, 'Message'>>();
  const message = route?.params?.message;
  
  log('splash screen loaded');

  navigation.addListener('blur', () => {
    log('splash screen unfocussed');

    navigation.addListener('focus', () => {
      log('splash screen should not be focusable again');
      navigation.navigate('App');
    });
  });

  return (
    <ImageBackground style={styles.flex} source={blurrybackground} >
      <SafeAreaView style={styles.flex}>
        <View style={[styles.container]}>
          <View style={[styles.dFlex, styles.justifyContentCenter, styles.alignItemsCenter, {flex: 1, paddingBottom: 80}]}>
            <ActivityIndicator size={100} color={colors.dark} />
            <Text style={styles.h2}>{message}</Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );

}

import {styles, colors} from '../utils/styles';
const style = StyleSheet.create({
});