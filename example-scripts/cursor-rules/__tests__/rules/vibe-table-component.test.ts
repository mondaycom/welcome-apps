/// <reference types="jest" />
import { loadCursorRule, validateRule } from '../utils/cursor-rule-utils';
import * as path from 'path';

describe('vibe-table-component rule', () => {
  const rulePath = path.join(process.cwd(), '.cursor/rules/vibe-table-component.mdc');
  let rule: ReturnType<typeof loadCursorRule>;

  beforeAll(() => {
    rule = loadCursorRule(rulePath);
  });

  test('should have valid metadata', () => {
    expect(rule.metadata).toBeDefined();
    expect(rule.metadata.description).toBe('Usage of Table component to represent data');
    expect(rule.metadata.alwaysApply).toBe(false);
  });

  test('should contain required sections', () => {
    expect(rule.content).toContain('## Building tables correctly');
    expect(rule.content).toContain('### Boilerplate');
  });

  test('should have valid JSX code blocks', () => {
    const jsxBlocks = rule.codeBlocks.filter(block => 
      block.language === 'jsx' || block.language === 'tsx'
    );
    expect(jsxBlocks.length).toBeGreaterThan(0);

    jsxBlocks.forEach(block => {
      expect(() => validateRule({
        ...rule,
        codeBlocks: [block]
      })).not.toThrow();
    });
  });

  test('should contain required Table component props somewhere in the examples', () => {
    const allCodeContent = rule.codeBlocks
      .filter(block => block.language === 'jsx' || block.language === 'tsx')
      .map(block => block.content)
      .join('\n');

    expect(allCodeContent).toMatch(/columns=/);
    expect(allCodeContent).toMatch(/errorState=/);
    expect(allCodeContent).toMatch(/emptyState=/);
  });

  test('should contain TableHeader and TableBody components somewhere in the examples', () => {
    const allCodeContent = rule.codeBlocks
      .filter(block => block.language === 'jsx' || block.language === 'tsx')
      .map(block => block.content)
      .join('\n');

    expect(allCodeContent).toMatch(/<TableHeader/);
    // Also check for TableVirtualizedBody as it's a valid alternative
    expect(allCodeContent).toMatch(/<TableBody|<TableVirtualizedBody/);
  });

  test('should demonstrate different table features', () => {
    const features = [
      'Borders',
      'Scroll',
      'Loading',
      'VirtualizedScroll'
    ];

    features.forEach(feature => {
      expect(rule.content).toContain(`### ${feature}`);
    });
  });
}); 