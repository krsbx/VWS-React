import { URL, createAuthorizations, timestamp } from './VWSHandler';
import axios from 'axios';

const HttpRequest = async (httpsOptions, body, callback) => {

  delete axios.defaults.headers.common['User-Agent'];

  const instance = axios.create({
    baseURL: httpsOptions.url,
    headers: httpsOptions.headers,
    responseType: 'json',
  });
  
  const request = await instance({
    method: httpsOptions.method,
    data: body,
  }).catch(error => {
    console.log(error);
  });

  callback(request);
}

const VWSRequest = (request, callback) => {
  request.accessKey = process.env.REACT_APP_ACCESS_KEY;
  request.secretKey = process.env.REACT_APP_SECRET_KEY;
  request.timestamp = timestamp();

  var httpsOptions = {

    url: URL+request.path,
    method: request.method,
    headers: {
        'Content-Type': request.type,
        'Authorization': createAuthorizations(request),
    }
  };

  HttpRequest(httpsOptions, request.body, callback);
}

export const addTarget = (target, callback) => {
  const request = {
    'path': '',
    'method': 'post',
    'type': 'application/json',
    'body': target
  }

  VWSRequest(request, callback);
}

export const updateTarget = (targetId, target, callback) => {
  const request = {
    'path': targetId,
    'method': 'put',
    'type': 'application/json',
    'body': target
  };

  VWSRequest(request, callback);
}

export const deleteTarget = (targetId, callback) => {
  const request = {

      'path': targetId,
      'method': 'delete',
      'type': 'application/json',
      'body': ''
  };

  VWSRequest(request, callback);
};