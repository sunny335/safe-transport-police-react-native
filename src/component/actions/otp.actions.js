import axios from '../helpers/axios';
import {userAuthVerifyConstants} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserloginRequesr = phone => {
  // console.log('userLogin From user auth', user);
  return async dispatch => {
    dispatch({type: userAuthVerifyConstants.OTP_REQUEST});
    try {
      const res = await axios.post('/policesigninrequest', {...phone});
      const user = res.data;

      await AsyncStorage.setItem('otpverify', JSON.stringify(user));
      dispatch({
        type: userAuthVerifyConstants.OTP_SUCCESS,
        payload: {
          user,
        },
      });
    } catch (error) {
      dispatch({
        type: userAuthVerifyConstants.OTP_FAILURE,
        payload: {error: error},
      });
    }
  };
};

export const userVerifyAndSign = data => {
  // console.log('userLogin From user auth', user);
  return async dispatch => {
    dispatch({type: userAuthVerifyConstants.OTP_VERIFY_REQUEST});
    try {
      const res = await axios.post('/policeuserVerifyAndSign', {...data});
      const user = res.data;

      dispatch({
        type: userAuthVerifyConstants.OTP_VERIFY_SUCCESS,
        payload: {
          user,
        },
      });
    } catch (error) {
      dispatch({
        type: userAuthVerifyConstants.OTP_VERIFY_FAILER,
        payload: {error: error},
      });
    }
  };
};
