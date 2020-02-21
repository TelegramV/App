import VComponent from "../../../V/VRDOM/component/VComponent"
import {List} from "../../../V/VRDOM/list/List"
import VArray from "../../../V/VRDOM/list/VArray"

const IF = (item, array: VArray, index) => {
    return <div>
        <a onClick={() => array.delete(index)}>{item}</a>
    </div>
}

// this thing is workable but it takes a time to migrate...

class ReactiveListComponent extends VComponent {

    state = {
        data: new VArray([
            "a",
            "b",
            "c"
        ])
    }

    c = 0

    render() {
        return (
            <div>
                <List list={this.state.data} template={IF} wrapper={<div class="list"/>}/>

                <List list={this.state.data} template={IF} wrapper={<div/>}/>

                <div>
                    <button onClick={() => this.state.data.add(++this.c)}>Push</button>
                    <button onClick={() => this.state.data.addBack(++this.c)}>Prepend</button>
                    <button onClick={() => this.state.data.set([
                        "no",
                        "way",
                        "need",
                        "die"
                    ])}>Set
                    </button>
                </div>
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