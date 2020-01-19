/*
 * @Description: 
 * @Author: zhangkai
 * @Date: 2020-01-17 11:10:52
 * @LastEditTime : 2020-01-17 11:19:54
 * @LastEditors  : zhangkai
 */

import colors from './colors';

cc.Class({
    extends: cc.Component,

    properties: {
        numberLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    /**
     * @description: 设置数字以及方块的背景色
     * @Author: zhangkai
     * @Date: 2020-01-17 11:17:31
     * @param : number 需要显示的数字
     */
    setNumber(number) {
        if (number === 0) {
            this.numberLabel.node.active = false;
        }
        this.numberLabel.string = number;
        if (number in colors) {
            this.node.color = colors[number]; // 设置方块颜色
        }
    }
    // update (dt) {},
});
