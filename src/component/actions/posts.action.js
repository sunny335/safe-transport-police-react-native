import {
  FETCH_BY_SEARCH,
  FETCH_ALL,
  FETCH_POST,
  CREATE,
  UPDATE,
  DELETE,
  LIKE,
  START_LOADING,
  END_LOADING,
  COMMENT,
  CLEAR_POST,
} from '../constants/actionTypes';

// import * as api from '../api/index';
import api from '../helpers/axios.js';

export const clearPost = () => {
  return {type: CLEAR_POST};
};

export const getPosts = () => async dispatch => {
  try {
    dispatch({type: START_LOADING});
    // const { data } = await api.fetchPosts(page);
    const data = await api.get('/getQrdata');
    // const alldata = data;
    // console.log('dataaaaa', data);
    dispatch({type: FETCH_ALL, payload: data});
    dispatch({type: END_LOADING});
  } catch (error) {
    console.log(error.message);
  }
};

export const getPost = id => async dispatch => {
  try {
    dispatch({type: START_LOADING});
    const {data} = await api.fetchPost(id);

    dispatch({type: FETCH_POST, payload: data});
    dispatch({type: END_LOADING});
  } catch (error) {
    console.log(error.message);
  }
};

export const getPostsBySearch = searchQuery => async dispatch => {
  try {
    dispatch({type: START_LOADING});
    const {
      data: {data},
    } = await api.fetchPostsBySearch(searchQuery);
    dispatch({type: FETCH_BY_SEARCH, payload: data});

    dispatch({type: END_LOADING});
  } catch (error) {
    console.log(error.message);
  }
};

export const createPost = (post, history) => async dispatch => {
  try {
    // const { data } = await api.createPost(post);
    const data = await api.post('/posts', post);
    dispatch({type: CREATE, payload: data});

    // history.push(`posts/${data._id}`);
  } catch (error) {
    console.log(error.message);
  }
};

export const updatePost = (id, post) => async dispatch => {
  try {
    const {data} = await api.updatePost(id, post);
    dispatch({type: UPDATE, payload: data});
  } catch (error) {
    console.log(error);
  }
};

// export const deletePost = id => async dispatch => {
//   try {
//     const data = await api.delete('/:id', post);
//     // await api.deletePost(id);
//     dispatch({type: DELETE, payload: id});
//   } catch (error) {
//     console.log(error);
//   }
// };

export const likePost = id => async dispatch => {
  try {
    const {data} = await api.likePost(id);
    dispatch({type: LIKE, payload: data});
  } catch (error) {
    console.log(error);
  }
};

export const commentPost = (value, id) => async dispatch => {
  try {
    const {data} = await api.comment(value, id);
    dispatch({type: COMMENT, payload: data});
    return data.comments;
  } catch (error) {
    console.log(error.message);
  }
};
