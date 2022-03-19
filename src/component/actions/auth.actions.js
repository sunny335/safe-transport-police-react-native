import axios from '../helpers/axios';
import {authConstants} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = user => {
  console.log('userLogin From user auth', user);
  return async dispatch => {
    dispatch({type: authConstants.LOGIN_REQUEST});
    const res = await axios
      .post('/admin/signin', {
        ...user,
      })
      .catch(error => console.log(error));

    if (res.status === 200) {
      const {token, user} = res.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: {
          token,
          user,
        },
      });
    } else {
      if (res.status === 400) {
        dispatch({
          type: authConstants.LOGIN_FAILURE,
          payload: {error: res.data.error},
        });
      }
    }
  };
};

export const isUserLoggedIn = () => {
  return async dispatch => {
    const token = AsyncStorage.getItem('token');
    if (token) {
      const user = JSON.parse(AsyncStorage.getItem('user'));
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: {
          token,
          user,
        },
      });
    } else {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: {error: 'Failed to login'},
      });
    }
  };
};

export const signout = () => {
  return async dispatch => {
    dispatch({type: authConstants.LOGOUT_REQUEST});
    const res = await axios.post('/admin/signout');
    if (res.status === 200) {
      AsyncStorage.clear();
      dispatch({
        type: authConstants.LOGOUT_SUCCESS,
      });
    } else {
      dispatch({
        type: authConstants.LOGOUT_FAILURE,
        payload: {error: res.data.error},
      });
    }
  };
};
