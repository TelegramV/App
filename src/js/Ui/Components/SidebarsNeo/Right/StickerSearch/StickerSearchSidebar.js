import { RightSidebar } from "../RightSidebar";
import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent"
import messages from "../../../../../Api/Telegram/messages"
import VButton from "../../../../Elements/Button/VButton"
import StickerSet from "../../../../../Api/Stickers/StickerSet"
import { StickerManager } from "../../../../../Api/Stickers/StickersManager"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"
import StickersState from "../../../../SharedStates/StickersState"
import "./StickerSearchSidebar.scss"

export class StickerSearchSidebar extends RightSidebar {
    state = {
        query: "",
        featured: [],
        found: [],
        nextHash: 0,
        loadMore: true,
    }

    globalState = {
        stickersState: StickersState
    }

    content() {
        let sets = [];
        if (this.state.query) {
            sets = this.state.found ?.map(coveredSet => <StickerSetPreviewComponent
                set={StickerSet.fromRaw(coveredSet.set)}
                added={this.globalState.stickersState.contains(coveredSet.set)}/>);
        } else {
            sets = this.state.featured ?.map(coveredSet => <StickerSetPreviewComponent
                set={StickerSet.fromRaw(coveredSet.set)}
                added={this.globalState.stickersState.contains(coveredSet.set)}/>);
        }

        let emptyText = this.state.query ? "Nothing found..." : "Loading...";
        return <this.contentWrapper onScroll={this.onScroll}>
            <div class="sticker-set-search">
                {sets}
                {sets.length === 0 && <div class="nothing">{emptyText}</div>}
            </div>
        </this.contentWrapper>
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        this.searchInputRef.component.$el.value = this.state.query;
    }

    onScroll = event => {
        const $element = event.target

        if ($element.scrollHeight - 300 <= $element.clientHeight + $element.scrollTop) {
            this.loadMore();
        }
    }

    loadMore = () => {
        if (this.loadingMore || !this.state.loadMore) return;
        this.loadingMore = true;
        const q = this.state.query;
        if (q) {
            messages.searchStickerSets(q, false, this.state.nextHash).then(found => {
                if (found._ === "messages.foundStickerSetsNotModified") {
                    this.setState({
                        loadMore: false
                    })
                    return;
                }

                this.setState({
                    found: this.state.found.concat(found.sets),
                    nextHash: found.hash
                })

                this.loadingMore = false;
            })
        } else {
            messages.getFeaturedStickers(this.state.nextHash).then(featured => {
                if (featured._ === "messages.featuredStickersNotModified") {
                    this.setState({
                        loadMore: false
                    })
                    return;
                }

                this.setState({
                    featured: this.state.featured.concat(featured.sets),
                    nextHash: featured.hash
                })

                this.loadingMore = false;
            })
        }
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
        if (this.state.featured.length === 0) {
            messages.getFeaturedStickers().then(featured => {
                this.setState({
                    featured: featured.sets,
                    nextHash: featured.hash
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

        if (q === this.state.query) return;

        if (q === "" && this.state.query !== "") { //reset to featured
            this.setState({
                query: "",
                found: [],
                nextHash: 0
            })
            return;
        }

        messages.searchStickerSets(q).then(found => {
            if (event.target.value.trim() !== q) return; //something changed while searching, cancel patch
            if (this.state.found === found.sets) return; //nothing changed, no need to patch

            this.setState({
                query: q,
                found: found.sets,
                nextHash: found.hash,
            })
            this.searchInputRef.component.$el.value = q
        })

    }
}

class StickerSetPreviewComponent extends StatefulComponent {

    render(props) {
        let stickers = [];
        if (props.set.isFetched) {
            for (let sticker of props.set.documents) {
                if (stickers.length === 5) break; // yes, I'm lazy to make for(let i = 0; i<Math.min(5, this.state.fetchedSet.documents.length); i++)
                stickers.push(<BetterStickerComponent width={75} document={sticker} hideAnimated/>)
            }
        }

        let addClasses = {
            addButton: true,
            added: props.added
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
                    <div class={addClasses}>
                        <VButton isUppercase={false} onClick={this.handleAddClick}>
                            {props.added ? "Added" : "Add"}
                        </VButton>
                    </div>
                </div>
                <div class="container">
                    {stickers}
                </div>
            </div>
        )
    }

    componentDidMount() {
        if (!this.props.set.isFetched) {
            this.props.set.getStickerSet().then(set => {
                this.forceUpdate();
            })
        }
    }

    componentWillUpdate(props) {
        if (!props.set.isFetched) {
            props.set.getStickerSet().then(set => {
                this.forceUpdate();
            })
        }
    }

    handleAddClick = () => {
        if (this.props.added) {
            StickerManager.uninstallStickerSet(this.props.set)
        } else {
            StickerManager.installStickerSet(this.props.set)
        }
    }
}