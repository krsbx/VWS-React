import { URL, createAuthorizations, timestamp } from './VWS_Handler';
import https from 'https';

const HttpRequest = (httpsOptions, body, callback) => {
  const request = https.request(httpsOptions, (response) => {
    let data = '';

    response.setEncoding('utf8');

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        let result = JSON.parse(data);
        if (response.statusCode === 200 || response.statusCode === 201) {
          callback(null, result);

        } else {
            const error = new Error(result.result_code);
            callback(error, result);
        }
      } catch (error) {
        callback(error,  {});
      }
    });
  });

  request.on('error', (error) => {
    callback(error);
  });

  request.write(body);

  request.end();
}

const VWSRequest = (request, callback) => {
  request.accessKey = process.env.REACT_APP_ACCESS_KEY;
  request.secretKey = process.env.REACT_APP_SECRET_KEY;
  request.timestamp = timestamp();

  var httpsOptions = {

    hostname: URL,
    path: request.path,
    method: request.method,
    headers: {

        'Content-Length': Buffer.byteLength(request.body),
        'Content-Type': request.contentTypeHeader || request.type,
        'Authorization': createAuthorizations(request),
        'Date': request.timestamp
    }
  };

  HttpRequest(httpsOptions, request.body, callback);
}

export const addTarget = (target, callback) => {
  const request = {
    'path': '/targets',
    'method': 'POST',
    'type': 'application/json',
    'body': target
  }

  VWSRequest(request, callback);
}

export const updateTarget = (targetId, target, callback) => {
  const request = {
    'path': '/targets/' + targetId,
    'method': 'PUT',
    'type': 'application/json',
    'body': target
  };

  VWSRequest(request, callback);
}

export const deleteTarget = (targetId, callback) => {
  const request = {

      'path': '/targets/' + targetId,
      'method': 'DELETE',
      'type': 'application/json',
      'body': ''
  };

  VWSRequest(request, callback);
};