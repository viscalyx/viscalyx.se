---
title: 'Building a cross‑platform Folder resource for DSC v3'
date: '2026-03-04'
author: 'Johan Ljunggren'
excerpt: 'Build a cross-platform Folder DSC v3 resource in PowerShell and Python, replacing the Windows-only MOF-based pattern with modern approaches.'
image: '/blog-images/cross-platform-folder-dsc-v3-resource/cross-platform-config-folder-windows-linux-macos.png'
imageAlt: 'Open folder floating above interconnected Windows, Linux, and macOS logos with configuration lines.'
tags: ['PowerShell', 'DSC', 'Infrastructure as Code', 'Automation', 'Cross-Platform']
category: 'DSC'
readTime: '10 min read'
---

Managing folders — ensuring they exist, carry the right attributes, and stay
compliant — is one of the most common configuration tasks on any operating
system. The legacy
[Sampler MofResource Folder template][00]
ships a MOF-based `DSC_Folder` resource that handles this on Windows, but
MOF-based resources cannot run on Linux or macOS. In this article you convert
that pattern into a class-based DSC v3 resource called `Folder` that works
across Windows, Linux, and macOS.

## What you will learn

- Why the MOF-based Folder resource is Windows-only and what limits it.
- How to design a class-based replacement that runs everywhere DSC v3 runs.
- How to implement `Get()`, `Test()`, `Set()`, and `Export()`.
- How to test the resource locally and with a DSC v3 configuration document.
- How the same Folder resource can be built in Python as a
  command-based DSC v3 resource.

## Prerequisites

- PowerShell 7.4 or later on Windows, macOS, or Linux
- Microsoft DSC v3 installed
  (see [What is Microsoft DSC v3?][01])
- Basic knowledge of PowerShell classes and DSC concepts
  (see [DemoDscClass tutorial][02])
- A text editor or IDE (Visual Studio Code recommended)

## Why the MOF pattern does not cross the platform boundary

The Sampler MofResource template defines a `DSC_Folder` resource with a
`.schema.mof` file and three script functions (`Get-TargetResource`,
`Set-TargetResource`, `Test-TargetResource`). That design depends on the
Local Configuration Manager (LCM) that only exists in Windows PowerShell.

<!-- markdownlint-disable MD013 -->
| Trait | MOF-based (legacy) | Class-based (DSC v3) |
| --- | --- | --- |
| Schema | `.schema.mof` file | PowerShell class attributes |
| Engine | LCM (Windows only) | `dsc` executable (cross-platform) |
| Language | Windows PowerShell 5.1 | PowerShell 7+ (any OS) |
| Discovery | `Get/Set/Test-TargetResource` | `Get()`, `Set()`, `Test()` methods |
| Export support | Not available | `Export()` static method |
<!-- markdownlint-enable MD013 -->

By moving to a class-based resource you remove the MOF dependency and
gain access to DSC v3 features such as `Export()`, while keeping the
same logical structure.

<!-- markdownlint-disable MD013 -->
![MOF vs class-based Folder resource comparison](/blog-images/cross-platform-folder-dsc-v3-resource/cross-platform-dsc-v3-folder-resource-mof-vs-class-based.png)
<!-- markdownlint-enable MD013 -->

## Step 1: Create the project structure

Create a new folder for the DSC resource module:

```bash
mkdir Folder
cd Folder
```

The project layout is minimal:

```plaintext
Folder/
├── Folder.psd1    # Module manifest
└── Folder.psm1    # Resource implementation
```

> [!IMPORTANT]
> The module manifest filename must match the folder name. For example,
> if the folder is named `Folder`, the manifest must be `Folder.psd1`.

## Step 2: Create the module manifest

Use PowerShell to generate the manifest:

<!-- markdownlint-disable MD013 -->
```powershell
$manifestParams = @{
    Path                 = '.\Folder.psd1'
    RootModule           = 'Folder.psm1'
    DscResourcesToExport = 'Folder'
    ModuleVersion        = '0.0.1'
    CompatiblePSEditions = @('Core')
    PowerShellVersion    = '7.4'
}

New-ModuleManifest @manifestParams
```
<!-- markdownlint-enable MD013 -->

> [!NOTE]
> Because this resource targets cross-platform use, `CompatiblePSEditions`
> is set to `Core` only and `PowerShellVersion` requires 7.4 or later.

## Step 3: Design the properties

The legacy MOF schema defines these columns:

<!-- markdownlint-disable MD013 -->
| MOF property | MOF qualifier | Class-based equivalent | Notes |
| --- | --- | --- | --- |
| `Path` | `[Key]` | `[DscProperty(Key)]` | Uniquely identifies the folder |
| `ReadOnly` | `[Required]` | `[DscProperty(Mandatory)]` | Files in folder are read-only |
| `Hidden` | `[Write]` | `[DscProperty()]` | Folder hidden attribute |
| `Ensure` | `[Write]` | `[DscProperty()]` | Present or Absent |
| `Shared` | `[Read]` | `[DscProperty(NotConfigurable)]` | Read-only; reported by Get() |
| `ShareName` | `[Read]` | `[DscProperty(NotConfigurable)]` | Read-only; reported by Get() |
<!-- markdownlint-enable MD013 -->

For a cross-platform resource the `Shared` and `ShareName` properties
make less sense — SMB sharing is a Windows concept. This article keeps the
scope to the portable properties: `Path`, `ReadOnly`, `Hidden`, and
`Ensure`. You could add sharing support behind a platform guard later.

## Step 4: Implement the resource class

Create `Folder.psm1` with the full class:

<!-- markdownlint-disable MD013 -->
```powershell
enum Ensure {
    Present
    Absent
}

[DscResource()]
class Folder {
    [DscProperty(Key)]
    [System.String] $Path

    [DscProperty()]
    [System.Boolean] $ReadOnly = $false

    [DscProperty()]
    [System.Boolean] $Hidden = $false

    [DscProperty()]
    [Ensure] $Ensure = [Ensure]::Present

    # ── Get ──────────────────────────────────────────────
    [Folder] Get() {
        $currentState = [Folder]::new()
        $currentState.Path     = $this.Path
        $currentState.Ensure   = [Ensure]::Absent
        $currentState.ReadOnly = $false
        $currentState.Hidden   = $false

        $item = Get-Item -Path $this.Path -Force -ErrorAction SilentlyContinue |
            Where-Object { $_.PSIsContainer }

        if ($item) {
            $currentState.Ensure   = [Ensure]::Present
            $currentState.ReadOnly = [Folder]::TestAttribute($item, 'ReadOnly')
            $currentState.Hidden   = [Folder]::TestAttribute($item, 'Hidden')
        }

        return $currentState
    }

    # ── Test ─────────────────────────────────────────────
    [System.Boolean] Test() {
        $current = $this.Get()

        if ($this.Ensure -eq [Ensure]::Absent) {
            return $current.Ensure -eq [Ensure]::Absent
        }

        # Ensure is Present — folder must exist with matching attributes
        if ($current.Ensure -eq [Ensure]::Absent) {
            return $false
        }

        if ($current.ReadOnly -ne $this.ReadOnly) { return $false }
        if ($current.Hidden   -ne $this.Hidden)   { return $false }

        return $true
    }

    # ── Set ──────────────────────────────────────────────
    [void] Set() {
        if ($this.Ensure -eq [Ensure]::Absent) {
            if (Test-Path -Path $this.Path) {
                Remove-Item -Path $this.Path -Force -ErrorAction Stop
            }
            return
        }

        # Ensure is Present
        if (-not (Test-Path -Path $this.Path)) {
            $null = New-Item -Path $this.Path -ItemType Directory -Force
        }

        $folder = Get-Item -Path $this.Path -Force
        [Folder]::SetAttribute($folder, 'ReadOnly', $this.ReadOnly)
        [Folder]::SetAttribute($folder, 'Hidden',   $this.Hidden)
    }

    # ── Export ───────────────────────────────────────────
    [Folder[]] Export() {
        <#
            .SYNOPSIS
                Returns every folder under the instance's `Path` property.

            .NOTES
                The resource instance must have `Path` set. This method
                enumerates children of `$this.Path` and returns them.
        #>
        $resultList = [System.Collections.Generic.List[Folder]]::new()

        # Use the resource instance Path as the root for enumeration
        if (-not $this.Path) {
            throw [System.ArgumentException]::new('Path must be set on the resource instance before calling Export()')
        }

        Get-ChildItem -Path $this.Path -Directory -Force | ForEach-Object {
            $obj          = [Folder]::new()
            $obj.Path     = $_.FullName
            $obj.Ensure   = [Ensure]::Present
            $obj.ReadOnly = [Folder]::TestAttribute($_, 'ReadOnly')
            $obj.Hidden   = [Folder]::TestAttribute($_, 'Hidden')

            $resultList.Add($obj)
        }

        return $resultList.ToArray()
    }

    # ── Helpers ──────────────────────────────────────────
    hidden static [bool] TestAttribute(
        [System.IO.DirectoryInfo] $directory,
        [System.IO.FileAttributes] $attribute
    ) {
        return ($directory.Attributes -band $attribute) -gt 0
    }

    hidden static [void] SetAttribute(
        [System.IO.DirectoryInfo] $directory,
        [System.IO.FileAttributes] $attribute,
        [bool] $enabled
    ) {
        if ($enabled) {
            $directory.Attributes = $directory.Attributes -bor $attribute
        }
        else {
            $directory.Attributes = $directory.Attributes -band (-bnot $attribute)
        }
    }
}
```
<!-- markdownlint-enable MD013 -->

### Key design decisions

1. **Enum for Ensure** — Using a PowerShell `enum` instead of a
   `ValidateSet` string gives type safety and autocomplete.
1. **Static helpers** — `TestAttribute` and `SetAttribute` are
   `hidden static` methods so they stay off the public surface but
   are reusable inside every lifecycle method.
1. **No SMB sharing** — `Shared` and `ShareName` are dropped because
   `Get-SmbShare` is Windows-only. Add them behind
   `$IsWindows` guards if needed.

## Comparing with the MOF-based template

The Sampler template separates logic across several files:

```plaintext
MofResource/
├── DSC_Folder/
│   ├── DSC_Folder.psm1       # Get/Set/Test-TargetResource
│   ├── DSC_Folder.schema.mof # Property schema
│   └── en-US/                 # Localized strings
└── Modules/
    └── Folder.Common/
        └── Folder.Common.psm1 # Helper functions
```

The class-based version collapses all of that into a single `.psm1`
file. The MOF schema is replaced by `[DscProperty()]` attributes, and the
helper functions become `hidden static` methods on the class itself.

> [!TIP]
> If you maintain a large resource module with many shared helpers,
> you can still keep a separate helper module and import it in the
> `.psm1`. The point is that the `.schema.mof` file is no longer
> required.

## Step 5: Test the resource locally

### Add the module to the path

<!-- markdownlint-disable MD013 -->
```powershell
$env:PSModulePath += [System.IO.Path]::PathSeparator + (Split-Path -Path (Get-Location) -Parent)
```
<!-- markdownlint-enable MD013 -->

### Discover the resource

<!-- markdownlint-disable MD013 -->
```powershell
dsc resource list --adapter Microsoft.Adapter/PowerShell Folder*
```
<!-- markdownlint-enable MD013 -->

You should see `Folder/Folder` in the output.

### Run lifecycle operations

<!-- markdownlint-disable MD013 -->
```powershell
$params = @{ Path = '/tmp/dsc-test'; Ensure = 'Present' } |
    ConvertTo-Json -Compress

# Get current state
dsc resource get --resource Folder/Folder --input $params

# Test compliance
dsc resource test --resource Folder/Folder --input $params

# Apply desired state
dsc resource set --resource Folder/Folder --input $params

dsc resource export --resource Folder/Folder
# Export instances (resource instance must include `Path` in input)
# Example: ask the DSC engine to export children of `/tmp`
$exportParams = @{ Path = '/tmp' } | ConvertTo-Json -Compress
dsc resource export --resource Folder/Folder --input $exportParams
```
<!-- markdownlint-enable MD013 -->

> [!TIP]
> On Windows, swap `/tmp/dsc-test` for a Windows path such as
> `C:\Temp\dsc-test`.

## Step 6: Use a configuration document

Create `folder.dsc.config.yaml`:

<!-- markdownlint-disable MD013 -->
```yaml
$schema: https://aka.ms/dsc/schemas/v3/bundled/config/document.json
resources:
  - name: Ensure temp folder
    type: Folder/Folder
    metadata:
      Microsoft.DSC:
        requireAdapter: Microsoft.Adapter/PowerShell
    properties:
      Path: /tmp/dsc-managed
      Ensure: Present
      ReadOnly: false
      Hidden: false
```
<!-- markdownlint-enable MD013 -->

Run the configuration:

```sh
dsc config get  --file folder.dsc.config.yaml
dsc config test --file folder.dsc.config.yaml
dsc config set  --file folder.dsc.config.yaml
```

## Step 7: Write Pester tests

Create `Folder.tests.ps1`:

<!-- markdownlint-disable MD013 -->
```powershell
BeforeAll {
    Import-Module "$PSScriptRoot/Folder.psd1" -Force
}

Describe 'Folder DSC resource' {
    BeforeEach {
        $testPath = Join-Path -Path ([System.IO.Path]::GetTempPath()) -ChildPath ('dsc-folder-test-{0}' -f (New-Guid))
    }

    AfterEach {
        if (Test-Path -Path $testPath) {
            Remove-Item -Path $testPath -Force -Recurse
        }
    }

    Context 'Get()' {
        It 'Reports Absent when folder does not exist' {
            $params = @{ Path = $testPath } | ConvertTo-Json -Compress
            $result = dsc resource get --resource Folder/Folder --input $params | ConvertFrom-Json
            $result.actualState.Ensure | Should -Be 'Absent'
        }

        It 'Reports Present when folder exists' {
            New-Item -Path $testPath -ItemType Directory -Force
            $params = @{ Path = $testPath } | ConvertTo-Json -Compress
            $result = dsc resource get --resource Folder/Folder --input $params | ConvertFrom-Json
            $result.actualState.Ensure | Should -Be 'Present'
        }
    }

    Context 'Set()' {
        It 'Creates a folder that does not exist' {
            $params = @{ Path = $testPath; Ensure = 'Present' } | ConvertTo-Json -Compress
            dsc resource set --resource Folder/Folder --input $params | Out-Null
            Test-Path -Path $testPath | Should -BeTrue
        }

        It 'Removes a folder when Ensure is Absent' {
            New-Item -Path $testPath -ItemType Directory -Force
            $params = @{ Path = $testPath; Ensure = 'Absent' } | ConvertTo-Json -Compress
            dsc resource set --resource Folder/Folder --input $params | Out-Null
            Test-Path -Path $testPath | Should -BeFalse
        }
    }

    Context 'Test()' {
        It 'Returns false when folder is missing' {
            $params = @{ Path = $testPath; Ensure = 'Present' } | ConvertTo-Json -Compress
            $result = dsc resource test --resource Folder/Folder --input $params | ConvertFrom-Json
            $result.actualState.inDesiredState | Should -BeFalse
        }
    }
}
```
<!-- markdownlint-enable MD013 -->

Run the tests:

```powershell
Invoke-Pester -Path ./Folder.tests.ps1 -Output Detailed
```

## Platform considerations

<!-- markdownlint-disable MD013 -->
| Feature | Windows | Linux / macOS |
| --- | --- | --- |
| Create / remove folder | Yes | Yes |
| ReadOnly attribute | Yes (via `Attributes`) | Partial — maps to write permission, not a direct attribute |
| Hidden attribute | Yes (via `Attributes`) | Convention only (`.` prefix); `Attributes` not honored on ext4/APFS |
| SMB sharing | Yes (`Get-SmbShare`) | Not available natively |
<!-- markdownlint-enable MD013 -->

> [!WARNING]
> On Linux and macOS, the `Hidden` and `ReadOnly` attributes rely on
> the .NET `System.IO.FileAttributes` enum. The underlying file system
> may not support them. Consider mapping `ReadOnly` to POSIX
> permissions and `Hidden` to a dot-prefix rename for true
> cross-platform behavior in production resources.

## Alternative: Implementing the resource in Python

> [!IMPORTANT]
> This might not be a fully working example, but it illustrates how the
> same DSC v3 resource can be implemented as a command-based resource in
> Python instead of PowerShell. See the walkthrough and linked resources
> for details.

DSC v3 is language-agnostic — any executable that reads JSON from
STDIN and writes JSON to STDOUT can serve as a command-based resource.
Python is a natural fit for cross-platform work because it runs on
Windows, Linux, and macOS without extra runtimes.

The example below is inspired by Gijs Reijn's blog-series:
[Building Microsoft DSC v3 resources with Python][03]. Refer to those posts
for full details.

### Project layout

```plaintext
folder-dsc-python/
├── src/
│   ├── main.py     # Entry point (argparse CLI)
│   ├── args.py     # Argument parser definition
│   └── caps.py     # Capability handlers
└── folder.dsc.resource.json  # Resource manifest
```

### Resource manifest

DSC discovers command-based resources through a
`.dsc.resource.json` manifest placed on the `PATH`.
The manifest tells `dsc` which executable to call and which
subcommands map to each capability.

<!-- markdownlint-disable MD013 -->
```json
{
  "$schema": "https://aka.ms/dsc/schemas/v3/bundled/resource/manifest.json",
  "type": "DscFolder/Folder",
  "description": "Manage folders cross-platform (Python)",
  "version": "0.1.0",
  "get": {
    "executable": "folder",
    "args": ["config", "get"],
    "input": "stdin"
  },
  "set": {
    "executable": "folder",
    "args": ["config", "set"],
    "input": "stdin"
  },
  "test": {
    "executable": "folder",
    "args": ["config", "test"],
    "input": "stdin"
  },
  "whatIf": {
    "executable": "folder",
    "args": ["config", "whatif"],
    "input": "stdin"
  },
  "delete": {
    "executable": "folder",
    "args": ["config", "delete"],
    "input": "stdin"
  },
  "resolve": {
    "executable": "folder",
    "args": ["config", "resolve"],
    "input": "stdin"
  },
  "validate": {
    "executable": "folder",
    "args": ["config", "validate"],
    "input": "stdin"
  },
  "export": {
    "executable": "folder",
    "args": ["config", "export"],
    "input": "stdin"
  }
}
```
<!-- markdownlint-enable MD013 -->

> [!NOTE]
> The `executable` value points to the compiled binary you produce
> with a tool such as PyInstaller. During development you can call
> `python src/main.py config get` directly.

### Capability handlers (`caps.py`)

Each DSC capability maps to a Python function that receives a
dictionary parsed from STDIN JSON and returns (or prints) a JSON
result.

<!-- markdownlint-disable MD013 -->
```python
import json
import os
import stat
import shutil
from pathlib import Path


def get_folder(input_json: dict) -> str:
    """Return the current state of the folder as JSON."""
    p = Path(input_json["Path"])
    exists = p.exists() and p.is_dir()
    result = {
        "Path": str(p),
        "Ensure": "Present" if exists else "Absent",
        "ReadOnly": not os.access(p, os.W_OK) if exists else False,
        "Hidden": p.name.startswith(".") if exists else False,
    }
    return json.dumps(result)


def test_folder(input_json: dict) -> str:
    """Return JSON with an `inDesiredState` boolean."""
    current = json.loads(get_folder(input_json))
    desired_ensure = input_json.get("Ensure", "Present")
    if desired_ensure == "Absent":
        in_state = current["Ensure"] == "Absent"
    elif current["Ensure"] == "Absent":
        in_state = False
    else:
        in_state = (
            current["ReadOnly"] == input_json.get("ReadOnly", False)
            and current["Hidden"] == input_json.get("Hidden", False)
        )
    return json.dumps({**current, "inDesiredState": in_state})


def set_folder(input_json: dict) -> str:
    """Create or remove the folder, then return the new state."""
    p = Path(input_json["Path"])
    desired_ensure = input_json.get("Ensure", "Present")
    if desired_ensure == "Absent":
        if p.exists() and p.is_dir():
            shutil.rmtree(p)
    else:
        p.mkdir(parents=True, exist_ok=True)
        if input_json.get("ReadOnly", False):
            p.chmod(p.stat().st_mode & ~(stat.S_IWUSR | stat.S_IWGRP | stat.S_IWOTH))
    return get_folder(input_json)


def whatif_folder(input_json: dict) -> str:
    """Preview changes without applying them."""
    current = json.loads(get_folder(input_json))
    desired_ensure = input_json.get("Ensure", "Present")
    changes = []
    if desired_ensure == "Absent" and current["Ensure"] == "Present":
        changes.append("Remove folder")
    elif desired_ensure == "Present":
        if current["Ensure"] == "Absent":
            changes.append("Create folder")
        if current.get("ReadOnly") != input_json.get("ReadOnly", False):
            changes.append("Update ReadOnly attribute")
        if current.get("Hidden") != input_json.get("Hidden", False):
            changes.append("Update Hidden attribute")
    return json.dumps({**current, "plannedChanges": changes})


def delete_folder(input_json: dict) -> str:
    """Unconditionally remove the folder."""
    p = Path(input_json["Path"])
    if p.exists() and p.is_dir():
        shutil.rmtree(p)
    return get_folder(input_json)


def resolve_folder(input_json: dict) -> str:
    """Resolve the canonical path of the folder."""
    p = Path(input_json["Path"])
    resolved = p.resolve() if p.exists() else p
    return json.dumps({"Path": str(resolved)})


def validate_folder(input_json: dict) -> str:
    """Validate that the input properties are well-formed."""
    errors = []
    path_value = input_json.get("Path")
    if not path_value or not isinstance(path_value, str):
        errors.append("Path is required and must be a string")
    ensure = input_json.get("Ensure", "Present")
    if ensure not in ("Present", "Absent"):
        errors.append("Ensure must be 'Present' or 'Absent'")
    return json.dumps({"valid": len(errors) == 0, "errors": errors})


def export_folder(input_json: dict) -> str:
    """Export every child directory under Path."""
    root = Path(input_json["Path"])
    resources = []
    for child in sorted(root.iterdir()):
        if child.is_dir():
            resources.append(json.loads(get_folder({"Path": str(child)})))
    return json.dumps({"resources": resources})
```
<!-- markdownlint-enable MD013 -->

### Argument parser (`args.py`)

<!-- markdownlint-disable MD013 -->
```python
import argparse


def create_parser() -> argparse.ArgumentParser:
    """Build the CLI that DSC calls."""
    parser = argparse.ArgumentParser(description="Folder DSC resource")
    sub = parser.add_subparsers(dest="config", required=True)
    config_parser = sub.add_parser("config", help="DSC capabilities")
    actions = config_parser.add_subparsers(dest="action", required=True)
    actions.add_parser("get", help="Get current folder state")
    actions.add_parser("set", help="Apply desired folder state")
    actions.add_parser("test", help="Test folder compliance")
    actions.add_parser("whatif", help="Preview changes")
    actions.add_parser("delete", help="Remove folder")
    actions.add_parser("resolve", help="Resolve canonical path")
    actions.add_parser("validate", help="Validate input")
    actions.add_parser("export", help="Export child folders")
    return parser
```
<!-- markdownlint-enable MD013 -->

### Entry point (`main.py`)

<!-- markdownlint-disable MD013 -->
```python
import sys
import json
from args import create_parser
from caps import (
    get_folder,
    set_folder,
    test_folder,
    whatif_folder,
    delete_folder,
    resolve_folder,
    validate_folder,
    export_folder,
)

ACTIONS = {
    "get": get_folder,
    "set": set_folder,
    "test": test_folder,
    "whatif": whatif_folder,
    "delete": delete_folder,
    "resolve": resolve_folder,
    "validate": validate_folder,
    "export": export_folder,
}

if __name__ == "__main__":
    parser = create_parser()
    args = parser.parse_args()
    input_json = json.loads(sys.stdin.read())
    print(ACTIONS[args.action](input_json))
```
<!-- markdownlint-enable MD013 -->

### Test it

<!-- markdownlint-disable MD013 -->
```sh
# Pass JSON via STDIN — works on any OS
echo '{"Path": "/tmp/dsc-test"}' | python src/main.py config get
echo '{"Path": "/tmp/dsc-test", "Ensure": "Present"}' | python src/main.py config set
echo '{"Path": "/tmp/dsc-test", "Ensure": "Present"}' | python src/main.py config test
echo '{"Path": "/tmp/dsc-test", "Ensure": "Present"}' | python src/main.py config whatif
echo '{"Path": "/tmp/dsc-test"}' | python src/main.py config delete
echo '{"Path": "/tmp/dsc-test"}' | python src/main.py config resolve
echo '{"Path": "/tmp/dsc-test", "Ensure": "Present"}' | python src/main.py config validate
echo '{"Path": "/tmp"}' | python src/main.py config export
```
<!-- markdownlint-enable MD013 -->

Once the handlers work, package the project into a standalone
executable (for example with PyInstaller), place it and the resource
manifest on the `PATH`, and DSC discovers it automatically.

> [!TIP]
> For the complete setup — virtual environment, build automation,
> and packaging — follow [Building Microsoft DSC v3 resources
> with Python][03].

## Review and next steps

You have converted the MOF-based Sampler `DSC_Folder` template into a
class-based DSC v3 resource that runs on Windows, Linux, and macOS.

Key takeaways:

1. MOF schemas and `*-TargetResource` functions are replaced by a
   single PowerShell class with `[DscProperty()]` attributes.
1. The `Export()` method is a new DSC v3 capability that MOF-based
   resources cannot provide.
1. Cross-platform resources should avoid Windows-only APIs such as
   `Get-SmbShare` or guard them behind `$IsWindows`.
1. File-system attributes behave differently across operating systems —
   always test on every target platform.
1. Python offers a language-agnostic alternative — any executable
   that speaks JSON over STDIN/STDOUT works with DSC v3.

### What to explore next

- Add POSIX permission support behind `$IsLinux` / `$IsMacOS` guards.
- Implement recursive folder creation with attribute inheritance.
- Publish the resource to the PowerShell Gallery or PyPI.
- Combine the Folder resource with other DSC v3 resources in a
  multi-resource configuration document.
- Package the Python variant with PyInstaller and distribute it as a
  standalone executable.

## Related content

- [Sampler MofResource Folder template][00]
- [What is Microsoft DSC v3?][01]
- [DemoDscClass: Your First Class-Based DSC v3 Resource][02]
- [DSC v3 overview](https://learn.microsoft.com/powershell/dsc/overview)
- [Class-based DSC resources](https://learn.microsoft.com/powershell/dsc/concepts/class-based-resources)
- [DSC v3 Samples on GitHub](https://github.com/PowerShell/DSC-Samples)
- [The DSC V3 Handbook](https://leanpub.com/thedscv3handbook/)
- [Building Microsoft DSC v3 resources with Python][03]

<!-- Link reference definitions -->

[00]: https://github.com/gaelcolas/Sampler/tree/main/Sampler/Templates/MofResource
[01]: what-is-dscv3
[02]: demodscclass-your-first-class-based-dsc-v3-resource
[03]: https://gijsreijn.medium.com/building-microsoft-dsc-v3-resources-with-python-30d6171de995
