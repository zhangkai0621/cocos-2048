(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/block.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9728fRuF9FMW7jpbmSlI3BG', 'block', __filename);
// scripts/block.js

'use strict';

var _colors = require('./colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,

    properties: {
        numberLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},

    /**
     * @description: 设置数字以及方块的背景色
     * @Author: zhangkai
     * @Date: 2020-01-17 11:17:31
     * @param : number 需要显示的数字
     */
    setNumber: function setNumber(number) {
        if (number === 0) {
            this.numberLabel.node.active = false;
        }
        this.numberLabel.string = number;
        if (number in _colors2.default) {
            this.node.color = _colors2.default[number]; // 设置方块颜色
        }
    }
    // update (dt) {},

}); /*
     * @Description: 
     * @Author: zhangkai
     * @Date: 2020-01-17 11:10:52
     * @LastEditTime : 2020-01-17 11:19:54
     * @LastEditors  : zhangkai
     */

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=block.js.map
        