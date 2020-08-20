import {LeftSidebar} from "../LeftSidebar";
import {Section} from "../../Fragments/Section";
import IconButton from "../../Fragments/IconButton";
import UIEvents from "../../../../EventBus/UIEvents"

export class SuperSecretSettingsSidebar extends LeftSidebar {
    content(): * {
        return <this.contentWrapper>
            <Section title="Filters">
                <IconButton icon="avatar_deletedaccount" text="RIP filter" description="When you can't reproduce 2FA bugs" onClick={this.ripFilter}/>
                <IconButton icon="animals" text="Random filter" description="Telegram with filters. Just like the other ...gram" onClick={this.randomFilter}/>
                <IconButton icon="colorize" text="Rainbow filter" description="20% cooler Telegram" onClick={this.rainbowFilter}/>
                <IconButton icon="smile" text="Special occasion button" description="Use only on special occasions" onClick={this.showConfetti}/>
            </Section>
        </this.contentWrapper>
    }

    showConfetti = () => {
        UIEvents.General.fire("confetti.show")
    }

    ripFilter = () => {
        document.querySelector("body").classList.add("rip")
    }

    randomFilter = () => {
        document.getElementById("app").style.filter = this.makeRandomFilter();
    }

    rainbowFilter = () => {
        document.getElementById("app").classList.add("rainbow")
    }

    makeRandomFilter = () => {
        let filter = Math.ceil(Math.random()*7);
        switch(filter) {
            case 1:
                let blur = Math.random()*10;
                return `blur(${blur}px)`;
            case 2:
                let contrast = Math.random()*300;
                return `contrast(${contrast}%)`
            case 3:
                let hue = Math.random()*360;
                return `hue-rotate(${hue}deg)`
            case 4:
                let saturate = Math.random()*100;
                return `saturate(${saturate}%)`
            case 4:
                let sepia = Math.random()*100;
                return `sepia(${sepia}%)`
            case 4:
                let invert = Math.random()*100;
                return `invert(${invert}%)`
            case 5:
                let brightness = Math.random();
                return `brightness(${brightness})`
            default:
                return "none"
        }
    }

    get title(): string | * {
        return "Super Secret Settings"
    }
}