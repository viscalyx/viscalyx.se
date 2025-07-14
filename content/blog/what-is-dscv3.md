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
1. Move `dsc.exe` into a folder on your machine (e.g., `C:\dsc` or `~/bin`).
1. Add it to your PATH:

   ```powershell
   # Windows (PowerShell)
   $env:PATH += ';C:\dsc'

   # Linux/macOS (bash/zsh)
   export PATH="$HOME/bin:$PATH"
   ```

1. Verify installation:

   ```bash
   $ dsc --version
   DSC Engine version 3.x.x
   ```

## Quick Start: Create a Folder

Let's create a folder on your system using DSC v3.

1. Create a JSON configuration `folder-config.json` using DSC v3’s schema:

   ```json
   {
     "$schema": "https://raw.githubusercontent.com/PowerShell/dsc/main/schema/dsc-config.schema.json",
     "version": "3.0.0",
     "nodes": {
       "localhost": {
         "resources": [
           {
             "module": "PSDesiredStateConfiguration",
             "type": "File",
             "name": "ExampleFolder",
             "properties": {
               "DestinationPath": "/tmp/example",
               "Ensure": "Present",
               "Type": "Directory"
             }
           }
         ]
       }
     }
   }
   ```

1. Apply the configuration directly:

   ```bash
   $ dsc config apply ./folder-config.json
   ```

You should now have an `ExampleFolder` directory under `/tmp` (or `C:\Temp\Example` on Windows).

## How It Works

- **configuration** block: Defines a DSC configuration in `folder-config.json`.
- **Node localhost**: Targets your local machine.
- **File resource**: Ensures the specified folder exists.
- **Apply**: `dsc.exe` reads the configuration and enforces the state on your machine.

## Next Steps

- Explore other DSC resources: `Service`, `Package`, `User`, and more.
- Automate software installs and service management.

## Conclusion

DSC v3 redefines Desired State Configuration by packaging the engine into a lightweight, cross-platform executable that fits seamlessly into modern pipelines. Its adapter model ensures compatibility with existing DSC modules while enabling new, platform-neutral resources. Start small, learn the resource syntax, and build up to automating your entire infrastructure.

Happy configuring!
