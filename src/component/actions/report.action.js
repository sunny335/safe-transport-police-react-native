import {
  FETCH_REPORTALL,
  FETCH_REPORT,
  CREATE_REPORT,
  DELETE_REPORT,
  START_REPORT_LOADING,
  END_REPORT_LOADING,
  CLEAR_REPORT,
} from '../constants/actionTypes';

// import * as api from '../api/index';
import api from '../helpers/axios.js';

export const clearPost = () => {
  return {type: CLEAR_REPORT};
};

export const getPosts = () => async dispatch => {
  try {
    dispatch({type: START_REPORT_LOADING});
    // const { data } = await api.fetchPosts(page);
    const data = await api.get('/getReportData');
    // const alldata = data;
    // console.log('dataaaaa', data);
    dispatch({type: FETCH_REPORTALL, payload: data});
    dispatch({type: END_REPORT_LOADING});
  } catch (error) {
    console.log(error.message);
  }
};

export const getPost = id => async dispatch => {
  try {
    dispatch({type: START_REPORT_LOADING});
    const {data} = await api.fetchPost(id);

    dispatch({type: FETCH_REPORT, payload: data});
    dispatch({type: END_REPORT_LOADING});
  } catch (error) {
    console.log(error.message);
  }
};

// export const getPostsBySearch = searchQuery => async dispatch => {
//   try {
//     dispatch({type: START_REPORT_LOADING});
//     const {
//       data: {data},
//     } = await api.fetchPostsBySearch(searchQuery);
//     dispatch({type: FETCH_BY_SEARCH, payload: data});

//     dispatch({type: END_REPORT_LOADING});
//   } catch (error) {
//     console.log(error.message);
//   }
// };

export const CreateReport = (post, history) => async dispatch => {
  try {
    // const { data } = await api.CREATE_REPORTPost(post);
    const data = await api.post('/reports', post);
    dispatch({type: CREATE_REPORT, payload: data});

    // history.push(`posts/${data._id}`);
  } catch (error) {
    console.log(error.message);
  }
};

// export const updatePost = (id, post) => async dispatch => {
//   try {
//     const {data} = await api.updatePost(id, post);
//     dispatch({type: UPDATE, payload: data});
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const DeletePost = id => async dispatch => {
//   try {
//     const data = await api.DELETE_REPORT('/:id', post);
//     // await api.DELETE_REPORTPost(id);
//     dispatch({type: DELETE_REPORT, payload: id});
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const likePost = id => async dispatch => {
//   try {
//     const {data} = await api.likePost(id);
//     dispatch({type: LIKE, payload: data});
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const commentPost = (value, id) => async dispatch => {
//   try {
//     const {data} = await api.comment(value, id);
//     dispatch({type: COMMENT, payload: data});
//     return data.comments;
//   } catch (error) {
//     console.log(error.message);
//   }
// };
