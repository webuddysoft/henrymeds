import moment from "moment";
import { API_ENDPOINT, DATE_FORMAT } from "./config"

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

export const getProviderSlots = async (providerId) => {
  const response = await callApi(`Slots?providerId=[${providerId}]`)
  return response;
}

export const addProviderSlot = async (providerId, date, hour, minute) => {
  const data = {
    'providerId': `[${providerId}]`,
    'date': moment(date, DATE_FORMAT).unix(),
    'hour': hour,
    'minute': minute
  }
  const response = await callApi(`Slots`, data, "POST");
  return response;
}

export const cancelProviderSlot = async(slotId) => {
  const response = await callApi(`Slots/${slotId}`, null, "DELETE");
  return response;
}

export const getSlots = async (date) => {
  const response = await callApi(`Slots?sortBy=date&order=desc&date=${moment(date, DATE_FORMAT).unix()}`)
  return response;
}

export const addReservation = async (clientId, slotId, date, hour, minute) => {
  const data = {
    'clientId': `[${clientId}]`,
    'slotId': `[${slotId}]`,
    'date': moment(date, DATE_FORMAT).unix(),
    'createdDate': moment().unix(),
    'hour': hour,
    'minute': minute,
    'confirmed': false
  }
  const response = await callApi(`Reservations`, data, "POST");
  return response;
}

export const confirmReservation = async (reservationId) => {
  const data = {
    'confirmed': true
  }
  const response = await callApi(`Reservations/${reservationId}`, data, "PUT");
  return response;
}

export const cancelReservation = async (reservationId) => {
  const response = await callApi(`Reservations/${reservationId}`, null, "DELETE");
  return response;
}

export const getClientReservations = async (clientId) => {
  const response = await callApi(`Reservations?clientId=[${clientId}]`)
  return response;
}

export const getAllReservations = async () => {
  const response = await callApi(`Reservations`)
  return response;
}