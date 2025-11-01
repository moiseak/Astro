---
layout: /src/layouts/MarkdownPostLayout.astro
title: Centos7更新gcc到9
description: Centos7停止维护后修改yum源，更新gcc
pubDate: 2025-01-12
---
Centos7已经与2024年6月30日停止维护，yum源也无法使用了。
如果运行
```
yum -y install centos-release-scl
```
会得到
```
Could not retrieve mirrorlist http://mirrorlist.centos.org/?release=7&arch=x86_64&repo=os&infra=stock error was
14: curl#6 - "Could not resolve host: mirrorlist.centos.org; 未知的错误"
```
此时可以
```
sed -i s/mirror.centos.org/vault.centos.org/g /etc/yum.repos.d/*.repo
sed -i s/^#.*baseurl=http/baseurl=http/g /etc/yum.repos.d/*.repo
sed -i s/^mirrorlist=http/#mirrorlist=http/g /etc/yum.repos.d/*.repo
sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-*
```
之后
```
yum clean all
yum makecache
```
然后就可以安装centos-release-scl了
```
yum -y install centos-release-scl
```
安装完之后我们进入`/etc/yum.repos.d/`可以发现多了两个repo
```
cd /etc/yum.repos.d/
```

`CentOS-SCLo-scl.repo`和`CentOS-SCLo-scl-rh.repo`
```
ll
总用量 48
-rw-r--r--. 1 root root 1669 1月  10 13:21 CentOS-Base.repo
-rw-r--r--. 1 root root 1309 1月  10 13:21 CentOS-CR.repo
-rw-r--r--. 1 root root  649 1月  10 13:21 CentOS-Debuginfo.repo
-rw-r--r--. 1 root root  315 1月  10 13:21 CentOS-fasttrack.repo
-rw-r--r--. 1 root root  630 1月  10 13:21 CentOS-Media.repo
-rw-r--r--. 1 root root  998 12月 11 2018 CentOS-SCLo-scl.repo
-rw-r--r--. 1 root root  971 10月 29 2018 CentOS-SCLo-scl-rh.repo
-rw-r--r--. 1 root root 1332 1月  10 13:21 CentOS-Sources.repo
-rw-r--r--. 1 root root 8515 1月  10 13:21 CentOS-Vault.repo
-rw-r--r--. 1 root root  618 1月  10 13:21 CentOS-x86_64-kernel.repo
```
对这两个repo进行部分修改
```
vi /etc/yum.repos.d/CentOS-SCLo-scl.repo
```
```
[centos-sclo-sclo]
name=CentOS-7 - SCLo sclo
baseurl=https://mirrors.aliyun.com/centos/7/sclo/x86_64/sclo/
# mirrorlist=http://mirrorlist.centos.org?arch=$basearch&release=7&repo=sclo-sclo
gpgcheck=0
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-SCLo
```

```
vi /etc/yum.repos.d/CentOS-SCLo-scl-rh.repo
```
```
[centos-sclo-rh]
name=CentOS-7 - SCLo rh
baseurl=https://mirrors.aliyun.com/centos/7/sclo/x86_64/rh/
# mirrorlist=http://mirrorlist.centos.org?arch=$basearch&release=7&repo=sclo-rh
gpgcheck=0
enabled=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-SCLo
```
刷新缓存
```
yum repolist
yum clean all
yum makecache
```
之后进入`/opt/`安装gcc9
```
cd /opt/
yum -y install devtoolset-9-gcc*
```
该文件会下载在`/opt/rh/`
```
cd rh/
cd devtoolset-9/
source ./enable
```
检查版本发现更新成功
```
gcc --version
gcc (GCC) 9.3.1 20200408 (Red Hat 9.3.1-2)
```

