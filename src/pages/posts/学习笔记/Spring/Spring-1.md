---
layout: '/src/layouts/MarkdownPostLayout.astro'
title: "Spring #1"  
description: "IoC容器基础"  
pubDate: 2024-11-17   
type: "summary" 
---
# IoC
IoC的意思是“控制反转”，就是把我们创建对象实例的权力交给Spring框架，我们不需要再自己手动去new一个对象。它会根据我们的配置文件去帮助我们实现类，目的是解耦各个模块，就是降低各个模块之间互相依赖的程度。
**我们交给IoC控制的对象就叫做Bean。**

## 配置
### 基础配置
引入Spring依赖：
```xml
<dependency> 
  <groupId>org.springframework</groupId> 
  <artifactId>spring-context</artifactId> 
  <version>6.0.10</version> 
</dependency>
```
resource中创建一个Spring配置文件：
```xml
<?xml version="1.0" encoding="UTF-8"?> 
<beans xmlns="http://www.springframework.org/schema/beans"
	   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	   xsi:schemaLocation="http://www.springframework.org/schema/beans 
	   https://www.springframework.org/schema/beans/spring-beans.xsd"> 
</beans>  
```
我们通过一个应用程序上下文来索要我们的Bean，在Main中：
```Java
public static void main(String[] args) { 
	ApplicationContext context = new ClassPathXmlApplicationContext("test.xml"); }
```
假如我们创建了一个名为Student的类，我们就可以在Spring配置文件中将它交给IoC容器管理（这个配置文件就是我们上面写的那个"test.xml"）：
```xml
<bean class="com.test.bean.Student"/>
```
这就成功把Student这个类交给IoC容器了。如果我们想要使用这个类，只需要向上下文索要就行：
```Java
Student student = context.getBean(Student.class);
```
### Bean的配置
Bean可以配置名字或者别名，并且可以根据名字/别名来获取，别名需要另起一行：
```xml
<bean name="a" class="com.test.bean.Student"/>
<alias name="a" alias="test"/>
```
Bean默认为单例模式，也就是IoC容器只会给我们创建一个对象，不管索要多少次都会是这一个对象，如果要改为每次索要就创建一个新的对象，可以加上一个scope参数，配置为：
```xml
<bean name="a" class="com.test.bean.Student" scope="prototype"/>
```
另外，如果我们希望Bean对象在使用时才创建，可以改为懒加载（默认为Spring项目启动时就创建）
```xml
<bean class="com.test.bean.Student" lazy-init="true"/>
```
如果想要控制加载顺序，可以加上一个参数：
```xml
<bean name="teacher" class="com.test.bean.Teacher"/> 
<bean name="student" class="com.test.bean.Student" depends-on="teacher"/>
```
这样Teacher就会在Student前加载。
## 依赖注入
用来指定Bean中变量的值。
指定student中的teacher变量，引用类型用ref，其他用value：
```xml
<bean name="teacher" class="com.test.bean.ProgramTeacher"/> 
<bean name="student" class="com.test.bean.Student"> 
	<property name="teacher" ref="teacher"/> 
	<property name="id" value="111"/>
</bean>
```
添加property其实是调用set方法，所以记得在student类中加入set方法。
但是调用的构造方法是默认的无参构造，如果我们有自己定义的构造方法，就需要使用constructor-arg：
```xml
<bean name="teacher" class="com.test.bean.ArtTeacher"/> 
<bean name="student" class="com.test.bean.Student"> 
	<constructor-arg name="teacher" ref="teacher"/> 
</bean>
```
它还会根据变量的个数自动匹配构造参数，如果想要指定变量类型，可以再加一个type。
如果是集合类型，会有特殊的支持，请自行根据需要查阅。
## 自动装配
```xml
<bean name="student" class="com.test.bean.Student" autowire="byType"/>
```
## 注解开发
不需要xml文件了，只需要一个配置类（可以通过Import引入其他配置类）：
```Java
@Configuration 
public class MainConfiguration { 
	@Bean("student") 
	public Student student(){ 
		return new Student(); 
	}
}
```
Main中：
```Java
ApplicationContext context = new   AnnotationConfigApplicationContext(MainConfiguration.class); 
//这个构造方法可以接收多个配置类（更准确的说是多个组件）
```
还可以配置其他属性：
```Java
@Bean 
@Lazy(true) //对应lazy-init属性 
@Scope("prototype") //对应scope属性 
@DependsOn("teacher") //对应depends-on属性 
public Student student(){ return new Student(); }
```
如果需要引入其他的Bean，直接当参数传入即可：
```Java
@Configuration 
public class MainConfiguration { 
	@Bean 
	public Teacher teacher() { 
		return new Teacher(); 
	} 
	@Bean 
	public Student student(Teacher teacher) { 
		return new Student(teacher); 
	} 
}
```
自动装配：
```JAva
public class Student { 
	@Autowired //使用此注解来进行自动装配，由IoC容器自动为其赋值 
	private Teacher teacher; 
}
```
如果是我们自己创建的类，可以在类文件中加入注解`@Component`，就不需要再在配置文件中配置为Bean了：
```Java
@Component("test") //同样可以自己起名字 
public class Student { 

}
```
然后配置一下包扫描：
```Java
@Configuration 
@ComponentScan("com.test.bean") //包扫描，这样Spring就会去扫描对应包下所有的类 
public class MainConfiguration { }
```