---
layout: /src/layouts/MarkdownPostLayout.astro
title: langchain4j
description: langchain4j
pubDate: 2025-04-29
---
## 模型配置
模型使用阿里的千问，可免费使用一定额度

在Spring Boot配置文件中：

langchain4j.community.dashscope.api-key=sk-*   你的API KEY

langchain4j.community.dashscope.model-name=qwen-max

依赖：

```
<dependency>  
    <groupId>dev.langchain4j</groupId>  
    <artifactId>langchain4j-community-dashscope-spring-boot-starter</artifactId>  
    <version>1.0.0-beta3</version>  
</dependency>  
<dependency>  
    <groupId>dev.langchain4j</groupId>  
    <artifactId>langchain4j-spring-boot-starter</artifactId>  
    <version>1.0.0-beta3</version>  
</dependency>
```

先简单写个config
```Java
@Configuration  
public class LangChainConfig {  
  
    @Value("${langchain4j.community.dashscope.api-key}")  
    private String apiKey;  
  
    @Bean  
    public ChatLanguageModel chatLanguageModel() {  
        return QwenChatModel.builder()  
                .apiKey(apiKey)  
                .modelName("qwen-max")  
                .build();  
    }  
}
```

这样就创建好模型了！

## ChatLanguageModel测试

```Java
@Autowired  
ChatLanguageModel chatLanguageModel;

@Test  
void testLowLevel() {  
    String res = chatLanguageModel.chat("Hello, What's your name?");  
    System.out.println(res);  
}
```

### @AiService  

可以自动注入ChatLanguageModel（前提是把第二个chat方法给注释掉）

```Java
@AiService  
public interface Assistant {  
    String chat(String userMessage);  
    String chat(@MemoryId int memoryId, @UserMessage String userMessage);  
}
```

```Java
    @Autowired  
    Assistant assistant;  
  
    @Test  
    void testAssistant() {  
        String res = assistant.chat("Hello, what is your name");  
        System.out.println(res);  
//        Hello! I'm Qwen, an AI assistant created by Alibaba Cloud. It's nice to meet you. How can I assist you today?  
    }
```
### 记忆功能

这是第一种比较麻烦的，也就是把所有的请求和回复都加到下一次请求中
```Java
@Test  
public void testModel() {  
    UserMessage firstUserMessage = UserMessage.from("Hello, my name is Klaus");  
    AiMessage firstAiMessage = chatLanguageModel.chat(firstUserMessage).aiMessage(); // Hi Klaus, how can I help you?  
    System.out.println(firstAiMessage.text());  
    UserMessage secondUserMessage = UserMessage.from("What is my name?");  
    AiMessage secondAiMessage = chatLanguageModel.chat(firstUserMessage, firstAiMessage, secondUserMessage).aiMessage(); // Klaus  
    System.out.println(secondAiMessage.text());  
}
```
第二种使用chatMemory，可以看到我们在这里重新builder了assistant
```Java
  
@Test  
void testMemory() {  
    ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);  
  
    Assistant assistant = AiServices.builder(Assistant.class)  
            .chatLanguageModel(chatLanguageModel)  
            .chatMemory(chatMemory)  
            .build();  
  
    String answer = assistant.chat("Hello! My name is Klaus.");  
    System.out.println(answer); // Hello Klaus! How can I assist you today?  
  
    String answerWithName = assistant.chat("What is my name?");  
    System.out.println(answerWithName); // Your name is Klaus.  
}
```
如果我们不想让memory共享呢，就可以指定id，一个id只能看到自己id内的memory
```Java
@Test  
void testSelfMemory() {  
    Assistant assistant = AiServices.builder(Assistant.class)  
            .chatLanguageModel(chatLanguageModel)  
            .chatMemoryProvider(memoryId -> MessageWindowChatMemory.withMaxMessages(10))  
            .build();  
  
    System.out.println(assistant.chat(1, "Hello, my name is Klaus"));  
    // Hi Klaus! How can I assist you today?  
  
    System.out.println(assistant.chat(2, "Hello, my name is Francine"));  
    // Hello Francine! How can I assist you today?  
  
    System.out.println(assistant.chat(1, "What is my name?"));  
    // Your name is Klaus.  
  
    System.out.println(assistant.chat(2, "What is my name?"));  
    // Your name is Francine.  
}
```

如果想要持久化保存，参考[langchain4j-examples/other-examples/src/main/java/ServiceWithPersistentMemoryForEachUserExample.java at main · langchain4j/langchain4j-examples · GitHub](https://github.com/langchain4j/langchain4j-examples/blob/main/other-examples/src/main/java/ServiceWithPersistentMemoryForEachUserExample.java)
