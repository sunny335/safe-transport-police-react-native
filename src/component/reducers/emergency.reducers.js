import {
  FETCH_BY_SEARCH,
  FETCH_REPORTALL,
  CREATE_REPORT,
  FETCH_REPORT,
  UPDATE,
  DELETE_REPORT,
  LIKE,
  START_REPORT_LOADING,
  END_REPORT_LOADING,
  COMMENT,
  CLEAR_REPORT,
} from '../constants/actionTypes';

export default (state = {isLoading: true}, action) => {
  switch (action.type) {
    case START_REPORT_LOADING:
      return {...state, isLoading: true};
    case END_REPORT_LOADING:
      return {...state, isLoading: false};
    case FETCH_REPORTALL:
      return {
        ...state,
        posts: action.payload.data,
        isLoading: false,
        // currentPage: action.payload.currentPage,
        // numberOfPages: action.payload.numberOfPages,
      };
    case FETCH_BY_SEARCH:
      return {...state, posts: action.payload};
    case FETCH_REPORT:
      return {...state, post: action.payload};
    case CLEAR_REPORT:
      return {...state, post: null};
    case LIKE:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload._id ? action.payload : post,
        ),
      };
    case COMMENT:
      return {
        ...state,
        posts: state.posts.map(post => {
          if (post._id === action.payload._id) {
            return action.payload;
          }
          return post;
        }),
      };
    case CREATE_REPORT:
      return {...state, posts: [...state.posts, action.payload]};
    case UPDATE:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload._id ? action.payload : post,
        ),
      };
    case DELETE_REPORT:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
        postDeleteStatus: true,
      };
    default:
      return state;
  }
};
