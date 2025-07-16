---
title: 'DemoDscClass: Your First Class‑Based DSC v3 Resource'
date: '2025-07-13'
author: 'Johan Ljunggren'
excerpt: 'A step-by-step beginner’s guide to designing, coding, testing, and running your first class-based DSC v3 resource in PowerShell.'
image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop&crop=center'
tags: ['PowerShell', 'DSC', 'Infrastructure as Code', 'Automation', 'DevOps']
category: 'PowerShell'
readTime: '7 min read'
---

> **Objective:** Show a complete beginner how to design, code, test, and run a **class‑based DSC v3 resource** called **DemoDscClass**.

## What is a DSC resource?

A _DSC resource_ is a building‑block that tells the engine **how** to reach – and stay in – a desired state. Think of it as a PowerShell class with three lifecycle methods:

| Method       | When used                                     | What it returns                                   |
| ------------ | --------------------------------------------- | ------------------------------------------------- |
| **`Get()`**  | Returns the current state                     | A hashtable describing _current_ state            |
| **`Test()`** | Checks if the state matches the desired state | `$true` if node already matches the desired state |
| **`Set()`**  | Applies the desired state                     | Nothing – it just fixes things                    |

## Why write a **class‑based** resource?

Class-based DSC resources offer a modern, object-oriented approach to configuration management in PowerShell. By writing your resource as a class, you gain several advantages:

- **Broad Compatibility:** Your resource runs seamlessly on both the new **DSC v3** engine (the next-generation, cross-platform Desired State Configuration engine) _and_ the legacy **PSDSC** engine. This means you can support both modern and existing environments without maintaining separate codebases, ensuring backward compatibility for organizations in transition.
- **Cleaner Code & Reusability:** Classes allow you to encapsulate logic, properties, and methods in a structured way, making your code easier to read, maintain, and extend. You can leverage inheritance and composition for more advanced scenarios.

> [!NOTE]
> The engine ships with adapters that load class‑based resources even when they target the older v2 runtime.

### Are class-based resources the future of DSC?

While class-based resources are currently the recommended pattern for PowerShell DSC resource authoring, DSC v3 has broader goals and is evolving to support multiple languages and resource types—not just PowerShell classes. For example, you can author resources in Go, C#, and other languages (see the [DSC v3 documentation](https://powershell.github.io/DSC-Samples/languages/go/first-resource/)). Class-based resources remain well-supported, but may not be the only or primary model in the future.

For example, if your organization is migrating from Windows-only infrastructure to a mix of Windows and Linux, or adopting newer versions of PowerShell, class-based resources ensure your automation investments remain valid and portable—regardless of whether you are running the new DSC v3 engine or the older PSDSC engine.

## Project structure (minimal)

```plaintext
DemoDscClass\
├─ DemoDscClass.psd1    # Manifest
└─ DemoDscClass.psm1    # Module with the class inside
```

### Create a module manifest

```powershell
$manifestParams = @{
    Path                  = '.\DemoDscClass.psd1'
    RootModule            = 'DemoDscClass.psm1'
    DscResourcesToExport  = 'DemoDscClass'
    ModuleVersion         = '0.0.1'
    CompatiblePSEditions  = @('Desktop', 'Core')
    PowerShellVersion     = '5.1'
}

New-ModuleManifest @manifestParams
```

## Author the class

Create _DemoDscClass.psm1_:

```powershell
[DscResource()]                   # Marks this class as a DSC resource for the engine
class DemoDscClass {
    [DscProperty(Key)]            # Declares a key property (must uniquely identify the resource instance), at least one key property is required for all DSC resources
    [System.String] $Key

    DemoDscClass()                # Constructor (optional, can be used for initialization)

    [DemoDscClass] Get() {        # Returns the current state as a hashtable
        Write-Verbose -Message 'Get called'

        $currentState = @{        # Set properties to the current state
          Key = $this.Key
        }

        return $currentState      # Output current state
    }

    [System.Boolean] Test() {     # Checks if the current state matches the desired state
        Write-Verbose -Message 'Test called – always returns $false to demo Set()'

        return $false             # Always returns false to force Set() for demo
    }

    [void] Set() {                # Applies the desired state (no-op in this demo)
        Write-Verbose 'Set called – no changes are applied for demo'
    }
}
```

> [!IMPORTANT]
> Any initialization logic in the constructor must not fail (throw an error), as this would prevent the PowerShell from creating an instance of the class resource.

### Code Walk‑through

1. **`[DscResource()]`** – This attribute marks the PowerShell class as a DSC resource, making it discoverable and loadable by the DSC engine. Without this, the engine will ignore the class entirely.
2. **`[DscProperty(Key)]`** – This attribute designates a property as a _key_ property, which is required for every DSC resource. The key property (or properties) uniquely identifies each instance of the resource, allowing DSC to track and manage multiple resources of the same type. You can have additional properties, but at least one must be marked as `Key`.
3. **`Get()`** – This method is called by the DSC engine to retrieve the current state of the resource. It should return either a plain hashtable (the most common pattern) or an instance of the DSC resource class itself — both are accepted by the engine. The returned object should describe the current values of all properties. DSC uses this information to compare the actual state with the desired state, enabling it to determine if changes are needed.
4. **`Test()`** – This method determines whether the current state matches the desired state specified in the configuration. It should return `$true` if no changes are needed (i.e., the system is already in the desired state), or `$false` if `Set()` needs to be called to bring the system into compliance. This is where you implement your logic to check for drift or configuration differences.
5. **`Set()`** – This method is responsible for applying the desired state. If `Test()` returns `$false`, then the method `Set()` should be called to make the necessary changes. In a real-world resource, this is where you would implement the code to enforce the configuration (e.g., create a file, set a registry key, etc.). In this demo, `Set()` is a no-op for simplicity, but in production resources, it should contain your remediation logic.

## Smoke‑test locally with `dsc.exe`

Install the DSCv3 engine:

```powershell
Install-PSResource PSDSC -TrustRepository -Quiet
Install-DscExe -IncludePrerelease -Force
$env:PATH += ';' + (Join-Path $env:LOCALAPPDATA 'dsc')
```

> [!NOTE]
> This installs the latest full or preview version. Remove `-IncludePrerelease` to intstall latest full version.

### List resources

```powershell
dsc resource list --adapter Microsoft.Windows/WindowsPowerShell
```

> [!NOTE]
> **Note on Adapters:**
> In DSC v3, an adapter acts as a bridge between the DSC engine and different resource types or execution environments. For example, the Microsoft.Windows/WindowsPowerShell adapter allows the engine to discover and run traditional PowerShell-based DSC resources—even on the new cross-platform DSC engine. This ensures compatibility with existing resources and enables a smooth transition to newer DSC models, letting you leverage both legacy and modern configurations within the same environment.

### Invoke each lifecycle method

```powershell
$desiredParameters = @{ Key = 'Demo' } | ConvertTo-Json -Compress

dsc resource get --resource DemoDscClass/DemoDscClass --output-format json --input $desiredParameters

dsc resource test --resource DemoDscClass/DemoDscClass --output-format json --input $desiredParameters

dsc resource set --resource DemoDscClass/DemoDscClass --output-format json --input $desiredParameters
```

> [!TIP]
> To see tracelogs add the argument `--trace-level trace`, e.g. `dsc --trace-level trace resource get`. The different trace levels are: `error`, `warning` (default), `info`, `debug`, `trace`.

### Invoke using configuration

#### Syntax for instance definition

> [!TIP]
> More information about instance definition syntax and resource configuration can be found here: [Microsoft.Windows/WindowsPowerShell DSC Resource Reference](https://learn.microsoft.com/sv-se/powershell/dsc/reference/resources/microsoft/windows/windowspowershell).
>
> For details on the configuration document schema and structure, see: [DSC Configuration Document Schema Reference](https://learn.microsoft.com/sv-se/powershell/dsc/reference/schemas/config/document).

Create _demo-config.yaml_:

```yaml
$schema: https://raw.githubusercontent.com/PowerShell/DSC/main/schemas/2024/04/config/document.json
resources:
  - name: Demo Dsc Class
    type: Microsoft.Windows/WindowsPowerShell
    properties:
      resources:
        - name: Demo Dsc Class 1
          type: DemoDscClass/DemoDscClass
          properties:
            Key: Demo
```

```powershell
dsc config invoke --configuration demo-config.yaml --output-format json
```

#### Implicit custom syntax for instance definition

Create _demo-implicit-config.yaml_:

```yaml
$schema: https://raw.githubusercontent.com/PowerShell/DSC/main/schemas/2024/04/config/document.json
resources:
  - name: Demo Dsc Class 1
    type: DemoDscClass/DemoDscClass
    properties:
      Key: Demo
```

To apply this configuration with the DSC v3 engine, save it as `demo-implicit-config.yaml` and run:

```powershell
dsc config invoke --configuration demo-implicit-config.yaml --output-format json
```

## Write a quick Pester test

Create _DemoDscClass.tests.ps1_:

```powershell
BeforeAll {
    $modulePath = $PSScriptRoot

    Import-Module "$modulePath/DemoDscClass.psd1" -Force
}

Describe 'DemoDscClass' {
    It 'Returns the same Key in Get()' {
        $desiredParameters = @{ Key = 'X' } | ConvertTo-Json -Compress
        $out = dsc resource get --resource DemoDscClass/DemoDscClass --output-format json --input $desiredParameters
        $out.Key | Should -Be 'X'
    }
}
```

Run:

```powershell
Invoke-Pester -CI -Output Detailed
```

> [!IMPORTANT]
> **If you change the class definition, you must restart your PowerShell session.** PowerShell cannot reload or update a class that has already been loaded in the current session. Any changes to the class (such as adding properties or logic in methods) will not take effect until you start a new session. For automated testing or development, see [Invoke‑PesterJob](https://github.com/viscalyx/Viscalyx.Common/wiki/Invoke%E2%80%91PesterJob) for a helper that can run tests in a fresh session automatically.

## Package & publish (optional)

To share your DSC resource with others or make it available for installation via PowerShell, you can publish your module to the PowerShell Gallery. The command below packages your module and uploads it to the PSGallery repository. Replace `<PAT>` with your personal API key from the PowerShell Gallery website.

```powershell
Publish-PSResource -Path .\ -Repository PSGallery -ApiKey <PAT>
```

## Next steps

- Add **non‑key** properties and additional logic in the methods. See [Writing a custom DSC resource with PowerShell classes](https://learn.microsoft.com/en-us/powershell/dsc/resources/authoringresourceclass?view=dsc-1.1) for more information.
- Tie the resource into a real **DSC v3 configuration** once it does something useful.

Congratulations – you have built, tested and executed your very first class‑based DSC v3 resource!
