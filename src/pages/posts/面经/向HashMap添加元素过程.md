---
layout: /src/layouts/MarkdownPostLayout.astro
title: 向HashMap添加元素过程
description: 向HashMap添加元素过程
pubDate: 2025-04-17
---
![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250417160634.png)

1. 判断键值对数组table是否为空或为null，否则执行resize()进行扩容（初始化）
    
2. 根据键值key计算hash值得到数组索引
    
3. 判断table[i]==null，条件成立，直接新建节点添加
    
4. 如果table[i]==null ,不成立
    
5. 4.1 判断table[i]的首个元素是否和key一样，如果相同直接覆盖value
    
6. 4.2 判断table[i] 是否为treeNode，即table[i] 是否是红黑树，如果是红黑树，则直接在树中插入键值对
    
7. 4.3 遍历table[i]，链表的尾部插入数据，然后判断链表长度是否大于8，大于8的话把链表转换为红黑树，在红黑树中执行插入操 作，遍历过程中若发现key已经存在直接覆盖value
    
8. 插入成功后，判断实际存在的键值对数量size是否超多了最大容量threshold（数组长度*0.75），如果超过，进行扩容。

### 假如key是User对象，这个对象需要做什么特殊处理吗

#### **必须重写 `hashCode()` 和 `equals()` 方法
 
因为HashMap 中存取值，都是依据 key 的 hashCode 值，若未重写，默认使用内存地址计算哈希值，导致​**​相同属性的对象因地址不同而存入不同位置​**​。

`equals()` 用于在哈希冲突时比较键的等价性。若未重写，默认使用 `==` 比较内存地址，导致​**​相同属性的对象被误判为不同键​**​。

#### **​确保对象的不可变性**
 
若 `User` 对象作为键后发生属性修改，会导致哈希值与存储位置不匹配，从而无法正确检索数据