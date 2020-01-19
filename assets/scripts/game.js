/*
 * @Description: 场景开始脚本
 * @Author: zhangkai
 * @Date: 2020-01-17 10:40:15
 * @LastEditTime : 2020-01-19 14:11:26
 * @LastEditors  : zhangkai
 */

 const ROWS = 4; // 行数
 const NUMBERS = [2, 4]; // 初始化数字
 const INIT_NUMBERS = 3; // 初始化方块的个数
 const MIN_LENGTH = 50; // 最小的拖动距离
 const MOVE_DURATION = 0.1; // 移动耗时

let game = cc.Class({
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
            let data = [];
            for (let i = 0; i < ROWS; i++) {
                data.push(0);
            }
            this.positions.push(data);
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
        this.gameOverNode.active = false;
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
     * @description: 移动完成后
     * @Author: zhangkai
     * @Date: 2020-01-19 08:44:03
     * @param : hasMoved 是否移动
     */
    afterMove(hasMoved) {
        if (hasMoved) {
            this.updateScore(this.score + 1);
            this.addBlock();
        }
        if (this.checkFail()) {
            this.gameOver();
        }
    },
    
    // 检查是否失败
    checkFail() {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < ROWS; j++) {
                if (this.data[i][j] === 0) return false; // 是否数值全部填满
                // 同一行或者列是否还可以合并
                if (j > 0 && this.data[i][j] === this.data[i][j - 1]) return false; 
                if (j < ROWS - 1 && this.data[i][j] === this.data[i][j + 1]) return false;  // 横向

                if (i < ROWS - 1 && this.data[i][j] === this.data[i + 1][j]) return false; 
                if (i > 0 && this.data[i][j] === this.data[i - 1][j]) return false; // 纵向
            }
        }
        return true;
    },
    // 游戏结束函数
    gameOver() {
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
    doMove(block, position, callback) {
        let action = cc.moveTo(MOVE_DURATION, position);
        let finish = cc.callFunc(() => {
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
                    this.moveBlock('RIGHT');
                }
                else {
                    this.moveBlock('LEFT');
                }
            } // 垂直方向
            else {
                if (vector.y > 0) {
                    this.moveBlock('UP');
                }
                else {
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
    moveBlock(direction) {
        let hasMoved = false;
        let toMove = []; // 准备移动的数据
        let counter = 0; // 计数是否完成
        switch(direction) {
            case 'RIGHT':
                for (let i = 0; i < ROWS; i++) {
                    for (let j = ROWS - 1; j >= 0; j--) {
                        if (this.data[i][j] !== 0) {
                            toMove.push({x: i, y: j}); // 
                        }
                    }
                }
                break;
            case 'UP':
                for (let i = ROWS - 1; i >=0; i--) {
                    for (let j = 0; j < ROWS; j++) {
                        if (this.data[i][j] !== 0) {
                            toMove.push({x: i, y: j}); // 
                        }
                    }
                }
                break;
            default:
                for (let i = 0; i < ROWS; i++) {
                    for (let j = 0; j < ROWS; j++) {
                        if (this.data[i][j] !== 0) {
                            toMove.push({x: i, y: j}); // 
                        }
                    }
                }
                break;
        }
        // 移动操作
        let move = (x, y, callback) => {
            let prevRow = null, // 前一行
            prevColumn = null, // 前一列
            topIndex = 0, // 到顶的下标
            toDirection = null; // 反向
            switch(direction) {
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
            if (toDirection === topIndex || this.data[x][y] === 0) {
                callback && callback();
                return;
            } // 移动
            else if (this.data[prevRow][prevColumn] === 0) {
                let block = this.blocks[x][y]; // 当前的方块
                let position = this.positions[prevRow][prevColumn]; // 前一个方块的位置
                this.blocks[prevRow][prevColumn] = block; // 后一个的方块赋值给前一个
                this.data[prevRow][prevColumn] = this.data[x][y]; // 把后一个的数值赋值给前一个
                this.data[x][y] = 0; // 移动完后当前数值置为 0 
                this.blocks[x][y] = null; // 移动完后当前方块置为 null
                this.doMove(block, position, () => {
                    // 移动完成后下一轮移动
                    move(prevRow, prevColumn, callback);
                })
                hasMoved = true;
            } // 前一个数字与后一个数字相等合并
            else if (this.data[prevRow][prevColumn] === this.data[x][y]) {
                let block = this.blocks[x][y]; // 当前的方块
                let position = this.positions[prevRow][prevColumn]; // 前一个方块的位置
                this.data[prevRow][prevColumn] *= 2; // 两个方块数值合并
                this.data[x][y] = 0; // 移动完后当前数值置为 0 
                this.blocks[x][y] = null; // 移动完后当前方块置为 null
                this.blocks[prevRow][prevColumn].getComponent('block').setNumber(this.data[prevRow][prevColumn]); // 设置前一个方块的数值
                this.doMove(block, position, () => {
                    // 移动完成后下一轮移动
                    block.destroy();
                    callback && callback();
                })
                hasMoved = true;
            }
            else {
                callback && callback();
                return;
            }
        };

        for (let i = 0; i < toMove.length; i++) {
            move(toMove[i].x, toMove[i].y, () => {
                counter++;
                if (counter === toMove.length) {
                    this.afterMove(hasMoved);
                }
            })
        }

        
    },
});

module.exports = game;
