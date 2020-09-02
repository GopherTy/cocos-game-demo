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
export default class Game extends cc.Component {
    // 这个属性引用了星星预制资源
    @property(cc.Prefab)
    starPrefab = null
    // 地面节点，用于确定星星生成的高度
    @property(cc.Node)
    ground = null
    // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    @property(cc.Node)
    player = null
    // 分数显示节点
    @property(cc.Label)
    scoreDisplay = null
    // 音效显示，使用上面的风格编译器会让改成这样的方式。
    @property({ type: cc.AudioClip })
    scoreAudio = null

    // 星星产生后消失时间的随机范围
    @property
    maxStarDuration: number = 0
    @property
    minStarDuration: number = 0

    // 地面坐标
    groundY: number = 0
    // 获取当前节点
    node: cc.Node = null
    // 得分
    score: number = 0
    // 计时器
    timer: number = 0
    // 开始时间
    starDuration: number = 0

    onLoad() {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2
        // 生成一个新的星星
        this.spawnNewStar()
    }

    update(dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver()
            return
        }
        this.timer += dt
    }
    gameOver() {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    }
    gainScore() {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score;
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }
    spawnNewStar() {
        // 使用给定的模板在场景中生成一个新节点
        let newStar = cc.instantiate(this.starPrefab)
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar)
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 在星星组件上暂存 Game 对象的引用
        newStar.getComponent('Star').game = this

        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }
    getNewStarPosition() {
        let randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        let randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        let maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    }
}
