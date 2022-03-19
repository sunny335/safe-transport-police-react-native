import axios from 'axios';
import {api} from '../../../urlConfig';
// import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const token = AsyncStorage.getItem('token');
// const token = window.localStorage.getItem('token');
const publicToken = AsyncStorage.getItem('publicToken');
const axiosIntance = axios.create({
  baseURL: api,
  headers: {
    Authorization: token
      ? `Bearer ${token}`
      : '' || publicToken
      ? `Bearer ${publicToken}`
      : '',
  },
});

export default axiosIntance;
