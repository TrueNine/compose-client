# Java Persistence Api 操作技巧

这里记录一些在使用 JPA 时的一些技巧

## JPA 单表多实体

JPA 中的实体类继承映射策略，可以用来解决子类具有不同表结构的需求。例如，假设你有一个抽象的 Order 类
和两个具体的订单状态类：ProcessingOrder 和 CompletedOrder，每个状态对应不同的数据库表结构。

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "order_status", discriminatorType = DiscriminatorType.STRING)
public abstract class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 公共属性...
}

@Entity
@DiscriminatorValue("PROCESSING")
public class ProcessingOrder extends Order {
    // 处理中订单特有的字段...
}

@Entity
@DiscriminatorValue("COMPLETED")
public class CompletedOrder extends Order {
    // 已完成订单特有的字段...
}
```
