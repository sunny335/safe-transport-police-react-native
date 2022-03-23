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
  Pressable,
  Modal,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import {t} from 'react-native-tailwindcss';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {useForm, Controller} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import InputBox from '../CommentBox';
import image1 from '../image/loginBg.png';
import {launchImageLibrary} from 'react-native-image-picker';
import {updatePost, getPosts} from '../actions';
import {CreateReport} from '../actions/report.action';
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';
// import profile from '../image/profile.jpg';
import avatar from '../image/avatar.png';
import DoubleRight from '../image/DoubleRight.png';
import done from '../image/done.png';
import PlaceMarker from '../image/PlaceMarker.png';
import HomeImg from '../image/Home.png';
import ProfileImg from '../image/profileicon.png';
import QrCode from '../image/QrCode.png';

const HEIGHT = Dimensions.get('window').height;

const ReportBoardScreen = ({navigation}) => {
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm();
  // const userauth = useSelector(state => state.userAuth);
  const posts = useSelector(state => state.posts);
  const [selectedValue, setSelectedValue] = useState('Over Speed');
  const [isCheck, setCheck] = useState(false);
  const [isCheckError, setCheckError] = useState(false);
  const [scannedError, setscanError] = useState(false);
  const [loggedIn, setLoggedIn] = useState({});
  const [scannedQr, setscanQr] = useState(false);
  const [qrCodeData, setqrCodeData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useDispatch();
  const [QrData, setQrData] = useState({posts: []});
  const [LocationLong, setLocationLong] = useState(null);
  const [currentLocation, setcurrentLocation] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [BusownerImage, setBusownerImage] = useState({
    avatarSource: null,
    imgBase64: [],
  });
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#ffff' : '#ffff',
  };

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
    handleLocation();
  }, []);
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
    if (qrCodeData?.data) {
      setscanQr(false);
    }
  }, [qrCodeData]);

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
    posts?.posts?.posts.filter(
      item => item.busNumber == DriverInfo?.busNumber[1],
    );
  // console.log('============== qr backedn', DriverInfo?.busNumber[1]);

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

  // form submit

  const onSubmit = data => {
    // console.log(QrData.posts, ' Report Data==========');
    // ReportType:selectedValue,
    // isCheck
    // reportedPhoto: BusownerImage.avatarSource,
    // ReportedBusInfo:QrbackendData,
    if (DriverInfo?.busNumber == null) {
      setscanError(true);
    } else if (isCheck === false) {
      setCheckError(true);
    } else if (QrbackendData?.length > 0) {
      setCheckError(false);
      setscanError(false);
      setModalVisible(true);
      dispatch(
        CreateReport({
          ...data,
          ReporterID: loggedIn.user._id,
          ReportedBusInfo: QrbackendData,
          reportedPhoto: BusownerImage.avatarSource,
          ReportType: selectedValue,
          ReporterLocation: currentLocation,
          ReporterData: loggedIn.user,
          ReportStatus: 'Active',
        }),
      );
    }
  };

  let mainContainerHeight = HEIGHT - (330 + keyboardHeight);

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
            setModalVisible(false);
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
                <Pressable
                  style={{
                    marginRight: 0,
                    backgroundColor: '#fff',
                    padding: 5,
                  }}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.replace('HomeScreen');
                  }}>
                  <Text
                    style={{
                      textAlign: 'right',
                      fontSize: 20,
                      fontWeight: '700',
                    }}>
                    X
                  </Text>
                </Pressable>
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
                  You are successfully submitted the report
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <View contentInsetAdjustmentBehavior="automatic" style={{height: 330}}>
        <ImageBackground
          source={image1}
          resizeMode="cover"
          style={{height: 330}}>
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
          {!scannedQr ? (
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#263238',
                }}>
                Report Board
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: '400',
                  color: '#5C5F69',
                  marginBottom: 20,
                  marginHorizontal: 20,
                }}>
                If you have facing any problem? Report this, we will take action
                as soon.
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
                You scan code for more details.
              </Text>
              <Text style={{textAlign: 'center', color: '#263238'}}>
                {' '}
                Then you can include this info in report section.
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
                {!scannedQr ? (
                  <View>
                    {DriverInfo?.busNumber == null && scannedError ? (
                      <Text
                        style={{
                          color: '#FF3370',
                          textAlign: 'center',
                          marginBottom: 5,
                        }}>
                        {' '}
                        Please scan QR first
                      </Text>
                    ) : null}
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 0,
                        marginBottom: 17,
                      }}>
                      <Text
                        style={{
                          color: '#4F4F4F',
                          fontSize: 12,
                          fontWeight: '400',
                          width: '33%',
                        }}>
                        QR code No* :
                      </Text>
                      <Pressable
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: 10,
                          width: '63%',
                        }}>
                        <Text
                          style={{
                            marginRight: 24,
                            backgroundColor: '#fff',
                            paddingVertical: 5,
                            paddingHorizontal: 20,
                            color: '#263238',
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: '#E0E0E0',
                            height: 30,
                            width: '50%',
                          }}>
                          {DriverInfo.busNumber
                            ? `${DriverInfo?.busNumber[1].substring(0, 2)}*****`
                            : null}
                        </Text>
                        <Text
                          style={{
                            marginRight: 10,
                            backgroundColor: '#2F80ED',
                            paddingVertical: 8,
                            paddingHorizontal: 20,
                            color: '#fff',
                            borderRadius: 6,
                            borderWidth: 1,
                            width: '50%',
                            borderColor: '#2F80ED',
                          }}
                          onPress={() => setscanQr(true)}>
                          Scan QR
                        </Text>
                      </Pressable>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',

                        marginLeft: 0,
                        marginBottom: 17,
                      }}>
                      <Text
                        style={{
                          color: '#4F4F4F',
                          fontSize: 12,
                          fontWeight: '400',
                          width: '25%',
                        }}>
                        Report Type*
                      </Text>

                      <Controller
                        name="comment"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: {
                            value: true,
                            message: 'please make a comment',
                          },
                        }}
                        render={({
                          field: {onChange, onBlur, value, name, ref},
                        }) => (
                          // <InputBox
                          //   onChangeText={value => onChange(value)}
                          //   value={value}
                          //   label="Comment"
                          //   error={errors?.comment}
                          //   errorText={errors?.comment?.message}
                          // />
                          <View
                            style={{
                              borderRadius: 5,
                              borderWidth: 1,
                              borderColor: '#E0E0E0',
                              width: '70%',
                              height: 35,
                              marginTop: 10,
                              marginLeft: 17,
                            }}>
                            <Picker
                              selectedValue={selectedValue}
                              onValueChange={(itemValue, itemIndex) =>
                                setSelectedValue(itemValue)
                              }
                              style={{
                                height: 0,
                                width: '100%',
                                paddingBottom: 10,
                                marginTop: -10,
                              }}>
                              <Picker.Item
                                label="Over Speed"
                                value="Over Speed"
                              />
                              <Picker.Item
                                label="Extra Money"
                                value=" Extra Money"
                              />
                              <Picker.Item
                                label="Over Passengers"
                                value=" Over Passengers"
                              />
                              <Picker.Item
                                label=" Fitness less Bus"
                                value="  Fitness less Bus"
                              />
                              <Picker.Item
                                label="Stop Repeatedly"
                                value=" Stop Repeatedly"
                              />
                              <Picker.Item
                                label="Driver was addicted"
                                value="Driver was addicted"
                              />
                              <Picker.Item
                                label="Confiscated on woman sit"
                                value="Confiscated on woman sit"
                              />
                              <Picker.Item
                                label="Sexual harassment of woman"
                                value="Sexual harassment of woman"
                              />
                              <Picker.Item
                                label="Driver is talking on the phone"
                                value="Driver is talking on the phone"
                              />
                              <Picker.Item label="others" value="others" />
                            </Picker>
                          </View>
                        )}
                      />
                    </View>

                    <View style={[t.selfStretch, t.flexRow, t.flex, t.wFull]}>
                      <View style={[t.w1_4, t.mB4]}>
                        <Text>Upload Photo*</Text>
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
                                  {
                                    color: '#0695E3',
                                    fontSize: 14,
                                    fontWeight: '600',
                                  },
                                ]}>
                                Select a Photo
                              </Text>
                            </View>
                          ) : (
                            <Image
                              style={styles.avatar}
                              source={{uri: BusownerImage.avatarSource}}
                              resizeMode="contain"
                              style={{
                                width: '100%',
                                height: 70,
                                aspectRatio: 1,
                              }}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                    <Controller
                      name="comment"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: {
                          value: true,
                          message: 'please make a comment',
                        },
                      }}
                      render={({
                        field: {onChange, onBlur, value, name, ref},
                      }) => (
                        <InputBox
                          onChangeText={value => onChange(value)}
                          value={value}
                          label="Comment"
                          error={errors?.comment}
                          errorText={errors?.comment?.message}
                        />
                      )}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <CheckBox
                        value={isCheck}
                        onValueChange={setCheck}
                        style={{alignSelf: 'center'}}
                      />
                      <Text
                        style={{
                          margin: 8,
                          color:
                            isCheckError && !isCheck ? '#FF3370' : '#455A64',
                        }}>
                        I agree to submit this report.?
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        // flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 45,
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          marginRight: 10,
                          backgroundColor: '#2F80ED',
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          color: '#fff',
                          borderRadius: 5,
                          borderWidth: 1,
                          borderColor: '#2F80ED',
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
                ) : (
                  <View
                    style={{
                      height: 280,
                      borderWidth: 3,
                      borderColor: '#033ACA',
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
    backgroundColor: '#2F80ED',
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
});

export default ReportBoardScreen;
AppRegistry.registerComponent('default', () => ReportBoardScreen);
