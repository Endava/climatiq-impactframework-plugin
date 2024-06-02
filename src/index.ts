/* eslint-disable node/no-extraneous-import */
import {PluginInterface, PluginParams} from './interfaces';
import {YourGlobalConfig, Endpoint, RequestBody} from './types';
import {ClimatiqApi} from './climatiq-api';
import {Converter} from './converter';
import {Validator, ValidatorResult} from './validator';
/* eslint-disable node/no-unpublished-import */
import * as dotenv from 'dotenv';

export const ClimatiqCalculator = (
  globalConfig: YourGlobalConfig
): PluginInterface => {
  let endpoint: Endpoint = Endpoint.None;

  const metadata = {
    kind: 'execute',
  };

  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    dotenv.config();
    if (!process.env.CLIMATIQ_API_KEY) {
      throw new Error('Climatiq API key missing from env variables');
    }

    switch (globalConfig['endpoint']) {
      case 'vm-instance':
        endpoint = Endpoint.VMInstance;
        break;
      case 'cpu':
        endpoint = Endpoint.CPU;
        break;
      case 'memory':
        endpoint = Endpoint.Memory;
        break;
      case 'storage':
        endpoint = Endpoint.Storage;
        break;
    }

    let outputs: PluginParams[] = inputs;
    const validationResult: ValidatorResult = Validator().validate(
      inputs,
      endpoint
    );
    endpoint = validationResult.endpoint;
    console.log(`Using Climatiq ${Endpoint[endpoint]} endpoint`);
    console.log(
      `Input param validation ${
        validationResult.valid ? 'succeeded' : 'failed'
      }`
    );

    if (inputs.length > 0 && validationResult.valid) {
      console.log('Converting inputs');
      const converter = Converter(globalConfig);
      const requestBatch: RequestBody[] = converter.toRequestBatch(
        inputs,
        endpoint
      );
      console.log('Calling Climatiq API');
      const climatiqApi = ClimatiqApi(
        String(process.env.CLIMATIQ_API_KEY),
        String(inputs[0]['cloud/vendor'])
      );
      const response = await climatiqApi.fetchBatch(requestBatch, endpoint);
      console.log('Enriching outputs');
      outputs = converter.getEnrichedOutputs(inputs, response, endpoint);
    }
    return Promise.all(outputs);
  };

  return {
    metadata,
    execute,
  };
};
