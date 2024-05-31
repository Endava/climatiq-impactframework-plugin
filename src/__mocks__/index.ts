import {PluginParams} from '../interfaces';

export const mockGlobalConfig = {
  'use-energy-sum': true,
  'use-carbon-sum': true,
  'include-carbon-emissions': true,
  'include-carbon-intensity': true,
};

export const mockGlobalConfigForVMInstance = {
  endpoint: 'vm-instance',
  'use-energy-sum': true,
  'use-carbon-sum': true,
  'include-carbon-emissions': true,
  'include-carbon-intensity': true,
};

export const mockGlobalConfigForCPU = {
  endpoint: 'cpu',
  'use-energy-sum': true,
  'use-carbon-sum': true,
  'include-carbon-emissions': true,
  'include-carbon-intensity': true,
};

export const mockGlobalConfigForMemory = {
  endpoint: 'memory',
  'use-energy-sum': true,
  'use-carbon-sum': true,
  'include-carbon-emissions': true,
  'include-carbon-intensity': true,
};

export const mockGlobalConfigForStorage = {
  endpoint: 'storage',
  'use-energy-sum': true,
  'use-carbon-sum': true,
  'include-carbon-emissions': true,
  'include-carbon-intensity': true,
};

export const mockConfigUseEnergySum = {
  'use-energy-sum': true,
};

export const mockConfigUseCarbonSum = {
  'use-carbon-sum': true,
  'include-carbon-emissions': true,
};

export const mockConfigIncludeCarbonEmissions = {
  'include-carbon-emissions': true,
};

export const mockConfigIncludeCarbonIntensity = {
  'include-carbon-intensity': true,
};

export const mockInputs = [
  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: '3600',
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ec2',
    'cloud/instance-type': 't2.micro',
    'memory/utilization': 0.9272994995117188,
    'cpu/utilization': 69.147,
  },
  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: '3600',
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ec2',
    'cloud/instance-type': 't2.micro',
    'memory/utilization': 0.9272994995117188,
    'cpu/utilization': 0.7249047606754452,
  },
  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: '3600',
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ec2',
    'cloud/instance-type': 't2.micro',
    'memory/utilization': 0.9272994995117188,
    'cpu/utilization': 0.6806377495925492,
  },

  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: '3600',
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'ssd',
    'storage/capacity': 8,
  },

  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: '3600',
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'hdd',
    'storage/capacity': 125,
  },

  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: '3600',
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'ssd',
    'storage/capacity': 8,
  },

  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: '3600',
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'hdd',
    'storage/capacity': 125,
  },

  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: '3600',
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'hdd',
    'storage/capacity': 125,
  },

  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: '3600',
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'ssd',
    'storage/capacity': 8,
  },
];

export const mockOutputs = [
  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: 3600,
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'ssd',
    'storage/capacity': 8,
    energy: 0.0000109,
    carbon: 0.000004224,
    'carbon-intensity': 387.52293577981646,
  },
  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: 3600,
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'hdd',
    'storage/capacity': 125,
    energy: 0.00009222,
    carbon: 0.00003575,
    'carbon-intensity': 387.65994361309913,
  },
  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: 3600,
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'ssd',
    'storage/capacity': 8,
    energy: 0.0000109,
    carbon: 0.000004224,
    'carbon-intensity': 387.52293577981646,
  },
  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: 3600,
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'hdd',
    'storage/capacity': 125,
    energy: 0.00009222,
    carbon: 0.00003575,
    'carbon-intensity': 387.65994361309913,
  },
  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: 3600,
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'hdd',
    'storage/capacity': 125,
    energy: 0.00009222,
    carbon: 0.00003575,
    'carbon-intensity': 387.65994361309913,
  },
  {
    timestamp: '2024-03-26T14:08:00.000Z',
    duration: 3600,
    location: 'eu-central-1',
    geolocation: '50.1213155,8.471759',
    'cloud/vendor': 'aws',
    'cloud/service': 'ebs',
    'storage/type': 'ssd',
    'storage/capacity': 8,
    energy: 0.0000109,
    carbon: 0.000004224,
    'carbon-intensity': 387.52293577981646,
  },
];

const VMInstance_ValidParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'cloud/instance-type': 't2.micro',
  'cpu/utilization': 50,
};

const VMInstance_MissingCPUUtilisationParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'cloud/instance-type': 't2.micro',
};

const VMInstance_MissingTimestampParam: PluginParams = {
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'cloud/instance-type': 't2.micro',
  'cpu/utilization': 69.147,
};

const VMInstance_InvalidTimestampParam: PluginParams = {
  timestamp: 'abc-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'cloud/instance-type': 't2.micro',
  'cpu/utilization': 69.147,
};

const VMInstance_NegativeDurationParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: -1,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'cloud/instance-type': 't2.micro',
  'cpu/utilization': 69.147,
};

const VMInstance_InvalidVendorParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'xxx',
  'cloud/instance-type': 't2.micro',
  'cpu/utilization': 69.147,
};

const VMInstance_EmptyStringInstanceTypeParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'cloud/instance-type': '',
  'cpu/utilization': -1,
};

const VMInstance_InvalidUBoundCPUUtilisationParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'cloud/instance-type': 't2.micro',
  'cpu/utilization': 101,
};

const VMInstance_InvalidLBoundCPUUtilisationParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'cloud/instance-type': 't2.micro',
  'cpu/utilization': -1,
};

export const mockVMInstanceParams = {
  ValidParam: VMInstance_ValidParam,
  MissingCPUUtilisationParam: VMInstance_MissingCPUUtilisationParam,
  MissingTimestampParam: VMInstance_MissingTimestampParam,
  InvalidTimestampParam: VMInstance_InvalidTimestampParam,
  NegativeDurationParam: VMInstance_NegativeDurationParam,
  InvalidVendorParam: VMInstance_InvalidVendorParam,
  EmptyStringInstanceTypeParam: VMInstance_EmptyStringInstanceTypeParam,
  InvalidUBoundCPUUtilisationParam: VMInstance_InvalidUBoundCPUUtilisationParam,
  InvalidLBoundCPUUtilisationParam: VMInstance_InvalidLBoundCPUUtilisationParam,
};

const CPU_ValidParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'cpu/utilization': 50,
  'vcpus-allocated': 4,
};

const CPU_MissingCPUUtilisationParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'vcpus-allocated': 4,
};

const CPU_MissingVCPUAllocParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'cpu/utilization': 50,
};

export const mockCPUParams = {
  ValidParam: CPU_ValidParam,
  MissingCPUUtilisationParam: CPU_MissingCPUUtilisationParam,
  MissingVCPUAllocParam: CPU_MissingVCPUAllocParam,
};

const Memory_ValidParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'ram-alloc': 64,
};

const Memory_MissingRAMAllocParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
};

export const mockMemoryParams = {
  ValidParam: Memory_ValidParam,
  MissingRAMAllocParam: Memory_MissingRAMAllocParam,
};

const Storage_ValidParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'storage/type': 'hdd',
  'storage/capacity': 1000,
};

const Storage_ValidParam_30MinsDuration: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 1800,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'storage/type': 'hdd',
  'storage/capacity': 1000,
};

const Storage_InvalidStorageTypeParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'storage/type': 'xxx',
  'storage/capacity': 1000,
};

const Storage_MissingStorageCapacityParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'storage/type': 'ssd',
};

const Storage_InvalidStorageCapacityParam: PluginParams = {
  timestamp: '2024-03-26T14:08:00.000Z',
  duration: 3600,
  location: 'eu-central-1',
  'cloud/vendor': 'aws',
  'storage/type': 'ssd',
  'storage/capacity': 'abc',
};

export const mockStorageParams = {
  ValidParam: Storage_ValidParam,
  ValidParam30Mins: Storage_ValidParam_30MinsDuration,
  InvalidStorageTypeParam: Storage_InvalidStorageTypeParam,
  MissingStorageCapacityParam: Storage_MissingStorageCapacityParam,
  InvalidStorageCapacityParam: Storage_InvalidStorageCapacityParam,
};

export const mockVMInstanceResponseData: any = {
  results: [
    {
      total_co2e: 0.002007,
      total_co2e_unit: 'kg',
      memory_estimate: {
        co2e: 0.0001852,
        co2e_unit: 'kg',
        co2e_calculation_method: 'ar4',
        co2e_calculation_origin: 'source',
        emission_factor: null,
        constituent_gases: null,
        activity_data: {
          activity_value: 0.0004777,
          activity_unit: 'kWh',
        },
        audit_trail: 'disabled',
      },
      cpu_estimate: {
        co2e: 0.0009327,
        co2e_unit: 'kg',
        co2e_calculation_method: 'ar4',
        co2e_calculation_origin: 'source',
        emission_factor: null,
        constituent_gases: null,
        activity_data: {
          activity_value: 0.002406,
          activity_unit: 'kWh',
        },
        audit_trail: 'disabled',
      },
      embodied_cpu_estimate: {
        co2e: 0.0008894,
        co2e_unit: 'kg',
        co2e_calculation_method: 'ar4',
        co2e_calculation_origin: 'source',
        emission_factor: null,
        constituent_gases: null,
        activity_data: {
          activity_value: 1.0,
          activity_unit: 'instance-hour',
        },
        audit_trail: 'disabled',
      },
      calculation_details: {
        instance: 't2.micro',
        instance_memory: 1.073741824,
        memory_unit: 'GB',
        vcpu_cores: 1,
        average_vcpu_utilization: 0.5,
        power_usage_effectiveness: 1.135,
        energy_used_cpu: 0.0024062000000000003,
        energy_used_memory: 0.00047772921233408,
        energy_unit: 'kWh',
      },
    },
  ],
};

export const mockCPUResponseData: any = {
  results: [
    {
      co2e: 0.001865,
      co2e_unit: 'kg',
      co2e_calculation_method: 'ar4',
      co2e_calculation_origin: 'source',
      emission_factor: null,
      constituent_gases: null,
      activity_data: {
        activity_value: 0.004812,
        activity_unit: 'kWh',
      },
      audit_trail: 'disabled',
      source_trail: [
        {
          data_category: 'emission_factor',
          name: 'Electricity supplied from grid - production mix',
          source: 'AIB',
          source_dataset: 'European Residual Mix',
          year: '2022',
          region: 'DE',
          region_name: 'Germany',
        },
      ],
    },
  ],
};

export const mockMemoryResponseData: any = {
  results: [
    {
      co2e: 0.00138,
      co2e_unit: 'kg',
      co2e_calculation_method: 'ar4',
      co2e_calculation_origin: 'source',
      emission_factor: null,
      constituent_gases: null,
      activity_data: {
        activity_value: 0.003559,
        activity_unit: 'kWh',
      },
      audit_trail: 'disabled',
      source_trail: [
        {
          data_category: 'emission_factor',
          name: 'Electricity supplied from grid - production mix',
          source: 'AIB',
          source_dataset: 'European Residual Mix',
          year: '2022',
          region: 'DE',
          region_name: 'Germany',
        },
      ],
    },
  ],
};

export const mockStorageResponseData: any = {
  results: [
    {
      co2e: 0.00005901,
      co2e_unit: 'kg',
      co2e_calculation_method: 'ar4',
      co2e_calculation_origin: 'source',
      emission_factor: null,
      constituent_gases: null,
      activity_data: {
        activity_value: 0.0000681,
        activity_unit: 'kWh',
      },
      audit_trail: 'disabled',
      source_trail: [
        {
          data_category: 'emission_factor',
          name: 'Electricity supplied from grid',
          source: 'CT',
          source_dataset: 'Climate Transparency Report',
          year: '2021',
          region: 'ZA',
          region_name: 'South Africa',
        },
      ],
    },
  ],
};

export const mockStorageResponseData_WithHardwiredEnergyAndCarbon: any = {
  results: [
    {
      co2e: 0.5,
      co2e_unit: 'kg',
      activity_data: {
        activity_value: 1,
        activity_unit: 'kWh',
      },
    },
  ],
};
