import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet, Keyboard } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import Beer from './Beer';

import { Text, Icon } from '../utils/styles';
import { log, error, has } from '../utils/helpers';

import ENV from '../utils/env';

// CHAT INPUT

export default function Chatbox(props:any) {
  const {io, emit, user, show} = props;
  const [old_io_id, rememberIO] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const emitMessage = () => {
    if(message.length >= 1) {
      log('IO-Chatbox emitMessage ('+message+')');
      emit('message', { 'text': message, 'user': user, 'time': new Date() } );
      setMessage('');
    } else {
      log('IO-Chatbox emitMessage (invalid)', message);
    }
  }

  const emitLike = () => {
    log('IO-Itembox emitLike to io.id='+io.id, user);
    emit('message', { 'text': '\u2764\uFE0F', 'user': user, 'time': new Date() } );
  }

  const emitWow = () => {
    log('IO-Itembox emitWow to io.id='+io.id, user);
    emit('message', { 'text': '🤩', 'user': user, 'time': new Date() } );
  }

  const emitThumbsUp = () => {
    log('IO-Itembox emitThumbsUp to io.id='+io.id, user);
    emit('message', { 'text': '👍', 'user': user, 'time': new Date() } );
  }

  const simulatedMessages = [
    'Click on the beer, on the emojis and type something into the chatbox!',
    'Use the soft keyboard as showing/hiding the keyboard also triggers rerenders!',
    'Try to minimize rerenders as much as you can, without breaking the chat!',
    'How are you?',
    'I think you are a great programmer 🤓',
    'Take your time!',
    'You ll be judged on base of your coding approaches and creativity, not time ⏳',
    'I think this chat is cool!',
    'Hope you enjoy the challenge so far 🤩',
    'The challenge should give you a good insight in what we are doing 😎',
    'The challenge should be special compared to other companies challenges 🤩',
    'The challenge should make fun 🎉',
    'I am doing fine! You?',
    'I love the cat pics 😻',
    'I would like dog pics more 🐶 gonna switch it in ./server/src/io.js?',
  ];

  const simulateMessage = (text:string) => {
    log("IO-Chatbox simulateMessage");
    const i = Math.floor(Math.random() * simulatedMessages.length);
    emit('message', { random: true, text: text || simulatedMessages[i] });
  }

  const simulateMessages = (count:number) => {
    log("IO-Chatbox simulateMessages");
    for(let time_between=500,i=0; i<count; i++){
      time_between += Math.floor( Math.random() * (500 - 50) + 50);
      setTimeout(simulateMessage, time_between);
    }
  }

  const respondWithHi = (data:any) => {
    log("IO-Chatbox onHi respondWithHi");
    simulateMessage( 'Hi '+ENV.NAME+' 👋' );
  }

  const respondWithSimulatedMessages = (data:any) => {
    if(! data.random) { // only respond to real messages
      log("IO-Chatbox respondWithSimulatedMessage");
      simulateMessages( 2 );
    }
  }

  useEffect(() => {
    if(old_io_id === io.id) error('IO-Chatbox mounted again for io.id='+io.id+' (avoided double binding)');
    else if(io.id) {
      rememberIO(io.id);
      log('IO-Chatbox mounted for io.id='+io.id);
      io.on('hi', respondWithHi);
      io.on('message', respondWithSimulatedMessages);
    
      simulateMessages(2);
    }
    else log('IO-Chatbox mounted without io.id');
    return () => log('IO-Chatbox unmounted');
  }, [io.id]);


  props.countRerender();
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
      <View style={[style.chatbox]}>
        
        <TextInput
          value={message} 
          onChangeText={(v) => setMessage(v)} 
          placeholder="Write here ..."
          placeholderTextColor={colors.primary}
          autoCompleteType="off" 
          keyboardType="default" 
          returnKeyType="send" 
          enablesReturnKeyAutomatically={true}
          autoCapitalize='none'
          autoCorrect={false} 
          spellCheck={false} 
          importantForAutofill="no"
          style={[style.chatfield]}
          onSubmitEditing={()=>emitMessage()}
          blurOnSubmit={false}
        />

        {message.length >= 1 ?
          <Pressable style={style.send} onPress={()=>emitMessage()}>
            <Text><Icon.send style={{fontSize: 25}} color='#fff' /></Text>
          </Pressable>
        :
          <View style={{flexDirection: 'row', position: 'absolute', right: 10, top: 12}}>
            <Pressable style={style.emoticonBarIcon} onPress={()=>emitLike()}>
              <Text style={{fontSize: 20}}>❤</Text>
            </Pressable>
            <Pressable style={style.emoticonBarIcon} onPress={()=>emitWow()}>
              <Text style={{fontSize: 20}}>🤩</Text>
            </Pressable>
            <Pressable style={style.emoticonBarIcon} onPress={()=>emitThumbsUp()}>
              <Text style={{fontSize: 20}}>👍</Text>
            </Pressable>

          </View>
        }

      </View>

      <Beer countRerender={()=>props.countChildRerender()} simulateMessages={(count:number) => simulateMessages(count)} />
    </View>
  )
}

import {styles, colors} from '../utils/styles';
const style = StyleSheet.create({
  chatbox:{
    flex: 1,
    position: 'relative',
    height: 50
  },
  chatfield: {
    flex: 1,
    color: colors.primary, 
    borderWidth: 1, 
    borderStyle: 'solid', 
    borderColor: '#e3e3e3', 
    borderRadius: 50, 
    minHeight: 50, 
    padding: 10,
    paddingRight: 40, 
    fontSize: 17
  },
  send: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  emoticonBarIcon: {
    marginHorizontal: 3
  },
});