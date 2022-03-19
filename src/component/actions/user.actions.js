import axios from '../helpers/axios';
import {userContants} from './constants';

export const signup = user => {
  console.log(user);

  return async dispatch => {
    dispatch({type: userContants.USER_REGISTER_REQUEST});
    const res = await axios
      .post('/admin/signup', {
        ...user,
      })
      .catch(error => console.log(error));
    console.log('res', res);
    if (res.status === 400) {
      const {message} = res.data;
      console.log('mesee', message);
      dispatch({
        type: userContants.USER_REGISTER_FAILURE,
        payload: {
          error: res.data.error,
          message: res.data.message,
        },
      });
    }
    if (res.status === 201) {
      const {message} = res.data;

      dispatch({
        type: userContants.USER_REGISTER_SUCCESS,
        payload: {
          message,
        },
      });
    }
  };
};
