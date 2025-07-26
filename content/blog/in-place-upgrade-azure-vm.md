---
title: 'In-place upgrade an Azure VM Windows Server'
date: '2025-07-26'
author: 'Johan Ljunggren'
excerpt: 'Complete guide for performing in-place upgrades of Windows Server on Azure VMs, including prerequisites, security considerations, and step-by-step instructions.'
image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center'
imageAlt: 'Azure VM management interface showing Windows Server upgrade process'
tags: ['Azure', 'Windows Server', 'Upgrade', 'Virtual Machines', 'PowerShell']
readTime: '15 min read'
category: 'Infrastructure'
---

More information than what's in this guide can be found in the article [In-place upgrade for VMs running Windows Server in Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/windows-in-place-upgrade).

## Supported Upgrade Paths

Currently only these upgrade scenarios are supported:

- **Windows Server 2012** from Windows Server 2008 (64-bit) or Windows Server 2008 R2
- **Windows Server 2016** from Windows Server 2012 or Windows Server 2012 R2
- **Windows Server 2019** from Windows Server 2012 R2 or Windows Server 2016
- **Windows Server 2022** from Windows Server 2016 or Windows Server 2019
- **Windows Server 2025** from Windows Server 2019 or Windows Server 2022

> [!WARNING]
> Remember to always test the upgrade process in a non-production environment first, and ensure you have reliable backups before proceeding with production systems.

## Upgrade to Managed Disks

> [!IMPORTANT]
> The in-place upgrade process requires the use of Managed Disks on the VM to be upgraded.

Most VMs in Azure are already using Managed Disks. Retirement for unmanaged disks support was announced in November 2022. If your VM is currently using unmanaged disks, you must migrate to Managed Disks before proceeding.

### Verify Managed Disks Usage

1. Browse to: [Azure Portal, Virtual Machines](https://portal.azure.com/#view/Microsoft_Azure_ComputeHub/ComputeHubMenuBlade/~/virtualMachinesBrowse)
2. Click **Manage View**, then **Edit columns** and enable **"Uses managed disks"**
3. Verify it shows _Yes_ under **"Uses managed disks"** for the VM you are about to upgrade

### Migrate to Managed Disks (if needed)

If your VM shows _No_ under "Uses managed disks", follow the migration steps in [migrate to Managed Disks](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/migrate-to-managed-disks).

## Evaluate free space to perform in-place upgrade

Make sure you have enough free space for the upgrade. If your current OS disk doesn't have enough free space, you must expand it before proceeding. See [Expand virtual hard disks attached to a Windows virtual machine](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/expand-disks) for detailed instructions.

| Component                 | Requirement              |
| ------------------------- | ------------------------ |
| **System partition size** | 32 GB (absolute minimum) |

Review the comprehensive [Hardware requirements for Windows Server](https://learn.microsoft.com/en-us/windows-server/get-started/hardware-requirements) documentation for complete details.

### Check Current Disk Size and free space

Connect to your VM via RDP and run the following PowerShell command to check available space:

```powershell
Get-WmiObject -Class Win32_LogicalDisk |
  Where-Object {$_.DeviceID -eq "C:"} |
  Select-Object Size,FreeSpace,@{Name="SizeGB";Expression={[math]::Round($_.Size/1GB,2)}},@{Name="FreeSpaceGB";Expression={[math]::Round($_.FreeSpace/1GB,2)}}
```

## Disable security functions

Disable antivirus and anti-spyware software and firewalls. These types of software can conflict with the upgrade process. Re-enable antivirus and anti-spyware software and firewalls after the upgrade is completed.

### Firewall

Open PowerShell in an elevated PowerShell session and run:

```powershell
# Verify current status
Get-NetFirewallProfile | Select-Object Name, Enabled
```

Disable Windows Defender Firewall for all three profiles (Domain, Private, Public) on the server:

```powershell
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled False
```

You can also disable firewall through the user interface. On Windows Server 2019, this is done through Windows Defender Firewall settings:

![Windows Control Panel settings window showing the customization options for Windows Defender Firewall. Both Private and Public network settings have the option 'Turn off Windows Defender Firewall (not recommended)' selected, indicated by red shield icons. The options to turn on the firewall are unselected.](/public/blog-images/windows-defender-firewall-network-settings-win2019.png)

### Antivirus and Anti-spyware software

Stop the real‑time engine but keep Defender installed.

Open PowerShell in an elevated PowerShell session and run:

```powershell
# Verify current status
(Get-MpPreference).DisableRealtimeMonitoring
```

Disable real-time monitoring:

```powershell
Set-MpPreference -DisableRealtimeMonitoring $true
```

You can also disable the real‑time engine through the user interface. On Windows Server 2019, this is done through Windows Security settings:

![Windows Security window showing the 'Virus & threat protection' section. Under 'Current threats', it reports no current threats and a last scan with zero threats found. Below, a warning under 'Virus & threat protection settings' states that real-time protection is off, leaving the device vulnerable, with a greyed-out 'Turn on' button and a 'Manage settings' link.](/public/blog-images/virus-and-threat-protection-settings-win2019.png)

When click on the Manage settings link:

![Windows Security window showing the 'Virus & threat protection settings' section. Under 'Real-time protection', it indicates that the setting is turned off, with a red warning icon and message stating 'Real-time protection is off, leaving your device vulnerable.' A toggle switch is set to 'Off' at the bottom of the section.](/public/blog-images/real-time-protection-setting-win2019.png)

## Upgrade VM to volume license (KMS server activation)

> [!IMPORTANT]
> This step is only relevant if the VM was imported into Azure. VMs deployed from Azure Marketplace images are already configured for volume licensing.

The upgrade media provided by Azure requires the VM to be configured for Windows Server volume licensing. This is the default behavior for any Windows Server VM that was installed from a generalized image in Azure.

If the VM was imported into Azure, it might need to be converted to volume licensing to use the upgrade media provided by Azure. To confirm and configure the VM for volume license activation see [Upgrade VM to volume license (KMS server activation)](https://learn.microsoft.com/en-us/azure/virtual-machines/windows-in-place-upgrade#upgrade-vm-to-volume-license-kms-server-activation).

You can verify the current licensing configuration by running this PowerShell command:

```powershell
# Check current license status
slmgr.vbs /dlv
```

## Snapshot the VM disks

> [!CAUTION]
> It is recommended to create a snapshot of the operating system disk (and any data disks) before starting the in-place upgrade process. Create a snapshot on each data disk as well if they exist. Without it you cannot revert to a previous state.

> [!IMPORTANT]
> To revert to the previous state of the VM if anything fails during the upgrade, you must have made snapshots. See [Recover from failure](https://learn.microsoft.com/en-us/azure/virtual-machines/windows-in-place-upgrade#recover-from-failure) for recovery procedures.

### Snapshot the operating system disk

When creating the snapshot, for simplicity, create it in the same subscription, resource group and location (zone) as the Azure VM operating system disk.

See the article [Create a snapshot of a VHD](https://learn.microsoft.com/en-us/azure/virtual-machines/snapshot-copy-managed-disk?tabs=portal#create-a-snapshot-of-a-vhd).

Set the properties:

| Property            | Value                                             |
| ------------------- | ------------------------------------------------- |
| Subscription        | Same as the VM's operating system disk            |
| Resource Group      | Same as the VM                                    |
| Name                | Any, e.g. `snapshot_vm-name_os`                   |
| Region              | Same as the VM                                    |
| Snapshot type       | Full                                              |
| Source Type         | Disk                                              |
| Source Subscription | same as the VM's operating system disk            |
| Source disk         | Choose the VM's operating system disk in the list |
| Storage type        | Standard HDD                                      |

## Set operating system language to English US

> [!IMPORTANT]
> The upgrade media disk can only use `en-US` language. No other languages are supported. To avoid any errors, set the system language to en-US or change the system locale to English (United States) in Control Panel.

**Steps to change system locale:**

1. Open **Control Panel** → **Clock and Region** → **Region**
2. On the **Administrative** tab, click **Change system locale**
3. Select **English (United States)**
4. Restart the computer when prompted

## Create upgrade media disk

To initiate an in-place upgrade, the upgrade media must be attached to the VM as a Managed Disk.

### Prerequisites for PowerShell Script

Suggest using Azure Cloud Shell after logging in to the portal. Otherwise, to use the script below some PowerShell modules need to be installed (this will also automatically install dependent modules). You also need to connect to the correct tenant and subscription.

```powershell
Install-PSResource Az.Compute, Az.Resource -TrustRepository
Connect-AzAccount -Tenant '<tenant-id>' -Subscription '<subscription-hosting-vm>'
```

### PowerShell Script Parameters

Modify the following variables in the PowerShell script according to your environment:

| Parameter        | Description                                                    | Example                                                                                       |
| ---------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `$subscription`  | Subscription name or ID of the VM to be upgraded               | `'ad44ec4c-23de-4e25-fb2e-3ae9c5c0d4e2'`                                                      |
| `$resourceGroup` | Resource group where upgrade media disk will be created        | `'myResourceGroup'`                                                                           |
| `$location`      | Azure region (must match VM region)                            | `'westeurope'`                                                                                |
| `$zone`          | Azure zone (must match VM zone, empty string for regional VMs) | `''` or `'1'`                                                                                 |
| `$diskName`      | Name for the upgrade media disk                                | `'WindowsServer2022UpgradeDisk'`                                                              |
| `$sku`           | Target OS version                                              | `'server2022Upgrade'`, `'server2019Upgrade'`, `'server2016Upgrade'`, or `'server2012Upgrade'` |

### PowerShell Script to Create Upgrade Media

Use the following PowerShell script to create the upgrade media for Windows Server 2022, ensuring you modify the variables as needed:

```powershell
### START - Modify variables

# Subscription name or id of the VM to be upgraded
$subscription = '<subscription-id-or-name>'

# Name of the resource group where the upgrade media Managed Disk will be created. The named resource group is created if it doesn't exist. Set to resource group of the source VM.
$resourceGroup = '<resourceGroupName>'

# Azure region where the upgrade media Managed Disk is created. This must be the same region as the VM to be upgraded.
$location = 'westeurope'

# Azure zone in the selected region where the upgrade media Managed Disk will be created. This must be the same zone as the VM to be upgraded. For regional VMs (nonzonal) the zone parameter should be ''.
$zone = ''

# Name of the Managed Disk that will contain the upgrade media, can be left as is.
$diskName = 'WindowsServer2022UpgradeDisk'

# Target version for the upgrade. Windows Server upgrade media version.
# This must be either: server2022Upgrade, server2019Upgrade, server2016Upgrade or server2012Upgrade
$sku = 'server2022Upgrade'

### END - Modify variables

$publisher = 'MicrosoftWindowsServer'
$offer = 'WindowsServerUpgrade'
$managedDiskSKU = 'Standard_LRS'

# Set the correct subscription
if ($subscription) { Set-AzContext -Subscription $subscription }

# Get the latest version of the special (hidden) VM Image from the Azure Marketplace
$versions = Get-AzVMImage -PublisherName $publisher -Location $location -Offer $offer -Skus $sku |
  Sort-Object -Descending { [System.Version] $_.Version }
$latestString = $versions[0].Version

# Get the special (hidden) VM Image from the Azure Marketplace by version - the image is used to create a disk to upgrade to the new version
$image = Get-AzVMImage -Location $location -PublisherName $publisher -Offer $offer -Skus $sku -Version $latestString

# Create Resource Group if it doesn't exist
if (-not (Get-AzResourceGroup -Name $resourceGroup -ErrorAction 'SilentlyContinue')) {
    New-AzResourceGroup -Name $resourceGroup -Location $location
}

# Create Managed Disk from LUN 0

if ($zone) {
    $diskConfig = New-AzDiskConfig -SkuName $managedDiskSKU -CreateOption FromImage -Zone $zone -Location $location
} else {
    $diskConfig = New-AzDiskConfig -SkuName $managedDiskSKU -CreateOption FromImage -Location $location
}

Set-AzDiskImageReference -Disk $diskConfig -Id $image.Id -Lun 0

New-AzDisk -ResourceGroupName $resourceGroup -DiskName $diskName -Disk $diskConfig
```

> [!IMPORTANT]
> The upgrade media disk can be reused to upgrade multiple VMs, but only one VM can be upgraded at a time. If you need to upgrade multiple VMs simultaneously, you must create separate upgrade disks for each concurrent upgrade.

## Attach upgrade media to the VM

Attach the upgrade media disk to the VM to upgrade. This can be performed whether the VM is running or stopped.

### Portal Steps

1. Go to the virtual machine in the Azure portal
2. In the left menu, select **Settings**, then **Disks**
3. Select **Attach existing disks**
4. In the drop-down for **LUN** keep 0 (or first free LUN)
5. In the drop-down for **Disk name**, select the name of the upgrade disk created in the previous step
6. Click **Apply** to attach the upgrade disk to the VM

### PowerShell Alternative

```powershell
# Variables
$vmName = 'YourVMName'
$resourceGroupName = 'YourResourceGroup'
$diskName = 'WindowsServer2022UpgradeDisk'

# Get the VM and disk
$vm = Get-AzVM -ResourceGroupName $resourceGroupName -Name $vmName
$disk = Get-AzDisk -ResourceGroupName $resourceGroupName -DiskName $diskName

# Attach the disk to the VM
$vm = Add-AzVMDataDisk -VM $vm -Name $diskName -ManagedDiskId $disk.Id -Lun 0 -CreateOption Attach

# Update the VM
Update-AzVM -ResourceGroupName $resourceGroupName -VM $vm
```

## Disable Auto-shutdown

If there are any VM auto-shutdown policies that can impact the upgrade process, disable them temporarily.

**Steps to disable auto-shutdown:**

1. Navigate to your VM in Azure Portal
2. Go to **Operations** → **Auto-shutdown**
3. Toggle **Enable** to **Off**
4. Click **Save**

## Perform in-place upgrade (Windows Server 2016, 2019, or 2022)

> [!IMPORTANT]
> To initiate the in-place upgrade the VM must be in the `Running` state.

### Steps to Perform the Upgrade

1. **Connect to the VM** using [RDP](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/connect-rdp#connect-to-the-virtual-machine) or [RDP-Bastion](https://learn.microsoft.com/en-us/azure/bastion/bastion-connect-vm-rdp-windows#rdp)
1. **Determine the drive letter** for the upgrade disk (typically `E:` if there are no other data disks, or `F:`)
1. **Start an elevated Windows PowerShell session**
1. **Navigate to the upgrade directory and start the upgrade:**

```powershell
# Change to correct folder on E: drive if other target OS.
cd 'E:\Windows Server 2022'
.\setup.exe /auto upgrade /dynamicupdate disable /eula accept
```

### Understanding the Setup Command

- `/auto upgrade` - Performs an automatic upgrade
- `/dynamicupdate disable` - Disables dynamic updates during setup
- `/eula accept` - Automatically accepts the End User License Agreement

### During the Upgrade Process

The Windows Server upgrade process will start. After a short while you need to select the image to upgrade to - choose desktop experience, and the same edition as the existing installation:

![Windows Server Setup screen titled 'Select Image'. The user is prompted to select the image to install. Four operating system options are listed: Windows Server 2022 Standard, Windows Server 2022 Standard (Desktop Experience), Windows Server 2022 Datacenter, and Windows Server 2022 Datacenter (Desktop Experience), all in the en-US language. A note below indicates that the non-Desktop Experience versions omit most graphical elements and are managed via command prompt, PowerShell, or remote tools. 'Next' and 'Back' buttons appear at the bottom.](/public/blog-images/win2019-setup-select-image.png)

The upgrade process will continue and use unattended installation.

### Monitoring Progress

During the upgrade process, the VM will automatically disconnect from the RDP session. After the VM is disconnected from the RDP session, the progress of the upgrade can be monitored through the [screenshot functionality available in the Azure portal](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-machines/boot-diagnostics#enable-boot-diagnostics-on-existing-virtual-machine).

**To access boot diagnostics:**

1. Navigate to your VM in Azure Portal
2. Go to **Help** → **Boot diagnostics**
3. Click **Screenshot** to see current status

> [!IMPORTANT]
> The image plan information will not change after the upgrade process.

## Perform in-place upgrade (Windows Server 2012 only)

For Windows Server 2012 upgrades, the process is slightly different:

1. **Connect to the VM** using RDP
2. **Determine the drive letter** for the upgrade disk
3. **Start Windows PowerShell**
4. **Navigate to the upgrade directory:**

```powershell
cd 'E:\'
.\setup.exe
```

5. **Follow the GUI wizard:**
   - Select **Install now**
   - For "Get important updates for Windows Setup", select **No thanks**
   - Select the correct Windows Server 2012 "Upgrade to" image
   - On License terms page, select **I accept the license terms** and then **Next**
   - For "What type of installation do you want?" select **Upgrade: Install Windows and keep files, settings, and applications**
   - Setup will produce a Compatibility report, you can ignore any warnings and select **Next**

## Re-enable firewall, anti-virus and anti-spyware

After the upgrade is complete, re-enable all security software that was disabled:

```powershell
# Re-enable Windows Defender Firewall
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled True

# Re-enable Windows Defender real-time protection
Set-MpPreference -DisableRealtimeMonitoring $false
```

Verify the settings:

```powershell
# Verify firewall status
Get-NetFirewallProfile | Select-Object Name, Enabled

# Verify antivirus status
(Get-MpPreference).DisableRealtimeMonitoring
```

## Post upgrade steps

Once the upgrade process has completed successfully, the following steps should be taken to clean up any artifacts which were created during the upgrade process:

### Immediate Cleanup Tasks

1. **Delete the snapshots** of the OS disk and data disk(s) if they were created (after confirming upgrade success)
2. **Detach the upgrade media Managed Disk** from the VM that was upgraded
3. **Delete the upgrade media Managed Disk** (unless you plan to reuse it for other VMs)
4. **Re-enable auto-shutdown** if it was disabled
5. **Re-enable antivirus, anti-spyware, and firewall software** that was disabled at the start of the upgrade process

### Verification Steps

1. **Verify the OS version:**

```powershell
# Check Windows version
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, WindowsBuildLabEx

# Alternative method
[System.Environment]::OSVersion.Version
```

2. **Check system health:**

```powershell
# Run System File Checker
sfc /scannow

# Check Windows Update status
Get-WindowsUpdate
```

3. **Verify services and applications:**
   - Test critical applications
   - Verify network connectivity
   - Check server roles and features

### PowerShell Script for Cleanup

```powershell
# Variables - Update these
$resourceGroupName = 'YourResourceGroup'
$vmName = 'YourVMName'
$upgradeDiskName = 'WindowsServer2022UpgradeDisk'
$snapshotName = 'snapshot_vm-name_os'

# Detach upgrade disk from VM
$vm = Get-AzVM -ResourceGroupName $resourceGroupName -Name $vmName
$vm = Remove-AzVMDataDisk -VM $vm -Name $upgradeDiskName
Update-AzVM -ResourceGroupName $resourceGroupName -VM $vm

# Delete upgrade disk
Remove-AzDisk -ResourceGroupName $resourceGroupName -DiskName $upgradeDiskName -Force

# Delete snapshot (only after confirming upgrade success)
Remove-AzSnapshot -ResourceGroupName $resourceGroupName -SnapshotName $snapshotName -Force

Write-Output "Cleanup completed successfully"
```

## Troubleshooting Common Issues

### Upgrade Fails to Start

**Symptoms:** Setup.exe fails to launch or exits immediately
**Solutions:**

- Verify the VM is using `en-US` locale
- Ensure sufficient disk space (at least 32 GB free)
- Check that all security software is disabled
- Verify the upgrade media disk is properly attached

### Upgrade Stalls During Process

**Symptoms:** Progress stops for extended periods
**Solutions:**

- Use boot diagnostics to monitor progress
- Allow up to several hours for completion
- Do not interrupt the process
- If truly stuck, restore from snapshot

### RDP Connection Issues After Upgrade

**Symptoms:** Cannot connect via RDP after upgrade
**Solutions:**

- Check VM status in Azure Portal
- Use boot diagnostics to see console
- Try Azure Bastion for connectivity
- Verify network security group rules

### Performance Issues After Upgrade

**Symptoms:** VM runs slowly after upgrade
**Solutions:**

- Install latest Windows updates
- Update VM agents and drivers
- Consider increasing VM size if needed
- Run disk cleanup and defragmentation
