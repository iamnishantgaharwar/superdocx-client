import axios, { AxiosInstance } from 'axios';

let apiClient: AxiosInstance;

export interface ApiClientConfig {
  baseURL: string;
  apiKey: string;
}

export const createApiClient = ({ baseURL, apiKey }: ApiClientConfig) => {
  apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
  });
};

export const getApiClient = () => {
  if (!apiClient) {
    throw new Error('API client not initialized. Call `createApiClient` with baseURL and apiKey first.');
  }
  return apiClient;
};