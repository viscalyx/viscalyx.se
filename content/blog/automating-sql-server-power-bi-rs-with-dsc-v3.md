---
title: 'Automating SQL Server Power BI Report Server with DSC v3 – Three Invocation Patterns for Seasoned Engineers'
date: '2025-07-20'
author: 'Johan Ljunggren'
excerpt: 'Explore three advanced patterns for automating SQL Server Power BI Report Server deployments using DSC v3: imperative, declarative, and Winget-based approaches.'
image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center'
imageAlt: 'Server racks filled with networking cables and glowing indicator lights in a data center.'
tags:
  [
    'SQL Server',
    'DSC',
    'BI Report Server',
    'PowerShell',
    'Automation',
    'DevOps',
  ]
category: 'PowerShell DSC'
readTime: '8 min read'
---

> **Audience:** infrastructure engineers comfortable with PowerShell, CI pipelines and automated SQL Server deployments.

## Scope

Demonstrate **SqlRSSetup** on DSC v3 when executed:

1. **Imperatively** – _direct_ `dsc resource set`
1. **Declaratively** – in a DSC v3 _configuration_
1. **Winget Configuration** – as part of a machine bootstrap with `winget configure`

## Baseline environment

| Component               | Minimum version | Notes                                                             |
| ----------------------- | --------------- | ----------------------------------------------------------------- |
| Windows Server          | 2025            | Operating system for deployment (only required to support WinGet) |
| Windows Package Manager | 1.11.400        | For WinGet scenario (requires Windows Server 2025)                |
| PowerShell              | 7.5.x           | Engine host                                                       |
| DSC v3                  | 3.2.0-preview.2 | Required for modern invocation patterns                           |
| SqlServer               | 22.3.0          | Dependent module for SqlServerDsc                                 |
| SqlServerDsc            | 17.1.x          | Contains **SqlRSSetup** resource                                  |
| Power BI Report Server  | 15.x            | Setup media need to be available by local or UNC path             |

### Install Windows Server 2025

There are a lot of guides how to install Windows Server, version 2025 are
no different to install than any previous versions.

### Update WinGet

We require WinGet 1.11.40, but Windows Server 2025 comes with an older version. Use the method [installing WinGet](https://github.com/microsoft/winget-cli?tab=readme-ov-file#installing-the-client) of your choice.

If you download the latest release from [winget-cli releases](https://github.com/microsoft/winget-cli/releases).
Make sure to also download the dependencies package as they might be needed to be installed to successfully install WinGet. I could not install one dependency but it turned out that wasn't needed for the WinGet install, that might not be true in your case.

### Install PowerShell

Windows Server 2025 does not come with PowerShell (only _Windows PowerShell_) so we need to install it:

```sh
winget install Microsoft.PowerShell
```

> [!TIP]
> Suggest making Windows Terminal default in Windows Server 2025 and then make PowerShell the default in Windows Terminal.

### Install DSC v3

For instructions on installing DSC v3, see the "Install DSC executable" section in [DemoDscClass: Your First Class-based DSC v3 Resource](/blog/demodscclass-your-first-class-based-dsc-v3-resource#install-dsc-executable).

### Install SqlServer

```powershell
Install-PSResource SqlServer -Version 22.3.0 -TrustRepository
```

> [!IMPORTANT]
> The dependent module should not be required for this guide, but due to a
> bug in DSC v3 we need to install it.

Without the dependent module SqlServerDsc outputs a warning message:

```
WARNING: Failed to find a dependent module. Unable to run SQL Server commands or use SQL Server types. Please install one of the preferred SMO modules or the SQLPS module, then try to import SqlServerDsc again.
```

That warning message is normally not an issue, but will fail DSC v3. To avoid
DSC v3 to fail and not to see the warning message, install the correct dependent
PowerShell module version that works for your environment; _SQLPS_, _SqlServer_, or _dbatools_.

### Install SqlServerDsc

```powershell
Install-PSResource SqlServerDsc -Version 17.1.0 -TrustRepository
```

### Download PowerBI Report Server

```powershell
$url = 'https://download.microsoft.com/download/2/7/3/2739a88a-4769-4700-8748-1a01ddf60974/PowerBIReportServer.exe'
$mediaFilePath = [System.IO.Path]::GetTempPath()
Save-SqlDscSqlServerMediaFile -SkipExecution -Url $url -FileName 'PowerBIReportServer.exe' -DestinationPath $mediaFilePath -Force -ErrorAction 'Stop'
$mediaExecutableFile = $mediaFilePath | Join-Path -ChildPath 'PowerBIReportServer.exe'
$mediaExecutableFile
```

## Pattern 1 – One‑shot imperative call

When you need a **quick, idempotent task** (e.g. build server image) without maintaining configuration files.

```powershell
$desiredParameters = @{
    InstanceName = 'PBIRS'
    Action       = 'Install'
    AcceptLicensingTerms = $true
    MediaPath   = $mediaExecutableFile
    Edition = 'Developer'
} | ConvertTo-Json -Compress
```

> We don't need to use `SuppressRestart` here because DSC v3 does not yet support restarting of a target machine. Neither would `ForceRestart` work either. When a restart is required either forcefully or by exit code, the command [Set-DscMachineRebootRequired](https://github.com/dsccommunity/DscResource.Common/wiki/Set%E2%80%91DscMachineRebootRequired) is called. The logic the command uses only works with PSDSC and LCM.

### Imperative Get-operation

Running the Get-operation we can verify that the current state currently missing the Power BI Report Server instance.

```powershell
$ dsc resource get --resource SqlServerDsc/SqlRSSetup --output-format json --input $desiredParameters | ConvertFrom-Json | fl

actualState : @{ProductKey=; Timeout=7200; SuppressRestart=; EditionUpgrade=; LogPath=; InstanceName=; AcceptLicensingTerms=False; InstallFolder=; ForceRestart=; Action=0; VersionUpgrade=; Edition=; MediaPath=}
```

### Imperative Test-operation

Running the Test-operation we can verify that it report that our desired state is not in compliance the Power BI Report Server instance is missing.

```powershell
$ dsc resource test --resource SqlServerDsc/SqlRSSetup --output-format json --input $desiredParameters | ConvertFrom-Json | fl

desiredState        : @{AcceptLicensingTerms=True; InstanceName=PBIRS; Edition=Developer; MediaPath=C:\Users\user\AppData\Local\Temp\2\PowerBIReportServer.exe; Action=Install}
actualState         : @{InDesiredState=False}
inDesiredState      : False
differingProperties : {AcceptLicensingTerms, InstanceName, Edition, MediaPath…}
```

### Imperative Set-operation

Running the Set-operation will make sure our desired state is configured.

> [!IMPORTANT]
> Contrary to the Get- and Test-operation the Set-operation must run in an elevated PowerShell prompt.

```powershell
$desiredParameters = @{
    InstanceName = 'PBIRS'
    Action       = 'Install'
    AcceptLicensingTerms = $true
    MediaPath   = 'C:\Users\sqladmin\AppData\Local\Temp\2\PowerBIReportServer.exe' #'path to media executable'
    Edition = 'Developer'
} | ConvertTo-Json -Compress
```

```powershell
$ dsc resource set --resource SqlServerDsc/SqlRSSetup --output-format json --input $desiredParameters | ConvertFrom-Json | fl

beforeState       : @{InstallFolder=; Action=0; Timeout=7200; ForceRestart=; VersionUpgrade=; ProductKey=; SuppressRestart=; LogPath=; AcceptLicensingTerms=False; InstanceName=; EditionUpgrade=; MediaPath=; Edition=}
afterState        : @{ProductKey=; AcceptLicensingTerms=False; MediaPath=; ForceRestart=; VersionUpgrade=; Action=0; InstanceName=PBIRS; SuppressRestart=; LogPath=; EditionUpgrade=; Timeout=7200; Edition=; InstallFolder=C:\Program Files\Microsoft Power BI Report Server}
changedProperties : {InstallFolder, InstanceName}
```

> [!NOTE]
> Running the Set-operation will take several minutes and no output will be shown until it is complete.

We can re-run the Set-operation again, this time it will be quicker as the desired state is already achived so it don't do anything, not until we run it and the resource sees the instance missing again (if we removed it). We can see that this time DSC did not chnage any properties.

```powershell
$ dsc resource set --resource SqlServerDsc/SqlRSSetup --output-format json --input $desiredParameters | ConvertFrom-Json | fl

beforeState       : @{ForceRestart=; AcceptLicensingTerms=False; Edition=; Timeout=7200; VersionUpgrade=; EditionUpgrade=; ProductKey=; InstanceName=PBIRS; SuppressRestart=; Action=0; MediaPath=; LogPath=; InstallFolder=C:\Program Files\Microsoft Power BI Report Server}
afterState        : @{InstallFolder=C:\Program Files\Microsoft Power BI Report Server; ProductKey=; LogPath=; Action=0;SuppressRestart=; MediaPath=; VersionUpgrade=; ForceRestart=; Edition=; EditionUpgrade=; Timeout=7200; AcceptLicensingTerms=False; InstanceName=PBIRS}
changedProperties :
```

## Pattern 2 – Declarative configuration

Ideal for **repeatable, documented deployments** when multiple resources must coordinate (SQL Engine + RS Setup + firewall, etc.).

### DSC v3 configuration document

Author a YAML document (`deploy-PBIRS.dsc.config.yaml`) to define the desired state:

> Configuration documents can be in both YAML or JSON. At the time of this writing Microsoft recommends drafting configuration documents in YAML.

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
    type: Microsoft.DSC/PowerShell
    properties:
      resources:
        - name: 'Install PBIRS'
          type: 'SqlServerDsc/SqlRSSetup'
          properties:
            InstanceName: 'PBIRS'
            Action: 'Install'
            AcceptLicensingTerms: true
            MediaPath: 'C:\Users\sqladmin\AppData\Local\Temp\2\PowerBIReportServer.exe' #'path to media executable'
            Edition: 'Developer'
```

### Declarative Get-operation

```powershell
$ dsc config get --file deploy-PBIRS.dsc.config.yaml --output-format json | ConvertFrom-Json | ConvertTo-Json -Depth 10

{
  "metadata": {
    "Microsoft.DSC": {
      "version": "3.1.0",
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
      "type": "Microsoft.DSC/PowerShell",
      "result": {
        "actualState": {
          "result": [
            {
              "name": "Install PBIRS",
              "type": "SqlServerDsc/SqlRSSetup",
              "properties": {
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
          ]
        }
      }
    }
  ],
  "messages": [],
  "hadErrors": false
}
```

### Declarative Test-operation

```powershell
$ dsc config test --file deploy-PBIRS.dsc.config.yaml --output-format json | ConvertFrom-Json | ConvertTo-Json -Depth 10

{
  "metadata": {
    "Microsoft.DSC": {
      "version": "3.1.0",
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
      "type": "Microsoft.DSC/PowerShell",
      "result": {
        "desiredState": {
          "resources": [
            {
              "name": "Install PBIRS",
              "type": "SqlServerDsc/SqlRSSetup",
              "properties": {
                "InstanceName": "PBIRS",
                "Action": "Install",
                "AcceptLicensingTerms": true,
                "MediaPath": "C:\\Users\\sqladmin\\AppData\\Local\\Temp\\2\\PowerBIReportServer.exe",
                "Edition": "Developer"
              }
            }
          ],
          "metadata": {
            "Microsoft.DSC": {
              "context": "configuration"
            }
          }
        },
        "actualState": {
          "_inDesiredState": true,
          "result": [
            {
              "name": "Install PBIRS",
              "type": "SqlServerDsc/SqlRSSetup",
              "properties": {
                "InDesiredState": true
              }
            }
          ]
        },
        "inDesiredState": true,
        "differingProperties": [
          "resources",
          "metadata"
        ]
      }
    }
  ],
  "messages": [],
  "hadErrors": false
}
```

### Declarative Set-operation

```powershell
$ dsc config set --file deploy-PBIRS.dsc.config.yaml --output-format json | ConvertFrom-Json | ConvertTo-Json -Depth 10

{
  "metadata": {
    "Microsoft.DSC": {
      "version": "3.1.0",
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
      "type": "Microsoft.DSC/PowerShell",
      "result": {
        "beforeState": {
          "resources": [
            {
              "name": "Install PBIRS",
              "type": "SqlServerDsc/SqlRSSetup",
              "properties": {
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
              }
            }
          ]
        },
        "afterState": {
          "result": [
            {
              "name": "Install PBIRS",
              "type": "SqlServerDsc/SqlRSSetup",
              "properties": {
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
              }
            }
          ]
        },
        "changedProperties": [
          "result"
        ]
      }
    }
  ],
  "messages": [],
  "hadErrors": false
}
```

## Pattern 3 – Winget Configuration

Windows Package Manager v1.11 or higher can **delegate configuration application to DSC v3**.
Ship a single YAML file and run `winget configure` – perfect for **endpoint provisioning at scale**.

WinGet handles:

- Downloading DSC v3 if missing
- Invoke the specified DSC resource
- Returning structured exit codes

WinGet does not handle:

- Installing DSC v3, it must be present on the system
- Resources for DSC v3 must be present on the system
- Does not elevate when DSC resources need it

### WinGet configuration document

The WinGet configuration document must be slightly different - it must currently use the implicit syntax, a specific schema URI, plus have a property to tell WinGet how to process the configuration file. This configuration file is also compatible with DSC v3 directly.

Create WinGet Configuration file `deploy-PBIRS.winget.config.yaml`:

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
      MediaPath: 'C:\Users\sqladmin\AppData\Local\Temp\2\PowerBIReportServer.exe' #'path to media executable'
      Edition: 'Developer'
```

### Configure WinGet

To use DSC v3 with WinGet we have to enable an experimental setting.

```powershell
winget settings
```

Open in any text editor and add `experimentalFeatures` as show here:

```json
{
  "$schema": "https://aka.ms/winget-settings.schema.json",

  "experimentalFeatures": {
    "dsc3": true
  }
}
```

### Apply with WinGet

You must run this in an elevated shell:

```powershell
PS> winget configure --file deploy-PBIRS.winget.config.yaml --verbose-logs
```

You will get an output similar to the one below, you need to accept this if you want to continue. When you accept it you will be prompted for the UAC question.

```text
SqlServerDsc/SqlRSSetup [Install PBIRS]
  This module contains commands and DSC resources for deployment and configuration of Microsoft SQL Server, SQL Server Reporting Services and Power BI Report Server.
  Settings:
    InstanceName: PBIRS
    Edition: Developer
    MediaPath: C:\Users\sqladmin\AppData\Local\Temp\2\PowerBIReportServer.exe
    AcceptLicensingTerms: true
    Action: Install
You are responsible for understanding the configuration settings you are choosing to execute. Microsoft is not responsible for the configuration file you have authored or imported. This configuration may change settings in Windows, install software, change software settings (including security settings), and accept user agreements to third-party packages and services on your behalf.  By running this configuration file, you acknowledge that you understand and agree to these resources and settings. Any applications installed are licensed to you by their owners. Microsoft is not responsible for, nor does it grant any licenses to, third-party packages or services.
Have you reviewed the configuration and would you like to proceed applying it to the system?
[Y] Yes  [N] No: y
SqlServerDsc/SqlRSSetup [Install PBIRS]
  Unit successfully applied.
Configuration successfully applied.
```

Use `configure show` to display the details of the configuration.

```powershell
PS> winget configure show --file deploy-PBIRS.winget.config.yaml --verbose-logs
```

## Takeaways

- **DSC v3** gives you flexible invocation patterns – pick imperative for speed, declarative for compliance.
- **SqlRSSetup** remains unchanged – the adapter bridges classic modules into the new engine.

Happy automating – may your deployments always be idempotent!
