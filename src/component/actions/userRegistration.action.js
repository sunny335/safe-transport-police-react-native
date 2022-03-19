import axios from '../helpers/axios';
import {userRegistrationContants} from './constants';

export const userSignup = user => {
  console.log(user);

  return async dispatch => {
    dispatch({type: userRegistrationContants.USER_REGISTER_REQUEST});
    const res = await axios.post('/policesignup', {
      ...user,
    });
    console.log('res', res);
    if (res.status === 400) {
      const {message} = res.data;
      console.log('mesee', message);
      dispatch({
        type: userRegistrationContants.USER_REGISTER_FAILURE,
        payload: {
          error: res.data.error,
          message: res.data.message,
        },
      });
    }
    if (res.status === 201) {
      const {message} = res.data;

      dispatch({
        type: userRegistrationContants.USER_REGISTER_SUCCESS,
        payload: {
          message,
        },
      });
    }
  };
};
