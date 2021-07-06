import React, { Component } from 'react';
import { Platform, Dimensions, StatusBar, Text, StyleSheet, TextStyle } from 'react-native';
import { log, error } from './helpers';

// font needs to be embedded in xcode: https://github.com/oblador/react-native-vector-icons/tree/204e49d8597bd792ea2011c4b93ced22eb9133ca#bundled-icon-sets
import Ionicon from 'react-native-vector-icons/Ionicons';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window')?.height,
  statusbar: StatusBar.currentHeight, // https://aamnah.com/reactnative/status-bar-customization-style-react-navigation-expo-react-native
};

// -- COLOR PALETTE ----

const TEST = false;

const baseColors = {
  primary: '#fff',
  secondary: '#222',
}

const extendedColors = {
  text: TEST ? 'grey' : baseColors.primary,
  light: baseColors.primary,
  dark: baseColors.secondary,

  nav: {
    border: TEST ? 'red' : '#333',
    background: TEST ? 'yellow' : '#222',
    label: {
      active: '#aaa',
      inactive: '#666',
    },
    icon: {
      active: '#ddd',
      inactive: '#888',
    }
  },

  container: {
    background: TEST ? 'orange' : undefined,
    safespace: TEST ? 'lightblue' : '#181818',
  },

  box: {
    background: TEST ? 'green' : '#333'
  },
}

const colors = {...baseColors, ...extendedColors};

// -- ICON SET ----

/*
 * all icons: https://oblador.github.io/react-native-vector-icons/
 * ionicons set: https://ionicons.com/
 */
const Icon = {
  basics: (props:any) =>          { return <Ionicon name={'grid'+(props.active?'':'-outline')} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  optimize: (props:any) =>        { return <Ionicon name={'flask'+(props.active?'':'-outline')} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  personality: (props:any) =>     { return <Ionicon name={'ribbon'+(props.active?'':'-outline')} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  sales: (props:any) =>           { return <Ionicon name={'shirt'+(props.active?'':'-outline')} size={props.size} style={[styles.icon, props.style, {color: props.color}]} />; },
  shows: (props:any) =>           { return <Ionicon name={'tv'+(props.active?'':'-outline')} size={props.size} style={[styles.icon, props.style, {color: props.color}]} />; },
  create: (props:any) =>          { return <Ionicon name={(props.active?'play-circle':'play-circle-outline')} size={props.size} style={[styles.icon, props.style, {color: props.color}]} />; },
  discover: (props:any) =>        { return <Ionicon name={'search'+(props.active?'':'-outline')} size={props.size} style={[styles.icon, props.style, {color: props.color}]} />; },
  me: (props:any) =>              { return <Ionicon name={'person'+(props.active?'':'-outline')} size={props.size} style={[styles.icon, props.style, {color: props.color}]} />; },
  cart: (props:any) =>            { return <Ionicon name={'cart'+(props.active?'':'-outline')} size={props.size} style={[styles.icon, props.style, {color: props.color}]} />; },
  heart: (props:any) =>           { return <Ionicon name={'heart'+(props.light?'-outline':'')} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  heartOutline: (props:any) =>    { return <Ionicon name={'heart-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  close: (props:any) =>           { return <Ionicon name={'close-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  live: (props:any) =>            { return <Ionicon name={'play'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  pause: (props:any) =>           { return <Ionicon name={'pause'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  eye: (props:any) =>             { return <Ionicon name={'eye'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  addCircle: (props:any) =>       { return <Ionicon name={'add-circle-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  follow: (props:any) =>          { return <Ionicon name={'add-circle'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  unfollow: (props:any) =>        { return <Ionicon name={'remove-circle'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  bag: (props:any) =>             { return <Ionicon name={'cart-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  share: (props:any) =>           { return <Ionicon name={'share-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  mic: (props:any) =>             { return <Ionicon name={'mic'+(props.active?'':'-outline')} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  micOn: (props:any) =>           { return <Ionicon name={'mic-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  micOff: (props:any) =>          { return <Ionicon name={'mic-off-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  calendar: (props:any) =>        { return <Ionicon name={'calendar'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  chatbubble: (props:any) =>      { return <Ionicon name={'chatbubble-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  phone: (props:any) =>           { return <Ionicon name={'call-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  card: (props:any) =>            { return <Ionicon name={'card-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  document: (props:any) =>        { return <Ionicon name={'document-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  happy: (props:any) =>           { return <Ionicon name={'happy-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  happyFilled: (props:any) =>     { return <Ionicon name={'happy'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  thumbs: (props:any) =>          { return <Ionicon name={'thumbs-'+(props.success?'up':'down')+'-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  thumbsUp: (props:any) =>        { return <Ionicon name={'thumbs-up-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  thumbsUpFilled: (props:any) =>  { return <Ionicon name={'thumbs-up-filled'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  videocam: (props:any) =>        { return <Ionicon name={'videocam-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  alert: (props:any) =>           { return <Ionicon name={'alert-circle-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  power: (props:any) =>           { return <Ionicon name={'power-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  cloud: (props:any) =>           { return <Ionicon name={'cloud-download-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  send: (props:any) =>            { return <Ionicon name={'send-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  chat: (props:any) =>            { return <Ionicon name={'chatbubbles-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  closeCircle: (props:any) =>     { return <Ionicon name={'close-circle-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  cameraReverse: (props:any) =>   { return <Ionicon name={'camera-reverse-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  camera: (props:any) =>          { return <Ionicon name={'camera'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  infoCircle: (props:any) =>      { return <Ionicon name={'information-circle-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  alarm: (props:any) =>           { return <Ionicon name={'alarm-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  code: (props:any) =>            { return <Ionicon name={'code-slash-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  notifications: (props:any) =>   { return <Ionicon name={'notifications-outline'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
  random: (props:any) =>          { return <Ionicon name={'beer'} size={props.size} color={props.color} style={[styles.icon, props.style, {color: props.color}]} />; },
}


// -- STYLE SHEET ----

const styles = StyleSheet.create({
  safeSpace: {
    flex: 1,
    backgroundColor: colors.container.safespace,
    marginTop: Platform.OS==='android' ? StatusBar.currentHeight : 0 // top bar in android is not excluded in safespace area
  },
  container: {
    flex: 1,
    backgroundColor: colors.container.background, // transparent
    color: colors.text,
    paddingTop: 0,
    paddingHorizontal: 20, // attention: not working for SafeAreaView
  },
  boxContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    display: 'flex',
    flex: 1,
    width: '100%'
  },
  box: {
    alignContent: 'stretch',
    width: '45%',
    height: 250,
    borderRadius: 8,
    backgroundColor: colors.box.background,
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  dFlex: {
    display: 'flex'
  },
  justifyContentCenter: {
    justifyContent: 'center'
  },
  alignItemsCenter: {
    alignItems: 'center'
  },
  alignCenter: {
    alignSelf: 'center'
  },
  flex: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  stretch: {
    alignSelf: 'stretch'
  },
  w100: {
    width: '100%'
  },
  h100: {
    height: '100%'
  },
  mb5: {
    marginBottom: 5
  },
  mx5: {
    marginHorizontal: 5
  },
  mt5: {
    marginTop: 5
  },
  mt10: {
    marginTop: 10
  },
  mt20: {
    marginTop: 20
  },
  mt30: {
    marginTop: 30
  },
  mt40: {
    marginTop: 40
  },
  pt5: {
    paddingTop: 5
  },
  pt10: {
    paddingTop: 10
  },
  pt20: {
    paddingTop: 20
  },
  pt30: {
    paddingTop: 30
  },
  pt40: {
    paddingTop: 40
  },
  text: {
    fontSize: 17,
    // fontFamily: (Platform.OS==='ios' ? 'HelveticaNeue' : 'Roboto'), // https://github.com/react-native-training/react-native-fonts
    fontWeight: '400',
    backgroundColor: TEST ? 'pink' : undefined,
    color: colors.text,
    textAlign: 'left',
  },
  small: {
    fontSize: 13,
  },
  h1: {
    alignSelf: 'stretch',
    fontSize: 50,
    fontWeight: '700',
    backgroundColor: TEST ? 'pink' : undefined,
    color: colors.text,
    marginTop: 20,
    letterSpacing: 5,
    zIndex: 1
  },
  h11: {
    alignSelf: 'stretch',
    fontSize: 50,
    fontWeight: '700',
    backgroundColor: TEST ? 'pink' : undefined,
    marginTop: 20,
    letterSpacing: 5,
    position: 'absolute',
    top: -5,
    left: 25,
    zIndex: 0,
    color: 'rgba(255,255,255,0.5)',
  },
  h2: {
    fontSize: 40,
    fontWeight: '600',
    color: colors.text
  },
  h3: {
    fontSize: 30,
    fontWeight: '600',
    color: colors.text
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.secondary,
    borderRadius: 25,
  },
  buttonText: {
    color: colors.text,
  },
  icon: {
    color: colors.text, // overwrites the props.color, so above we need to put the props.color within the props.style to overwrite it again
  },
  light: {
    color: colors.light,
  },
  dark: {
    color: colors.dark,
  },
  center: {
    alignSelf: 'center'
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 10,
    marginRight: 5,
    borderRadius: 10,
    overflow: 'hidden',
    fontSize: 14
  },
  showHost: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 0,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor:'rgba(255,0,0,1)'
  },
  showMeta: {
  },
  textInput: {
    flex: 1,
    color: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e3e3e3',
    borderRadius: 50,
    minHeight: 50,
    padding: 10,
    fontSize: 17,
    marginVertical: 2
  },
  field: {
    width: 300,
    color: '#449aeb',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  }
});

// -- STYLE INHERITANCE ----

// set default style definitions like font family for <Text> to avoid <Text style="styles.text">
// https://medium.com/@fullsour/style-inheritance-of-react-native-eca1c974f02b
// https://stackoverflow.com/questions/47561848/property-value-does-not-exist-on-type-readonly
class MyText extends Component<{style?: TextStyle | Array<any>, onPress?:any}> {
  render() { return <Text {...this.props} style={[styles.text, this.props.style]}>{this.props.children}</Text> }
}

// https://medium.com/@etherealm/named-export-vs-default-export-in-es6-affb483a0910
export { colors, styles, dimensions, Icon, MyText as Text };