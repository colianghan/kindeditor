## KindEditor Coding Style Guidelines ##

### General ###

1. 所有文本文件统一使用UTF-8 无BOM编码，换行使用Windows格式（\r\n）。

2. 所有字符串一般情况下使用单引号（'）定义，如果字符串中单引号比双引号多则用双引号（"），基本原则是尽量减少斜线转义字符。

Right:
```
str = 'abc';
str = '<div class="abc"></div>';
str = "'";
```
Wrong:
```
str = "abc";
str = "<div class=\"abc\"></div>";
str = '\'';
```

3. 尽量使用[.md](.md),{},/regex/,function () {}，而不是new Array(), new Object(), new RegExp(), new Function()。

Right:
```
var arr = [],
    obj = {},
    reg = /\w+/g,
    fn = function () { alert(1); };
```
Wrong:
```
var arr = new Array(),
    obj = new Object(),
    reg = new RegExp('\w+', 'g'),
    fn = new Function('alert(1)');
```

4. 整个程序只允许有三个全局变量（K、KE、KindEditor），如果页面已经有K、KE全局变量就跳过，不会修改相应变量值。

### Names ###

| 文件名 | lowercase | node.js, dialog.js |
|:----|:----------|:-------------------|
| 类名  | K.lowercase | K.node, K.dialog   |
| 全局变量名 | K.UPPER\_CASE | K.IE, K.VERSION    |
| 全局函数 | K.camelCase | K.trim, K.inArray  |
| 类方法 | camelCase | node.attr, node.removeAttr |
| 类成员变量 | camelCase | range.startContainer, node.children |
| 模块里的一级局部变量 | `_`camelCase | `_`trim, `_`inArray |
| 局部变量 | camelCase | str, nodeName      |

### Indentation ###

1. Use tabs, not spaces.

2. 一次缩进用一个TAB。

Right:
```
function main() {
    return 0;
}
```
Wrong:
```
function main() {
        return 0;
}
```

### Space ###

1. Do not place spaces around unary operators.

Right:
```
i++;
```
Wrong:
```
i ++;
```

2. Do place spaces around binary and ternary operators.

Right:
```
y = m * x + b;
f(a, b);
c = a | b;
return condition ? 1 : 0;
```
Wrong:
```
y=m*x+b;
f(a,b);
c = a|b;
return condition ? 1:0;
```

3. Do not place spaces before comma and semicolon.

Right:
```
for (var i = 0; i < 10; i++) {
    doSomething();
}

f(a, b);
```
Wrong:
```
for (var i = 0 ; i < 10 ; i++) {
    doSomething();
}

f(a , b) ;
```

4. Place spaces between control statements and their parentheses.

Right:
```
if (condition) {
    doIt();
}

for (var i = 0, len = arr.length; i < len; i++) {
    doIt();
}
```
Wrong:
```
if(condition){
    doIt();
}

for(var i = 0, len = arr.length; i < len; i++){
    doIt();
}
```

5. Do not place spaces between a function and its parentheses, or between a parenthesis and its content.

Right:
```
f(a, b);
```
Wrong:
```
f (a, b);
f( a, b );
```

### Line breaking ###

1. 同时定义多个变量时，只使用一个var。

Right:
```
var a,
    b = {},
    c = [],
    d = function () {
    };
```
Wrong:
```
var a;
var b = {};
var c = [];
var d = function () {};
```

2. An else if statement should be written as an if statement when the prior if concludes with a return statement.

Right:
```
if (condition) {
    ...
    return someValue;
}
if (condition) {
    ...
}
```
Wrong:
```
if (condition) {
    ...
    return someValue;
} else if (condition) {
    ...
}
```

### Braces ###

1. 函数定义：开始花括号放在行尾。

Right:
```
function main() {
    ...
}
```
Wrong:
```
function main()
{
    ...
}
```

2. One-line control clauses should not use braces unless comments are included or a single statement spans multiple lines.

Right:
```
if (condition) {
    doIt();
}

if (condition) {
    myFunction(reallyLongParam1, reallyLongParam2, ...
        reallyLongParam5);
}
```
Wrong:
```
if (condition) doIt();

if (condition)
    doIt();

if (condition)
    myFunction(reallyLongParam1, reallyLongParam2, ...
        reallyLongParam5);
```

### true and false ###

1. Tests for true/false should all be done without equality comparisons.

Right:
```
if (condition) {
    doIt();
}
    
if (!condition) {
    return;
}
```

Wrong:
```
if (condition == true) {
    doIt();
}
    
if (condition == false) {
    return;
}
```

### type checks ###

  * String: typeof object === "string"
  * Number: typeof object === "number"
  * Boolean: typeof object === "boolean"
  * Object: typeof object === "object"
  * Element: object.nodeType
  * null: object === null
  * null or undefined: object == null
  * undefined:
    * Global Variables: typeof variable === "undefined"
    * Local Variables: variable === undefined
    * Properties: object.prop === undefined

### regexp ###

All RegExp operations should be done using .test() and .exec(). "string".match() is no longer used.


### Reference ###

  * http://webkit.org/coding/coding-style.html
  * http://docs.jquery.com/JQuery_Core_Style_Guidelines
  * http://o.dojotoolkit.org/developer/StyleGuide