import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  Dimensions,
  Pressable,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import SplashScreen from '../SplashScreen/SplashScreen';
import {UserFormsignout} from '../actions/userAuth.action';
import image1 from '../image/loginBg.png';
// import profile from '../image/profile.jpg';
import avatar from '../image/avatar.png';
import DoubleRight from '../image/DoubleRight.png';

import HomeImg from '../image/homedefault.png';
import ProfileImg from '../image/useactive.png';
import QrCode from '../image/QrCode.png';

const HEIGHT = Dimensions.get('window').height;

const ProfileScreen = ({navigation}) => {
  const userauth = useSelector(state => state.userAuth);
  const isDarkMode = useColorScheme() === 'dark';
  const [animating, setAnimating] = useState(false);
  const dispatch = useDispatch();
  const [loggedIn, setLoggedIn] = useState({});
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#ffff' : '#ffff',
  };

  const userFormLogin = async () => {
    const loggedIna = await AsyncStorage.getItem('UserData');
    setLoggedIn(JSON.parse(loggedIna));
  };

  useEffect(() => {
    userFormLogin();
  }, []);

  const logOut = () => {
    dispatch(UserFormsignout());
    AsyncStorage.removeItem('OTP');
    AsyncStorage.removeItem('otpverify');
    AsyncStorage.removeItem('emergencyStorageData');
    AsyncStorage.removeItem('emergencyFulleData');
    clearAsyncStorage = async () => {
      AsyncStorage.clear();
    };
    clearAsyncStorage();
  };
  useEffect(() => {
    if (userauth.loading) {
      AsyncStorage.removeItem('isLoggedIn');
      AsyncStorage.removeItem('UserData');
      setAnimating(true);
      // setTimeout(() => {
      // }, 200);
    } else {
      setAnimating(false);
    }
  }, [userauth.loading]);

  if (animating) {
    return <SplashScreen />;
  }

  return (
    <View
      style={{
        height: '100%',
        position: 'relative',
        backgroundColor: '#fff',
      }}>
      {/* <StatusBar barStyle={isDarkMode ? '#fff' : 'dark-content'} /> */}
      <View contentInsetAdjustmentBehavior="automatic" style={{height: 320}}>
        <ImageBackground
          source={image1}
          resizeMode="cover"
          style={{height: 320}}>
          <View style={{marginLeft: 20, marginRight: 53}}>
            <View
              style={{
                display: 'flex',
                // flex: 1,
                flexDirection: 'row',
                marginBottom: 30,
                marginTop: 80,
              }}>
              <Image
                source={DoubleRight}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  aspectRatio: 1,
                  marginTop: 10,
                  // marginLeft: 'auto',
                }}
              />
              <View
                style={{
                  height: 42,
                  width: 42,
                  overflow: 'hidden',
                  borderRadius: 50,
                  position: 'relative',
                }}>
                <Image
                  source={avatar}
                  resizeMode="contain"
                  style={{width: '100%', height: undefined, aspectRatio: 1}}
                />
              </View>
              <View>
                <Text
                  style={{
                    marginTop: 0,
                    color: '#fff',
                    paddingTop: 11,
                    paddingBottom: 12,
                    paddingLeft: 12,
                    paddingRight: 31,
                    fontSize: 15,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}>
                  {loggedIn?.user?.firstName &&
                    loggedIn?.user?.firstName + ' ' + loggedIn?.user.lastName}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <Text
              style={{
                // flex: 1,
                textAlign: 'center',
                marginTop: 0,
                fontWeight: '600',
                fontSize: 36,
                color: '#fff',
              }}>
              SAFE
            </Text>
          </View>
          <Text
            style={{
              // flex: 1,
              textAlign: 'center',
              marginTop: 0,
              fontWeight: '400',
              fontSize: 16,
              color: '#fff',
              textTransform: 'uppercase',
            }}>
            Transport
          </Text>
        </ImageBackground>
      </View>
      <View
        style={{
          height: HEIGHT - 320,
          maxHeight: HEIGHT - 320,
        }}>
        <View
          style={{
            marginLeft: 37,
            marginRight: 37,
            // marginBottom: 30,
            shadowColor: '#000',
            shadowOffset: {width: 15, height: 15},
            shadowOpacity: 10,
            shadowRadius: 20,
            elevation: 5,
            borderRadius: 15,
            backgroundColor: '#fff',
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}>
          <ScrollView>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: '#263238',
                  fontWeight: '700',
                  fontSize: 18,
                  width: 140,
                }}>
                Full Name :
              </Text>
              <Text style={{color: '#27AE60', fontWeight: '700', fontSize: 18}}>
                {loggedIn?.user?.firstName &&
                  loggedIn?.user?.firstName + ' ' + loggedIn?.user.lastName}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: '#263238',
                  fontWeight: '700',
                  fontSize: 18,
                  width: 140,
                }}>
                Phone Number :
              </Text>
              <Text
                style={{
                  color: '#27AE60',
                  fontWeight: '700',
                  fontSize: 18,
                }}>
                {loggedIn.user && loggedIn?.user.Phone}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: '#263238',
                  fontWeight: '700',
                  fontSize: 18,
                  width: 140,
                }}>
                Email :
              </Text>
              <Text
                style={{
                  color: '#27AE60',
                  fontWeight: '700',
                  fontSize: 18,
                  flexShrink: 1,
                }}>
                {loggedIn.user && loggedIn?.user.email}
              </Text>
            </View>
          </ScrollView>
        </View>
        <Pressable
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}
          onPress={() => logOut()}>
          <View
            style={{
              backgroundColor: '#D2007E',
              height: 39,
              width: '50%',
              borderRadius: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {width: 15, height: 15},
              shadowOpacity: 10,
              shadowRadius: 20,
              elevation: 8,
            }}>
            <Text style={{fontSize: 16, color: '#fff', fontWeight: '700'}}>
              Log Out
            </Text>
          </View>
        </Pressable>
      </View>
      <View
        style={{
          display: 'flex',
          // flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 50,
          paddingRight: 50,
          shadowColor: '#000',
          shadowOffset: {width: 15, height: 15},
          shadowOpacity: 10,
          shadowRadius: 20,
          elevation: 30,
          backgroundColor: '#fff',
          height: 75,
          // marginTop: 30,
          width: '100%',
          position: 'absolute',
          bottom: 0,
        }}>
        <Text onPress={() => navigation.replace('HomeScreen')}>
          <View style={{width: 35, textAlign: 'center'}}>
            <Image
              source={HomeImg}
              resizeMode="contain"
              style={{
                width: 18,
                height: 20,
                aspectRatio: 1,
                marginTop: 0,
                marginLeft: 3,
              }}
            />
            <Text
              style={{
                color: '#4F4F4F',
                fontSize: 12,
                fontWeight: '700',
                marginTop: 9,
              }}>
              Home
            </Text>
          </View>
        </Text>
        <Text onPress={() => navigation.replace('scanQr')}>
          <View
            style={{
              width: 70,
              height: 58,
              backgroundColor: '#03CA51',
              borderRadius: 10,
              marginRight: 62,
              marginLeft: 62,
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 20,
              paddingRight: 20,
            }}>
            <Image
              source={QrCode}
              resizeMode="contain"
              style={{
                width: 30,
                height: 30,
                aspectRatio: 1,
                marginTop: 0,
              }}
            />
          </View>
        </Text>
        <Text>
          <View style={{width: 37, textAlign: 'center'}}>
            <Image
              source={ProfileImg}
              resizeMode="contain"
              style={{
                width: 18,
                height: 20,
                aspectRatio: 1,
                marginTop: 0,
                marginLeft: 3,
              }}
            />
            <Text
              style={{
                color: '#27AE60',
                fontSize: 12,
                fontWeight: '400',
                marginTop: 9,
              }}>
              Profile
            </Text>
          </View>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alreadyMember: {
    // flex: 1,
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
    // flex: 1,
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

export default ProfileScreen;
