import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'modal',
  initialState: [],
  reducers: {
    addInfo: (state, { payload }) => {
      state.push(payload);
    },
    deleteItem: (state, { payload }) => {
      return state.filter((item) => item.id !== payload);
    },
  },
});

export const { addInfo, deleteItem } = loginSlice.actions;
export default {
  loginInfo: loginSlice.reducer,
};
