---
title: 'Automating Power BI Report Server with DSC v3 – Three Invocation Patterns'
date: '2025-07-20'
author: 'Johan Ljunggren'
excerpt: 'Explore three advanced patterns for automating Power BI Report Server deployments using DSC v3: imperative, declarative, and Winget-based approaches.'
image: '/server-racks-green-leds-mesh-data-center.png'
imageAlt: 'Front view of server racks behind mesh doors, glowing with green LEDs and threaded with orange and blue network cables in a dark data center.'
tags:
  - 'SQL Server'
  - 'DSC'
  - 'BI Report Server'
  - 'PowerShell'
  - 'Automation'
  - 'DevOps'
category: 'DSC'
readTime: '9 min read'
---

> **Audience:** infrastructure engineers comfortable with PowerShell, CI
> pipelines and automated SQL Server deployments.

## Scope

Demonstrate **SqlRSSetup** on DSC v3 when executed:

1. **Imperatively** – _direct_ with DSC v3 using `dsc resource set`
1. **Declaratively** – in a DSC v3 _configuration_ using `dsc config set`
1. **WinGet** – hand off your DSC v3 config to the Windows Package Manager with
   `winget configure`

## Baseline environment

<!-- markdownlint-disable MD013 -->
| Component               | Minimum version | Notes                                                 |
| ----------------------- | --------------- | ----------------------------------------------------- |
| Windows Server          | 2025            | Edition 2025 only required to support WinGet deploy   |
| Windows Package Manager | 1.11.400        | For WinGet scenario (requires Windows Server 2025)    |
| PowerShell              | 7.5.x           | Engine host                                           |
| DSC v3                  | 3.2.0-preview.2 | Required for modern invocation patterns               |
| SqlServer               | 22.3.0          | Dependent module for SqlServerDsc                     |
| SqlServerDsc            | 17.1.x          | Contains **SqlRSSetup** resource                      |
| Power BI Report Server  | 15.x            | Setup media need to be available by local or UNC path |
<!-- markdownlint-enable MD013 -->

### Install Windows Server 2025

There are many guides on installing Windows Server; version 2025 installs
no differently from previous versions.

### Update WinGet

We require WinGet 1.11.400 or newer, but Windows Server 2025 comes with an
older version. Install or upgrade WinGet by following
[installing WinGet](https://github.com/microsoft/winget-cli?tab=readme-ov-file#installing-the-client).

If you download WinGet from [winget-cli releases](https://github.com/microsoft/winget-cli/releases),
download the matching dependencies package for that release as well. Installing
those dependencies is recommended, but might not be required in every
environment; if setup fails without them, install dependencies and retry, or
verify WinGet installs and runs successfully when dependencies are skipped.

### Install PowerShell

Windows Server 2025 does not come with PowerShell (only _Windows PowerShell_) so
we need to install it:

<!-- markdownlint-disable MD013 -->
```sh
winget install Microsoft.PowerShell
```
<!-- markdownlint-enable MD013 -->

> [!TIP]
> Suggest making Windows Terminal default in Windows Server 2025 and then make
> PowerShell the default in Windows Terminal.

### Install DSC v3

For instructions on installing DSC v3, see the "Install DSC executable" section
in [DemoDscClass: Your First Class-based DSC v3 Resource](/blog/demodscclass-your-first-class-based-dsc-v3-resource#install-dsc-executable).

### Install SqlServer

The module _SqlServer_ is used by SqlServerDsc for SQL Server .NET types and SQL
Server PowerShell commands.

<!-- markdownlint-disable MD013 -->
```powershell
Install-PSResource SqlServer -Version 22.3.0 -TrustRepository
```
<!-- markdownlint-enable MD013 -->

> [!IMPORTANT]
> The dependent module should not be required for this guide, but due to a bug
> in DSC v3 we need to install it. Without the dependent module SqlServerDsc
> outputs a warning message:
>
> ```text
>WARNING: Failed to find a dependent module. Unable to run SQL Server commands
> or use SQL Server types. Please install one of the preferred SMO modules or
> the SQLPS module, then try to import SqlServerDsc again.
>```
>
> That warning message is normally not an issue, but it will fail DSC v3. To
> avoid DSC v3 failures and suppress this warning, install a supported
> PowerShell module with a compatible version for your environment, such as
> _SQLPS_, _SqlServer_, or _dbatools_.

### Install SqlServerDsc

<!-- markdownlint-disable MD013 -->
```powershell
Install-PSResource SqlServerDsc -Version 17.1.0 -TrustRepository
```
<!-- markdownlint-enable MD013 -->

### Download PowerBI Report Server

<!-- markdownlint-disable MD013 -->
```powershell
$url = 'https://download.microsoft.com/download/2/7/3/2739a88a-4769-4700-8748-1a01ddf60974/PowerBIReportServer.exe'
$mediaFilePath = [System.IO.Path]::GetTempPath()
Save-SqlDscSqlServerMediaFile -SkipExecution -Url $url -FileName 'PowerBIReportServer.exe' -DestinationPath $mediaFilePath -Force -ErrorAction 'Stop'
$mediaExecutableFile = $mediaFilePath | Join-Path -ChildPath 'PowerBIReportServer.exe'
$mediaExecutableFile
```
<!-- markdownlint-enable MD013 -->

## Pattern 1 – One‑shot imperative call

When you need a **quick, idempotent task** (e.g. build server image) without
maintaining configuration files.

<!-- markdownlint-disable MD013 -->
```powershell
$desiredParameters = @{
    InstanceName = 'PBIRS'
    Action       = 'Install'
    AcceptLicensingTerms = $true
    MediaPath   = $mediaExecutableFile
    Edition = 'Developer'
} | ConvertTo-Json -Compress
```
<!-- markdownlint-enable MD013 -->

> We don't need to use `SuppressRestart` here because DSC v3 does not yet
> support restarting of a target machine. Neither would `ForceRestart` work
> either. When a restart is required either forcefully or by exit code, the
> command [Set-DscMachineRebootRequired](https://github.com/dsccommunity/DscResource.Common/wiki/Set%E2%80%91DscMachineRebootRequired)
> is called. The logic the command uses only works with PSDSC and LCM.

### Imperative Get-operation

Running the Get-operation we can verify that the current state is missing the
Power BI Report Server instance:

<!-- markdownlint-disable MD013 -->
```powershell
$ dsc resource get --resource SqlServerDsc/SqlRSSetup --output-format json --input $desiredParameters | ConvertFrom-Json | fl

actualState : @{ProductKey=; Timeout=7200; SuppressRestart=; EditionUpgrade=; LogPath=; InstanceName=; AcceptLicensingTerms=False; InstallFolder=; ForceRestart=; Action=0; VersionUpgrade=; Edition=; MediaPath=}
```
<!-- markdownlint-enable MD013 -->

### Imperative Test-operation

Running the Test-operation we can verify that it reports our desired state is
not in compliance; the Power BI Report Server instance is missing:

<!-- markdownlint-disable MD013 -->
```powershell
$ dsc resource test --resource SqlServerDsc/SqlRSSetup --output-format json --input $desiredParameters | ConvertFrom-Json | fl

desiredState        : @{AcceptLicensingTerms=True; InstanceName=PBIRS; Edition=Developer; MediaPath=C:\Users\user\AppData\Local\Temp\2\PowerBIReportServer.exe; Action=Install}
actualState         : @{InDesiredState=False}
inDesiredState      : False
differingProperties : {AcceptLicensingTerms, InstanceName, Edition, MediaPath…}
```
<!-- markdownlint-enable MD013 -->

### Imperative Set-operation

Running the Set-operation will make sure our desired state is configured:

> [!IMPORTANT]
> Contrary to the Get- and Test-operation the Set-operation must run in an
> elevated PowerShell prompt.

<!-- markdownlint-disable MD013 -->
```powershell
$desiredParameters = @{
    InstanceName = 'PBIRS'
    Action       = 'Install'
    AcceptLicensingTerms = $true
    MediaPath   = '<path to media executable>'
    Edition = 'Developer'
} | ConvertTo-Json -Compress
```
<!-- markdownlint-enable MD013 -->

<!-- markdownlint-disable MD013 -->
```powershell
$ dsc resource set --resource SqlServerDsc/SqlRSSetup --output-format json --input $desiredParameters | ConvertFrom-Json | fl

beforeState       : @{InstallFolder=; Action=0; Timeout=7200; ForceRestart=; VersionUpgrade=; ProductKey=; SuppressRestart=; LogPath=; AcceptLicensingTerms=False; InstanceName=; EditionUpgrade=; MediaPath=; Edition=}
afterState        : @{ProductKey=; AcceptLicensingTerms=False; MediaPath=; ForceRestart=; VersionUpgrade=; Action=0; InstanceName=PBIRS; SuppressRestart=; LogPath=; EditionUpgrade=; Timeout=7200; Edition=; InstallFolder=C:\Program Files\Microsoft Power BI Report Server}
changedProperties : {InstallFolder, InstanceName}
```
<!-- markdownlint-enable MD013 -->

> [!NOTE]
> Running the Set-operation will take several minutes and no output will be
> shown until it is complete.

We can re-run the Set-operation again, this time it will be quicker as the
desired state is already achieved, so it does nothing until the instance is
removed. We can see below that a second run did not change any properties:

<!-- markdownlint-disable MD013 -->
```powershell
$ dsc resource set --resource SqlServerDsc/SqlRSSetup --output-format json --input $desiredParameters | ConvertFrom-Json | fl

beforeState       : @{ForceRestart=; AcceptLicensingTerms=False; Edition=; Timeout=7200; VersionUpgrade=; EditionUpgrade=; ProductKey=; InstanceName=PBIRS; SuppressRestart=; Action=0; MediaPath=; LogPath=; InstallFolder=C:\Program Files\Microsoft Power BI Report Server}
afterState        : @{InstallFolder=C:\Program Files\Microsoft Power BI Report Server; ProductKey=; LogPath=; Action=0;SuppressRestart=; MediaPath=; VersionUpgrade=; ForceRestart=; Edition=; EditionUpgrade=; Timeout=7200; AcceptLicensingTerms=False; InstanceName=PBIRS}
changedProperties :
```
<!-- markdownlint-enable MD013 -->

## Pattern 2 – Declarative configuration

Ideal for **repeatable, documented deployments** when multiple resources must
coordinate (SQL Engine + RS Setup + firewall, etc.).

### DSC v3 configuration document

Configuration documents can be in both YAML or JSON. At the time of this
writing Microsoft recommends drafting configuration documents in YAML.

Author a YAML document (`deploy-PBIRS.dsc.config.yaml`) to define the desired
state:

> [!NOTE]
> As of DSC v3.2.0, the adapter syntax has changed. Previously, PowerShell
> resources were wrapped inside a `Microsoft.DSC/PowerShell` adapter with a
> nested `resources` array. The new pattern uses `requireAdapter` in the
> resource metadata under `Microsoft.DSC`, making configurations flatter and
> more readable. See [PowerShell/DSC#1368](https://github.com/PowerShell/DSC/issues/1368)
> for details.

<!-- markdownlint-disable MD013 -->
```yml
$schema: https://aka.ms/dsc/schemas/v3/bundled/config/document.json
metadata:
  owner: 'security.ops@contoso.com'
  name: 'Deploy Power BI Report Server'
  purpose: |
    Deploy Power BI Report Server on a target machine.
  Microsoft.DSC:
    securityContext: elevated
resources:
  - name: 'Install PBIRS'
    type: SqlServerDsc/SqlRSSetup
    metadata:
      Microsoft.DSC:
        requireAdapter: Microsoft.Adapter/PowerShell
    properties:
      InstanceName: 'PBIRS'
      Action: 'Install'
      AcceptLicensingTerms: true
      MediaPath: '<path to media executable>'
      Edition: 'Developer'
```
<!-- markdownlint-enable MD013 -->

### Declarative Get-operation

<!-- markdownlint-disable MD013 -->
```powershell
dsc config get --file deploy-PBIRS.dsc.config.yaml --output-format json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```
<!-- markdownlint-enable MD013 -->

Outputs:

<!-- markdownlint-disable MD013 -->
```json
{
  "metadata": {
    "Microsoft.DSC": {
      "version": "3.2.0",
      "operation": "get",
      "executionType": "actual",
      "startDatetime": "2025-07-22T13:14:24.373870900+02:00",
      "endDatetime": "2025-07-22T13:14:29.359425400+02:00",
      "duration": "PT4.9855545S",
      "securityContext": "elevated"
    }
  },
  "results": [
    {
      "metadata": {
        "Microsoft.DSC": {
          "duration": "PT3.5261752S"
        }
      },
      "name": "Install PBIRS",
      "type": "SqlServerDsc/SqlRSSetup",
      "result": {
        "actualState": {
          "Action": "0",
          "InstanceName": "PBIRS",
          "Timeout": 7200,
          "ProductKey": null,
          "InstallFolder": "C:\\Program Files\\Microsoft Power BI Report Server",
          "MediaPath": null,
          "VersionUpgrade": null,
          "EditionUpgrade": null,
          "ForceRestart": null,
          "AcceptLicensingTerms": false,
          "LogPath": null,
          "Edition": null,
          "SuppressRestart": null
        }
      }
    }
  ],
  "messages": [],
  "hadErrors": false
}
```
<!-- markdownlint-enable MD013 -->

### Declarative Test-operation

<!-- markdownlint-disable MD013 -->
```powershell
dsc config test --file deploy-PBIRS.dsc.config.yaml --output-format json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```
<!-- markdownlint-enable MD013 -->

Outputs:

<!-- markdownlint-disable MD013 -->
```json
{
  "metadata": {
    "Microsoft.DSC": {
      "version": "3.2.0",
      "operation": "test",
      "executionType": "actual",
      "startDatetime": "2025-07-22T13:16:47.520018100+02:00",
      "endDatetime": "2025-07-22T13:16:52.568157200+02:00",
      "duration": "PT5.0481391S",
      "securityContext": "elevated"
    }
  },
  "results": [
    {
      "metadata": {
        "Microsoft.DSC": {
          "duration": "PT3.6179544S"
        }
      },
      "name": "Install PBIRS",
      "type": "SqlServerDsc/SqlRSSetup",
      "result": {
        "desiredState": {
          "InstanceName": "PBIRS",
          "Action": "Install",
          "AcceptLicensingTerms": true,
          "MediaPath": "C:\\Users\\user\\AppData\\Local\\Temp\\2\\PowerBIReportServer.exe",
          "Edition": "Developer"
        },
        "actualState": {
          "InDesiredState": true
        },
        "inDesiredState": true,
        "differingProperties": []
      }
    }
  ],
  "messages": [],
  "hadErrors": false
}
```
<!-- markdownlint-enable MD013 -->

### Declarative Set-operation

<!-- markdownlint-disable MD013 -->
```powershell
dsc config set --file deploy-PBIRS.dsc.config.yaml --output-format json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```
<!-- markdownlint-enable MD013 -->

Outputs:

<!-- markdownlint-disable MD013 -->
```json
{
  "metadata": {
    "Microsoft.DSC": {
      "version": "3.2.0",
      "operation": "set",
      "executionType": "actual",
      "startDatetime": "2025-07-22T13:20:53.908081800+02:00",
      "endDatetime": "2025-07-22T13:21:05.694351300+02:00",
      "duration": "PT11.7862695S",
      "securityContext": "elevated"
    }
  },
  "results": [
    {
      "metadata": {
        "Microsoft.DSC": {
          "duration": "PT10.3146941S"
        }
      },
      "name": "Install PBIRS",
      "type": "SqlServerDsc/SqlRSSetup",
      "result": {
        "beforeState": {
          "Action": "0",
          "EditionUpgrade": null,
          "InstanceName": "PBIRS",
          "InstallFolder": "C:\\Program Files\\Microsoft Power BI Report Server",
          "VersionUpgrade": null,
          "LogPath": null,
          "Timeout": 7200,
          "ForceRestart": null,
          "Edition": null,
          "MediaPath": null,
          "ProductKey": null,
          "AcceptLicensingTerms": false,
          "SuppressRestart": null
        },
        "afterState": {
          "Edition": null,
          "LogPath": null,
          "ForceRestart": null,
          "InstanceName": "PBIRS",
          "MediaPath": null,
          "SuppressRestart": null,
          "Action": "0",
          "ProductKey": null,
          "InstallFolder": "C:\\Program Files\\Microsoft Power BI Report Server",
          "AcceptLicensingTerms": false,
          "VersionUpgrade": null,
          "EditionUpgrade": null,
          "Timeout": 7200
        },
        "changedProperties": ["InstallFolder", "InstanceName"]
      }
    }
  ],
  "messages": [],
  "hadErrors": false
}
```
<!-- markdownlint-enable MD013 -->

## Pattern 3 – Winget Configuration

Windows Package Manager v1.11.400 or higher can **delegate configuration
application to DSC v3**. Ship a single YAML file and run `winget configure` –
perfect for **endpoint provisioning at scale**.

WinGet handles:

- Invoke the specified DSC resource
- Returning structured exit codes

WinGet does not handle:

- Installing DSC v3, it must be present on the system
- Resources for DSC v3 must be present on the system
- Does not elevate when DSC resources need it

### WinGet configuration document

The WinGet configuration document must be slightly different - it must currently
use the implicit syntax, a specific schema URI, plus have a property to tell
WinGet how to process the configuration file. This configuration file is also
compatible with DSC v3 directly.

Create WinGet Configuration file `deploy-PBIRS.winget.config.yaml`:

<!-- markdownlint-disable MD013 -->
```yaml
$schema: https://raw.githubusercontent.com/PowerShell/DSC/main/schemas/2023/08/config/document.json
metadata:
  winget:
    processor: dscv3
  owner: 'security.ops@contoso.com'
  name: 'Deploy Power BI Report Server'
  purpose: |
    Deploy Power BI Report Server on a target machine.
  Microsoft.DSC:
    securityContext: elevated
resources:
  - name: 'Install PBIRS'
    type: SqlServerDsc/SqlRSSetup
    properties:
      InstanceName: 'PBIRS'
      Action: 'Install'
      AcceptLicensingTerms: true
      MediaPath: '<path to media executable>'
      Edition: 'Developer'
```
<!-- markdownlint-enable MD013 -->

### Configure WinGet

To use DSC v3 with WinGet we have to enable an experimental setting.

<!-- markdownlint-disable MD013 -->
```sh
winget settings
```
<!-- markdownlint-enable MD013 -->

Open in any text editor and add `experimentalFeatures` as show here:

<!-- markdownlint-disable MD013 -->
```json
{
  "$schema": "https://aka.ms/winget-settings.schema.json",

  "experimentalFeatures": {
    "dsc3": true
  }
}
```
<!-- markdownlint-enable MD013 -->

### Apply with WinGet

You must run this in an elevated shell:

<!-- markdownlint-disable MD013 -->
```sh
winget configure --file deploy-PBIRS.winget.config.yaml --verbose-logs
```
<!-- markdownlint-enable MD013 -->

You will get an output similar to the one below, you need to accept this if you
want to continue. When you accept it you will be prompted for the UAC question.

<!-- markdownlint-disable MD013 -->
```text
SqlServerDsc/SqlRSSetup [Install PBIRS]
  This module contains commands and DSC resources for deployment and configuration of Microsoft SQL Server, SQL Server Reporting Services and Power BI Report Server.
  Settings:
    InstanceName: PBIRS
    Edition: Developer
    MediaPath: C:\Users\user\AppData\Local\Temp\2\PowerBIReportServer.exe
    AcceptLicensingTerms: true
    Action: Install
You are responsible for understanding the configuration settings you are choosing to execute. Microsoft is not responsible for the configuration file you have authored or imported. This configuration may change settings in Windows, install software, change software settings (including security settings), and accept user agreements to third-party packages and services on your behalf.  By running this configuration file, you acknowledge that you understand and agree to these resources and settings. Any applications installed are licensed to you by their owners. Microsoft is not responsible for, nor does it grant any licenses to, third-party packages or services.
Have you reviewed the configuration and would you like to proceed applying it to the system?
[Y] Yes  [N] No: y
SqlServerDsc/SqlRSSetup [Install PBIRS]
  Unit successfully applied.
Configuration successfully applied.
```
<!-- markdownlint-enable MD013 -->

Use `configure show` to display the details of the configuration.

<!-- markdownlint-disable MD013 -->
```sh
winget configure show --file deploy-PBIRS.winget.config.yaml --verbose-logs
```
<!-- markdownlint-enable MD013 -->

## Takeaways

- **DSC v3** gives you flexible invocation patterns – pick imperative for
  speed, declarative for compliance.
- **SqlRSSetup** remains unchanged – the adapter bridges classic modules into
  the new engine.

Happy automating – may your deployments always be idempotent!
