import { Section } from "../../../Fragments/Section";
import IconButton from "../../../Fragments/IconButton";
import Button from "../../../Fragments/Button";
import { LeftSidebar } from "../../LeftSidebar";
import API from "../../../../../../Api/Telegram/API"
import VUI from "../../../../../VUI"
import Locale from "../../../../../../Api/Localization/Locale"
import {formatDate} from "../../../../../../Utils/date"
import "./ActiveSessionsSidebar.scss"

export class ActiveSessionsSidebar extends LeftSidebar {
    state = {
        authorizations: []
    }

    content(): * {
        return <this.contentWrapper>
            <div class="active-sessions">
                <Section title={this.l("lng_sessions_header")}>
                    <SessionFragment authorization={this.state.current}/>
                    <IconButton icon="stop" text={this.l("lng_settings_reset")} red onClick={this.terminateAll}/>
                </Section>


                <Section title="Other Sessions">
                    {this.state.authorizations?.map(auth => <SessionFragment authorization={auth} 
                                                                            terminatable 
                                                                            onContextClick={() => this.onSessionFragmentClick(auth)}/>)}
                </Section>
            </div>
        </this.contentWrapper>
    }

    onShown() {
        this.refetchAuthorizations();
    }

    onSessionFragmentClick = (auth) => {
        API.account.resetAuthorization(auth.hash).then(result => {
            this.refetchAuthorizations();
        });
        
    }

    refetchAuthorizations = () => {
        API.account.getAuthorizations().then(list => {
            this.setState({
                authorizations: list.authorizations.filter(auth => !auth.current),
                current: list.authorizations.find(auth => auth.current)
            })
        })
    }

    terminateAll = () => {
        VUI.Modal.prompt("",this.l("lng_settings_reset_sure"), () => {
            API.auth.resetAuthorizations().then(() => {
                this.refetchAuthorizations();
                // should we re-register device?
            })
        });
    }

    get title(): string | * {
        return this.l("lng_sessions_other_header")
    }
}

const SessionFragment = ({ authorization, terminatable , onContextClick}) => {
    if(!authorization) return null;
    const {
        hash,
        app_name,
        app_version,
        current,
        device_model,
        platform,
        system_version,
        ip,
        region,
        country,
        date_active,
    } = authorization

    const contextMenuActions = [
        {
            icon: "stop",
            title: Locale.l("lng_settings_reset_button"),
            onClick: onContextClick
        }
    ]

    return <Button text={`${app_name} ${app_version}`}
                    subtext={`${device_model}, ${platform} ${system_version}`}
                    description={`${ip} - ${country}`} 
                    right={!current && <div className="time">{formatDate(date_active)}</div>}
                    onClick={terminatable && VUI.ContextMenu.listener(contextMenuActions)}
                    onContextMenu={terminatable && VUI.ContextMenu.listener(contextMenuActions)}/>
}