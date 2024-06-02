/* eslint-disable node/no-extraneous-import */
import {ClimatiqCalculator} from '../index';
import axios from 'axios';
import {
  mockGlobalConfig,
  mockGlobalConfigForVMInstance,
  mockGlobalConfigForCPU,
  mockGlobalConfigForMemory,
  mockGlobalConfigForStorage,
  mockVMInstanceParams,
  mockVMInstanceResponseData,
  mockCPUParams,
  mockCPUResponseData,
  mockMemoryParams,
  mockMemoryResponseData,
  mockStorageParams,
  mockStorageResponseData,
  mockStorageResponseData_WithHardwiredEnergyAndCarbon,
} from '../__mocks__';
/* eslint-disable node/no-extraneous-import */

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ClimatiqCalculator', () => {
  describe('constructor', () => {
    it('successfully initalized', () => {
      const climatiq = ClimatiqCalculator(mockGlobalConfig);
      expect(climatiq).toHaveProperty('metadata');
      expect(climatiq).toHaveProperty('execute');
    });
  });

  describe('execute', () => {
    it('throws an error when climatiq API key is missing from env vars.', async () => {
      delete process.env.CLIMATIQ_API_KEY;
      const climatiq = ClimatiqCalculator(mockGlobalConfig);
      const inputs = [mockVMInstanceParams.ValidParam];
      try {
        await climatiq.execute(inputs);
      } catch (error) {
        expect(error.message).toContain('Climatiq API');
      }
    });

    it('returns enriched results from valid vm-instance inputs with no endpoint.', async () => {
      process.env.CLIMATIQ_API_KEY = 'xxx';
      mockedAxios.post.mockResolvedValue({
        data: mockVMInstanceResponseData,
      });
      const climatiq = ClimatiqCalculator(mockGlobalConfig);
      expect(climatiq.metadata.kind).toEqual('execute');
      const inputs = [mockVMInstanceParams.ValidParam];
      const result = await climatiq.execute(inputs);
      expect(result.length).toStrictEqual(inputs.length);
      expect(result[0]).toHaveProperty('energy');
      expect(result[0]).toHaveProperty('carbon');
    });

    it('returns enriched results from valid vm-instance inputs.', async () => {
      process.env.CLIMATIQ_API_KEY = 'xxx';
      mockedAxios.post.mockResolvedValue({
        data: mockVMInstanceResponseData,
      });
      const climatiq = ClimatiqCalculator(mockGlobalConfigForVMInstance);
      const inputs = [mockVMInstanceParams.ValidParam];
      const result = await climatiq.execute(inputs);
      expect(result.length).toStrictEqual(inputs.length);
      expect(result[0]).toHaveProperty('energy');
      expect(result[0]).toHaveProperty('carbon');
    });

    it('returns enriched results from valid CPU inputs.', async () => {
      process.env.CLIMATIQ_API_KEY = 'xxx';
      mockedAxios.post.mockResolvedValue({
        data: mockCPUResponseData,
      });
      const climatiq = ClimatiqCalculator(mockGlobalConfigForCPU);
      const inputs = [mockCPUParams.ValidParam];
      const result = await climatiq.execute(inputs);
      expect(result.length).toStrictEqual(inputs.length);
      expect(result[0]).toHaveProperty('energy');
      expect(result[0]).toHaveProperty('carbon');
    });

    it('returns enriched results from valid memory inputs.', async () => {
      process.env.CLIMATIQ_API_KEY = 'xxx';
      mockedAxios.post.mockResolvedValue({
        data: mockMemoryResponseData,
      });
      const climatiq = ClimatiqCalculator(mockGlobalConfigForMemory);
      const inputs = [mockMemoryParams.ValidParam];
      const result = await climatiq.execute(inputs);
      expect(result.length).toStrictEqual(inputs.length);
      expect(result[0]).toHaveProperty('energy');
      expect(result[0]).toHaveProperty('carbon');
    });

    it('returns enriched results from valid storage inputs.', async () => {
      process.env.CLIMATIQ_API_KEY = 'xxx';
      mockedAxios.post.mockResolvedValue({
        data: mockStorageResponseData,
      });
      const climatiq = ClimatiqCalculator(mockGlobalConfigForStorage);
      const inputs = [mockStorageParams.ValidParam];
      const result = await climatiq.execute(inputs);
      expect(result.length).toStrictEqual(inputs.length);
      expect(result[0]).toHaveProperty('energy');
      expect(result[0]).toHaveProperty('carbon');
    });

    it('calculates the correct grid carbon intensity for known energy and carbon values.', async () => {
      process.env.CLIMATIQ_API_KEY = 'xxx';
      mockedAxios.post.mockResolvedValue({
        data: mockStorageResponseData_WithHardwiredEnergyAndCarbon,
      });
      const climatiq = ClimatiqCalculator(mockGlobalConfig);
      const inputs = [mockStorageParams.ValidParam30Mins];
      const result = await climatiq.execute(inputs);
      expect(result.length).toStrictEqual(inputs.length);
      expect(result[0]['carbon-intensity']).toEqual(500);
    });
  });
});
