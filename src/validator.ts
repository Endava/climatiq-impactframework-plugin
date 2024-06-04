/* eslint-disable node/no-extraneous-import */
import {z, ZodIssue} from 'zod';
/* eslint-disable node/no-extraneous-import */
import {PluginParams} from './interfaces';
import {Endpoint} from './types';
export const Validator = () => {
  // error messages
  const ERROR_DURATION_REQUIRED = 'Duration parameter is required';
  const ERROR_LOCATION_REQUIRED = 'Location parameter is required';
  const ERROR_INSTANCETYPE_REQUIRED =
    'Cloud Instance-type (SKU) parameter is required';
  const ERROR_DURATION_GTZERO = 'Duration parameter must be greater than zero';
  const ERROR_CPU_REQUIRED = 'CPU Utilisation parameter is required';
  const ERROR_CPU_RANGE =
    'CPU utilization must be a percentage between 0 and 100';
  const ERROR_CLOUDVENDOR_INVALID =
    'Cloud vendor should be one of aws, azure or gcp';
  const ERROR_VCPUS_REQUIRED = 'VCPUs allocated parameter is required';
  const ERROR_VCPUS_GTZERO =
    'VCPUs allocated parameter should be greater than equal to one';
  const ERROR_STORAGETYPE_INVALID =
    'Storage type parameter should be either ssd or hdd';
  const ERROR_STORAGECAPACITY_REQUIRED =
    'Storage capacity parameter is required, and should be a number';
  const ERROR_RAMALLOC_REQUIRED =
    'RAM Allocation parameter is required, and should be a number';

  const getZodErrorMessages = (error: z.ZodError): String => {
    const messages = error.issues.map((issue: ZodIssue) => {
      return issue.message;
    });
    return `\n${messages.join('\n')}`;
  };

  const durationParamValidation = z
    .number({message: ERROR_DURATION_REQUIRED})
    .gt(0, {message: ERROR_DURATION_GTZERO});

  const cpuUtilisationParamValidation = z
    .number({message: ERROR_CPU_REQUIRED})
    .gte(0, {message: ERROR_CPU_RANGE})
    .lte(100, {message: ERROR_CPU_RANGE});

  const vendorParamValidation = z.enum(['azure', 'aws', 'gcp'], {
    message: ERROR_CLOUDVENDOR_INVALID,
  });

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
      duration: durationParamValidation,
      location: z.string({message: ERROR_LOCATION_REQUIRED}),
      'cloud/vendor': vendorParamValidation,
      'cloud/instance-type': z.string({message: ERROR_INSTANCETYPE_REQUIRED}),
      'cpu/utilization': cpuUtilisationParamValidation,
    });

    for (const input of inputs) {
      const result = schema.safeParse(input);
      if (!result.success) {
        if (!throwError) return false;
        throw new Error(
          `Invalid VM Instance request params - ${getZodErrorMessages(
            result.error
          )}`
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
      duration: durationParamValidation,
      location: z.string({message: ERROR_LOCATION_REQUIRED}),
      'cloud/vendor': vendorParamValidation,
      'vcpus-allocated': z
        .number({message: ERROR_VCPUS_REQUIRED})
        .gte(1, {message: ERROR_VCPUS_GTZERO}),
      'cpu/utilization': cpuUtilisationParamValidation,
    });

    for (const input of inputs) {
      const result = schema.safeParse(input);
      if (!result.success) {
        if (!throwError) return false;
        throw new Error(
          `Invalid CPU request params - ${getZodErrorMessages(result.error)}`
        );
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
      duration: durationParamValidation,
      location: z.string({message: ERROR_LOCATION_REQUIRED}),
      'cloud/vendor': vendorParamValidation,
      'ram-alloc': z.number({message: ERROR_RAMALLOC_REQUIRED}),
    });

    for (const input of inputs) {
      const result = schema.safeParse(input);
      if (!result.success) {
        if (!throwError) return false;
        throw new Error(
          `Invalid Memory request params - ${getZodErrorMessages(result.error)}`
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
      duration: durationParamValidation,
      location: z.string({message: ERROR_LOCATION_REQUIRED}),
      'cloud/vendor': vendorParamValidation,
      'storage/type': z.enum(['ssd', 'hdd'], {
        message: ERROR_STORAGETYPE_INVALID,
      }),
      'storage/capacity': z.number({message: ERROR_STORAGECAPACITY_REQUIRED}),
    });

    for (const input of inputs) {
      const result = schema.safeParse(input);
      if (!result.success) {
        if (!throwError) return false;
        throw new Error(
          `Invalid Storage request params - ${getZodErrorMessages(
            result.error
          )}`
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
