# monday.com Cursor Rules

This directory contains Cursor IDE rules specifically designed for monday.com development. These rules provide enhanced development features for working with the monday API, monday Apps SDK, and monday Vibe Components.

## Installation

To use these rules in your Cursor IDE environment:

1. Create a `.cursor/rules` directory in your project root if it doesn't exist:
   ```bash
   mkdir -p .cursor/rules
   ```

2. Copy the rule files from this directory to your project's `.cursor/rules` directory:
   ```bash
   cp example-scripts/cursor-rules/* .cursor/rules/
   ```

3. Restart Cursor IDE to apply the changes

## Rule Types

The rules in this directory are organized as Project Rules, which means they are:
- Stored in `.cursor/rules`
- Version-controlled with your codebase
- Scoped to your project

## Available Rules

The rules provide guidance for:

### monday API Development
- API endpoint suggestions and completions
- Request/response type definitions
- Authentication patterns
- Common API usage patterns

### monday Apps SDK
- SDK method completions
- Type definitions and validation
- Development best practices
- Workflow automation

### monday Vibe Components
- Component suggestions
- Props validation
- Styling patterns
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

## Best Practices

- Keep rules focused and specific to monday.com development
- Update rules as the monday.com platform evolves
- Share useful rules with your team
- Test rules in your development environment before committing

## Support

For issues or questions about these rules:
- Check the monday.com developer documentation
- Open an issue in this repository