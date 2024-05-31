/* eslint-disable node/no-extraneous-import */
import {z} from 'zod';
/* eslint-disable node/no-extraneous-import */
import {PluginParams} from './interfaces';
import {Endpoint} from './types';
export const Validator = () => {
  /** Validates input params for given endpoint, or attempts to match params if endpoint not specified */
  const validate = (
    inputs: PluginParams[],
    endpoint: Endpoint
  ): ValidatorResult => {
    const result: ValidatorResult = {valid: true, endpoint: endpoint};

    if (isValidVMRequest(inputs, endpoint === Endpoint.VMInstance)) {
      result.endpoint = Endpoint.VMInstance;
    } else if (isValidCPURequest(inputs, endpoint === Endpoint.CPU)) {
      result.endpoint = Endpoint.CPU;
    } else if (isValidStorageRequest(inputs, endpoint === Endpoint.Storage)) {
      result.endpoint = Endpoint.Storage;
    } else if (isValidMemoryRequest(inputs, endpoint === Endpoint.Memory)) {
      result.endpoint = Endpoint.Memory;
    } else {
      result.valid = false;
      result.endpoint = Endpoint.None;
    }
    return result;
  };

  /** Validates each input against required VM instance params */
  const isValidVMRequest = (
    inputs: PluginParams[],
    throwError: boolean
  ): boolean => {
    const schema = z.object({
      timestamp: z.coerce.date(),
      duration: z.number().gt(0),
      location: z.string(),
      'cloud/vendor': z.enum(['azure', 'aws', 'gcp']),
      'cloud/instance-type': z.string().min(3),
      'cpu/utilization': z.number().gte(0).lte(100),
    });

    for (const input of inputs) {
      const result = schema.safeParse(input);
      if (!result.success) {
        if (!throwError) return false;
        throw new Error(
          `Invalid VM Instance request params - ${result.error.message}`
        );
      }
    }

    return true;
  };

  /** Validates each input against required CPU request params */
  const isValidCPURequest = (
    inputs: PluginParams[],
    throwError: boolean
  ): boolean => {
    const schema = z.object({
      timestamp: z.coerce.date(),
      duration: z.number().gt(0),
      location: z.string(),
      'cloud/vendor': z.enum(['azure', 'aws', 'gcp']),
      'vcpus-allocated': z.number().gte(1),
      'cpu/utilization': z.number().gte(0).lte(100),
    });

    for (const input of inputs) {
      const result = schema.safeParse(input);
      if (!result.success) {
        if (!throwError) return false;
        throw new Error(`Invalid CPU request params - ${result.error.message}`);
      }
    }

    return true;
  };

  /** Validates each input against required Memory request params */
  const isValidMemoryRequest = (
    inputs: PluginParams[],
    throwError: boolean
  ): boolean => {
    const schema = z.object({
      timestamp: z.coerce.date(),
      duration: z.number().gt(0),
      location: z.string(),
      'cloud/vendor': z.enum(['azure', 'aws', 'gcp']),
      'ram-alloc': z.number(),
    });

    for (const input of inputs) {
      const result = schema.safeParse(input);
      if (!result.success) {
        if (!throwError) return false;
        throw new Error(
          `Invalid Memory request params - ${result.error.message}`
        );
      }
    }

    return true;
  };

  /** Validates each input against required Storage request params */
  const isValidStorageRequest = (
    inputs: PluginParams[],
    throwError: boolean
  ): boolean => {
    const schema = z.object({
      timestamp: z.coerce.date(),
      duration: z.number().gt(0),
      location: z.string(),
      'cloud/vendor': z.enum(['azure', 'aws', 'gcp']),
      'storage/type': z.enum(['ssd', 'hdd']),
      'storage/capacity': z.number(),
    });

    for (const input of inputs) {
      const result = schema.safeParse(input);
      if (!result.success) {
        if (!throwError) return false;
        throw new Error(
          `Invalid Storage request params - ${result.error.message}`
        );
      }
    }
    return true;
  };

  return {
    validate,
    isValidVMRequest,
    isValidCPURequest,
    isValidMemoryRequest,
    isValidStorageRequest,
  };
};

export type ValidatorResult = {
  valid: boolean;
  endpoint: Endpoint;
};
