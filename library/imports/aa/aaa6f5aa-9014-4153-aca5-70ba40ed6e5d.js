"use strict";
cc._RF.push(module, 'aaa6fWqkBRBU6ylcLpA7W5d', 'game');
// scripts/game.js

'use strict';

/*
 * @Description: 场景开始脚本
 * @Author: zhangkai
 * @Date: 2020-01-17 10:40:15
 * @LastEditTime : 2020-01-17 16:46:08
 * @LastEditors  : zhangkai
 */

var ROWS = 4; // 行数
var NUMBERS = [2, 4]; // 初始化数字
var INIT_NUMBERS = 3; // 初始化方块的个数
var MIN_LENGTH = 50; // 最小的拖动距离

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        score: 0, // 分数
        blockPrefab: cc.Prefab,
        gap: 20, // 格子间隔
        bg: cc.Node
    },
    // onLoad () {},

    start: function start() {
        this.drawBgBlocks();
        this.init();
    },

    /**
     * @description: 绘制方块
     * @Author: zhangkai
     * @Date: 2020-01-17 11:36:49
     */
    drawBgBlocks: function drawBgBlocks() {
        this.blockSize = (cc.winSize.width - this.gap * (ROWS + 1)) / ROWS; // 方块大小
        var x = this.gap + this.blockSize / 2;
        var y = this.blockSize;
        this.positions = []; // 用于存储位置信息
        for (var i = 0; i < ROWS; ++i) {
            this.positions.push([0, 0, 0, 0]);
            for (var j = 0; j < ROWS; ++j) {
                var block = cc.instantiate(this.blockPrefab);
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
    init: function init() {
        this.updateScore(0);
        // 绑定事件
        this.addEvents();
        // 清空现有的块
        if (this.blocks) {
            for (var i = 0; i < this.blocks.length; ++i) {
                for (var j = 0; j < this.blocks.length; ++j) {
                    if (this.blocks[i][j] !== null) {
                        this.blocks[i][j].destroy();
                    }
                }
            }
        }
        this.data = [];
        this.blocks = [];
        for (var _i = 0; _i < ROWS; ++_i) {
            this.blocks.push([null, null, null, null]); // 用来保存方块的信息, null 表示此位置方块为空
            this.data.push([0, 0, 0, 0]); // 用来表示数字的信息
        }
        // 新建多个方块
        for (var _i2 = 0; _i2 < INIT_NUMBERS; _i2++) {
            this.addBlock();
        }
    },


    /**
     * @description: 更新分数
     * @Author: zhangkai
     * @Date: 2020-01-17 11:42:09
     * @param : number 需要更新的分数
     */
    updateScore: function updateScore(number) {
        this.score = number;
        this.scoreLabel.string = '\u5206\u6570\uFF1A' + number;
    },

    /**
     * @description: 新建方块
     * @Author: zhangkai
     * @Date: 2020-01-17 14:22:57
     */
    addBlock: function addBlock() {
        var locations = this.getEmptyLocations();
        if (!locations.length) {
            return false;
        }
        var positionObject = locations[Math.floor(Math.random() * locations.length)]; // 随机抽取空闲位置
        var x = positionObject.x; // 第几行，由于坐标轴在左下角，由上至下递增
        var y = positionObject.y; // 第几列，由左至右递增
        var position = this.positions[x][y]; // 取出真正的坐标
        var block = cc.instantiate(this.blockPrefab);
        // 设置方块大小
        block.width = this.blockSize;
        block.height = this.blockSize;
        // 添加方块
        this.bg.addChild(block);
        block.setPosition(position);
        // 随机设置的数字
        var number = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
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
    getEmptyLocations: function getEmptyLocations() {
        var locations = [];
        for (var i = 0; i < this.blocks.length; ++i) {
            for (var j = 0; j < this.blocks.length; ++j) {
                if (this.blocks[i][j] === null) {
                    locations.push({ x: i, y: j });
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
    addEvents: function addEvents() {
        var _this = this;

        this.bg.on('touchstart', function (event) {
            _this.startPoint = event.getLocation();
        });
        this.bg.on('touchend', function (event) {
            _this.touchEnd(event);
        });
        this.bg.on('touchcancel', function (event) {
            _this.touchEnd(event);
        });
    },

    // 拖动结束
    touchEnd: function touchEnd(event) {
        this.endPoint = event.getLocation();
        var vector = this.endPoint.sub(this.startPoint); // Sub() 返回两个向量的差
        if (vector.mag() > MIN_LENGTH) {
            // 水平方向
            if (Math.abs(vector.x) > Math.abs(vector.y)) {
                if (vector.x > 0) {
                    this.moveRight();
                } else {
                    this.moveLeft();
                }
            } // 垂直方向
            else {
                    if (vector.y > 0) {
                        this.moveUp();
                    } else {
                        this.moveDown();
                    }
                }
        }
    },

    // 右滑
    moveRight: function moveRight() {
        cc.log('right');
    },

    // 左滑
    moveLeft: function moveLeft() {
        cc.log('left');

        var toMove = [];
        for (var i = 0; i < ROWS; i++) {
            for (var j = 0; j < ROWS; j++) {
                if (this.data[i][j] !== 0) {
                    toMove.push({ x: i, y: j }); // 
                }
            }
        }
    },

    // 上滑
    moveUp: function moveUp() {
        cc.log('up');
    },

    // 下滑
    moveDown: function moveDown() {
        cc.log('down');
    }
});

cc._RF.pop();