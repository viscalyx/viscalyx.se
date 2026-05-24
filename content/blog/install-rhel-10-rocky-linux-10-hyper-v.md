---
title: 'Install RHEL 10 or Rocky Linux 10 on Hyper-V'
date: '2026-05-24'
author: 'Johan Ljunggren'
excerpt: 'Install RHEL 10 or Rocky Linux 10 on Hyper-V with secure Gen 2 VM settings, storage layout, networking, post-install checks, and Rocky notes.'
image: '/abstract-hyper-v-gen2-rocky-linux-10-vm-installation.png'
imageAlt: 'Hyper-V host console showing a Generation 2 Linux virtual machine installing RHEL 10 or Rocky Linux 10 with secure boot, storage layout, and network settings.'
tags:
  - 'RHEL'
  - 'Rocky Linux'
  - 'Hyper-V'
  - 'Linux'
  - 'Virtualization'
  - 'Infrastructure'
category: 'Infrastructure'
readTime: '16 min read'
---

<!-- cSpell:ignore AppStream chrony chronyd Cockpit firewalld hypervkvpd -->
<!-- cSpell:ignore hypervfcopyd hypervvssd noexec nosuid nodev rhsm UEFI -->
<!-- cSpell:ignore VHDX vSwitch xfsprogs x86_64 XFS Anaconda OpenSCAP -->
<!-- cSpell:ignore setroubleshoot sshd mntops fcopy Hypervisors -->
<!-- cSpell:ignore vmbus netvsc storvsc -->

This guide builds a practical **RHEL 10** or **Rocky Linux 10** virtual
machine on Microsoft Hyper-V. The goal is a VM you can actually use for
services, automation, and lab infrastructure, not only a disposable shell.

The default choices are intentionally a little more serious than the fastest
possible install:

- Generation 2 VM
- Secure Boot enabled with the Microsoft UEFI Certificate Authority template
- 4 vCPU and 16 GiB RAM
- 160 GiB dynamic VHDX
- XFS on LVM with separate log, audit, temp, and user filesystems
- External Hyper-V virtual switch
- SELinux enforcing and firewalld enabled
- RHEL-first commands with Rocky Linux notes where the workflow differs

If you are building a tiny throwaway lab VM, you can reduce the CPU, RAM, and
disk sizes. If you are building something that might live for more than a few
days, the defaults below give you room to patch, log, troubleshoot, and grow.

## Prerequisites

You need:

- A Windows 11 Pro/Enterprise or Windows Server host with Hyper-V enabled
- An external Hyper-V virtual switch
- A RHEL 10 or Rocky Linux 10 x86_64 ISO
- A host CPU that satisfies the x86-64-v3 baseline used by these releases
- Enough host storage for a dynamic 160 GiB VHDX to grow over time

For RHEL, download the ISO from Red Hat and use a valid Red Hat subscription.
For Rocky Linux, download the Rocky Linux 10 ISO from the Rocky mirrors.

> [!NOTE]
> Rocky Linux does not use Red Hat Subscription Management. The installer flow
> is similar, but the post-install repository and update steps are simpler.
> The most important Rocky-specific warning is the x86-64-v3 CPU baseline on
> older lab hardware.

## Recommended VM Shape

<!-- markdownlint-disable MD013 -->
| Setting | Recommended value | Notes |
| ------- | ----------------- | ----- |
| VM generation | Generation 2 | Required for UEFI firmware and modern Secure Boot behavior. |
| Secure Boot | Enabled | Use the Microsoft UEFI Certificate Authority template for Linux guests. |
| vCPU | 4 | Reduce to 2 for a small shell-only VM. |
| RAM | 16 GiB, static | Reduce if the host is constrained. Static memory is predictable for servers. |
| OS disk | 160 GiB dynamic VHDX | Dynamic saves host space initially while leaving room inside the guest. |
| Disk controller | SCSI | Generation 2 VMs use SCSI disks by default. |
| Network | Synthetic NIC on external vSwitch | Use the Default Switch only for quick local labs. |
| Checkpoints | Production checkpoints | Useful before major changes, but not a backup strategy. |
<!-- markdownlint-enable MD013 -->

Use an additional VHDX for long-lived application data. Mount it under a
service-specific path such as `/srv`, `/srv/app`, or `/var/lib/<service>` once
you know what the VM will run. That keeps operating system growth and workload
growth from fighting over the same free space.

## Create The VM With PowerShell

Run PowerShell as an administrator on the Hyper-V host. Adjust the ISO path,
VM location, and switch name before running the commands.

<!-- markdownlint-disable MD013 -->
```powershell
$VmName = 'linux10-lab01'
$IsoPath = 'D:\ISO\rhel-10.0-x86_64-dvd.iso'
$VmRoot = 'D:\Hyper-V\Virtual Machines'
$SwitchName = 'External vSwitch'
$OsDisk = Join-Path $VmRoot "$VmName\$VmName-os.vhdx"

New-Item -ItemType Directory -Path (Split-Path $OsDisk) -Force

New-VHD -Path $OsDisk -Dynamic -SizeBytes 160GB

New-VM `
  -Name $VmName `
  -Generation 2 `
  -MemoryStartupBytes 16GB `
  -VHDPath $OsDisk `
  -SwitchName $SwitchName `
  -Path $VmRoot

Set-VMProcessor -VMName $VmName -Count 4
Set-VMMemory -VMName $VmName -DynamicMemoryEnabled $false

Set-VMFirmware `
  -VMName $VmName `
  -EnableSecureBoot On `
  -SecureBootTemplate 'MicrosoftUEFICertificateAuthority'

Set-VM `
  -Name $VmName `
  -CheckpointType Production `
  -AutomaticCheckpointsEnabled $false

Add-VMDvdDrive -VMName $VmName -Path $IsoPath
$DvdDrive = Get-VMDvdDrive -VMName $VmName
Set-VMFirmware -VMName $VmName -FirstBootDevice $DvdDrive
```
<!-- markdownlint-enable MD013 -->

If your network uses tagged VLANs, set the VLAN on the VM adapter before you
start the installer:

```powershell
Set-VMNetworkAdapterVlan -VMName $VmName -Access -VlanId 20
```

Verify the firmware settings:

<!-- markdownlint-disable MD013 -->
```powershell
Get-VMFirmware -VMName $VmName |
  Select-Object VMName, SecureBoot, SecureBootTemplate, BootOrder
```
<!-- markdownlint-enable MD013 -->

Start the VM and connect to the console:

```powershell
Start-VM -Name $VmName
vmconnect.exe localhost $VmName
```

### Hyper-V Manager Checklist

If you prefer the GUI, use **Hyper-V Manager > New > Virtual Machine** and
match the same settings:

1. Name the VM.
1. Choose **Generation 2**.
1. Assign **16 GiB** startup memory and leave Dynamic Memory disabled.
1. Connect the VM to an **external virtual switch**.
1. Create a **160 GiB dynamic VHDX**.
1. Attach the RHEL 10 or Rocky Linux 10 ISO.
1. Open **Settings > Security**.
1. Keep **Enable Secure Boot** checked.
1. Set the template to **Microsoft UEFI Certificate Authority**.
1. Open **Processor** and set **4 virtual processors**.
1. Use **Production checkpoints** and disable automatic checkpoints.

If the installer does not boot, check the Secure Boot template first. Disable
Secure Boot only as a troubleshooting step after confirming the template is
correct.

## Install RHEL Or Rocky

Boot from the ISO and follow the installer. The exact labels vary slightly
between RHEL and Rocky, but the flow is the same:

1. Select language and keyboard.
1. Set time zone and NTP.
1. Select **Minimal Install** unless you need a GUI.
1. Configure the network adapter and hostname.
1. Create a named admin user and allow it to use `sudo`.
1. Leave root password login disabled unless your policy requires it.
1. Open **Installation Destination** and use manual partitioning.

> [!TIP]
> If the VM will be reachable by name, set the final hostname during install.
> It makes logs, SSH prompts, certificates, and monitoring much easier to
> understand later.

### Storage Layout

Red Hat's installer documentation shows the normal base partitions for RHEL,
and its security guidance calls out separate filesystems for user data, temp
space, and audit logs. For this VM, use XFS on LVM and leave some volume group
space unallocated for future growth.

<!-- markdownlint-disable MD013 -->
| Mount point | Size | Type | Notes |
| ----------- | ---- | ---- | ----- |
| `/boot/efi` | 500 MiB | EFI System Partition | Required for UEFI boot. |
| `/boot` | 1 GiB | XFS or ext4 | Keep outside LVM. |
| `/` | 30 GiB | XFS on LVM | Operating system root. |
| `/home` | 10 GiB | XFS on LVM | User files and SSH keys. |
| `/tmp` | 4 GiB | XFS on LVM | Temporary files, mounted with stricter options. |
| `/var` | 30 GiB | XFS on LVM | Package cache, service state, and variable data. |
| `/var/tmp` | 4 GiB | XFS on LVM | Persistent temporary files. |
| `/var/log` | 10 GiB | XFS on LVM | System and service logs. |
| `/var/log/audit` | 5 GiB | XFS on LVM | Audit logs isolated from the rest of `/var/log`. |
| `swap` | 4-8 GiB | LVM swap | Keep modest swap even with 16 GiB RAM. |
| unallocated | Remaining space | LVM free space | Reserve for extending filesystems later. |
<!-- markdownlint-enable MD013 -->

> [!NOTE]
> Red Hat notes that virtual machines can often rely on expandable disks, and
> some environments prefer a simpler partition layout. I still like this layout
> for service VMs because `/tmp`, `/var/log`, and `/var/log/audit` can fill up
> without taking the whole system down.

After first boot, tighten mount options in `/etc/fstab`. The exact device
names depend on the logical volume names created by the installer, so edit the
existing lines instead of copying this block blindly.

```text
/home           xfs   defaults,nodev,nosuid          0 0
/tmp            xfs   defaults,nodev,nosuid,noexec   0 0
/var/tmp        xfs   defaults,nodev,nosuid,noexec   0 0
/var/log        xfs   defaults,nodev,nosuid,noexec   0 0
/var/log/audit  xfs   defaults,nodev,nosuid,noexec   0 0
```

Then remount and verify:

```bash
sudo systemctl daemon-reload
sudo mount -o remount /home
sudo mount -o remount /tmp
sudo mount -o remount /var/tmp
sudo mount -o remount /var/log
sudo mount -o remount /var/log/audit
findmnt /home /tmp /var/tmp /var/log /var/log/audit
```

Do not set `noexec` on `/var` itself. Many real services store runtime files
there, and over-hardening `/var` tends to break useful software in surprising
ways.

## Register And Update

For RHEL, register the system and enable the standard RHEL 10 repositories.
Use your organization's activation key workflow if that is how you manage
subscriptions.

<!-- markdownlint-disable MD013 -->
```bash
sudo subscription-manager register
sudo subscription-manager attach --auto

sudo subscription-manager repos \
  --enable=rhel-10-for-x86_64-baseos-rpms \
  --enable=rhel-10-for-x86_64-appstream-rpms

sudo dnf clean all
sudo dnf update -y
```
<!-- markdownlint-enable MD013 -->

For Rocky Linux, skip `subscription-manager` and update directly:

```bash
sudo dnf update -y
```

Reboot if the update installs a new kernel:

```bash
sudo reboot
```

## Install Hyper-V And Admin Packages

RHEL and Rocky include Hyper-V kernel drivers. Install the user-space daemons
so Hyper-V can exchange key/value data, coordinate backup-related operations,
and support file copy integration where available.

<!-- markdownlint-disable MD013 -->
```bash
sudo dnf install -y \
  hyperv-daemons \
  chrony \
  vim-enhanced \
  git \
  curl \
  wget \
  tar \
  rsync \
  policycoreutils-python-utils \
  setroubleshoot-server

sudo systemctl enable --now \
  hypervkvpd.service \
  hypervvssd.service \
  hypervfcopyd.service \
  chronyd.service
```
<!-- markdownlint-enable MD013 -->

Verify the Hyper-V services:

```bash
systemctl --no-pager --full status \
  hypervkvpd.service \
  hypervvssd.service \
  hypervfcopyd.service
```

Check that the Hyper-V kernel modules are loaded:

```bash
lsmod | grep '^hv_'
```

You should see modules such as `hv_vmbus`, `hv_netvsc`, `hv_storvsc`, and
possibly `hv_utils` or `hv_balloon`, depending on the guest and workload.

## Time Sync

OIDC tokens, Kerberos, package mirrors, certificates, and logs all become
annoying when VM time drifts. Keep `chronyd` enabled and let it use your normal
network time sources.

```bash
timedatectl status
chronyc tracking
chronyc sources -v
```

Hyper-V also offers host time synchronization. That is useful during boot and
resume, but `chronyd` should still be the guest's normal time authority.

## Network Configuration

Use an external Hyper-V virtual switch for a VM that will run services. The
Default Switch and NAT-style lab networks are fine for short experiments, but
they are awkward for DNS, certificates, inbound SSH, monitoring, and firewall
rules.

During or after install, configure either:

- A DHCP reservation for the VM MAC address, or
- A static IP address inside the guest.

For a server VM, also create DNS records:

- Forward record: `linux10-lab01.example.com` to the VM IP address
- Reverse record: VM IP address to the hostname

RHEL and Rocky use NetworkManager. To set a static address after install,
adjust the connection name and values:

<!-- markdownlint-disable MD013 -->
```bash
nmcli connection show

sudo nmcli connection modify 'System eth0' \
  ipv4.method manual \
  ipv4.addresses 192.0.2.50/24 \
  ipv4.gateway 192.0.2.1 \
  ipv4.dns '192.0.2.10 192.0.2.11' \
  ipv6.method disabled

sudo nmcli connection up 'System eth0'
ip address show
ip route show
```
<!-- markdownlint-enable MD013 -->

If your network uses IPv6, configure it deliberately rather than disabling it.
The example above disables IPv6 only to keep the static IPv4 example compact.

## Baseline Hardening

Keep SELinux and firewalld enabled. They are part of the platform, not optional
extras.

```bash
getenforce
sudo systemctl enable --now firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

Verify SSH's effective root login policy:

```bash
sudo sshd -T | grep '^permitrootlogin'
```

For most service VMs, use a named admin account with SSH keys and `sudo`.
Avoid direct root SSH login and avoid password-based root access.

If you want Cockpit web management, install it explicitly and open the service:

```bash
sudo dnf install -y cockpit
sudo systemctl enable --now cockpit.socket
sudo firewall-cmd --permanent --add-service=cockpit
sudo firewall-cmd --reload
```

Cockpit listens on `9090/tcp`. Do not open it broadly on shared networks.
Restrict it at the network firewall, host firewall, or both.

### Compliance Profiles

This post is not a CIS, DISA STIG, or OSPP compliance build guide. RHEL can
apply security profiles during installation, and OpenSCAP can validate systems
against formal profiles after installation.

If you need a certified compliance baseline, choose that profile in the
installer or generate the system from an approved Kickstart or image-builder
workflow. Treat the layout in this post as a practical secure baseline, not a
compliance attestation.

## Useful Host-Side Checks

From the Hyper-V host, confirm the VM is using the expected firmware,
checkpoint, memory, CPU, and network settings:

<!-- markdownlint-disable MD013 -->
```powershell
Get-VM -Name $VmName |
  Select-Object Name, Generation, State, CheckpointType, AutomaticCheckpointsEnabled

Get-VMMemory -VMName $VmName |
  Select-Object Startup, DynamicMemoryEnabled, Minimum, Maximum

Get-VMProcessor -VMName $VmName |
  Select-Object Count, CompatibilityForMigrationEnabled

Get-VMFirmware -VMName $VmName |
  Select-Object SecureBoot, SecureBootTemplate

Get-VMNetworkAdapter -VMName $VmName |
  Select-Object Name, SwitchName, MacAddress, Status, IpAddresses
```
<!-- markdownlint-enable MD013 -->

Take a checkpoint after the first clean boot and update, then remove old
checkpoints once you no longer need them. Checkpoints are useful before risky
changes, but they are not backups. Use normal guest-aware backup for systems
you care about.

## Troubleshooting

<!-- markdownlint-disable MD013 -->
| Symptom | Likely cause | Fix |
| ------- | ------------ | --- |
| Installer does not boot | Wrong Secure Boot template | Use Microsoft UEFI Certificate Authority. |
| VM fails on an old host | CPU does not meet x86-64-v3 baseline | Move to newer hardware or use an older OS release. |
| No network during install | Wrong vSwitch, VLAN, or disconnected adapter | Verify the external switch and VLAN settings on the host. |
| RHEL cannot install packages | System is not registered or repos are disabled | Register with RHSM and enable BaseOS/AppStream. |
| Rocky cannot install packages | Mirror or DNS problem | Check DNS, default route, and mirror reachability. |
| SSH works only from the host | VM is on Default Switch or NAT network | Move it to an external vSwitch for server use. |
| Audit logs fill quickly | `/var/log/audit` too small for policy volume | Extend the logical volume and filesystem. |
<!-- markdownlint-enable MD013 -->

To extend an XFS logical volume later, use the logical volume path shown by
`lvs` and grow the filesystem online:

<!-- markdownlint-disable MD013 -->
```bash
sudo lvs
sudo lvextend -r -L +10G /dev/mapper/rhel-var_log
```
<!-- markdownlint-enable MD013 -->

The `-r` flag grows the filesystem after extending the logical volume.

## Where Rocky Differs

Most of the Hyper-V and installer choices are the same for RHEL 10 and Rocky
Linux 10. The differences to remember are:

- Rocky uses Rocky mirrors, not the Red Hat Customer Portal.
- Rocky does not use `subscription-manager`.
- Rocky's BaseOS and AppStream repositories are available after install.
- Rocky support expectations are different from Red Hat enterprise support.
- Rocky's release notes explicitly call out the x86-64-v3 CPU baseline.

For lab and community-supported systems, Rocky is a strong RHEL-compatible
choice. For systems that need Red Hat support, lifecycle commitments, or vendor
certification, use RHEL.

## Further Reading

- Microsoft Learn: supported RHEL and CentOS virtual machines on Hyper-V [1]
- Microsoft Learn: Generation 2 VM security settings for Hyper-V [2]
- Red Hat: RHEL 10 architecture considerations [3]
- Red Hat: manual partitioning during RHEL 10 installation [4]
- Red Hat: RHEL 10 audit configuration and `/var/log/audit` guidance [5]
- Rocky Linux: installation guide [6]
- Rocky Linux: 10.0 release notes [7]
- Rocky Linux: x86-64-v3 CPU compatibility check [8]

[1]: https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/supported-centos-and-red-hat-enterprise-linux-virtual-machines-on-hyper-v 'Supported CentOS and Red Hat Enterprise Linux virtual machines on Hyper-V'
[2]: https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/learn-more/generation-2-virtual-machine-security-settings-for-hyper-v 'Generation 2 virtual machine security settings for Hyper-V'
[3]: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/considerations_in_adopting_rhel_10/architectures 'RHEL 10 architecture considerations'
[4]: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/interactively_installing_rhel_from_installation_media/customizing-the-system-in-the-installer 'RHEL 10 installer customization'
[5]: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/risk_reduction_and_recovery_operations/auditing-the-system 'RHEL 10 auditing the system'
[6]: https://docs.rockylinux.org/guides/installation/ 'Rocky Linux installation guide'
[7]: https://docs.rockylinux.org/release_notes/10_0/ 'Rocky Linux 10.0 release notes'
[8]: https://docs.rockylinux.org/gemstones/test_cpu_compat/ 'Rocky Linux x86-64-v3 CPU compatibility check'
