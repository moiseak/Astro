---
layout: '/src/layouts/MarkdownPostLayout.astro'
title: "K 个一组翻转链表"  
description: "K 个一组翻转链表题解"  
pubDate: 2025-03-18   
type: "leetcode" 
---
[25. K 个一组翻转链表 - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-nodes-in-k-group/description/) 
难度：Hard。

给你链表的头节点 `head` ，每 `k` 个节点一组进行翻转，请你返回修改后的链表。

`k` 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 `k` 的整数倍，那么请将最后剩余的节点保持原有顺序。

你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。

![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250318191806.png)
**输入：head = [1,2,3,4,5], k = 2
输出：[2,1,4,3,5]**

这个问题具有递归性质，如果我们反转了前两个节点，那么剩下的节点是一个头节点变为原链表第三个节点，长度变为n-2的一条新链表，并且我们需要对这条的处理与原链表是一样的。对新链表的前两个节点进行反转，剩下的节点又是一条新链表，如此......

那么我们首先要解决的一个问题是：如何反转一条链表的前两（N）个节点？

同样用递归来解决，我们定义一个函数reverseN的作用是反转前N个节点，那么我们只需要将头节点接在以第二个节点为头节点，反转前N-1个节点后的链表最后面。

即：

```Java
ListNode afterNode = Node; //第N+1个节点，用来接在前N个节点反转后的新链表后面
ListNode newNode = reverseN(head.next, n - 1);
head.next.next = head; //将head接在最后
head.next = afterNode;  //接上第N+1及后面的节点
```

完整解法如下：

```Java

ListNode after = null;

// 反转以 head 为起点的 n 个节点，返回新的头结点
ListNode reverseN(ListNode head, int n) {
    if (n == 1) {
        // 记录第 n + 1 个节点
        after = head.next;
        return head;
    }
    // 以 head.next 为起点，需要反转前 n - 1 个节点
    ListNode last = reverseN(head.next, n - 1);

    head.next.next = head;
    // 让反转之后的 head 节点和后面的节点连起来
    head.next = after;
    return last;
}
```

那么接下来就很简单了：
**1、先反转以 `head` 开头的 `k` 个元素。**
**2、将第 `k + 1` 个元素作为 `head` 递归调用 `reverseKGroup` 函数**。
**3、将上述两个过程的结果连接起来**。

```Java
class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
		if(head == null) {
			return null;
		}
		//[a, b)为需要反转的区间
		ListNode a, b;
		for (int i = 0; i < k; i++) {
			//剩余节点数量不够K个直接返回
			if (b == null)  return head;
			b = b.next;
		}
		ListNode newHead = reverseN(a, k);
		//此时a为反转后的最后一个节点，将其与反转后的下一组连接起来
		a.next = reverseKGroup(b, k);
		return newHead;
    }

	
	ListNode after = null;
	
	// 反转以 head 为起点的 n 个节点，返回新的头结点
	ListNode reverseN(ListNode head, int n) {
		if (n == 1) {
		// 记录第 n + 1 个节点
			after = head.next;
			return head;
		}
		// 以 head.next 为起点，需要反转前 n - 1 个节点
		ListNode last = reverseN(head.next, n - 1);
		
		head.next.next = head;
		// 让反转之后的 head 节点和后面的节点连起来
		head.next = after;
		return last;
	}
}
```

**不要跳进递归，而是去利用递归的定义。**
