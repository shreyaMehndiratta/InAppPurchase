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
import { buySubscription } from './utils';

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
      <ScrollView contentContainerStyle={{ marginTop: 30, }} >
        <Text style={{ alignSelf: 'center' }}>Subscriptions:</Text>
        {availableSubscriptions?.map((item) =>
          <View style={{ marginHorizontal: 24 }}>
            <View style={styles.contentView}>
              <Text>{item?.title || '-'}</Text>
              <TouchableOpacity style={styles.buttonStyle} onPress={() => buySubscription(item)}>
                <Text style={{ color: 'white' }}>Buy</Text>
              </TouchableOpacity>
            </View>
            <Text >{item.localizedPrice}</Text>
          </View>
        )}
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
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40
  },
  buttonStyle: {
    height: 50,
    width: 100,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  }
});

export default App;
