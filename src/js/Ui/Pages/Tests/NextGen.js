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
    state = {
        count: 0,
    };

    render(props, state) {
        return (
            <div>
                <Title title={state.count}/>
                {state.count}

                <Button onClick={() => this.setState({
                    count: this.state.count + 1
                })}>Increment</Button>
            </div>
        );
    }
}

function NextGenPage() {
    return <div><Counter/></div>
}

export default NextGenPage