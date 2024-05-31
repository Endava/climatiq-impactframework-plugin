import axios from 'axios';
import {
  CPURequestBody,
  MemoryRequestBody,
  StorageRequestBody,
  VMInstanceRequestBody,
  RequestBody,
  Endpoint,
} from './types';

const BASE_URL = 'https://api.climatiq.io/compute/v1/';

export const ClimatiqApi = (climatiqApiKey: string, provider: string) => {
  const apiKey: string = climatiqApiKey;
  const cloudProvider: string = provider;

  /** Returns Climatiq batch response for given endpoint */
  const fetchBatch = async (
    batchPayload: RequestBody[],
    endpoint: Endpoint
  ): Promise<any> => {
    switch (endpoint) {
      case Endpoint.VMInstance:
        return fetchData('instance', batchPayload as VMInstanceRequestBody[]);
      case Endpoint.CPU:
        return fetchData('cpu', batchPayload as CPURequestBody[]);
      case Endpoint.Memory:
        return fetchData('memory', batchPayload as MemoryRequestBody[]);
      case Endpoint.Storage:
        return fetchData('storage', batchPayload as StorageRequestBody[]);
    }
    return null;
  };

  const fetchData = async (
    path: string,
    batchPayload: RequestBody[]
  ): Promise<any> => {
    const response = await axios.post(
      `${BASE_URL}${cloudProvider}/${path}/batch`,
      batchPayload,
      {headers: {Authorization: `Bearer ${apiKey}`}}
    );
    return response.data;
  };

  return {
    fetchBatch,
  };
};
