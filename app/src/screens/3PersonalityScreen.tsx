/**
 * API/SERVER & PERSONALITY TEST CHALLENGE
 * 
 * This challenge is splitted into 2 parts. You have to make the button work.
 * As soon as the button works, it will lead you to a personality test.
 * This personality test will take 30-45 minutes, but once completed you get a very interesting analysis about your person.
 * I promise, it will be beneficial for yourself as well, no matter if you start working for Gavel or not.
 * It's definitely the most exciting personality test, I ever did – it is made by RedBull for their best athletes.
 * 
 * Summed up:
 *  1) button click
 *  2) the app calls the local server at http://localhost:3000
 *  3) the local server calls my server at https://letsgavel.com
 *  4) button opens the returned URL in the browser
 *  5) you do the personality test there
 *  6) you send the PDF report to me
 * 
 * I would propose to start with:
 *  - checking out the API call below
 *  - checking out the endpoint of this call in the file ../../../server/src/api.js
 *  - understanding the response from my server at https://letsgavel.com
 *  - in this response you will find an explanation how to fix it
 *  - as soon as you get the right URL as a response from https://letsgavel.com,
 *  - you can forward it to the App and replace the Alert with an Linking.openURL
 * 
 * Hint: Doing the personality test is not part of the coding challenge anymore.
 * You do not have to do the personality test to submit your code challenge.
 * I would highly recommend it to you, but you can do it later on for example.
 *
 * If you finished with all 3 challenge screens, open http://localhost:3000 to submit your work
 */

import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Button, TextInput, Pressable, Alert, TouchableOpacity,Linking } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { log, error } from '../utils/helpers';
import { Text, Icon } from '../utils/styles';
import API from '../utils/api';
import ENV from '../utils/env';

export default function PersonalityScreen() {
  const navigation = useNavigation();

  const openPersonalityTest = async () => {
    log('openPersonalityTest');

    API.get('/api/personalitytest')
      .then((res) => {
       log(res.data);
        if (res.data.url) Linking.openURL(res.data.url);// Alert.alert('Congrats '+ENV.NAME+', you got an URL. Now delete this alert and let the button open the returned URL in the phone\'s browser.');
        else Alert.alert('Sadly you dont get a valid URL so far. Check out PersonalityScreen.tsx and ./server/src/api.js for further instructions');
        
      })
      .catch((err) => {
        error(err);
        log(err.response.data);
        Alert.alert('Sadly you dont get a valid URL so far. You even get an exception. Check out PersonScreen.tsx and/or restart your node server in the terminal');
      });
  }

  return (
    <SafeAreaView style={styles.safeSpace}>
      <View style={styles.container}>
        <Text style={styles.h1}>API Call</Text>
        <Text style={{marginBottom: 20}}>In this challenge you need to code an API endpoint in the node server.</Text>

        <View style={[styles.dFlex, styles.justifyContentCenter, styles.alignItemsCenter, {flex: 1, paddingBottom: 80}]}>
          <Icon.happy size={60} color='#fff' />
          <Text style={[styles.h2, {textAlign: 'center'}]}>Personality Test</Text>
          <Text style={style.p}>We believe that it has to be a great fit between us, not only on the tech level, so we kindly ask you to invest 30-45 min making a personality test. It is one of the greatest personality tests, I ever did, created by Redbull. So have fun!</Text>
          <View style={[styles.w100, styles.mt20]}>
            <Button
              title="Open Personality Test"
              onPress={openPersonalityTest}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );

}

import {styles} from '../utils/styles';
import api from '../utils/api';
import env from '../utils/env';
const style = StyleSheet.create({
  p: {
    textAlign: 'center',
    marginTop: 30
  }
});