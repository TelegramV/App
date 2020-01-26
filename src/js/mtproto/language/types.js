type typed = {
    _: string
}

type peerUser = {
    user_id: number
}

type peerChat = {
    chat_id: number
}

type peerChannel = {
    channel_id: number
}

type Peer = peerUser | peerChat | peerChannel

type MessageConstructorFlags = {
    out?: boolean,
    mentioned?: boolean,
    media_unread?: boolean,
    silent?: boolean,
    post?: boolean,
    from_scheduled?: boolean,
    legacy?: boolean,
    edit_hide?: boolean,
}

type messageEntityUnknown = {
    offset: number,
    length: number,
}

type messageEntityMention = {
    offset: number,
    length: number,
}

type messageEntityHashtag = {
    offset: number,
    length: number,
}

type messageEntityBotCommand = {
    offset: number,
    length: number,
}

type messageEntityUrl = {
    offset: number,
    length: number,
}

type messageEntityEmail = {
    offset: number,
    length: number,
}

type messageEntityBold = {
    offset: number,
    length: number,
}

type messageEntityCode = {
    offset: number,
    length: number,
}

type messageEntityPre = {
    offset: number,
    length: number,
    language: string
}

type messageEntityTextUrl = {
    offset: number,
    length: number,
    url: string,
}

type messageEntityMentionName = {
    offset: number,
    length: number,
    user_id: number,
}

type messageEntityPhone = {
    offset: number,
    length: number,
}

type messageEntityCashtag = {
    offset: number,
    length: number,
}

type messageEntityUnderline = {
    offset: number,
    length: number,
}

type messageEntityStrike = {
    offset: number,
    length: number,
}

type messageEntityBlockquote = {
    offset: number,
    length: number,
}

type MessageEntity = messageEntityUnknown |
    messageEntityMention |
    messageEntityHashtag |
    messageEntityBotCommand |
    messageEntityTextUrl |
    messageEntityEmail |
    messageEntityUrl |
    messageEntityBold |
    messageEntityCode |
    messageEntityMentionName |
    messageEntityPhone |
    messageEntityCashtag |
    messageEntityUnderline |
    messageEntityStrike |
    messageEntityBlockquote


export type messageMediaEmpty = {}
export type messageMediaPhoto = {
    photo?: Photo,
    ttl_seconds?: number
}

type photoEmpty = {}
type photo = {
    has_stickers: boolean,
    id: number,
    access_hash: number,
    file_reference: Array,
    date: number,
    sizes: Array<any>,
    dc_id: number,
}

type Photo  = photo | photoEmpty

type MessageMedia = messageMediaEmpty | messageMediaPhoto

export type MessageConstructor = {
    pFlags?: MessageConstructorFlags,
    id: number,
    from_id?: number,
    to_id: Peer,
    fwd_from?: any,
    via_bot_id?: number,
    reply_to_msg_id?: number,
    date: number,
    message: string,
    media?: MessageMedia,
    reply_markup?: any,
    entities?: Array<MessageEntity>,
    views?: number,
    edit_date?: number,
    post_author?: string,
    grouped_id?: number,
    restriction_reason?: any,
}