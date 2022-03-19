/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import type {Node} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  StatusBar,
  PermissionsAndroid,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SignUp from './src/component/SignUp';
import HomeScreen from './src/component/HomeScreen';
import Location from './src/component/Location';
import ProfileScreen from './src/component/ProfileScreen/ProfileScreen';
import SplashScreen from './src/component/SplashScreen/SplashScreen';
import GenerateQr from './src/component/MakeQr';
import ScanQr from './src/component/ScanQr';
import GeneratedQr from './src/component/ViewGeneratedQrScreen';
import BusAndDriverInfo from './src/component/BusAndDriverInfo';
import ReportBoardScreen from './src/component/ReportBoardScreen';
import ReportHistory from './src/component/ReportHistoryScreen';
import EmergencyContactScreen from './src/component/EmergencyContact';
import OtpScreen from './src/component/OtpScreen';
import VerifyScreen from './src/component/VerifyingScreen';

const App: () => Node = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const dispatch = useDispatch();
  const isDarkMode = useColorScheme() === 'dark';
  const auth = useSelector(state => state.userAuth);
  const otpData = useSelector(state => state.otp);
  const [loggedIn, setLoggedIn] = useState(false);
  const [OTP, setOtp] = useState(false);
  const [animating, setAnimating] = useState(true);
  const [location, setLocation] = useState(true);
  const [loggedinUser, setloggedinUser] = useState(null);
  const [verifying, setverifying] = useState(false);
  const [VerifyData, setVerifyData] = useState(false);
  const [storagaccountStatuse, setStoragaccountStatuse] = useState(null);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#ffff' : '#ffff',
    height: '100%',
  };

  // console.log('auto===============', verifyFilteredData.length);

  React.useEffect(() => {
    StatusBar.setBackgroundColor('#FF573300');
    StatusBar.setTranslucent(true);
  }, []);

  const Stack = createNativeStackNavigator();

  const isLogged = async () => {
    const loggedIna = await AsyncStorage.getItem('isLoggedIn');
    const loggedUserData = await AsyncStorage.getItem('UserData');
    let storagaccountStatus = await AsyncStorage.getItem('accountStatus');
    setStoragaccountStatuse(storagaccountStatus);
    if (loggedIna == '1') {
      setLoggedIn(true);
      setloggedinUser(JSON.parse(loggedUserData));
      if (storagaccountStatus == 'active') {
        setverifying(false);
      } else {
        setverifying(true);
      }
    } else {
      setLoggedIn(false);
    }
  };

  const isOTPValid = async () => {
    const otp = await AsyncStorage.getItem('OTP');
    const loggedUserData = await AsyncStorage.getItem('UserData');
    let storagaccountStatus = await AsyncStorage.getItem('accountStatus');
    setStoragaccountStatuse(storagaccountStatus);
    // console.log('opttttttpppppppppp', storagaccountStatuse);
    if (otp == 'valid') {
      console.log('otp == valid', otp);
      setloggedinUser(JSON.parse(loggedUserData));
      setOtp(true);
      setverifying(true);
      if (storagaccountStatus == 'active') {
        setverifying(false);
      } else {
        setverifying(true);
      }
    }
    if (otpData?.verifyStatus.status == 'success') {
      setOtp(true);
      if (auth?.user?.accountStatus == 'inactive') {
        setverifying(true);
      } else {
        setverifying(false);
      }
    } else {
      setOtp(false);
      // setverifying(false);
    }
  };

  useEffect(() => {
    isOTPValid();
  }, [otpData.verifyed]);

  useEffect(() => {
    console.log('{OTP', auth?.user?.valid);
    if (auth?.user?.valid == 'true') {
      setOtp(true);
      if (auth.user.accountStatus == 'inactive') {
        setverifying(true);
      } else {
        setverifying(false);
      }
    } else {
      setOtp(false);
    }
  }, [auth.authenticate]);

  const chckLocationPermission = PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  // console.log('loaction permission', chckLocationPermission);
  const HandleLocation = async () => {
    const result = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    // const chckLocationPermission = PermissionsAndroid.check(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    // );
    // console.log('loaction permission===========', result);
    if (result === true) {
      setLocation(false);
      // console.log('You can use the location');
    } else {
      setLocation(true);
      // console.log('location permission denied');
    }
  };

  useEffect(() => {
    isLogged();
    HandleLocation();
  }, [auth.loading]);

  useEffect(() => {
    isLogged(auth.authenticate);
  }, [auth.authenticate]);

  useEffect(() => {
    axios
      .get(
        'https://safetransport-backend.herokuapp.com/api/admin/allPoliceAuth',
      )
      .then(res => {
        const persons = res;
        // thissetState({ persons });
        setVerifyData(persons);
      });
    setTimeout(() => {
      setAnimating(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (VerifyData) {
      let verifyFilteredData = VerifyData?.data?.admins.filter(
        items => loggedinUser?.user?._id === items?._id,
      );
      if (verifyFilteredData[0].accountStatus == 'active') {
        setverifying(false);
        AsyncStorage.setItem('accountStatus', 'active');
      }
      if (verifyFilteredData[0].accountStatus == 'inactive') {
        setverifying(true);
        AsyncStorage.setItem('accountStatus', 'inactive');
      }
      // console.log('auto===============', verifyFilteredData.length);
    } else {
      const storagaccountStatuse = AsyncStorage.getItem('accountStatus');
      console.log('storagaccountStatuse', storagaccountStatuse);
      if (storagaccountStatuse == 'active') {
        setverifying(false);
      } else {
        setverifying(true);
      }
    }
  }, [VerifyData]);

  // app backgorund state

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);

      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (animating) {
    return <SplashScreen />;
  }

  if (appStateVisible == 'background') {
    axios
      .get(
        'https://safetransport-backend.herokuapp.com/api/admin/allPoliceAuth',
      )
      .then(res => {
        const persons = res;

        setVerifyData(persons);
      });
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{title: 'SplashScreen'}}
        /> */}
        {loggedIn ? (
          <>
            {OTP ? null : <Stack.Screen name="OTP" component={OtpScreen} />}
            {verifying ? (
              <Stack.Screen name="VerifyScreen" component={VerifyScreen} />
            ) : null}
            {location ? (
              <Stack.Screen
                name="Location"
                component={Location}
                options={{title: 'Location'}}
              />
            ) : null}

            {/* <Stack.Screen
              name={`${OTP ? 'Location' : 'OtpScreen'}`}
              component={OTP ? Location : OtpScreen}
            /> */}

            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{title: 'HomeScreen'}}
            />

            {/* <Stack.Screen
              name="Location"
              component={Location}
              options={{title: 'Location'}}
            /> */}
            <Stack.Screen
              name="generateQr"
              component={GenerateQr}
              options={{title: 'generateQr'}}
            />
            <Stack.Screen
              name="scanQr"
              component={ScanQr}
              options={{title: 'scanQr'}}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{title: 'ProfileScreen'}}
            />
            <Stack.Screen
              name="GeneratedQr"
              component={GeneratedQr}
              options={{title: 'GeneratedQr'}}
            />
            <Stack.Screen
              name="BusAndDriverInfo"
              component={BusAndDriverInfo}
              options={{title: 'BusAndDriverInfo'}}
            />
            <Stack.Screen
              name="ReportBoardScreen"
              component={ReportBoardScreen}
              options={{title: 'ReportBoardScreen'}}
            />
            <Stack.Screen
              name="ReportHistory"
              component={ReportHistory}
              options={{title: 'ReportHistory'}}
            />
            <Stack.Screen
              name="EmergencyContactScreen"
              component={EmergencyContactScreen}
              options={{title: 'EmergencyContactScreen'}}
            />
          </>
        ) : (
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: 'SignUp'}}
            setLoggedIns={setLoggedIn}
            // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
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

export default App;
