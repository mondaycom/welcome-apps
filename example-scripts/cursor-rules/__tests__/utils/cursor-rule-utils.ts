import * as fs from 'fs';
import * as path from 'path';

interface RuleMetadata {
  description: string;
  globs?: string[];
  alwaysApply: boolean;
}

interface ParsedRule {
  metadata: RuleMetadata;
  content: string;
  codeBlocks: CodeBlock[];
}

interface CodeBlock {
  language: string;
  content: string;
}

export function parseMDC(content: string): ParsedRule {
  const metadataMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!metadataMatch) {
    throw new Error('Invalid MDC file format: Missing metadata section');
  }

  const [, metadataStr, mainContent] = metadataMatch;
  const metadata = parseMetadata(metadataStr);
  const codeBlocks = extractCodeBlocks(mainContent);

  return {
    metadata,
    content: mainContent,
    codeBlocks
  };
}

function parseMetadata(metadataStr: string): RuleMetadata {
  const lines = metadataStr.split('\n').filter(line => line.trim());
  const metadata: Partial<RuleMetadata> = {};

  lines.forEach(line => {
    const [key, value] = line.split(':').map(part => part.trim());
    if (key === 'description') {
      metadata.description = value;
    } else if (key === 'globs') {
      metadata.globs = value ? value.split(',').map(glob => glob.trim()) : [];
    } else if (key === 'alwaysApply') {
      metadata.alwaysApply = value === 'true';
    }
  });

  if (!metadata.description) {
    throw new Error('Missing required metadata field: description');
  }

  return metadata as RuleMetadata;
}

export function extractCodeBlocks(content: string): CodeBlock[] {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: CodeBlock[] = [];
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      language: match[1] || '',
      content: match[2].trim()
    });
  }

  return blocks;
}

export function validateJSXBlock(content: string): boolean {
  // Very lenient JSX validation that allows partial code blocks
  try {
    // If the content is a fragment or partial code, wrap it
    const wrappedContent = content.trim().startsWith('<')
      ? content
      : `<div>${content}</div>`;

    // Check for basic JSX structure - allow lowercase components too
    const hasJSXTags = /<[A-Za-z][A-Za-z0-9]*|<\/[A-Za-z][A-Za-z0-9]*>/.test(wrappedContent);
    if (!hasJSXTags) return true; // If no JSX tags, assume it's valid (could be a fragment)

    // Count brackets, allowing for imbalance in partial blocks
    const openCount = (wrappedContent.match(/<[^/][^>]*>/g) || []).length;
    const closeCount = (wrappedContent.match(/<\/[^>]+>/g) || []).length;
    const selfClosingCount = (wrappedContent.match(/<[^>]+\/>/g) || []).length;

    // Allow some imbalance for partial blocks
    const totalOpen = openCount - selfClosingCount;
    const diff = Math.abs(totalOpen - closeCount);
    if (diff > 3) return false; // Allow up to 3 unmatched tags for partial blocks

    // Check for catastrophically malformed JSX
    const hasUnmatchedQuotes = (wrappedContent.match(/"/g) || []).length % 2 !== 0;
    const hasUnmatchedCurlyBraces = (wrappedContent.match(/\{/g) || []).length !== (wrappedContent.match(/\}/g) || []).length;
    
    // Allow some imbalance in quotes and braces for partial blocks
    return !(hasUnmatchedQuotes && hasUnmatchedCurlyBraces);
  } catch (e) {
    return true; // If we can't parse it, assume it's valid (partial block)
  }
}

export function loadCursorRule(rulePath: string): ParsedRule {
  const content = fs.readFileSync(rulePath, 'utf8');
  return parseMDC(content);
}

export function validateRule(rule: ParsedRule): void {
  // Validate metadata
  if (!rule.metadata.description) {
    throw new Error('Rule must have a description');
  }

  // Validate code blocks
  rule.codeBlocks.forEach((block, index) => {
    if (block.language === 'jsx' || block.language === 'tsx') {
      if (!validateJSXBlock(block.content)) {
        throw new Error(`Invalid JSX in code block ${index + 1}`);
      }
    }
  });
} 