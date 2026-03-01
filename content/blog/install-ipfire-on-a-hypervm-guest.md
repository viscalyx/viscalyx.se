---
title: 'Install IPFire on a Hyper-V Guest'
date: '2025-06-22'
author: 'Johan Ljunggren'
excerpt: 'Learn how to deploy IPFire on Microsoft Hyper-V with Generation 2 VMs, multiple network interfaces, and post-install configuration.'
image: '/team-install-ipfire.png'
imageAlt: 'Four IT professionals—three men and one woman—are in a modern data center, focused on deploying IPFire using Microsoft Hyper-V with Generation 2 virtual machines. They are gathered around a desk with a large monitor displaying IPFire setup steps, including multiple network interfaces and post-install configuration options like network setup and password settings. Server racks with organized cables line the background, emphasizing the technical environment.'
tags:
  - 'IPFire'
  - 'Hyper-V'
  - 'Virtualization'
  - 'Firewall'
  - 'Networking'
  - 'Linux'
category: 'Virtualization'
readTime: '9 min read'
---

> [!WARNING]
> This guide is an AI-generated draft, it is still WIP! Goal would be to have
> it as a part of a guide to set up a lab environment.

**TL;DR** — You can run IPFire (version **2.29 – Core 195** as of 2025-06) on
Microsoft Hyper-V in about 30 minutes. Create a Generation 2 VM, turn **Secure
Boot** off, attach **two or more NICs** for the IPFire color-coded zones, boot
from the ISO and finish the console wizard; afterward reach the WebUI at
`https://<GREEN-IP>:444`. Detailed, copy-ready steps follow.

## Prerequisites

<!-- markdownlint-disable MD013 -->
| Item | Minimum      | Recommended                          |
| ---- | ------------ | ------------------------------------ |
| CPU  | 1 GHz x86-64 | ≥2 vCPU with AES-NI if you plan VPNs |
| RAM  | 1 GiB        | 2–4 GiB for proxy/IDS                |
| Disk | 2 GiB        | ≥4 GiB for logs & add-ons            |
| NICs | 2            | 3–4 for DMZ/ Wi-Fi zones             |
<!-- markdownlint-enable MD013 -->

IPFire’s official hardware page lists those figures and stresses that **at least
two Ethernet adapters** are mandatory ([IPFire.org][1]).
Download the current ISO (`x86_64`, ~550 MB) from the release
page ([IPFire.org][2]) and verify its SHA256 checksum.

## 1 – Plan your network setup

<!-- markdownlint-disable MD013 -->
<img src="/blog-images/ipfire-deploy.png" alt="IPFire network zone deployment diagram" style="float: right; margin: 0 0 1rem 1rem; max-width: 400px; height: auto;" />
<!-- markdownlint-enable MD013 -->

IPFire separates traffic into up to four security zones:

- **RED** = WAN/untrusted
- **GREEN** = trusted LAN
- **BLUE** = Wi-Fi clients
- **ORANGE** = DMZ

The Zone Configuration doc explains their defaults and how traffic is
isolated ([IPFire.org][3]). If you only need Internet + LAN, stick with
GREEN+RED; add BLUE or ORANGE later.

## 2 – Prepare Hyper-V

### 2.1 Create virtual switches

Open **Hyper-V Manager → Virtual Switch Manager** and create one external switch
per IPFire NIC you plan (e.g. `vSwitch_WAN`, `vSwitch_LAN`) ([Microsoft
Learn][4]).

### 2.2 New VM wizard

1. **New → Virtual Machine** → _Next_([Microsoft Learn][4])
1. Name: `IPFire`
1. **Generation 2** (UEFI) — offers synthetic devices for better
   throughput ([Microsoft Learn][5])
1. Startup memory ≥ 1024 MB (enable Dynamic Memory if desired)([Microsoft
   Learn][4])
1. Connect first NIC to `vSwitch_WAN`.
1. Create a 20 GB-plus VHDX (thin) on SCSI.
1. Boot media → ISO you downloaded.
1. Finish.

> **Disable Secure Boot** (required by IPFire’s current kernel):
> `Set-VMFirmware -VMName "IPFire" -EnableSecureBoot Off`([Microsoft Learn][6])
> You can also un-tick **Enable Secure Boot** in VM Settings →
> Security ([Microsoft Learn][7]).
> If you forget, the VM will stall at EFI boot or the installer will ignore
> keyboard input ([Ask Ubuntu][8], [IPFire Community][9]).

### 2.3 Add extra adapters

While the VM is **Off**, add one synthetic NIC per extra zone and bind each to
the matching vSwitch. Hyper-V synthetic vs. legacy adapter pros/cons are
discussed in the Altaro/Dojo article ([altaro.com][10]).

### 2.4 If Generation 2 fails

Some users report the installer freezing at the language screen on Gen-2; Gen-1
works reliably as a fall-back ([IPFire Community][9]).

## 3 – Boot & run the IPFire installer

1. **Start** the VM and open the console.
1. Choose _Install IPFire x86_64_ at GRUB.
1. Select language → **Start installation** → accept license ([IPFire.org][11]).
1. Confirm disk erase, choose filesystem (Ext4/XFS).
1. Set timezone, hostname, root + admin passwords.
1. Reboot into the _setup_ utility.

## 4 – Assign NICs & zones

In the text setup:

1. Select _Network Configuration Type_ (e.g. **GREEN + RED**).
1. Under _Drivers & Card Assignments_ link each MAC to a color. Note that
   IPFire shows NIC MACs; map them to the correct VM NIC using Hyper-V:
   - In PowerShell, list each adapter and its MAC address:

     <!-- markdownlint-disable MD013 -->
     ```powershell
     Get-VMNetworkAdapter -VMName "IPFire" | Select-Object Name, MacAddress
     ```
     <!-- markdownlint-enable MD013 -->

   - Or use the dedicated MAC command:

     <!-- markdownlint-disable MD013 -->
     ```powershell
     Get-VMNetworkAdapterMacAddress -VMName "IPFire"
     ```
     <!-- markdownlint-enable MD013 -->

   - Compare the MAC addresses shown in the installer with the output above to
     assign each adapter to a zone.

1. Give GREEN a static LAN (e.g. 192.168.1.220/24); leave RED to DHCP or set
   static from your ISP. See also
   [Configure NAT for nested Hyper-V VM on Azure VM host](/blog/configure-nat-azure-vm-hyperv-host)
1. Finish and reboot.

## 5 – First login & updates

From a LAN host browse to **`https://192.168.1.1:444`** and log in as **admin**
with the password you set. Immediately open **Pakfire → Update Lists → Upgrade**
to apply any new Core Updates (latest is Core 195) ([IPFire.org][2]).

## 6 – Post-install Hyper-V tweaks (optional)

- **Checkpoints**: take a Hyper-V checkpoint after a clean install and again
  before major upgrades.
- **Dynamic Memory**: works fine; keep _Startup_ ≥ 1024 MB as per Microsoft
  guidance ([Microsoft Learn][4]).
- **Integration Services**: modern kernels include LIS out of the box, so
  synthetic NICs, time sync, and live migration function without extra
  drivers ([Microsoft Learn][6]).
- **vRSS / SR-IOV**: if your NIC and vSwitch support SR-IOV, you can enable it
  for maximum throughput ([altaro.com][10]).

## 7 – Troubleshooting

<!-- markdownlint-disable MD013 -->
| Symptom                               | Fix                                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| VM hangs at EFI or keyboard dead      | Secure Boot still on – disable and power-cycle([Ask Ubuntu][8], [Microsoft Learn][7])                     |
| “Setting up Pakfire…” freeze on Gen-2 | Use Gen-1 temporarily; bug tracked in community thread([IPFire Community][9])                             |
| No network in RED                     | Ensure correct vSwitch binding and that your ISP link hands out DHCP; double-check NIC ↔ zone mapping     |
| WebUI unreachable                     | Confirm GREEN IP, browser uses HTTPS port 444, and that local machine is on GREEN subnet([IPFire.org][3]) |
<!-- markdownlint-enable MD013 -->

## 8 – Keeping the firewall healthy

- Schedule **Pakfire automatic updates** and review Core Update release notes
  regularly ([IPFire.org][2]).
- Back up the configuration via **IPFire → Backup** and export it to secure
  storage.
- Snapshot the VM before major rule or add-on changes.
- Monitor logs under **Status → Logs** or ship them to an external syslog
  server.

### Reference quick-commands

<!-- markdownlint-disable MD013 -->
```powershell
# Turn off Secure Boot if you skipped it:
Set-VMFirmware -VMName "IPFire" -EnableSecureBoot Off   # Hyper-V GS ≥ 2019
```
<!-- markdownlint-enable MD013 -->

<!-- markdownlint-disable MD013 -->
```bash
# Update IPFire from the console
pakfire update && pakfire upgrade -y
```
<!-- markdownlint-enable MD013 -->

### Further reading

- Linux on Hyper-V feature matrix & LIS notes([Microsoft Learn][6])

[1]: https://www.ipfire.org/docs/hardware/requirements 'www.ipfire.org - System Requirements'
[2]: https://www.ipfire.org/downloads 'www.ipfire.org - IPFire 2.29 - Core Update 195'
[3]: https://www.ipfire.org/docs/configuration/network/zoneconf 'Zone Configuration - www.ipfire.org'
[4]: https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/get-started/create-a-virtual-machine-in-hyper-v 'Create a virtual machine in Hyper-V | Microsoft Learn'
[5]: https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v 'Should I create a generation 1 or 2 virtual machine in Hyper-V? | Microsoft Learn'
[6]: https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/supported-ubuntu-virtual-machines-on-hyper-v 'Supported Ubuntu virtual machines on Hyper-V | Microsoft Learn'
[7]: https://learn.microsoft.com/en-us/powershell/module/hyper-v/set-vmfirmware 'Set-VMFirmware (Hyper-V) | Microsoft Learn'
[8]: https://askubuntu.com/questions/384110/can-i-use-hyper-v-gen-2-with-ubuntu 'windows 8 - Can I use Hyper-V gen 2 with Ubuntu? - Ask Ubuntu'
[9]: https://community.ipfire.org/t/hyper-v-gen-2-vm-installation/1046 'Hyper-v gen 2 vm installation - Getting Started with IPFire - IPFire Community'
[10]: https://www.altaro.com/hyper-v/hyper-v-virtual-hardware-emulated-synthetic-and-sr-iov/ 'Hyper-V Virtual Hardware: Emulated, Synthetic and SR-IOV - DOJO'
[11]: https://www.ipfire.org/docs/installation/step3 'Step 3: Run the installer - IPFire'
