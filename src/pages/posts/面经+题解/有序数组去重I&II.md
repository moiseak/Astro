---
title: 有序数组去重I&II
layout: /src/layouts/MarkdownPostLayout.astro
pubDate: 2025-03-27
description: 题解
---
## I
[26. 删除有序数组中的重复项 - 力扣（LeetCode）](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)

难度：Easy

要求原地去重后返回数组长度，可以使用双指针，fast在前扫描，发现新元素就赋值给slow并让slow前进一步，slow走过的地方只有不重复的元素。

```Java
class Solution {
    public int removeDuplicates(int[] nums) {
        int fast = 0, slow = 0;
        while (fast < nums.length) {
            if (nums[fast] != nums[slow]) {
                slow++;
                nums[slow] = nums[fast];
            }
            fast++;
        }
        return slow + 1;
    }
}
```

## II
[80. 删除有序数组中的重复项 II - 力扣（LeetCode）](https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii/description/)

难度：Medium

依旧是原地删除，但要求删除出现两次以上的。所以这次除了判断是否相等，还要判断重复的次数。

出现一次添加（即slow前进），出现第二次也添加。

我们在每出现一个新元素时就重新计数，以此保证count始终计算的是同一个数字的出现次数。

```Java
class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }
        int slow = 0, fast = 0,count = 0;//记录出现次数
        while (fast < nums.length){
            if (nums[slow] != nums[fast]) {
                slow++;
                nums[slow] = nums[fast];
            } else if (slow < fast && count < 2) {
                slow++;
                nums[slow] = nums[fast];
            }
            fast++;
            count++;
            if (fast < nums.length && nums[fast] != nums[fast - 1]) {
                count = 0;//出现新元素重新计数
            }
        }
        return slow + 1;
    }
}
```