---
layout: '/src/layouts/MarkdownPostLayout.astro'
title: "MST"  
description: "最小生成树"  
pubDate: 2024-11-02   
type: "algorithm"  
---
## 生成树
1. 存在图中的所有顶点
2. 每个节点都已连接
3. 无环
## 最小生成树
在权重图中得到权重最小的生成树就是最小生成树(MST).

### Cut Property
将图中的节点分到两个集合,这两个集合最小权重的交叉边一定在MST中.

**证明:反证法,如果最小权重边e不在MST中,则将e加入MST构成环,再去掉另一条边就可以得到一个包含e的并且更小的生成树.**

### Prim 算法

1. 从任意一个节点开始,把它放入到MST中.
2. 找到MST中顶点所有相邻的边中最短的边,并且把这个边所连接的另一个顶点也加入到MST中
3. 重复上步骤直到我们拥有了总节点数-1条边.

可以根据剪切性质轻松证明.

**优化**
第二步每次都view所有相邻的边是不是会重复view很多条边,如何优化?回忆以下Dijkstra算法,我们下面要用到一个比较相似的机制:减少活动的节点数,MST中只允许一个活动节点,并且借助优先队列来更新"不活动的节点"和节点对应的权重.  

很遗憾我无法用三言两语讲清楚,请观看这个视频:[vid7 prims efficient - YouTube](https://www.youtube.com/watch?v=JoS9ZegarJs)
相信你看完之后就能理解我上面的不那么清楚的表述了.
### Kruskal 算法
**prim是通过遍历节点来确定MST,那么kruskal则是通过遍历边,也更直观一些.**

1. 排序所有边
2. 从小依次添加,前提是添加该边不会导致成环
3. 直到我们有了总节点数-1条边

实现:利用优先队列存储每条边,再用连接图(WQU)判断是否成环.

### 二者对比
[vid10 kruskals vs prims - YouTube](https://www.youtube.com/watch?v=vmWSnkBVvQ0)
