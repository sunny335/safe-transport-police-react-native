import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import Input from '../Input/Input';
// import { LinearGradient } from 'expo-linear-gradient';
import LinearGradient from 'react-native-linear-gradient';
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

import {useDispatch, useSelector} from 'react-redux';
import {
  userSignup,
  Userlogin,
  UserloginRequesr,
  userVerifyAndSign,
} from '../actions';
import {useForm, Controller} from 'react-hook-form';
import {createPost} from '../actions/otp.actions';

import image1 from '../image/loginBg.png';
// import done from '../image/done.png';

const Index = ({navigation, setLoggedIns}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const otpData = useSelector(state => state.otp);
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#ffff' : '#ffff',
  };

  const auth = useSelector(state => state.userAuth);
  const user = useSelector(state => state.userRegistration);

  const [loading, setloading] = useState(false);
  const [loggedIn, setLoggedIn] = useState({});
  const [LoginLoader, setLoginLoader] = useState(false);
  const [Loginerror, setLoginError] = useState('');
  const [hashData, sethashData] = useState(null);
  // const [verifying, setverifying] = useState(false);
  const [OTP, setOTP] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (user.loading) {
      setloading(true);
    } else {
      setloading(false);
    }
  }, [user.loading]);

  useEffect(() => {
    setLoginLoader(auth.authenticating);
  }, [auth.authenticating]);

  const userFormLogin = async () => {
    const loggedIna = await AsyncStorage.getItem('UserData');
    setLoggedIn(JSON.parse(loggedIna));
    const ab = await AsyncStorage.getItem('otpverify');
    sethashData(JSON.parse(ab));
  };

  useEffect(() => {
    userFormLogin();
  }, []);

  const HandleOtp = () => {
    let phone = {phone: loggedIn.user.Phone};
    dispatch(UserloginRequesr(phone));
    setLoginError('');
    console.log(phone);
  };

  const HandleOtpVerify = () => {
    if (OTP.length === 6) {
      setLoginError('');

      let phone = {
        phone: loggedIn.user.Phone,
        otp: OTP,
        hash: hashData,
        id: loggedIn.user._id,
      };
      dispatch(userVerifyAndSign(phone));
      console.log(phone);
      if (otpData?.verifyStatus == 'Otp is expired') {
        setLoginError('your otp is expired');
      }
      if (otpData?.verifyStatus?.status == 'success') {
        setLoginError('otp Verify successfull');
        // setverifying(true);
      }
    } else {
      setLoginError('Please enter Valid OTP');
    }
  };

  useEffect(() => {
    if (!otpData.verifying) {
      if (otpData?.verifyStatus?.status == 'success') {
        AsyncStorage.setItem('OTP', 'valid');
        setLoginError('otp Verify successfull');
      }
    }
  }, [otpData.verifying]);

  useEffect(() => {
    if (otpData?.hashData !== undefined) {
      sethashData(otpData?.hashData);
    }
  }, [otpData?.hashData]);

  // console.log('gtfsdrdfg', loggedIn?.user?.Phone);
  console.log('otpDATA');
  return (
    <>
      <StatusBar barStyle={isDarkMode ? '#fff' : 'dark-content'} />

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
                color: '#033ACA',
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
              // value={Loginemail}
              onChangeText={e => setOTP(e)}
              errorMessage=""
              style={styles.inputs}
            />

            <Text style={{color: 'red', marginBottom: 10}}>{Loginerror}</Text>
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
                onPress={() => HandleOtpVerify()}>
                Submit
              </Text>
            </LinearGradient>
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
              onPress={() => HandleOtp()}
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

    alignItems: 'center',
  },
  linearGradient: {
    borderRadius: 45,
    width: 300,
    height: 41,
    flexDirection: 'row',
    alignItems: 'center',
  },
  LoginsubmitButton: {
    borderRadius: 45,
    width: 300,
    textAlign: 'center',
    backgroundColor: '#00D253',
    height: 41,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    paddingTop: 8,
    marginTop: 10,
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
