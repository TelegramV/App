import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"

export default class ConfettiCanvasComponent extends StatelessComponent {

    canvasRef = StatelessComponent.createRef();
    ended = false;


    // Don... don... don't patch me, VRDOM San
    render({}) {
        return <canvas ref={this.canvasRef}></canvas>;
    }

    componentDidMount() {
        this.canvas = this.canvasRef.$el;
        this.start();
    }

    componentWillUnmount() {
        this.unmounting = true;
        this.ended = true;
    }

    start() {
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth; // TODO catch resizes?
        this.canvas.height = window.innerHeight;

        this.confetti = this.generateConfetti();

        window.requestAnimationFrame(this.draw);
    }

    draw = () => {
        if(this.unmounting) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let item of this.confetti) {
            item.draw(this.ctx);
        }

        if (this.checkConfetti()) {
            this.ended = true;
            return;
        }

        window.requestAnimationFrame(this.draw);
    }

    generateConfetti() {
        let width = this.canvas.width;
        let height = this.canvas.height;
        let colors = ['#E8BC2C', '#D0049E', '#02CBFE', '#5723FD', '#FE8C27', '#6CB859']
        let confetti = [];

        let leftPos = {
            x: 0,
            y: height
        }

        let rightPos = {
            x: width,
            y: height
        }

        for (let i = 0; i < 50; i++) {
            let pos = i % 2 ? { ...leftPos } : { ...rightPos }
            let randomX = (1 - Math.random()) * width * 0.5;
            let velocity = {
                x: pos.x === 0 ? randomX : randomX * -1,
                y: (Math.random() - 1.4) * height*1.5
            }

            let randomColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.push(new Confetti(pos, 20, randomColor, velocity))
        }
        return confetti;
    }

    checkConfetti() {
        for (let item of this.confetti) {
            if (item.pos.y < this.canvas.height+item.size) return false;
        }
        return true;
    }
}

class Confetti {
    constructor(position = { x: 0, y: 0 }, size = 20, color = "#FF0000", velocity = { x: 0, y: 0 }) {
        this.size = size;
        this.color = color;
        this.pos = position;
        this.velocity = velocity;


        this.lastDraw = Date.now();
        this.frameCount = 0;

        this.flicker = this.size;
        this.flickerFreq = Math.random() / 2;
        this.rotation = 0;
    }

    draw(ctx) {
        this.update();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(
            this.pos.x,
            this.pos.y,
            this.size,
            this.flicker,
            this.rotation,
            0,
            2 * Math.PI);
        ctx.fill();

        this.lastDraw = Date.now();
        this.frameCount++;
    }

    update() {
        this.updatePosition();
        this.flicker = this.size * Math.abs(Math.sin(this.frameCount * this.flickerFreq));
        this.rotation = 5 * this.frameCount * this.flickerFreq * Math.PI / 180;
    }

    updatePosition() {
        let diff = (Date.now() - this.lastDraw) / 1000;
        let {
            x = 0,
                y = 0
        } = this.velocity;
        x *= 0.99; //air resistance?
        y += 500 * diff; //gravity
        this.velocity = { x: x, y: y }

        this.pos = {
            x: this.pos.x + x * diff,
            y: this.pos.y + y * diff,
        }
    }
}