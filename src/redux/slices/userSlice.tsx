import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signIn, signUp, confirmEmail, fetchUserInfoFromToken, saveVisitorInfo } from '../../api/Users';
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

type userState = {
  userInfo: { [key: string]: string | number | boolean } | null;
  loading: boolean;
  errorMessage: string;
  emailSentForConfirmation: boolean;
  pendingConfirmEmail: boolean;
  confirmedEmail: boolean;
};
type thunkData = {
  [key: string] : any;
}

const initialState: userState = {
  userInfo: null,
  loading: false,
  errorMessage: '',
  emailSentForConfirmation: false,
  pendingConfirmEmail: true,
  confirmedEmail: false,
};

export const confirmEmailThunk = createAsyncThunk(
  'user/confirmEmail',
  async (data: thunkData, thunkApi) => {
    const {verificationCode, userId } = data;
    try {
      const res = await confirmEmail(verificationCode, userId);
      console.log(res.data);
      return res.data;
    } catch (err: any) {
      console.log(err.data?.message);
      toast.error(err.data?.message);
      return thunkApi.rejectWithValue(err.data?.message);
    }
  }
);

export const signInThunk = createAsyncThunk(
  'user/signIn',
  async (data: thunkData, thunkApi) => {
    const { email, password } = data;
    try {
      const res = await signIn(email, password);
      return res.data;
    } catch (err: any) {
      console.log(err);
      if (err.status !== 401) {
        if (err.message) {
          toast.error(err.message);
        } else {
          toast.error(err.data?.message);
        }
      }
      // return thunkApi.rejectWithValue(err.message || err.data?.message);
      return thunkApi.rejectWithValue({ statusCode: err.status, message: err.message || err.data?.message });
    }
  }
);

export const signUpThunk = createAsyncThunk(
  'user/signUp',
  async (data: thunkData, thunkApi) => {
    const { email, password, username } = data;
    try {
      const { data } = await signUp(email, password, username);
      return data;
    } catch (err: any) {
      console.log(err.data?.message);
      toast.error(err.data?.message);
      return thunkApi.rejectWithValue(err.data?.message);
    }
  }
);

export const getUserInfoThunk = createAsyncThunk(
  'user/getUserInfo',
  async (token: string, thunkApi) => {
    try {
      const { data } = await fetchUserInfoFromToken(token);
      return data;
    } catch (err: any) {
      console.log(err.data?.message);
      //toast.error(err.data?.message);
      return thunkApi.rejectWithValue(err.data?.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      Cookies.remove('userInfo');
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signInThunk.fulfilled, (state, action) => {
      let info = { ...action.payload };
      delete info.success;
      state.userInfo = info;
      Cookies.set('userInfo', JSON.stringify(info), { expires: 1 });
      state.emailSentForConfirmation = true;
    })
    .addCase(signInThunk.rejected, (state, action: any) => {
      console.log(action.payload);
      state.errorMessage = action.payload.message;
    })
    .addCase(signUpThunk.fulfilled, (state, action: any) => {
      state.emailSentForConfirmation = true;
    })
    .addCase(signUpThunk.rejected, (state, action: any) => {
      console.log(action);
      state.errorMessage = action.payload;
    })
    .addCase(confirmEmailThunk.fulfilled, (state, action: any) => {
      state.pendingConfirmEmail = false;
      state.confirmedEmail = true;
    })
    .addCase(confirmEmailThunk.rejected, (state, action: any) => {
      console.log(action);
      state.errorMessage = action.payload;
    })
    .addCase(getUserInfoThunk.fulfilled, (state, action: any) => {
      state.userInfo = action.payload;
    })
  },
});

export default userSlice;
export const { logout } = userSlice.actions;



