
cc.Class({
    extends: cc.Component,

    properties: {
        button: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },
    start() {
        this.button.on('click', (event) => {
            let game = cc.find('Canvas').getComponent('game');
            game.init();
        });
    }

    
    // update (dt) {},
});
