import Particles from "./Particles.ts";

class Firework {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public bounds: DOMRect;
    public particles: Map<number, Particles>;
    public background: string;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.bounds = canvas.getBoundingClientRect()
        this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d')
        this.particles = new Map()
        this.background = '#000000'
        this.init()
    }

    private init() {
        this.canvas.width = this.bounds.width
        this.canvas.height = this.bounds.height
        window.addEventListener('resize', this.resizeWindowHandler.bind(this))
        setInterval(() => {
            this.createParticle()
        }, 500)
        this.animate()
    }

    public destroy() {
        window.removeEventListener('resize', this.resizeWindowHandler.bind(this))
        this.canvas.remove()
    }

    /**
     * 开始绘制动画
     * @private
     */
    private animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.ctx.canvas.height)
        this.ctx.fillStyle = this.background
        this.ctx.fillRect(0, 0, this.canvas.width, this.ctx.canvas.height)
        this.particles.forEach((particles, key) => {
            if (particles.state === 3) this.particles.delete(key)
            particles.update()
        })
        requestAnimationFrame(this.animate.bind(this))
    }


    private createParticle() {
        const x = this.randomIntFromRange(this.bounds.width - this.bounds.width * 0.9, this.bounds.width * 0.9)
        const y = this.randomIntFromRange(this.bounds.height / 4, this.bounds.height / 2)
        this.particles.set(Date.now(), new Particles(x, y, this.ctx))
    }

    private randomIntFromRange(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    /**
     * 屏幕尺寸改变调整 Canvas 画布
     * @private
     */
    private resizeWindowHandler() {
        this.bounds = this.canvas.getBoundingClientRect()
        this.canvas.width = this.bounds.width
        this.canvas.height = this.bounds.height
    }
}


export default Firework