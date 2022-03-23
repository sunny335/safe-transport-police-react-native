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
  TouchableOpacity,
  Separator,
  ToastAndroid,
} from 'react-native';
import {t} from 'react-native-tailwindcss';
import {useDispatch, useSelector} from 'react-redux';
import RNFS from 'react-native-fs';
import CameraRoll from '@react-native-community/cameraroll';

import image1 from '../image/loginBg.png';
// import profile from '../image/profile.jpg';
import avatar from '../image/avatar.png';
import DoubleRight from '../image/DoubleRight.png';

import HomeImg from '../image/Home.png';
import ProfileImg from '../image/profileicon.png';
import QrCode from '../image/QrCode.png';
import {getPosts} from '../actions';
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const GeneratedQr = ({navigation}) => {
  // const userauth = useSelector(state => state.userAuth);
  const posts = useSelector(state => state.posts);
  const isDarkMode = useColorScheme() === 'dark';
  const [loggedIn, setLoggedIn] = useState({});
  const [QrData, setQrData] = useState({posts: []});
  const dispatch = useDispatch();
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

  const saveQrToDisk = data => {
    var image_data = data.split('data:image/png;base64,');
    image_data = image_data[1];
    console.log('qrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr data', image_data);
    RNFS.writeFile(
      RNFS.CachesDirectoryPath + '/QrCode.png',
      image_data,
      'base64',
    )
      .then(success => {
        return CameraRoll.saveToCameraRoll(
          RNFS.CachesDirectoryPath + '/QrCode.png',
          'photo',
        );
      })
      .then(() => {
        // setimageSaved({busy: false, imageSaved: true});
        ToastAndroid.show('Saved to gallery !!', ToastAndroid.SHORT);
      });

    // const platformFilePath =
    //   Platform.OS === 'android'
    //     ? RNFS.CachesDirectoryPath
    //     : RNFS.MainBundlePath;
    // const filePath = 'file://' + platformFilePath + '/' + 'QrCode.png';
    // setQrImage({uri: filePath});
  };

  // console.log(
  //   'qr created data==================================================================================',
  //   QrData?.posts[0]?.DriverImage,
  // );

  let QrbackendData = [];
  QrbackendData =
    QrData?.posts.length >= 1 &&
    QrData?.posts.filter(item => item.creatorID == loggedIn?.user?._id);

  console.log({QrbackendData});
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
            // marginBottom: 30,
            // shadowColor: '#000',
            // shadowOffset: {width: 15, height: 15},
            // shadowOpacity: 10,
            // shadowRadius: 20,
            // elevation: 5,
            borderRadius: 15,
            backgroundColor: '#fff',
            // paddingHorizontal: 20,
            paddingVertical: 20,
            height: HEIGHT - 330,
            maxHeight: HEIGHT - 330,
          }}>
          <Text
            style={[
              t.textBlack,
              t.textBase,
              t.fontBold,
              t.mB2,
              t.mT1,
              {marginLeft: 37, marginRight: 37},
            ]}>
            View All Generated Qr
          </Text>
          <ScrollView style={{width: '100%'}}>
            <View
              style={[
                t.wFull,
                t.pB3,
                {
                  marginLeft: 30,
                  marginRight: 30,
                },
              ]}>
              {posts?.isLoading ? (
                <Text>Loading...</Text>
              ) : QrbackendData?.length < 1 ? (
                <Text> No Result Found. Please Try again</Text>
              ) : (
                <View style={[t.wFull, t.flexCol, t.flex, t.wFull]}>
                  {QrbackendData?.length > 0 &&
                    QrbackendData?.map(items => (
                      <View
                        style={[
                          t.border,
                          t.borderGreen200,
                          t.roundedLg,
                          // t.bgGreen100,
                          t.shadowLg,
                          t.mT1,
                          {marginBottom: 20},
                          {width: WIDTH - 60},
                          t.p1,
                          t.pX2,
                          t.shadowInner,
                        ]}>
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
                                }}
                              />
                              <Text>Trave cost chart </Text>
                            </View>
                          ) : null}
                          <View
                            style={[
                              // t.wFull,
                              // t.selfStretch,
                              t.itemsCenter,
                              t.justifyCenter,
                              t.mX3,
                              {textAlign: 'center'},
                            ]}>
                            <Image
                              source={{uri: items.DriverImage}}
                              resizeMode="cover"
                              style={[
                                {
                                  height: 70,
                                  width: 70,
                                  // aspectRatio: 1,
                                  borderRadius: 50,
                                  overflow: 'hidden',
                                },
                              ]}
                            />
                            <Text>Driver Image</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() =>
                              saveQrToDisk((data = items.selectedFile))
                            }>
                            <View
                              style={[
                                // t.wFull,
                                // t.selfStretch,
                                t.itemsCenter,
                                t.justifyCenter,
                                {textAlign: 'center'},
                              ]}>
                              <Image
                                source={{uri: items.selectedFile}}
                                resizeMode="cover"
                                style={[
                                  {
                                    height: 70,
                                    width: 70,
                                    // aspectRatio: 1,

                                    overflow: 'hidden',
                                  },
                                ]}
                              />
                              <Text>Qr Code</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <Text
                          style={[
                            t.textBlack,
                            t.textBase,
                            t.fontBold,
                            t.mB2,
                            t.mT1,
                          ]}>
                          Bus Information
                        </Text>
                        <Text>Bus Name:{items.name}</Text>
                        <Text> Bus Number:{items.busNumber}</Text>
                        <Text> Phone Number:{items.PhoneNumber}</Text>
                        <Text
                          style={[
                            t.textBlack,
                            t.textBase,
                            t.fontBold,
                            t.mB2,
                            t.mT1,
                          ]}>
                          Driver Information
                        </Text>
                        <Text>Driver Name: {items.DriverName}</Text>
                        <Text>Driver License:{items.DriverLicense}</Text>
                        <Text> Driver Number:{items.DriverPhone}</Text>
                      </View>
                    ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
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
                color: '#2F80ED',
                fontSize: 12,
                fontWeight: '700',
                marginTop: 9,
              }}>
              Home
            </Text>
          </View>
        </Text>
        <Text onPress={() => navigation.replace('HomeScreen')}>
          <View
            style={{
              width: 70,
              height: 58,
              backgroundColor: '#033ACA',
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

export default GeneratedQr;
