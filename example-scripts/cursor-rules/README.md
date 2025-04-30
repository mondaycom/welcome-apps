# monday.com Cursor Rules

This directory contains Cursor IDE rules specifically designed for monday.com development. These rules provide enhanced development features for working with the monday API, monday Apps SDK, and monday Vibe Components.

## Usage

To use these rules in your Cursor IDE environment:

1. Create a `.cursor/rules` directory in your project root if it doesn't exist:
   ```bash
   mkdir -p .cursor/rules
   ```

2. Copy the rule files from the 'rules' directory to your project's `.cursor/rules` directory:
   ```bash
   cp -r example-scripts/cursor-rules/rules/* .cursor/rules/
   ```

3. Restart Cursor IDE to apply the changes

## Usage by developer tool
You can either install all the rules at once or selectively install only the rules that match your needs.

### Use all rules
```bash
cp -r example-scripts/cursor-rules/rules/* .cursor/rules
```

### Use only API client rules
```bash
cp -r example-scripts/cursor-rules/rules/platform-api/* .cursor/rules
```

### Use only Attention Box and Chips components rules
```bash
cp example-scripts/cursor-rules/rules/vibe-components/vibe-attention-box.mdc .cursor/rules
cp example-scripts/cursor-rules/rules/vibe-components/vibe-chips-component.mdc .cursor/rules
```

## Rule Types

The rules in this directory are organized as Project Rules, which means they are:
- Stored in `.cursor/rules`
- Version-controlled with your codebase
- Scoped to your project

## Available Rules

The rules provide guidance for:

### monday API Development
- API client suggestions
- Request/response type definitions
- Authentication patterns

### monday Vibe Components
- Component suggestions
- Component composition guidelines

## Rule Structure

Each rule file follows the MDC (Markdown with Context) format, which includes:
- A description of the rule's purpose
- Glob patterns for when the rule should be applied
- The actual rule content

## Using Rules

Rules are automatically applied when:
- Working with files matching the specified glob patterns
- The rule is explicitly referenced using `@ruleName`
- The AI determines the rule is relevant to the current context

## Support

For issues or questions about these rules:
- Check the monday.com developer documentation
- Open an issue in this repository
- Open a support ticket