import {userAuthConstants} from '../actions/constants';

const initState = {
  token: null,
  user: {
    firstName: '',
    lastName: '',
    email: '',
    picture: '',
  },
  authenticate: false,
  authenticating: false,
  loading: false,
  error: null,
  message: '',
};
export default (state = initState, action) => {
  // console.log(action);

  switch (action.type) {
    case userAuthConstants.LOGIN_REQUEST:
      state = {
        ...state,
        authenticating: true,
        authenticate: false,
        loading: false,
      };
      break;
    case userAuthConstants.LOGIN_SUCCESS:
      state = {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: true,
        authenticating: false,
        loading: false,
      };
      break;
    case userAuthConstants.LOGIN_FAILURE:
      state = {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: false,
        authenticating: true,
        error: action.payload.error,
      };
      break;
    case userAuthConstants.LOGOUT_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case userAuthConstants.LOGOUT_SUCCESS:
      state = {
        ...initState,
        logout: true,
      };
      break;
    case userAuthConstants.LOGOUT_FAILURE:
      state = {
        ...state,
        error: action.payload.error,
        loading: false,
      };
      break;
  }

  return state;
};
