---
title: 'What is DSC v3?'
date: '2025-07-14'
author: 'Johan Ljunggren'
excerpt: 'A beginner-friendly introduction to Desired State Configuration version 3 and how to use it across Windows, Linux, and macOS.'
image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&crop=center'
imageAlt: 'Developer working on code with multiple monitors showing terminal and configuration files'
tags: ['DSC', 'PowerShell', 'Automation', 'Beginners']
category: 'Automation'
readTime: '8 min read'
---

> DSC v3 is a simple, single executable tool that helps you declare and enforce the desired state of your systems in a cross-platform way.

## What is DSC?

Desired State Configuration (DSC) is a PowerShell-based framework that lets you describe how you want your system to look and behave. You write a configuration script (.ps1) that outlines the desired state—like which folders should exist or which services should be running—and DSC ensures your machine matches that state.

## Why DSC v3?

- **Single executable**: No Windows service or complex installation. Just download `dsc.exe` and place it in your PATH.
- **Cross-platform**: Runs on PowerShell 7+ on Windows, Linux, and macOS.
- **Side-by-side versions**: Keep multiple DSC engine versions in separate folders for testing or rollbacks.
- **Familiar syntax**: If you know PowerShell, writing configurations feels natural.

## Installing DSC v3

1. Download the latest `dsc.exe` from the [DSC GitHub releases](https://github.com/PowerShell/dsc/releases).
1. Move `dsc.exe` into a folder on your machine, e.g.:
   - Windows: `C:\dsc`
   - Linux: `/opt/microsoft/dsc`
   - macOS: `/usr/local/microsoft/dsc`
1. Add it to your PATH:

   ```powershell
   # Windows (PowerShell)
   $env:PATH += ';C:\dsc'

   # Linux (bash/zsh)
   ln -s /opt/microsoft/dsc/dsc /usr/local/bin/dsc

    # macOS (bash/zsh)
   ln -s /usr/local/microsoft/dsc/dsc /usr/local/bin/dsc
   ```

1. Verify installation:

   ```bash
   $ dsc --version
   dsc x.x.x
   ```

> [!TIP]
> On Linux and macOS if you are not allowed to execute dsc, make it executable by running
> `chmod +x /opt/microsoft/dsc/dsc` or `chmod +x /usr/local/microsoft/dsc/dsc` respectively.

## Quick Start: Get the current state

Let's create a configuration that gets the current operating system information on your system using DSC v3.

1. Create a JSON configuration `folder-config.json` using DSC v3’s schema:

   ```json
   {
     "$schema": "https://raw.githubusercontent.com/PowerShell/DSC/main/schemas/v3/config/document.json",
     "resources": [
       {
         "name": "MyOSInfo",
         "type": "Microsoft/OSInfo",
         "properties": {}
       }
     ]
   }
   ```

1. Get the current state:

   ```bash
   dsc config get --file ./folder-config.json --output-format pretty-json
   ```

> [!NOTE]
> It is also possible to get the current state by running `dsc resource get -r Microsoft/OSInfo`
> without needing a configuration file.

## Conclusion

DSC v3 redefines Desired State Configuration by packaging the engine into a lightweight, cross-platform executable that fits seamlessly into modern pipelines. Its adapter model ensures compatibility with existing DSC modules while enabling new, platform-neutral resources. Start small, learn the resource syntax, and build up to automating your entire infrastructure.

Happy configuring!
