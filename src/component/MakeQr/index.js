import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  ImageBackground,
  Image,
  Dimensions,
  Modal,
  Keyboard,
  KeyboardEvent,
  Pressable,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {launchImageLibrary} from 'react-native-image-picker';
// import { t } from 'react-native-tailwindcss';

import {useForm, Controller} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
let logoFromFile = require('../image/Qrbg.png');
import RNFS from 'react-native-fs';
// import QRCode from 'react-qr-code';
import QRCode from 'react-native-qrcode-svg';
import InputBox from '../InputBox';
import Buttons from '../Button';
import image1 from '../image/loginBg.png';
// import profile from '../image/profile.jpg';
import avatar from '../image/avatar.png';
import settings from '../image/Settings.png';
import done from '../image/done.png';

import HomeImg from '../image/Home.png';
import ProfileImg from '../image/profileicon.png';
import QrCode from '../image/QrCode.png';
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
import {createPost, updatePost} from '../actions';
import {t} from 'react-native-tailwindcss';

const MakeQr = ({navigation}) => {
  // const userauth = useSelector(state => state.userAuth);
  const isDarkMode = useColorScheme() === 'dark';
  const [loggedIn, setLoggedIn] = useState({});
  const [QrData, setQrData] = useState(null);
  const [drivePhotoRequire, setdrivePhotoRequire] = useState(false);
  const [BusownerImage, setBusownerImage] = useState({
    avatarSource: null,
    imgBase64: [],
  });
  const [DriverImage, setDriverImage] = useState({
    avatarSource: null,
    imgBase64: [],
  });
  const [ShowQr, setShowQr] = useState({
    toDataURL: function () {
      return this.firstName + ' ' + this.lastName;
    },
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSaved, setimageSaved] = useState(null);
  const [QrImage, setQrImage] = useState({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const dispatch = useDispatch();
  var baseQr = `data:image/png;base64,${imageSaved}`;
  // console.log('fffffff', ShowQr?.toDataURL);
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm();

  const userFormLogin = async () => {
    const loggedIna = await AsyncStorage.getItem('UserData');
    setLoggedIn(JSON.parse(loggedIna));
  };

  useEffect(() => {
    userFormLogin();
  }, []);

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

  // console.log('qr login id', loggedIn.user._id);
  console.log('qrImage', imageSaved);

  const saveQrToDisk = saveGallery => {
    ShowQr?.toDataURL(data => {
      if (saveGallery == true) {
        RNFS.writeFile(RNFS.CachesDirectoryPath + '/QrCode.png', data, 'base64')
          .then(success => {
            return CameraRoll.saveToCameraRoll(
              RNFS.CachesDirectoryPath + '/QrCode.png',
              'photo',
            );
          })
          .then(() => {
            // setimageSaved({busy: false, imageSaved: true});
            ToastAndroid.show('Saved to gallery !!', ToastAndroid.SHORT);
            setModalVisible(!modalVisible);
            setimageSaved(data);
          });
      } else {
        setimageSaved(data);
        setModalVisible(!modalVisible);
      }
      setimageSaved(data);
      // const platformFilePath =
      //   Platform.OS === 'android'
      //     ? RNFS.CachesDirectoryPath
      //     : RNFS.MainBundlePath;
      // const filePath = 'file://' + platformFilePath + '/' + 'QrCode.png';
      // setQrImage({uri: filePath});
    });
  };
  const onSubmit = data => {
    // console.log(data, 'data');
    if (DriverImage.avatarSource !== null) {
      saveQrToDisk((saveGallery = false));
      setQrData(data);
      setModalVisible(true);
      setdrivePhotoRequire(false);
    } else {
      setdrivePhotoRequire(true);
    }
  };

  const saveImageCancel = () => {
    saveQrToDisk((saveGallery = false));
  };
  useEffect(() => {
    if (imageSaved !== null) {
      dispatch(
        createPost({
          ...QrData,
          creatorID: loggedIn.user._id,
          selectedFile: baseQr,
          TravelChart: BusownerImage.avatarSource,
          DriverImage: DriverImage.avatarSource,
        }),
      );
    }
  }, [imageSaved]);
  // photo seleact

  const selectPhotoTapped = () => {
    const options = {
      quality: 0.75,
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
      },
    };
    // launchImageLibrary(options);
    launchImageLibrary(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source;
        // You can display the image using either:
        // console.log('source', response.assets[0].base64);
        source = {
          uri: 'data:image/jpeg;base64,' + response.assets[0].base64,
          isStatic: true,
        };

        const temp = response.assets[0].base64;

        //Or:
        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }
        // file
        var base64Selected = `data:image/png;base64,${response.assets[0].base64}`;
        setBusownerImage({
          avatarSource: base64Selected,
          imgBase64: temp,
        });
      }
    });
  };

  // driver Photo upload
  const DriverPhotoUpload = () => {
    const options = {
      quality: 0.75,
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
      },
    };
    // launchImageLibrary(options);
    launchImageLibrary(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source;
        // console.log('source', response.assets[0].base64);
        source = {
          uri: 'data:image/jpeg;base64,' + response.assets[0].base64,
          isStatic: true,
        };

        const temp = response.assets[0].base64;

        //Or:
        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }
        // file
        var base64Selected = `data:image/png;base64,${response.assets[0].base64}`;
        setDriverImage({
          avatarSource: base64Selected,
          imgBase64: temp,
        });
      }
    });
  };

  // console.log('selected image', BusownerImage.avatarSource);
  const validate = (value: string) => {
    const matches = value.match(
      /^(?:0\.(?:0[0-9]|[0-9]\d?)|[0-9]\d*(?:\.\d{1,2})?)(?:e[+-]?\d+)?$/,
    );
    return matches?.length || 'String is not a number';
  };

  let mainContainerHeight = HEIGHT - (320 + keyboardHeight);

  return (
    <View
      style={{
        height: '100%',
        position: 'relative',
        backgroundColor: '#fff',
      }}>
      {/* <StatusBar barStyle={isDarkMode ? '#fff' : 'dark-content'} /> */}
      {modalVisible && (
        <Modal
          animationType="slide"
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            saveImageCancel();
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(1, 17, 36, 0.75)',
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={done}
                    resizeMode="contain"
                    style={{
                      width: 24,
                      height: 24,
                      aspectRatio: 1,
                      marginTop: 0,
                      marginRight: 3,
                    }}
                  />
                  <Text
                    style={{color: '#2F80ED', fontWeight: '700', fontSize: 18}}>
                    Well Done!
                  </Text>
                </View>
                <Text style={{color: '#0695E3'}}>
                  You are successfully Created a QR
                </Text>
                <View style={{marginTop: 20, marginLeft: 0}}>
                  <QRCode
                    value={`Bus name:${QrData?.name}, Bus Number:${QrData?.busNumber},Phone Number:${QrData?.PhoneNumber}, Driver Name:${QrData?.DriverName}, Driver license:${QrData?.DriverLicense}, Driver Phone:${QrData?.DriverPhone}, creatorID:${loggedIn.user._id}`}
                    getRef={c => setShowQr(c)}
                    logo={logoFromFile}
                    size={200}
                  />
                </View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Pressable
                    style={{
                      marginRight: 10,
                      backgroundColor: '#fff',
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      marginTop: 20,
                      width: 110,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#2F80ED',
                    }}
                    onPress={() => saveQrToDisk((saveGallery = true))}>
                    <Text style={{color: '#2F80ED', paddingHorizontal: 7}}>
                      Save Image
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{
                      marginRight: 10,
                      backgroundColor: '#fff',
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      marginTop: 20,
                      width: 70,
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: '#FF3370',
                    }}
                    onPress={() => saveImageCancel()}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
          height: mainContainerHeight,
          maxHeight: mainContainerHeight,
        }}>
        <ScrollView>
          <View
            style={{
              marginLeft: 20,
              marginRight: 20,
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 50,
              paddingBottom: 10,
              marginTop: 10,
              shadowColor: '#000',
              shadowOffset: {width: 5, height: 5},
              shadowOpacity: 5,
              shadowRadius: 5,
              elevation: 5,
              backgroundColor: '#fff',
              borderRadius: 10,
            }}>
            <Text
              style={[
                t.borderL2,
                t.borderSolid,
                t.borderRed700,
                t.pL2,
                t.mB4,
                {color: '#455A64', marginTop: 10},
              ]}>
              All information shoud be match with gov. ID (NID, Passport,
              Driving license)
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#263238',
                fontWeight: '700',
                marginBottom: 30,
              }}>
              Bus Information
            </Text>
            {/* <Image
              source={{uri: baseQr}}
              resizeMode="contain"
              style={{width: '100%', height: undefined, aspectRatio: 1}}
            /> */}
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: 'please enter your bus name',
                },
              }}
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputBox
                  onChangeText={value => onChange(value)}
                  value={value}
                  label="bus name"
                  error={errors?.name}
                  errorText={errors?.name?.message}
                />
              )}
            />
            <Controller
              name="busNumber"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: 'please enter your bus number',
                },
              }}
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputBox
                  onChangeText={value => onChange(value)}
                  value={value}
                  label="Bus Number"
                  error={errors?.busNumber}
                  errorText={errors?.busNumber?.message}
                />
              )}
            />
            <Controller
              name="PhoneNumber"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: 'please enter your Phone number',
                },
                minLength: {
                  value: 11,
                  message: 'Phone number length must be 11',
                },
                maxLength: {
                  value: 11,
                  message: 'Phone number max length can be 11',
                },
                validate,
              }}
              error={{
                type: String,
                message: 'please enter valid Phone number',
              }}
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputBox
                  onChangeText={value => onChange(value)}
                  value={value}
                  label="phone Number"
                  error={errors?.PhoneNumber}
                  errorText={errors?.PhoneNumber?.message}
                />
              )}
            />
            <View style={[t.selfStretch, t.flexRow, t.flex, t.wFull]}>
              <View style={[t.w1_4, t.mB4]}>
                <Text>Image*</Text>
                <Text>Travel Cost Chart</Text>
              </View>
              <TouchableOpacity
                onPress={() => selectPhotoTapped()}
                style={[t.w3_4, t.pL3]}>
                <View>
                  {BusownerImage.avatarSource === null ? (
                    <View>
                      <Text
                        style={[
                          t.border,
                          t.borderGray500,
                          t.rounded,
                          t.h8,
                          t.pY2,
                          t.pX2,
                          {color: '#0695E3', fontSize: 14, fontWeight: '600'},
                        ]}>
                        Select a Photo
                      </Text>
                    </View>
                  ) : (
                    <Image
                      style={styles.avatar}
                      source={{uri: BusownerImage.avatarSource}}
                      resizeMode="contain"
                      style={{width: '100%', height: 70, aspectRatio: 1}}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: 14,
                color: '#263238',
                fontWeight: '700',
                marginBottom: 30,
              }}>
              Driver Information
            </Text>
            <Controller
              name="DriverName"
              control={control}
              defaultValue=""
              rules={{
                required: {value: true, message: 'please enter driver name'},
              }}
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputBox
                  onChangeText={value => onChange(value)}
                  value={value}
                  label="Driver Name"
                  error={errors?.DriverName}
                  errorText={errors?.DriverName?.message}
                />
              )}
            />

            <Controller
              name="DriverLicense"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: 'please enter driver license',
                },
              }}
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputBox
                  onChangeText={value => onChange(value)}
                  value={value}
                  label="Driver license"
                  error={errors?.DriverLicense}
                  errorText={errors?.DriverLicense?.message}
                />
              )}
            />
            <Controller
              name="DriverPhone"
              control={control}
              defaultValue=""
              rules={{
                required: {
                  value: true,
                  message: 'please enter driver phone number',
                },
                minLength: {
                  value: 11,
                  message: 'Phone number length must be 11',
                },
                maxLength: {
                  value: 11,
                  message: 'Phone number max length can be 11',
                },
                validate,
              }}
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputBox
                  onChangeText={value => onChange(value)}
                  value={value}
                  label="Driver Phone"
                  error={errors?.DriverPhone}
                  errorText={errors?.DriverPhone?.message}
                />
              )}
            />
            <View
              style={[
                t.selfStretch,
                t.flexRow,
                t.flex,
                t.wFull,
                t.mB4,
                t.itemsCenter,
              ]}>
              <View style={[t.w1_4, t.mB4]}>
                <Text>Image*</Text>
                <Text>(Person)</Text>
              </View>
              <TouchableOpacity
                onPress={() => DriverPhotoUpload()}
                style={[t.w3_4, t.pL3]}>
                <View>
                  {DriverImage.avatarSource === null ? (
                    <View>
                      <Text
                        style={[
                          t.border,
                          t.borderGray500,
                          t.rounded,
                          t.h8,
                          t.pY2,
                          t.pX2,
                          {color: '#0695E3', fontSize: 14, fontWeight: '600'},
                        ]}>
                        Select a Photo
                      </Text>
                      {drivePhotoRequire ? (
                        <Text style={[t.textRed600]}>
                          Driver Photo required
                        </Text>
                      ) : null}
                    </View>
                  ) : (
                    <Image
                      style={styles.avatar}
                      source={{uri: DriverImage.avatarSource}}
                      resizeMode="contain"
                      style={{width: '100%', height: 70, aspectRatio: 1}}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                display: 'flex',
                // flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 30,
              }}>
              <Text
                style={{
                  marginRight: 10,
                  backgroundColor: '#00D253',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  color: '#fff',
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: '#00D253',
                }}
                onPress={handleSubmit(onSubmit)}>
                Submit
              </Text>
              <Text
                style={{
                  marginRight: 10,
                  backgroundColor: '#fff',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  color: '#FF3370',
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: '#FF3370',
                }}
                onPress={() => navigation.replace('HomeScreen')}>
                Cancel
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          display: keyboardHeight === 0 ? 'flex' : 'none',
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
          marginTop: 30,
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
  centeredView: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    // width: 300,
    // height: 400,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: '#FF3370',
  },
});

export default MakeQr;
