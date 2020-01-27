export type boolFalse = {
}

export type boolTrue = {
}

export type true = {
}

export type error = {
    code: number,
    text: string,
}

export type null = {
}

export type inputPeerEmpty = {
}

export type inputPeerSelf = {
}

export type inputPeerChat = {
    chat_id: number,
}

export type inputPeerUser = {
    user_id: number,
    access_hash: string | number[] | Uint8Array,
}

export type inputPeerChannel = {
    channel_id: number,
    access_hash: string | number[] | Uint8Array,
}

export type inputPeerUserFromMessage = {
    peer: InputPeer,
    msg_id: number,
    user_id: number,
}

export type inputPeerChannelFromMessage = {
    peer: InputPeer,
    msg_id: number,
    channel_id: number,
}

export type inputUserEmpty = {
}

export type inputUserSelf = {
}

export type inputUser = {
    user_id: number,
    access_hash: string | number[] | Uint8Array,
}

export type inputUserFromMessage = {
    peer: InputPeer,
    msg_id: number,
    user_id: number,
}

export type inputPhoneContact = {
    client_id: string | number[] | Uint8Array,
    phone: string,
    first_name: string,
    last_name: string,
}

export type inputFile = {
    id: string | number[] | Uint8Array,
    parts: number,
    name: string,
    md5_checksum: string,
}

export type inputFileBig = {
    id: string | number[] | Uint8Array,
    parts: number,
    name: string,
}

export type inputMediaEmpty = {
}

export type inputMediaUploadedPhoto = {
    file: InputFile,
    stickers?: Array<InputDocument>,
    ttl_seconds?: number,
}

export type inputMediaPhoto = {
    id: InputPhoto,
    ttl_seconds?: number,
}

export type inputMediaGeoPoint = {
    geo_point: InputGeoPoint,
}

export type inputMediaContact = {
    phone_number: string,
    first_name: string,
    last_name: string,
    vcard: string,
}

export type inputMediaUploadedDocument = {
    nosound_video?: boolean,
    file: InputFile,
    thumb?: InputFile,
    mime_type: string,
    attributes: Array<DocumentAttribute>,
    stickers?: Array<InputDocument>,
    ttl_seconds?: number,
}

export type inputMediaDocument = {
    id: InputDocument,
    ttl_seconds?: number,
}

export type inputMediaVenue = {
    geo_point: InputGeoPoint,
    title: string,
    address: string,
    provider: string,
    venue_id: string,
    venue_type: string,
}

export type inputMediaGifExternal = {
    url: string,
    q: string,
}

export type inputMediaPhotoExternal = {
    url: string,
    ttl_seconds?: number,
}

export type inputMediaDocumentExternal = {
    url: string,
    ttl_seconds?: number,
}

export type inputMediaGame = {
    id: InputGame,
}

export type inputMediaInvoice = {
    title: string,
    description: string,
    photo?: InputWebDocument,
    invoice: Invoice,
    payload: Uint8Array | number[],
    provider: string,
    provider_data: DataJSON,
    start_param: string,
}

export type inputMediaGeoLive = {
    stopped?: boolean,
    geo_point: InputGeoPoint,
    period?: number,
}

export type inputMediaPoll = {
    poll: Poll,
    correct_answers?: Array<Uint8Array | number[]>,
}

export type inputChatPhotoEmpty = {
}

export type inputChatUploadedPhoto = {
    file: InputFile,
}

export type inputChatPhoto = {
    id: InputPhoto,
}

export type inputGeoPointEmpty = {
}

export type inputGeoPoint = {
    lat: number,
    long: number,
}

export type inputPhotoEmpty = {
}

export type inputPhoto = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    file_reference: Uint8Array | number[],
}

export type inputFileLocation = {
    volume_id: string | number[] | Uint8Array,
    local_id: number,
    secret: string | number[] | Uint8Array,
    file_reference: Uint8Array | number[],
}

export type inputEncryptedFileLocation = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
}

export type inputDocumentFileLocation = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    file_reference: Uint8Array | number[],
    thumb_size: string,
}

export type inputSecureFileLocation = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
}

export type inputTakeoutFileLocation = {
}

export type inputPhotoFileLocation = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    file_reference: Uint8Array | number[],
    thumb_size: string,
}

export type inputPhotoLegacyFileLocation = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    file_reference: Uint8Array | number[],
    volume_id: string | number[] | Uint8Array,
    local_id: number,
    secret: string | number[] | Uint8Array,
}

export type inputPeerPhotoFileLocation = {
    big?: boolean,
    peer: InputPeer,
    volume_id: string | number[] | Uint8Array,
    local_id: number,
}

export type inputStickerSetThumb = {
    stickerset: InputStickerSet,
    volume_id: string | number[] | Uint8Array,
    local_id: number,
}

export type peerUser = {
    user_id: number,
}

export type peerChat = {
    chat_id: number,
}

export type peerChannel = {
    channel_id: number,
}

export type storage__fileUnknown = {
}

export type storage__filePartial = {
}

export type storage__fileJpeg = {
}

export type storage__fileGif = {
}

export type storage__filePng = {
}

export type storage__filePdf = {
}

export type storage__fileMp3 = {
}

export type storage__fileMov = {
}

export type storage__fileMp4 = {
}

export type storage__fileWebp = {
}

export type userEmpty = {
    id: number,
}

export type user = {
    self?: boolean,
    contact?: boolean,
    mutual_contact?: boolean,
    deleted?: boolean,
    bot?: boolean,
    bot_chat_history?: boolean,
    bot_nochats?: boolean,
    verified?: boolean,
    restricted?: boolean,
    min?: boolean,
    bot_inline_geo?: boolean,
    support?: boolean,
    scam?: boolean,
    id: number,
    access_hash?: string | number[] | Uint8Array,
    first_name?: string,
    last_name?: string,
    username?: string,
    phone?: string,
    photo?: UserProfilePhoto,
    status?: UserStatus,
    bot_info_version?: number,
    restriction_reason?: Array<RestrictionReason>,
    bot_inline_placeholder?: string,
    lang_code?: string,
}

export type userProfilePhotoEmpty = {
}

export type userProfilePhoto = {
    photo_id: string | number[] | Uint8Array,
    photo_small: FileLocation,
    photo_big: FileLocation,
    dc_id: number,
}

export type userStatusEmpty = {
}

export type userStatusOnline = {
    expires: number,
}

export type userStatusOffline = {
    was_online: number,
}

export type userStatusRecently = {
}

export type userStatusLastWeek = {
}

export type userStatusLastMonth = {
}

export type chatEmpty = {
    id: number,
}

export type chat = {
    creator?: boolean,
    kicked?: boolean,
    left?: boolean,
    deactivated?: boolean,
    id: number,
    title: string,
    photo: ChatPhoto,
    participants_count: number,
    date: number,
    version: number,
    migrated_to?: InputChannel,
    admin_rights?: ChatAdminRights,
    default_banned_rights?: ChatBannedRights,
}

export type chatForbidden = {
    id: number,
    title: string,
}

export type channel = {
    creator?: boolean,
    left?: boolean,
    broadcast?: boolean,
    verified?: boolean,
    megagroup?: boolean,
    restricted?: boolean,
    signatures?: boolean,
    min?: boolean,
    scam?: boolean,
    has_link?: boolean,
    has_geo?: boolean,
    slowmode_enabled?: boolean,
    id: number,
    access_hash?: string | number[] | Uint8Array,
    title: string,
    username?: string,
    photo: ChatPhoto,
    date: number,
    version: number,
    restriction_reason?: Array<RestrictionReason>,
    admin_rights?: ChatAdminRights,
    banned_rights?: ChatBannedRights,
    default_banned_rights?: ChatBannedRights,
    participants_count?: number,
}

export type channelForbidden = {
    broadcast?: boolean,
    megagroup?: boolean,
    id: number,
    access_hash: string | number[] | Uint8Array,
    title: string,
    until_date?: number,
}

export type chatFull = {
    can_set_username?: boolean,
    has_scheduled?: boolean,
    id: number,
    about: string,
    participants: ChatParticipants,
    chat_photo?: Photo,
    notify_settings: PeerNotifySettings,
    exported_invite: ExportedChatInvite,
    bot_info?: Array<BotInfo>,
    pinned_msg_id?: number,
    folder_id?: number,
}

export type channelFull = {
    can_view_participants?: boolean,
    can_set_username?: boolean,
    can_set_stickers?: boolean,
    hidden_prehistory?: boolean,
    can_view_stats?: boolean,
    can_set_location?: boolean,
    has_scheduled?: boolean,
    id: number,
    about: string,
    participants_count?: number,
    admins_count?: number,
    kicked_count?: number,
    banned_count?: number,
    online_count?: number,
    read_inbox_max_id: number,
    read_outbox_max_id: number,
    unread_count: number,
    chat_photo: Photo,
    notify_settings: PeerNotifySettings,
    exported_invite: ExportedChatInvite,
    bot_info: Array<BotInfo>,
    migrated_from_chat_id?: number,
    migrated_from_max_id?: number,
    pinned_msg_id?: number,
    stickerset?: StickerSet,
    available_min_id?: number,
    folder_id?: number,
    linked_chat_id?: number,
    location?: ChannelLocation,
    slowmode_seconds?: number,
    slowmode_next_send_date?: number,
    pts: number,
}

export type chatParticipant = {
    user_id: number,
    inviter_id: number,
    date: number,
}

export type chatParticipantCreator = {
    user_id: number,
}

export type chatParticipantAdmin = {
    user_id: number,
    inviter_id: number,
    date: number,
}

export type chatParticipantsForbidden = {
    chat_id: number,
    self_participant?: ChatParticipant,
}

export type chatParticipants = {
    chat_id: number,
    participants: Array<ChatParticipant>,
    version: number,
}

export type chatPhotoEmpty = {
}

export type chatPhoto = {
    photo_small: FileLocation,
    photo_big: FileLocation,
    dc_id: number,
}

export type messageEmpty = {
    id: number,
}

export type message = {
    out?: boolean,
    mentioned?: boolean,
    media_unread?: boolean,
    silent?: boolean,
    post?: boolean,
    from_scheduled?: boolean,
    legacy?: boolean,
    edit_hide?: boolean,
    id: number,
    from_id?: number,
    to_id: Peer,
    fwd_from?: MessageFwdHeader,
    via_bot_id?: number,
    reply_to_msg_id?: number,
    date: number,
    message: string,
    media?: MessageMedia,
    reply_markup?: ReplyMarkup,
    entities?: Array<MessageEntity>,
    views?: number,
    edit_date?: number,
    post_author?: string,
    grouped_id?: string | number[] | Uint8Array,
    restriction_reason?: Array<RestrictionReason>,
}

export type messageService = {
    out?: boolean,
    mentioned?: boolean,
    media_unread?: boolean,
    silent?: boolean,
    post?: boolean,
    legacy?: boolean,
    id: number,
    from_id?: number,
    to_id: Peer,
    reply_to_msg_id?: number,
    date: number,
    action: MessageAction,
}

export type messageMediaEmpty = {
}

export type messageMediaPhoto = {
    photo?: Photo,
    ttl_seconds?: number,
}

export type messageMediaGeo = {
    geo: GeoPoint,
}

export type messageMediaContact = {
    phone_number: string,
    first_name: string,
    last_name: string,
    vcard: string,
    user_id: number,
}

export type messageMediaUnsupported = {
}

export type messageMediaDocument = {
    document?: Document,
    ttl_seconds?: number,
}

export type messageMediaWebPage = {
    webpage: WebPage,
}

export type messageMediaVenue = {
    geo: GeoPoint,
    title: string,
    address: string,
    provider: string,
    venue_id: string,
    venue_type: string,
}

export type messageMediaGame = {
    game: Game,
}

export type messageMediaInvoice = {
    shipping_address_requested?: boolean,
    test?: boolean,
    title: string,
    description: string,
    photo?: WebDocument,
    receipt_msg_id?: number,
    currency: string,
    total_amount: string | number[] | Uint8Array,
    start_param: string,
}

export type messageMediaGeoLive = {
    geo: GeoPoint,
    period: number,
}

export type messageMediaPoll = {
    poll: Poll,
    results: PollResults,
}

export type messageActionEmpty = {
}

export type messageActionChatCreate = {
    title: string,
    users: Array<number>,
}

export type messageActionChatEditTitle = {
    title: string,
}

export type messageActionChatEditPhoto = {
    photo: Photo,
}

export type messageActionChatDeletePhoto = {
}

export type messageActionChatAddUser = {
    users: Array<number>,
}

export type messageActionChatDeleteUser = {
    user_id: number,
}

export type messageActionChatJoinedByLink = {
    inviter_id: number,
}

export type messageActionChannelCreate = {
    title: string,
}

export type messageActionChatMigrateTo = {
    channel_id: number,
}

export type messageActionChannelMigrateFrom = {
    title: string,
    chat_id: number,
}

export type messageActionPinMessage = {
}

export type messageActionHistoryClear = {
}

export type messageActionGameScore = {
    game_id: string | number[] | Uint8Array,
    score: number,
}

export type messageActionPaymentSentMe = {
    currency: string,
    total_amount: string | number[] | Uint8Array,
    payload: Uint8Array | number[],
    info?: PaymentRequestedInfo,
    shipping_option_id?: string,
    charge: PaymentCharge,
}

export type messageActionPaymentSent = {
    currency: string,
    total_amount: string | number[] | Uint8Array,
}

export type messageActionPhoneCall = {
    video?: boolean,
    call_id: string | number[] | Uint8Array,
    reason?: PhoneCallDiscardReason,
    duration?: number,
}

export type messageActionScreenshotTaken = {
}

export type messageActionCustomAction = {
    message: string,
}

export type messageActionBotAllowed = {
    domain: string,
}

export type messageActionSecureValuesSentMe = {
    values: Array<SecureValue>,
    credentials: SecureCredentialsEncrypted,
}

export type messageActionSecureValuesSent = {
    types: Array<SecureValueType>,
}

export type messageActionContactSignUp = {
}

export type dialog = {
    pinned?: boolean,
    unread_mark?: boolean,
    peer: Peer,
    top_message: number,
    read_inbox_max_id: number,
    read_outbox_max_id: number,
    unread_count: number,
    unread_mentions_count: number,
    notify_settings: PeerNotifySettings,
    pts?: number,
    draft?: DraftMessage,
    folder_id?: number,
}

export type dialogFolder = {
    pinned?: boolean,
    folder: Folder,
    peer: Peer,
    top_message: number,
    unread_muted_peers_count: number,
    unread_unmuted_peers_count: number,
    unread_muted_messages_count: number,
    unread_unmuted_messages_count: number,
}

export type photoEmpty = {
    id: string | number[] | Uint8Array,
}

export type photo = {
    has_stickers?: boolean,
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    file_reference: Uint8Array | number[],
    date: number,
    sizes: Array<PhotoSize>,
    dc_id: number,
}

export type photoSizeEmpty = {
    type: string,
}

export type photoSize = {
    type: string,
    location: FileLocation,
    w: number,
    h: number,
    size: number,
}

export type photoCachedSize = {
    type: string,
    location: FileLocation,
    w: number,
    h: number,
    bytes: Uint8Array | number[],
}

export type photoStrippedSize = {
    type: string,
    bytes: Uint8Array | number[],
}

export type geoPointEmpty = {
}

export type geoPoint = {
    long: number,
    lat: number,
    access_hash: string | number[] | Uint8Array,
}

export type auth__sentCode = {
    type: auth__SentCodeType,
    phone_code_hash: string,
    next_type?: auth__CodeType,
    timeout?: number,
}

export type auth__authorization = {
    tmp_sessions?: number,
    user: User,
}

export type auth__authorizationSignUpRequired = {
    terms_of_service?: help__TermsOfService,
}

export type auth__exportedAuthorization = {
    id: number,
    bytes: Uint8Array | number[],
}

export type inputNotifyPeer = {
    peer: InputPeer,
}

export type inputNotifyUsers = {
}

export type inputNotifyChats = {
}

export type inputNotifyBroadcasts = {
}

export type inputPeerNotifySettings = {
    show_previews?: Bool,
    silent?: Bool,
    mute_until?: number,
    sound?: string,
}

export type peerNotifySettings = {
    show_previews?: Bool,
    silent?: Bool,
    mute_until?: number,
    sound?: string,
}

export type peerSettings = {
    report_spam?: boolean,
    add_contact?: boolean,
    block_contact?: boolean,
    share_contact?: boolean,
    need_contacts_exception?: boolean,
    report_geo?: boolean,
}

export type wallPaper = {
    id: string | number[] | Uint8Array,
    creator?: boolean,
    default?: boolean,
    pattern?: boolean,
    dark?: boolean,
    access_hash: string | number[] | Uint8Array,
    slug: string,
    document: Document,
    settings?: WallPaperSettings,
}

export type wallPaperNoFile = {
    default?: boolean,
    dark?: boolean,
    settings?: WallPaperSettings,
}

export type inputReportReasonSpam = {
}

export type inputReportReasonViolence = {
}

export type inputReportReasonPornography = {
}

export type inputReportReasonChildAbuse = {
}

export type inputReportReasonOther = {
    text: string,
}

export type inputReportReasonCopyright = {
}

export type inputReportReasonGeoIrrelevant = {
}

export type userFull = {
    blocked?: boolean,
    phone_calls_available?: boolean,
    phone_calls_private?: boolean,
    can_pin_message?: boolean,
    has_scheduled?: boolean,
    user: User,
    about?: string,
    settings: PeerSettings,
    profile_photo?: Photo,
    notify_settings: PeerNotifySettings,
    bot_info?: BotInfo,
    pinned_msg_id?: number,
    common_chats_count: number,
    folder_id?: number,
}

export type contact = {
    user_id: number,
    mutual: Bool,
}

export type importedContact = {
    user_id: number,
    client_id: string | number[] | Uint8Array,
}

export type contactBlocked = {
    user_id: number,
    date: number,
}

export type contactStatus = {
    user_id: number,
    status: UserStatus,
}

export type contacts__contactsNotModified = {
}

export type contacts__contacts = {
    contacts: Array<Contact>,
    saved_count: number,
    users: Array<User>,
}

export type contacts__importedContacts = {
    imported: Array<ImportedContact>,
    popular_invites: Array<PopularContact>,
    retry_contacts: Array<string | number[] | Uint8Array>,
    users: Array<User>,
}

export type contacts__blocked = {
    blocked: Array<ContactBlocked>,
    users: Array<User>,
}

export type contacts__blockedSlice = {
    count: number,
    blocked: Array<ContactBlocked>,
    users: Array<User>,
}

export type messages__dialogs = {
    dialogs: Array<Dialog>,
    messages: Array<Message>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type messages__dialogsSlice = {
    count: number,
    dialogs: Array<Dialog>,
    messages: Array<Message>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type messages__dialogsNotModified = {
    count: number,
}

export type messages__messages = {
    messages: Array<Message>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type messages__messagesSlice = {
    inexact?: boolean,
    count: number,
    next_rate?: number,
    messages: Array<Message>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type messages__channelMessages = {
    inexact?: boolean,
    pts: number,
    count: number,
    messages: Array<Message>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type messages__messagesNotModified = {
    count: number,
}

export type messages__chats = {
    chats: Array<Chat>,
}

export type messages__chatsSlice = {
    count: number,
    chats: Array<Chat>,
}

export type messages__chatFull = {
    full_chat: ChatFull,
    chats: Array<Chat>,
    users: Array<User>,
}

export type messages__affectedHistory = {
    pts: number,
    pts_count: number,
    offset: number,
}

export type inputMessagesFilterEmpty = {
}

export type inputMessagesFilterPhotos = {
}

export type inputMessagesFilterVideo = {
}

export type inputMessagesFilterPhotoVideo = {
}

export type inputMessagesFilterDocument = {
}

export type inputMessagesFilterUrl = {
}

export type inputMessagesFilterGif = {
}

export type inputMessagesFilterVoice = {
}

export type inputMessagesFilterMusic = {
}

export type inputMessagesFilterChatPhotos = {
}

export type inputMessagesFilterPhoneCalls = {
    missed?: boolean,
}

export type inputMessagesFilterRoundVoice = {
}

export type inputMessagesFilterRoundVideo = {
}

export type inputMessagesFilterMyMentions = {
}

export type inputMessagesFilterGeo = {
}

export type inputMessagesFilterContacts = {
}

export type updateNewMessage = {
    message: Message,
    pts: number,
    pts_count: number,
}

export type updateMessageID = {
    id: number,
    random_id: string | number[] | Uint8Array,
}

export type updateDeleteMessages = {
    messages: Array<number>,
    pts: number,
    pts_count: number,
}

export type updateUserTyping = {
    user_id: number,
    action: SendMessageAction,
}

export type updateChatUserTyping = {
    chat_id: number,
    user_id: number,
    action: SendMessageAction,
}

export type updateChatParticipants = {
    participants: ChatParticipants,
}

export type updateUserStatus = {
    user_id: number,
    status: UserStatus,
}

export type updateUserName = {
    user_id: number,
    first_name: string,
    last_name: string,
    username: string,
}

export type updateUserPhoto = {
    user_id: number,
    date: number,
    photo: UserProfilePhoto,
    previous: Bool,
}

export type updateNewEncryptedMessage = {
    message: EncryptedMessage,
    qts: number,
}

export type updateEncryptedChatTyping = {
    chat_id: number,
}

export type updateEncryption = {
    chat: EncryptedChat,
    date: number,
}

export type updateEncryptedMessagesRead = {
    chat_id: number,
    max_date: number,
    date: number,
}

export type updateChatParticipantAdd = {
    chat_id: number,
    user_id: number,
    inviter_id: number,
    date: number,
    version: number,
}

export type updateChatParticipantDelete = {
    chat_id: number,
    user_id: number,
    version: number,
}

export type updateDcOptions = {
    dc_options: Array<DcOption>,
}

export type updateUserBlocked = {
    user_id: number,
    blocked: Bool,
}

export type updateNotifySettings = {
    peer: NotifyPeer,
    notify_settings: PeerNotifySettings,
}

export type updateServiceNotification = {
    popup?: boolean,
    inbox_date?: number,
    type: string,
    message: string,
    media: MessageMedia,
    entities: Array<MessageEntity>,
}

export type updatePrivacy = {
    key: PrivacyKey,
    rules: Array<PrivacyRule>,
}

export type updateUserPhone = {
    user_id: number,
    phone: string,
}

export type updateReadHistoryInbox = {
    folder_id?: number,
    peer: Peer,
    max_id: number,
    still_unread_count: number,
    pts: number,
    pts_count: number,
}

export type updateReadHistoryOutbox = {
    peer: Peer,
    max_id: number,
    pts: number,
    pts_count: number,
}

export type updateWebPage = {
    webpage: WebPage,
    pts: number,
    pts_count: number,
}

export type updateReadMessagesContents = {
    messages: Array<number>,
    pts: number,
    pts_count: number,
}

export type updateChannelTooLong = {
    channel_id: number,
    pts?: number,
}

export type updateChannel = {
    channel_id: number,
}

export type updateNewChannelMessage = {
    message: Message,
    pts: number,
    pts_count: number,
}

export type updateReadChannelInbox = {
    folder_id?: number,
    channel_id: number,
    max_id: number,
    still_unread_count: number,
    pts: number,
}

export type updateDeleteChannelMessages = {
    channel_id: number,
    messages: Array<number>,
    pts: number,
    pts_count: number,
}

export type updateChannelMessageViews = {
    channel_id: number,
    id: number,
    views: number,
}

export type updateChatParticipantAdmin = {
    chat_id: number,
    user_id: number,
    is_admin: Bool,
    version: number,
}

export type updateNewStickerSet = {
    stickerset: messages__StickerSet,
}

export type updateStickerSetsOrder = {
    masks?: boolean,
    order: Array<string | number[] | Uint8Array>,
}

export type updateStickerSets = {
}

export type updateSavedGifs = {
}

export type updateBotInlineQuery = {
    query_id: string | number[] | Uint8Array,
    user_id: number,
    query: string,
    geo?: GeoPoint,
    offset: string,
}

export type updateBotInlineSend = {
    user_id: number,
    query: string,
    geo?: GeoPoint,
    id: string,
    msg_id?: InputBotInlineMessageID,
}

export type updateEditChannelMessage = {
    message: Message,
    pts: number,
    pts_count: number,
}

export type updateChannelPinnedMessage = {
    channel_id: number,
    id: number,
}

export type updateBotCallbackQuery = {
    query_id: string | number[] | Uint8Array,
    user_id: number,
    peer: Peer,
    msg_id: number,
    chat_instance: string | number[] | Uint8Array,
    data?: Uint8Array | number[],
    game_short_name?: string,
}

export type updateEditMessage = {
    message: Message,
    pts: number,
    pts_count: number,
}

export type updateInlineBotCallbackQuery = {
    query_id: string | number[] | Uint8Array,
    user_id: number,
    msg_id: InputBotInlineMessageID,
    chat_instance: string | number[] | Uint8Array,
    data?: Uint8Array | number[],
    game_short_name?: string,
}

export type updateReadChannelOutbox = {
    channel_id: number,
    max_id: number,
}

export type updateDraftMessage = {
    peer: Peer,
    draft: DraftMessage,
}

export type updateReadFeaturedStickers = {
}

export type updateRecentStickers = {
}

export type updateConfig = {
}

export type updatePtsChanged = {
}

export type updateChannelWebPage = {
    channel_id: number,
    webpage: WebPage,
    pts: number,
    pts_count: number,
}

export type updateDialogPinned = {
    pinned?: boolean,
    folder_id?: number,
    peer: DialogPeer,
}

export type updatePinnedDialogs = {
    folder_id?: number,
    order?: Array<DialogPeer>,
}

export type updateBotWebhookJSON = {
    data: DataJSON,
}

export type updateBotWebhookJSONQuery = {
    query_id: string | number[] | Uint8Array,
    data: DataJSON,
    timeout: number,
}

export type updateBotShippingQuery = {
    query_id: string | number[] | Uint8Array,
    user_id: number,
    payload: Uint8Array | number[],
    shipping_address: PostAddress,
}

export type updateBotPrecheckoutQuery = {
    query_id: string | number[] | Uint8Array,
    user_id: number,
    payload: Uint8Array | number[],
    info?: PaymentRequestedInfo,
    shipping_option_id?: string,
    currency: string,
    total_amount: string | number[] | Uint8Array,
}

export type updatePhoneCall = {
    phone_call: PhoneCall,
}

export type updateLangPackTooLong = {
    lang_code: string,
}

export type updateLangPack = {
    difference: LangPackDifference,
}

export type updateFavedStickers = {
}

export type updateChannelReadMessagesContents = {
    channel_id: number,
    messages: Array<number>,
}

export type updateContactsReset = {
}

export type updateChannelAvailableMessages = {
    channel_id: number,
    available_min_id: number,
}

export type updateDialogUnreadMark = {
    unread?: boolean,
    peer: DialogPeer,
}

export type updateUserPinnedMessage = {
    user_id: number,
    id: number,
}

export type updateChatPinnedMessage = {
    chat_id: number,
    id: number,
    version: number,
}

export type updateMessagePoll = {
    poll_id: string | number[] | Uint8Array,
    poll?: Poll,
    results: PollResults,
}

export type updateChatDefaultBannedRights = {
    peer: Peer,
    default_banned_rights: ChatBannedRights,
    version: number,
}

export type updateFolderPeers = {
    folder_peers: Array<FolderPeer>,
    pts: number,
    pts_count: number,
}

export type updatePeerSettings = {
    peer: Peer,
    settings: PeerSettings,
}

export type updatePeerLocated = {
    peers: Array<PeerLocated>,
}

export type updateNewScheduledMessage = {
    message: Message,
}

export type updateDeleteScheduledMessages = {
    peer: Peer,
    messages: Array<number>,
}

export type updateTheme = {
    theme: Theme,
}

export type updateGeoLiveViewed = {
    peer: Peer,
    msg_id: number,
}

export type updateLoginToken = {
}

export type updateMessagePollVote = {
    poll_id: string | number[] | Uint8Array,
    user_id: number,
    options: Array<Uint8Array | number[]>,
}

export type updates__state = {
    pts: number,
    qts: number,
    date: number,
    seq: number,
    unread_count: number,
}

export type updates__differenceEmpty = {
    date: number,
    seq: number,
}

export type updates__difference = {
    new_messages: Array<Message>,
    new_encrypted_messages: Array<EncryptedMessage>,
    other_updates: Array<Update>,
    chats: Array<Chat>,
    users: Array<User>,
    state: updates__State,
}

export type updates__differenceSlice = {
    new_messages: Array<Message>,
    new_encrypted_messages: Array<EncryptedMessage>,
    other_updates: Array<Update>,
    chats: Array<Chat>,
    users: Array<User>,
    intermediate_state: updates__State,
}

export type updates__differenceTooLong = {
    pts: number,
}

export type updatesTooLong = {
}

export type updateShortMessage = {
    out?: boolean,
    mentioned?: boolean,
    media_unread?: boolean,
    silent?: boolean,
    id: number,
    user_id: number,
    message: string,
    pts: number,
    pts_count: number,
    date: number,
    fwd_from?: MessageFwdHeader,
    via_bot_id?: number,
    reply_to_msg_id?: number,
    entities?: Array<MessageEntity>,
}

export type updateShortChatMessage = {
    out?: boolean,
    mentioned?: boolean,
    media_unread?: boolean,
    silent?: boolean,
    id: number,
    from_id: number,
    chat_id: number,
    message: string,
    pts: number,
    pts_count: number,
    date: number,
    fwd_from?: MessageFwdHeader,
    via_bot_id?: number,
    reply_to_msg_id?: number,
    entities?: Array<MessageEntity>,
}

export type updateShort = {
    update: Update,
    date: number,
}

export type updatesCombined = {
    updates: Array<Update>,
    users: Array<User>,
    chats: Array<Chat>,
    date: number,
    seq_start: number,
    seq: number,
}

export type updates = {
    updates: Array<Update>,
    users: Array<User>,
    chats: Array<Chat>,
    date: number,
    seq: number,
}

export type updateShortSentMessage = {
    out?: boolean,
    id: number,
    pts: number,
    pts_count: number,
    date: number,
    media?: MessageMedia,
    entities?: Array<MessageEntity>,
}

export type photos__photos = {
    photos: Array<Photo>,
    users: Array<User>,
}

export type photos__photosSlice = {
    count: number,
    photos: Array<Photo>,
    users: Array<User>,
}

export type photos__photo = {
    photo: Photo,
    users: Array<User>,
}

export type upload__file = {
    type: storage__FileType,
    mtime: number,
    bytes: Uint8Array | number[],
}

export type upload__fileCdnRedirect = {
    dc_id: number,
    file_token: Uint8Array | number[],
    encryption_key: Uint8Array | number[],
    encryption_iv: Uint8Array | number[],
    file_hashes: Array<FileHash>,
}

export type dcOption = {
    ipv6?: boolean,
    media_only?: boolean,
    tcpo_only?: boolean,
    cdn?: boolean,
    static?: boolean,
    id: number,
    ip_address: string,
    port: number,
    secret?: Uint8Array | number[],
}

export type config = {
    phonecalls_enabled?: boolean,
    default_p2p_contacts?: boolean,
    preload_featured_stickers?: boolean,
    ignore_phone_entities?: boolean,
    revoke_pm_inbox?: boolean,
    blocked_mode?: boolean,
    pfs_enabled?: boolean,
    date: number,
    expires: number,
    test_mode: Bool,
    this_dc: number,
    dc_options: Array<DcOption>,
    dc_txt_domain_name: string,
    chat_size_max: number,
    megagroup_size_max: number,
    forwarded_count_max: number,
    online_update_period_ms: number,
    offline_blur_timeout_ms: number,
    offline_idle_timeout_ms: number,
    online_cloud_timeout_ms: number,
    notify_cloud_delay_ms: number,
    notify_default_delay_ms: number,
    push_chat_period_ms: number,
    push_chat_limit: number,
    saved_gifs_limit: number,
    edit_time_limit: number,
    revoke_time_limit: number,
    revoke_pm_time_limit: number,
    rating_e_decay: number,
    stickers_recent_limit: number,
    stickers_faved_limit: number,
    channels_read_media_period: number,
    tmp_sessions?: number,
    pinned_dialogs_count_max: number,
    pinned_infolder_count_max: number,
    call_receive_timeout_ms: number,
    call_ring_timeout_ms: number,
    call_connect_timeout_ms: number,
    call_packet_timeout_ms: number,
    me_url_prefix: string,
    autoupdate_url_prefix?: string,
    gif_search_username?: string,
    venue_search_username?: string,
    img_search_username?: string,
    static_maps_provider?: string,
    caption_length_max: number,
    message_length_max: number,
    webfile_dc_id: number,
    suggested_lang_code?: string,
    lang_pack_version?: number,
    base_lang_pack_version?: number,
}

export type nearestDc = {
    country: string,
    this_dc: number,
    nearest_dc: number,
}

export type help__appUpdate = {
    can_not_skip?: boolean,
    id: number,
    version: string,
    text: string,
    entities: Array<MessageEntity>,
    document?: Document,
    url?: string,
}

export type help__noAppUpdate = {
}

export type help__inviteText = {
    message: string,
}

export type encryptedChatEmpty = {
    id: number,
}

export type encryptedChatWaiting = {
    id: number,
    access_hash: string | number[] | Uint8Array,
    date: number,
    admin_id: number,
    participant_id: number,
}

export type encryptedChatRequested = {
    id: number,
    access_hash: string | number[] | Uint8Array,
    date: number,
    admin_id: number,
    participant_id: number,
    g_a: Uint8Array | number[],
}

export type encryptedChat = {
    id: number,
    access_hash: string | number[] | Uint8Array,
    date: number,
    admin_id: number,
    participant_id: number,
    g_a_or_b: Uint8Array | number[],
    key_fingerprint: string | number[] | Uint8Array,
}

export type encryptedChatDiscarded = {
    id: number,
}

export type inputEncryptedChat = {
    chat_id: number,
    access_hash: string | number[] | Uint8Array,
}

export type encryptedFileEmpty = {
}

export type encryptedFile = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    size: number,
    dc_id: number,
    key_fingerprint: number,
}

export type inputEncryptedFileEmpty = {
}

export type inputEncryptedFileUploaded = {
    id: string | number[] | Uint8Array,
    parts: number,
    md5_checksum: string,
    key_fingerprint: number,
}

export type inputEncryptedFile = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
}

export type inputEncryptedFileBigUploaded = {
    id: string | number[] | Uint8Array,
    parts: number,
    key_fingerprint: number,
}

export type encryptedMessage = {
    random_id: string | number[] | Uint8Array,
    chat_id: number,
    date: number,
    bytes: Uint8Array | number[],
    file: EncryptedFile,
}

export type encryptedMessageService = {
    random_id: string | number[] | Uint8Array,
    chat_id: number,
    date: number,
    bytes: Uint8Array | number[],
}

export type messages__dhConfigNotModified = {
    random: Uint8Array | number[],
}

export type messages__dhConfig = {
    g: number,
    p: Uint8Array | number[],
    version: number,
    random: Uint8Array | number[],
}

export type messages__sentEncryptedMessage = {
    date: number,
}

export type messages__sentEncryptedFile = {
    date: number,
    file: EncryptedFile,
}

export type inputDocumentEmpty = {
}

export type inputDocument = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    file_reference: Uint8Array | number[],
}

export type documentEmpty = {
    id: string | number[] | Uint8Array,
}

export type document = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    file_reference: Uint8Array | number[],
    date: number,
    mime_type: string,
    size: number,
    thumbs?: Array<PhotoSize>,
    dc_id: number,
    attributes: Array<DocumentAttribute>,
}

export type help__support = {
    phone_number: string,
    user: User,
}

export type notifyPeer = {
    peer: Peer,
}

export type notifyUsers = {
}

export type notifyChats = {
}

export type notifyBroadcasts = {
}

export type sendMessageTypingAction = {
}

export type sendMessageCancelAction = {
}

export type sendMessageRecordVideoAction = {
}

export type sendMessageUploadVideoAction = {
    progress: number,
}

export type sendMessageRecordAudioAction = {
}

export type sendMessageUploadAudioAction = {
    progress: number,
}

export type sendMessageUploadPhotoAction = {
    progress: number,
}

export type sendMessageUploadDocumentAction = {
    progress: number,
}

export type sendMessageGeoLocationAction = {
}

export type sendMessageChooseContactAction = {
}

export type sendMessageGamePlayAction = {
}

export type sendMessageRecordRoundAction = {
}

export type sendMessageUploadRoundAction = {
    progress: number,
}

export type contacts__found = {
    my_results: Array<Peer>,
    results: Array<Peer>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type inputPrivacyKeyStatusTimestamp = {
}

export type inputPrivacyKeyChatInvite = {
}

export type inputPrivacyKeyPhoneCall = {
}

export type inputPrivacyKeyPhoneP2P = {
}

export type inputPrivacyKeyForwards = {
}

export type inputPrivacyKeyProfilePhoto = {
}

export type inputPrivacyKeyPhoneNumber = {
}

export type inputPrivacyKeyAddedByPhone = {
}

export type privacyKeyStatusTimestamp = {
}

export type privacyKeyChatInvite = {
}

export type privacyKeyPhoneCall = {
}

export type privacyKeyPhoneP2P = {
}

export type privacyKeyForwards = {
}

export type privacyKeyProfilePhoto = {
}

export type privacyKeyPhoneNumber = {
}

export type privacyKeyAddedByPhone = {
}

export type inputPrivacyValueAllowContacts = {
}

export type inputPrivacyValueAllowAll = {
}

export type inputPrivacyValueAllowUsers = {
    users: Array<InputUser>,
}

export type inputPrivacyValueDisallowContacts = {
}

export type inputPrivacyValueDisallowAll = {
}

export type inputPrivacyValueDisallowUsers = {
    users: Array<InputUser>,
}

export type inputPrivacyValueAllowChatParticipants = {
    chats: Array<number>,
}

export type inputPrivacyValueDisallowChatParticipants = {
    chats: Array<number>,
}

export type privacyValueAllowContacts = {
}

export type privacyValueAllowAll = {
}

export type privacyValueAllowUsers = {
    users: Array<number>,
}

export type privacyValueDisallowContacts = {
}

export type privacyValueDisallowAll = {
}

export type privacyValueDisallowUsers = {
    users: Array<number>,
}

export type privacyValueAllowChatParticipants = {
    chats: Array<number>,
}

export type privacyValueDisallowChatParticipants = {
    chats: Array<number>,
}

export type account__privacyRules = {
    rules: Array<PrivacyRule>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type accountDaysTTL = {
    days: number,
}

export type documentAttributeImageSize = {
    w: number,
    h: number,
}

export type documentAttributeAnimated = {
}

export type documentAttributeSticker = {
    mask?: boolean,
    alt: string,
    stickerset: InputStickerSet,
    mask_coords?: MaskCoords,
}

export type documentAttributeVideo = {
    round_message?: boolean,
    supports_streaming?: boolean,
    duration: number,
    w: number,
    h: number,
}

export type documentAttributeAudio = {
    voice?: boolean,
    duration: number,
    title?: string,
    performer?: string,
    waveform?: Uint8Array | number[],
}

export type documentAttributeFilename = {
    file_name: string,
}

export type documentAttributeHasStickers = {
}

export type messages__stickersNotModified = {
}

export type messages__stickers = {
    hash: number,
    stickers: Array<Document>,
}

export type stickerPack = {
    emoticon: string,
    documents: Array<string | number[] | Uint8Array>,
}

export type messages__allStickersNotModified = {
}

export type messages__allStickers = {
    hash: number,
    sets: Array<StickerSet>,
}

export type messages__affectedMessages = {
    pts: number,
    pts_count: number,
}

export type webPageEmpty = {
    id: string | number[] | Uint8Array,
}

export type webPagePending = {
    id: string | number[] | Uint8Array,
    date: number,
}

export type webPage = {
    id: string | number[] | Uint8Array,
    url: string,
    display_url: string,
    hash: number,
    type?: string,
    site_name?: string,
    title?: string,
    description?: string,
    photo?: Photo,
    embed_url?: string,
    embed_type?: string,
    embed_width?: number,
    embed_height?: number,
    duration?: number,
    author?: string,
    document?: Document,
    cached_page?: Page,
    attributes?: Array<WebPageAttribute>,
}

export type webPageNotModified = {
}

export type authorization = {
    current?: boolean,
    official_app?: boolean,
    password_pending?: boolean,
    hash: string | number[] | Uint8Array,
    device_model: string,
    platform: string,
    system_version: string,
    api_id: number,
    app_name: string,
    app_version: string,
    date_created: number,
    date_active: number,
    ip: string,
    country: string,
    region: string,
}

export type account__authorizations = {
    authorizations: Array<Authorization>,
}

export type account__password = {
    has_recovery?: boolean,
    has_secure_values?: boolean,
    has_password?: boolean,
    current_algo?: PasswordKdfAlgo,
    srp_B?: Uint8Array | number[],
    srp_id?: string | number[] | Uint8Array,
    hint?: string,
    email_unconfirmed_pattern?: string,
    new_algo: PasswordKdfAlgo,
    new_secure_algo: SecurePasswordKdfAlgo,
    secure_random: Uint8Array | number[],
}

export type account__passwordSettings = {
    email?: string,
    secure_settings?: SecureSecretSettings,
}

export type account__passwordInputSettings = {
    new_algo?: PasswordKdfAlgo,
    new_password_hash?: Uint8Array | number[],
    hint?: string,
    email?: string,
    new_secure_settings?: SecureSecretSettings,
}

export type auth__passwordRecovery = {
    email_pattern: string,
}

export type receivedNotifyMessage = {
    id: number,
    flags: number,
}

export type chatInviteEmpty = {
}

export type chatInviteExported = {
    link: string,
}

export type chatInviteAlready = {
    chat: Chat,
}

export type chatInvite = {
    channel?: boolean,
    broadcast?: boolean,
    public?: boolean,
    megagroup?: boolean,
    title: string,
    photo: Photo,
    participants_count: number,
    participants?: Array<User>,
}

export type inputStickerSetEmpty = {
}

export type inputStickerSetID = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
}

export type inputStickerSetShortName = {
    short_name: string,
}

export type inputStickerSetAnimatedEmoji = {
}

export type stickerSet = {
    archived?: boolean,
    official?: boolean,
    masks?: boolean,
    animated?: boolean,
    installed_date?: number,
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    title: string,
    short_name: string,
    thumb?: PhotoSize,
    thumb_dc_id?: number,
    count: number,
    hash: number,
}

export type messages__stickerSet = {
    set: StickerSet,
    packs: Array<StickerPack>,
    documents: Array<Document>,
}

export type botCommand = {
    command: string,
    description: string,
}

export type botInfo = {
    user_id: number,
    description: string,
    commands: Array<BotCommand>,
}

export type keyboardButton = {
    text: string,
}

export type keyboardButtonUrl = {
    text: string,
    url: string,
}

export type keyboardButtonCallback = {
    text: string,
    data: Uint8Array | number[],
}

export type keyboardButtonRequestPhone = {
    text: string,
}

export type keyboardButtonRequestGeoLocation = {
    text: string,
}

export type keyboardButtonSwitchInline = {
    same_peer?: boolean,
    text: string,
    query: string,
}

export type keyboardButtonGame = {
    text: string,
}

export type keyboardButtonBuy = {
    text: string,
}

export type keyboardButtonUrlAuth = {
    text: string,
    fwd_text?: string,
    url: string,
    button_id: number,
}

export type inputKeyboardButtonUrlAuth = {
    request_write_access?: boolean,
    text: string,
    fwd_text?: string,
    url: string,
    bot: InputUser,
}

export type keyboardButtonRequestPoll = {
    quiz?: Bool,
    text: string,
}

export type keyboardButtonRow = {
    buttons: Array<KeyboardButton>,
}

export type replyKeyboardHide = {
    selective?: boolean,
}

export type replyKeyboardForceReply = {
    single_use?: boolean,
    selective?: boolean,
}

export type replyKeyboardMarkup = {
    resize?: boolean,
    single_use?: boolean,
    selective?: boolean,
    rows: Array<KeyboardButtonRow>,
}

export type replyInlineMarkup = {
    rows: Array<KeyboardButtonRow>,
}

export type messageEntityUnknown = {
    offset: number,
    length: number,
}

export type messageEntityMention = {
    offset: number,
    length: number,
}

export type messageEntityHashtag = {
    offset: number,
    length: number,
}

export type messageEntityBotCommand = {
    offset: number,
    length: number,
}

export type messageEntityUrl = {
    offset: number,
    length: number,
}

export type messageEntityEmail = {
    offset: number,
    length: number,
}

export type messageEntityBold = {
    offset: number,
    length: number,
}

export type messageEntityItalic = {
    offset: number,
    length: number,
}

export type messageEntityCode = {
    offset: number,
    length: number,
}

export type messageEntityPre = {
    offset: number,
    length: number,
    language: string,
}

export type messageEntityTextUrl = {
    offset: number,
    length: number,
    url: string,
}

export type messageEntityMentionName = {
    offset: number,
    length: number,
    user_id: number,
}

export type inputMessageEntityMentionName = {
    offset: number,
    length: number,
    user_id: InputUser,
}

export type messageEntityPhone = {
    offset: number,
    length: number,
}

export type messageEntityCashtag = {
    offset: number,
    length: number,
}

export type messageEntityUnderline = {
    offset: number,
    length: number,
}

export type messageEntityStrike = {
    offset: number,
    length: number,
}

export type messageEntityBlockquote = {
    offset: number,
    length: number,
}

export type inputChannelEmpty = {
}

export type inputChannel = {
    channel_id: number,
    access_hash: string | number[] | Uint8Array,
}

export type inputChannelFromMessage = {
    peer: InputPeer,
    msg_id: number,
    channel_id: number,
}

export type contacts__resolvedPeer = {
    peer: Peer,
    chats: Array<Chat>,
    users: Array<User>,
}

export type messageRange = {
    min_id: number,
    max_id: number,
}

export type updates__channelDifferenceEmpty = {
    final?: boolean,
    pts: number,
    timeout?: number,
}

export type updates__channelDifferenceTooLong = {
    final?: boolean,
    timeout?: number,
    dialog: Dialog,
    messages: Array<Message>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type updates__channelDifference = {
    final?: boolean,
    pts: number,
    timeout?: number,
    new_messages: Array<Message>,
    other_updates: Array<Update>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type channelMessagesFilterEmpty = {
}

export type channelMessagesFilter = {
    exclude_new_messages?: boolean,
    ranges: Array<MessageRange>,
}

export type channelParticipant = {
    user_id: number,
    date: number,
}

export type channelParticipantSelf = {
    user_id: number,
    inviter_id: number,
    date: number,
}

export type channelParticipantCreator = {
    user_id: number,
    rank?: string,
}

export type channelParticipantAdmin = {
    can_edit?: boolean,
    self?: boolean,
    user_id: number,
    inviter_id?: number,
    promoted_by: number,
    date: number,
    admin_rights: ChatAdminRights,
    rank?: string,
}

export type channelParticipantBanned = {
    left?: boolean,
    user_id: number,
    kicked_by: number,
    date: number,
    banned_rights: ChatBannedRights,
}

export type channelParticipantsRecent = {
}

export type channelParticipantsAdmins = {
}

export type channelParticipantsKicked = {
    q: string,
}

export type channelParticipantsBots = {
}

export type channelParticipantsBanned = {
    q: string,
}

export type channelParticipantsSearch = {
    q: string,
}

export type channelParticipantsContacts = {
    q: string,
}

export type channels__channelParticipants = {
    count: number,
    participants: Array<ChannelParticipant>,
    users: Array<User>,
}

export type channels__channelParticipantsNotModified = {
}

export type channels__channelParticipant = {
    participant: ChannelParticipant,
    users: Array<User>,
}

export type help__termsOfService = {
    popup?: boolean,
    id: DataJSON,
    text: string,
    entities: Array<MessageEntity>,
    min_age_confirm?: number,
}

export type foundGif = {
    url: string,
    thumb_url: string,
    content_url: string,
    content_type: string,
    w: number,
    h: number,
}

export type foundGifCached = {
    url: string,
    photo: Photo,
    document: Document,
}

export type messages__foundGifs = {
    next_offset: number,
    results: Array<FoundGif>,
}

export type messages__savedGifsNotModified = {
}

export type messages__savedGifs = {
    hash: number,
    gifs: Array<Document>,
}

export type inputBotInlineMessageMediaAuto = {
    message: string,
    entities?: Array<MessageEntity>,
    reply_markup?: ReplyMarkup,
}

export type inputBotInlineMessageText = {
    no_webpage?: boolean,
    message: string,
    entities?: Array<MessageEntity>,
    reply_markup?: ReplyMarkup,
}

export type inputBotInlineMessageMediaGeo = {
    geo_point: InputGeoPoint,
    period: number,
    reply_markup?: ReplyMarkup,
}

export type inputBotInlineMessageMediaVenue = {
    geo_point: InputGeoPoint,
    title: string,
    address: string,
    provider: string,
    venue_id: string,
    venue_type: string,
    reply_markup?: ReplyMarkup,
}

export type inputBotInlineMessageMediaContact = {
    phone_number: string,
    first_name: string,
    last_name: string,
    vcard: string,
    reply_markup?: ReplyMarkup,
}

export type inputBotInlineMessageGame = {
    reply_markup?: ReplyMarkup,
}

export type inputBotInlineResult = {
    id: string,
    type: string,
    title?: string,
    description?: string,
    url?: string,
    thumb?: InputWebDocument,
    content?: InputWebDocument,
    send_message: InputBotInlineMessage,
}

export type inputBotInlineResultPhoto = {
    id: string,
    type: string,
    photo: InputPhoto,
    send_message: InputBotInlineMessage,
}

export type inputBotInlineResultDocument = {
    id: string,
    type: string,
    title?: string,
    description?: string,
    document: InputDocument,
    send_message: InputBotInlineMessage,
}

export type inputBotInlineResultGame = {
    id: string,
    short_name: string,
    send_message: InputBotInlineMessage,
}

export type botInlineMessageMediaAuto = {
    message: string,
    entities?: Array<MessageEntity>,
    reply_markup?: ReplyMarkup,
}

export type botInlineMessageText = {
    no_webpage?: boolean,
    message: string,
    entities?: Array<MessageEntity>,
    reply_markup?: ReplyMarkup,
}

export type botInlineMessageMediaGeo = {
    geo: GeoPoint,
    period: number,
    reply_markup?: ReplyMarkup,
}

export type botInlineMessageMediaVenue = {
    geo: GeoPoint,
    title: string,
    address: string,
    provider: string,
    venue_id: string,
    venue_type: string,
    reply_markup?: ReplyMarkup,
}

export type botInlineMessageMediaContact = {
    phone_number: string,
    first_name: string,
    last_name: string,
    vcard: string,
    reply_markup?: ReplyMarkup,
}

export type botInlineResult = {
    id: string,
    type: string,
    title?: string,
    description?: string,
    url?: string,
    thumb?: WebDocument,
    content?: WebDocument,
    send_message: BotInlineMessage,
}

export type botInlineMediaResult = {
    id: string,
    type: string,
    photo?: Photo,
    document?: Document,
    title?: string,
    description?: string,
    send_message: BotInlineMessage,
}

export type messages__botResults = {
    gallery?: boolean,
    query_id: string | number[] | Uint8Array,
    next_offset?: string,
    switch_pm?: InlineBotSwitchPM,
    results: Array<BotInlineResult>,
    cache_time: number,
    users: Array<User>,
}

export type exportedMessageLink = {
    link: string,
    html: string,
}

export type messageFwdHeader = {
    from_id?: number,
    from_name?: string,
    date: number,
    channel_id?: number,
    channel_post?: number,
    post_author?: string,
    saved_from_peer?: Peer,
    saved_from_msg_id?: number,
}

export type auth__codeTypeSms = {
}

export type auth__codeTypeCall = {
}

export type auth__codeTypeFlashCall = {
}

export type auth__sentCodeTypeApp = {
    length: number,
}

export type auth__sentCodeTypeSms = {
    length: number,
}

export type auth__sentCodeTypeCall = {
    length: number,
}

export type auth__sentCodeTypeFlashCall = {
    pattern: string,
}

export type messages__botCallbackAnswer = {
    alert?: boolean,
    has_url?: boolean,
    native_ui?: boolean,
    message?: string,
    url?: string,
    cache_time: number,
}

export type messages__messageEditData = {
    caption?: boolean,
}

export type inputBotInlineMessageID = {
    dc_id: number,
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
}

export type inlineBotSwitchPM = {
    text: string,
    start_param: string,
}

export type messages__peerDialogs = {
    dialogs: Array<Dialog>,
    messages: Array<Message>,
    chats: Array<Chat>,
    users: Array<User>,
    state: updates__State,
}

export type topPeer = {
    peer: Peer,
    rating: number,
}

export type topPeerCategoryBotsPM = {
}

export type topPeerCategoryBotsInline = {
}

export type topPeerCategoryCorrespondents = {
}

export type topPeerCategoryGroups = {
}

export type topPeerCategoryChannels = {
}

export type topPeerCategoryPhoneCalls = {
}

export type topPeerCategoryForwardUsers = {
}

export type topPeerCategoryForwardChats = {
}

export type topPeerCategoryPeers = {
    category: TopPeerCategory,
    count: number,
    peers: Array<TopPeer>,
}

export type contacts__topPeersNotModified = {
}

export type contacts__topPeers = {
    categories: Array<TopPeerCategoryPeers>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type contacts__topPeersDisabled = {
}

export type draftMessageEmpty = {
    date?: number,
}

export type draftMessage = {
    no_webpage?: boolean,
    reply_to_msg_id?: number,
    message: string,
    entities?: Array<MessageEntity>,
    date: number,
}

export type messages__featuredStickersNotModified = {
}

export type messages__featuredStickers = {
    hash: number,
    sets: Array<StickerSetCovered>,
    unread: Array<string | number[] | Uint8Array>,
}

export type messages__recentStickersNotModified = {
}

export type messages__recentStickers = {
    hash: number,
    packs: Array<StickerPack>,
    stickers: Array<Document>,
    dates: Array<number>,
}

export type messages__archivedStickers = {
    count: number,
    sets: Array<StickerSetCovered>,
}

export type messages__stickerSetInstallResultSuccess = {
}

export type messages__stickerSetInstallResultArchive = {
    sets: Array<StickerSetCovered>,
}

export type stickerSetCovered = {
    set: StickerSet,
    cover: Document,
}

export type stickerSetMultiCovered = {
    set: StickerSet,
    covers: Array<Document>,
}

export type maskCoords = {
    n: number,
    x: number,
    y: number,
    zoom: number,
}

export type inputStickeredMediaPhoto = {
    id: InputPhoto,
}

export type inputStickeredMediaDocument = {
    id: InputDocument,
}

export type game = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    short_name: string,
    title: string,
    description: string,
    photo: Photo,
    document?: Document,
}

export type inputGameID = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
}

export type inputGameShortName = {
    bot_id: InputUser,
    short_name: string,
}

export type highScore = {
    pos: number,
    user_id: number,
    score: number,
}

export type messages__highScores = {
    scores: Array<HighScore>,
    users: Array<User>,
}

export type textEmpty = {
}

export type textPlain = {
    text: string,
}

export type textBold = {
    text: RichText,
}

export type textItalic = {
    text: RichText,
}

export type textUnderline = {
    text: RichText,
}

export type textStrike = {
    text: RichText,
}

export type textFixed = {
    text: RichText,
}

export type textUrl = {
    text: RichText,
    url: string,
    webpage_id: string | number[] | Uint8Array,
}

export type textEmail = {
    text: RichText,
    email: string,
}

export type textConcat = {
    texts: Array<RichText>,
}

export type textSubscript = {
    text: RichText,
}

export type textSuperscript = {
    text: RichText,
}

export type textMarked = {
    text: RichText,
}

export type textPhone = {
    text: RichText,
    phone: string,
}

export type textImage = {
    document_id: string | number[] | Uint8Array,
    w: number,
    h: number,
}

export type textAnchor = {
    text: RichText,
    name: string,
}

export type pageBlockUnsupported = {
}

export type pageBlockTitle = {
    text: RichText,
}

export type pageBlockSubtitle = {
    text: RichText,
}

export type pageBlockAuthorDate = {
    author: RichText,
    published_date: number,
}

export type pageBlockHeader = {
    text: RichText,
}

export type pageBlockSubheader = {
    text: RichText,
}

export type pageBlockParagraph = {
    text: RichText,
}

export type pageBlockPreformatted = {
    text: RichText,
    language: string,
}

export type pageBlockFooter = {
    text: RichText,
}

export type pageBlockDivider = {
}

export type pageBlockAnchor = {
    name: string,
}

export type pageBlockList = {
    items: Array<PageListItem>,
}

export type pageBlockBlockquote = {
    text: RichText,
    caption: RichText,
}

export type pageBlockPullquote = {
    text: RichText,
    caption: RichText,
}

export type pageBlockPhoto = {
    photo_id: string | number[] | Uint8Array,
    caption: PageCaption,
    url?: string,
    webpage_id?: string | number[] | Uint8Array,
}

export type pageBlockVideo = {
    autoplay?: boolean,
    loop?: boolean,
    video_id: string | number[] | Uint8Array,
    caption: PageCaption,
}

export type pageBlockCover = {
    cover: PageBlock,
}

export type pageBlockEmbed = {
    full_width?: boolean,
    allow_scrolling?: boolean,
    url?: string,
    html?: string,
    poster_photo_id?: string | number[] | Uint8Array,
    w?: number,
    h?: number,
    caption: PageCaption,
}

export type pageBlockEmbedPost = {
    url: string,
    webpage_id: string | number[] | Uint8Array,
    author_photo_id: string | number[] | Uint8Array,
    author: string,
    date: number,
    blocks: Array<PageBlock>,
    caption: PageCaption,
}

export type pageBlockCollage = {
    items: Array<PageBlock>,
    caption: PageCaption,
}

export type pageBlockSlideshow = {
    items: Array<PageBlock>,
    caption: PageCaption,
}

export type pageBlockChannel = {
    channel: Chat,
}

export type pageBlockAudio = {
    audio_id: string | number[] | Uint8Array,
    caption: PageCaption,
}

export type pageBlockKicker = {
    text: RichText,
}

export type pageBlockTable = {
    bordered?: boolean,
    striped?: boolean,
    title: RichText,
    rows: Array<PageTableRow>,
}

export type pageBlockOrderedList = {
    items: Array<PageListOrderedItem>,
}

export type pageBlockDetails = {
    open?: boolean,
    blocks: Array<PageBlock>,
    title: RichText,
}

export type pageBlockRelatedArticles = {
    title: RichText,
    articles: Array<PageRelatedArticle>,
}

export type pageBlockMap = {
    geo: GeoPoint,
    zoom: number,
    w: number,
    h: number,
    caption: PageCaption,
}

export type phoneCallDiscardReasonMissed = {
}

export type phoneCallDiscardReasonDisconnect = {
}

export type phoneCallDiscardReasonHangup = {
}

export type phoneCallDiscardReasonBusy = {
}

export type dataJSON = {
    data: string,
}

export type labeledPrice = {
    label: string,
    amount: string | number[] | Uint8Array,
}

export type invoice = {
    test?: boolean,
    name_requested?: boolean,
    phone_requested?: boolean,
    email_requested?: boolean,
    shipping_address_requested?: boolean,
    flexible?: boolean,
    phone_to_provider?: boolean,
    email_to_provider?: boolean,
    currency: string,
    prices: Array<LabeledPrice>,
}

export type paymentCharge = {
    id: string,
    provider_charge_id: string,
}

export type postAddress = {
    street_line1: string,
    street_line2: string,
    city: string,
    state: string,
    country_iso2: string,
    post_code: string,
}

export type paymentRequestedInfo = {
    name?: string,
    phone?: string,
    email?: string,
    shipping_address?: PostAddress,
}

export type paymentSavedCredentialsCard = {
    id: string,
    title: string,
}

export type webDocument = {
    url: string,
    access_hash: string | number[] | Uint8Array,
    size: number,
    mime_type: string,
    attributes: Array<DocumentAttribute>,
}

export type webDocumentNoProxy = {
    url: string,
    size: number,
    mime_type: string,
    attributes: Array<DocumentAttribute>,
}

export type inputWebDocument = {
    url: string,
    size: number,
    mime_type: string,
    attributes: Array<DocumentAttribute>,
}

export type inputWebFileLocation = {
    url: string,
    access_hash: string | number[] | Uint8Array,
}

export type inputWebFileGeoPointLocation = {
    geo_point: InputGeoPoint,
    access_hash: string | number[] | Uint8Array,
    w: number,
    h: number,
    zoom: number,
    scale: number,
}

export type upload__webFile = {
    size: number,
    mime_type: string,
    file_type: storage__FileType,
    mtime: number,
    bytes: Uint8Array | number[],
}

export type payments__paymentForm = {
    can_save_credentials?: boolean,
    password_missing?: boolean,
    bot_id: number,
    invoice: Invoice,
    provider_id: number,
    url: string,
    native_provider?: string,
    native_params?: DataJSON,
    saved_info?: PaymentRequestedInfo,
    saved_credentials?: PaymentSavedCredentials,
    users: Array<User>,
}

export type payments__validatedRequestedInfo = {
    id?: string,
    shipping_options?: Array<ShippingOption>,
}

export type payments__paymentResult = {
    updates: Updates,
}

export type payments__paymentVerificationNeeded = {
    url: string,
}

export type payments__paymentReceipt = {
    date: number,
    bot_id: number,
    invoice: Invoice,
    provider_id: number,
    info?: PaymentRequestedInfo,
    shipping?: ShippingOption,
    currency: string,
    total_amount: string | number[] | Uint8Array,
    credentials_title: string,
    users: Array<User>,
}

export type payments__savedInfo = {
    has_saved_credentials?: boolean,
    saved_info?: PaymentRequestedInfo,
}

export type inputPaymentCredentialsSaved = {
    id: string,
    tmp_password: Uint8Array | number[],
}

export type inputPaymentCredentials = {
    save?: boolean,
    data: DataJSON,
}

export type inputPaymentCredentialsApplePay = {
    payment_data: DataJSON,
}

export type inputPaymentCredentialsAndroidPay = {
    payment_token: DataJSON,
    google_transaction_id: string,
}

export type account__tmpPassword = {
    tmp_password: Uint8Array | number[],
    valid_until: number,
}

export type shippingOption = {
    id: string,
    title: string,
    prices: Array<LabeledPrice>,
}

export type inputStickerSetItem = {
    document: InputDocument,
    emoji: string,
    mask_coords?: MaskCoords,
}

export type inputPhoneCall = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
}

export type phoneCallEmpty = {
    id: string | number[] | Uint8Array,
}

export type phoneCallWaiting = {
    video?: boolean,
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    date: number,
    admin_id: number,
    participant_id: number,
    protocol: PhoneCallProtocol,
    receive_date?: number,
}

export type phoneCallRequested = {
    video?: boolean,
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    date: number,
    admin_id: number,
    participant_id: number,
    g_a_hash: Uint8Array | number[],
    protocol: PhoneCallProtocol,
}

export type phoneCallAccepted = {
    video?: boolean,
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    date: number,
    admin_id: number,
    participant_id: number,
    g_b: Uint8Array | number[],
    protocol: PhoneCallProtocol,
}

export type phoneCall = {
    p2p_allowed?: boolean,
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    date: number,
    admin_id: number,
    participant_id: number,
    g_a_or_b: Uint8Array | number[],
    key_fingerprint: string | number[] | Uint8Array,
    protocol: PhoneCallProtocol,
    connections: Array<PhoneConnection>,
    start_date: number,
}

export type phoneCallDiscarded = {
    need_rating?: boolean,
    need_debug?: boolean,
    video?: boolean,
    id: string | number[] | Uint8Array,
    reason?: PhoneCallDiscardReason,
    duration?: number,
}

export type phoneConnection = {
    id: string | number[] | Uint8Array,
    ip: string,
    ipv6: string,
    port: number,
    peer_tag: Uint8Array | number[],
}

export type phoneCallProtocol = {
    udp_p2p?: boolean,
    udp_reflector?: boolean,
    min_layer: number,
    max_layer: number,
}

export type phone__phoneCall = {
    phone_call: PhoneCall,
    users: Array<User>,
}

export type upload__cdnFileReuploadNeeded = {
    request_token: Uint8Array | number[],
}

export type upload__cdnFile = {
    bytes: Uint8Array | number[],
}

export type cdnPublicKey = {
    dc_id: number,
    public_key: string,
}

export type cdnConfig = {
    public_keys: Array<CdnPublicKey>,
}

export type langPackString = {
    key: string,
    value: string,
}

export type langPackStringPluralized = {
    key: string,
    zero_value?: string,
    one_value?: string,
    two_value?: string,
    few_value?: string,
    many_value?: string,
    other_value: string,
}

export type langPackStringDeleted = {
    key: string,
}

export type langPackDifference = {
    lang_code: string,
    from_version: number,
    version: number,
    strings: Array<LangPackString>,
}

export type langPackLanguage = {
    official?: boolean,
    rtl?: boolean,
    beta?: boolean,
    name: string,
    native_name: string,
    lang_code: string,
    base_lang_code?: string,
    plural_code: string,
    strings_count: number,
    translated_count: number,
    translations_url: string,
}

export type channelAdminLogEventActionChangeTitle = {
    prev_value: string,
    new_value: string,
}

export type channelAdminLogEventActionChangeAbout = {
    prev_value: string,
    new_value: string,
}

export type channelAdminLogEventActionChangeUsername = {
    prev_value: string,
    new_value: string,
}

export type channelAdminLogEventActionChangePhoto = {
    prev_photo: Photo,
    new_photo: Photo,
}

export type channelAdminLogEventActionToggleInvites = {
    new_value: Bool,
}

export type channelAdminLogEventActionToggleSignatures = {
    new_value: Bool,
}

export type channelAdminLogEventActionUpdatePinned = {
    message: Message,
}

export type channelAdminLogEventActionEditMessage = {
    prev_message: Message,
    new_message: Message,
}

export type channelAdminLogEventActionDeleteMessage = {
    message: Message,
}

export type channelAdminLogEventActionParticipantJoin = {
}

export type channelAdminLogEventActionParticipantLeave = {
}

export type channelAdminLogEventActionParticipantInvite = {
    participant: ChannelParticipant,
}

export type channelAdminLogEventActionParticipantToggleBan = {
    prev_participant: ChannelParticipant,
    new_participant: ChannelParticipant,
}

export type channelAdminLogEventActionParticipantToggleAdmin = {
    prev_participant: ChannelParticipant,
    new_participant: ChannelParticipant,
}

export type channelAdminLogEventActionChangeStickerSet = {
    prev_stickerset: InputStickerSet,
    new_stickerset: InputStickerSet,
}

export type channelAdminLogEventActionTogglePreHistoryHidden = {
    new_value: Bool,
}

export type channelAdminLogEventActionDefaultBannedRights = {
    prev_banned_rights: ChatBannedRights,
    new_banned_rights: ChatBannedRights,
}

export type channelAdminLogEventActionStopPoll = {
    message: Message,
}

export type channelAdminLogEventActionChangeLinkedChat = {
    prev_value: number,
    new_value: number,
}

export type channelAdminLogEventActionChangeLocation = {
    prev_value: ChannelLocation,
    new_value: ChannelLocation,
}

export type channelAdminLogEventActionToggleSlowMode = {
    prev_value: number,
    new_value: number,
}

export type channelAdminLogEvent = {
    id: string | number[] | Uint8Array,
    date: number,
    user_id: number,
    action: ChannelAdminLogEventAction,
}

export type channels__adminLogResults = {
    events: Array<ChannelAdminLogEvent>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type channelAdminLogEventsFilter = {
    join?: boolean,
    leave?: boolean,
    invite?: boolean,
    ban?: boolean,
    unban?: boolean,
    kick?: boolean,
    unkick?: boolean,
    promote?: boolean,
    demote?: boolean,
    info?: boolean,
    settings?: boolean,
    pinned?: boolean,
    edit?: boolean,
    delete?: boolean,
}

export type popularContact = {
    client_id: string | number[] | Uint8Array,
    importers: number,
}

export type messages__favedStickersNotModified = {
}

export type messages__favedStickers = {
    hash: number,
    packs: Array<StickerPack>,
    stickers: Array<Document>,
}

export type recentMeUrlUnknown = {
    url: string,
}

export type recentMeUrlUser = {
    url: string,
    user_id: number,
}

export type recentMeUrlChat = {
    url: string,
    chat_id: number,
}

export type recentMeUrlChatInvite = {
    url: string,
    chat_invite: ChatInvite,
}

export type recentMeUrlStickerSet = {
    url: string,
    set: StickerSetCovered,
}

export type help__recentMeUrls = {
    urls: Array<RecentMeUrl>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type inputSingleMedia = {
    media: InputMedia,
    random_id: string | number[] | Uint8Array,
    message: string,
    entities?: Array<MessageEntity>,
}

export type webAuthorization = {
    hash: string | number[] | Uint8Array,
    bot_id: number,
    domain: string,
    browser: string,
    platform: string,
    date_created: number,
    date_active: number,
    ip: string,
    region: string,
}

export type account__webAuthorizations = {
    authorizations: Array<WebAuthorization>,
    users: Array<User>,
}

export type inputMessageID = {
    id: number,
}

export type inputMessageReplyTo = {
    id: number,
}

export type inputMessagePinned = {
}

export type inputDialogPeer = {
    peer: InputPeer,
}

export type inputDialogPeerFolder = {
    folder_id: number,
}

export type dialogPeer = {
    peer: Peer,
}

export type dialogPeerFolder = {
    folder_id: number,
}

export type messages__foundStickerSetsNotModified = {
}

export type messages__foundStickerSets = {
    hash: number,
    sets: Array<StickerSetCovered>,
}

export type fileHash = {
    offset: number,
    limit: number,
    hash: Uint8Array | number[],
}

export type inputClientProxy = {
    address: string,
    port: number,
}

export type help__proxyDataEmpty = {
    expires: number,
}

export type help__proxyDataPromo = {
    expires: number,
    peer: Peer,
    chats: Array<Chat>,
    users: Array<User>,
}

export type help__termsOfServiceUpdateEmpty = {
    expires: number,
}

export type help__termsOfServiceUpdate = {
    expires: number,
    terms_of_service: help__TermsOfService,
}

export type inputSecureFileUploaded = {
    id: string | number[] | Uint8Array,
    parts: number,
    md5_checksum: string,
    file_hash: Uint8Array | number[],
    secret: Uint8Array | number[],
}

export type inputSecureFile = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
}

export type secureFileEmpty = {
}

export type secureFile = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    size: number,
    dc_id: number,
    date: number,
    file_hash: Uint8Array | number[],
    secret: Uint8Array | number[],
}

export type secureData = {
    data: Uint8Array | number[],
    data_hash: Uint8Array | number[],
    secret: Uint8Array | number[],
}

export type securePlainPhone = {
    phone: string,
}

export type securePlainEmail = {
    email: string,
}

export type secureValueTypePersonalDetails = {
}

export type secureValueTypePassport = {
}

export type secureValueTypeDriverLicense = {
}

export type secureValueTypeIdentityCard = {
}

export type secureValueTypeInternalPassport = {
}

export type secureValueTypeAddress = {
}

export type secureValueTypeUtilityBill = {
}

export type secureValueTypeBankStatement = {
}

export type secureValueTypeRentalAgreement = {
}

export type secureValueTypePassportRegistration = {
}

export type secureValueTypeTemporaryRegistration = {
}

export type secureValueTypePhone = {
}

export type secureValueTypeEmail = {
}

export type secureValue = {
    type: SecureValueType,
    data?: SecureData,
    front_side?: SecureFile,
    reverse_side?: SecureFile,
    selfie?: SecureFile,
    translation?: Array<SecureFile>,
    files?: Array<SecureFile>,
    plain_data?: SecurePlainData,
    hash: Uint8Array | number[],
}

export type inputSecureValue = {
    type: SecureValueType,
    data?: SecureData,
    front_side?: InputSecureFile,
    reverse_side?: InputSecureFile,
    selfie?: InputSecureFile,
    translation?: Array<InputSecureFile>,
    files?: Array<InputSecureFile>,
    plain_data?: SecurePlainData,
}

export type secureValueHash = {
    type: SecureValueType,
    hash: Uint8Array | number[],
}

export type secureValueErrorData = {
    type: SecureValueType,
    data_hash: Uint8Array | number[],
    field: string,
    text: string,
}

export type secureValueErrorFrontSide = {
    type: SecureValueType,
    file_hash: Uint8Array | number[],
    text: string,
}

export type secureValueErrorReverseSide = {
    type: SecureValueType,
    file_hash: Uint8Array | number[],
    text: string,
}

export type secureValueErrorSelfie = {
    type: SecureValueType,
    file_hash: Uint8Array | number[],
    text: string,
}

export type secureValueErrorFile = {
    type: SecureValueType,
    file_hash: Uint8Array | number[],
    text: string,
}

export type secureValueErrorFiles = {
    type: SecureValueType,
    file_hash: Array<Uint8Array | number[]>,
    text: string,
}

export type secureValueError = {
    type: SecureValueType,
    hash: Uint8Array | number[],
    text: string,
}

export type secureValueErrorTranslationFile = {
    type: SecureValueType,
    file_hash: Uint8Array | number[],
    text: string,
}

export type secureValueErrorTranslationFiles = {
    type: SecureValueType,
    file_hash: Array<Uint8Array | number[]>,
    text: string,
}

export type secureCredentialsEncrypted = {
    data: Uint8Array | number[],
    hash: Uint8Array | number[],
    secret: Uint8Array | number[],
}

export type account__authorizationForm = {
    required_types: Array<SecureRequiredType>,
    values: Array<SecureValue>,
    errors: Array<SecureValueError>,
    users: Array<User>,
    privacy_policy_url?: string,
}

export type account__sentEmailCode = {
    email_pattern: string,
    length: number,
}

export type help__deepLinkInfoEmpty = {
}

export type help__deepLinkInfo = {
    update_app?: boolean,
    message: string,
    entities?: Array<MessageEntity>,
}

export type savedPhoneContact = {
    phone: string,
    first_name: string,
    last_name: string,
    date: number,
}

export type account__takeout = {
    id: string | number[] | Uint8Array,
}

export type passwordKdfAlgoUnknown = {
}

export type passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow = {
    salt1: Uint8Array | number[],
    salt2: Uint8Array | number[],
    g: number,
    p: Uint8Array | number[],
}

export type securePasswordKdfAlgoUnknown = {
}

export type securePasswordKdfAlgoPBKDF2HMACSHA512iter100000 = {
    salt: Uint8Array | number[],
}

export type securePasswordKdfAlgoSHA512 = {
    salt: Uint8Array | number[],
}

export type secureSecretSettings = {
    secure_algo: SecurePasswordKdfAlgo,
    secure_secret: Uint8Array | number[],
    secure_secret_id: string | number[] | Uint8Array,
}

export type inputCheckPasswordEmpty = {
}

export type inputCheckPasswordSRP = {
    srp_id: string | number[] | Uint8Array,
    A: Uint8Array | number[],
    M1: Uint8Array | number[],
}

export type secureRequiredType = {
    native_names?: boolean,
    selfie_required?: boolean,
    translation_required?: boolean,
    type: SecureValueType,
}

export type secureRequiredTypeOneOf = {
    types: Array<SecureRequiredType>,
}

export type help__passportConfigNotModified = {
}

export type help__passportConfig = {
    hash: number,
    countries_langs: DataJSON,
}

export type inputAppEvent = {
    time: number,
    type: string,
    peer: string | number[] | Uint8Array,
    data: JSONValue,
}

export type jsonObjectValue = {
    key: string,
    value: JSONValue,
}

export type jsonNull = {
}

export type jsonBool = {
    value: Bool,
}

export type jsonNumber = {
    value: number,
}

export type jsonString = {
    value: string,
}

export type jsonArray = {
    value: Array<JSONValue>,
}

export type jsonObject = {
    value: Array<JSONObjectValue>,
}

export type pageTableCell = {
    header?: boolean,
    align_center?: boolean,
    align_right?: boolean,
    valign_middle?: boolean,
    valign_bottom?: boolean,
    text?: RichText,
    colspan?: number,
    rowspan?: number,
}

export type pageTableRow = {
    cells: Array<PageTableCell>,
}

export type pageCaption = {
    text: RichText,
    credit: RichText,
}

export type pageListItemText = {
    text: RichText,
}

export type pageListItemBlocks = {
    blocks: Array<PageBlock>,
}

export type pageListOrderedItemText = {
    num: string,
    text: RichText,
}

export type pageListOrderedItemBlocks = {
    num: string,
    blocks: Array<PageBlock>,
}

export type pageRelatedArticle = {
    url: string,
    webpage_id: string | number[] | Uint8Array,
    title?: string,
    description?: string,
    photo_id?: string | number[] | Uint8Array,
    author?: string,
    published_date?: number,
}

export type page = {
    part?: boolean,
    rtl?: boolean,
    v2?: boolean,
    url: string,
    blocks: Array<PageBlock>,
    photos: Array<Photo>,
    documents: Array<Document>,
}

export type help__supportName = {
    name: string,
}

export type help__userInfoEmpty = {
}

export type help__userInfo = {
    message: string,
    entities: Array<MessageEntity>,
    author: string,
    date: number,
}

export type pollAnswer = {
    text: string,
    option: Uint8Array | number[],
}

export type poll = {
    id: string | number[] | Uint8Array,
    closed?: boolean,
    public_voters?: boolean,
    multiple_choice?: boolean,
    quiz?: boolean,
    question: string,
    answers: Array<PollAnswer>,
}

export type pollAnswerVoters = {
    chosen?: boolean,
    correct?: boolean,
    option: Uint8Array | number[],
    voters: number,
}

export type pollResults = {
    min?: boolean,
    results?: Array<PollAnswerVoters>,
    total_voters?: number,
    recent_voters?: Array<number>,
}

export type chatOnlines = {
    onlines: number,
}

export type statsURL = {
    url: string,
}

export type chatAdminRights = {
    change_info?: boolean,
    post_messages?: boolean,
    edit_messages?: boolean,
    delete_messages?: boolean,
    ban_users?: boolean,
    invite_users?: boolean,
    pin_messages?: boolean,
    add_admins?: boolean,
}

export type chatBannedRights = {
    view_messages?: boolean,
    send_messages?: boolean,
    send_media?: boolean,
    send_stickers?: boolean,
    send_gifs?: boolean,
    send_games?: boolean,
    send_inline?: boolean,
    embed_links?: boolean,
    send_polls?: boolean,
    change_info?: boolean,
    invite_users?: boolean,
    pin_messages?: boolean,
    until_date: number,
}

export type inputWallPaper = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
}

export type inputWallPaperSlug = {
    slug: string,
}

export type inputWallPaperNoFile = {
}

export type account__wallPapersNotModified = {
}

export type account__wallPapers = {
    hash: number,
    wallpapers: Array<WallPaper>,
}

export type codeSettings = {
    allow_flashcall?: boolean,
    current_number?: boolean,
    allow_app_hash?: boolean,
}

export type wallPaperSettings = {
    blur?: boolean,
    motion?: boolean,
    background_color?: number,
    second_background_color?: number,
    intensity?: number,
    rotation?: number,
}

export type autoDownloadSettings = {
    disabled?: boolean,
    video_preload_large?: boolean,
    audio_preload_next?: boolean,
    phonecalls_less_data?: boolean,
    photo_size_max: number,
    video_size_max: number,
    file_size_max: number,
    video_upload_maxbitrate: number,
}

export type account__autoDownloadSettings = {
    low: AutoDownloadSettings,
    medium: AutoDownloadSettings,
    high: AutoDownloadSettings,
}

export type emojiKeyword = {
    keyword: string,
    emoticons: Array<string>,
}

export type emojiKeywordDeleted = {
    keyword: string,
    emoticons: Array<string>,
}

export type emojiKeywordsDifference = {
    lang_code: string,
    from_version: number,
    version: number,
    keywords: Array<EmojiKeyword>,
}

export type emojiURL = {
    url: string,
}

export type emojiLanguage = {
    lang_code: string,
}

export type fileLocationToBeDeprecated = {
    volume_id: string | number[] | Uint8Array,
    local_id: number,
}

export type folder = {
    autofill_new_broadcasts?: boolean,
    autofill_public_groups?: boolean,
    autofill_new_correspondents?: boolean,
    id: number,
    title: string,
    photo?: ChatPhoto,
}

export type inputFolderPeer = {
    peer: InputPeer,
    folder_id: number,
}

export type folderPeer = {
    peer: Peer,
    folder_id: number,
}

export type messages__searchCounter = {
    inexact?: boolean,
    filter: MessagesFilter,
    count: number,
}

export type urlAuthResultRequest = {
    request_write_access?: boolean,
    bot: User,
    domain: string,
}

export type urlAuthResultAccepted = {
    url: string,
}

export type urlAuthResultDefault = {
}

export type channelLocationEmpty = {
}

export type channelLocation = {
    geo_point: GeoPoint,
    address: string,
}

export type peerLocated = {
    peer: Peer,
    expires: number,
    distance: number,
}

export type restrictionReason = {
    platform: string,
    reason: string,
    text: string,
}

export type inputTheme = {
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
}

export type inputThemeSlug = {
    slug: string,
}

export type theme = {
    creator?: boolean,
    default?: boolean,
    id: string | number[] | Uint8Array,
    access_hash: string | number[] | Uint8Array,
    slug: string,
    title: string,
    document?: Document,
    settings?: ThemeSettings,
    installs_count: number,
}

export type account__themesNotModified = {
}

export type account__themes = {
    hash: number,
    themes: Array<Theme>,
}

export type auth__loginToken = {
    expires: number,
    token: Uint8Array | number[],
}

export type auth__loginTokenMigrateTo = {
    dc_id: number,
    token: Uint8Array | number[],
}

export type auth__loginTokenSuccess = {
    authorization: auth__Authorization,
}

export type account__contentSettings = {
    sensitive_enabled?: boolean,
    sensitive_can_change?: boolean,
}

export type messages__inactiveChats = {
    dates: Array<number>,
    chats: Array<Chat>,
    users: Array<User>,
}

export type baseThemeClassic = {
}

export type baseThemeDay = {
}

export type baseThemeNight = {
}

export type baseThemeTinted = {
}

export type baseThemeArctic = {
}

export type inputThemeSettings = {
    base_theme: BaseTheme,
    accent_color: number,
    message_top_color?: number,
    message_bottom_color?: number,
    wallpaper?: InputWallPaper,
    wallpaper_settings?: WallPaperSettings,
}

export type themeSettings = {
    base_theme: BaseTheme,
    accent_color: number,
    message_top_color?: number,
    message_bottom_color?: number,
    wallpaper?: WallPaper,
}

export type webPageAttributeTheme = {
    documents?: Array<Document>,
    settings?: ThemeSettings,
}

export type messageUserVote = {
    user_id: number,
    option: Uint8Array | number[],
    date: number,
}

export type messageUserVoteInputOption = {
    user_id: number,
    date: number,
}

export type messageUserVoteMultiple = {
    user_id: number,
    options: Array<Uint8Array | number[]>,
    date: number,
}

export type messages__votesList = {
    count: number,
    votes: Array<MessageUserVote>,
    users: Array<User>,
    next_offset?: string,
}

type Bool = boolFalse | boolTrue
type True = true
type Error = error
type Null = null
type InputPeer = inputPeerEmpty | inputPeerSelf | inputPeerChat | inputPeerUser | inputPeerChannel | inputPeerUserFromMessage | inputPeerChannelFromMessage
type InputUser = inputUserEmpty | inputUserSelf | inputUser | inputUserFromMessage
type InputContact = inputPhoneContact
type InputFile = inputFile | inputFileBig
type InputMedia = inputMediaEmpty | inputMediaUploadedPhoto | inputMediaPhoto | inputMediaGeoPoint | inputMediaContact | inputMediaUploadedDocument | inputMediaDocument | inputMediaVenue | inputMediaGifExternal | inputMediaPhotoExternal | inputMediaDocumentExternal | inputMediaGame | inputMediaInvoice | inputMediaGeoLive | inputMediaPoll
type InputChatPhoto = inputChatPhotoEmpty | inputChatUploadedPhoto | inputChatPhoto
type InputGeoPoint = inputGeoPointEmpty | inputGeoPoint
type InputPhoto = inputPhotoEmpty | inputPhoto
type InputFileLocation = inputFileLocation | inputEncryptedFileLocation | inputDocumentFileLocation | inputSecureFileLocation | inputTakeoutFileLocation | inputPhotoFileLocation | inputPhotoLegacyFileLocation | inputPeerPhotoFileLocation | inputStickerSetThumb
type Peer = peerUser | peerChat | peerChannel
type storage__FileType = storage__fileUnknown | storage__filePartial | storage__fileJpeg | storage__fileGif | storage__filePng | storage__filePdf | storage__fileMp3 | storage__fileMov | storage__fileMp4 | storage__fileWebp
type User = userEmpty | user
type UserProfilePhoto = userProfilePhotoEmpty | userProfilePhoto
type UserStatus = userStatusEmpty | userStatusOnline | userStatusOffline | userStatusRecently | userStatusLastWeek | userStatusLastMonth
type Chat = chatEmpty | chat | chatForbidden | channel | channelForbidden
type ChatFull = chatFull | channelFull
type ChatParticipant = chatParticipant | chatParticipantCreator | chatParticipantAdmin
type ChatParticipants = chatParticipantsForbidden | chatParticipants
type ChatPhoto = chatPhotoEmpty | chatPhoto
type Message = messageEmpty | message | messageService
type MessageMedia = messageMediaEmpty | messageMediaPhoto | messageMediaGeo | messageMediaContact | messageMediaUnsupported | messageMediaDocument | messageMediaWebPage | messageMediaVenue | messageMediaGame | messageMediaInvoice | messageMediaGeoLive | messageMediaPoll
type MessageAction = messageActionEmpty | messageActionChatCreate | messageActionChatEditTitle | messageActionChatEditPhoto | messageActionChatDeletePhoto | messageActionChatAddUser | messageActionChatDeleteUser | messageActionChatJoinedByLink | messageActionChannelCreate | messageActionChatMigrateTo | messageActionChannelMigrateFrom | messageActionPinMessage | messageActionHistoryClear | messageActionGameScore | messageActionPaymentSentMe | messageActionPaymentSent | messageActionPhoneCall | messageActionScreenshotTaken | messageActionCustomAction | messageActionBotAllowed | messageActionSecureValuesSentMe | messageActionSecureValuesSent | messageActionContactSignUp
type Dialog = dialog | dialogFolder
type Photo = photoEmpty | photo
type PhotoSize = photoSizeEmpty | photoSize | photoCachedSize | photoStrippedSize
type GeoPoint = geoPointEmpty | geoPoint
type auth__SentCode = auth__sentCode
type auth__Authorization = auth__authorization | auth__authorizationSignUpRequired
type auth__ExportedAuthorization = auth__exportedAuthorization
type InputNotifyPeer = inputNotifyPeer | inputNotifyUsers | inputNotifyChats | inputNotifyBroadcasts
type InputPeerNotifySettings = inputPeerNotifySettings
type PeerNotifySettings = peerNotifySettings
type PeerSettings = peerSettings
type WallPaper = wallPaper | wallPaperNoFile
type ReportReason = inputReportReasonSpam | inputReportReasonViolence | inputReportReasonPornography | inputReportReasonChildAbuse | inputReportReasonOther | inputReportReasonCopyright | inputReportReasonGeoIrrelevant
type UserFull = userFull
type Contact = contact
type ImportedContact = importedContact
type ContactBlocked = contactBlocked
type ContactStatus = contactStatus
type contacts__Contacts = contacts__contactsNotModified | contacts__contacts
type contacts__ImportedContacts = contacts__importedContacts
type contacts__Blocked = contacts__blocked | contacts__blockedSlice
type messages__Dialogs = messages__dialogs | messages__dialogsSlice | messages__dialogsNotModified
type messages__Messages = messages__messages | messages__messagesSlice | messages__channelMessages | messages__messagesNotModified
type messages__Chats = messages__chats | messages__chatsSlice
type messages__ChatFull = messages__chatFull
type messages__AffectedHistory = messages__affectedHistory
type MessagesFilter = inputMessagesFilterEmpty | inputMessagesFilterPhotos | inputMessagesFilterVideo | inputMessagesFilterPhotoVideo | inputMessagesFilterDocument | inputMessagesFilterUrl | inputMessagesFilterGif | inputMessagesFilterVoice | inputMessagesFilterMusic | inputMessagesFilterChatPhotos | inputMessagesFilterPhoneCalls | inputMessagesFilterRoundVoice | inputMessagesFilterRoundVideo | inputMessagesFilterMyMentions | inputMessagesFilterGeo | inputMessagesFilterContacts
type Update = updateNewMessage | updateMessageID | updateDeleteMessages | updateUserTyping | updateChatUserTyping | updateChatParticipants | updateUserStatus | updateUserName | updateUserPhoto | updateNewEncryptedMessage | updateEncryptedChatTyping | updateEncryption | updateEncryptedMessagesRead | updateChatParticipantAdd | updateChatParticipantDelete | updateDcOptions | updateUserBlocked | updateNotifySettings | updateServiceNotification | updatePrivacy | updateUserPhone | updateReadHistoryInbox | updateReadHistoryOutbox | updateWebPage | updateReadMessagesContents | updateChannelTooLong | updateChannel | updateNewChannelMessage | updateReadChannelInbox | updateDeleteChannelMessages | updateChannelMessageViews | updateChatParticipantAdmin | updateNewStickerSet | updateStickerSetsOrder | updateStickerSets | updateSavedGifs | updateBotInlineQuery | updateBotInlineSend | updateEditChannelMessage | updateChannelPinnedMessage | updateBotCallbackQuery | updateEditMessage | updateInlineBotCallbackQuery | updateReadChannelOutbox | updateDraftMessage | updateReadFeaturedStickers | updateRecentStickers | updateConfig | updatePtsChanged | updateChannelWebPage | updateDialogPinned | updatePinnedDialogs | updateBotWebhookJSON | updateBotWebhookJSONQuery | updateBotShippingQuery | updateBotPrecheckoutQuery | updatePhoneCall | updateLangPackTooLong | updateLangPack | updateFavedStickers | updateChannelReadMessagesContents | updateContactsReset | updateChannelAvailableMessages | updateDialogUnreadMark | updateUserPinnedMessage | updateChatPinnedMessage | updateMessagePoll | updateChatDefaultBannedRights | updateFolderPeers | updatePeerSettings | updatePeerLocated | updateNewScheduledMessage | updateDeleteScheduledMessages | updateTheme | updateGeoLiveViewed | updateLoginToken | updateMessagePollVote
type updates__State = updates__state
type updates__Difference = updates__differenceEmpty | updates__difference | updates__differenceSlice | updates__differenceTooLong
type Updates = updatesTooLong | updateShortMessage | updateShortChatMessage | updateShort | updatesCombined | updates | updateShortSentMessage
type photos__Photos = photos__photos | photos__photosSlice
type photos__Photo = photos__photo
type upload__File = upload__file | upload__fileCdnRedirect
type DcOption = dcOption
type Config = config
type NearestDc = nearestDc
type help__AppUpdate = help__appUpdate | help__noAppUpdate
type help__InviteText = help__inviteText
type EncryptedChat = encryptedChatEmpty | encryptedChatWaiting | encryptedChatRequested | encryptedChat | encryptedChatDiscarded
type InputEncryptedChat = inputEncryptedChat
type EncryptedFile = encryptedFileEmpty | encryptedFile
type InputEncryptedFile = inputEncryptedFileEmpty | inputEncryptedFileUploaded | inputEncryptedFile | inputEncryptedFileBigUploaded
type EncryptedMessage = encryptedMessage | encryptedMessageService
type messages__DhConfig = messages__dhConfigNotModified | messages__dhConfig
type messages__SentEncryptedMessage = messages__sentEncryptedMessage | messages__sentEncryptedFile
type InputDocument = inputDocumentEmpty | inputDocument
type Document = documentEmpty | document
type help__Support = help__support
type NotifyPeer = notifyPeer | notifyUsers | notifyChats | notifyBroadcasts
type SendMessageAction = sendMessageTypingAction | sendMessageCancelAction | sendMessageRecordVideoAction | sendMessageUploadVideoAction | sendMessageRecordAudioAction | sendMessageUploadAudioAction | sendMessageUploadPhotoAction | sendMessageUploadDocumentAction | sendMessageGeoLocationAction | sendMessageChooseContactAction | sendMessageGamePlayAction | sendMessageRecordRoundAction | sendMessageUploadRoundAction
type contacts__Found = contacts__found
type InputPrivacyKey = inputPrivacyKeyStatusTimestamp | inputPrivacyKeyChatInvite | inputPrivacyKeyPhoneCall | inputPrivacyKeyPhoneP2P | inputPrivacyKeyForwards | inputPrivacyKeyProfilePhoto | inputPrivacyKeyPhoneNumber | inputPrivacyKeyAddedByPhone
type PrivacyKey = privacyKeyStatusTimestamp | privacyKeyChatInvite | privacyKeyPhoneCall | privacyKeyPhoneP2P | privacyKeyForwards | privacyKeyProfilePhoto | privacyKeyPhoneNumber | privacyKeyAddedByPhone
type InputPrivacyRule = inputPrivacyValueAllowContacts | inputPrivacyValueAllowAll | inputPrivacyValueAllowUsers | inputPrivacyValueDisallowContacts | inputPrivacyValueDisallowAll | inputPrivacyValueDisallowUsers | inputPrivacyValueAllowChatParticipants | inputPrivacyValueDisallowChatParticipants
type PrivacyRule = privacyValueAllowContacts | privacyValueAllowAll | privacyValueAllowUsers | privacyValueDisallowContacts | privacyValueDisallowAll | privacyValueDisallowUsers | privacyValueAllowChatParticipants | privacyValueDisallowChatParticipants
type account__PrivacyRules = account__privacyRules
type AccountDaysTTL = accountDaysTTL
type DocumentAttribute = documentAttributeImageSize | documentAttributeAnimated | documentAttributeSticker | documentAttributeVideo | documentAttributeAudio | documentAttributeFilename | documentAttributeHasStickers
type messages__Stickers = messages__stickersNotModified | messages__stickers
type StickerPack = stickerPack
type messages__AllStickers = messages__allStickersNotModified | messages__allStickers
type messages__AffectedMessages = messages__affectedMessages
type WebPage = webPageEmpty | webPagePending | webPage | webPageNotModified
type Authorization = authorization
type account__Authorizations = account__authorizations
type account__Password = account__password
type account__PasswordSettings = account__passwordSettings
type account__PasswordInputSettings = account__passwordInputSettings
type auth__PasswordRecovery = auth__passwordRecovery
type ReceivedNotifyMessage = receivedNotifyMessage
type ExportedChatInvite = chatInviteEmpty | chatInviteExported
type ChatInvite = chatInviteAlready | chatInvite
type InputStickerSet = inputStickerSetEmpty | inputStickerSetID | inputStickerSetShortName | inputStickerSetAnimatedEmoji
type StickerSet = stickerSet
type messages__StickerSet = messages__stickerSet
type BotCommand = botCommand
type BotInfo = botInfo
type KeyboardButton = keyboardButton | keyboardButtonUrl | keyboardButtonCallback | keyboardButtonRequestPhone | keyboardButtonRequestGeoLocation | keyboardButtonSwitchInline | keyboardButtonGame | keyboardButtonBuy | keyboardButtonUrlAuth | inputKeyboardButtonUrlAuth | keyboardButtonRequestPoll
type KeyboardButtonRow = keyboardButtonRow
type ReplyMarkup = replyKeyboardHide | replyKeyboardForceReply | replyKeyboardMarkup | replyInlineMarkup
type MessageEntity = messageEntityUnknown | messageEntityMention | messageEntityHashtag | messageEntityBotCommand | messageEntityUrl | messageEntityEmail | messageEntityBold | messageEntityItalic | messageEntityCode | messageEntityPre | messageEntityTextUrl | messageEntityMentionName | inputMessageEntityMentionName | messageEntityPhone | messageEntityCashtag | messageEntityUnderline | messageEntityStrike | messageEntityBlockquote
type InputChannel = inputChannelEmpty | inputChannel | inputChannelFromMessage
type contacts__ResolvedPeer = contacts__resolvedPeer
type MessageRange = messageRange
type updates__ChannelDifference = updates__channelDifferenceEmpty | updates__channelDifferenceTooLong | updates__channelDifference
type ChannelMessagesFilter = channelMessagesFilterEmpty | channelMessagesFilter
type ChannelParticipant = channelParticipant | channelParticipantSelf | channelParticipantCreator | channelParticipantAdmin | channelParticipantBanned
type ChannelParticipantsFilter = channelParticipantsRecent | channelParticipantsAdmins | channelParticipantsKicked | channelParticipantsBots | channelParticipantsBanned | channelParticipantsSearch | channelParticipantsContacts
type channels__ChannelParticipants = channels__channelParticipants | channels__channelParticipantsNotModified
type channels__ChannelParticipant = channels__channelParticipant
type help__TermsOfService = help__termsOfService
type FoundGif = foundGif | foundGifCached
type messages__FoundGifs = messages__foundGifs
type messages__SavedGifs = messages__savedGifsNotModified | messages__savedGifs
type InputBotInlineMessage = inputBotInlineMessageMediaAuto | inputBotInlineMessageText | inputBotInlineMessageMediaGeo | inputBotInlineMessageMediaVenue | inputBotInlineMessageMediaContact | inputBotInlineMessageGame
type InputBotInlineResult = inputBotInlineResult | inputBotInlineResultPhoto | inputBotInlineResultDocument | inputBotInlineResultGame
type BotInlineMessage = botInlineMessageMediaAuto | botInlineMessageText | botInlineMessageMediaGeo | botInlineMessageMediaVenue | botInlineMessageMediaContact
type BotInlineResult = botInlineResult | botInlineMediaResult
type messages__BotResults = messages__botResults
type ExportedMessageLink = exportedMessageLink
type MessageFwdHeader = messageFwdHeader
type auth__CodeType = auth__codeTypeSms | auth__codeTypeCall | auth__codeTypeFlashCall
type auth__SentCodeType = auth__sentCodeTypeApp | auth__sentCodeTypeSms | auth__sentCodeTypeCall | auth__sentCodeTypeFlashCall
type messages__BotCallbackAnswer = messages__botCallbackAnswer
type messages__MessageEditData = messages__messageEditData
type InputBotInlineMessageID = inputBotInlineMessageID
type InlineBotSwitchPM = inlineBotSwitchPM
type messages__PeerDialogs = messages__peerDialogs
type TopPeer = topPeer
type TopPeerCategory = topPeerCategoryBotsPM | topPeerCategoryBotsInline | topPeerCategoryCorrespondents | topPeerCategoryGroups | topPeerCategoryChannels | topPeerCategoryPhoneCalls | topPeerCategoryForwardUsers | topPeerCategoryForwardChats
type TopPeerCategoryPeers = topPeerCategoryPeers
type contacts__TopPeers = contacts__topPeersNotModified | contacts__topPeers | contacts__topPeersDisabled
type DraftMessage = draftMessageEmpty | draftMessage
type messages__FeaturedStickers = messages__featuredStickersNotModified | messages__featuredStickers
type messages__RecentStickers = messages__recentStickersNotModified | messages__recentStickers
type messages__ArchivedStickers = messages__archivedStickers
type messages__StickerSetInstallResult = messages__stickerSetInstallResultSuccess | messages__stickerSetInstallResultArchive
type StickerSetCovered = stickerSetCovered | stickerSetMultiCovered
type MaskCoords = maskCoords
type InputStickeredMedia = inputStickeredMediaPhoto | inputStickeredMediaDocument
type Game = game
type InputGame = inputGameID | inputGameShortName
type HighScore = highScore
type messages__HighScores = messages__highScores
type RichText = textEmpty | textPlain | textBold | textItalic | textUnderline | textStrike | textFixed | textUrl | textEmail | textConcat | textSubscript | textSuperscript | textMarked | textPhone | textImage | textAnchor
type PageBlock = pageBlockUnsupported | pageBlockTitle | pageBlockSubtitle | pageBlockAuthorDate | pageBlockHeader | pageBlockSubheader | pageBlockParagraph | pageBlockPreformatted | pageBlockFooter | pageBlockDivider | pageBlockAnchor | pageBlockList | pageBlockBlockquote | pageBlockPullquote | pageBlockPhoto | pageBlockVideo | pageBlockCover | pageBlockEmbed | pageBlockEmbedPost | pageBlockCollage | pageBlockSlideshow | pageBlockChannel | pageBlockAudio | pageBlockKicker | pageBlockTable | pageBlockOrderedList | pageBlockDetails | pageBlockRelatedArticles | pageBlockMap
type PhoneCallDiscardReason = phoneCallDiscardReasonMissed | phoneCallDiscardReasonDisconnect | phoneCallDiscardReasonHangup | phoneCallDiscardReasonBusy
type DataJSON = dataJSON
type LabeledPrice = labeledPrice
type Invoice = invoice
type PaymentCharge = paymentCharge
type PostAddress = postAddress
type PaymentRequestedInfo = paymentRequestedInfo
type PaymentSavedCredentials = paymentSavedCredentialsCard
type WebDocument = webDocument | webDocumentNoProxy
type InputWebDocument = inputWebDocument
type InputWebFileLocation = inputWebFileLocation | inputWebFileGeoPointLocation
type upload__WebFile = upload__webFile
type payments__PaymentForm = payments__paymentForm
type payments__ValidatedRequestedInfo = payments__validatedRequestedInfo
type payments__PaymentResult = payments__paymentResult | payments__paymentVerificationNeeded
type payments__PaymentReceipt = payments__paymentReceipt
type payments__SavedInfo = payments__savedInfo
type InputPaymentCredentials = inputPaymentCredentialsSaved | inputPaymentCredentials | inputPaymentCredentialsApplePay | inputPaymentCredentialsAndroidPay
type account__TmpPassword = account__tmpPassword
type ShippingOption = shippingOption
type InputStickerSetItem = inputStickerSetItem
type InputPhoneCall = inputPhoneCall
type PhoneCall = phoneCallEmpty | phoneCallWaiting | phoneCallRequested | phoneCallAccepted | phoneCall | phoneCallDiscarded
type PhoneConnection = phoneConnection
type PhoneCallProtocol = phoneCallProtocol
type phone__PhoneCall = phone__phoneCall
type upload__CdnFile = upload__cdnFileReuploadNeeded | upload__cdnFile
type CdnPublicKey = cdnPublicKey
type CdnConfig = cdnConfig
type LangPackString = langPackString | langPackStringPluralized | langPackStringDeleted
type LangPackDifference = langPackDifference
type LangPackLanguage = langPackLanguage
type ChannelAdminLogEventAction = channelAdminLogEventActionChangeTitle | channelAdminLogEventActionChangeAbout | channelAdminLogEventActionChangeUsername | channelAdminLogEventActionChangePhoto | channelAdminLogEventActionToggleInvites | channelAdminLogEventActionToggleSignatures | channelAdminLogEventActionUpdatePinned | channelAdminLogEventActionEditMessage | channelAdminLogEventActionDeleteMessage | channelAdminLogEventActionParticipantJoin | channelAdminLogEventActionParticipantLeave | channelAdminLogEventActionParticipantInvite | channelAdminLogEventActionParticipantToggleBan | channelAdminLogEventActionParticipantToggleAdmin | channelAdminLogEventActionChangeStickerSet | channelAdminLogEventActionTogglePreHistoryHidden | channelAdminLogEventActionDefaultBannedRights | channelAdminLogEventActionStopPoll | channelAdminLogEventActionChangeLinkedChat | channelAdminLogEventActionChangeLocation | channelAdminLogEventActionToggleSlowMode
type ChannelAdminLogEvent = channelAdminLogEvent
type channels__AdminLogResults = channels__adminLogResults
type ChannelAdminLogEventsFilter = channelAdminLogEventsFilter
type PopularContact = popularContact
type messages__FavedStickers = messages__favedStickersNotModified | messages__favedStickers
type RecentMeUrl = recentMeUrlUnknown | recentMeUrlUser | recentMeUrlChat | recentMeUrlChatInvite | recentMeUrlStickerSet
type help__RecentMeUrls = help__recentMeUrls
type InputSingleMedia = inputSingleMedia
type WebAuthorization = webAuthorization
type account__WebAuthorizations = account__webAuthorizations
type InputMessage = inputMessageID | inputMessageReplyTo | inputMessagePinned
type InputDialogPeer = inputDialogPeer | inputDialogPeerFolder
type DialogPeer = dialogPeer | dialogPeerFolder
type messages__FoundStickerSets = messages__foundStickerSetsNotModified | messages__foundStickerSets
type FileHash = fileHash
type InputClientProxy = inputClientProxy
type help__ProxyData = help__proxyDataEmpty | help__proxyDataPromo
type help__TermsOfServiceUpdate = help__termsOfServiceUpdateEmpty | help__termsOfServiceUpdate
type InputSecureFile = inputSecureFileUploaded | inputSecureFile
type SecureFile = secureFileEmpty | secureFile
type SecureData = secureData
type SecurePlainData = securePlainPhone | securePlainEmail
type SecureValueType = secureValueTypePersonalDetails | secureValueTypePassport | secureValueTypeDriverLicense | secureValueTypeIdentityCard | secureValueTypeInternalPassport | secureValueTypeAddress | secureValueTypeUtilityBill | secureValueTypeBankStatement | secureValueTypeRentalAgreement | secureValueTypePassportRegistration | secureValueTypeTemporaryRegistration | secureValueTypePhone | secureValueTypeEmail
type SecureValue = secureValue
type InputSecureValue = inputSecureValue
type SecureValueHash = secureValueHash
type SecureValueError = secureValueErrorData | secureValueErrorFrontSide | secureValueErrorReverseSide | secureValueErrorSelfie | secureValueErrorFile | secureValueErrorFiles | secureValueError | secureValueErrorTranslationFile | secureValueErrorTranslationFiles
type SecureCredentialsEncrypted = secureCredentialsEncrypted
type account__AuthorizationForm = account__authorizationForm
type account__SentEmailCode = account__sentEmailCode
type help__DeepLinkInfo = help__deepLinkInfoEmpty | help__deepLinkInfo
type SavedContact = savedPhoneContact
type account__Takeout = account__takeout
type PasswordKdfAlgo = passwordKdfAlgoUnknown | passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow
type SecurePasswordKdfAlgo = securePasswordKdfAlgoUnknown | securePasswordKdfAlgoPBKDF2HMACSHA512iter100000 | securePasswordKdfAlgoSHA512
type SecureSecretSettings = secureSecretSettings
type InputCheckPasswordSRP = inputCheckPasswordEmpty | inputCheckPasswordSRP
type SecureRequiredType = secureRequiredType | secureRequiredTypeOneOf
type help__PassportConfig = help__passportConfigNotModified | help__passportConfig
type InputAppEvent = inputAppEvent
type JSONObjectValue = jsonObjectValue
type JSONValue = jsonNull | jsonBool | jsonNumber | jsonString | jsonArray | jsonObject
type PageTableCell = pageTableCell
type PageTableRow = pageTableRow
type PageCaption = pageCaption
type PageListItem = pageListItemText | pageListItemBlocks
type PageListOrderedItem = pageListOrderedItemText | pageListOrderedItemBlocks
type PageRelatedArticle = pageRelatedArticle
type Page = page
type help__SupportName = help__supportName
type help__UserInfo = help__userInfoEmpty | help__userInfo
type PollAnswer = pollAnswer
type Poll = poll
type PollAnswerVoters = pollAnswerVoters
type PollResults = pollResults
type ChatOnlines = chatOnlines
type StatsURL = statsURL
type ChatAdminRights = chatAdminRights
type ChatBannedRights = chatBannedRights
type InputWallPaper = inputWallPaper | inputWallPaperSlug | inputWallPaperNoFile
type account__WallPapers = account__wallPapersNotModified | account__wallPapers
type CodeSettings = codeSettings
type WallPaperSettings = wallPaperSettings
type AutoDownloadSettings = autoDownloadSettings
type account__AutoDownloadSettings = account__autoDownloadSettings
type EmojiKeyword = emojiKeyword | emojiKeywordDeleted
type EmojiKeywordsDifference = emojiKeywordsDifference
type EmojiURL = emojiURL
type EmojiLanguage = emojiLanguage
type FileLocation = fileLocationToBeDeprecated
type Folder = folder
type InputFolderPeer = inputFolderPeer
type FolderPeer = folderPeer
type messages__SearchCounter = messages__searchCounter
type UrlAuthResult = urlAuthResultRequest | urlAuthResultAccepted | urlAuthResultDefault
type ChannelLocation = channelLocationEmpty | channelLocation
type PeerLocated = peerLocated
type RestrictionReason = restrictionReason
type InputTheme = inputTheme | inputThemeSlug
type Theme = theme
type account__Themes = account__themesNotModified | account__themes
type auth__LoginToken = auth__loginToken | auth__loginTokenMigrateTo | auth__loginTokenSuccess
type account__ContentSettings = account__contentSettings
type messages__InactiveChats = messages__inactiveChats
type BaseTheme = baseThemeClassic | baseThemeDay | baseThemeNight | baseThemeTinted | baseThemeArctic
type InputThemeSettings = inputThemeSettings
type ThemeSettings = themeSettings
type WebPageAttribute = webPageAttributeTheme
type MessageUserVote = messageUserVote | messageUserVoteInputOption | messageUserVoteMultiple
type messages__VotesList = messages__votesList
