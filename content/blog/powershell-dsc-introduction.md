---
title: 'Getting Started with PowerShell DSC'
date: '2024-12-20'
author: 'Johan Ljunggren'
excerpt: "A beginner's guide to PowerShell Desired State Configuration (DSC) and how to automate Windows server management."
image: '/macro-syntax-highlighted-source-code-pixels.png'
imageAlt: 'Macro close-up of a monitor showing brightly syntax-highlighted source code with visible pixel texture.'
tags: ['PowerShell', 'DSC', 'Windows', 'Automation', 'Configuration Management']
readTime: '10 min read'
category: 'PowerShell DSC'
---

## Getting Started with PowerShell DSC

PowerShell Desired State Configuration (DSC) is a powerful configuration
management framework that enables you to manage your Windows infrastructure
declaratively. Instead of writing imperative scripts that tell the system what
to do step by step, DSC allows you to describe the desired state of your
systems, and it handles the implementation details.

## What is PowerShell DSC?

DSC is built on three core components:

1. **Configurations**: PowerShell scripts that define the desired state
1. **Resources**: The building blocks that perform the actual work
1. **Local Configuration Manager (LCM)**: The engine that applies configurations

## Key Benefits

### Declarative Approach

With DSC, you describe what you want, not how to achieve it:

<!-- markdownlint-disable MD013 -->
```powershell
Configuration WebServerConfig {
    Node 'WebServer01' {
        WindowsFeature IIS {
            Ensure = 'Present'
            Name = 'Web-Server'
        }

        File DefaultPage {
            Ensure = 'Present'
            DestinationPath = 'C:\inetpub\wwwroot\index.html'
            Contents = '<h1>Welcome to our website!</h1>'
            Type = 'File'
        }
    }
}
```
<!-- markdownlint-enable MD013 -->

### Idempotency

DSC configurations are idempotent, meaning you can run them multiple times
safely. The system will only make changes when the current state doesn't match
the desired state.

### Self-Healing

The LCM can be configured to continuously monitor and correct configuration
drift, ensuring your systems stay in the desired state.

## Getting Started

### Step 1: Install PowerShell DSC

PSDSC comes built-in with Windows PowerShell 5.x. For newer versions,
you can install the PSDesiredStateConfiguration module:

<!-- markdownlint-disable MD013 -->
```powershell
Install-Module -Name PSDesiredStateConfiguration -Force
```
<!-- markdownlint-enable MD013 -->

### Step 2: Write Your First Configuration

Create a simple configuration that ensures a directory exists:

<!-- markdownlint-disable MD013 -->
```powershell
Configuration EnsureDirectory {
    param(
        [string]$Path = 'C:\MyApp'
    )

    Node localhost {
        File CreateDirectory {
            Ensure = 'Present'
            DestinationPath = $Path
            Type = 'Directory'
        }
    }
}
```
<!-- markdownlint-enable MD013 -->

### Step 3: Compile and Apply

Compile the configuration to create a MOF file, then apply it:

<!-- markdownlint-disable MD013 -->
```powershell
# Compile the configuration
EnsureDirectory -OutputPath 'C:\DSC\Configs'

# Apply the configuration
Start-DscConfiguration -Path 'C:\DSC\Configs' -Wait -Verbose
```
<!-- markdownlint-enable MD013 -->

## Common DSC Resources

### Built-in Resources

- **File**: Manage files and directories
- **Registry**: Configure registry settings
- **WindowsFeature**: Install/remove Windows features
- **Service**: Manage Windows services
- **User**: Manage local user accounts

### Community Resources

The PowerShell Gallery contains hundreds of community-contributed DSC resources
for managing:

- IIS configurations
- SQL Server installations
- Active Directory
- Network settings
- And much more

## Best Practices

### 1. Use Composite Resources

Create reusable components by combining multiple resources:

<!-- markdownlint-disable MD013 -->
```powershell
Configuration WebServer {
    param(
        [string]$SiteName,
        [string]$PhysicalPath
    )

    WindowsFeature IIS {
        Ensure = 'Present'
        Name = 'Web-Server'
    }

    WindowsFeature IISManagement {
        Ensure = 'Present'
        Name = 'Web-Mgmt-Tools'
        DependsOn = '[WindowsFeature]IIS'
    }

    File WebContent {
        Ensure = 'Present'
        DestinationPath = $PhysicalPath
        Type = 'Directory'
        DependsOn = '[WindowsFeature]IIS'
    }
}
```
<!-- markdownlint-enable MD013 -->

### 2. Implement Configuration Data

Separate your configuration logic from environment-specific data:

<!-- markdownlint-disable MD013 -->
```powershell
$ConfigData = @{
    AllNodes = @(
        @{
            NodeName = 'WebServer01'
            SiteName = 'Production Site'
            PhysicalPath = 'C:\inetpub\wwwroot\prod'
        },
        @{
            NodeName = 'WebServer02'
            SiteName = 'Test Site'
            PhysicalPath = 'C:\inetpub\wwwroot\test'
        }
    )
}
```
<!-- markdownlint-enable MD013 -->

### 3. Use Pull Servers for Scale

For larger environments, implement a DSC Pull Server to centrally manage
configurations and reduce administrative overhead.

## Troubleshooting Tips

### Check DSC Status

Monitor the status of your DSC configurations:

<!-- markdownlint-disable MD013 -->
```powershell
Get-DscConfigurationStatus
Get-DscLocalConfigurationManager
```
<!-- markdownlint-enable MD013 -->

### Review Event Logs

DSC writes detailed information to Windows Event Logs:

- Applications and Services Logs → Microsoft → Windows → Desired State
  Configuration

### Test Configurations

Always test your configurations in a development environment before applying to
production.

## Conclusion

PowerShell DSC provides a robust foundation for configuration management in
Windows environments. By adopting DSC, you can:

- Reduce configuration drift
- Improve system reliability
- Automate repetitive tasks
- Maintain consistent environments

Start small with simple configurations and gradually build more complex
automation as your confidence and expertise grow.

## Next Steps

- Explore the [PowerShell DSC
  documentation](https://learn.microsoft.com/en-us/powershell/dsc/overview/decisionmaker?view=dsc-1.1)
- Join the [PowerShell DSC
  Community](https://github.com/PowerShell/DscCommunity)
- Practice with the [Authoring a class-based DSC Resource](https://learn.microsoft.com/sv-se/powershell/dsc/how-tos/resources/authoring/class-based?view=dsc-2.0)

Ready to take your infrastructure automation to the next level? [Contact
Viscalyx](/contact) for expert PowerShell DSC consulting and training.
