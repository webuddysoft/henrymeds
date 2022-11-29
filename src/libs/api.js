import { API_ENDPOINT } from "./config"

const callApi = async (url, data = null, method = 'GET') => {
  const options = {
    method: method,
    headers: {
      "accept": 'application/json', 
      'content-type': 'application/json',
    },
  };

  if (data) {
    options['body'] = JSON.stringify(data);
  }

  const res = await fetch(`${API_ENDPOINT}${url}`, options)
    .then(response => response.json())
    .then(rsp => {
      return {
        status: "success",
        response: rsp
      };
    })
    .catch(err => {
      return {
        status: "error",
        message: err.message
      }
    });

  return res;
}

export const getClients = async () => {
  const response = await callApi('Clients')
  return response;
}
export const getProviders = async () => {
  const response = await callApi('Providers')
  return response;
}