/* eslint-disable node/no-extraneous-import */
import {PluginParams} from '../interfaces';
import {Validator} from '../validator';
import {
  mockVMInstanceParams,
  mockCPUParams,
  mockMemoryParams,
  mockStorageParams,
} from '../__mocks__';

describe('Validator', () => {
  describe('isValidVMRequest', () => {
    it('returns true with a valid set of parameters', () => {
      const params: PluginParams[] = [mockVMInstanceParams.ValidParam];
      const validator = Validator();
      expect(validator.isValidVMRequest(params, true)).toEqual(true);
    });

    it('throws Invalid VM Instance when parameters missing CPU Utilisation and throwError is true', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.MissingCPUUtilisationParam,
      ];
      const validator = Validator();
      expect(() => validator.isValidVMRequest(params, true)).toThrow('Invalid');
    });

    it('returns false when parameters missing CPU Utilisation ', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.MissingCPUUtilisationParam,
      ];
      const validator = Validator();
      expect(validator.isValidVMRequest(params, false)).toEqual(false);
    });

    it('throws Invalid VM Instance when instance type is empty and throwError is true', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.EmptyStringInstanceTypeParam,
      ];
      const validator = Validator();
      expect(() => validator.isValidVMRequest(params, true)).toThrow('Invalid');
    });

    it('returns false when instance type is empty', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.EmptyStringInstanceTypeParam,
      ];
      const validator = Validator();
      expect(validator.isValidVMRequest(params, false)).toEqual(false);
    });

    it('throws Invalid VM Instance when CPU Util > 100 and throwError is true', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.InvalidUBoundCPUUtilisationParam,
      ];
      const validator = Validator();
      expect(() => validator.isValidVMRequest(params, true)).toThrow('Invalid');
    });

    it('returns false when CPU Util > 100', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.InvalidUBoundCPUUtilisationParam,
      ];
      const validator = Validator();
      expect(validator.isValidVMRequest(params, false)).toEqual(false);
    });

    it('throws Invalid VM Instance when CPU Util < 0 and throwError is true', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.InvalidLBoundCPUUtilisationParam,
      ];
      const validator = Validator();
      expect(() => validator.isValidVMRequest(params, true)).toThrow('Invalid');
    });

    it('returns false when CPU Util < 0', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.InvalidLBoundCPUUtilisationParam,
      ];
      const validator = Validator();
      expect(validator.isValidVMRequest(params, false)).toEqual(false);
    });

    it('throws Invalid VM Instance when timestamp is missing and throwError is true', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.MissingTimestampParam,
      ];
      const validator = Validator();
      expect(() => validator.isValidVMRequest(params, true)).toThrow('Invalid');
    });

    it('returns false when timestamp is missing', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.MissingTimestampParam,
      ];
      const validator = Validator();
      expect(validator.isValidVMRequest(params, false)).toEqual(false);
    });

    it('throws Invalid VM Instance when timestamp is invalid and throwError is true', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.InvalidTimestampParam,
      ];
      const validator = Validator();
      expect(() => validator.isValidVMRequest(params, true)).toThrow('Invalid');
    });

    it('returns false when timestamp is invalid', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.InvalidTimestampParam,
      ];
      const validator = Validator();
      expect(validator.isValidVMRequest(params, false)).toEqual(false);
    });

    it('throws Invalid VM Instance when duration is negative and throwError is true', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.NegativeDurationParam,
      ];
      const validator = Validator();
      expect(() => validator.isValidVMRequest(params, true)).toThrow('Invalid');
    });

    it('returns false when duration is negative', () => {
      const params: PluginParams[] = [
        mockVMInstanceParams.NegativeDurationParam,
      ];
      const validator = Validator();
      expect(validator.isValidVMRequest(params, false)).toEqual(false);
    });

    it('throws Invalid VM Instance when vendor is invalid and throwError is true', () => {
      const params: PluginParams[] = [mockVMInstanceParams.InvalidVendorParam];
      const validator = Validator();
      expect(() => validator.isValidVMRequest(params, true)).toThrow('Invalid');
    });

    it('returns false when vendor is invalid', () => {
      const params: PluginParams[] = [mockVMInstanceParams.InvalidVendorParam];
      const validator = Validator();
      expect(validator.isValidVMRequest(params, false)).toEqual(false);
    });
  });

  describe('isValidCPURequest', () => {
    it('returns true with a valid set of parameters', () => {
      const params: PluginParams[] = [mockCPUParams.ValidParam];
      const validator = Validator();
      expect(validator.isValidCPURequest(params, true)).toEqual(true);
    });

    it('throws Invalid CPU Instance when parameters missing CPU Utilisation and throwError is true', () => {
      const params: PluginParams[] = [mockCPUParams.MissingCPUUtilisationParam];
      const validator = Validator();
      expect(() => validator.isValidCPURequest(params, true)).toThrow(
        'Invalid'
      );
    });

    it('returns false when parameters missing CPU Utilisation ', () => {
      const params: PluginParams[] = [mockCPUParams.MissingCPUUtilisationParam];
      const validator = Validator();
      expect(validator.isValidCPURequest(params, false)).toEqual(false);
    });

    it('throws Invalid CPU Instance when parameters missing VCPU alloc and throwError is true', () => {
      const params: PluginParams[] = [mockCPUParams.MissingVCPUAllocParam];
      const validator = Validator();
      expect(() => validator.isValidCPURequest(params, true)).toThrow(
        'Invalid'
      );
    });

    it('returns false when parameters missing VCPU alloc ', () => {
      const params: PluginParams[] = [mockCPUParams.MissingVCPUAllocParam];
      const validator = Validator();
      expect(validator.isValidCPURequest(params, false)).toEqual(false);
    });
  });

  describe('isValidMemoryRequest', () => {
    it('returns true with a valid set of parameters', () => {
      const params: PluginParams[] = [mockMemoryParams.ValidParam];
      const validator = Validator();
      expect(validator.isValidMemoryRequest(params, true)).toEqual(true);
    });

    it('throws Invalid Memory Instance when parameters missing Ram Alloc and throwError is true', () => {
      const params: PluginParams[] = [mockMemoryParams.MissingRAMAllocParam];
      const validator = Validator();
      expect(() => validator.isValidMemoryRequest(params, true)).toThrow(
        'Invalid'
      );
    });

    it('returns false when parameters missing Ram alloc', () => {
      const params: PluginParams[] = [mockMemoryParams.MissingRAMAllocParam];
      const validator = Validator();
      expect(validator.isValidMemoryRequest(params, false)).toEqual(false);
    });
  });

  describe('isValidStorageRequest', () => {
    it('returns true with a valid set of parameters', () => {
      const params: PluginParams[] = [mockStorageParams.ValidParam];
      const validator = Validator();
      expect(validator.isValidStorageRequest(params, true)).toEqual(true);
    });

    it('throws Invalid Storage Instance when capacity param invalid and throwError is true', () => {
      const params: PluginParams[] = [
        mockStorageParams.InvalidStorageCapacityParam,
      ];
      const validator = Validator();
      expect(() => validator.isValidStorageRequest(params, true)).toThrow(
        'Invalid'
      );
    });

    it('returns false when capacity param invalid', () => {
      const params: PluginParams[] = [
        mockStorageParams.InvalidStorageCapacityParam,
      ];
      const validator = Validator();
      expect(validator.isValidStorageRequest(params, false)).toEqual(false);
    });

    it('throws Invalid Storage Instance when storage type param invalid and throwError is true', () => {
      const params: PluginParams[] = [
        mockStorageParams.InvalidStorageTypeParam,
      ];
      const validator = Validator();
      expect(() => validator.isValidStorageRequest(params, true)).toThrow(
        'Invalid'
      );
    });

    it('returns false when storage type param invalid', () => {
      const params: PluginParams[] = [
        mockStorageParams.InvalidStorageTypeParam,
      ];
      const validator = Validator();
      expect(validator.isValidStorageRequest(params, false)).toEqual(false);
    });

    it('throws Invalid Storage Instance when missing storage capacity param and throwError is true', () => {
      const params: PluginParams[] = [
        mockStorageParams.MissingStorageCapacityParam,
      ];
      const validator = Validator();
      expect(() => validator.isValidStorageRequest(params, true)).toThrow(
        'Invalid'
      );
    });

    it('returns false wwhen missing storage capacity param', () => {
      const params: PluginParams[] = [
        mockStorageParams.MissingStorageCapacityParam,
      ];
      const validator = Validator();
      expect(validator.isValidStorageRequest(params, false)).toEqual(false);
    });
  });
});
