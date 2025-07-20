---
title: 'DemoDscClass: Your First Class‑Based DSC v3 Resource'
date: '2025-07-13'
author: 'Johan Ljunggren'
excerpt: 'A step-by-step beginner’s guide to designing, coding, testing, and running your first class-based DSC v3 resource in PowerShell.'
image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop&crop=center'
imageAlt: 'Top-down view of a busy workspace with multiple laptops, smartphones, notebooks, and drinks, surrounded by people working and collaborating.'
tags: ['PowerShell', 'DSC', 'Infrastructure as Code', 'Automation', 'DevOps']
category: 'PowerShell'
readTime: '7 min read'
---

> **Objective:** Show a complete beginner how to design, code, test, and run a **class‑based DSC v3 resource** called **DemoDscClass**. It is recommended that cross-platform PowerShell is used throughout this guide.

## What is a DSC resource?

A _DSC resource_ is a building-block that tells the engine **how** to reach – and stay in – a desired state. Think of it as a PowerShell class with four lifecycle methods:

| Method         | When used                                     | What it returns                                                            |
| -------------- | --------------------------------------------- | -------------------------------------------------------------------------- |
| **`Get()`**    | Returns the current state                     | A hashtable describing _current_ state                                     |
| **`Test()`**   | Checks if the state matches the desired state | `$true` if node already matches the desired state                          |
| **`Set()`**    | Applies the desired state                     | Nothing – it just fixes things                                             |
| **`Export()`** | Exports the current configuration state       | An array of resource class instances representing the configured resources |

## Why write a class‑based resource?

Class-based DSC resources offer a modern, object-oriented approach to configuration management in PowerShell. By writing your resource as a class, you gain several advantages:

- **Broad Compatibility:** Your resource runs seamlessly on both the new **DSC v3** engine (the next-generation, cross-platform Desired State Configuration engine) _and_ the legacy **PSDSC** engine. This means you can support both modern and existing environments without maintaining separate codebases, ensuring backward compatibility for organizations in transition.
- **Cleaner Code & Reusability:** Classes allow you to encapsulate logic, properties, and methods in a structured way, making your code easier to read, maintain, and extend. You can leverage inheritance and composition for more advanced scenarios.
- **Cross-Platform Awareness:** To make your resource work on Windows, Linux, or macOS, write simple checks in your `Get()`, `Test()`, and `Set()` methods that detect which operating system you’re on and run the right commands or file paths. This ensures your resource behaves correctly on all platforms.

> [!NOTE]
> The engine ships with adapters that load class‑based resources even when they target the older v2 runtime.

### Are class-based resources the future of DSC?

While class-based resources are currently the recommended pattern for PowerShell DSC resource authoring, DSC v3 has broader goals and is evolving to support multiple languages and resource types—not just PowerShell classes. For example, you can author resources in Go, C#, Python and other languages (see the [DSC v3 documentation](https://powershell.github.io/DSC-Samples/languages/go/first-resource/)). Class-based resources remain well-supported, but may not be the only or primary model in the future.

For example, if your organization is migrating from Windows-only infrastructure to a mix of Windows and Linux, or adopting newer versions of PowerShell, class-based resources ensure your automation investments remain valid and portable—regardless of whether you are running the new DSC v3 engine or the older PSDSC engine.

## Project structure (minimal)

```plaintext
DemoDscClass\
├─ DemoDscClass.psd1    # Manifest
└─ DemoDscClass.psm1    # Module with the class inside
```

> [!IMPORTANT]
> The module manifest name _must_ be named the same as project folder name (the module name), e.g. _DemoDscClass_.

<!-- Cross-platform setup instructions -->

### Create the project folder (cross-platform)

You can use _Command Prompt_ (Windows), _Windows PowerShell_ (Windows), _PowerShell_ (Windows, macOS, or Linux) or any POSIX shell to set up the folder structure:

```bash
mkdir DemoDscClass
cd DemoDscClass
```

## Create a module manifest

You can use _Windows PowerShell_ (Windows) or _PowerShell_ (Windows, macOS, or Linux) to create the module manifest:

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

You could also use any text editor to create the file _DemoDscClass.psd1_ manually:

```powershell
@{
    RootModule = 'DemoDscClass.psm1'
    ModuleVersion = '0.0.1'
    CompatiblePSEditions = 'Desktop', 'Core'
    GUID = '03ac4e95-e504-468d-add4-f099e2368239'
    Author = 'username'
    CompanyName = 'Unknown'
    Copyright = '(c) developer. All rights reserved.'
    PowerShellVersion = '5.1'
    FunctionsToExport = '*'
    CmdletsToExport = '*'
    VariablesToExport = '*'
    AliasesToExport = '*'
    DscResourcesToExport = 'DemoDscClass'
    PrivateData = @{
        PSData = @{
        }
    }
}
```

> [!NOTE]
> There are more properties available and best practices for setting properties
> in the module manifest than shown here, but this is the same properties and their
> values set by the command `New-ModuleManifest` and they are the minimum properties
> needed. Use the command `New-ModuleManifest` to see available properties or read
> [about_Module_Manifest](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_module_manifests).

## Author the class

Create _DemoDscClass.psm1_ using any text editor:

```powershell
[DscResource()]                   # Marks this class as a DSC resource for the engine
class DemoDscClass {
    [DscProperty(Key)]            # Declares a key property (must uniquely identify the resource instance), at least one key property is required for all DSC resources
    [System.String] $Key

    [DscProperty()]               # Declares an optional property
    [System.String] $OptionalProperty

    DemoDscClass() {              # Constructor (optional, can be used for initialization)
      # init logic here
    }

    [DemoDscClass] Get() {        # Returns the current state as a hashtable (DSC accepts either a class instance or a hashtable)
        Write-Verbose -Message 'Get called'

        $currentState = @{        # Set properties to the current state
          Key = $this.Key
        }

        return $currentState      # Output current state
    }

    [System.Boolean] Test() {     # Checks if the current state matches the desired state
        Write-Verbose -Message 'Test called - always returns $false to demo Set()'

        return $false             # Always returns false to force Set() for demo
    }

    [void] Set() {                # Applies the desired state (no-op in this demo)
        Write-Verbose -Message 'Set called - no changes are applied for demo'
    }

    static [DemoDscClass[]] Export() {    # Exports the configuration state for DSC v3
        Write-Verbose -Message 'Export called - demo returns no instances'

        $resultList = [System.Collections.Generic.List[DemoDscClass]]::new()

        # In a real resource, return an array of actual resource instances
        1..3 | ForEach-Object -Process {
            $obj = New-Object DemoDscClass
            $obj.Key = 'Demo{0}' -f $_
            $obj.OptionalProperty = 'Value of OptionalProperty for Demo{0}' -f $_

            $resultList.Add($obj)
        }

        return $resultList.ToArray()
    }
}
```

### Code Walk‑through

1. **`[DscResource()]`** – This attribute marks the PowerShell class as a DSC resource, making it discoverable and loadable by the DSC engine. Without this, the engine will ignore the class entirely.
1. **`[DscProperty(Key)]`** – This attribute designates a property as a _key_ property, which is required for every DSC resource. The key property (or properties) uniquely identifies each instance of the resource, allowing DSC to track and manage multiple resources of the same type. You can have additional properties, but at least one must be marked as `Key`. Beside key properties you can have optional, mandatory and read-only properties, read more in [Class-based DSC Resource properties](https://learn.microsoft.com/en-us/powershell/dsc/concepts/class-based-resources?view=dsc-2.0#class-based-dsc-resource-properties).
1. **`DemoDscClass()`** - This is the class constructor. A constructor is a special method in a class that runs automatically when you create a new object from that class. Its main job is to set up the initial state of the object—like assigning default values to properties or running setup code—so your object is ready to use right away. Think of it as the instructions for building and preparing your object when you first make it.
1. **`Get()`** – This method is called by the DSC engine to retrieve the current state of the resource instance. It should return either a plain hashtable (the most common pattern) or an instance of the DSC resource class itself — both are accepted by the engine. The returned object should describe the current values of all properties managed by the resource.
1. **`Test()`** – This method determines whether the current state matches the desired state specified in the configuration. It should return `$true` if no changes are needed (i.e., the system is already in the desired state), or `$false` if `Set()` needs to be called to bring the system into compliance. This is where you implement your logic to check for drift or configuration differences.
1. **`Set()`** – This method is responsible for applying the desired state. If `Test()` returns `$false`, then the method `Set()` should be called to make the necessary changes. In a production resource, this is where you would implement the code to enforce the configuration (e.g., create a file, set a registry key, etc.), it should contain your remediation logic. When calling set operation from the DSC executable it will also call `Get()`, so any error in `Get()` could potentially make set operation fail. In this demo, `Set()` is a no-op for simplicity.
1. **`Export()`** – This static method is used by DSC v3 to export the current configuration state. It should return an array of resource class instances representing existing resource instances, allowing DSC to retrieve a complete snapshot of all managed resources in the system.

> [!IMPORTANT]
> Any initialization logic in the constructor must not fail (throw an error), as this would prevent the PowerShell from creating an instance of the class resource.

## Smoke‑test locally with DSC executable

### Install DSC executable

You can use the community module _PSDSC_ to install the DSC v3 executable
from _PowerShell_ (not _Windows PowerShell_). Once installed you can run
the DSC executable from any shell.

To install the latest version (a preview if newest) of the DSC v3 engine, run the following:

```powershell
Install-PSResource PSDSC -TrustRepository -Quiet
Install-DscExe -IncludePrerelease -Force
dsc --version
```

> [!NOTE]
> You can find additional ways to install dsc executable in [Installing DSCv3](https://github.com/PowerShell/Dsc?tab=readme-ov-file#installing-dscv3).

#### Troubleshooting DSC executable

If you get an error running DSC v3 on Windows, make sure the `$env:PATH` contain the path to the DSC executable in you current PowerShell session:

```powershell
$env:PATH += ';' + (Join-Path -Path $env:LOCALAPPDATA -ChildPath 'dsc')
```

To persist this change across sessions, either add the same line to your PowerShell profile (`$PROFILE`) or update you machine or user environment variable `PATH` to use the dsc executable from any shell.

For Linux POSIX shells (e.g., bash, zsh), the path to the `dsc` executable was symbolically linked from _/usr/local/bin_ by `Install-DscExe`, it should work from any shell.

## Make sure PowerShell can find your resource

Before you list your DSC resource, you need to make sure PowerShell knows where to look for it. This is done by adding the folder where your resource lives to the `$env:PATH` variable. This step helps PowerShell discover your module, especially when working in a new folder or after creating your resource for the first time.

Open PowerShell and make sure you are in the project folder you created, then run:

```powershell
$env:PSModulePath += [System.IO.Path]::PathSeparator + (Split-Path -Path (Get-Location) -Parent)
```

This command adds your current folder to the search path. Now, PowerShell can find your DSC resource when you list or use it.

## List resources

To see all available DSC resources, run:

```powershell
dsc resource list --adapter Microsoft.DSC/PowerShell
```

You should now see the _DemoDscClass_ in the resource list. It should show that it supports the capabilities get, test and set. Due to sa bug in DSC v3 it does not recognize that we have implemented the capability _export_. This is just a visual reporting bug, DSC v3 will still be able to use the _export_ capability.

> [!NOTE]
> **Note on Adapters:**
> In DSC v3, an adapter acts as a bridge between the DSC engine and different resource types or execution environments. For example, the Microsoft.DSC/PowerShell adapter allows the engine to discover and run traditional PowerShell-based DSC resources—even on the new cross-platform DSC engine. This ensures compatibility with existing resources and enables a smooth transition to newer DSC models, letting you leverage both legacy and modern configurations within the same environment.

## Invoke each lifecycle operation

```powershell
$desiredParameters = @{ Key = 'Demo' } | ConvertTo-Json -Compress

dsc resource get --resource DemoDscClass/DemoDscClass --output-format json --input $desiredParameters

dsc resource test --resource DemoDscClass/DemoDscClass --output-format json --input $desiredParameters

dsc resource set --resource DemoDscClass/DemoDscClass --output-format json --input $desiredParameters

dsc resource export --resource DemoDscClass/DemoDscClass --output-format json
```

> [!TIP]
> To see tracelogs add the argument `--trace-level trace`, e.g. `dsc --trace-level trace resource get`. The different trace levels are: `error`, `warning` (default), `info`, `debug`, `trace`.

### Known issues

#### DSC executable

Currently the get, test and set operation fails if there are any `Write-Verbose`, `Write-Warning`, or `Write-Debug` that return output. You will then get the error `ERROR JSON: expected value at line 1 column 1`.
See issue [Output during module import or output from Get operaton interrupts the parsing process for class-based resource](https://github.com/PowerShell/DSC/issues/833).

For example if we would add parameter `-Verbose` the above line `Write-Verbose -Message 'Get called'` then the get operation would fail with:

```text
ERROR Operation: Failed to parse JSON from 'get': executable = 'pwsh' stdout = 'VERBOSE: Get called
{"result":[{"name":"DemoDscClass/DemoDscClass","type":"DemoDscClass/DemoDscClass","properties":{"Key":"Demo"}}]}
' stderr = '' -> expected value at line 1 column 1
```

## Invoke using configuration

Here’s an easy way to group your DSC commands into a simple YAML file. It might look a bit mysterious at first, but think of it as giving DSC a recipe to follow so you don’t have to type each command separately.

### Syntax for instance definition

First, we write down what resources we want and their settings in a YAML file. Think of this as writing clear instructions that DSC will read and execute.

> [!TIP]
> More information about instance definition syntax and resource configuration can be found here: [MMicrosoft.DSC/PowerShell](https://learn.microsoft.com/en-us/powershell/dsc/reference/resources/microsoft/dsc/powershell).
>
> For details on the configuration document schema and structure, see: [DSC Configuration Document Schema Reference](https://learn.microsoft.com/en-us/powershell/dsc/reference/schemas/config/document).

Open a text editor, create a new file called `demo-config.yaml`, and paste in the following content:

```yaml
$schema: https://raw.githubusercontent.com/PowerShell/DSC/main/schemas/2024/04/config/document.json
resources:
  - name: Demo Dsc Class
    type: Microsoft.DSC/PowerShell
    properties:
      resources:
        - name: Demo Dsc Class 1
          type: DemoDscClass/DemoDscClass
          properties:
            Key: Demo
```

Great! Now that the YAML file is saved, let’s run some commands to see how DSC interprets it:

```sh
dsc config get --file demo-config.yaml --output-format json
```

This command tells DSC to read the `demo-config.yaml` file and show you (in JSON) what it thinks the current state should look like. It’s like a dry run to check your setup.

```sh
dsc config test --file demo-config.yaml --output-format json
```

Here, DSC checks if the actual system state matches the desired state in your YAML. It will return `true` if everything is already good, or `false` if something needs fixing.

```sh
dsc config set --file demo-config.yaml --output-format json
```

This one applies the changes. Think of it as telling DSC, “Go ahead and make my system look like the YAML describes.” It won’t crash the real system in this demo, but in a real scenario it would.

```sh
dsc config export --file demo-config.yaml --output-format json
```

Finally, DSC exports the full configuration it applied (or would apply) in JSON format. This is helpful if you want to save or inspect the resulting state, or get a baseline configuration.

### Implicit custom syntax for instance definition

If you prefer a shorter way, you can use an implicit syntax. It’s like a shortcut: you don’t need a wrapper, just list your resource directly.

Create _demo-implicit-config.yaml_:

```yaml
$schema: https://raw.githubusercontent.com/PowerShell/DSC/main/schemas/2024/04/config/document.json
resources:
  - name: Demo Dsc Class 1
    type: DemoDscClass/DemoDscClass
    properties:
      Key: Demo
```

This tiny YAML file does the same thing as before but with less typing. Run the configuration file with the same commands as above.

## Write a quick Pester integration test

Pester is the de facto testing framework for PowerShell. It helps you write and run automated tests for scripts, modules, and DSC resources to ensure your code works as expected. In this section, we’ll install Pester, create a simple test script, and run it to confirm that our `DemoDscClass` resource’s `Get()` method returns the correct `Key` value.

Here’s an overview of the test structure:

- **BeforeAll**: Runs once before any tests to set up the testing environment (import module, configure paths).
- **Describe**: Defines a test suite or group of related tests.
- **Context**: Divides the test suite into logical sections, grouping related test cases for specific methods (e.g., `Get()` and `Export()`).
- **It**: Defines an individual test case with assertions using `Should`.

### Install Pester module

```powershell
Install-PSResource -Name Pester
```

Create _DemoDscClass.tests.ps1_:

```powershell
BeforeAll {
    $modulePath = $PSScriptRoot

    Import-Module "$modulePath/DemoDscClass.psd1" -Force
}

Describe 'DemoDscClass' {
    Context 'Get() method' {
        It 'Returns the same Key in Get()' {
            $desiredParameters = @{ Key = 'X' } | ConvertTo-Json -Compress

            $out = dsc resource get --resource DemoDscClass/DemoDscClass --output-format json --input $desiredParameters | ConvertFrom-Json

            $out.actualState.Key | Should -Be 'X'
        }
    }

    Context 'Export() method' {
        It 'Returns multiple instances in Export()' {
            $desiredParameters = @{ Key = 'X' } | ConvertTo-Json -Compress
            $outArray = dsc resource export --resource DemoDscClass/DemoDscClass --output-format json | ConvertFrom-Json

            $outArray.resources | Should -HaveCount 3

            $outArray.resources[0].properties.Key | Should -BeLike 'Demo*'
        }
    }
}
```

Once the test script is saved, you can run it with Pester:

```powershell
Invoke-Pester -Script ./DemoDscClass.tests.ps1 -Output Detailed
```

To understand what happens in the test script:

- The **BeforeAll** block runs once at the start. We set `$modulePath` and import our DSC module so that the `dsc` command can find and use the `DemoDscClass` definition.
- The **Describe** block defines the overall test suite for `DemoDscClass`.
- The **Context** blocks divide our suite into logical sections, grouping related test cases for specific methods (e.g., `Get()` and `Export()`), which makes tests easier to navigate.
- The **It** block contains the actual test case, where we perform the action and assert the expected result using `Should`.

You can extend this test file with more cases. For example, to verify the `Test()` and `Set()` methods.

This approach lets you build confidence in each resource method by writing focused, easy-to-read tests.

> [!IMPORTANT]
> **If you change the class definition, you must restart your PowerShell session.** PowerShell cannot reload or update a class that has already been loaded in the current session. Any changes to the class (such as adding properties or logic in methods) will not take effect until you start a new session. For automated testing or development, see [Invoke‑PesterJob](https://github.com/viscalyx/Viscalyx.Common/wiki/Invoke%E2%80%91PesterJob) for a helper that can run tests in a fresh session automatically.

## Package & publish (optional)

To share your DSC resource with others or make it available for installation via PowerShell, you can publish your module to the PowerShell Gallery. The command below packages your module and uploads it to the PSGallery repository. Replace `<PAT>` with your personal API key from the PowerShell Gallery website.

```powershell
Publish-PSResource -Path .\ -Repository PSGallery -ApiKey <PAT>
```

## Additional reading

To deepen your understanding, check out the following resources:

- [Writing a custom DSC resource with PowerShell classes](https://learn.microsoft.com/en-us/powershell/dsc/resources/authoringresourceclass?view=dsc-1.1) – Official Microsoft guide on class-based DSC resources.
- [DSC v3 Samples on GitHub](https://github.com/PowerShell/DSC-Samples) – Explore real-world examples in various languages (Go, C#, Python).
- [Pester Testing Framework](https://pester.dev/) – Learn how to write tests for your DSC resources.
- [DSC Configuration Document Schema Reference](https://learn.microsoft.com/en-us/powershell/dsc/reference/schemas/config/document) – Understand the YAML schema for configuration files.
- [Schema examples](https://github.com/PowerShell/DSC/tree/main/dsc/examples) - Learn from community schemas.

## Conclusion

Congratulations – you have built, tested, and executed your very first class-based DSC v3 resource!

By following this guide, you have learned how to:

1. Create a project folder and module manifest.
1. Author a PowerShell class with `Get()`, `Test()`, `Set()`, and `Export()` methods.
1. Perform smoke tests using the DSC executable.
1. Define configuration files in YAML and run them.
1. Write Pester tests to verify resource behavior.

Next steps for a novice:

- Extend `DemoDscClass` with additional properties and real-world logic, such as file or registry management.
- Implement more robust checks in `Test()` to detect actual configuration drift.
- Practice packaging and publishing your module to the PowerShell Gallery.
- Engage with the PowerShell DSC community through blogs, forums, and GitHub.

With these fundamentals in place, you’re well on your way to creating powerful, cross-platform DSC resources. Happy scripting!
