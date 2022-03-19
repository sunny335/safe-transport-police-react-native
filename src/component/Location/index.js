import React, {useState} from 'react';
import type {Node} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Alert,
  Button,
  ImageBackground,
  Image,
  PermissionsAndroid,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import image1 from '../image/loginBg.png';
import location from '../image/location.png';

const Location = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [locations, setLocations] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#ffff' : '#ffff',
  };

  const HandleLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Example App',
          message: 'Example App access to your location ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the location');
        // alert('You can use the location');
        navigation.navigate('HomeScreen', {name: 'HomeScreen'});
      } else {
        console.log('location permission denied');
        alert('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <>
      <StatusBar barStyle={isDarkMode ? '#fff' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <ImageBackground
          source={image1}
          resizeMode="cover"
          style={{paddingBottom: 149}}>
          <View>
            <View>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  marginTop: 82,
                  fontWeight: '600',
                  fontSize: 36,
                  color: '#fff',
                }}>
                SAFE
              </Text>
            </View>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                marginTop: 0,
                fontWeight: '400',
                fontSize: 16,
                color: '#fff',
                textTransform: 'uppercase',
              }}>
              Transport
            </Text>
          </View>
        </ImageBackground>

        <View style={{marginLeft: 43, marginRight: 43}}>
          <Text
            style={{
              flex: 1,
              marginTop: 20,
              marginBottom: 26,
              fontWeight: '700',
              fontSize: 24,
              color: '#03CA51',
              lineHeight: 33,
            }}>
            Location
          </Text>
          <Image source={location} />
          <Text
            style={{
              flex: 1,
              marginTop: 40,
              marginBottom: 4,
              fontWeight: '700',
              fontSize: 14,
              color: '#323F4B',
              lineHeight: 17,
            }}>
            Enable location services?
          </Text>
          <Text
            style={{
              flex: 1,
              marginTop: 0,
              marginBottom: 32,
              fontWeight: '400',
              fontSize: 14,
              color: '#5C5F69',
              lineHeight: 17,
            }}>
            For us to be able to help you the best that we can we recommend that
            you enable location tracking on your device.
          </Text>
          <View
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
              marginBottom: 20,
            }}>
            <Text
              style={{
                marginTop: 0,
                backgroundColor: '#00D253',
                height: 41,
                width: 128,
                color: '#fff',
                paddingTop: 11,
                paddingBottom: 12,
                paddingLeft: 31,
                paddingRight: 31,
                fontSize: 15,
                fontWeight: '700',
                textTransform: 'uppercase',
                borderRadius: 45,
                marginRight: 12,
                textAlign: 'center',
              }}
              onPress={HandleLocation}>
              enable
            </Text>
            <Text
              style={{
                marginTop: 0,
                backgroundColor: '#fff',
                height: 41,
                width: 128,
                color: '#03CA51',
                paddingTop: 11,
                paddingBottom: 12,
                paddingLeft: 31,
                paddingRight: 31,
                fontSize: 15,
                fontWeight: '700',
                textTransform: 'uppercase',
                borderRadius: 45,
                borderWidth: 1,
                borderColor: '#03CA51',
                borderRadius: 50,
                textAlign: 'center',
              }}
              onPress={() =>
                navigation.navigate('HomeScreen', {name: 'HomeScreen'})
              }>
              {' '}
              Skip
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  alreadyMember: {
    flex: 1,
    marginTop: 21,
    fontWeight: '700',
    fontSize: 12,
    color: '#5C5F69',
    textTransform: 'capitalize',
    marginBottom: 5,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  submitButton: {
    borderRadius: 45,
    width: 300,
    textAlign: 'center',
    backgroundColor: '#00D253',
  },
  login: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 44,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 30,
    color: '#fff',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#fff',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Location;
