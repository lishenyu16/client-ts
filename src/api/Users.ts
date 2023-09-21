import axios from '../utils/axios';

const prefix = 'api/auth';

export const signIn = (email: string, password: string) => {
  return axios().post(`${prefix}/signin`, { email, password });
}

export const signUp = (email: string, password: string, username: string) => {
  return axios().post(`${prefix}/signUp`, { email, password, username });
}

export const confirmEmail = (verificationCode: string, userId: number) => {
  return axios().post(`${prefix}/confirmEmail`, { verificationCode, userId });
}

export const fetchUserInfoFromToken = (token: string) => {
  return axios().get(`${prefix}/userInfo/${token}`);
}

export const saveVisitorInfo = (ip: string) => {
  return axios().post(`${prefix}/saveVisitorInfo`, { ip });
}