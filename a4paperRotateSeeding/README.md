# 轮播组件

要使用该组件, 您只需将文件`a4paperRotateSeeding.js`引入到您的页面中。

下面是一个例子：

```html
<script src="a4paperRotateSeeding.js"></script>
```



然后实例化`A4paperRotateSeeding`。

下面是一个例子：

```html
<script>
    var a4paperRotateSeeding = new A4paperRotateSeeding(
        document.getElementById('rotate-seeding'), {
        images: [
            'images/1.jpg',
            'images/2.jpg',
            'images/3.jpg',
            'images/4.jpg',
            'images/5.jpg',
            'images/6.jpg',
            'images/7.jpg'
        ]
    });
</script>
```



`A4paperRotateSeeding` 接收两个参数

	- 容纳轮播的元素：如果你愿意，是任何HTML元素, 只要它可以容纳`div`元素最为子元素，因为轮播组件将会在该元素内注入`div`等元素用于构建轮播，该元素作为轮播的父元素。
	- 轮播配置



|        配置项 | 说明                                                         | 值类型  |
| ------------: | ------------------------------------------------------------ | :------ |
|        images | 轮播图片, 值应该为一个数组, 该数组每一项为一张轮播图片的地址 | Array   |
|      interval | 两张轮播图片之间切换的时间间隔, 单位为`毫秒`, 默认为5000毫秒 | Number  |
|          time | 切换到下一张轮播图片所需要的时间, 单位为`毫秒`, 默认为1500毫秒 | Number  |
|    autoHeight | 轮播图片自适应高度                                           | Boolean |
|     autoWidth | 轮播图片自适应宽度                                           | Boolean |
|         width | 轮播容器宽度, 默认容器充满父元素                             | String  |
|        height | 轮播容器高度, 当设置该选项时默认充满父元素                   | String  |
| followPicture | 轮播高度随图片高度自动改变                                   | Boolean |
|      autoHide | 当轮播图片过大超出轮播图片时设置该选项将超出部分隐藏         | Boolean |
|         limit | 在不影响轮播图片长宽比的情况下限制轮播图片不得大于轮播容器, 如果设置了`autoWidth`或`autoHeight`, 将不能保证图片长宽比, 默认为false | Boolean |
|      controls | 是否显示轮播控件, 默认为false                                | Boolean |

