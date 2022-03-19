import axios from '../helpers/axios';
import {userAuthConstants} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Userlogin = userData => {
  // console.log('userLogin From user auth', user);
  return async dispatch => {
    dispatch({type: userAuthConstants.LOGIN_REQUEST});
    try {
      const res = await axios.post('/policesignin', {
        ...userData,
      });
      if (res.status === 200) {
        const {token, user} = res.data;
        await AsyncStorage.setItem('publicToken', token);
        await AsyncStorage.setItem('publicUser', JSON.stringify(user));
        dispatch({
          type: userAuthConstants.LOGIN_SUCCESS,
          payload: {
            token,
            user,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: userAuthConstants.LOGIN_FAILURE,
        payload: {error: error},
      });
    }
  };
};

// export const UserloginRequesr = phone => {
//   // console.log('userLogin From user auth', user);
//   return async dispatch => {
//     // dispatch({ type: userAuthConstants.LOGIN_REQUEST });
//     try {
//       const res = await axios.post('/signinrequest', {...phone});
//       if (res.status === 200) {
//         const user = res.data;
//         await AsyncStorage.setItem('publicToken', token);
//         await AsyncStorage.setItem('publicUser', JSON.stringify(user));
//         dispatch({
//           type: userAuthConstants.LOGIN_SUCCESS,
//           payload: {
//             token,
//             user,
//           },
//         });
//       }
//     } catch (error) {
//       dispatch({
//         type: userAuthConstants.LOGIN_FAILURE,
//         payload: {error: error},
//       });
//     }
//   };
// };

export const isUserFormLoggedIn = () => {
  return async dispatch => {
    const token = AsyncStorage.getItem('publicToken');
    if (token) {
      const user = JSON.parse(AsyncStorage.getItem('publicUser'));
      dispatch({
        type: userAuthConstants.LOGIN_SUCCESS,
        payload: {
          token,
          user,
        },
      });
    } else {
      dispatch({
        type: userAuthConstants.LOGIN_FAILURE,
        payload: {error: 'Failed to login'},
      });
    }
  };
};

export const UserFormsignout = () => {
  return async dispatch => {
    dispatch({type: userAuthConstants.LOGOUT_REQUEST});
    const res = await axios.post('/policesignout');

    if (res.status === 200) {
      AsyncStorage.clear();
      AsyncStorage.setItem('OTP', 'invalid');
      dispatch({
        type: userAuthConstants.LOGOUT_SUCCESS,
      });
    } else {
      dispatch({
        type: userAuthConstants.LOGOUT_FAILURE,
        payload: {error: res.data.error},
      });
    }
  };
};
