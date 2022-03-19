import { combineReducers } from '@reduxjs/toolkit';

import ui from './ui';
import login from './login';
export default combineReducers({
  ...ui,
  ...login,
});
