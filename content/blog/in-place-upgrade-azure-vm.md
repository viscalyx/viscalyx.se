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

[In-place upgrade for VMs running Windows Server in Azure](https://learn.microsoft.com/en-us/azure/virtual-machines/windows-in-place-upgrade)

Only supports:

- Windows Server 2012 from Windows Server 2008 (64-bit) or Windows Server 2008 R2
- Windows Server 2016 from Windows Server 2012 or Windows Server 2012 R2
- Windows Server 2019 from Windows Server 2012 R2 or Windows Server 2016
- Windows Server 2022 from Windows Server 2016 or Windows Server 2019

## Evaluate free space to perform in-place upgrade

[Hardware requirements for Windows Server](https://learn.microsoft.com/en-us/windows-server/get-started/hardware-requirements?)

Minimum requirements:

| OS                  | System partition size (GB) |
| ------------------- | -------------------------- |
| Windows Server 2016 | 32                         |
| Windows Server 2019 | 32                         |
| Windows Server 2022 | 32                         |
| Windows Server 2025 | 32                         |

[Expand virtual hard disks attached to a Windows virtual machine](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/expand-disks)

## Disable security functions

Disable antivirus and anti-spyware software and firewalls. These types of software can conflict with the upgrade process. Re-enable antivirus and anti-spyware software and firewalls after the upgrade is completed.

### Firewall

Open PowerShell in an elevated PowerShell session and run:

```powershell
# Veirfy status
Get-NetFirewallProfile | Select-Object Name, Enabled
```

Disable Windows Defender Firewall for all three profiles (Domain, Private, Public) on the server:

```powershell
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled False
```

Re‑enable later:

```powershell
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled True
```

Also possible to disable firewall trough user interface, this is how on Windows Server 2019:

![Windows Control Panel settings window showing the customization options for Windows Defender Firewall. Both Private and Public network settings have the option 'Turn off Windows Defender Firewall (not recommended)' selected, indicated by red shield icons. The options to turn on the firewall are unselected.](/public/blog-images/windows-defender-firewall-network-settings-win2019.png)

### Antivirus and Anti-spyware software

Stop the real‑time engine but keep Defender installed.

Open PowerShell in an elevated PowerShell session and run:

```powershell
# Veirfy status
(Get-MpPreference).DisableRealtimeMonitoring
```

```powershell
Set-MpPreference -DisableRealtimeMonitoring $true
```

Also possible to disable real‑time engine trough user interface, this is how on Windows Server 2019:

![Windows Security window showing the 'Virus & threat protection' section. Under 'Current threats', it reports no current threats and a last scan with zero threats found. Below, a warning under 'Virus & threat protection settings' states that real-time protection is off, leaving the device vulnerable, with a greyed-out 'Turn on' button and a 'Manage settings' link.](/public/blog-images/virus-and-threat-protection-settings-win2019.png)

When click on the Manage settings link:

![Windows Security window showing the 'Virus & threat protection settings' section. Under 'Real-time protection', it indicates that the setting is turned off, with a red warning icon and message stating 'Real-time protection is off, leaving your device vulnerable.' A toggle switch is set to 'Off' at the bottom of the section.](/public/blog-images/real-time-protection-setting-win2019.png)

## Upgrade VM to volume license (KMS server activation)

This is only relevant if the VM was imported into Azure, to use the upgrade
media provided by Azure, see [Upgrade VM to volume license (KMS server activation)](https://learn.microsoft.com/en-us/azure/virtual-machines/windows-in-place-upgrade#upgrade-vm-to-volume-license-kms-server-activation).

The default behavior for any Windows&nbsp;Server VM that was installed from
a generalized image in Azure to be configured for Windows&nbsp;Server volume
licensing

## Upgrade to Managed Disks

The in-place upgrade process requires the use of Managed Disks on the VM
to be upgraded.

1. Browse to: [Azure Portal, Virtual Machines](https://portal.azure.com/#view/Microsoft_Azure_ComputeHub/ComputeHubMenuBlade/~/virtualMachinesBrowse)
1. click **Manage View\***, **Edit columns** and turn on **“Uses managed disks”**
1. Make sure it says _Yes_ under **“Uses managed disks”** for the VM you are about to upgrade

## Snapshot the VM disks

It is recommended to create a snapshot of the operating system disk (and any data disks) before starting the in-place upgrade process. Create a snapshot on each data disk as weel if they exist.

> [!CRITICAL]
> To revert to the previous state of the VM if anything fails during the upgrade, you must have made snapshot.
> See [Recover from failure](https://learn.microsoft.com/en-us/azure/virtual-machines/windows-in-place-upgrade#recover-from-failure)

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

## Set operating system language to english US

The upgrade media disk can only use `en-US` language. No other languages are supported. To avoid any errors, set the system language to en-US or change the system locale to English (United States) in Control Panel.

## Create upgrade media disk

To initiate an in-place upgrade, the upgrade media must be attached to the VM as a Managed Disk.

Suggest using Azure Cloud Shell after logging in to the portal. Otherwise, to use the script below
some PowerShell modules need to be installed (this will also automatically install dependent modules).
You aso need to connect to thr correct tenant and subscrition.

```powershell
Install-PSResource Az.Compute, Az.Resource -TrustRepository
Connect-AzAccount -Tenant '<tenant-id>' -Subscription '<subscription-hosting-vm>'
Connect-AzAccount -Subscription 'fe44ac4b-46de-4d25-ab3e-7a7985c0d7e6' -Tenant '282a80cf-5adc-4264-88ac-4a9c7bb05031'
```

Use the following PowerShell script to create the upgrade media for Windows Server 2022, ensuring you modify the variables as needed. If you have more than one subscription, you must set subscription to use.

```powershell
### START - Modify variables

# Subscription name or id of the VM to be upgraded
$subscription = 'fe44ac4b-46de-4d25-ab3e-7a7985c0d7e6'

# Name of the resource group where the upgrade media Managed Disk will be created. The named resource group is created if it doesn't exist. Set to resource group of the source VM.
$resourceGroup = 'opscalyxrg'

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
$versions = Get-AzVMImage -PublisherName $publisher -Location $location -Offer $offer -Skus $sku | sort-object -Descending {[version] $_.Version	}
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

1. Go the the virtual machine in the Azure portal
1. To the left, select **Settings**, then **Disks**
1. Select **Attach existing disks**
1. In the drop-down for **LUN** keep 0 (or first free LUN)
1. In the drop-down for **Disk name**, select the name of the upgrade disk created in the previous step.
1. Click **Apply** to attach the upgrade disk to the VM.

## Disable Auto-shutdown

If there are any VM auto-shutdown that can impact upgrade process, disable it temporarily.

## Perform in-place upgrade (Windows Server 2016, 2019, or 2022)

Connect to the VM using RDP. Determine the drive letter for the upgrade disk
(typically `E:` if there are no other data disks), then start an elevated
Windows&nbsp;Powershell and run:

```powershell
# Change to correct folder on E: drive if other target OS.
cd 'E:\Windows Server 2022'
.\setup.exe /auto upgrade /dynamicupdate disable /eula accept
```

Window Server upgrade process will start. After a short while you need to
select image to upgrade to - choose desktop experience, and the same edition
as the existing :

![Windows Server Setup screen titled 'Select Image'. The user is prompted to select the image to install. Four operating system options are listed: Windows Server 2022 Standard, Windows Server 2022 Standard (Desktop Experience), Windows Server 2022 Datacenter, and Windows Server 2022 Datacenter (Desktop Experience), all in the en-US language. A note below indicates that the non-Desktop Experience versions omit most graphical elements and are managed via command prompt, PowerShell, or remote tools. 'Next' and 'Back' buttons appear at the bottom.](/public/blog-images/win2019-setup-select-image.png)

The upgrade process will continue and use unattended installation.

> [!IMPORTANT]
> The image plan information will not change after the upgrade process.

## Re-enable firewall. anti-virus and anti-spyware

```powershell
Set-NetFirewallProfile -Profile Domain,Private,Public -Enabled 'True'
Set-MpPreference -DisableRealtimeMonitoring $false
```

Verify with:

```powershell
Get-NetFirewallProfile | Select-Object Name, Enabled
(Get-MpPreference).DisableRealtimeMonitoring
```

## Post upgrade steps

Once the upgrade process has completed successfully the following steps should be taken to clean up any artifacts which were created during the upgrade process:

- Delete the snapshots of the OS disk and data disk(s) if they were created.
- Disconnect the upgrade media Managed Disk from the VM that was upgrade.
- Delete the upgrade media Managed Disk.
- Enable antivirus, anti-spyware, or firewall software that may have been disabled at the start of the upgrade process.
