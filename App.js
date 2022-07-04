/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as RNIap from 'react-native-iap';

const App = () => {
  const [availableSubscriptions, setAvailableSubscriptions] = useState([]);

  const items = Platform.select({
    ios: ["TestProduct"],
    android: [""]
  })

  useEffect(() => {
    RNIap.initConnection().catch((err) => {
      console.log("Error connecting", err)
    }).then(() => {
      console.log("Connected to Store")
      RNIap.getSubscriptions(items).catch((err) => {
        console.log("Error Finding Subscriptions", err)
      }).then((res) => {
        console.log("Subscriptions:", res)
        setAvailableSubscriptions(res)
      })
    })
  }, [])

  return (
    <SafeAreaView >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          marginTop: 30,
          alignItems: 'center'
        }}
      >

        {availableSubscriptions?.map((item) => {
          return (
            <Text>{item?.title || '-'}</Text>
          )
        })}
        <Text></Text>
        {/* <TouchableOpacity onPress={() => { }}>
            <Text style={{ color: 'white' }}>Buy Subscription</Text>
          </TouchableOpacity> */}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
