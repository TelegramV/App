import {EventBus} from "../../src/js/api/eventBus/EventBus"
import VComponent from "../../src/js/ui/v/vrdom/component/VComponent"
import type {AE} from "../../src/js/ui/v/vrdom/component/appEvents"
import vrdom_renderVComponentVNode from "../../src/js/ui/v/vrdom/render/renderVComponent"
import {sum} from "../sum"

const MockEventBus = new EventBus()

class TestComponent extends VComponent {

    appEvents(E: AE) {
        E.bus(MockEventBus)
            .on("testUpdate", this.onTestUpdate)
    }

    h() {
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
