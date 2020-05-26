/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import {ReactiveObject} from "../../../V/Reactive/ReactiveObject"
import Lottie from "../../Lottie/Lottie"
import animationDataA from './pinjump.json';
import animationDataB from './beating-heart.json';

class ReactiveCounter extends ReactiveObject {
    count = 0;

    increment() {
        this.count++;
        this.fire("increment");
    }
}

const Button = ({onClick}, slot) => {
    return <button onClick={onClick}>{slot}</button>;
}

class Title extends StatelessComponent {
    render(props) {
        return <h1>{props.title}</h1>;
    }
}

Title.defaultProps = {
    title: "Click `Increment`"
};

class Counter extends StatefulComponent {
    counter = new ReactiveCounter()

    reactive(R) {
        R.object(this.counter)
            .on("increment", this.forceUpdate)
    }

    render(props, state) {
        return (
            <div>
                <Title title={this.counter.count}/>
                {this.counter.count}

                <Button onClick={() => this.counter.increment()}>Increment</Button>
            </div>
        );
    }
}

class TransitionLoop extends StatefulComponent {
    constructor(props) {
        super(props);

        this.state = {
            isStopped: false,
            isPaused: false,
            speed: 1,
            direction: 1,
            isDataA: true,
        };
    }

    render() {
        const centerStyle = {
            display: 'block',
            margin: '10px auto',
            "text-align": 'center',
        };
        const {isStopped, isPaused, direction, speed, isDataA} = this.state;
        const defaultOptions = {
            animationData: (isDataA ? animationDataB : animationDataA),
            loop: false
        };

        return (<div>
            <Lottie
                options={defaultOptions}
                height={400}
                width={400}
                isStopped={isStopped}
                isPaused={isPaused}
                speed={speed}
                direction={direction}
            />

            <p style={centerStyle}>Speed: x{speed}</p>
            <input
                style={centerStyle}
                type="range" value={speed} min="0" max="10" step="0.5"
                onInput={e => this.setState({speed: e.currentTarget.value})}
            />
            <button
                style={centerStyle}
                onClick={() => this.setState({isStopped: true})}
            >stop
            </button>
            <button
                style={centerStyle}
                onClick={() => this.setState({isStopped: false})}
            >play
            </button>
            <button
                style={centerStyle}
                onClick={() => this.setState({isPaused: !isPaused})}
            >pause
            </button>
            <button
                style={centerStyle}
                onClick={() => this.setState({direction: direction * -1})}
            >change direction
            </button>
            <button
                style={centerStyle}
                onClick={() => this.setState({isDataA: !isDataA})}
            >toggle animation
            </button>
        </div>);
    }
}

function NextGenPage() {
    return <div><TransitionLoop/></div>
}

export default NextGenPage