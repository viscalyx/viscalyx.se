# Spell Checking Setup

This project uses [Code Spell Checker (cspell)](https://cspell.org/) for automated spell checking across all code files, markdown content, and documentation.

## Configuration

### VS Code Integration
- **Extension**: Code Spell Checker is configured in `.vscode/settings.json`
- **Real-time checking**: Spelling errors are highlighted as you type
- **Custom dictionary**: Technical terms are pre-configured in `.cspell.json`

### Files Checked
- TypeScript/JavaScript files (`.ts`, `.tsx`, `.js`, `.jsx`)
- Markdown files (`.md`)
- JSON configuration files
- YAML files

### Custom Dictionary
The `.cspell.json` file includes:
- Company names (Viscalyx, etc.)
- Technical terms (DevOps, Kubernetes, PowerShell DSC, etc.)
- Framework names (Next.js, React, Azure, AWS, etc.)
- Common abbreviations and acronyms

## Usage

### NPM Scripts
```bash
# Check all files for spelling errors
npm run spell:check

# Interactive spell checking with suggestions
npm run spell:fix

# Check specific files
npx cspell "app/**/*.tsx"
```

### VS Code Commands
- `Ctrl/Cmd + Shift + P` → "Spell: Add Words to Dictionary"
- Right-click on misspelled word → "Add to Dictionary"
- `F1` → "Spell: Check Current Document"

### Adding New Words
1. **VS Code**: Right-click on the word → "Add to User Dictionary" or "Add to Workspace Dictionary"
2. **Manual**: Add words to the `words` array in `.cspell.json`
3. **Project-specific**: Words added via VS Code are automatically saved to `.cspell.json`

## Automation

### GitHub Actions
- Spell checking runs automatically on all pull requests
- Builds fail if spelling errors are found
- Comments are added to PRs with spelling issues

### Pre-commit Integration (Optional)
To add spell checking to pre-commit hooks, add this to your pre-commit script:

```bash
#!/bin/sh
npm run spell:check
if [ $? -ne 0 ]; then
  echo "❌ Spell check failed. Please fix spelling errors before committing."
  exit 1
fi
```

## Ignoring False Positives

### Temporary Ignore
Add `// cspell:disable-next-line` above the line with the "misspelled" word:

```typescript
// cspell:disable-next-line
const specialTechnicalTerm = "someUniqueApiName";
```

### Ignore Entire File
Add to the top of the file:
```
// cspell:disable
```

### Ignore Specific Words in File
```typescript
// cspell:ignore specialword anothertechterm
```

## Configuration Details

### Ignored Patterns
The spell checker automatically ignores:
- URLs and email addresses
- Hexadecimal color codes
- UUIDs
- CSS measurements (px, rem, em, %)
- Import/require statements
- Code blocks in markdown
- File paths and technical identifiers

### File Exclusions
- `node_modules/`
- `.next/` and build directories
- Lock files (`package-lock.json`, `yarn.lock`)
- Binary and generated files

## Troubleshooting

### Common Issues

1. **False Positives**: Add legitimate technical terms to `.cspell.json`
2. **Performance**: Adjust `checkLimit` in `.cspell.json` for large files
3. **Languages**: Add language-specific dictionaries if needed

### Debugging
```bash
# Verbose output to see what's being checked
npx cspell "**/*.md" --verbose

# Check a specific file with full details
npx cspell app/page.tsx --show-context --show-suggestions
```

## Language Extensions

This project supports multi-language spell checking:

### Swedish Support
Swedish spell checking is enabled for:
- Files in the Swedish dictionary (`lib/dictionaries/sv.ts`)
- Files with `sv` in the filename
- Files with `swedish` in the filename

The configuration includes:
```bash
npm install --save-dev @cspell/dict-sv
```

Configuration in `.cspell.json`:
```json
{
  "dictionaries": ["sv"],
  "overrides": [
    {
      "filename": "**/dictionaries/sv.ts",
      "language": "sv",
      "dictionaries": ["sv", "en"]
    }
  ]
}
```

### Additional Language Support
For other languages, install additional dictionaries:

```bash
npm install --save-dev @cspell/dict-spanish @cspell/dict-french
```

Then add to `.cspell.json`:
```json
{
  "dictionaries": ["spanish", "french"]
}
```

## Best Practices

1. **Review before adding**: Don't blindly add misspelled words to the dictionary
2. **Keep dictionary clean**: Periodically review custom words
3. **Use consistent naming**: Follow project conventions for technical terms
4. **Document decisions**: Add comments in `.cspell.json` for unusual words
5. **Team alignment**: Ensure all team members use the same VS Code settings
