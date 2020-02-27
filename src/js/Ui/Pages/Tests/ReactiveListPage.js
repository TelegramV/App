import VComponent from "../../../V/VRDOM/component/VComponent"
import List from "../../../V/VRDOM/list/List"
import VArray from "../../../V/VRDOM/list/VArray"

import "./ReactiveListPage.scss"

class IFComponent extends VComponent {
    render() {
        return <div>
            <a onClick={() => this.props.array.delete(this.props.index)}>{this.props.item}</a>
        </div>
    }
}

const IF = (item, array: VArray, index) => {
    return <IFComponent item={item} array={array} index={index}/>
}

const array = new VArray([
    "a",
    "b",
    "c"
])

class ReactiveListComponent extends VComponent {

    identifier = `kekcomponent`

    state = {
        data: array
    }

    c = 0

    render() {
        return (
            <div>
                <List list={this.state.data} template={IF} wrapper={<div class="reactive-list"/>}/>

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
                    <button onClick={() => this.setState({
                        data: new VArray([
                            "oh",
                            "man",
                            "goodbye",
                            "and die"
                        ])
                    })}>Set data
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