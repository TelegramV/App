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

function NextGenPage() {
    return <div><Counter/></div>
}

export default NextGenPage