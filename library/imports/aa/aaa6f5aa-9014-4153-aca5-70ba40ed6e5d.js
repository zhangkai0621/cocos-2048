"use strict";
cc._RF.push(module, 'aaa6fWqkBRBU6ylcLpA7W5d', 'game');
// scripts/game.js

'use strict';

/*
 * @Description: 场景开始脚本
 * @Author: zhangkai
 * @Date: 2020-01-17 10:40:15
 * @LastEditTime : 2020-01-19 14:11:26
 * @LastEditors  : zhangkai
 */

var ROWS = 4; // 行数
var NUMBERS = [2, 4]; // 初始化数字
var INIT_NUMBERS = 3; // 初始化方块的个数
var MIN_LENGTH = 50; // 最小的拖动距离
var MOVE_DURATION = 0.1; // 移动耗时

var game = cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        score: 0, // 分数
        blockPrefab: cc.Prefab,
        gap: 20, // 格子间隔
        bg: cc.Node,
        gameOverNode: cc.Node
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
            var data = [];
            for (var _i = 0; _i < ROWS; _i++) {
                data.push(0);
            }
            this.positions.push(data);
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
        this.gameOverNode.active = false;
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
        for (var _i2 = 0; _i2 < ROWS; ++_i2) {
            this.blocks.push([null, null, null, null]); // 用来保存方块的信息, null 表示此位置方块为空
            this.data.push([0, 0, 0, 0]); // 用来表示数字的信息
        }
        // 新建多个方块
        for (var _i3 = 0; _i3 < INIT_NUMBERS; _i3++) {
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
     * @description: 移动完成后
     * @Author: zhangkai
     * @Date: 2020-01-19 08:44:03
     * @param : hasMoved 是否移动
     */
    afterMove: function afterMove(hasMoved) {
        if (hasMoved) {
            this.updateScore(this.score + 1);
            this.addBlock();
        }
        if (this.checkFail()) {
            this.gameOver();
        }
    },


    // 检查是否失败
    checkFail: function checkFail() {
        for (var i = 0; i < ROWS; i++) {
            for (var j = 0; j < ROWS; j++) {
                if (this.data[i][j] === 0) return false; // 是否数值全部填满
                // 同一行或者列是否还可以合并
                if (j > 0 && this.data[i][j] === this.data[i][j - 1]) return false;
                if (j < ROWS - 1 && this.data[i][j] === this.data[i][j + 1]) return false; // 横向

                if (i < ROWS - 1 && this.data[i][j] === this.data[i + 1][j]) return false;
                if (i > 0 && this.data[i][j] === this.data[i - 1][j]) return false; // 纵向
            }
        }
        return true;
    },

    // 游戏结束函数
    gameOver: function gameOver() {
        console.log('game over');
        this.gameOverNode.active = true;
    },

    /**
     * @description: 移动方块
     * @Author: zhangkai
     * @Date: 2020-01-19 08:56:48
     * @param : block 需要移动的块
     * @param : position 需要到的位置
     * @param : callback 移动完成后的回调函数
     */
    doMove: function doMove(block, position, callback) {
        var action = cc.moveTo(MOVE_DURATION, position);
        var finish = cc.callFunc(function () {
            callback && callback();
        });
        // 按顺序执行
        block.runAction(cc.sequence(action, finish));
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
                    this.moveBlock('RIGHT');
                } else {
                    this.moveBlock('LEFT');
                }
            } // 垂直方向
            else {
                    if (vector.y > 0) {
                        this.moveBlock('UP');
                    } else {
                        this.moveBlock('DOWN');
                    }
                }
        }
    },

    /**
     * @description: 滑动滑块
     * @Author: zhangkai
     * @Date: 2020-01-19 09:30:36
     * @param : direction 方向
     */
    moveBlock: function moveBlock(direction) {
        var _this2 = this;

        var hasMoved = false;
        var toMove = []; // 准备移动的数据
        var counter = 0; // 计数是否完成
        switch (direction) {
            case 'RIGHT':
                for (var i = 0; i < ROWS; i++) {
                    for (var j = ROWS - 1; j >= 0; j--) {
                        if (this.data[i][j] !== 0) {
                            toMove.push({ x: i, y: j }); // 
                        }
                    }
                }
                break;
            case 'UP':
                for (var _i4 = ROWS - 1; _i4 >= 0; _i4--) {
                    for (var _j = 0; _j < ROWS; _j++) {
                        if (this.data[_i4][_j] !== 0) {
                            toMove.push({ x: _i4, y: _j }); // 
                        }
                    }
                }
                break;
            default:
                for (var _i5 = 0; _i5 < ROWS; _i5++) {
                    for (var _j2 = 0; _j2 < ROWS; _j2++) {
                        if (this.data[_i5][_j2] !== 0) {
                            toMove.push({ x: _i5, y: _j2 }); // 
                        }
                    }
                }
                break;
        }
        // 移动操作
        var move = function move(x, y, callback) {
            var prevRow = null,
                // 前一行
            prevColumn = null,
                // 前一列
            topIndex = 0,
                // 到顶的下标
            toDirection = null; // 反向
            switch (direction) {
                case 'LEFT':
                    prevRow = x;
                    topIndex = 0;
                    prevColumn = y - 1;
                    toDirection = y; // 到顶的方向

                    break;
                case 'RIGHT':
                    prevRow = x;
                    topIndex = ROWS - 1;
                    prevColumn = y + 1;
                    toDirection = y; // 到顶的方向
                    break;
                case 'UP':
                    prevRow = x + 1;
                    topIndex = ROWS - 1;
                    prevColumn = y;
                    toDirection = x; // 到顶的方向
                    break;
                case 'DOWN':
                    prevRow = x - 1;
                    topIndex = 0;
                    prevColumn = y;
                    toDirection = x; // 到顶的方向
                    break;
                default:
                    break;

            }
            // 移到顶结束
            if (toDirection === topIndex || _this2.data[x][y] === 0) {
                callback && callback();
                return;
            } // 移动
            else if (_this2.data[prevRow][prevColumn] === 0) {
                    var block = _this2.blocks[x][y]; // 当前的方块
                    var position = _this2.positions[prevRow][prevColumn]; // 前一个方块的位置
                    _this2.blocks[prevRow][prevColumn] = block; // 后一个的方块赋值给前一个
                    _this2.data[prevRow][prevColumn] = _this2.data[x][y]; // 把后一个的数值赋值给前一个
                    _this2.data[x][y] = 0; // 移动完后当前数值置为 0 
                    _this2.blocks[x][y] = null; // 移动完后当前方块置为 null
                    _this2.doMove(block, position, function () {
                        // 移动完成后下一轮移动
                        move(prevRow, prevColumn, callback);
                    });
                    hasMoved = true;
                } // 前一个数字与后一个数字相等合并
                else if (_this2.data[prevRow][prevColumn] === _this2.data[x][y]) {
                        var _block = _this2.blocks[x][y]; // 当前的方块
                        var _position = _this2.positions[prevRow][prevColumn]; // 前一个方块的位置
                        _this2.data[prevRow][prevColumn] *= 2; // 两个方块数值合并
                        _this2.data[x][y] = 0; // 移动完后当前数值置为 0 
                        _this2.blocks[x][y] = null; // 移动完后当前方块置为 null
                        _this2.blocks[prevRow][prevColumn].getComponent('block').setNumber(_this2.data[prevRow][prevColumn]); // 设置前一个方块的数值
                        _this2.doMove(_block, _position, function () {
                            // 移动完成后下一轮移动
                            _block.destroy();
                            callback && callback();
                        });
                        hasMoved = true;
                    } else {
                        callback && callback();
                        return;
                    }
        };

        for (var _i6 = 0; _i6 < toMove.length; _i6++) {
            move(toMove[_i6].x, toMove[_i6].y, function () {
                counter++;
                if (counter === toMove.length) {
                    _this2.afterMove(hasMoved);
                }
            });
        }
    }
});

module.exports = game;

cc._RF.pop();