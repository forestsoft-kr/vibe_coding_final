import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null; // Replace 'any' with a proper user type
  accessToken: string | null;
}

// localStorage에서 인증 정보 복원
let persistedUser = null;
let persistedToken = null;
try {
  const userStr = localStorage.getItem('auth_user');
  const tokenStr = localStorage.getItem('auth_token');
  if (userStr) persistedUser = JSON.parse(userStr);
  if (tokenStr) persistedToken = tokenStr;
} catch {}

const initialState: AuthState = {
  isAuthenticated: !!persistedUser && !!persistedToken,
  user: persistedUser,
  accessToken: persistedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: any; accessToken: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      // localStorage에 인증 정보 저장
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      localStorage.setItem('auth_token', action.payload.accessToken);
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      // localStorage에서 인증 정보 제거
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
