// 轮播组件


/**
 * 轮播组件类
 * @param {string} master 轮播父元素, 轮播将存放到该元素中
 * @param {object} config 轮播配置
 */
var A4paperRotateSeeding = function (master, config) {
    this.config = config;

    // 轮播父元素
    this.master = master;

    // 轮播定时器对象
    this.rotateSeedingTimer = null;

    // 轮播图片切换间隔, 单位为毫秒
    this.timeInterval = config.interval;

    // 轮播图片
    this.rotateSeedingImages = config.images;

    // 轮播图高度
    this.rotateSeedingImagesHeight = 0;

    // 轮播容器z-index
    this.rotateSeedingBoxStack = config.stack;

    // 当前轮播显示的图片的下标
    this.rotateSeedingImageIndex = 0;

    // 轮播图片切换所需时间,单位为毫秒(注意: 不能大于timeInterval)
    this.switchingTime = config.time;

    // 轮播图片基础样式
    this.rotateSeedingImageStyle = [
        'max-width: 100%',
        'position: absolute',
        'user-select: none'
    ];

    // 轮播容器样式
    this.rotateSeedingBoxStyle = [
        'position: relative',
        'top: 0px',
        'left: 0px',
        'width: 100%',
        'height: 100%'
    ];

    if (this.switchingTime >= this.timeInterval) {
        throw 'Rotational image switching time cannot be greater than the time interval';
    }

    if (!this.switchingTime) {
        // 当不提供轮播切换时间时, 默认为1.5秒
        this.switchingTime = 1500
    }

    if (!this.timeInterval) {
        // 当不提供轮播切换间隔时, 默认为5秒
        this.timeInterval = 5000
    }

    if (!this.rotateSeedingBoxStack) {
        // 当不提供轮播z-index时, 默认为100
        this.rotateSeedingBoxStack = 100;
    }

    // 轮播控制按钮基础样式
    this.rotateSeedingButtonStyle = [
        'position: absolute',
        'top: 0px',
        'height: 0px',
        `z-index: ${this.rotateSeedingBoxStack}`,
        'width: 50px',
        'height: 100%',
        'font-size: 40px',
        'color: rgba(225, 225, 225, 0.8)',
        'cursor: pointer',
        'user-select: none',
        'transition: color 0.5s',
        'display: flex',
        'justify-content: center',
        'align-items: center'
    ]


    if (config.autoHide) {
        this.rotateSeedingBoxStyle.push('overflow: hidden');
    }

    if (config.limit) {
        this.rotateSeedingImageStyle.push('max-width: 100%');
        this.rotateSeedingImageStyle.push('max-height: 100%');
    }

    if (config.width) {
        this.rotateSeedingBoxStyle.push(`width: ${config.width}`);
    }
    if (config.autoWidth) {
        this.rotateSeedingImageStyle.push('width: 100%');
    }

    if (config.height) {
        this.rotateSeedingBoxStyle.push(`height: ${config.height}`);
    }
    if (config.autoHeight) {
        this.rotateSeedingImageStyle.push('height: 100%');
    }



    /*---------- 初始化 ----------*/

    let self = this;

    // 向轮播父元素插入一个div, 实现一个中间层, 目的是不影响父元素
    this.master2 = document.createElement('div');
    this.master2.style.width = '100%';
    this.master2.style.height = '100%';
    this.master2.style.position = 'relative';
    this.master2.style.transition = `height ${this.switchingTime / 1000}s`;
    this.master.appendChild(this.master2);

    // 向中间层插入轮播容器
    this.rotateSeedingBox = document.createElement('div');
    this.rotateSeedingBox.setAttribute('style', this.rotateSeedingBoxStyle.join('; ') + ';');
    this.master2.appendChild(this.rotateSeedingBox);

    if (config.controls) {

        // 向中间层插入轮播控制按钮, 并设置对应样式
        this.rotateSeedingButtonPrevious = document.createElement('div');
        this.rotateSeedingButtonNext = document.createElement('div');

        let rotateSeedingButtonPreviousStyle = this.rotateSeedingButtonStyle.slice();
        rotateSeedingButtonPreviousStyle.push('left: 0px');
        this.rotateSeedingButtonPrevious.setAttribute('style', rotateSeedingButtonPreviousStyle.join('; ') + ';');
        this.rotateSeedingButtonPrevious.setAttribute('class', 'a4paper-rotate-seeding-button');
        this.rotateSeedingButtonPrevious.innerText = '<';

        let rotateSeedingButtonNextStyle = this.rotateSeedingButtonStyle.slice();
        rotateSeedingButtonNextStyle.push('right: 0px');
        this.rotateSeedingButtonNext.setAttribute('style', rotateSeedingButtonNextStyle.join('; ') + ';');
        this.rotateSeedingButtonNext.setAttribute('class', 'a4paper-rotate-seeding-button');
        this.rotateSeedingButtonNext.innerText = '>'

        this.master2.appendChild(this.rotateSeedingButtonPrevious);
        this.master2.appendChild(this.rotateSeedingButtonNext);

        this.rotateSeedingButtonPrevious.onclick = function () {
            window.clearInterval(self.rotateSeedingTimer);
            self.move('p');
            self.start();
        }

        this.rotateSeedingButtonNext.onclick = function () {
            window.clearInterval(self.rotateSeedingTimer);
            self.move('n');
            self.start();
        }
    }

    if (this.rotateSeedingImages.length <= 0) {
        // 当轮播图片少于1张时抛出错误
        throw 'There are no rotating images to process';
    } else if (this.rotateSeedingImages.length < 2) {
        // 当轮播图片只有一张时, 以静态图片方式显示在轮播容器中
        let rotateSeedingImage = document.createElement('img');
        rotateSeedingImage.setAttribute('style', this.rotateSeedingImageStyle.join('; ') + ';');
        rotateSeedingImage.setAttribute('src', this.getImagePath('c'));
        this.rotateSeedingBox.appendChild(rotateSeedingImage);
    } else {
        let rotateSeedingImage = document.createElement('img');
        let style = this.rotateSeedingImageStyle.slice();
        style.push('left: 0px');
        style.push(`transition: left ${this.switchingTime / 1000}s`);
        rotateSeedingImage.setAttribute('style', style.join('; ') + ';');
        rotateSeedingImage.setAttribute('src', this.getImagePath('c'));
        if (config.followPicture) {
            // 根据图片高度设置轮播中间层高度
            rotateSeedingImage.onload = function () {
                self.master2.style.height = `${this.clientHeight}px`;
            }
        }
        this.rotateSeedingBox.appendChild(rotateSeedingImage);
        this.start();
    }
}


/**
 * 判断数据类型
 * @param {*} target 目标数据 
 */
A4paperRotateSeeding.prototype.dataType = function (target) {
    let typeString = Object.prototype.toString.call(target);
    if (typeString == '[object Number]') { return 'number' }
    if (typeString == '[object String]') { return 'string' }
    if (typeString == '[object Array]') { return 'array' }
    if (typeString == '[object Object]') { return 'object' }
}


/**
 * 从图片地址数组返回一个轮播图片地址, 可获取 当前图片地址 上一张图片地址 下一张地址, 
 */
A4paperRotateSeeding.prototype.getImagePath = function (directions) {
    if (directions == 'n') {
        if ((this.rotateSeedingImageIndex + 1) >= this.rotateSeedingImages.length) {
            this.rotateSeedingImageIndex = 0;
        } else {
            this.rotateSeedingImageIndex += 1;
        }
    } else if (directions == 'p') {
        if ((this.rotateSeedingImageIndex - 1) <= 0) {
            this.rotateSeedingImageIndex = this.rotateSeedingImages.length - 1;
        } else {
            this.rotateSeedingImageIndex -= 1;
        }
    } else if (directions == 'c') {
        // 
    } else {
        throw 'getImagePath(directions): Invalid parameters';
    }

    return this.rotateSeedingImages[this.rotateSeedingImageIndex];
}


/**
 * 滑动轮播一次
 * @param {string} directions 轮播滑动方向, n: 滑动到下一张轮播图片, p: 轮播滑动到上一张轮播图片 
 */
A4paperRotateSeeding.prototype.move = function (directions) {
    if (!(directions == 'n' || directions == 'p')) {
        throw 'move(directions): Invalid parameters';
    }

    let self = this;

    // 向轮播容器插入下一张图片, 并设置下一张轮播图片的样式
    let image = document.createElement('img');
    let style = this.rotateSeedingImageStyle.slice();
    style.push(`left: ${(directions == 'n') ? this.rotateSeedingBox.clientWidth : (this.rotateSeedingBox.clientWidth * -1)}px`);
    style.push(`transition: left ${this.switchingTime / 1000}s`);
    image.setAttribute('style', style.join('; ') + ';');
    image.setAttribute('src', (directions == 'n') ? this.getImagePath('n') : this.getImagePath('p'));
    if (this.config.followPicture) {
        image.onload = function () {
            // 根据图片动态设置轮播中间层高度
            self.master2.style.height = `${this.clientHeight}px`;
        }
    }
    this.rotateSeedingBox.appendChild(image);

    // 将显示的轮播图片滑动到不可见区域, 并在滑动结束后移除该图片
    // 将新插入的图片滑动到可见区域
    // 轮播盒子中倒数第二张图片始终是可见图片, 所以移动轮播图片时始终是将倒数第二张轮播图片从可见滑动到隐藏区域
    // 
    //     小问题: 
    //          因为隐藏轮播图片需要过渡效果, 不能立即移除隐藏的轮播图片, 所以使用setTimeout()在过渡后移除, 
    //          但点击切换按钮时由于不能立即移除已经隐藏的轮播图片或者过渡还未完成, 导致了轮播图片堆叠, 过渡效果无效和错乱. 
    //     解决方案: 
    //          始终为将倒数第二张轮播图片从可见滑动到隐藏区域
    this.rotateSeedingBox.children[this.rotateSeedingBox.children.length - 2].style.left = `${(directions == 'n') ? (this.rotateSeedingBox.clientWidth * -1) : this.rotateSeedingBox.clientWidth}px`;
    image.style.left = '0px';
    window.setTimeout(function () {
        self.rotateSeedingBox.removeChild(self.rotateSeedingBox.children[0]);
    }, this.switchingTime);
}


/**
 * 开始轮播动画
 */
A4paperRotateSeeding.prototype.start = function () {
    let self = this;
    this.rotateSeedingTimer = window.setInterval(function () {
        self.move('n');
    }, self.timeInterval);
}