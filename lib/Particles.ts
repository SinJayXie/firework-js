interface FireworkMap extends Coordinate2D {
    speed: Coordinate2D,
    color: string,
    scale: number
}

interface Coordinate2D {
    x: number,
    y: number
}

interface FireLineOption {
    start: Coordinate2D,
    origin: Coordinate2D,
    end: Coordinate2D
}

function generateRandomColorArray() {
    const colors: string[] = [];
    for (let i = 0; i < 100; i++) {
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        colors.push(color);
    }
    return colors;
}

class Particles {
    public x: number;
    public y: number;
    public map: FireworkMap[];
    public subScale: number;
    public colors: string[];
    public ctx: CanvasRenderingContext2D;
    public state: number; // 未发射:0, 发射中:1, 爆炸中:2, 销毁: 3
    public fireLine: FireLineOption;
    public fireColor: string;

    constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
        this.x = x
        this.y = y
        this.ctx = ctx
        this.subScale = -0.02
        this.colors = generateRandomColorArray()
        this.fireColor = this.colors[0]
        this.map = []
        this.state = 0
        this.fireLine = {
            start: {
                x: 0,
                y: 0,
            },
            end: {
                x: 0,
                y: 0,
            },
            origin: {
                x: 0,
                y: 0,
            }
        }
        this.init()
        this.createMap()
    }

    private init() {
        this.fireLine.origin.x = this.ctx.canvas.width / 2
        this.fireLine.origin.y = this.ctx.canvas.height

        this.fireLine.start.x = this.fireLine.origin.x
        this.fireLine.start.y = this.fireLine.origin.y

        this.fireLine.end.x = this.fireLine.origin.x
        this.fireLine.end.y = this.fireLine.origin.y
    }

    private randomSpeed() {
        return (Math.random() - 0.5) * (Math.random() * 8)
    }

    private draw(firework: FireworkMap, index: number) {
        if (index >= 0) {
            this.ctx.beginPath();
            this.ctx.arc(firework.x, firework.y, firework.scale, 0, Math.PI * 2);
            this.ctx.fillStyle = firework.color;
            this.ctx.closePath()
            this.ctx.fill();
        }
    }

    private createMap() {
        for (let i = 0; i < Math.floor(Math.random() * (50 - 15 + 1) + 15); i++) {
            this.map.push({
                x: this.x,
                y: this.y,
                speed: {
                    x: this.randomSpeed(),
                    y: this.randomSpeed()
                },
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                scale: 2.5
            })
        }
    }

    private fire() {
        // 计算粒子当前位置指向目标点的向量
        const targetX = this.x;
        const targetY = this.y;
        const dx = targetX - this.fireLine.end.x;
        const dy = targetY - this.fireLine.end.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 10; // 粒子飞行速度

        // 计算每一步的位移
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        // 更新结束点的位置
        if (distance > speed) {
            this.fireLine.end.x += moveX;
            this.fireLine.end.y += moveY;
            // this.ctx.fillText(distance.toString(), this.fireLine.end.x, this.fireLine.end.y)
        } else {
            // 粒子接近目标点，停止更新位置
            this.fireLine.end.x = targetX;
            this.fireLine.end.y = targetY;
            this.state = 2;
        }

        // 让起始点在结束点的后方100个距离跟随着结束点移动
        const directionX = this.fireLine.end.x - this.fireLine.origin.x;
        const directionY = this.fireLine.end.y - this.fireLine.origin.y;
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        const normalizedDirectionX = directionX / magnitude;
        const normalizedDirectionY = directionY / magnitude;
        this.fireLine.start.x = this.fireLine.end.x - 50 * normalizedDirectionX;
        this.fireLine.start.y = this.fireLine.end.y - 50 * normalizedDirectionY;
        // 绘制烟花升空的线
        this.ctx.strokeStyle = this.fireColor;
        this.ctx.beginPath();
        this.ctx.moveTo(this.fireLine.start.x, this.fireLine.start.y);
        this.ctx.lineTo(this.fireLine.end.x, this.fireLine.end.y);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    public update() {
        if (this.state === 0) {
            this.state = 1 // 调整为发射状态
        } else if (this.state === 1) {
            this.fire()
        } else if (this.state === 2) {
            this.map.forEach((fireworkItem, index) => {
                fireworkItem.x += fireworkItem.speed.x
                fireworkItem.y += fireworkItem.speed.y
                fireworkItem.scale += this.subScale
                if (fireworkItem.scale <= 0) {
                    this.state = 3 // 结束
                    return
                }
                this.draw(fireworkItem, index)
            })
        }
    }

}


export default Particles