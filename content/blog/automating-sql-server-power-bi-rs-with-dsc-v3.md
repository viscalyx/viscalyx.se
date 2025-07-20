---
title: 'Automating SQL Server Power BI Report Server with DSC v3 – Three Invocation Patterns for Seasoned Engineers'
date: '2025-07-20'
author: 'Johan Ljunggren'
excerpt: 'Explore three advanced patterns for automating SQL Server Power BI Report Server deployments using DSC v3: imperative, declarative, and Winget-based approaches.'
image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center'
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

| Component               | Minimum version  | Notes                                                             |
| ----------------------- | ---------------- | ----------------------------------------------------------------- |
| Windows Server          | 2025             | Operating system for deployment (only required to support WinGet) |
| PowerShell              | 7.5.x            | Engine host                                                       |
| DSC v3                  | v3.2.0-preview.2 | Required for modern invocation patterns                           |
| SqlServerDsc            | 17.1.x           | Contains **SqlRSSetup** resource                                  |
| Power BI Report Server  | v15.x            | Setup media need to be available by local or UNC path             |
| Windows Package Manager | 1.11             | For WinGet scenario (requires Windows Server 2025)                |

> [!NOTE]
> For instructions on installing DSC v3, see the "Install DSC executable" section in [DemoDscClass: Your First Class-based DSC v3 Resource](/blog/demodscclass-your-first-class-based-dsc-v3-resource#install-dsc-executable).

### Install SqlServerDsc

```powershell
Install-PSResource SqlServerDsc -RequiredVersion 17.1.0 -Force
```

### Download PowerBI Report Server

```powershell
$url = 'https://download.microsoft.com/download/2/7/3/2739a88a-4769-4700-8748-1a01ddf60974/PowerBIReportServer.exe'
$script:mediaFile = Get-TemporaryFolder
Save-SqlDscSqlServerMediaFile -SkipExecution -Url $url -FileName 'PowerBIReportServer.exe' -DestinationPath $script:mediaFile -Force -ErrorAction 'Stop'
```

## Pattern 1 – One‑shot imperative call

When you need a **quick, idempotent task** (e.g. build server image) without maintaining configuration files.

```powershell
$desiredParameters = @{
    Action       = 'Install'
    InstanceName = 'PBIRS'
    SourcePath   = 'C:\media\PowerBIReportServer.exe'
} | ConvertTo-Json -Compress

dsc resource set --resource SqlServerDsc/SqlRSSetup --output-format json --input $desiredParameters | ConvertFrom-Json
```

_Exit code 0_ = success. Rerunning the command is safe.

## Pattern 2 – Declarative configuration

Ideal for **repeatable, documented deployments** when multiple resources must coordinate (SQL Engine + RS Setup + firewall, etc.).

### DSC v3 JSON configuration

Author a JSON document (`deploy-SSRS.json`) to define the desired state:

```json
{
  "dscVersion": 3,
  "resources": [
    {
      "name": "ReportingServices",
      "type": "Microsoft.Windows/WindowsPowerShell#SqlRSSetup",
      "moduleName": "SqlServerDsc",
      "properties": {
        "InstanceName": "SSRS",
        "Features": "RS",
        "SourcePath": "C:\\ISO\\SQL2022",
        "SQLSysAdminAccounts": ["CONTOSO\\svc_sql"],
        "Action": "Install"
      }
    }
  ]
}
```

### Compile & apply

```bash
dsc config compile ./deploy-SSRS.json -o ./ssrsbuild
dsc config apply ./ssrsbuild
```

## Pattern 3 – Winget Configuration

Windows Package Manager 1.4+ can **delegate configuration application to DSC v3**. Ship a single YAML file and run `winget configure` – perfect for **endpoint provisioning at scale**.

### Author `SSRS.yaml`

$schema: https://aka.ms/winget-packages.schema.2.0.json

```yaml
# SSRS.yaml
$schema: https://aka.ms/winget-packages.schema.2.0.json

# In‑place DSC v3 document embedded in Winget spec
configuration:
  dscVersion: 3
  resources:
    - name: ReportingServices
      type: Microsoft.Windows/WindowsPowerShell#SqlRSSetup
      properties:
        InstanceName: SSRS
        Features: RS
        SourcePath: C:\ISO\SQL2022
        SQLSysAdminAccounts:
          - CONTOSO\svc_sql
        Action: Install
```

### Apply with winget

```powershell
winget configure --file ssrs.yaml --accept-package-agreements \
                 --verbose-logs
```

Winget handles:

- Downloading DSC v3 if missing.
- Running `dsc config apply` behind the scenes.
- Returning structured exit codes for MDM or Intune.

### Good to know

- Telemetry and state land under `%LOCALAPPDATA%\Microsoft\Winget\Configuration\Logs`.
- Use these logs to send failures to a SIEM.

## Takeaways

- **DSC v3** gives you flexible invocation patterns – pick imperative for speed, declarative for compliance.
- **SqlRSSetup** remains unchanged – the adapter bridges classic modules into the new engine.

Happy automating – may your SSRS deployments always be idempotent!
