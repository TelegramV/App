import {EventBus} from "../../src/js/Api/EventBus/EventBus"
import VComponent from "../../src/js/V/VRDOM/component/VComponent"
import type {AE} from "../../src/js/V/VRDOM/component/appEvents"
import vrdom_renderVComponentVNode from "../../src/js/V/VRDOM/render/renderVComponent"
import {sum} from "../sum"

const MockEventBus = new EventBus()

class TestComponent extends VComponent {

    appEvents(E: AE) {
        E.bus(MockEventBus)
            .on("testUpdate", this.onTestUpdate)
    }

    render() {
        return <div>TEST</div>
    }

    onTestUpdate = event => {

    }
}

const testComponentRef = VComponent.createComponentRef()

const $node = vrdom_renderVComponentVNode(<TestComponent ref={} testProp={"testVal"}/>)

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});
