export type YourGlobalConfig = Record<string, any>;

export enum Endpoint {
  None,
  VMInstance,
  CPU,
  Memory,
  Storage,
}

export type RequestBody =
  | VMInstanceRequestBody
  | CPURequestBody
  | MemoryRequestBody
  | StorageRequestBody;

export type VMInstanceRequestBody = {
  instance: string;
  region: string;
  year: number;
  duration: number;
  average_vcpu_utilization: number;
  duration_unit: string;
};

export type CPURequestBody = {
  region: string;
  year: number;
  duration: number;
  cpu_count: number;
  average_vcpu_utilization: number;
  duration_unit: string;
};

export type MemoryRequestBody = {
  region: string;
  year: number;
  duration: number;
  data: number;
  duration_unit: string;
  data_unit: string;
};

export type StorageRequestBody = {
  region: string;
  year: number;
  duration: number;
  storage_type: string;
  data: number;
  duration_unit: string;
  data_unit: string;
};
