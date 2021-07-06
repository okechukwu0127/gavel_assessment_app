import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet, Keyboard } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';


import { Text, Icon } from '../utils/styles';
import { log, error, has } from '../utils/helpers';

import ENV from '../utils/env';

// BEER BUTTON

/**
 * This icon button does not need to be an own component,
 * but we want to track how often a child component rerenders
 */

export default function Beer(props:any) {


  useEffect(() => {
    log('Beer mounted');
    return () => log('Beer unmounted');
  }, []);


  props.countRerender();

  return (
    <Pressable onPress={()=>props.simulateMessages(8)}>
      <Icon.random style={{fontSize: 30, marginLeft:15, marginBottom: 3}} color="#fff" />
    </Pressable>
  )
}

import {styles, colors} from '../utils/styles';
const style = StyleSheet.create({
});