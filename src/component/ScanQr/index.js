'use strict';
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
  Keyboard,
  KeyboardEvent,
  ImageBackground,
  Image,
  Dimensions,
  Linking,
  TouchableOpacity,
  AppRegistry,
} from 'react-native';
import {t} from 'react-native-tailwindcss';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {useDispatch, useSelector} from 'react-redux';
import {getPosts} from '../actions';
import image1 from '../image/loginBg.png';
// import profile from '../image/profile.jpg';
import avatar from '../image/avatar.png';
import DoubleRight from '../image/DoubleRight.png';

import HomeImg from '../image/homedefault.png';
import ProfileImg from '../image/profileicon.png';
import QrCode from '../image/QrCode.png';

const HEIGHT = Dimensions.get('window').height;

const ScanQrCode = ({navigation}) => {
  // const userauth = useSelector(state => state.userAuth);
  const posts = useSelector(state => state.posts);
  const [loggedIn, setLoggedIn] = useState({});
  const [qrCodeData, setqrCodeData] = useState(null);
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useDispatch();
  const [QrData, setQrData] = useState({posts: []});
  const [keyboardHeight, setKeyboardHeight] = useState(0);
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

  useEffect(() => {
    dispatch(getPosts());
    setQrData(posts.posts);
  }, []);

  // const onSuccess = e => {
  //   Linking.openURL(e.data).catch(err =>
  //     console.error('An error occured', err),
  //   );
  // };

  //get  keyboard data

  function onKeyboardDidShow(e: KeyboardEvent) {
    setKeyboardHeight(e.endCoordinates.height);
  }

  function onKeyboardDidHide() {
    setKeyboardHeight(0);
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      Keyboard.remove('keyboardDidShow', onKeyboardDidShow);
      Keyboard.remove('keyboardDidHide', onKeyboardDidHide);
    };
  }, []);

  // console.log('loggedIn', posts.posts);

  let DriverInfo = {busNumber: null};
  if (qrCodeData?.data) {
    var splitQrdata = [];
    splitQrdata = qrCodeData?.data?.split(',');
    DriverInfo = {
      busName: splitQrdata[0]?.split(':'),
      busNumber: splitQrdata[1]?.split(':'),
      PhoneNumber: splitQrdata[2]?.split(':'),
      driverName: splitQrdata[3]?.split(':'),
      driverLicense: splitQrdata[4]?.split(':'),
      driverPhone: splitQrdata[5]?.split(':'),
      busOwner: splitQrdata[6]?.split(':'),
    };
    // DriverInfo.driverName = splitQrdata[3]?.split(':');
  }

  useEffect(() => {
    if (DriverInfo.busNumber !== null) {
      // AsyncStorage.removeItem('scannedQrBus');
      AsyncStorage.setItem(
        'scannedQrBus',
        JSON.stringify({
          busnumber: DriverInfo?.busNumber[1],
          busName: DriverInfo?.busName[1],
          PhoneNumber: DriverInfo?.PhoneNumber[1],
          driverName: DriverInfo?.driverName[1],
          driverLicense: DriverInfo?.driverLicense[1],
          driverPhone: DriverInfo?.driverPhone[1],
        }),
      );
    }
  }, [DriverInfo]);
  let QrbackendData = [];
  QrbackendData =
    DriverInfo?.busNumber &&
    QrData?.posts.filter(item => item.busNumber == DriverInfo?.busNumber[1]);
  // console.log('==============', QrbackendData);
  let mainContainerHeight = HEIGHT - 390;

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
                    loggedIn?.user?.firstName + ' ' + loggedIn?.user?.lastName}
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
          height: mainContainerHeight,
          maxHeight: mainContainerHeight,
        }}>
        <ScrollView>
          {qrCodeData?.data ? (
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#263238',
                  marginBottom: 20,
                }}>
                Bus & Driver Info
              </Text>
            </View>
          ) : (
            <View style={{marginBottom: 10}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#263238',
                }}>
                Scan QR Code
              </Text>
              <Text style={{textAlign: 'center', color: '#263238'}}>
                You sacn code for more detailes.
              </Text>
              <Text style={{textAlign: 'center', color: '#263238'}}>
                {' '}
                Then you can include this info in repot section.
              </Text>
            </View>
          )}

          <View>
            <ScrollView>
              <View
                style={{
                  marginLeft: 37,
                  marginRight: 37,
                  shadowColor: '#000',
                  shadowOffset: {width: 15, height: 15},
                  shadowOpacity: 10,
                  shadowRadius: 20,
                  elevation: 5,
                  borderRadius: 15,
                  backgroundColor: '#fff',
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  marginBottom: 30,
                }}>
                {qrCodeData?.data ? (
                  <View>
                    {QrbackendData?.length > 0 &&
                      QrbackendData.map(items => (
                        <View
                          style={[
                            t.flexRow,
                            t.flex,
                            t.wFull,
                            // t.selfStretch,
                            t.itemsCenter,
                            t.justifyCenter,
                          ]}>
                          {items.TravelChart !== null ? (
                            <View>
                              <Image
                                source={{uri: items.TravelChart}}
                                resizeMode="contain"
                                style={{
                                  height: 70,
                                  aspectRatio: 1,
                                  width: 70,
                                }}
                              />
                              <Text style={{color: '#455A64', marginTop: 16}}>
                                Trave cost chart{' '}
                              </Text>
                            </View>
                          ) : null}
                          <View
                            style={[
                              t.itemsCenter,
                              t.justifyCenter,
                              t.mX3,
                              {textAlign: 'center'},
                            ]}>
                            <Image
                              source={{uri: items.DriverImage}}
                              resizeMode="contain"
                              style={[
                                {
                                  height: 70,
                                  width: 70,
                                  overflow: 'hidden',
                                },
                              ]}
                            />
                            <Text style={{color: '#455A64', marginTop: 16}}>
                              Driver Image
                            </Text>
                          </View>
                        </View>
                      ))}
                    <Text
                      style={{
                        color: '#263238',
                        fontSize: 18,
                        fontWeight: '600',
                        marginBottom: 14,
                        marginTop: 14,
                      }}>
                      Bus Information
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: 5,
                      }}>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 16,
                          fontWeight: '400',
                          width: '35%',
                        }}>
                        Bus Name
                      </Text>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 14,
                          fontWeight: '400',
                        }}>
                        : {DriverInfo?.busName[1]}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: 5,
                      }}>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 16,
                          fontWeight: '400',
                          width: '35%',
                        }}>
                        Bus Number
                      </Text>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 14,
                          fontWeight: '400',
                        }}>
                        : {DriverInfo?.busNumber[1]}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: 5,
                      }}>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 16,
                          fontWeight: '400',
                          width: '35%',
                        }}>
                        {DriverInfo?.PhoneNumber[0]}
                      </Text>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 14,
                          fontWeight: '400',
                        }}>
                        : {DriverInfo?.PhoneNumber[1]}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: '#263238',
                        fontSize: 18,
                        fontWeight: '600',
                        marginVertical: 10,
                      }}>
                      Bus Information
                    </Text>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: 5,
                      }}>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 16,
                          fontWeight: '400',
                          width: '35%',
                        }}>
                        {DriverInfo?.driverName[0]}
                      </Text>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 14,
                          fontWeight: '400',
                        }}>
                        : {DriverInfo?.driverName[1]}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: 5,
                      }}>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 16,
                          fontWeight: '400',
                          width: '35%',
                        }}>
                        {DriverInfo?.driverLicense[0]}
                      </Text>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 14,
                          fontWeight: '400',
                        }}>
                        : {DriverInfo?.driverLicense[1]}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginBottom: 5,
                      }}>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 16,
                          fontWeight: '400',
                          width: '35%',
                        }}>
                        {DriverInfo?.driverPhone[0]}
                      </Text>
                      <Text
                        style={{
                          color: '#263238',
                          fontSize: 14,
                          fontWeight: '400',
                        }}>
                        : {DriverInfo?.driverPhone[1]}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      height: 280,
                      borderWidth: 3,
                      borderColor: '#03CA51',
                      borderRadius: 5,
                      overflow: 'hidden',
                    }}>
                    <QRCodeScanner
                      onRead={e => setqrCodeData(e)}
                      // ref={node => {
                      //   this.scanner = node;
                      // }}
                      // flashMode={RNCamera.Constants.FlashMode.torch}
                      topContent={
                        <Text style={styles.centerText}>
                          Go to{' '}
                          <Text style={styles.textBold}>
                            wikipedia.org/wiki/QR_code
                          </Text>{' '}
                          on your computer and scan the QR code.
                        </Text>
                      }
                      bottomContent={
                        <TouchableOpacity style={styles.buttonTouchable}>
                          <Text style={styles.buttonText}>OK. Got it!</Text>
                        </TouchableOpacity>
                      }
                    />
                  </View>
                )}
              </View>
            </ScrollView>
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
        <Text>
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
  centerText: {
    // flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default ScanQrCode;
AppRegistry.registerComponent('default', () => ScanQrCode);
