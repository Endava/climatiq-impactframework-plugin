/* eslint-disable node/no-extraneous-import */
import {ClimatiqCalculator} from '../index';
import axios from 'axios';
import {
  mockGlobalConfig,
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
    it('returns enriched results from valid vm-instance inputs.', async () => {
      mockedAxios.post.mockResolvedValue({
        data: mockVMInstanceResponseData,
      });
      const climatiq = ClimatiqCalculator(mockGlobalConfig);
      const inputs = [mockVMInstanceParams.ValidParam];
      const result = await climatiq.execute(inputs);
      expect(result.length).toStrictEqual(inputs.length);
      expect(result[0]).toHaveProperty('energy');
      expect(result[0]).toHaveProperty('carbon');
    });

    it('returns enriched results from valid CPU inputs.', async () => {
      mockedAxios.post.mockResolvedValue({
        data: mockCPUResponseData,
      });
      const climatiq = ClimatiqCalculator(mockGlobalConfig);
      const inputs = [mockCPUParams.ValidParam];
      const result = await climatiq.execute(inputs);
      expect(result.length).toStrictEqual(inputs.length);
      expect(result[0]).toHaveProperty('energy');
      expect(result[0]).toHaveProperty('carbon');
    });

    it('returns enriched results from valid memory inputs.', async () => {
      mockedAxios.post.mockResolvedValue({
        data: mockMemoryResponseData,
      });
      const climatiq = ClimatiqCalculator(mockGlobalConfig);
      const inputs = [mockMemoryParams.ValidParam];
      const result = await climatiq.execute(inputs);
      expect(result.length).toStrictEqual(inputs.length);
      expect(result[0]).toHaveProperty('energy');
      expect(result[0]).toHaveProperty('carbon');
    });

    it('returns enriched results from valid storage inputs.', async () => {
      mockedAxios.post.mockResolvedValue({
        data: mockStorageResponseData,
      });
      const climatiq = ClimatiqCalculator(mockGlobalConfig);
      const inputs = [mockStorageParams.ValidParam];
      const result = await climatiq.execute(inputs);
      expect(result.length).toStrictEqual(inputs.length);
      expect(result[0]).toHaveProperty('energy');
      expect(result[0]).toHaveProperty('carbon');
    });

    it('calculates the correct grid carbon intensity for known energy and carbon values.', async () => {
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
