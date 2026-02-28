---
title: 'What is Microsoft DSC v3?'
date: '2025-07-14'
author: 'Johan Ljunggren'
excerpt: 'A beginner-friendly introduction to Desired State Configuration version 3 and how to use it across Windows, Linux, and macOS.'
image: '/macro-cinematic-circuit-board-central-microchip.png'
imageAlt: 'Macro, cinematic close-up of a circuit board with a central microchip in sharp focus, surrounding components fading into a cool blue blur.'
tags: ['DSC', 'PowerShell', 'Automation', 'Beginners']
category: 'Automation'
readTime: '8 min read'
---

> Microsoft DSC v3 is a simple, single executable tool that helps you declare
> and enforce the desired state of your systems in a cross-platform way.

## What is Microsoft DSC v3?

Microsoft Desired State Configuration (DSC) v3 is a cross-platform tool that
lets you describe how you want your system to look and behave. You write a
configuration document in JSON, Bicep, or YAML describing the desired state and
Microsoft DSC v3 ensures your machines match the state.

For example, what files and folders should always exist or which services should
be running _always_.

> [!TIP]
> To learn why you want to use Microsoft DSC v3, check out the [following article](demodscclass-your-first-class-based-dsc-v3-resource.md#why-use-class-based-resources)

## Installing DSC v3

The following sections demonstrate how you can install Microsoft DSC v3 on the
different platforms and methods.

### Installing Microsoft DSC v3 using PSDSC

To install Microsoft DSC v3 on all platforms, you can use a community PowerShell
module which runs on PowerShell 7+:

1. Open a PowerShell terminal session
1. Install the `PSDSC` module by typing:

<!-- markdownlint-disable MD013 -->
```powershell
Install-PSResource -Name PSDSC -Repository PSGallery
```
<!-- markdownlint-enable MD013 -->

1. Execute `Install-DscExe` in your terminal session

<!-- markdownlint-disable MD013 -->
```powershell
Install-DscExe
```
<!-- markdownlint-enable MD013 -->

> [!TIP]
> You can also install a pre-release version by adding the `PreRelease` switch
> parameter.

The command automatically adds the `dsc` executable (`dsc.exe` on Windows) to
the `PATH`
environment variable.

### Installing from GitHub

To install Microsoft DSC v3 on Windows using GitHub, you first should determine
your OS architecture. There are multiple ways to determine the operating system
(OS) architecture. The following three demonstrate using the command prompt,
PowerShell, or msinfo.

1. Open a command prompt and type: echo %PROCESSOR_ARCHITECTURE%.
1. Open a PowerShell terminal session and type:
   `[System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture`.
1. In your Quick Start menu, type in msinfo32.exe and locate the System Type
   property in the System Summary.

After determining your OS architecture, proceed to download the release asset
from GitHub.

1. Open the [PowerShell DSC releases page](https://github.com/PowerShell/DSC/releases/)
   in your favorite browser
1. Select the version you want to download and scroll-down.
1. Expand the _Assets_ and press the asset relevant to your OS architecture.
1. Save the file to your Downloads folder.

When the download is finished, you can expand the files to extract them to your
application data folder.

1. Right-click the file and select _Extract all..._
1. Extract the files to `C:\Users\<userProfile>\AppData\Local\dsc` by replacing
   the `<userProfile>` with your profile name.
1. Open a command prompt and type: `rundll32.exe
   sysdm.cpl,EditEnvironmentVariables` to open the environment variables.
1. In your user variables, edit your `PATH` environment variable and include
   the path `C:\Users\<userProfile>\AppData\Local\dsc`.

Verify the installation by re-opening a command prompt and typing: `dsc --version`

## Quick introduction: Getting the current state

To quickly learn about Microsoft DSC v3, let's create a configuration document
that gets the operating system information on your system.

1. Create the following YAML file:

<!-- markdownlint-disable MD013 -->
   ```yaml
   # osinfo.dsc.yaml
   $schema: https://aka.ms/dsc/schemas/v3/bundled/config/document.json
   resources:
     - name: os
       type: Microsoft/OSInfo
       properties:
         family: Windows
   ```
<!-- markdownlint-enable MD013 -->

1. Run the following command to get the current state

<!-- markdownlint-disable MD013 -->
   ```bash
   dsc config get --file osinfo.dsc.yaml
   ```
<!-- markdownlint-enable MD013 -->

> [!NOTE]
> It is also possible to get the current state by running `dsc resource get -r Microsoft/OSInfo`
> without needing a configuration file.

## Conclusion

Microsoft DSC v3 redefines the DSC experience by providing a single executable
into a lightweight and cross-platform tool. It seamlessly fits into modern
DevOps pipelines. With a new concept called _adapters_, an existing DSC resource
can still be executed. Start small to learn the new resource syntax and
build up to automate your entire infrastructure.

Happy configuring!
