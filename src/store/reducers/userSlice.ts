import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string | undefined;
  email: string | null | undefined;
}

interface UserState {
  userData: User[];
}

const initialState: UserState = {
  userData: []
};

const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
        state.userData.push(action.payload)
    },

    clearUserData: (state) => {
      state.userData = []
    }
  }
});

export const { setUserData, clearUserData } = userSlice.actions

export default userSlice.reducer