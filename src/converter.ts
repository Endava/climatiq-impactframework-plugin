import {PluginParams} from './interfaces';
import {
  YourGlobalConfig,
  CPURequestBody,
  MemoryRequestBody,
  StorageRequestBody,
  VMInstanceRequestBody,
  RequestBody,
  Endpoint,
} from './types';

/**  Converts IF input plugin params to Climatiq batch requests */
export const Converter = (config: YourGlobalConfig) => {
  const useEnergySum: boolean = config['use-energy-sum'] ?? false;
  const useCarbonSum: boolean = config['use-carbon-sum'] ?? false;
  const includeCarbonEmissions: boolean =
    config['include-carbon-emissions'] ?? false;
  const includeCarbonIntensity: boolean =
    config['include-carbon-intensity'] ?? false;

  const toRegion = (location: string): string => {
    return location.split('-').join('_');
  };
  /**  Converts IF input plugin params to batch of Climatiq request bodies, based on given endpoint*/
  const toRequestBatch = (
    inputs: PluginParams[],
    endpoint: Endpoint
  ): RequestBody[] => {
    switch (endpoint) {
      case Endpoint.VMInstance:
        return toVMInstanceBatch(inputs);
      case Endpoint.CPU:
        return toCPUBatch(inputs);
      case Endpoint.Memory:
        return toMemoryBatch(inputs);
      case Endpoint.Storage:
        return toStorageBatch(inputs);
    }
    return new Array<RequestBody>();
  };

  const toVMInstanceBatch = (
    inputs: PluginParams[]
  ): VMInstanceRequestBody[] => {
    return inputs.map(toVMInstance);
  };

  /** Converts IF input to VN input request */
  const toVMInstance = (input: PluginParams): VMInstanceRequestBody => {
    return {
      instance: input['cloud/instance-type'],
      region: toRegion(input['location']),
      average_vcpu_utilization: input['cpu/utilization'] / 100,
      year: new Date(input['timestamp']).getUTCFullYear(),
      duration: input['duration'],
      duration_unit: 's',
    };
  };

  /** Converts IF input plugin params to CPU batch request */
  const toCPUBatch = (inputs: PluginParams[]): CPURequestBody[] => {
    return inputs.map(toCPU);
  };

  /** Converts IF input to CPU request */
  const toCPU = (input: PluginParams): CPURequestBody => {
    return {
      region: toRegion(input['location']),
      cpu_count: input['vcpus-allocated'],
      average_vcpu_utilization: input['cpu/utilization'] / 100,
      year: new Date(input['timestamp']).getUTCFullYear(),
      duration: input['duration'],
      duration_unit: 's',
    };
  };

  /** Converts IF input plugin params to Memory batch request */
  const toMemoryBatch = (inputs: PluginParams[]): MemoryRequestBody[] => {
    return inputs.map(toMemory);
  };

  /** Converts IF input to Memory request */
  const toMemory = (input: PluginParams): MemoryRequestBody => {
    return {
      region: toRegion(input['location']),
      data: input['ram-alloc'],
      year: new Date(input['timestamp']).getUTCFullYear(),
      duration: input['duration'],
      duration_unit: 's',
      data_unit: 'GB',
    };
  };

  /** Converts IF input plugin params to Storage batch request */
  const toStorageBatch = (inputs: PluginParams[]): StorageRequestBody[] => {
    return inputs.map(toStorage);
  };

  /** Converts IF input to Storage request */
  const toStorage = (input: PluginParams): StorageRequestBody => {
    return {
      region: toRegion(input['location']),
      data: input['storage/capacity'],
      storage_type: input['storage/type'],
      year: new Date(input['timestamp']).getUTCFullYear(),
      duration: input['duration'],
      duration_unit: 's',
      data_unit: 'GB',
    };
  };

  /** Converts Climatiq batch response from given endpoint to enriched pluginparams */
  const getEnrichedOutputs = (
    inputs: PluginParams[],
    response: any,
    endpoint: Endpoint
  ): PluginParams[] => {
    switch (endpoint) {
      case Endpoint.VMInstance:
        return getVMInstanceOutputs(inputs, response);
      case Endpoint.CPU:
        return getCPUOutputs(inputs, response);
      case Endpoint.Memory:
        return getMemoryOutputs(inputs, response);
      case Endpoint.Storage:
        return getStorageOutputs(inputs, response);
    }
    return inputs;
  };

  /** Returns summed or component parameters for cpu and/or memory energy */
  const getEnergyOutputParams = (
    cpuEnergy?: number,
    memoryEnergy?: number
  ): any => {
    const cpuParam = cpuEnergy ? {'cpu/energy': cpuEnergy} : {};
    const memoryParam = memoryEnergy ? {'memory/energy': memoryEnergy} : {};
    const componentParams = {
      ...cpuParam,
      ...memoryParam,
    };
    cpuEnergy = cpuEnergy ? cpuEnergy : 0;
    memoryEnergy = memoryEnergy ? memoryEnergy : 0;
    return useEnergySum ? {energy: cpuEnergy + memoryEnergy} : componentParams;
  };

  /** Returns summed or component parameters for operational and embodied emissions */
  const getEmissionOutputParams = (
    operatingEmissions: number,
    embodiedEmissions?: number
  ): any => {
    if (!includeCarbonEmissions) return {};

    const operationalParam = {'carbon-operational': operatingEmissions};
    const embodiedParam = embodiedEmissions
      ? {'carbon-embodied': embodiedEmissions}
      : {};

    const componentParams = {
      ...operationalParam,
      ...embodiedParam,
    };
    embodiedEmissions = embodiedEmissions ? embodiedEmissions : 0;

    return useCarbonSum
      ? {carbon: operatingEmissions + embodiedEmissions}
      : componentParams;
  };

  /** Returns carbon intensity parameter for given electical energy */
  const getCarbonIntensityParam = (kgCO2e: number, energyKW: number): any => {
    if (!includeCarbonIntensity) return {};
    return {'carbon-intensity': (kgCO2e / energyKW) * 1000};
  };

  /** Returns enriched output array based on input plugin params and VMInstance batch results */
  const getVMInstanceOutputs = (
    inputs: PluginParams[],
    response: any
  ): PluginParams[] => {
    return inputs.map((input, index) => {
      const result = response.results[index];

      if (result.error) throw new Error(`Climatiq - ${result.message}`);
      const cpuEnergy: number = result.calculation_details.energy_used_cpu;
      const memoryEnergy: number =
        result.calculation_details.energy_used_memory;
      const operatingEmissions =
        result.memory_estimate.co2e + result.cpu_estimate.co2e;
      const embodiedEmissions = result.embodied_cpu_estimate.co2e;

      return {
        ...input,
        ...getEnergyOutputParams(cpuEnergy, memoryEnergy),
        ...getEmissionOutputParams(operatingEmissions, embodiedEmissions),
        ...getCarbonIntensityParam(
          operatingEmissions,
          cpuEnergy + memoryEnergy
        ),
      };
    });
  };

  /** Returns enriched output array based on input plugin params and cpu batch results */
  const getCPUOutputs = (
    inputs: PluginParams[],
    response: any
  ): PluginParams[] => {
    return inputs.map((input, index) => {
      const result = response.results[index];

      if (result.error) throw new Error(`Climatiq - ${result.message}`);
      const cpuEnergy: number = result.activity_data.activity_value;
      const operatingEmissions = result.co2e;

      return {
        ...input,
        ...getEnergyOutputParams(cpuEnergy, undefined),
        ...getEmissionOutputParams(operatingEmissions, undefined),
        ...getCarbonIntensityParam(operatingEmissions, cpuEnergy),
      };
    });
  };

  /** Returns enriched output array based on input plugin params and memory batch results */
  const getMemoryOutputs = (
    inputs: PluginParams[],
    response: any
  ): PluginParams[] => {
    return inputs.map((input, index) => {
      const result = response.results[index];

      if (result.error) throw new Error(`Climatiq - ${result.message}`);
      const memoryEnergy: number = result.activity_data.activity_value;
      const operatingEmissions = result.co2e;

      return {
        ...input,
        ...getEnergyOutputParams(undefined, memoryEnergy),
        ...getEmissionOutputParams(operatingEmissions, undefined),
        ...getCarbonIntensityParam(operatingEmissions, memoryEnergy),
      };
    });
  };

  /** Returns enriched output array based on input plugin params and storage batch results */
  const getStorageOutputs = (
    inputs: PluginParams[],
    response: any
  ): PluginParams[] => {
    return inputs.map((input, index) => {
      const result = response.results[index];

      if (result.error) throw new Error(`Climatiq - ${result.message}`);
      const energy: number = result.activity_data.activity_value;
      const operatingEmissions = result.co2e;

      return {
        ...input,
        energy: energy,
        ...getEmissionOutputParams(operatingEmissions, undefined),
        ...getCarbonIntensityParam(operatingEmissions, energy),
      };
    });
  };

  return {
    toRequestBatch,
    toVMInstance,
    toVMInstanceBatch,
    toCPU,
    toCPUBatch,
    toMemory,
    toMemoryBatch,
    toStorage,
    toStorageBatch,
    getEnrichedOutputs,
  };
};
