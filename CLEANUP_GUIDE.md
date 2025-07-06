# Repository Cleanup Guide

## Files Recommended for Deletion

The following files are redundant and can be safely deleted to clean up the repository:

### Batch Files (.bat)
All batch files can be deleted as their functionality has been replaced by npm scripts:

- `advanced-websocket-debug.bat`
- `check-ports.bat`
- `clean-startup.bat`
- `debug-websocket.bat`
- `fix-all-errors.bat`
- `fix-signalr-dependency.bat`
- `quick-fix-backend.bat`
- `quick-fix-frontend.bat`
- `quick-fix-websocket.bat`
- `setup-complete.bat`
- `setup-quick-integration.bat`
- `start-backend-clean.bat`
- `start-backend.bat`
- `start-frontend.bat`
- `start-wem-dashboard.bat`
- `test-build.bat`
- `test-dotnet-api.bat`

### PowerShell Scripts (.ps1)
These PowerShell scripts are redundant and can be deleted:

- `debug-migrations.ps1`
- `diagnose-build-issues.ps1`
- `final-migration-test.ps1`
- `fix-build-issues.ps1`
- `fix-migrations.ps1`
- `install-dependencies.ps1`
- `integrate-database-features.ps1`
- `integrate-simple.ps1`
- `organize-docs.ps1`
- `quick-build-test.ps1`
- `setup-database.ps1`
- `setup-sqlite-dev.ps1`
- `test-migration-fix.ps1`
- `verify-database.ps1`
- `verify-integration.ps1`

### Shell Scripts (.sh)
These shell scripts are also redundant:

- `integrate-database-features.sh`
- `setup-sqlite-dev.sh`
- `setup-sqlite.sh`
- `setup.sh`
- `verify-database.sh`

### Redundant Documentation
- `SIMPLIFIED_README.md` (functionality merged into main README.md)

## Replacement Commands

All functionality from the deleted scripts is now available via npm scripts:

| Old Batch File | New npm Script |
|---|---|
| `start-backend.bat` | `npm run start-backend` |
| `start-frontend.bat` | `npm run start-frontend` |
| `start-wem-dashboard.bat` | `npm run quick-start` |
| `setup-database.ps1` | `npm run setup-db` |
| `fix-migrations.ps1` | `npm run reset-db` |
| `install-dependencies.ps1` | `npm run full-setup` |
| `test-build.bat` | `npm run build` |
| `debug-websocket.bat` | `npm run dev` |

## Benefits of Cleanup

1. **Cross-platform compatibility**: npm scripts work on Windows, macOS, and Linux
2. **Reduced repository size**: Fewer files to maintain
3. **Better organization**: All commands centralized in package.json
4. **Standardized workflow**: Using industry-standard npm scripts
5. **Easier maintenance**: Single source of truth for build commands

## How to Delete

To delete these files safely:

1. **Review the list above** to ensure you don't need any specific functionality
2. **Test npm scripts** to confirm they work for your needs
3. **Delete files gradually** or in batches to ensure nothing breaks
4. **Commit changes** incrementally for easier rollback if needed

```bash
# Example: Delete batch files
rm *.bat

# Example: Delete PowerShell scripts  
rm *.ps1

# Example: Delete shell scripts
rm *.sh

# Or delete specific files one by one
rm advanced-websocket-debug.bat
rm setup-database.ps1
# etc...
```

**Note**: This cleanup has already been implemented in the codebase through improved npm scripts and documentation. The files listed above are safe to delete.
