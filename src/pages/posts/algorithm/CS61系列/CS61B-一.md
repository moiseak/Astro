---
layout: '/src/layouts/MarkdownPostLayout.astro'
title: "CS61B #1"  
description: "2048"  
pubDate: 2024-10-11   
type: "Project" 
---

关于这个项目,我们要完成的是一个2048游戏,我们有四个任务需要完成.
这四个任务的难度算是递增吧,他说最后一个的推荐时间是三到十个小时,其实是用不了那么多的,不用害怕.

## emptySpaceExists

我们先来看第一个, 我们要完成的是只要这个棋盘上有一个空格,就返回true.
我们无法直接访问棋盘上方块的值,需要用刚才的.value().
所以这个思路就很明确吧,遍历一遍棋盘就可以了.

```Java
public static boolean emptySpaceExists(Board b) {
    int size = b.size();
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            //return true if any of the tiles are null.
            if (b.tile(i, j) == null) {
                return true;
            }
        }
    }
    return false;
}
```

## maxTileExists

然后看第二个, 这个要实现的是如果方块的值达到最大值返回true.
这个和第一个一样,遍历就可以了,注意.value()不能对null使用.

```Java
public static boolean maxTileExists(Board b) {
    int size = b.size();
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            if (b.tile(i, j) != null) {
                if (b.tile(i, j).value() == MAX_PIECE) {
                    return true;
                }
            }
        }
    }
    return false;
}
```

## atLeastOneMoveExists

第三个是判断这个棋盘还能不能动了,如果没有空位或者没有能合并的两个方块就是不能动了.
首先有没有空位我们可以直接用我们写的第一个方法判断.
然后是不是继续遍历呀,不过我们可以想一想,如果每个方块都判断一遍上下左右不仅特别麻烦,还会重复比较很多次.
而且不是每个方块都有上下左右的,靠边的我们还要特别处理,想一想就很麻烦吧,那应该怎么办呢?

我们需要对他这个棋盘的布局熟悉一下,棋盘以左下角为(0,0),注意第一个坐标表示列,第二个表示行.
那么我们是不是判断每个方块的上边和右边有没有相同的值就可以了,这样就能覆盖所有的方块了.

```Java
public static boolean atLeastOneMoveExists(Board b) {
    // TODO: Fill in this function.
    if (emptySpaceExists(b)) {
        return true;
    }
    int size = b.size();
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            //whether there is the same value above.
            if (j < size - 1 && b.tile(i, j).value() == b.tile(i, j + 1).value()) {
                return true;
            }
            //whether there is the same value right.
            if (i < size - 1 && b.tile(i, j).value() == b.tile(i + 1, j).value()) {
                return true;
            }
        }
    }
    return false;
}
```

## tilt

最后一个是完成这个游戏的部分逻辑,当我们摁上下左右键的时候改变棋盘,我们只需要负责判断方块是否合并再移动到它应该在的位置.并且还要积分.
我们目前不用考虑那么多,先只考虑摁上键的情况.
如果一个方块没有合并,那是不是可以直接滑就行了. 另外就是每个方块每个回合只能使用一次move,也就是要一次到位. 那么如果一列有两个无法合并的应该怎么移动?从上到下依次排列吧,也就是说,他移动的顺序是先考虑上面的,再考虑下面的.合并的顺序也是这样.
为什么这么做呢?根据游戏规则,如果有三个相同的方块挨着,先合并上面两个,比如一列是333x,合并结果就是63xy.
所以我们遍历的顺序需要改变一下,需要从倒数第二列开始(因为最上方是动不了的),从上到下遍历,这样才能保证合并的顺序是对的.
如果上方为空,就可以移动上去,如果上方值相同也可以移动上去合并,如果都不行,那就动不了. 不要忘了每个方块每个回合只能合并一次,所以我们还要记录这个方块有没有合并过.
还要更新一下分数,move合并的话会返回ture,可以用这个来判断是否加分.
最后就是加上他给的辅助转换视角的函数.

```java
public boolean tilt(Side side) {
    boolean changed;
    changed = false;
    // TODO: Modify this.board (and perhaps this.score) to account
    // for the tilt to the Side SIDE. If the board changed, set the
    // changed local variable to true.
    int size = board.size();
    //record whether have been merged.
    board.setViewingPerspective(side);
    for (int i = 0; i < size; i++) {
        boolean[] merged = new boolean[size];
        for (int j = size - 2; j >= 0; j--) {
            Tile t = board.tile(i, j);
            if (t == null) {
                continue;
            }
            //find target.
            int target = j;
            for (int c = j + 1; c < size; c++) {
                if (board.tile(i, c) == null) {
                    target = c;
                } else if (board.tile(i, c).value() == t.value() && !merged[c]) {
                    target = c;
                    merged[c] = true;
                } else {
                    break;
                }
            }
            //update score
            if (target != j) {
                if (board.move(i, target, t)) {
                    score += t.value() * 2;
                }
            }
            changed = true;
        }
    }

    if (changed) {
        setChanged();
    }
    board.setViewingPerspective(Side.NORTH);
    return changed;
}
```

这个项目还是比较基础的,主要就是熟悉一下Java的写法,毕竟和Python还是有区别的.