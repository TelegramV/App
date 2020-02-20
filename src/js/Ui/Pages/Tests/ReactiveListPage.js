import VComponent from "../../../V/VRDOM/component/VComponent"
import {List, VSet} from "../../../V/VRDOM/List"

const IF = item => {
    return <div>
        <a href="">{item}</a>
    </div>
}

// this thing is workable but it takes a time to migrate...

class ReactiveListComponent extends VComponent {

    useProxyState = false

    state = {
        data: new VSet([
            "a",
            "b",
            "c"
        ])
    }

    render() {
        return (
            <div>
                <div class="list">
                    <List list={this.state.data} template={IF}/>
                </div>

                <button onClick={() => this.state.data.push("lol")}>Push</button>
                <button onClick={() => this.state.data.prepend("kek")}>Prepend</button>
            </div>
        )
    }
}

export function ReactListPage() {
    return (
        <div>
            <ReactiveListComponent/>
        </div>
    )
}