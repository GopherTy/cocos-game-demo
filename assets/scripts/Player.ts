// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    // 主角跳跃高度
    @property
    jumpHeight: number = 0;
    // 主角跳跃持续时间
    @property
    jumpDuration: number = 0;
    // 最大移动速度
    @property
    maxMoveSpeed: number = 0;
    // 加速度
    @property
    accel: number = 0;

    @property({
        type: cc.AudioClip
    })
    jumpAudio = null

    // 跳动事件
    jumpAction: cc.Action = null;
    // 场景中的节点 
    node: cc.Node = null
    accLeft: boolean = false
    accRight: boolean = false
    xSpeed: number = 0


    onLoad() {
        // 初始化跳跃动作
        this.jumpAction = this.setJumpAction()
        this.node.runAction(this.jumpAction)

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
    }


    onDestroy() {
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;
    }

    playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }

    // private method
    setJumpAction() {
        // 跳跃上升
        let jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut())
        // 下落
        let jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn())
        // 不断重复
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown))
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    }

    onKeyUp(event) {
        // unset a flag when key released
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    }
}
