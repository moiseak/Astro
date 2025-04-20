---
layout: /src/layouts/MarkdownPostLayout.astro
title: SpringMVC的执行流程
description: SpringMVC的执行流程
pubDate: 2025-04-19
---
SpringMVC的执行流程包括以下步骤：

1. 用户发送请求到前端控制器`DispatcherServlet`。
    
2. `DispatcherServlet`调用`HandlerMapping`找到具体处理器。
    
3. `HandlerMapping`返回处理器对象及拦截器（如果有）给`DispatcherServlet`。
    
4. `DispatcherServlet`调用`HandlerAdapter`。
    
5. `HandlerAdapter`适配并调用具体处理器（Controller）。
    
6. Controller执行并返回`ModelAndView`对象。
    
7. `HandlerAdapter`将`ModelAndView`返回给`DispatcherServlet`。
    
8. `DispatcherServlet`传给`ViewResolver`进行视图解析。
    
9. `ViewResolver`返回具体视图给`DispatcherServlet`。
    
10. `DispatcherServlet`渲染视图并响应用户。