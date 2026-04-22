import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  globals: {
      extensionsToTreatAsEsm: ['.ts', '.js']
  },
  preset: 'ts-jest/presets/js-with-ts-esm',
  transform: {
    ...tsJestTransformCfg,
  },
  transformIgnorePatterns: [
  ]
}