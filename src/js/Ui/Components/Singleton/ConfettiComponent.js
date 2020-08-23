/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import UIEvents from "../../EventBus/UIEvents";
import StatelessComponent from "../../../V/VRDOM/component/StatefulComponent"

class ConfettiComponent extends StatelessComponent {
    canvasRef = StatelessComponent.createRef();
    confetti = []
    displaying = false

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("confetti.show", this.show)
            .on("confetti.remove", this.removeAll);
    }

    render() {
        return (
            <div className="confetti-container">
                <canvas ref={this.canvasRef}></canvas>
            </div>
        );
    }

    componentDidMount() {
        this.ctx = this.canvasRef.$el.getContext("2d");
        this.updateCanvasSize();
    }

    componentDidUpdate() {
        this.updateCanvasSize();
    }

    componentWillUnmount() {
        this.unmounting = true;
    }

    updateCanvasSize = () => {
        this.canvasRef.$el.width = window.innerWidth; // TODO catch resizes?
        this.canvasRef.$el.height = window.innerHeight;
    }

    draw = () => {
        if(this.unmounting || this.confetti.length === 0) {
            this.displaying = false;
            return;
        }
        this.ctx.clearRect(0, 0, this.canvasRef.$el.width, this.canvasRef.$el.height);

        for(var i = this.confetti.length -1; i >= 0 ; i--){
            const item = this.confetti[i];
            if(this.isConfettiVisible(item)){
                item.draw(this.ctx);
            } else {
                this.confetti.splice(i, 1); //remove item
            }
        }
        this.displaying = true;
        window.requestAnimationFrame(this.draw);
    }

    generateConfetti = () => {
        let width = this.canvasRef.$el.width;
        let height = this.canvasRef.$el.height;
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
            let randomY = (Math.random() - 1.4) * height*1.5;
            let velocity = {
                x: pos.x === 0 ? randomX : randomX * -1,
                y: randomY,
            }

            let randomColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.push(new Confetti(pos, 20, randomColor, velocity))
        }
        return confetti;
    }

    isConfettiVisible = (confetti) => {
        return confetti.pos.y < this.canvasRef.$el.height+confetti.size
    }

    show = () => {
        this.confetti = this.confetti.concat(this.generateConfetti());
        if(!this.displaying) {
            window.requestAnimationFrame(this.draw);
        }
    }

    removeAll = () => {
        this.confetti = [];
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

export default ConfettiComponent;