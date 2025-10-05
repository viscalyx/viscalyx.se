---
title: 'Time Machine Network Backup Server on Hyper-V'
date: '2025-08-15'
author: 'Johan Ljunggren'
excerpt: 'A step-by-step recipe for hosting a macOS-compatible Time Machine target inside an Ubuntu Server VM on Hyper-V (Windows 11), plus a troubleshooting checklist for the common "read-only share" error.'
image: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=1200&h=600&fit=crop&crop=center'
tags: ['Hyper-V', 'macOS', 'Time Machine', 'Ubuntu', 'Samba', 'Backup']
category: 'Infrastructure'
readTime: '12 min read'
---

A step-by-step guide for hosting a **macOS-compatible Time Machine target** inside an Ubuntu Server VM on Hyper-V (Windows 11)

## 1 - Hardware & Hyper-V preparation

### Step 1: Plug in the empty 1 TB disk

Use USB-C or internal SATA. Leave it **un-formatted** in Windows.

### Step 2: Create the VHDX file

**Hyper-V Manager > Action > New > Virtual Hard Disk...**

- **VHDX**, dynamic
- Location: the 1 TB drive
- Name: `TimeMachineData.vhdx`
- Size: 1 TB (or a bit less)

> [!TIP]
> VHDX is portable and snapshot-friendly.

## 2 - Create the Ubuntu Server VM

1. **Hyper-V Manager → New ▸ Virtual Machine…**
   - Generation 2, **disable Secure Boot**.
   - 4 GB RAM minimum.
   - Attach **Ubuntu Server 24.04 LTS** ISO.
   - Add `TimeMachineData.vhdx` as _second_ drive.
2. Install Ubuntu with default partitioning for the system disk; leave the 1 TB VHDX untouched.
3. Enable **OpenSSH Server** during install.

> [!TIP]
> A suggestion is to add the second drive _after_ installation, to
> avoid that the installer tries to use it as the primary disk or stores
> swap (or other data) on it.

## 3 - Prepare the backup volume in Ubuntu

```bash
sudo -i                      # become root
lsblk                        # identify /dev/sdb
parted /dev/sdb --script mklabel gpt mkpart primary ext4 0% 100%
mkfs.ext4 -L TimeMachine /dev/sdb1
mkdir -p /srv/timemachine
echo "UUID=$(blkid -s UUID -o value /dev/sdb1) /srv/timemachine ext4 defaults,user_xattr,acl 0 2" >> /etc/fstab
mount -a
```

## 4 - Install & configure Samba + Avahi

```bash
apt update
apt install -y samba avahi-daemon

adduser --disabled-login tmbackup
smbpasswd -a tmbackup
```

Append to **/etc/samba/smb.conf**:

```ini
[timemachine]
   path = /srv/timemachine
   guest ok = no
   valid users = tmbackup
   force user = tmbackup
   read only = no
   write list = tmbackup

   vfs objects = fruit streams_xattr
   fruit:time machine = yes
   fruit:time machine max size = 900G
   fruit:metadata = stream
   fruit:model = MacPro7,1
```

```bash
systemctl restart smbd nmbd
systemctl enable smbd nmbd avahi-daemon
```

## 5 - Optional: UFW firewall

```bash
apt install -y ufw
ufw allow OpenSSH
ufw allow samba
ufw enable
```

## 6 - Configure macOS Sonoma Time Machine

1. **Finder > Go > Connect to Server** > `smb://backup01.company.se/timemachine`
   - Log in as **tmbackup**, save in keychain.
2. **System Settings > General > Time Machine** > **Add Backup Disk…**
   - Select the network volume.
   - Choose **Encrypt** if desired.

## 7 - Ongoing housekeeping

| Task                              | Command                     |
| --------------------------------- | --------------------------- |
| Check active shares               | `smbstatus --shares`        |
| Watch network traffic             | `iftop -i eth0`             |
| Ubuntu security updates           | `sudo apt upgrade` (weekly) |
| Hyper-V snapshot (only when idle) | Create Checkpoint           |

## 8 - Troubleshooting “does not allow reading, writing and appending”

### 8.1 - Fix directory ownership & mode

```bash
sudo chown -R tmbackup:tmbackup /srv/timemachine
sudo chmod 750 /srv/timemachine      # or 770
```

A quick note on those permission modes:

- `750` grants full access (read/write/execute) to the owner (`tmbackup`), read and execute to the group, and no access to others. Use this when you want the share accessible only to the tmbackup account and any users in its group.
- `770` is slightly more permissive for collaborators: it grants full access to owner and group, and still denies others. Choose `770` if you have multiple system accounts in the same group that should be able to write to the share (for example, if you manage backups from several service accounts).

In both cases the share remains closed to "others" (world), which helps avoid accidental guest access from macOS clients.

### 8.2 - Ensure xattrs & ACLs

_The `user_xattr,acl` mount options **must** appear in `/etc/fstab`._

```bash
sudo mount -o remount /srv/timemachine
mount | grep /srv/timemachine        # confirm options
```

### 8.3 - Verify Samba isn’t mapping to guest

_Check UID in_ `smbstatus --shares`. Should be the tmbackup UID, **not 65534**.

### 8.4 - Reconnect from macOS

1. Remove old entry in Time Machine.
2. Reconnect via Finder with the **FQDN** (avoids Bonjour alias).

### 8.5 - Quick checklist

| Check              | Command                                                   |
| ------------------ | --------------------------------------------------------- |
| Share writable?    | `smbclient -U tmbackup -L //backup01/timemachine`         |
| xattrs work?       | `setfattr -n user.test -v 1 /srv/timemachine/.xattr-test` |
| Live file creation | `sudo inotifywait -m /srv/timemachine` during connection  |

> [!NOTE]
> Once the hidden file `.com.apple.timemachine.supported` and the `<Mac-Name>.sparsebundle` appear in `/srv/timemachine`, Time Machine sees the share as fully read/write.
