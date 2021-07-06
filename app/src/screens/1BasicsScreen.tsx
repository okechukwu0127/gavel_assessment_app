/**
 * BASICS CHALLENGE
 *
 * This challenge is about common javascript patterns. But I hope it is more exciting than common challenges.
 * As I do not like challenges like 'reverse all words of an array' as I think they are just theoretical tests,
 * I tried to create 4 challenges, which are more exciting for you and more meaningful for Gavel.
 *  1) 'Data tranformation', is about ES6 methods for arrays and objects
 *  2) 'Destructuring assignment', is just a small exercise to show that you understood it
 *  3) 'Date formatting', is self-explaining I guess and quite important to every project
 *  4) 'Promises', is maybe the hardest of the 4 and should show me that you understand the differences between callbacks and promises
 *
 * I would propose to start with:
 *  - reading the challenges array in :66 to understand the exercises and their inputs and outputs
 *  - reading the runChallenge (in useEffect) and renderChallenge methods to understand how I test your code
 *  - write code in the certain methods as described in the comments above the methods
 *
 * I wish you a lot of fun!
 */

import ENV from '../utils/env';
import API from '../utils/api';
import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  NativeModules,
  Alert,
} from 'react-native';

import {log, error} from '../utils/helpers';

import {useNavigation} from '@react-navigation/native';

type challengeType = {
  key: number;
  title: string;
  input: any;
  output: any;
  test: (input: any, output: any) => any;
};

export default function BasicsScreen() {
  const navigation = useNavigation();

  const backgrounds = [
    require('../assets/bgs/' + 1 + '.jpg'),
    require('../assets/bgs/' + 2 + '.jpg'),
    require('../assets/bgs/' + 3 + '.jpg'),
    require('../assets/bgs/' + 4 + '.jpg'),
  ];

  const countries = {
    us: {timezone: -5, code: '1', flag: '🇺🇸'},
    at: {timezone: 2, code: '43', flag: '🇦🇹', headquarter: true},
    ge: {timezone: 4, code: '995', flag: '🇬🇪'},
  };

  /**
   * BASIC CHALLENGES
   *
   * Here are 4 challenges with input and output values.
   * You see in the test method how the output is checked.
   * Please check out the related functions below for further details.
   */

  const [challenge1, setChallenge1] = useState(false);
  const [challenge2, setChallenge2] = useState(false);
  const [challenge3, setChallenge3] = useState(false);
  const [challenge4, setChallenge4] = useState(false);

  const challenges: challengeType[] = [
    {
      key: 1,
      title: 'Data tranformation',
      input: {
        32: {user: 'pika_loco', phone: '+18572304822'},
        124: {user: 'pokehunter', phone: '+4323902323'},
        523: {user: 'collector', phone: '+995598349349'},
      },
      output: [
        {id: 32, user: 'pika_loco', country: 'us'},
        {id: 124, user: 'pokehunter', country: 'at'},
        {id: 523, user: 'collector', country: 'ge'},
      ],
      test: (input, output) =>
        setChallenge1(
          JSON.stringify(rebuildTheObject(input)) === JSON.stringify(output)
            ? true
            : false,
        ),
    },

    {
      key: 2,
      title: 'Destructuring assignment',
      input: countries,
      output: '🇦🇹',
      test: (input, output) =>
        setChallenge2(findTheHeadquarter(input) === output ? true : false),
    },

    {
      key: 3,
      title: 'Date formatting',
      input: new Date(new Date().getTime() + (24 * 2 + 4.1) * 60 * 60 * 1000),
      output: {
        in: 'in 2 days 4 hours',
        at: /^[a-zA-Z]*, [0-9\-\/\.]* at [0-9]{1,2}:[0-9]{1,2}$/,
      },
      test: (input, output) =>
        setChallenge3(
          formatDatetime(input).in === output.in &&
            formatDatetime(input).at.match(output.at)
            ? true
            : false,
        ),
    },

    {
      key: 4,
      title: 'Promise rewriting *', // * thumbsup will appear a few seconds delayed
      input: new Date(),
      output:
        'this challenges result is set asynchronously as it takes some time and does not return a boolean instantly',
      test: input => startTraveling(input),
    },
  ];

  /**
   * BASIC CHALLENGE 1
   *
   * The first test is about array methods.
   * Try to write it beautiful and smart. It should be formatted nice, it well to read.
   * Try to use native ES6 array methods over loops.
   * You get an {object} as an input and should return an [array].
   * You have the countries object above for connecting the country.
   * It is also about hiding the phone number from the output (GDPR-wise).
   */
  const rebuildTheObject = (input: {}) => {
    // log('challenge #1 rebuildTheObject');
    let output: any[] = [];
    //log(input);
    let arr = [];

    const objArray = Object.entries(input);

    let i = 0;
    objArray.forEach(([key, value]) => {

      let data = {
        id: parseInt(key),
        user: value.user,
        country: Object.keys(countries)[i],
      };
      // console.log(data);

      arr.push(data);

      
      i++;
    });

    let outputt = [
      {id: 32, user: 'pika_loco', country: 'us'},
      {id: 124, user: 'pokehunter', country: 'at'},
      {id: 523, user: 'collector', country: 'ge'},
    ];
    //console.log(outputt);
    //console.log(Arr);

    // put your code here
    return arr;
  };

  /**
   * BASIC CHALLENGE 2
   *
   * This second test is much shorter, it is just about 1 assignment.
   * Please use the countries object from above to find the entry with {headquarter: true}
   * There are many ways to Rome, but you have to use destructuring assignment in here!
   */
  const findTheHeadquarter = (input: {}) => {
    log('challenge #2 findTheHeadquarter');
    let output: string = '';

    //console.log(input);

    let Flag = '';

    const objArray = Object.entries(input);

    let i = 0;
    objArray.forEach(([key, value]) => {
      if (value.hasOwnProperty('headquarter')) {
        Flag = value.flag;
      }

      i++;
    });

    //console.log(Flag);
    // put your code here
    return Flag;
  };

  /**
   * BASIC CHALLENGE 3
   *
   * This exercise is about working with dates.
   */
  const formatDatetime = (input: Date) => {
    log('challenge #3 formatDatetime (' + input + ')');
    /* let output = {
      at: '', // formatted like 'WEEKDAY, DATE at HH:MM' (check out regex above: DATE is quite flexible, like Y/M/D or D/M/Y or D.M.Y)
      in: '', // formatted like 'in 2 days 4 hours'
    }; */
    
    var theevent = new Date(input);
    var now = new Date();
    var sec_num = (theevent - now) / 1000;
  
    var month = now.getUTCMonth() + 1; //months from 1-12
    var day = now.getUTCDate();
    var year = now.getUTCFullYear();
    var weekday = now.toLocaleString('default', {weekday: 'long'});


    var days = Math.floor(sec_num / (3600 * 24));
    var hours = Math.floor((sec_num - days * (3600 * 24)) / 3600);
    var minutes = Math.floor(
      (sec_num - days * (3600 * 24) - hours * 3600) / 60,
    );
    var seconds = Math.floor(
      sec_num - days * (3600 * 24) - hours * 3600 - minutes * 60,
    );

    if (hours < 10) {
      hours = '' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    let output = {
      in: 'in ' + days + ' days ' + hours + ' hours',
      at:
        weekday +
        ', ' +
        month +
        '/' +
        day +
        '/' +
        year +
        ' at ' +
        hours +
        ':' +
        minutes,
    };
    console.log(output);
    
    return output;
  };

  /**
   * BASIC CHALLENGE 4
   *
   * In this third test you have to change the following code.
   * Right now it is based on callbacks and you have to change it to promises.
   * Just try to keep the results, but use promises instead of callbacks.
   * You can also copy the challenge to compare the code.
   */

  const finishTraveling = (started: Date, finished: Date) => {
    log('challenge #4 finishTraveling');
    const seconds = (finished.getTime() - started.getTime()) / 1000;
    setChallenge4(seconds > 7 && seconds < 8); // here the result is set
  };

  const startTraveling = (started: Date) => {
    log('challenge #4 startTraveling');

   //console.log(started); 
    // change the following code
    continueWalking(() => {
      continueRunning(() => {
        continueSwimming(() => {
          finishTraveling(started, new Date());
        });
      });
    });
  };
  const continueWalking = (callback: any) => {
    log('challenge #4 continueWalking');
    // change this code as well
    setTimeout(() => callback(), 3000);
  };

  const continueRunning = (callback: any) => {
    log('challenge #4 continueRunning');
    // change this code as well
    setTimeout(callback, 1500);
  };

  const continueSwimming = (callback: any) => {
    log('challenge #4 continueSwimming');
    // change this code as well
    setTimeout(callback, 2500);
  };

  /**
   * Now we start is about running and rendering the challenges
   */

  const runChallenges = () => {
    log('challenges running once at useEffect');
    challenges.forEach(challenge => {
      log('challenge #' + challenge.key + ' running once at useEffect');
      challenge.test(challenge.input, challenge.output);
    });
  };

  const renderChallenge = (item: any) => {
    const challenge = item.item;
    const k = challenge.key;
    let success =
      k == 1
        ? challenge1
        : k == 2
        ? challenge2
        : k == 3
        ? challenge3
        : challenge4; // not very beautiful but do you have another idea? having it in a {} state to access it with [key], does not trigger rerenders
    log('challenge #' + challenge.key + ' rendering (' + success + ')');

    return (
      <View style={[styles.showHost, style.itemOuter]}>
        <ImageBackground
          source={backgrounds[challenge.key - 1]}
          style={{flex: 1, justifyContent: 'center'}}
          resizeMode="cover">
          <View style={style.itemShadow}>
            <View style={style.itemInner}>
              <View>
                <Icon.thumbs
                  success={success}
                  color={'#fff'}
                  size={50}
                  style={{alignSelf: 'center'}}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '500',
                    textAlign: 'center',
                    marginTop: 5,
                  }}>
                  {challenge.title}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  React.useEffect(() => {
    runChallenges();
  }, []);

  log('basics rerendering');

  return (
    <SafeAreaView style={styles.safeSpace}>
      <View style={[styles.container]}>
        <Text style={styles.h1}>Basics</Text>
        <Text style={{marginBottom: 20}}>
          Try to collect 4 thumbs up by solving the challenges in the file
          BasicsScreen.tsx!
        </Text>

        <FlatList
          data={challenges}
          renderItem={renderChallenge}
          keyExtractor={challenge => '' + challenge.key}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
}

import {styles, Text, Icon} from '../utils/styles';
const style = StyleSheet.create({
  itemOuter: {
    flexDirection: 'column',
    backgroundColor: 'rgba(200,200,200,0.2)',
    padding: 0,
    marginHorizontal: '1%',
    marginBottom: '2%',
    width: '48%',
    minHeight: 250,
  },
  itemInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 20,
  },
  itemShadow: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
  },
});
