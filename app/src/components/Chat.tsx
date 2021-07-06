import React, { useState, useRef, useEffect } from 'react';
import { View, Image,StyleSheet, Keyboard } from 'react-native';

import { FlatList } from 'react-native-gesture-handler';

import { Text, Icon } from '../utils/styles';
import { log, error, has } from '../utils/helpers';

import ENV from '../utils/env';

// CHAT MESSAGES

export default function Chat(props:any) {
  const {io, emit, user} = props;
  const [old_io_id, rememberIO] = useState<string>('');
  const [messages, showMessages] = useState<any[]>([]);
  const [lastMessageTimestamp, updateMessageTimestamp] = useState<number>(0);

  let flatList!:any; // ref

  const onMessage = function(message:any) {
    if(message.text) {
      message.time = (new Date()).getTime();       
      log('IO-Chat onMessage ('+message.user?.name+' @'+message.time+': '+message.text.slice(0,20)+') > '+messages.length+'x');
      
      messages.push(message);
      showMessages(messages);
      updateMessageTimestamp(message.time); // tells flatList if it should (not) rerender
    } 
    else error('IO-Chat onMessage (invalid)', message);
  }

  const onHi = function(user:any) {
    log("IO-Chat onHi", user);
    onMessage({
      text: "joined the show",
      user: {name: user.name, pic: user.pic}
    });
  }

  const Message = ({ pic, name, text }:{ pic:string, name:string, text:string }) => {
    
    props.countChildRerender(); // is there a difference between here and there?
   
    return (
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 8, /*backgroundColor: 'blue'*/}}>
        <Image source={{uri: pic}} style={{width: 40, height: 40, borderRadius: 40, marginRight: 10}} />
        <View style={{flex: 1}}>
          <Text style={{fontWeight:'500', fontSize: 14, lineHeight: 14, letterSpacing: 1, marginTop: 3}}>{name}</Text>
          <Text style={{fontWeight:'300', fontSize: 14, lineHeight: 16, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 1}}>{text}</Text>
        </View>
      </View>
    )
  };

  const renderItem = ({ item }:{ item:any }) => {
    
    return <Message pic={item.user.pic} name={item.user.name} text={item.text} />;

    // props.countChildRerender(); // is there a difference between here and there?

    // return (
    //   <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 8, /*backgroundColor: 'blue'*/}}>
    //     <Image source={{uri: item.user.pic}} style={{width: 40, height: 40, borderRadius: 40, marginRight: 10}} />
    //     <View style={{flex: 1}}>
    //       <Text style={{fontWeight:'500', fontSize: 14, lineHeight: 14, letterSpacing: 1, marginTop: 3}}>{item.user.name}</Text>
    //       <Text style={{fontWeight:'300', fontSize: 14, lineHeight: 16, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 1}}>{item.text}</Text>
    //     </View>
    //   </View>
    // )
  }

  useEffect(() => {
    if(old_io_id === io.id) error('IO-Chat mounted again for io.id='+io.id+' (avoided double binding)');
    else if(io.id){
      rememberIO(io.id);
      log('IO-Chat mounted for io.id='+io.id);
      io.on('hi', onHi);
      io.on('message', onMessage);
    }
    else log('IO-Chat mounted without io.id');
    return () => log('IO-Chat unmounted');
  }, [io.id]);


  props.countRerender();
  return (
    <View style={{flex: 1, marginBottom: 10/*, backgroundColor: 'pink'*/}}>
      <FlatList style={{marginRight: 10, backgroundColor: 'transparent'}}
        data={messages}
        renderItem={renderItem}
        extraData={lastMessageTimestamp} // tells flatList if it should (not) rerender
        keyExtractor={item => ''+item.time} // expects type string, key is dynamically added timestamp on arrival
        ref={ref => (flatList = ref)}
        onContentSizeChange={()=> flatList.scrollToEnd()}
      />
      {/* <ScrollView style={{paddingRight: 60, backgroundColor: 'transparent'}} contentContainerStyle={{display: 'flex', flexDirection: 'column-reverse'}}>
        { messages.map( (message) => (
          <View key={message.time} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 8}}>
            <Image source={{ur: message.pic}} style={{width: 40, height: 40, borderRadius: 40, marginRight: 10}} />
            <View>
              <Text style={{fontWeight:'500'}}>{message.user?.name}</Text>
              <Text>{message.text}</Text>
            </View>
          </View>
        ) ) }      
      </ScrollView> */}
    </View>
  )
}

import {styles, colors} from '../utils/styles';
const style = StyleSheet.create({
  
});