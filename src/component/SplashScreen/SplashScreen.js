// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  ImageBackground,
  Text,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import image1 from '../image/SplashScreen.png';

const SplashScreen = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      // AsyncStorage.getItem('isLoggedIn').then(value =>
      //   navigation.replace(value === 1 ? 'Location' : 'HomeScreen'),
      // );
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={image1}
        resizeMode="cover"
        style={{width: '100%', margin: 0, flex: 1}}>
        {/* <Text style={{color: '#fff', fontSize: 30, fontWeight: '700'}}>
          SAFE TRANSPORT
        </Text> */}
        <ActivityIndicator
          animating={animating}
          color="#FFFFFF"
          size="large"
          style={styles.activityIndicator}
        />
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#13A6BF',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
    marginTop: 100,
    flex: 1,
  },
});
