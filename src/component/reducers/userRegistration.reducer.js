import {userRegistrationContants} from '../actions/constants';

const initState = {
  error: null,
  message: '',
  loading: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case userRegistrationContants.USER_REGISTER_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case userRegistrationContants.USER_REGISTER_FAILURE:
      state = {
        ...state,
        loading: true,
        error: action.payload.error,
        message: 'sign up request failed',
      };
      break;
    case userRegistrationContants.USER_REGISTER_SUCCESS:
      state = {
        ...state,
        loading: false,
        message: action.payload.message,
      };
      break;
  }
  return state;
};
