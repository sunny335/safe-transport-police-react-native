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
  PermissionsAndroid,
} from 'react-native';
import {t} from 'react-native-tailwindcss';
import {useDispatch, useSelector} from 'react-redux';

import image1 from '../image/loginBg.png';
// import profile from '../image/profile.jpg';
import avatar from '../image/avatar.png';
import settings from '../image/Settings.png';
import amico from '../image/amico.png';
import IconRight from '../image/IconRight.png';
import bus from '../image/bus.png';
import contact from '../image/Contact.png';
import History from '../image/history.png';
import HomeImg from '../image/Home.png';
import ProfileImg from '../image/profileicon.png';
import QrCode from '../image/QrCode.png';
import generateQr from '../image/generateQr.png';
import manageReport from '../image/manageReport.png';
import PlaceMarker from '../image/PlaceMarker.png';
import SplashScreen from '../SplashScreen/SplashScreen';
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';

import {UserFormsignout} from '../actions/userAuth.action';

const HEIGHT = Dimensions.get('window').height;
var WIDTH = Dimensions.get('window').width;

const HomeScreen = ({navigation}) => {
  const userauth = useSelector(state => state.userAuth);
  Geocoder.init('AIzaSyDjBA1gOLI5tjsT2nxd15stwja0SSEWCfI');
  const dispatch = useDispatch();
  const isDarkMode = useColorScheme() === 'dark';
  const [loggedIn, setLoggedIn] = useState({});
  const [animating, setAnimating] = useState(false);
  const [publicuser, setpublicuser] = useState(false);
  const [LocationLong, setLocationLong] = useState(null);
  const [currentLocation, setcurrentLocation] = useState(null);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#ffff' : '#ffff',
    height: HEIGHT,
  };

  const userFormLogin = async () => {
    const loggedIna = await AsyncStorage.getItem('UserData');
    setLoggedIn(JSON.parse(loggedIna));
  };

  // get location
  Geocoder.init('AIzaSyAQdhc-Oy-IITFz_AgsWXv1WrT4c0cdzek');

  const handleLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 30000,
    })
      .then(location => {
        Geocoder.from(location?.latitude, location?.longitude)
          .then(json => {
            var addressComponent = json.results[0].formatted_address;
            // console.log('dfgfd', addressComponent);
            setLocationLong(location);
            setcurrentLocation(addressComponent);
          })
          .catch(error => console.warn(error));
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };

  useEffect(() => {
    userFormLogin();
    handleLocation();
  }, []);

  const logOut = () => {
    dispatch(UserFormsignout());
    AsyncStorage.removeItem('OTP');
    AsyncStorage.removeItem('otpverify');
    AsyncStorage.removeItem('emergencyStorageData');
    AsyncStorage.removeItem('emergencyFulleData');
    clearAsyncStorage = async () => {
      await AsyncStorage.clear();
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

  const granted = PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.SEND_SMS,
    {
      title: 'Example App SEND_SMS Permission',
      message: 'Example App needs access to your SEND_SMS',
    },
  );

  // const getlocation = () => {
  //   Geocoder.from(23.8103, 90.4125)
  //     .then(json => {
  //       var addressComponent = json.results[0].address_components[0];
  //       console.log(addressComponent);
  //     })
  //     .catch(error => console.warn(error));
  // };
  // var utcSeconds = LocationLong.time;
  // var d = new Date(utcSeconds);

  // console.log(loggedIn);
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
          style={{paddingBottom: 0, backgroundColor: '#fff', height: 320}}>
          <View style={{marginLeft: 20, marginRight: 53}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: publicuser ? 30 : 10,
                marginTop: 80,
              }}>
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
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={PlaceMarker}
                    resizeMode="contain"
                    style={{
                      width: 20,
                      height: 20,
                      aspectRatio: 1,
                      marginTop: 0,
                      marginRight: 5,
                    }}
                  />
                  <Text style={{color: '#fff'}}>
                    {currentLocation && currentLocation}
                  </Text>
                </View>
                {/* <Text>{LocationLong && LocationLong.speed} </Text> */}
              </View>
              <Pressable onPress={() => logOut()} style={{marginLeft: 'auto'}}>
                <Image
                  source={settings}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    aspectRatio: 1,
                    marginTop: 10,
                    marginLeft: 'auto',
                  }}
                />
              </Pressable>
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
          // flex: 1,
          alignItems: 'center',
          height: HEIGHT - 320,
          maxHeight: HEIGHT - 320,
          paddingBottom: 0,
          backgroundColor: '#fff',
        }}>
        <ScrollView>
          <View
            style={{
              marginLeft: 37,
              marginRight: 37,
              paddingBottom: 75,
              paddingTop: 5,
            }}>
            <Pressable onPress={() => navigation.navigate('ReportBoardScreen')}>
              <View
                style={{
                  display: 'flex',
                  // flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  marginBottom: 20,
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 12,
                  paddingRight: 12,
                  shadowColor: '#000',
                  shadowOffset: {width: 3, height: 3},
                  shadowOpacity: 1,
                  shadowRadius: 7,
                  elevation: 3,
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  width: WIDTH - 74,
                }}>
                <Image
                  source={amico}
                  resizeMode="contain"
                  style={{
                    width: 60,
                    height: 55,
                    aspectRatio: 1,
                    marginTop: 0,
                    marginRight: 18,
                  }}
                />
                <View style={{maxWidth: 200}}>
                  <Text
                    style={{
                      color: '#0F254F',
                      fontSize: 14,
                      marginBottom: 4,
                      fontWeight: '700',
                    }}>
                    Report Board
                  </Text>
                  <Text style={{color: '#5C5F69', fontSize: 12}}>
                    If you have facing any problem? Report this, we will take
                    action as soon.
                  </Text>
                </View>
                <Image
                  source={IconRight}
                  resizeMode="contain"
                  style={{
                    width: 24,
                    height: 24,
                    aspectRatio: 1,
                    marginTop: 0,
                    marginLeft: 'auto',
                  }}
                />
              </View>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('BusAndDriverInfo')}>
              <View
                style={{
                  display: 'flex',
                  // flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 12,
                  paddingRight: 12,
                  shadowColor: '#000',
                  shadowOffset: {width: 3, height: 3},
                  shadowOpacity: 1,
                  shadowRadius: 7,
                  elevation: 3,
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  width: WIDTH - 74,
                }}>
                <Image
                  source={bus}
                  resizeMode="contain"
                  style={{
                    width: 60,
                    height: 55,
                    aspectRatio: 1,
                    marginTop: 0,
                    marginRight: 18,
                  }}
                />
                <View style={{maxWidth: 200}}>
                  <Text
                    style={{
                      color: '#0F254F',
                      fontSize: 14,
                      marginBottom: 4,
                      fontWeight: '700',
                    }}>
                    Bus Info
                  </Text>
                  <Text style={{color: '#5C5F69', fontSize: 12}}>
                    You can view the Bus information.
                  </Text>
                </View>
                <Image
                  source={IconRight}
                  resizeMode="contain"
                  style={{
                    width: 24,
                    height: 24,
                    aspectRatio: 1,
                    marginTop: 0,
                    marginLeft: 'auto',
                  }}
                />
              </View>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('EmergencyContactScreen')}>
              <View
                style={{
                  display: 'flex',
                  // flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 12,
                  paddingRight: 12,
                  shadowColor: '#000',
                  shadowOffset: {width: 3, height: 3},
                  shadowOpacity: 1,
                  shadowRadius: 7,
                  elevation: 3,
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  width: WIDTH - 74,
                }}>
                <Image
                  source={contact}
                  resizeMode="contain"
                  style={{
                    width: 60,
                    height: 55,
                    aspectRatio: 1,
                    marginTop: 0,
                    marginRight: 18,
                  }}
                />
                <View style={{maxWidth: 200}}>
                  <Text
                    style={{
                      color: '#0F254F',
                      fontSize: 14,
                      marginBottom: 4,
                      fontWeight: '700',
                    }}>
                    Emergency Contact
                  </Text>
                  <Text style={{color: '#5C5F69', fontSize: 12}}>
                    You can used upto 5 emergency number, Who person get
                    notification.
                  </Text>
                </View>
                <Image
                  source={IconRight}
                  resizeMode="contain"
                  style={{
                    width: 24,
                    height: 24,
                    aspectRatio: 1,
                    marginTop: 0,
                    marginLeft: 'auto',
                  }}
                />
              </View>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('ReportHistory')}>
              <View
                style={{
                  display: 'flex',
                  // flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',

                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 12,
                  paddingRight: 12,
                  shadowColor: '#000',
                  shadowOffset: {width: 3, height: 3},
                  shadowOpacity: 1,
                  shadowRadius: 7,
                  elevation: 3,
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  width: WIDTH - 74,
                }}>
                <Image
                  source={History}
                  resizeMode="contain"
                  style={{
                    width: 60,
                    height: 55,
                    aspectRatio: 1,
                    marginTop: 0,
                    marginRight: 18,
                  }}
                />
                <View style={{maxWidth: 200}}>
                  <Text
                    style={{
                      color: '#0F254F',
                      fontSize: 14,
                      marginBottom: 4,
                      fontWeight: '700',
                    }}>
                    View History
                  </Text>
                  <Text style={{color: '#5C5F69', fontSize: 12}}>
                    View all of used history.
                  </Text>
                </View>
                <Image
                  source={IconRight}
                  resizeMode="contain"
                  style={{
                    width: 24,
                    height: 24,
                    aspectRatio: 1,
                    marginTop: 0,
                    marginLeft: 'auto',
                  }}
                />
              </View>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('AllReportHistory')}>
              <View
                style={{
                  display: 'flex',
                  // flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 12,
                  paddingRight: 12,
                  shadowColor: '#000',
                  shadowOffset: {width: 3, height: 3},
                  shadowOpacity: 1,
                  shadowRadius: 7,
                  elevation: 3,
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  width: WIDTH - 74,
                }}>
                <Image
                  source={manageReport}
                  resizeMode="contain"
                  style={{
                    width: 60,
                    height: 55,
                    aspectRatio: 1,
                    marginTop: 0,
                    marginRight: 18,
                  }}
                />
                <View style={{maxWidth: 200}}>
                  <Text
                    style={{
                      color: '#0F254F',
                      fontSize: 14,
                      marginBottom: 4,
                      fontWeight: '700',
                    }}>
                    Manage Reports
                  </Text>
                  <Text style={{color: '#5C5F69', fontSize: 12}}>
                    A police can be contorl and update the status of public
                    reports.
                  </Text>
                </View>
                <Image
                  source={IconRight}
                  resizeMode="contain"
                  style={{
                    width: 24,
                    height: 24,
                    aspectRatio: 1,
                    marginTop: 0,
                    marginLeft: 'auto',
                  }}
                />
              </View>
            </Pressable>
            {/* for bus authority */}
            {/* <Text>
              {loggedIn?.user?.signupAs == 'transport authority' ? (
                <>
                  {' '}
                  <Pressable onPress={() => navigation.navigate('generateQr')}>
                    <View
                      style={{
                        display: 'flex',
                        // flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 20,
                        paddingTop: 12,
                        paddingBottom: 12,
                        paddingLeft: 12,
                        paddingRight: 12,
                        shadowColor: '#000',
                        shadowOffset: {width: 3, height: 3},
                        shadowOpacity: 1,
                        shadowRadius: 7,
                        elevation: 3,
                        borderRadius: 15,
                        backgroundColor: '#fff',
                        width: WIDTH - 74,
                      }}>
                      <Image
                        source={generateQr}
                        resizeMode="contain"
                        style={{
                          width: 60,
                          height: 55,
                          aspectRatio: 1,
                          marginTop: 0,
                          marginRight: 18,
                        }}
                      />
                      <View style={{width: WIDTH - 158}}>
                        <Text
                          style={{
                            color: '#0F254F',
                            fontSize: 14,
                            marginBottom: 4,
                            fontWeight: '700',
                          }}>
                          Generate QR Code
                        </Text>
                        <Text style={{color: '#5C5F69', fontSize: 12}}>
                          Generate a QR Code for your transport
                        </Text>
                      </View>
                      <Image
                        source={IconRight}
                        resizeMode="contain"
                        style={{
                          width: 24,
                          height: 24,
                          aspectRatio: 1,
                          marginTop: 0,
                          marginLeft: 'auto',
                        }}
                      />
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => navigation.navigate('GeneratedQr')}
                    style={{marginTop: 20}}>
                    <View
                      style={[
                        {
                          display: 'flex',
                          // flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 20,
                          paddingTop: 12,
                          paddingBottom: 12,
                          paddingLeft: 12,
                          paddingRight: 12,
                          shadowColor: '#000',
                          shadowOffset: {width: 3, height: 3},
                          shadowOpacity: 1,
                          shadowRadius: 7,
                          elevation: 3,
                          borderRadius: 15,
                          backgroundColor: '#fff',
                          width: WIDTH - 74,
                        },
                      ]}>
                      <Image
                        source={generatedQr}
                        resizeMode="contain"
                        style={{
                          width: 60,
                          height: 55,
                          aspectRatio: 1,
                          marginTop: 0,
                          marginRight: 18,
                        }}
                      />
                      <View style={{width: WIDTH - 158}}>
                        <Text
                          style={{
                            color: '#0F254F',
                            fontSize: 14,
                            marginBottom: 4,
                            fontWeight: '700',
                          }}>
                          Generated QR Code
                        </Text>
                        <Text style={{color: '#5C5F69', fontSize: 12}}>
                          View All Generated QR Code
                        </Text>
                      </View>
                      <Image
                        source={IconRight}
                        resizeMode="contain"
                        style={{
                          width: 24,
                          height: 24,
                          aspectRatio: 1,
                          marginTop: 0,
                          marginLeft: 'auto',
                        }}
                      />
                    </View>
                  </Pressable>
                </>
              ) : null}
            </Text> */}
          </View>
        </ScrollView>
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
          elevation: 10,
          height: 75,
          backgroundColor: '#fff',
          // marginTop: 30,
          width: '100%',
          position: 'absolute',
          bottom: 0,
        }}>
        <Text>
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
                color: '#27AE60',
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
        <Text onPress={() => navigation.replace('ProfileScreen')}>
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
                color: '#4F4F4F',
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

export default HomeScreen;
