import { RightSidebar } from "../RightSidebar";
import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent"
import messages from "../../../../../Api/Telegram/messages"
import VButton from "../../../../Elements/Button/VButton"
import StickerSet from "../../../../../Api/Stickers/StickerSet"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"
import "./StickerSearchSidebar.scss"

export class StickerSearchSidebar extends RightSidebar {
    state = {
        query: "",
        featured: [], //push more sets while scrolling
        found: []
    }

    content(): * {
    	let sets = [];
    	if(this.state.query) {
    		sets = this.state.found?.map(coveredSet => <StickerSetPreviewComponent set={new StickerSet(coveredSet.set)}/>);
    	} else {
    		sets = this.state.featured?.map(coveredSet => <StickerSetPreviewComponent set={new StickerSet(coveredSet.set)}/>);
    	}

    	let emptyText = this.state.query? "Nothing found..." : "Loading...";
        return <this.contentWrapper>
        	<div class="sticker-set-search">
        		{sets}
        		{sets.length===0 && <div class="nothing">{emptyText}</div>}
        	</div>
        </this.contentWrapper>
    }

    get searchLazyLevel(): number {
        return 500
    }

    get isSearchAsTitle(): boolean {
        return true
    }

    get leftButtonIcon() {
        return "back"
    }

    onShown(params) {
    	if(this.state.featured.length === 0) {
	        messages.getFeaturedStickers().then(featured => {
	            this.setState({
	                featured: featured.sets
	            })
	        })
	    }
    }

    onHide() {
    	this.searchInputRef.component.$el.value = "";
    	this.setState({
    		query: "",
    		found: []
    	})
    }

    onSearchInputUpdated = (event) => {
    	const q = event.target.value.trim();

    	if(q === this.state.query) return;

    	if(q === "" && this.state.query !== "") { //reset to featured
    		this.setState({
    			query: "",
    			found: []
    		})
    		return;
    	}

    	messages.searchStickerSets(q).then(found => {
    		if(event.target.value.trim() !== q) return; //something changed while searching, cancel patch
    		if(this.state.found === found.sets) return; //nothing changed, no need to patch
    		this.setState({
    			query: q,
    			found: found.sets
    		})
    	})

    }
}

class StickerSetPreviewComponent extends StatefulComponent {

    render(props) {
    	let stickers = [];
    	if(props.set.isFetched) {
    		for(let sticker of props.set.documents) {
    			if(stickers.length===5) break; // yes, I'm lazy to make for(let i = 0; i<Math.min(5, this.state.fetchedSet.documents.length); i++)
    			stickers.push(<BetterStickerComponent width={75} document={sticker}/>)
    		}
    	}

        return (
            <div class="set-preview">
				<div class="header">
					<div class="info">
						<div class="name">
							{props.set.raw.title}
						</div>
						<div class="count">
							{props.set.raw.count} stickers
						</div>
					</div>
					<div class="add">
						<VButton onClick={_ => console.log("To be implemented...")}>Add</VButton>
					</div>
				</div>
				<div class="container">
					{stickers}
				</div>
			</div>
        )
    }

    componentDidMount() {
    	if(!this.props.set.isFetched) {
	    	this.props.set.getStickerSet().then(set => {
	    		this.forceUpdate();
	    	})
	    }
    }

    componentWillUpdate(props) {
    	if(!props.set.isFetched) {
	    	props.set.getStickerSet().then(set => {
	    		this.forceUpdate();
	    	})
	    }
    }
}