/**
 * RERENDER CHALLENGE
 * 
 * This challenge is about understanding certain react native approaches and patterns.
 * The goal is to optimize the screen and its components and avoid wasted rerenders. You can change/optimize/propose whatever you think is good.
 * The actual goal for me is, that you show that you understand the code and and the interactions between components.
 * I developed the "Counter" component to give you an easy way of "playing around" and seeing the outcome of your changes.
 * Some parts of the code are quite "un-optimized" as I placed some anti-patterns in there, which cause wasted rerenders by purpose. Please fix them.
 * Most important is that you try to understand how:
 *  - class components, functional components
 *  - referencing, props, hooks
 *  - mounting, rerendering
 *  - states, variables, (anonymous) functions
 * 
 * I would propose you start with:
 *  - understanding how the chat and all buttons work, by clicking around and typing messages in the chatbox
 *  - checking out the counter component to understand the goal of this challenge better
 *  - reading the comments carefully (some are notes for myself, but some are hints for you)
 *  - reading the socket.io on() bindings (in all components!) to better understand how data is processed
 *  - optimizing the states
 *  - optimizing ifs and function calls in render
 *  - optimizing components and child components
 * 
 * Hint: Please use comments to explain what you did. You can also add a bigger comment up here.
 */

import React, { useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Image, Button, TextInput, Pressable, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator, Platform, ImageBackground, KeyboardAvoidingView } from 'react-native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { Text, Icon } from '../utils/styles';
import { log, error, has } from '../utils/helpers';
import ENV from '../utils/env';
import API from '../utils/api';

import IO, {Socket} from 'socket.io-client';

import Chat from '../components/Chat';
import Chatbox from '../components/Chatbox';
import Counter from '../components/Counter';


// FUNCTION-BASED COMPONENT
// the ShowScreen is a class component which is wrapped in a functional component
// the reason is that navigation/route hooks are not working with class components
// so we wrapped around a functional component and passed the props
// https://reactnavigation.org/docs/use-navigation "Using with class component"
export default function(props:any) {
  log('Show function');
  type RouteParams = { 'ShowScreen': {show:any} };
  const route = useRoute<RouteProp<RouteParams, 'ShowScreen'>>();
  const navigation = useNavigation();
  return <ShowScreenClass {...props} route={route} navigation={navigation} />;
}

// TYPE(SCRIPT) DEFINITIONS

type ShowProps = {
  route:any,
  navigation:any,
}

type ShowStates = {
  keyboardStatus:boolean,
  userCount:number,
  is_initializing:boolean,
  is_initialized:boolean,
  is_connected:boolean,
}

// CLASS-BASED COMPONENT
class ShowScreenClass extends React.Component<ShowProps, ShowStates> { 

  // VARIABLES

  state = { // pay attention to use states only for attributes that trigger a ui change (state change => ui rerender)
    keyboardStatus: false,
    userCount: 0,
    is_initialized: false, // is_initialized is a state with ui change
    is_initializing: false, // is_initializing is just a toggle to not run the function twice (but without ui change)
    is_connected: false, // is_connected is also just a toggle without ui change
  }

  is_registered:boolean = false; // a toggle without ui change
      
  io!:Socket; // !: is a 'Definite Assignment Assertion' and tells that the initialization is at runtime
  background = require('../assets/elements/blurrybackground.jpg'); // { uri: "https://letsgavel.com/assets/blurrybackground.jpg" }
  
  focusHandler!:any;
  unfocusHandler!:any;

  // RERENDER COUNTERS

  countShowScreen = () => log('Rendering ShowScreen'); // overwritten as soon as Counter is mounted (very first rerenders are not counted)
  countChat = () => log('Rendering Chat');
  countMsg = () => log('Rendering Message (child of Chat)');
  countChatbox = () => log('Rendering Chatbox');
  countBeer = () => log('Rendering Beer (child of Chatbox)');
  startCounter = () => log('Rendering Counter Start');
  stopCounter = () => log('Rendering Counter Stop');

  refCounters = (counter:{countShowScreen:()=>void, countChat:()=>void, countMsg:()=>void, countChatbox:()=>void, countBeer:()=>void, startCounter:()=>void, stopCounter:()=>void}) => { 
    this.countShowScreen = counter.countShowScreen;
    this.countChat = counter.countChat;
    this.countMsg = counter.countMsg;
    this.countChatbox = counter.countChatbox;
    this.countBeer = counter.countBeer;
    this.startCounter = counter.startCounter;
    this.stopCounter = counter.stopCounter;
  }

  // STREAMING

  connectIO = () => {
    if(this.state.is_initializing || this.state.is_initialized){
      log('IO '+(this.state.is_initialized ? 'initialized' : 'initializing')+' (already '+this.io.connected+' '+this.io.id+')');
    } else {
      log('IO initializing');
      this.setState({ is_initializing: true }); // is_initializing does not need to be a state compared to is_initialized, as the ui does not change here

      this.io = IO( ''+ENV.BACKEND_URL, { 'path': '/io'} );

      this.io.on('connect', this.onConnect);
      this.io.on('register', this.onRegistered); // send to 1 specific client if it comes online to confirm established connection

      this.io.on('hi', this.onHi);     // broadcasted when user goes online
      this.io.on('bye', this.onBye);   // broadcasted when user goes offline 

      log('IO binded');
      this.setState({ is_initialized: true }); // is_initializing does not need to be a state compared to is_initialized, as the ui does not change here
    } 
  }

  disconnectIO = () => {
    if(this.state.is_connected){
      this.io.disconnect();
      this.setState({ is_connected: false });
      log('IO disconnected');
    } else {
      log('IO already disconnected');
    }
  }

  // IO HANDLERS

  emit = (eventname:string, params:any) => {
    log('IO emit ('+eventname+')');
    if(typeof params != 'object') params = {};
    this.io.emit(eventname, params);
  }

  onConnect = () => {
    log("IO onConnect");
    this.setState({ is_connected: true }); // is_connected is a state, but does not trigger an UI change
    this.emit('hi', {name: ENV.NAME});
  }

  onRegistered = (data:any) => {
    log("IO onRegistered", data);
    this.is_registered = true; // is_registered is not a state compared to is_initialized. think about which of the states really need to be a state
  }

  onHi = (data:any) => {
    log("IO onHi", data);
    this.setState({ userCount: this.state.userCount+1 });
  }

  onBye = (data:any) => {
    log("IO onBye", data);
    this.setState({ userCount: this.state.userCount-1 });
  }

  // KEYBOARD

  bindKeyboard = () => {
    log('Show bindKeyboard');
    Keyboard.addListener("keyboardDidShow", this.onKeyboard);
    Keyboard.addListener("keyboardDidHide", this.offKeyboard);
  }
  unbindKeyboard = () => {
    log('Show unbindKeyboard');
    Keyboard.removeListener("keyboardDidShow", this.onKeyboard);
    Keyboard.removeListener("keyboardDidHide", this.offKeyboard);
  }
  onKeyboard = () => { log('Show onKeyboard'); this.setState({keyboardStatus: true}); }
  offKeyboard = () => { log('Show offKeyboard'); this.setState({keyboardStatus: false}); this.afterKeyboard(); }
  afterKeyboard = () => { log('Show offKeyboard (is away)'); }
  
  // MISC

  showError = (msg:string, err:any) => {
    error('Show error ('+msg+')', err);
    Alert.alert(msg);
  }

  // REACT

  constructor(props:any) {
    super(props);
    log('Show created');
  }

  componentDidMount() {
    log('Show mounted');
    this.bindKeyboard();
    this.connectIO();

    this.focusHandler = this.props.navigation.addListener('focus', ()=>{
      log('Show focussed');
      this.startCounter();
    });
    this.unfocusHandler = this.props.navigation.addListener('blur', ()=>{
      log('Show unfocussed');
      this.stopCounter();
    });
  }

  componentWillUnmount(){
    log('Show unmounted');
    this.unbindKeyboard();
    this.disconnectIO();

    this.focusHandler();
    this.unfocusHandler();
  }

  componentDidUpdate = () => {
    log('Show updated');
  }

  componentWillRender = () => {
    this.countShowScreen();
  }

  // --------- RENDERING ---------

  render() {
    this.componentWillRender();

    let show = {
      title: 'LIVE CARD BREAKS',
      profile_img_url: 'https://dl.airtable.com/.attachments/8cf780dcda3a34d5efad0fcd632a3ca5/03e76d7e/profile.jpg',
      seller: 'poke_hunter',
    };

    return (
      <ImageBackground style={styles.flex} source={this.background}>
        <View style={style.wrapper}>
          <SafeAreaView style={[styles.flex, style.androidVerticalPadding]}>
            <View style={styles.container}>
              <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height:'100%'}}>

                <View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>                    
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', flex: 1, overflow: 'hidden', flexWrap: 'wrap'}}>
                      <Text style={{fontSize: 25, fontWeight: '500', maxHeight: 30, marginVertical: 10}}>
                        {show.title}&nbsp;
                      </Text>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.badge}>
                          { this.state.is_initialized && <Icon.live color="#fff" /> }
                          { !this.state.is_initialized && <Icon.pause color="#fff" /> }
                          { this.state.is_initialized ? 'Live' : 'Wait' }
                        </Text>
                        <Text style={styles.badge}><Icon.eye color="#fff" /> {this.state.userCount}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
                    <Image source={{uri: show.profile_img_url}} style={{width: 50, height: 50, borderRadius: 50}} />
                    <View style={{marginLeft: 10}}>
                      <Text style={{fontSize: 20, fontWeight: '500'}}>{show.seller}</Text>
                      <Text style={{fontSize: 12, fontWeight: '500', backgroundColor: 'rgba(244, 179, 0, 0.6)', borderRadius: 10, overflow: 'hidden', width: 80, textAlign: 'center', marginTop: 5, paddingVertical: 1}}>
                        <Icon.follow size={12} color="#fff" />
                        &nbsp;Follow
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[style.showStartsInBox, {alignItems: 'center', borderWidth: 1, borderStyle: 'solid', borderColor: '#ffffff80', borderRadius: 10, paddingVertical: 20}]}>
                  <Counter refCounters={this.refCounters} io={1}></Counter>
                </View>

                { this.state.is_initialized ? (

                  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={60} style={{flex: 1}} >
                    <View style={[{flex: 1, justifyContent: 'flex-end'}]} onStartShouldSetResponder={()=>false}>
                      <View style={{height: 300, maxHeight: (this.state.keyboardStatus ? 130 : 300), flexDirection: 'row'}}>

                        <Chat countRerender={this.countChat} countChildRerender={this.countMsg} io={this.io} emit={(name:string,data:any)=>this.emit(name,data)} show={show} onError={this.showError} />

                      </View>

                      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                        
                        <Chatbox countRerender={this.countChatbox} countChildRerender={this.countBeer} io={this.io} emit={(name:string,data:any)=>this.emit(name,data)} show={show} onError={this.showError} />
                        
                      </View>
                    </View>
                  </KeyboardAvoidingView>

                ) : (

                  <Text style={{textAlign: 'center'}}>Show is loading{'\n'}Check if your node server is running.</Text>
                
                )}
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    );
  }
}

import {styles} from '../utils/styles';
const style = StyleSheet.create({
  wrapper:{
    flex: 1,
    justifyContent: 'flex-start',
  },
  countdownBox: {
    height: 100, position: 'absolute', left: 0, right: 0, top: 250, justifyContent: 'center'
  },
  countdownText: {
    fontSize: 60,
    lineHeight: 100,
    height: 100,
    fontWeight: '600',
    textShadowRadius: 20,
    textShadowColor: '#999',
    alignSelf: 'center',
    textAlign: 'center',
    width: '100%',
  },
  showStartsInBox: {
    position: 'absolute', left: 0, right: 0, top: 160, justifyContent: 'center'
  },
  keyboardActive: {
    // Push input field to visible part of screen when keyboard is visible (only needed for iOS)
    marginBottom: Platform.OS === 'ios' ? 60 : 0
  },
  androidVerticalPadding: {
    paddingVertical: Platform.OS === 'android' ? 0 : 0
    //paddingVertical: Platform.OS === 'android' ? 20 : 0 // only necessary in fullscreen
  },
  absoluteFullscreen: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    zIndex: 0,
    // backgroundColor: 'red'
  },
});