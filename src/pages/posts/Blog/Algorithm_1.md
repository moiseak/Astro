---
layout: /src/layouts/MarkdownPostLayout.astro
title: "Algorithm #1"
description: 目标：理解链表的结构与基本操作，熟悉栈、队列的思维。
pubDate: 2025-11-02
---

| 日期  | 内容      | 题目                      |
| --- | ------- | ----------------------- |
| 周一  | 单链表基本操作 | 206 反转链表、21 合并两个有序链表    |
| 周二  | 快慢指针    | 19 删除倒数第 N 个节点、141 环形链表 |
| 周三  | 链表进阶    | 160 相交链表、234 回文链表       |
| 周四  | 栈与队列    | 20 有效的括号、232 用栈实现队列     |
| 周五  | 哈希表     | 1 两数之和、349 两个数组的交集      |
## Day 1
[206. 反转链表 - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-linked-list/)

迭代：

```go
func reverseList(head *ListNode) *ListNode {
	var pre *ListNode
	for head != nil {
		next := head.Next
		head.Next = pre
		pre = head
		head = next
	}
	return pre
}
```

递归：

只需要反转`head`后面的链表，再把`head`接到反转后的链表末尾即可。

```go
func reverseList(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	p := reverseList(head.Next)
	head.Next.Next = head
	head.Next = nil
	return p
}
```

[21. 合并两个有序链表 - 力扣（LeetCode）](https://leetcode.cn/problems/merge-two-sorted-lists/)

依次比较两个链表中的头节点，较小的那个接入合并的新链表中，若一条全部合并，剩下的一条直接接到新链表后面即可。

```go
func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {
    list := &ListNode{-200, nil}
    p := list
    h1 := list1
    h2 := list2
    for h1 != nil && h2 != nil {
        if h1.Val > h2.Val {
            p.Next = h2
            h2 = h2.Next
            p = p.Next
        } else {
            p.Next = h1
            h1 = h1.Next
            p = p.Next
        }
    }
    if h1 == nil {
        p.Next = h2
    }
    if h2 == nil {
        p.Next = h1
    }
    return list.Next
}
```

## Day 2

[19. 删除链表的倒数第 N 个结点 - 力扣（LeetCode）](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/description/)

为了方便处理删除第一个节点的情况，我们在头部加入一个新节点。

假设原链表有`K`个节点，现在就有了`k+1`个节点，从头走到终点需要`k`步，倒数第`n`个节点就是正数第`k+2-n`个节点，那么从头需要走`k-n`步就能到达其前一个节点，于是我们为了让一个指针能从头走`k-n`步，就需要一个指针同样走`k-n`步达到终点，即先走`n`步即可。

也就是一个指针先走`n`步，第二个指针再开始走，这样当第一个指针走到终点时，第二个指针正好走到我们要删除的节点的前一个位置。

```go
func removeNthFromEnd(head *ListNode, n int) *ListNode {
    dm := &ListNode{-666, head}
    fast := dm
    slow := dm
    for n > 0 {
        fast = fast.Next
        n--
    }
    for fast.Next != nil {
        fast = fast.Next
        slow = slow.Next
    }
    slow.Next = slow.Next.Next
    return dm.Next
}
```

[141. 环形链表 - 力扣（LeetCode）](https://leetcode.cn/problems/linked-list-cycle/description/)

一个指针一次走一步，一个指针一次走两步，只要有环，二者一定会相遇，若走到了终点，那就不存在环。

```go
func hasCycle(head *ListNode) bool {
    slow,fast := head,head
    for fast != nil && fast.Next != nil{
        fast = fast.Next.Next
        slow = slow.Next
        if fast == slow {
            return true
        }
    }
    return false
}
```

## Day 3

[160. 相交链表 - 力扣（LeetCode）](https://leetcode.cn/problems/intersection-of-two-linked-lists/description/)

我们把两个链表连在一起，若二者相交，就返回相同值，若不相交，最多走`m+n`个节点就一起走到终点，正好返回`nil`。

```go
func getIntersectionNode(headA, headB *ListNode) *ListNode {
	p1, p2 := headA, headB
	for p1 != p2 {
		if p1 == nil {
			p1 = headB
		} else {
            p1 = p1.Next
        }
		if p2 == nil {
			p2 = headA
		} else {
            p2 = p2.Next
        }
	}
    return p1
}
```

[234. 回文链表 - 力扣（LeetCode）](https://leetcode.cn/problems/palindrome-linked-list/description/)

找到中点，反转后半部分，此时前半部分与后半部分应该相等。

```go
func isPalindrome(head *ListNode) bool {
    if head == nil || head.Next == nil {
        return true
    }
    // find mid
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
    }
    // reverse
    var pre *ListNode
    for slow != nil {
        next := slow.Next
        slow.Next = pre
        pre = slow
        slow = next
    }
    // compare
    left, right := head, pre
    for right != nil {
        if left.Val != right.Val {
            return false
        }
        left = left.Next
        right = right.Next
    }
    return true
}
```

## Day 4

[20. 有效的括号 - 力扣（LeetCode）](https://leetcode.cn/problems/valid-parentheses/description/)

遇到左括号就压进栈，遇到右括号就从栈里弹出来一个比较，栈空或者对不上就无效。

```go
func isValid(s string) bool {
    var stack []rune
    for _, ch := range s {
        switch ch {
        case '(','[','{':
            stack = append(stack,ch)
        case ')':
            if len(stack) == 0 || stack[len(stack)-1] != '(' {
                return false
            }
            stack = stack[:len(stack)-1]
        case ']':
            if len(stack) == 0 || stack[len(stack)-1] != '[' {
                return false
            }
            stack = stack[:len(stack)-1]
        case '}':
            if len(stack) == 0 || stack[len(stack)-1] != '{' {
                return false
            }
            stack = stack[:len(stack)-1]
        }
    }
    return len(stack) == 0
}
```

[232. 用栈实现队列 - 力扣（LeetCode）](https://leetcode.cn/problems/implement-queue-using-stacks/description/)

一个栈表示入队，一个栈表示出队，入队直接往里压，出队时看看出队栈是否为空，若为空就把入队栈全弹出来压到入队栈里面。

```go
type MyQueue struct {
    inStack []int
    outStack []int
}


func Constructor() MyQueue {
    return MyQueue{
        inStack:[]int{},
        outStack:[]int{},
    }
}


func (this *MyQueue) Push(x int)  {
    this.inStack = append(this.inStack, x)
}


func (this *MyQueue) Pop() int {
    if len(this.outStack) == 0 {
        for len(this.inStack) != 0 {
            l := len(this.inStack)
            this.outStack = append(this.outStack, this.inStack[l-1])
            this.inStack = this.inStack[:l-1]
        }
    }
    l := len(this.outStack)
    res := this.outStack[l-1]
    this.outStack = this.outStack[:l-1]
    return res
}


func (this *MyQueue) Peek() int {
    if len(this.outStack) == 0 {
        for len(this.inStack) != 0 {
            l := len(this.inStack)
            this.outStack = append(this.outStack, this.inStack[l-1])
            this.inStack = this.inStack[:l-1]
        }
    }
    l := len(this.outStack)
    res := this.outStack[l-1]
    return res
}


func (this *MyQueue) Empty() bool {
    if len(this.outStack)==0 && len(this.inStack)==0 {
        return true
    }
    return false
}
```

## Day 5

[1. 两数之和 - 力扣（LeetCode）](https://leetcode.cn/problems/two-sum/description/)

每次遍历一个值就去`map`里找找有没有符合要求的，若有，二者一起返回，若没有，也加入`map`中。

```go
func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    for i, v := range nums {
        if id, ok := m[target-v]; ok {
            return []int{i, id}
        }
        m[v] = i
    }
    return nil
}
```

[349. 两个数组的交集 - 力扣（LeetCode）](https://leetcode.cn/problems/intersection-of-two-arrays/)

先把一个数组里的元素全放到`map`中，再遍历第二个数组找相同值，若找到就加入`res`，同时记得从`map`中删除该值，避免重复加入。

```go
func intersection(nums1 []int, nums2 []int) []int {
    res := []int{}
    m := make(map[int]bool)
    for _,v := range nums1 {
        m[v] = true
    }
    for _,v := range nums2 {
        if m[v] {
            res = append(res, v)
            delete(m,v)
        }
    }
    return res
}
```