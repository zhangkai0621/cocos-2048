"use strict";
cc._RF.push(module, '1fc3f45HOBFdYZK/FFqmV3T', 'init');
// scripts/init.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        button: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {},
    start: function start() {
        this.button.on('click', function (event) {
            var game = cc.find('Canvas').getComponent('game');
            game.init();
        });
    }

    // update (dt) {},

});

cc._RF.pop();