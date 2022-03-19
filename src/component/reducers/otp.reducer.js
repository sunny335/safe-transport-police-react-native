import {userAuthVerifyConstants} from '../actions/constants';

const initState = {
  phone: '',
};
export default (state = initState, action) => {
  // console.log(action);

  switch (action.type) {
    case userAuthVerifyConstants.OTP_REQUEST:
      state = {
        ...state,

        loading: false,
        OTP_REQUEST: true,
      };
      break;
    case userAuthVerifyConstants.OTP_SUCCESS:
      state = {
        ...state,
        hashData: action.payload.user,

        loading: false,
        OTP_REQUEST: false,
      };
      break;
    case userAuthVerifyConstants.OTP_FAILURE:
      state = {
        ...state,
        hashData: action.payload.user,

        loading: false,
        error: action.payload.error,
        OTP_REQUEST: false,
      };
      break;
    case userAuthVerifyConstants.OTP_VERIFY_REQUEST:
      state = {
        ...state,
        verifying: true,
        verifyed: false,
        loading: false,
      };
      break;
    case userAuthVerifyConstants.OTP_VERIFY_SUCCESS:
      state = {
        ...state,
        verifyStatus: action.payload.user,
        verifying: false,
        verifyed: true,
        loading: false,
      };
      break;
    case userAuthVerifyConstants.OTP_VERIFY_FAILER:
      state = {
        ...state,

        verifying: true,
        verifyed: false,
        loading: false,
        error: action.payload.error,
      };
      break;
  }

  return state;
};
