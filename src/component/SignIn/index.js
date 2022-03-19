import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {userSignup, Userlogin} from '../actions';

const auth = useSelector(state => state.userAuth);
const user = useSelector(state => state.userRegistration);
const userFormLogin = data => {
  // console.log('auth', auth);
  dispatch(Userlogin(data));
};
const index = () => {
  const {
    handleSubmit,
    control,
    formState: {errors},
  } = useForm();

  return <div>index</div>;
};

export default index;
