import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import Input from '../Input/Input';
// import {LinearGradient} from 'expo-linear-gradient';
import {RadioButton} from 'react-native-paper';
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
  Modal,
  Pressable,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  userSignup,
  Userlogin,
  UserloginRequesr,
  userVerifyAndSign,
} from '../actions';
import {useForm, Controller} from 'react-hook-form';
import {t} from 'react-native-tailwindcss';
import image1 from '../image/loginBg.png';
import done from '../image/done.png';
import LinearGradient from 'react-native-linear-gradient';

// const Section = ({children, title}): Node => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };
// const image = {
//   uri: image1,
// };

const Index = ({navigation, setLoggedIns}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [signupProgress, setSignUpProgress] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [number, onChangeNumber] = React.useState(null);
  const [selectedValue, setSelectedValue] = useState('Designation');
  const [selectedValueError, setSelectedValueError] = useState(null);
  const [selectedZoneError, setSelectedZoneError] = useState(null);
  const [policezone, setpolicezone] = useState('Work Zone/Division');
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#ffff' : '#ffff',
  };
  const [login, setLogin] = useState(true);
  const auth = useSelector(state => state.userAuth);
  const user = useSelector(state => state.userRegistration);

  const [loading, setloading] = useState(false);
  const [LoginLoader, setLoginLoader] = useState(false);
  const [Loginerror, setLoginError] = useState('');

  const dispatch = useDispatch();

  const userSignupform = data => {
    // setSignUpProgress(true);
    console.log(data);
    if (selectedValue === 'Designation') {
      setSelectedValueError('please select a designation');
    }
    if (policezone === 'Work Zone/Division') {
      setSelectedZoneError('please select your Work Zone/Division');
    } else {
      setSelectedValueError(null);
      setSelectedZoneError(null);
      data.signupAs = 'police';
      data.accountStatus = 'inactive';
      data.valid = 'false';
      dispatch(userSignup(data));
    }
  };

  console.log('selectedZoneError', selectedZoneError);

  const userFormLogin = data => {
    const datas = {
      email: data.loginemail,
      password: data.loginpassword,
    };
    console.log('auth', datas);
    dispatch(Userlogin(datas));
  };

  useEffect(() => {
    if (user.loading) {
      if (user.message == 'User created Successfully...!') {
        setModalVisible(true);
        setTimeout(() => {
          setLogin(true);
          setModalVisible(false);
        }, 1000);
      } else {
        setModalVisible(false);
      }
    }
  }, [user.loading]);

  useEffect(() => {
    if (user.loading) {
      setloading(true);
    } else {
      setloading(false);
    }
  }, [user.loading]);

  useEffect(() => {
    clearAsyncStorage = async () => {
      AsyncStorage.clear();
    };
    clearAsyncStorage();
  }, []);

  useEffect(() => {
    setLoginLoader(auth.authenticating);
  }, [auth.authenticating]);

  useEffect(() => {
    if (auth.authenticate) {
      AsyncStorage.setItem('isLoggedIn', '1');
      AsyncStorage.setItem('UserData', JSON.stringify(auth));
      let phone = {phone: auth.user.Phone};
      if (auth.user.valid == 'false') {
        dispatch(userVerifyAndSign(phone));
        dispatch(UserloginRequesr(phone));
      } else {
        AsyncStorage.setItem('OTP', 'valid');
      }

      console.log('============d', phone);
      // dispatch(UserloginRequesr(auth.user.Phone));
      // navigation.navigate('Location', {name: 'Location'});
    } else {
      navigation.navigate('SignUp', {name: 'SignUp'});
    }
  }, [auth.authenticate]);

  // const VerifyRequest = () => {
  //   if (auth.authenticate) {
  //     dispatch(UserloginRequesr(auth.user.Phone));
  //   }
  // };

  let condition;
  if (user.message) {
    condition = <Text>Password minimum length 6 character</Text>;
  }
  if (user.loading) {
    condition = <Text>{user.message}Password minimum length 6 character</Text>;
  }

  useEffect(() => {
    if (auth.error) {
      setLoginError('Please enter valid information');
      setLoginLoader(false);
    } else {
      setLoginError('');
    }
  }, [auth.error]);

  const validate = (value: string) => {
    const matches = value.match(
      /^(?:0\.(?:0[0-9]|[0-9]\d?)|[0-9]\d*(?:\.\d{1,2})?)(?:e[+-]?\d+)?$/,
    );
    return matches?.length || 'String is not a number';
  };

  return (
    <>
      <StatusBar barStyle={isDarkMode ? '#fff' : 'dark-content'} />
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
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
                  style={{color: '#27AE60', fontWeight: '700', fontSize: 18}}>
                  You are successfully Created your account
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <ImageBackground
          source={image1}
          resizeMode="cover"
          style={{paddingBottom: 149}}>
          <View>
            <View>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  marginTop: 82,
                  fontWeight: '600',
                  fontSize: 36,
                  color: '#fff',
                }}>
                SAFE
              </Text>
            </View>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                marginTop: 0,
                fontWeight: '400',
                fontSize: 16,
                color: '#fff',
                textTransform: 'uppercase',
              }}>
              Transport
            </Text>
          </View>
        </ImageBackground>
        {signupProgress ? (
          <View>
            <SafeAreaView
              style={{
                marginLeft: 49,
                textAlign: 'center',
              }}>
              <Text
                style={{
                  flex: 1,
                  marginTop: 0,
                  fontWeight: '700',
                  fontSize: 24,
                  color: '#03CA51',
                  textTransform: 'capitalize',
                }}>
                Verify
              </Text>
              <Text
                style={{
                  flex: 1,
                  marginTop: 0,
                  fontWeight: '400',
                  fontSize: 12,
                  color: '#5C5F69',
                  textTransform: 'capitalize',
                  marginBottom: 20,
                }}>
                Submit the six digit passcode.
              </Text>

              <TextInput
                type="number"
                value={Loginemail}
                onChangeText={e => setLoginEmail(e)}
                errorMessage=""
                style={styles.inputs}
              />

              <Text>{Loginerror}</Text>

              <Text style={styles.submitButton}>Submit</Text>
            </SafeAreaView>
            <Text style={styles.alreadyMember}>Any Probem?</Text>
            <Text
              style={{
                marginTop: 5,
                fontWeight: '400',
                fontSize: 10,
                color: '#5C5F69',
                textAlign: 'center',
              }}>
              if you havn’t OTP code in phone.{' '}
              <Text
                onPress={() => setLogin(false)}
                style={{
                  marginTop: 5,
                  fontWeight: '700',
                  fontSize: 10,
                  color: '#0695E3',
                }}>
                {' '}
                Try Again
              </Text>
            </Text>
          </View>
        ) : login ? (
          <View>
            <SafeAreaView
              style={{
                marginLeft: 49,
                textAlign: 'center',
              }}>
              <Text
                style={{
                  flex: 1,
                  marginTop: 0,
                  fontWeight: '700',
                  fontSize: 24,
                  color: '#03CA51',
                  textTransform: 'capitalize',
                }}>
                Sign In
              </Text>
              <Text
                style={{
                  flex: 1,
                  marginTop: 0,
                  fontWeight: '400',
                  fontSize: 12,
                  color: '#5C5F69',
                  textTransform: 'capitalize',
                  marginBottom: 30,
                }}>
                Let’s login into your acccount.
              </Text>
              <Controller
                name="loginemail"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'please enter your Email',
                  },
                }}
                render={({field: {onChange, onBlur, value, name, ref}}) => (
                  <Input
                    onChangeText={value => onChange(value)}
                    value={value}
                    placeholder="Email"
                    type="email"
                    error={errors?.loginemail}
                    errorText={errors?.loginemail?.message}
                  />
                )}
              />

              <Controller
                name="loginpassword"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'please enter a password',
                  },
                  minLength: {
                    value: 8,
                    message: 'Password must have at least 8 characters',
                  },
                }}
                render={({field: {onChange, onBlur, value, name, ref}}) => (
                  <Input
                    onChangeText={value => onChange(value)}
                    value={value}
                    placeholder="password"
                    type="password"
                    error={errors?.loginpassword}
                    errorText={errors?.loginpassword?.message}
                    secureTextEntry={true}
                  />
                )}
              />

              {Loginerror ? (
                <Text style={{color: '#FF3370'}}>{Loginerror}</Text>
              ) : null}
              {/* {condition} */}
              <LinearGradient
                colors={[
                  'rgba(0, 66, 194, 0.93) 8.02%',
                  'rgba(6, 237, 195, 0.86) 48.17%)',
                ]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                locations={[0, 0.6]}
                style={styles.linearGradient}>
                <Text
                  style={styles.LoginsubmitButton}
                  onPress={handleSubmit(userFormLogin)}>
                  {LoginLoader ? 'loading...' : 'Submit'}
                </Text>
              </LinearGradient>
            </SafeAreaView>
            <Text style={styles.alreadyMember}>New Here?</Text>
            <Text
              style={{
                marginTop: 5,
                fontWeight: '400',
                fontSize: 10,
                color: '#5C5F69',
                textAlign: 'center',
              }}>
              Create your acccount and join with us.{' '}
              <Text
                onPress={() => setLogin(false)}
                style={{
                  marginTop: 5,
                  fontWeight: '700',
                  fontSize: 10,
                  color: '#0695E3',
                }}>
                {' '}
                SignUp
              </Text>
            </Text>
          </View>
        ) : (
          <View>
            <SafeAreaView style={{marginLeft: 49, textAlign: 'center'}}>
              <Text
                style={{
                  flex: 1,
                  marginTop: 0,
                  fontWeight: '700',
                  fontSize: 24,
                  color: '#03CA51',
                  textTransform: 'capitalize',
                }}>
                Sign Up
              </Text>
              <Text
                style={{
                  flex: 1,
                  marginTop: 0,
                  fontWeight: '400',
                  fontSize: 12,
                  color: '#5C5F69',
                  textTransform: 'capitalize',
                  marginBottom: 20,
                }}>
                Let’s login into your acccount.
              </Text>

              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'please enter your first name',
                  },
                }}
                render={({field: {onChange, onBlur, value, name, ref}}) => (
                  <Input
                    onChangeText={value => onChange(value)}
                    value={value}
                    placeholder="First Name"
                    error={errors?.firstName}
                    errorText={errors?.firstName?.message}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'please enter your last name',
                  },
                }}
                render={({field: {onChange, onBlur, value, name, ref}}) => (
                  <Input
                    onChangeText={value => onChange(value)}
                    value={value}
                    placeholder="Last Name"
                    error={errors?.lastName}
                    errorText={errors?.lastName?.message}
                  />
                )}
              />

              <Controller
                name="nid"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'please enter your NID/Passport Number',
                  },
                  // minLength: {
                  //   value: 20,
                  //   message: 'Phone number must have at least 11 number',
                  // },
                  // maxLength: {
                  //   value: 20,
                  //   message: 'Phone number max length can be 11',
                  // },
                  validate,
                }}
                render={({field: {onChange, onBlur, value, nid, ref}}) => (
                  <Input
                    onChangeText={value => onChange(value)}
                    value={value}
                    placeholder="NID/Passport Number"
                    error={errors?.nid}
                    errorText={errors?.nid?.message}
                  />
                )}
              />

              <View
                style={{
                  marginLeft: 0,
                  marginBottom: 24,
                  marginTop: -10,
                  overflow: 'hidden',
                  width: '85%',
                }}>
                <Controller
                  name="Designation"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: {
                      value: true,
                      message: 'please select a designation',
                    },
                  }}
                  render={({field: {onChange, onBlur, value, name, ref}}) => (
                    <View
                      style={[
                        t.border,
                        // t.borderGray500,
                        {
                          borderRadius: 15,
                          borderWidth: 1,
                          // width: '100%',
                          height: 34,
                          borderColor:
                            errors?.Designation?.message || selectedValueError
                              ? '#FF3370'
                              : '#000',
                        },
                      ]}>
                      <Picker
                        selectedValue={selectedValue}
                        onValueChange={(value, itemIndex) => {
                          onChange(value);
                          setSelectedValue(value);
                        }}
                        style={{
                          height: 0,
                          width: '100%',
                          paddingBottom: 10,
                          marginTop: -10,
                          color:
                            selectedValue === 'Designation' ? '#ddd' : '#000',
                        }}>
                        <Picker.Item label="Designation" value="Designation" />
                        <Picker.Item
                          label="Commissioner of Police"
                          value="Commissioner of Police"
                        />
                        <Picker.Item
                          label="Additional Commissioner of Police"
                          value="Additional Commissioner of Police"
                        />
                        <Picker.Item
                          label="Joint-Commissioner of Police"
                          value=" Joint-Commissioner of Police"
                        />
                        <Picker.Item
                          label="Deputy Commissioner of Police"
                          value=" Deputy Commissioner of Police"
                        />
                        <Picker.Item
                          label="(Headquarters), Dhaka Metropolitan Police"
                          value="(Headquarters), Dhaka Metropolitan Police"
                        />
                        <Picker.Item
                          label="(Traffic-North), DMP"
                          value="(Traffic-North), DMP"
                        />

                        <Picker.Item label="others" value="others" />
                      </Picker>
                    </View>
                  )}
                />
              </View>
              {selectedValueError && (
                <Text
                  style={{color: '#FF3370', marginTop: -20, marginBottom: 20}}>
                  {selectedValueError}
                </Text>
              )}
              <View
                style={{
                  marginLeft: 0,
                  marginBottom: 24,
                  marginTop: -10,
                  overflow: 'hidden',
                  width: '85%',
                }}>
                <Controller
                  name="zone"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: {
                      value: true,
                      message: 'please select a zone',
                    },
                  }}
                  render={({field: {onChange, onBlur, value, name, ref}}) => (
                    <View
                      style={[
                        t.border,
                        // t.borderGray500,
                        {
                          borderRadius: 15,
                          borderWidth: 1,
                          // width: '100%',
                          height: 34,
                          borderColor:
                            errors?.zone?.message || selectedZoneError
                              ? '#FF3370'
                              : '#000',
                        },
                      ]}>
                      <Picker
                        selectedValue={policezone}
                        onValueChange={(value, itemIndex) => {
                          onChange(value);
                          setpolicezone(value);
                        }}
                        style={{
                          height: 0,
                          width: '100%',
                          paddingBottom: 10,
                          marginTop: -10,
                          color:
                            policezone === 'Work Zone/Division'
                              ? '#ddd'
                              : '#000',
                        }}>
                        <Picker.Item
                          label="Work Zone/Division"
                          value="Work Zone/Division"
                        />
                        <Picker.Item
                          label="(Admin), Dhaka Metropolitan Police"
                          value="(Admin), Dhaka Metropolitan Police"
                        />
                        <Picker.Item
                          label="(Traffic), Dhaka Metropolitan Police"
                          value="(Traffic), Dhaka Metropolitan Police"
                        />
                        <Picker.Item
                          label="(Transport), DMP"
                          value="(Transport), DMP"
                        />
                        <Picker.Item
                          label="(Logistics), Dhaka Metropolitan Police"
                          value="(Logistics), Dhaka Metropolitan Police"
                        />
                        <Picker.Item
                          label="Additional Deputy Commissioner of Police"
                          value="Additional Deputy Commissioner of Police"
                        />
                        <Picker.Item
                          label="Senior / Assistant Commissioner of Police"
                          value="Senior / Assistant Commissioner of Police"
                        />

                        <Picker.Item label="others" value="others" />
                      </Picker>
                    </View>
                  )}
                />
              </View>
              {selectedZoneError !== null ? (
                <Text
                  style={{color: '#FF3370', marginTop: -20, marginBottom: 20}}>
                  {selectedZoneError}
                </Text>
              ) : null}
              <Controller
                name="Phone"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'please enter your phone number',
                  },
                  minLength: {
                    value: 11,
                    message: 'Phone number must have at least 11 number',
                  },
                  maxLength: {
                    value: 11,
                    message: 'Phone number max length can be 11',
                  },
                  validate,
                }}
                render={({field: {onChange, onBlur, value, name, ref}}) => (
                  <Input
                    onChangeText={value => onChange(value)}
                    value={value}
                    placeholder="Phone Number"
                    error={errors?.Phone}
                    errorText={errors?.Phone?.message}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'please enter your Email',
                  },
                }}
                render={({field: {onChange, onBlur, value, name, ref}}) => (
                  <Input
                    onChangeText={value => onChange(value)}
                    value={value}
                    placeholder="Email"
                    error={errors?.email}
                    errorText={errors?.email?.message}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: {
                    value: true,
                    message: 'please enter a password',
                  },
                  minLength: {
                    value: 8,
                    message: 'Password must have at least 8 characters',
                  },
                }}
                render={({field: {onChange, onBlur, value, name, ref}}) => (
                  <Input
                    onChangeText={value => onChange(value)}
                    value={value}
                    placeholder="password"
                    error={errors?.password}
                    errorText={errors?.password?.message}
                    secureTextEntry={true}
                  />
                )}
              />
              <LinearGradient
                colors={[
                  'rgba(0, 66, 194, 0.93) 8.02%',
                  'rgba(6, 237, 195, 0.86) 48.17%)',
                ]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                locations={[0, 0.6]}
                style={styles.linearGradient}>
                <Text
                  style={styles.submitButton}
                  onPress={handleSubmit(userSignupform)}>
                  {loading ? 'loading...' : 'Submit'}
                </Text>
              </LinearGradient>
            </SafeAreaView>
            <Text style={styles.alreadyMember}>Already Member?</Text>
            <Text
              style={{
                marginTop: 5,
                fontWeight: '400',
                fontSize: 10,
                color: '#5C5F69',
                textAlign: 'center',
              }}>
              Login your acccount and join with us.{' '}
              <Text
                onPress={() => setLogin(true)}
                style={{
                  marginTop: 5,
                  fontWeight: '700',
                  fontSize: 10,
                  color: '#0695E3',
                }}>
                Sign In
              </Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  inputError: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 10,
  },
  alreadyMember: {
    flex: 1,
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
    // backgroundColor: '#00D253',
    height: 41,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    display: 'flex',
    // flex: 1,
    flexDirection: 'row',
    paddingTop: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  LoginsubmitButton: {
    borderRadius: 45,
    width: 300,
    textAlign: 'center',
    // backgroundColor: '#00D253',
    height: 41,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    display: 'flex',
    // flex: 1,
    flexDirection: 'row',
    paddingTop: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  linearGradient: {
    borderRadius: 45,
    width: 300,
    height: 41,
    flexDirection: 'row',
    alignItems: 'center',
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
  inputs: {
    height: 40,
    marginBottom: 12,
    width: 300,
    padding: 10,
    backgroundColor: '#fafafa',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.6,
    shadowRadius: 3,
    color: '#5C5F69',
    borderRadius: 45,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    width: 300,
    height: 300,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Index;
