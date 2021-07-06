import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet, Keyboard } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';


import { Text, Icon } from '../utils/styles';
import { log, error, has } from '../utils/helpers';

import ENV from '../utils/env';

// RERENDER COUNTER

// I placed the variables outside of the function, as it should not trigger extra rerenders. The counter is rendered independent of their change periodically every second
let counterTotal = 0;
let counterSelf = 0;
let counterChat = 0;
let counterMsg = 0; // child of Chat
let counterChatbox = 0;
let counterBeer = 0; // child of Chatbox
let counterShowScreen = 0;
let watching:boolean = true;
let watchThrottling:any = null;

export default function Counter(props:any) {

  useEffect(() => {
    log('Rerender Counter mounted');

    // Reference counting functions to make them available in ShowScreen
    props.refCounters({
      'countShowScreen': () => {
        counterTotal += 1;
        counterShowScreen += 1;
        // log('Rerender ShowScreen '+(counterShowScreen+1)+'x (total '+counterTotal+'x self '+counterSelf+'x)');
      },
      'countChat': () => {
        counterTotal += 1;
        counterChat += 1;
        // log('Rerender Chat '+(counterChat+1)+'x (total '+counterTotal+'x self '+counterSelf+'x)');
      },
      'countMsg': () => {
        counterTotal += 1;
        counterMsg += 1;
        // log('Rerender Chat>Msg '+(counterMsg+1)+'x (total '+counterTotal+'x self '+counterSelf+'x)');
      },
      'countChatbox': () => {
        counterTotal += 1;
        counterChatbox += 1;
        // log('Rerender Chatbox '+(counterChatbox+1)+'x (total '+counterTotal+'x self '+counterSelf+'x)');
      },
      'countBeer': () => {
        counterTotal += 1;
        counterBeer += 1;
        // log('Rerender Chatbox>Beer '+(counterBeer+1)+'x (total '+counterTotal+'x self '+counterSelf+'x)');
      },
      'stopCounter': () => {
        log('Rerender counter stopped');
        watching = false;
      },
      'startCounter': () => {
        log('Rerender counter started');
        watching = true;
        nextWatchingCycle();
      }
    });

    return () => {
      log('Rerender Counter unmounted');
      watching = false;
    }
  }, [0]);

  // Watching

  const [rerender_indicator, doRerender] = useState<any>(0);

  const nextWatchingCycle = () => {
    // log(counterShowScreen+'x ShowScreen | '+counterChat+'x Chat | '+counterMsg+'x Msg | '+counterChatbox+'x Chatbox | '+counterBeer+'x Beer | '+counterTotal+'x in total | '+counterSelf+'x myself');
    doRerender( rerender_indicator+1 );
  }

  if(watching) {
    clearTimeout(watchThrottling);
    watchThrottling = setTimeout( nextWatchingCycle, 1000);
  }
  
  counterSelf += 1;
  return (
    <View style={{flexDirection: 'column', alignItems: 'center'}}>
      <Text style={{fontSize: 30, fontWeight: '600'}}>Rerender Challenge</Text>
      <Text style={{fontSize: 13, fontWeight: '600', lineHeight: 20, textAlign: 'center' }}>
        {counterShowScreen}x Show | {counterChat}x Chat | {counterMsg}x Msg | {counterChatbox}x Box | {counterBeer}x Beer{'\n'}{rerender_indicator%2 ? '○' : '●'}
      </Text>
    </View>
  )
}

import {styles, colors} from '../utils/styles';
const style = StyleSheet.create({
  
});