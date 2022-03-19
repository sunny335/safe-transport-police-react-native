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
  TouchableOpacity,
  PermissionsAndroid,
  Modal,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import axios from '../helpers/axios';
import {
  CreateEmergencyPhone,
  getPhones,
  DeletePhone,
} from '../actions/emergency.actions';

import {useForm, Controller} from 'react-hook-form';
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';

// import SendSMS from 'react-native-sms';

import SmsAndroid from 'react-native-get-sms-android';
import InputBox from '../EmergencyInputField';
import image1 from '../image/loginBg.png';
// import profile from '../image/profile.jpg';
import avatar from '../image/avatar.png';
import Vector2 from '../image/Vector2.png';
import Emergency from '../image/emergency.png';
import Delete from '../image/delete.png';
import PlaceMarker from '../image/PlaceMarker.png';
import DoubleRight from '../image/DoubleRight.png';

import HomeImg from '../image/homedefault.png';
import ProfileImg from '../image/useactive.png';
import Vector from '../image/Vector.png';
import QrCode from '../image/QrCode.png';

const HEIGHT = Dimensions.get('window').height;

// var SmsAndroid = require('react-native-sms-android');

const EmergencyContactScreen = ({navigation}) => {
  // const userauth = useSelector(state => state.userAuth);
  const Phones = useSelector(state => state.emergencyPhone);
  const dispatch = useDispatch();
  const isDarkMode = useColorScheme() === 'dark';
  const [loggedIn, setLoggedIn] = useState({});
  const [voices, setVoice] = useState('initial');
  const [modalVisible, setModalVisible] = useState(false);
  const [EmergencyPhone, setEmergencyPhone] = useState([]);
  const [EmergencyData, setEmergencyData] = useState([]);
  const [PhoneData, setPhoeData] = useState({posts: []});
  const [LocationLong, setLocationLong] = useState(null);
  const [currentLocation, setcurrentLocation] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [refresh, setrefresh] = useState(false);

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
  }, [refresh]);

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? '#ffff' : '#ffff',
  // };
  // console.log('rfgfd', LocationLong);
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
  }, [refresh]);

  useEffect(() => {
    dispatch(getPhones());
    setPhoeData(Phones.posts);
  }, [currentId, refresh]);

  const [mobileNumber, setMobileNumber] = useState([]);
  // const [Message, setMessage] = useState('I am On danger');
  let Message = `Your relative ${
    loggedIn?.user?.firstName &&
    loggedIn?.user?.firstName + ' ' + loggedIn?.user.lastName
  } facing some problem,location:${currentLocation}. Phone:${
    loggedIn?.user?.Phone
  }`;

  const sendingSms = (Receivers, Messagex) => {
    try {
      Receivers.map(
        async Numbers =>
          await SmsAndroid.autoSend(
            Numbers,
            Messagex,
            fail => {
              console.log('Failed with this error: ' + fail);
            },
            success => {
              console.log('SMS sent successfully');
            },
          ),
      );
    } catch (e) {
      alert('' + e);
    }
  };

  const userEmergencyPhone = async () => {
    const loggedIna = await AsyncStorage.getItem('emergencyStorageData');
    setEmergencyPhone(JSON.parse(loggedIna));
    const emergencyData = await AsyncStorage.getItem('emergencyFulleData');

    setEmergencyData(JSON.parse(emergencyData));
  };

  const onSubmit = data => {
    mobileNumber.push(data.Phone);
    EmergencyData.push(data);
    AsyncStorage.setItem('emergencyStorageData', JSON.stringify(mobileNumber));
    AsyncStorage.setItem('emergencyFulleData', JSON.stringify(EmergencyData));
    // EmergencyPhoneChanges.push(data.Phone);
    userEmergencyPhone();

    dispatch(
      CreateEmergencyPhone({
        ...data,
        UserID: loggedIn.user._id,
      }),
    );
    setModalVisible(false);
    console.log({data});
  };

  useEffect(() => {
    if (Phones?.posts?.posts) {
      AsyncStorage.setItem(
        'emergencyFulleData',
        JSON.stringify(PhoneData?.posts),
      );
    }
  }, [currentId, PhoneData?.posts, refresh]);

  const validate = (value: string) => {
    const matches = value.match(
      /^(?:0\.(?:0[0-9]|[0-9]\d?)|[0-9]\d*(?:\.\d{1,2})?)(?:e[+-]?\d+)?$/,
    );
    return matches?.length || 'String is not a number';
  };

  useEffect(() => {
    userEmergencyPhone();
  }, [mobileNumber, refresh]);

  useEffect(() => {
    userEmergencyPhone();
  }, [refresh]);

  // console.log('emergency=====', EmergencyData);

  const DeleteData = (id, phne) => {
    console.log('gfdg', id);
    setCurrentId(id);
    dispatch(DeletePhone(id));
    PhoneData?.posts.filter(post => post._id !== id);
    EmergencyPhone?.filter(value => value != phne);
    updatedMobilePhone?.filter(value => value != phne);

    userEmergencyPhone();
  };

  let updatedMobilePhone =
    mobileNumber.length == 0
      ? EmergencyPhone?.filter((item, pos) => mobileNumber.indexOf(item) == pos)
      : mobileNumber.filter((item, pos) => mobileNumber.indexOf(item) == pos);
  console.log('mobileNumber', updatedMobilePhone);
  // const DeleteData = async id => {
  //   try {
  //     console.log({id});
  //     const {data} = await axios.delete(`/${id}`);
  //     console.log(data);
  //     setStatus(data);
  //     setCurrentId(id);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // console.log(
  //   'updatedsddd',
  //   PhoneData.posts.filter(post => post._id !== currentId),
  // );

  let c = EmergencyData?.filter(post => post.UserID === loggedIn?.user?._id);
  let EmergencyDatas = c?.filter(post => post._id !== currentId);
  return (
    <View
      style={{
        height: '100%',
        position: 'relative',
        backgroundColor: '#fff',
      }}>
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
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'center',
                    marginBottom: 15,
                  }}>
                  <Image
                    source={Vector2}
                    resizeMode="contain"
                    style={{
                      width: 12,
                      height: 12,
                      // aspectRatio: 1,
                      marginTop: 0,
                      marginRight: 3,
                    }}
                  />
                  <Text
                    style={{
                      color: '#27AE60',
                      fontWeight: '700',
                      fontSize: 14,
                      margin: 0,
                      marginBottom: 3,
                    }}>
                    Add Your Contact Number
                  </Text>
                </View>
                <View>
                  <Controller
                    name="Name"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: {
                        value: true,
                        message: 'please enter name',
                      },
                    }}
                    render={({field: {onChange, onBlur, value, Name, ref}}) => (
                      <InputBox
                        onChangeText={value => onChange(value)}
                        value={value}
                        label="Full Name"
                        error={errors?.Name}
                        errorText={errors?.Name?.message}
                      />
                    )}
                  />
                  <Controller
                    name="Phone"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: {
                        value: true,
                        message: 'please enter  Phone number',
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
                    render={({field: {onChange, onBlur, value, Name, ref}}) => (
                      <InputBox
                        onChangeText={value => onChange(value)}
                        value={value}
                        label="Phone Number"
                        error={errors?.Phone}
                        errorText={errors?.Phone?.message}
                      />
                    )}
                  />
                  <Controller
                    name="Email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: {
                        value: true,
                        message: 'please enter Email',
                      },
                    }}
                    render={({field: {onChange, onBlur, value, Name, ref}}) => (
                      <InputBox
                        onChangeText={value => onChange(value)}
                        value={value}
                        label="Email Address"
                        error={errors?.Email}
                        errorText={errors?.Email?.message}
                      />
                    )}
                  />
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignContent: 'center',
                  }}>
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
                      borderColor: '#27AE60',
                      backgroundColor: '#27AE60',
                    }}
                    onPress={handleSubmit(onSubmit)}>
                    <Text style={{color: '#fff', paddingHorizontal: 7}}>
                      Add
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
                    onPress={() => {
                      setModalVisible(false);
                    }}>
                    <Text
                      style={{
                        color: '#FF3370',
                      }}>
                      Cancle
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
              }}
              onPress={() => setrefresh(!refresh)}>
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
      <View>
        <View style={{marginBottom: 17}}>
          <Text
            style={{
              textAlign: 'center',
              color: '#0F254F',
              marginBottom: 14,
              fontSize: 16,
              fontWeight: '700',
            }}>
            Emergency Contact
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#000000',
              marginBottom: 14,
              paddingHorizontal: 65,
              fontSize: 12,
              fontWeight: '400',
            }}>
            You can added up to 5 contact number. If you facing a problem when
            traveling, that time we are sent the notification your near contact.
          </Text>
        </View>
        <View
          style={{
            marginLeft: 20,
            marginRight: 20,
            // marginBottom: 30,
            shadowColor: '#000',
            shadowOffset: {width: 15, height: 15},
            shadowOpacity: 10,
            shadowRadius: 20,
            elevation: 5,
            borderRadius: 15,
            backgroundColor: '#fff',
            paddingHorizontal: 15,
            paddingVertical: 20,
          }}>
          <ScrollView>
            <View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#0F254F',
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                  onPress={() => getLocationHandle()}>
                  My Contact
                </Text>
                <Pressable
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#00D253',
                    alignItems: 'center',
                    padding: 6,
                    paddingHorizontal: 12,
                    borderRadius: 5,
                    shadowColor: '#000',
                    shadowOffset: {width: 10, height: 10},
                    shadowOpacity: 10,
                    shadowRadius: 20,
                    elevation: 4,
                  }}
                  onPress={() => setModalVisible(true)}>
                  <Image
                    source={Vector}
                    resizeMode="contain"
                    style={{
                      width: 9,
                      height: 10,
                      // aspectRatio: 1,
                      marginRight: 8,
                      // marginLeft: 'auto',
                    }}
                  />
                  <Text style={{color: '#fff', fontWeight: '600'}}>Add</Text>
                </Pressable>
              </View>
              <View
                style={{
                  height: HEIGHT - 700,
                  maxHeight: HEIGHT - 700,
                }}>
                <ScrollView>
                  {EmergencyDatas?.length > 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#2EC16C',
                        alignItems: 'center',
                        padding: 6,
                        marginTop: 10,
                      }}>
                      <Text
                        style={{
                          width: '25%',
                          color: '#fff',
                          fontWeight: '700',
                        }}>
                        Name
                      </Text>
                      <Text
                        style={{
                          width: '25%',
                          color: '#fff',
                          fontWeight: '700',
                        }}>
                        Phone No
                      </Text>
                      <Text
                        style={{
                          width: '25%',
                          color: '#fff',
                          textAlign: 'center',
                          fontWeight: '700',
                        }}>
                        E-mail
                      </Text>
                      <Text
                        style={{
                          width: '25%',
                          color: '#fff',
                          textAlign: 'right',
                          fontWeight: '700',
                        }}>
                        Action
                      </Text>
                    </View>
                  ) : (
                    <Text>You have not created any report yet</Text>
                  )}

                  {EmergencyDatas?.length > 0 &&
                    EmergencyDatas.map((item, i) => (
                      <View
                        key={i}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: i % 2 === 0 ? '#D6FFE7' : '#D6F5FF',
                          padding: 6,
                          marginBottom: 2,
                        }}>
                        <Text style={{width: '25%', color: '#000000'}}>
                          {i} {item.Name}
                        </Text>
                        <Text style={{width: '35%', color: '#000000'}}>
                          {item.Phone}
                        </Text>
                        <Text style={{display: 'none'}}>
                          {mobileNumber.push(item.Phone)}
                        </Text>

                        <Text style={{width: '35%', color: '#000000'}}>
                          {item.Email}
                        </Text>
                        <View style={{width: '5%', color: '#000000'}}>
                          <Pressable
                            onPress={() => DeleteData(item._id, item.Phone)}>
                            <Image
                              source={Delete}
                              resizeMode="contain"
                              style={{
                                width: 12,
                                height: 12,
                                // aspectRatio: 1,
                                marginTop: 0,
                                marginRight: 3,
                              }}
                            />
                          </Pressable>
                        </View>
                      </View>
                    ))}
                  {/* <TextInput
                  style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    width: '90%',
                  }}
                  onChangeText={Message => setMessage(Message)}
                  value={Message}
                /> */}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <View>
        <Text
          style={{
            textAlign: 'center',
            paddingHorizontal: 35,
            marginTop: 30,
            color: '#000000',
          }}>
          We are sent the mesage Instally with location to your every contact
          number when you are used this “Emegency Button’
        </Text>
        <View>
          <Pressable
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 20,
            }}
            onPress={() => sendingSms(updatedMobilePhone, Message)}>
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
              <Image
                source={Emergency}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  // aspectRatio: 1,
                  marginTop: 0,
                  marginRight: 23,
                }}
              />
              <Text style={{fontSize: 16, color: '#fff', fontWeight: '700'}}>
                Emergency use
              </Text>
            </View>
          </Pressable>
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
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  titleTextsmall: {
    marginVertical: 8,
    fontSize: 16,
  },
  buttonStyle: {
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#8ad24e',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default EmergencyContactScreen;
