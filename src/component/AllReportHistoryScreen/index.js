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
  Modal,
  Pressable,
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import SelectDropdown from 'react-native-select-dropdown';

import {useDispatch, useSelector} from 'react-redux';
import {t} from 'react-native-tailwindcss';
import axios from 'axios';

import image1 from '../image/loginBg.png';
// import profile from '../image/profile.jpg';
import avatar from '../image/avatar.png';
import DoubleRight from '../image/DoubleRight.png';
import axioss from '../helpers/axios';
import HomeImg from '../image/Home.png';
import ProfileImg from '../image/profileicon.png';
import QrCode from '../image/QrCode.png';
import refreshIcon from '../image/refresh.png';
import {getPosts} from '../actions/report.action';

import {color} from 'react-native-reanimated';
const HEIGHT = Dimensions.get('window').height;

const Index = ({navigation}) => {
  // const userauth = useSelector(state => state.userAuth);
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedValue, setSelectedValue] = useState(null);
  const [loggedIn, setLoggedIn] = useState({});
  const posts = useSelector(state => state.reports);
  const [Report, setReport] = useState({posts: []});
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUserID, setmodalUserID] = useState(null);
  const [refresh, setrefresh] = useState(false);
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
    // axios
    //   .get('http://safetransport-backend.herokuapp.com/api/getReportData')
    //   .then(res => {
    //     const persons = res;
    //     setReport(persons?.data);
    //   });
    setReport(posts.posts);
  }, [refresh]);

  console.log('id===========', modalUserID);
  let ReportbackendData = [];

  ReportbackendData = Report?.posts?.length >= 1 && Report?.posts;
  let filterReportedData =
    ReportbackendData.length > 0 &&
    ReportbackendData.filter(item => item?._id === modalUserID);

  console.log('===========', filterReportedData);

  const ReporterStatus = async (ReportStatus, id) => {
    setSelectedValue(ReportStatus);
    const AccountStatusData = {
      ReportStatus,
      id,
    };
    await axioss.post('/updateReport', {
      ...AccountStatusData,
    });
    console.log('selectedItem', id);
  };

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
              {/* <Image
                source={DoubleRight}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  aspectRatio: 1,
                  marginTop: 10,
                }}
              /> */}
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
              <Pressable
                style={{marginLeft: 'auto'}}
                onPress={() => setrefresh(!refresh)}>
                <Image
                  source={refreshIcon}
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
      <View style={{marginBottom: 17}}>
        <Text
          style={{
            textAlign: 'center',
            color: '#0F254F',
            marginBottom: 14,
            fontSize: 16,
            fontWeight: '700',
          }}>
          View Report History
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
          Now you see your report status. After complate the report we will sent
          a full information to your Email address.
        </Text>
      </View>
      <View
        style={{
          height: HEIGHT - 480,
          maxHeight: HEIGHT - 480,
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
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#263238',
                    fontWeight: '700',
                    marginBottom: 14,
                  }}>
                  All Reports
                </Text>
                <Pressable
                  style={{marginLeft: 'auto'}}
                  onPress={() => setrefresh(!refresh)}>
                  <Image
                    source={refreshIcon}
                    resizeMode="contain"
                    style={{
                      width: 20,
                      height: 20,
                      aspectRatio: 1,
                      marginTop: 0,
                      marginLeft: 'auto',
                    }}
                  />
                </Pressable>
              </View>
              <ScrollView
                horizontal={true}
                // showsHorizontalScrollIndicator={false}
                // pagingEnabled={true}
                style={{
                  marginBottom: 30,
                  width: '100%',
                  // backgroundColor: '#000',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: '#ddd',
                  }}>
                  {ReportbackendData.length > 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#2F80ED',
                        alignItems: 'center',
                        padding: 6,
                        width: '100%',
                      }}>
                      <Text style={{width: 30, color: '#fff'}}>S.N</Text>
                      <Text
                        style={{
                          width: 100,
                          color: '#fff',
                          textAlign: 'center',
                        }}>
                        Reporter Name
                      </Text>
                      <Text
                        style={{
                          width: 120,
                          color: '#fff',
                          textAlign: 'center',
                        }}>
                        Reporter Phone No
                      </Text>
                      <Text
                        style={{
                          width: 130,
                          color: '#fff',
                          textAlign: 'center',
                        }}>
                        Report Type
                      </Text>
                      <Text
                        style={{width: 70, color: '#fff', textAlign: 'center'}}>
                        Date
                      </Text>
                      <Text
                        style={{width: 70, color: '#fff', textAlign: 'center'}}>
                        Status
                      </Text>
                    </View>
                  ) : (
                    <Text>No report Found</Text>
                  )}

                  {ReportbackendData.length > 0 &&
                    ReportbackendData.map((item, i) => (
                      <Pressable>
                        <View
                          key={i}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#D6FFE7',
                            padding: 6,
                            marginBottom: 2,
                            width: '100%',
                            height: 44,
                          }}>
                          {/* {item?.ReportedBusInfo
                          ? item.ReportedBusInfo.map(items => (
                              <>
                                <Text
                                  style={{width: '33.33%', color: '#000000'}}>
                                  {items.name}
                                </Text>
                                <Text
                                  style={{width: '33.33%', color: '#000000'}}>
                                  {items.busNumber}
                                </Text>
                              </>
                            ))
                          : null} */}
                          <Text
                            style={{width: 30, color: '#000000'}}
                            onPress={() => {
                              setModalVisible(true);
                              setmodalUserID(item?._id);
                            }}>
                            {i}
                          </Text>
                          <Text
                            style={{
                              width: 100,
                              color: '#000000',
                              textAlign: 'center',
                            }}
                            onPress={() => {
                              setModalVisible(true);
                              setmodalUserID(item?._id);
                            }}>
                            {item.ReporterData.firstName}{' '}
                            {item.ReporterData.lastName}
                          </Text>
                          <Text
                            style={{
                              width: 100,
                              color: '#000000',
                              textAlign: 'center',
                            }}>
                            {item.ReporterData.Phone}{' '}
                          </Text>
                          <Text
                            style={{
                              width: 130,
                              color: '#000000',
                              textAlign: 'center',
                            }}
                            onPress={() => {
                              setModalVisible(true);
                              setmodalUserID(item?._id);
                            }}>
                            {item.ReportType}{' '}
                          </Text>
                          <Text
                            style={{
                              width: 70,
                              color: '#000000',
                              textAlign: 'center',
                            }}
                            onPress={() => {
                              setModalVisible(true);
                              setmodalUserID(item?._id);
                            }}>
                            {item.createdAt.split('T')[0]}
                          </Text>
                          <View
                            style={{
                              width: 80,
                              color: '#000000',
                              textAlign: 'center',
                            }}>
                            {/* <Picker
                              selectedValue={selectedValue}
                              mode="dialog"
                              onValueChange={(itemValue, itemIndex) =>
                                setSelectedValue(itemValue)
                              }
                              style={{
                                height: 0,
                                width: 100,
                                paddingBottom: 10,
                                marginTop: 0,
                                backgroundColor: '#ddd',
                                fontSize: 12,
                              }}>
                              <Picker.Item label="Active" value="Active" />
                              <Picker.Item
                                label="Procesing"
                                value=" Procesing"
                              />
                              <Picker.Item label="Complete" value=" Complete" />
                            </Picker> */}
                            <SelectDropdown
                              data={['Active', 'Processing', 'Complete']}
                              buttonTextStyle={{
                                fontSize: 12,
                                padding: 0,
                                color:
                                  (item?.ReportStatus == 'Active' &&
                                    '#FF004D') ||
                                  (item?.ReportStatus == 'Processing' &&
                                    '#0695E3') ||
                                  (item?.ReportStatus == 'Complete' &&
                                    '#2745AE'),
                              }}
                              buttonStyle={{
                                padding: 0,
                                width: 90,
                                margin: 0,
                                height: 40,
                                backgroundColor: '#D6FFE7',
                              }}
                              dropdownStyle={{
                                width: 100,
                                left: 70,
                                marginLeft: -15,
                                padding: 0,
                                borderRadius: 4,
                              }}
                              // statusBarTranslucent={true}
                              rowTextStyle={{
                                color: '#fff',
                                height: 20,
                                fontSize: 14,
                                padding: 0,
                              }}
                              rowStyle={{
                                padding: 0,
                                height: 35,
                                borderRadius: 4,
                              }}
                              dropdownBackgroundColor="#06EDC3"
                              // dropdownOverlayColor="#fff"
                              defaultValue={
                                item?.ReportStatus
                                  ? item.ReportStatus
                                  : 'Active'
                              }
                              onSelect={(selectedItem, index) => {
                                ReporterStatus(selectedItem, item?._id);
                              }}
                            />
                          </View>
                        </View>
                        {/* {item?.ReportStatus} */}
                      </Pressable>
                    ))}
                </View>
                {modalVisible && (
                  <Modal
                    animationType="fade"
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
                      <View View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginBottom: 14,
                                marginTop: 14,
                              }}>
                              <Text
                                style={{
                                  color: '#263238',
                                  fontSize: 16,
                                  fontWeight: '600',
                                }}>
                                Report Type:
                              </Text>
                              <Text
                                style={{
                                  color: '#455A64',
                                  fontSize: 14,
                                  fontWeight: '600',
                                }}>
                                {filterReportedData[0]?.ReportType}
                              </Text>
                            </View>
                            <View>
                              {filterReportedData[0]?.ReportedBusInfo
                                ? filterReportedData[0].ReportedBusInfo.map(
                                    items => (
                                      <>
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
                                                source={{
                                                  uri: items.TravelChart,
                                                }}
                                                resizeMode="contain"
                                                style={{
                                                  height: 70,
                                                  aspectRatio: 1,
                                                  width: 70,
                                                }}
                                              />
                                              <Text
                                                style={{
                                                  color: '#455A64',
                                                  marginTop: 16,
                                                }}>
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
                                            <Text
                                              style={{
                                                color: '#455A64',
                                                marginTop: 16,
                                              }}>
                                              Driver Image
                                            </Text>
                                            <Image
                                              source={{
                                                uri: items.DriverImage,
                                              }}
                                              resizeMode="contain"
                                              style={[
                                                {
                                                  height: 80,
                                                  width: '100%',
                                                  overflow: 'hidden',
                                                },
                                              ]}
                                            />
                                          </View>
                                        </View>
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
                                            : {items?.name}
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
                                            : {items?.busNumber}
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
                                            Phone Number
                                          </Text>
                                          <Text
                                            style={{
                                              color: '#263238',
                                              fontSize: 14,
                                              fontWeight: '400',
                                            }}>
                                            : {items?.PhoneNumber}
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
                                            Driver Name
                                          </Text>
                                          <Text
                                            style={{
                                              color: '#263238',
                                              fontSize: 14,
                                              fontWeight: '400',
                                            }}>
                                            : {items?.DriverName}
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
                                            driver License
                                          </Text>
                                          <Text
                                            style={{
                                              color: '#263238',
                                              fontSize: 14,
                                              fontWeight: '400',
                                            }}>
                                            : {items?.DriverLicense}
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
                                            Driver Phone
                                          </Text>
                                          <Text
                                            style={{
                                              color: '#263238',
                                              fontSize: 14,
                                              fontWeight: '400',
                                            }}>
                                            : {items?.DriverPhone}
                                          </Text>
                                        </View>
                                      </>
                                    ),
                                  )
                                : null}
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  marginTop: 20,
                                }}>
                                <Text
                                  style={styles.submitButton}
                                  onPress={() => setModalVisible(false)}>
                                  CLose
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Modal>
                )}
              </ScrollView>
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
    minWidth: '80%',
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
  submitButton: {
    borderRadius: 45,
    width: 200,
    textAlign: 'center',
    backgroundColor: '#00D253',
    height: 41,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 8,
  },
});

export default Index;
