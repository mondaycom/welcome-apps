/// <reference types="jest" />
import { loadCursorRule, validateRule } from '../utils/cursor-rule-utils';
import * as path from 'path';

describe('use-api-client rule', () => {
  const rulePath = path.join(process.cwd(), 'rules/platform-api/use-api-client.mdc');
  let rule: ReturnType<typeof loadCursorRule>;

  beforeAll(() => {
    rule = loadCursorRule(rulePath);
  });

  test('should have valid metadata', () => {
    expect(rule.metadata).toBeDefined();
    expect(rule.metadata.description).toBe('Correct usage of the monday API libraries');
    expect(rule.metadata.alwaysApply).toBe(false);
  });

  test('should contain required sections', () => {
    const content = rule.content;
    expect(content).toContain('Using monday client libraries to make GraphQL API calls');
    expect(content).toContain('Installing the API client');
    expect(content).toContain('Using the API client');
  });

  test('should include correct package information', () => {
    const content = rule.content;
    expect(content).toContain('@mondaydotcomorg/api');
    expect(content).toContain('npm install @mondaydotcomorg/api');
  });

  test('should contain both ApiClient and SeamlessApiClient references', () => {
    const content = rule.content;
    expect(content).toContain('ApiClient');
    expect(content).toContain('SeamlessApiClient');
    expect(content).toContain('Use the `ApiClient` class to make API calls from the server-side');
    expect(content).toContain('Use the `SeamlessApiClient` class to make API calls from the client-side');
  });

  test('should include best practice recommendations', () => {
    const content = rule.content;
    expect(content).toContain('Prefer the `@mondaydotcomorg/api` package over the "monday-sdk-js" package');
  });
});