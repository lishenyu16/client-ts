import axios from 'axios';
import Cookies from 'js-cookie';

const isProduction = process.env.NODE_ENV === 'production';
let baseUrl = isProduction ? '' : 'http://localhost:3003';
axios.defaults.baseURL = baseUrl;

export default (config: {useBlob?: boolean} = {}) => {
  const client =
    config && config.useBlob ?
      axios.create({
        timeout: 10000,
        //baseUrl,
        responseType: 'blob',
        withCredentials: isProduction,
      }) :
      axios.create({
        timeout: 30000,
        //baseUrl,
        withCredentials: isProduction,
      });
  const onRequestSuccess = (req: any) => {
    if (req) {
      const userInfo = Cookies.get('userInfo');
      if (userInfo) {
        const { token } = JSON.parse(userInfo);
        if (token) {
          req.headers.Authorization = 'Bear ' + token;
        }
      }
      return req;
    }
  }
  function errorResHandler(err: any) {
    // if (err.response && err.response.status === 401) {
    //   toast.error('Not Authorized');
    // }
    if (err.response) {
      return Promise.reject(err.response);
    }
    throw err;
  }

  client.interceptors.request.use(onRequestSuccess);
  client.interceptors.response.use(res => res, errorResHandler);
  return client;
}

//example usage: axios().post('/balaba', {payload});