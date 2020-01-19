/*
 * @Description: 场景开始脚本
 * @Author: zhangkai
 * @Date: 2020-01-17 10:40:15
 * @LastEditTime : 2020-01-17 16:46:08
 * @LastEditors  : zhangkai
 */

 const ROWS = 4; // 行数
 const NUMBERS = [2, 4]; // 初始化数字
 const INIT_NUMBERS = 3; // 初始化方块的个数
 const MIN_LENGTH = 50; // 最小的拖动距离

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        score: 0, // 分数
        blockPrefab: cc.Prefab,
        gap: 20, // 格子间隔
        bg: cc.Node,
    },
    // onLoad () {},

    start () {
        this.drawBgBlocks(); 
        this.init();
    },
    /**
     * @description: 绘制方块
     * @Author: zhangkai
     * @Date: 2020-01-17 11:36:49
     */
    drawBgBlocks() {
        this.blockSize = (cc.winSize.width - this.gap *  (ROWS + 1)) / ROWS; // 方块大小
        let x = this.gap + this.blockSize / 2;
        let y = this.blockSize;
        this.positions = []; // 用于存储位置信息
        for (let i = 0; i < ROWS; ++i) {
            this.positions.push([0, 0, 0, 0]);
            for (let j = 0; j < ROWS; ++j) {
                let block = cc.instantiate(this.blockPrefab);
                // 设置方块大小
                block.width = this.blockSize;
                block.height = this.blockSize;
                // 添加方块
                this.bg.addChild(block);
                block.setPosition(cc.v2(x, y));
                this.positions[i][j] = cc.v2(x, y); // 记录位置信息
                x += this.gap + this.blockSize;
                block.getComponent('block').setNumber(0);
            }
            y += this.gap + this.blockSize;
            x = this.gap + this.blockSize / 2; // 绘制完一行后，x 起点回到原位
        }
    },
    /**
     * @description: 初始化数据
     * @Author: zhangkai
     * @Date: 2020-01-17 11:37:15
     */    
    // 
    init() {
        this.updateScore(0);
        // 绑定事件
        this.addEvents();
        // 清空现有的块
        if (this.blocks) {
            for (let i = 0; i < this.blocks.length; ++i) {
                for(let j = 0; j < this.blocks.length; ++j) {
                    if (this.blocks[i][j] !== null) {
                        this.blocks[i][j].destroy(); 
                    }
                }
            }
        }
        this.data = [];
        this. blocks = [];
        for (let i = 0; i < ROWS; ++i) {
            this.blocks.push([null, null, null, null]); // 用来保存方块的信息, null 表示此位置方块为空
            this.data.push([0, 0, 0, 0]); // 用来表示数字的信息
        }
        // 新建多个方块
        for (let i = 0; i < INIT_NUMBERS; i++) {
            this.addBlock();
        }
    },

    /**
     * @description: 更新分数
     * @Author: zhangkai
     * @Date: 2020-01-17 11:42:09
     * @param : number 需要更新的分数
     */    
    updateScore(number) {
        this.score = number;
        this.scoreLabel.string = `分数：${number}`;
    },
    /**
     * @description: 新建方块
     * @Author: zhangkai
     * @Date: 2020-01-17 14:22:57
     */    
    addBlock() {
        let locations = this.getEmptyLocations();
        if (!locations.length) { return false; }
        let positionObject = locations[Math.floor(Math.random() * locations.length)] // 随机抽取空闲位置
        let x = positionObject.x; // 第几行，由于坐标轴在左下角，由上至下递增
        let y = positionObject.y; // 第几列，由左至右递增
        let position = this.positions[x][y]; // 取出真正的坐标
        let block = cc.instantiate(this.blockPrefab);
        // 设置方块大小
        block.width = this.blockSize;
        block.height = this.blockSize;
        // 添加方块
        this.bg.addChild(block);
        block.setPosition(position);
        // 随机设置的数字
        let number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
        block.getComponent('block').setNumber(number);
        this.blocks[x][y] = block; 
        this.data[x][y] = number;
        return true;
    },

    /**
     * @description: 找出空闲的块
     * @Author: zhangkai
     * @Date: 2020-01-17 14:24:56
     * @return 空闲块的位置数组
     */    
    getEmptyLocations() {
        let locations = [];
        for(let i = 0; i < this.blocks.length; ++i) {
            for(let j = 0; j < this.blocks.length; ++j) {
                if (this.blocks[i][j] === null) {
                    locations.push({x: i, y: j});
                }
            }
        }
        return locations;
    },
    /**
     * @description: 添加事件监听
     * @Author: zhangkai
     * @Date: 2020-01-17 16:10:23
     * @param : 
     */    
    addEvents() {
        this.bg.on('touchstart', (event) => {
            this.startPoint = event.getLocation();
        });
        this.bg.on('touchend', (event) => {
            this.touchEnd(event);
        });
        this.bg.on('touchcancel', (event) => {
            this.touchEnd(event);
        });
    },
    // 拖动结束
    touchEnd(event) {
        this.endPoint = event.getLocation();
        let vector = this.endPoint.sub(this.startPoint)// Sub() 返回两个向量的差
        if (vector.mag() > MIN_LENGTH) {
            // 水平方向
            if (Math.abs(vector.x) > Math.abs(vector.y)) {
                if (vector.x > 0) {
                    this.moveRight();
                }
                else {
                    this.moveLeft();
                }
            } // 垂直方向
            else {
                if (vector.y > 0) {
                    this.moveUp();
                }
                else {
                    this.moveDown();
                }
            }
        }
    },
    // 右滑
    moveRight() {
        cc.log('right');
    },
    // 左滑
    moveLeft() {
        cc.log('left');

        let toMove = [];
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < ROWS; j++) {
                if (this.data[i][j] !== 0) {
                    toMove.push({x: i, y: j}); // 
                }
            }
        }
    },
    // 上滑
    moveUp() {
        cc.log('up');
    },
    // 下滑
    moveDown() {
        cc.log('down');
    },
});
