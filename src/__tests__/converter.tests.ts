/* eslint-disable node/no-extraneous-import */
import {PluginParams} from '../interfaces';
import {Converter} from '../converter';
import {
  CPURequestBody,
  Endpoint,
  MemoryRequestBody,
  RequestBody,
  StorageRequestBody,
  VMInstanceRequestBody,
} from '../types';
import {
  mockVMInstanceParams,
  mockMemoryParams,
  mockCPUParams,
  mockStorageParams,
  mockVMInstanceResponseData,
  mockCPUResponseData,
  mockMemoryResponseData,
  mockStorageResponseData,
  mockConfigUseEnergySum,
  mockConfigUseCarbonSum,
  mockConfigIncludeCarbonEmissions,
  mockConfigIncludeCarbonIntensity,
} from '../__mocks__';

describe('Converter', () => {
  describe('toVMInstance', () => {
    it('converts to a VMInstanceRequestBody instance from a valid input parameter ', () => {
      const input: PluginParams = {
        timestamp: '2022-03-26T14:08:00.000Z',
        duration: 3600,
        location: 'eu-central-1',
        'cloud/vendor': 'aws',
        'cloud/instance-type': 't2.micro',
        'cpu/utilization': 50,
      };

      const reqBody: VMInstanceRequestBody = Converter({}).toVMInstance(input);
      expect(reqBody.duration).toEqual(3600);
      expect(reqBody.year).toEqual(2022);
      expect(reqBody.average_vcpu_utilization).toEqual(0.5);
      expect(reqBody.duration_unit).toEqual('s');
    });
  });

  describe('toCPU', () => {
    it('converts to a CPURequestBody instance from a valid input parameter ', () => {
      const input: PluginParams = {
        timestamp: '2022-03-26T14:08:00.000Z',
        duration: 3600,
        location: 'eu-central-1',
        'cloud/vendor': 'aws',
        'cpu/utilization': 50,
        'vcpus-allocated': 6,
      };

      const reqBody: CPURequestBody = Converter({}).toCPU(input);
      expect(reqBody.duration).toEqual(3600);
      expect(reqBody.year).toEqual(2022);
      expect(reqBody.average_vcpu_utilization).toEqual(0.5);
      expect(reqBody.duration_unit).toEqual('s');
      expect(reqBody.cpu_count).toEqual(6);
    });
  });

  describe('toMemory', () => {
    it('converts to a MemoryRequestBody instance from a valid input parameter ', () => {
      const input: PluginParams = {
        timestamp: '2022-03-26T14:08:00.000Z',
        duration: 3600,
        location: 'eu-central-1',
        'cloud/vendor': 'aws',
        'ram-alloc': 128,
      };

      const reqBody: MemoryRequestBody = Converter({}).toMemory(input);
      expect(reqBody.duration).toEqual(3600);
      expect(reqBody.year).toEqual(2022);
      expect(reqBody.duration_unit).toEqual('s');
      expect(reqBody.data).toEqual(128);
      expect(reqBody.data_unit).toEqual('GB');
    });
  });

  describe('toStorage', () => {
    it('converts to a StorageRequestBody instance from a valid input parameter ', () => {
      const input: PluginParams = {
        timestamp: '2022-03-26T14:08:00.000Z',
        duration: 3600,
        location: 'eu-central-1',
        'cloud/vendor': 'aws',
        'storage/type': 'hdd',
        'storage/capacity': 1000,
      };

      const reqBody: StorageRequestBody = Converter({}).toStorage(input);
      expect(reqBody.duration).toEqual(3600);
      expect(reqBody.year).toEqual(2022);
      expect(reqBody.duration_unit).toEqual('s');
      expect(reqBody.data).toEqual(1000);
      expect(reqBody.data_unit).toEqual('GB');
      expect(reqBody.storage_type).toEqual('hdd');
    });
  });

  describe('toRequestBatch', () => {
    it('converts to a requestbody for vm instance endpoint', () => {
      const inputs: PluginParams[] = [
        mockVMInstanceParams.ValidParam,
        mockVMInstanceParams.ValidParam,
      ];
      const batch: RequestBody[] = Converter({}).toRequestBatch(
        inputs,
        Endpoint.VMInstance
      );
      expect(batch.length).toEqual(2);
      expect(batch[0] as VMInstanceRequestBody).toHaveProperty('instance');
    });

    it('converts to a requestbody for cpu endpoint', () => {
      const inputs: PluginParams[] = [
        mockCPUParams.ValidParam,
        mockCPUParams.ValidParam,
      ];
      const batch: RequestBody[] = Converter({}).toRequestBatch(
        inputs,
        Endpoint.CPU
      );
      expect(batch.length).toEqual(2);
      expect(batch[0] as CPURequestBody).toHaveProperty('cpu_count');
    });

    it('converts to a requestbody for memory endpoint', () => {
      const inputs: PluginParams[] = [
        mockMemoryParams.ValidParam,
        mockMemoryParams.ValidParam,
      ];
      const batch: RequestBody[] = Converter({}).toRequestBatch(
        inputs,
        Endpoint.Memory
      );
      expect(batch.length).toEqual(2);
      expect(batch[0] as MemoryRequestBody).toHaveProperty('data');
    });

    it('converts to a requestbody for storage endpoint', () => {
      const inputs: PluginParams[] = [
        mockStorageParams.ValidParam,
        mockStorageParams.ValidParam,
      ];
      const batch: RequestBody[] = Converter({}).toRequestBatch(
        inputs,
        Endpoint.Storage
      );
      expect(batch.length).toEqual(2);
      expect(batch[0] as StorageRequestBody).toHaveProperty('storage_type');
    });
  });

  describe('getEnrichedOutputs for VMInstance endpoint', () => {
    it('outputs energy sum when config[use-energy-sum] is true', () => {
      const converter = Converter(mockConfigUseEnergySum);
      const inputs: PluginParams[] = [mockVMInstanceParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockVMInstanceResponseData,
        Endpoint.VMInstance
      );
      const outputItem: PluginParams = outputs[0];
      expect(outputItem).toHaveProperty('energy');
      expect(outputItem).not.toHaveProperty('cpu/energy');
      expect(outputItem).not.toHaveProperty('memory/energy');
      expect(outputItem).not.toHaveProperty('carbon');
      expect(outputItem).not.toHaveProperty('carbon-operational');
      expect(outputItem).not.toHaveProperty('carbon-embodied');
      expect(outputItem).not.toHaveProperty('carbon-intensity');
      expect(outputItem['energy']).toBeCloseTo(0.00288, 5);
    });

    it('outputs energy components when config[use-energy-sum] is false', () => {
      const converter = Converter([]);
      const inputs: PluginParams[] = [mockVMInstanceParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockVMInstanceResponseData,
        Endpoint.VMInstance
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('cpu/energy');
      expect(outputItem).toHaveProperty('memory/energy');
      expect(outputItem).not.toHaveProperty('energy');
    });

    it('outputs carbon sum when config[use-carbon-sum] is true', () => {
      const converter = Converter(mockConfigUseCarbonSum);
      const inputs: PluginParams[] = [mockVMInstanceParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockVMInstanceResponseData,
        Endpoint.VMInstance
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('carbon');
    });

    it('outputs carbon components when config[use-carbon-sum] is false and include-carbon-emissions is true', () => {
      const converter = Converter(mockConfigIncludeCarbonEmissions);
      const inputs: PluginParams[] = [mockVMInstanceParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockVMInstanceResponseData,
        Endpoint.VMInstance
      );
      const outputItem = outputs[0];
      expect(outputItem).not.toHaveProperty('carbon');
      expect(outputItem).toHaveProperty('carbon-operational');
      expect(outputItem).toHaveProperty('carbon-embodied');
    });

    it('outputs carbon intensity when config[include-carbon-intensity] is true', () => {
      const converter = Converter(mockConfigIncludeCarbonIntensity);
      const inputs: PluginParams[] = [mockVMInstanceParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockVMInstanceResponseData,
        Endpoint.VMInstance
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('carbon-intensity');
    });
  });

  describe('getEnrichedOutputs for CPU endpoint', () => {
    it('outputs energy sum when config[use-energy-sum] is true', () => {
      const converter = Converter(mockConfigUseEnergySum);
      const inputs: PluginParams[] = [mockCPUParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockCPUResponseData,
        Endpoint.CPU
      );
      const outputItem: PluginParams = outputs[0];
      expect(outputItem).toHaveProperty('energy');
      expect(outputItem).not.toHaveProperty('cpu/energy');
      expect(outputItem).not.toHaveProperty('carbon');
      expect(outputItem).not.toHaveProperty('carbon-operational');
      expect(outputItem).not.toHaveProperty('carbon-embodied');
      expect(outputItem).not.toHaveProperty('carbon-intensity');
    });

    it('outputs energy components when config[use-energy-sum] is false', () => {
      const converter = Converter({});
      const inputs: PluginParams[] = [mockCPUParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockCPUResponseData,
        Endpoint.CPU
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('cpu/energy');
      expect(outputItem).not.toHaveProperty('energy');
    });

    it('outputs carbon sum when config[use-carbon-sum] is true', () => {
      const converter = Converter(mockConfigUseCarbonSum);
      const inputs: PluginParams[] = [mockCPUParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockCPUResponseData,
        Endpoint.CPU
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('carbon');
    });

    it('outputs carbon components when config[use-carbon-sum] is false and include-carbon-emissions is true', () => {
      const converter = Converter(mockConfigIncludeCarbonEmissions);
      const inputs: PluginParams[] = [mockCPUParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockCPUResponseData,
        Endpoint.CPU
      );
      const outputItem = outputs[0];
      expect(outputItem).not.toHaveProperty('carbon');
      expect(outputItem).toHaveProperty('carbon-operational');
    });

    it('outputs carbon intensity when config[include-carbon-intensity] is true', () => {
      const converter = Converter(mockConfigIncludeCarbonIntensity);
      const inputs: PluginParams[] = [mockCPUParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockCPUResponseData,
        Endpoint.CPU
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('carbon-intensity');
    });
  });

  describe('getEnrichedOutputs for Memory endpoint', () => {
    it('outputs energy sum when config[use-energy-sum] is true', () => {
      const converter = Converter(mockConfigUseEnergySum);
      const inputs: PluginParams[] = [mockMemoryParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockMemoryResponseData,
        Endpoint.Memory
      );
      const outputItem: PluginParams = outputs[0];
      expect(outputItem).toHaveProperty('energy');
      expect(outputItem).not.toHaveProperty('memory/energy');
      expect(outputItem).not.toHaveProperty('carbon');
      expect(outputItem).not.toHaveProperty('carbon-operational');
      expect(outputItem).not.toHaveProperty('carbon-embodied');
      expect(outputItem).not.toHaveProperty('carbon-intensity');
    });

    it('outputs energy components when config[use-energy-sum] is false', () => {
      const converter = Converter([]);
      const inputs: PluginParams[] = [mockMemoryParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockMemoryResponseData,
        Endpoint.Memory
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('memory/energy');
      expect(outputItem).not.toHaveProperty('energy');
    });

    it('outputs carbon sum when config[use-carbon-sum] is true', () => {
      const converter = Converter(mockConfigUseCarbonSum);
      const inputs: PluginParams[] = [mockMemoryParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockMemoryResponseData,
        Endpoint.Memory
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('carbon');
    });

    it('outputs carbon components when config[use-carbon-sum] is false and include-carbon-emissions is true', () => {
      const converter = Converter(mockConfigIncludeCarbonEmissions);
      const inputs: PluginParams[] = [mockMemoryParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockMemoryResponseData,
        Endpoint.Memory
      );
      const outputItem = outputs[0];
      expect(outputItem).not.toHaveProperty('carbon');
      expect(outputItem).toHaveProperty('carbon-operational');
    });

    it('outputs carbon intensity when config[include-carbon-intensity] is true', () => {
      const converter = Converter(mockConfigIncludeCarbonIntensity);
      const inputs: PluginParams[] = [mockMemoryParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockMemoryResponseData,
        Endpoint.Memory
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('carbon-intensity');
    });
  });

  describe('getEnrichedOutputs for Storage endpoint', () => {
    it('outputs energy sum when config[use-energy-sum] is true', () => {
      const converter = Converter(mockConfigUseEnergySum);
      const inputs: PluginParams[] = [mockStorageParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockStorageResponseData,
        Endpoint.Storage
      );
      const outputItem: PluginParams = outputs[0];
      expect(outputItem).toHaveProperty('energy');
      expect(outputItem).not.toHaveProperty('carbon');
      expect(outputItem).not.toHaveProperty('carbon-operational');
      expect(outputItem).not.toHaveProperty('carbon-embodied');
      expect(outputItem).not.toHaveProperty('carbon-intensity');
    });

    it('outputs energy sum even when config[use-energy-sum] is false', () => {
      const converter = Converter([]);
      const inputs: PluginParams[] = [mockStorageParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockStorageResponseData,
        Endpoint.Storage
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('energy');
    });

    it('outputs carbon sum when config[use-carbon-sum] is true', () => {
      const converter = Converter(mockConfigUseCarbonSum);
      const inputs: PluginParams[] = [mockStorageParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockStorageResponseData,
        Endpoint.Storage
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('carbon');
    });

    it('outputs carbon components when config[use-carbon-sum] is false and include-carbon-emissions is true', () => {
      const converter = Converter(mockConfigIncludeCarbonEmissions);
      const inputs: PluginParams[] = [mockStorageParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockStorageResponseData,
        Endpoint.Storage
      );
      const outputItem = outputs[0];
      expect(outputItem).not.toHaveProperty('carbon');
      expect(outputItem).toHaveProperty('carbon-operational');
    });

    it('outputs carbon intensity when config[include-carbon-intensity] is true', () => {
      const converter = Converter(mockConfigIncludeCarbonIntensity);
      const inputs: PluginParams[] = [mockStorageParams.ValidParam];
      const outputs = converter.getEnrichedOutputs(
        inputs,
        mockStorageResponseData,
        Endpoint.Storage
      );
      const outputItem = outputs[0];
      expect(outputItem).toHaveProperty('carbon-intensity');
    });
  });
});

// test climatiq output conversion
// test config switches
