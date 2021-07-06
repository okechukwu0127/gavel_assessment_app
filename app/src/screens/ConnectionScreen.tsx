import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function ConnectionScreen() {
  const navigation = useNavigation();
  const openApp = () => navigation.navigate('App');
  
  return (
    <SafeAreaView style={styles.safeSpace}>
      <View style={styles.container}>
        <View style={[styles.dFlex, styles.justifyContentCenter, styles.alignItemsCenter, {flex: 1, paddingBottom: 80}]}>
          <Icon.cloud size={60} color='#fff' />
          <Text style={{textAlign: 'center'}}>Please start the local server and set your IP in the env.json file</Text>
        </View>
      </View>
    </SafeAreaView>
  );

}

import {styles, Text, Icon} from '../utils/styles';
const style = StyleSheet.create({
});