!function () {
    "use strict";
    const t = t => null != t, e = t => Error(`Unexpected constructor: ${t.toString(16)}`),
        s = (t, {pq: e, p: s, q: n, nonce: i, serverNonce: r, newNonce: a}) => {
            t.uint32(2211011308), t.bytes(e), t.bytes(s), t.bytes(n), t.int128(i), t.int128(r), t.int256(a)
        }, n = (t, {nonce: e, serverNonce: s, retryId: n, gB: i}) => {
            t.uint32(1715713620), t.int128(e), t.int128(s), t.long(n), t.bytes(i)
        }, i = (t, {msgIds: e}) => {
            t.uint32(1658238041), t.vectorLong(e)
        }, r = (t, {nonce: e, serverNonce: s, p: n, q: i, publicKeyFingerprint: r, encryptedData: a}) => {
            t.uint32(3608339646), t.int128(e), t.int128(s), t.bytes(n), t.bytes(i), t.long(r), t.bytes(a)
        }, a = (t, {nonce: e, serverNonce: s, encryptedData: n}) => {
            t.uint32(4110704415), t.int128(e), t.int128(s), t.bytes(n)
        }, o = (t, {nonce: e}) => {
            t.uint32(3195965169), t.int128(e)
        }, c = t => {
            t.uint32(2134579434)
        }, h = (t, {chatId: e}) => {
            t.uint32(396093539), t.int(e)
        }, l = t => {
            t.uint32(4156666175)
        }, u = (t, {id: e, parts: s, name: n, md5Checksum: i}) => {
            t.uint32(4113560191), t.long(e), t.int(s), t.string(n), t.string(i)
        }, d = (e, {file: s, stickers: n, ttlSeconds: i}) => {
            const r = t(n) << 0 | t(i) << 1;
            e.uint32(505969924), e.int(r), s.$$(e, s), t(n) && e.vector(n), t(i) && e.int(i)
        }, p = (e, {isNosoundVideo: s, file: n, thumb: i, mimeType: r, attributes: a, stickers: o, ttlSeconds: c}) => {
            const h = s << 3 | t(i) << 2 | t(o) << 0 | t(c) << 1;
            e.uint32(1530447553), e.int(h), n.$$(e, n), t(i) && i.$$(e, i), e.string(r), e.vector(a), t(o) && e.vector(o), t(c) && e.int(c)
        }, g = (t, {id: e, accessHash: s, fileReference: n, thumbSize: i}) => {
            t.uint32(3134223748), t.long(e), t.long(s), t.bytes(n), t.string(i)
        }, m = (t, {userId: e, accessHash: s}) => {
            t.uint32(2072935910), t.int(e), t.long(s)
        }, f = (t, {userId: e, accessHash: s}) => {
            t.uint32(3626575894), t.int(e), t.long(s)
        }, w = (t, {channelId: e, accessHash: s}) => {
            t.uint32(2951442734), t.int(e), t.long(s)
        }, $ = (t, {channelId: e, accessHash: s}) => {
            t.uint32(548253432), t.int(e), t.long(s)
        }, y = (t, {id: e}) => {
            t.uint32(2792792866), t.int(e)
        }, b = (t, {peer: e}) => {
            t.uint32(4239064759), e.$$(t, e)
        }, I = (t, {srpId: e, a: s, m1: n}) => {
            t.uint32(3531600002), t.long(e), t.bytes(s), t.bytes(n)
        }, v = (t, {isAllowFlashcall: e, isCurrentNumber: s, isAllowAppHash: n}) => {
            const i = e << 0 | s << 1 | n << 4;
            t.uint32(3737042563), t.int(i)
        }, E = (t, {id: e, accessHash: s, fileReference: n, thumbSize: i}) => {
            t.uint32(1075322878), t.long(e), t.long(s), t.bytes(n), t.string(i)
        }, C = (t, {isBig: e, peer: s, volumeId: n, localId: i}) => {
            const r = e << 0;
            t.uint32(668375447), t.int(r), s.$$(t, s), t.long(n), t.int(i)
        }, k = (t, {phoneNumber: e, apiId: s, apiHash: n, settings: i}) => {
            t.uint32(2792825935), t.string(e), t.int(s), t.string(n), i.$$(t, i)
        }, M = (t, {phoneNumber: e, phoneCodeHash: s, firstName: n, lastName: i}) => {
            t.uint32(2163139623), t.string(e), t.string(s), t.string(n), t.string(i)
        }, S = (t, {phoneNumber: e, phoneCodeHash: s, phoneCode: n}) => {
            t.uint32(3168081281), t.string(e), t.string(s), t.string(n)
        }, x = t => {
            t.uint32(1461180992)
        }, P = (t, {dcId: e}) => {
            t.uint32(3854565325), t.int(e)
        }, A = (t, {id: e, bytes: s}) => {
            t.uint32(3824129555), t.int(e), t.bytes(s)
        }, L = (t, {id: e}) => {
            t.uint32(3392185777), e.$$(t, e)
        }, N = (t, {id: e}) => {
            t.uint32(1673946374), t.vector(e)
        }, j = (e, {isExcludePinned: s, folderId: n, offsetDate: i, offsetId: r, offsetPeer: a, limit: o, hash: c}) => {
            const h = s << 0 | t(n) << 1;
            e.uint32(2699967347), e.int(h), t(n) && e.int(n), e.int(i), e.int(r), a.$$(e, a), e.int(o), e.int(c)
        }, D = (t, {peer: e, offsetId: s, offsetDate: n, addOffset: i, limit: r, maxId: a, minId: o, hash: c}) => {
            t.uint32(3703276128), e.$$(t, e), t.int(s), t.int(n), t.int(i), t.int(r), t.int(a), t.int(o), t.int(c)
        }, T = (t, {peer: e, maxId: s}) => {
            t.uint32(238054714), e.$$(t, e), t.int(s)
        },
        U = (e, {isNoWebpage: s, isSilent: n, isBackground: i, isClearDraft: r, peer: a, replyToMsgId: o, message: c, randomId: h, replyMarkup: l, entities: u, scheduleDate: d}) => {
            const p = s << 1 | n << 5 | i << 6 | r << 7 | t(o) << 0 | t(l) << 2 | t(u) << 3 | t(d) << 10;
            e.uint32(1376532592), e.int(p), a.$$(e, a), t(o) && e.int(o), e.string(c), e.long(h), t(l) && l.$$(e, l), t(u) && e.vector(u), t(d) && e.int(d)
        },
        R = (e, {isSilent: s, isBackground: n, isClearDraft: i, peer: r, replyToMsgId: a, media: o, message: c, randomId: h, replyMarkup: l, entities: u, scheduleDate: d}) => {
            const p = s << 5 | n << 6 | i << 7 | t(a) << 0 | t(l) << 2 | t(u) << 3 | t(d) << 10;
            e.uint32(881978281), e.int(p), r.$$(e, r), t(a) && e.int(a), o.$$(e, o), e.string(c), e.long(h), t(l) && l.$$(e, l), t(u) && e.vector(u), t(d) && e.int(d)
        }, B = (t, {chatId: e}) => {
            t.uint32(998448230), t.int(e)
        }, H = t => {
            t.uint32(3990128682)
        }, _ = (t, {file: e}) => {
            t.uint32(1328726168), e.$$(t, e)
        }, O = (t, {fileId: e, filePart: s, bytes: n}) => {
            t.uint32(3003426337), t.long(e), t.int(s), t.bytes(n)
        }, F = (t, {isPrecise: e, location: s, offset: n, limit: i}) => {
            const r = e << 0;
            t.uint32(2975505148), t.int(r), s.$$(t, s), t.int(n), t.int(i)
        }, V = t => {
            t.uint32(3304659051)
        }, q = t => {
            t.uint32(531836966)
        },
        K = (e, {apiId: s, deviceModel: n, systemVersion: i, appVersion: r, systemLangCode: a, langPack: o, langCode: c, proxy: h, query: l}) => {
            const u = t(h) << 0;
            e.uint32(2018609336), e.int(u), e.int(s), e.string(n), e.string(i), e.string(r), e.string(a), e.string(o), e.string(c), t(h) && h.$$(e, h), l.$$(e, l)
        }, G = (t, {layer: e, query: s}) => {
            t.uint32(3667594509), t.int(e), s.$$(t, s)
        }, z = t => {
            t.uint32(1418342645)
        }, W = (t, {password: e}) => {
            t.uint32(3515567382), e.$$(t, e)
        }, Y = (t, {channel: e, maxId: s}) => {
            t.uint32(3423619383), e.$$(t, e), t.int(s)
        }, Q = (t, {channel: e}) => {
            t.uint32(141781513), e.$$(t, e)
        }, J = (t, {peers: e}) => {
            t.uint32(3832593661), t.vector(e)
        }, Z = (t, {peer: e}) => {
            t.uint32(1848369232), e.$$(t, e)
        }, X = t => {
            const e = {$: X};
            return e.nonce = t.int128(), e.serverNonce = t.int128(), e.pq = t.bytes(), e.serverPublicKeyFingerprints = t.vectorLong(), e
        }, tt = t => {
            const e = {$: tt};
            return e.nonce = t.int128(), e.serverNonce = t.int128(), e.newNonceHash = t.int128(), e
        }, et = t => {
            const e = {$: et};
            return e.nonce = t.int128(), e.serverNonce = t.int128(), e.encryptedAnswer = t.bytes(), e
        }, st = t => {
            const e = {$: st};
            return e.nonce = t.int128(), e.serverNonce = t.int128(), e.g = t.int(), e.dhPrime = t.bytes(), e.gA = t.bytes(), e.serverTime = t.int(), e
        }, nt = t => {
            const e = {$: nt};
            return e.nonce = t.int128(), e.serverNonce = t.int128(), e.newNonceHash1 = t.int128(), e
        }, it = t => {
            const e = {$: it};
            return e.nonce = t.int128(), e.serverNonce = t.int128(), e.newNonceHash2 = t.int128(), e
        }, rt = t => {
            const e = {$: rt};
            return e.nonce = t.int128(), e.serverNonce = t.int128(), e.newNonceHash3 = t.int128(), e
        }, at = t => {
            const e = {$: at};
            return e.reqMsgId = t.long(), e.result = ud(t), e
        }, ot = t => {
            const e = {$: ot};
            return e.errorCode = t.int(), e.errorMessage = t.string(), e
        }, ct = () => ({$: ct}), ht = () => ({$: ht}), lt = t => {
            const e = {$: lt};
            return e.msgId = t.long(), e.seqNo = t.int(), e.bytes = t.int(), e
        }, ut = t => {
            const e = {$: ut};
            return e.validSince = t.int(), e.validUntil = t.int(), e.salt = t.long(), e
        }, dt = t => {
            const e = {$: dt};
            return e.reqMsgId = t.long(), e.now = t.int(), e.salts = t.vector(fd, !0), e
        }, pt = t => {
            const e = {$: pt};
            return e.msgId = t.long(), e.pingId = t.long(), e
        }, gt = t => {
            const e = {$: gt};
            return e.sessionId = t.long(), e
        }, mt = t => {
            const e = {$: mt};
            return e.sessionId = t.long(), e
        }, ft = t => {
            const e = {$: ft};
            return e.firstMsgId = t.long(), e.uniqueId = t.long(), e.serverSalt = t.long(), e
        }, wt = t => {
            const e = {$: wt};
            return e.messages = t.vector($t, !0), e
        }, $t = t => {
            const e = {$: $t};
            return e.msgId = t.long(), e.seqno = t.int(), e.bytes = t.int(), e.body = ud(t), e
        }, yt = t => {
            const e = {$: yt};
            return e.packedData = t.bytes(), e
        }, bt = t => {
            const e = {$: bt};
            return e.msgIds = t.vectorLong(), e
        }, It = t => {
            const e = {$: It};
            return e.badMsgId = t.long(), e.badMsgSeqno = t.int(), e.errorCode = t.int(), e
        }, vt = t => {
            const e = {$: vt};
            return e.badMsgId = t.long(), e.badMsgSeqno = t.int(), e.errorCode = t.int(), e.newServerSalt = t.long(), e
        }, Et = () => ({$: Et}), Ct = () => ({$: Ct}), kt = () => ({$: kt}), Mt = () => ({$: Mt}), St = t => {
            const e = {$: St};
            return e.chatId = t.int(), e
        }, xt = () => ({$: xt}), Pt = () => ({$: Pt}), At = t => {
            const e = {$: At};
            return e.userId = t.int(), e
        }, Lt = t => {
            const e = {$: Lt};
            return e.chatId = t.int(), e
        }, Nt = () => ({$: Nt}), jt = () => ({$: jt}), Dt = () => ({$: Dt}), Tt = () => ({$: Tt}), Ut = () => ({$: Ut}),
        Rt = () => ({$: Rt}), Bt = () => ({$: Bt}), Ht = () => ({$: Ht}), _t = () => ({$: _t}), Ot = () => ({$: Ot}),
        Ft = t => {
            const e = {$: Ft};
            return e.id = t.int(), e
        }, Vt = () => ({$: Vt}), qt = t => {
            const e = {$: qt};
            return e.photoId = t.long(), e.photoSmall = Tg(t), e.photoBig = Tg(t), e.dcId = t.int(), e
        }, Kt = () => ({$: Kt}), Gt = t => {
            const e = {$: Gt};
            return e.expires = t.int(), e
        }, zt = t => {
            const e = {$: zt};
            return e.wasOnline = t.int(), e
        }, Wt = t => {
            const e = {$: Wt};
            return e.id = t.int(), e
        }, Yt = t => {
            const e = {$: Yt}, s = t.int();
            return e.isCreator = !!(1 & s), e.isKicked = !!(2 & s), e.isLeft = !!(4 & s), e.isDeactivated = !!(32 & s), e.id = t.int(), e.title = t.string(), e.photo = Pd(t), e.participantsCount = t.int(), e.date = t.int(), e.version = t.int(), 64 & s && (e.migratedTo = fp(t)), 16384 & s && (e.adminRights = Ag(t)), 262144 & s && (e.defaultBannedRights = Lg(t)), e
        }, Qt = t => {
            const e = {$: Qt};
            return e.id = t.int(), e.title = t.string(), e
        }, Jt = t => {
            const e = {$: Jt}, s = t.int();
            return e.isCanSetUsername = !!(128 & s), e.isHasScheduled = !!(256 & s), e.id = t.int(), e.about = t.string(), e.participants = xd(t), 4 & s && (e.chatPhoto = Dd(t)), e.notifySettings = Rd(t), e.exportedInvite = rp(t), 8 & s && (e.botInfo = t.vector(up)), 64 & s && (e.pinnedMsgId = t.int()), 2048 & s && (e.folderId = t.int()), e
        }, Zt = t => {
            const e = {$: Zt};
            return e.userId = t.int(), e.inviterId = t.int(), e.date = t.int(), e
        }, Xt = t => {
            const e = {$: Xt}, s = t.int();
            return e.chatId = t.int(), 1 & s && (e.selfParticipant = Sd(t)), e
        }, te = t => {
            const e = {$: te};
            return e.chatId = t.int(), e.participants = t.vector(Sd), e.version = t.int(), e
        }, ee = () => ({$: ee}), se = t => {
            const e = {$: se};
            return e.photoSmall = Tg(t), e.photoBig = Tg(t), e.dcId = t.int(), e
        }, ne = t => {
            const e = {$: ne};
            return e.id = t.int(), e
        }, ie = t => {
            const e = {$: ie}, s = t.int();
            return e.isOut = !!(2 & s), e.isMentioned = !!(16 & s), e.isMediaUnread = !!(32 & s), e.isSilent = !!(8192 & s), e.isPost = !!(16384 & s), e.isFromScheduled = !!(262144 & s), e.isLegacy = !!(524288 & s), e.isEditHide = !!(2097152 & s), e.id = t.int(), 256 & s && (e.fromId = t.int()), e.toId = bd(t), 4 & s && (e.fwdFrom = vp(t)), 2048 & s && (e.viaBotId = t.int()), 8 & s && (e.replyToMsgId = t.int()), e.date = t.int(), e.message = t.string(), 512 & s && (e.media = Ld(t)), 64 & s && (e.replyMarkup = gp(t)), 128 & s && (e.entities = t.vector(mp)), 1024 & s && (e.views = t.int()), 32768 & s && (e.editDate = t.int()), 65536 & s && (e.postAuthor = t.string()), 131072 & s && (e.groupedId = t.long()), 4194304 & s && (e.restrictionReason = t.vector(_g)), e
        }, re = t => {
            const e = {$: re}, s = t.int();
            return e.isOut = !!(2 & s), e.isMentioned = !!(16 & s), e.isMediaUnread = !!(32 & s), e.isSilent = !!(8192 & s), e.isPost = !!(16384 & s), e.isLegacy = !!(524288 & s), e.id = t.int(), 256 & s && (e.fromId = t.int()), e.toId = bd(t), 8 & s && (e.replyToMsgId = t.int()), e.date = t.int(), e.action = Nd(t), e
        }, ae = () => ({$: ae}), oe = t => {
            const e = {$: oe}, s = t.int();
            return 1 & s && (e.photo = Dd(t)), 4 & s && (e.ttlSeconds = t.int()), e
        }, ce = t => {
            const e = {$: ce};
            return e.geo = Ud(t), e
        }, he = t => {
            const e = {$: he};
            return e.phoneNumber = t.string(), e.firstName = t.string(), e.lastName = t.string(), e.vcard = t.string(), e.userId = t.int(), e
        }, le = () => ({$: le}), ue = () => ({$: ue}), de = t => {
            const e = {$: de};
            return e.title = t.string(), e.users = t.vectorInt(), e
        }, pe = t => {
            const e = {$: pe};
            return e.title = t.string(), e
        }, ge = t => {
            const e = {$: ge};
            return e.photo = Dd(t), e
        }, me = () => ({$: me}), fe = t => {
            const e = {$: fe};
            return e.users = t.vectorInt(), e
        }, we = t => {
            const e = {$: we};
            return e.userId = t.int(), e
        }, $e = t => {
            const e = {$: $e}, s = t.int();
            return e.isPinned = !!(4 & s), e.isUnreadMark = !!(8 & s), e.peer = bd(t), e.topMessage = t.int(), e.readInboxMaxId = t.int(), e.readOutboxMaxId = t.int(), e.unreadCount = t.int(), e.unreadMentionsCount = t.int(), e.notifySettings = Rd(t), 1 & s && (e.pts = t.int()), 2 & s && (e.draft = Ap(t)), 16 & s && (e.folderId = t.int()), e
        }, ye = t => {
            const e = {$: ye};
            return e.id = t.long(), e
        }, be = t => {
            const e = {$: be}, s = t.int();
            return e.isHasStickers = !!(1 & s), e.id = t.long(), e.accessHash = t.long(), e.fileReference = t.bytes(), e.date = t.int(), e.sizes = t.vector(Td), e.dcId = t.int(), e
        }, Ie = t => {
            const e = {$: Ie};
            return e.type = t.string(), e
        }, ve = t => {
            const e = {$: ve};
            return e.type = t.string(), e.location = Tg(t), e.w = t.int(), e.h = t.int(), e.size = t.int(), e
        }, Ee = t => {
            const e = {$: Ee};
            return e.type = t.string(), e.location = Tg(t), e.w = t.int(), e.h = t.int(), e.bytes = t.bytes(), e
        }, Ce = () => ({$: Ce}), ke = t => {
            const e = {$: ke};
            return e.long = t.double(), e.lat = t.double(), e.accessHash = t.long(), e
        }, Me = t => {
            const e = {$: Me}, s = t.int();
            return e.type = Cp(t), e.phoneCodeHash = t.string(), 2 & s && (e.nextType = Ep(t)), 4 & s && (e.timeout = t.int()), e
        }, Se = t => {
            const e = {$: Se};
            return 1 & t.int() && (e.tmpSessions = t.int()), e.user = vd(t), e
        }, xe = t => {
            const e = {$: xe};
            return e.id = t.int(), e.bytes = t.bytes(), e
        }, Pe = t => {
            const e = {$: Pe}, s = t.int();
            return 1 & s && (e.showPreviews = wd(t)), 2 & s && (e.silent = wd(t)), 4 & s && (e.muteUntil = t.int()), 8 & s && (e.sound = t.string()), e
        }, Ae = t => {
            const e = {$: Ae}, s = t.int();
            return e.isReportSpam = !!(1 & s), e.isAddContact = !!(2 & s), e.isBlockContact = !!(4 & s), e.isShareContact = !!(8 & s), e.isNeedContactsException = !!(16 & s), e.isReportGeo = !!(32 & s), e
        }, Le = t => {
            const e = {$: Le};
            e.id = t.long();
            const s = t.int();
            return e.isCreator = !!(1 & s), e.isDefault = !!(2 & s), e.isPattern = !!(8 & s), e.isDark = !!(16 & s), e.accessHash = t.long(), e.slug = t.string(), e.document = Qd(t), 4 & s && (e.settings = Ng(t)), e
        }, Ne = t => {
            const e = {$: Ne}, s = t.int();
            return e.isBlocked = !!(1 & s), e.isPhoneCallsAvailable = !!(16 & s), e.isPhoneCallsPrivate = !!(32 & s), e.isCanPinMessage = !!(128 & s), e.isHasScheduled = !!(4096 & s), e.user = vd(t), 2 & s && (e.about = t.string()), e.settings = Bd(t), 4 & s && (e.profilePhoto = Dd(t)), e.notifySettings = Rd(t), 8 & s && (e.botInfo = up(t)), 64 & s && (e.pinnedMsgId = t.int()), e.commonChatsCount = t.int(), 2048 & s && (e.folderId = t.int()), e
        }, je = t => {
            const e = {$: je};
            return e.userId = t.int(), e.mutual = wd(t), e
        }, De = t => {
            const e = {$: De};
            return e.userId = t.int(), e.clientId = t.long(), e
        }, Te = t => {
            const e = {$: Te};
            return e.userId = t.int(), e.date = t.int(), e
        }, Ue = () => ({$: Ue}), Re = t => {
            const e = {$: Re};
            return e.contacts = t.vector(_d), e.savedCount = t.int(), e.users = t.vector(vd), e
        }, Be = t => {
            const e = {$: Be};
            return e.imported = t.vector(Od), e.popularInvites = t.vector(eg), e.retryContacts = t.vectorLong(), e.users = t.vector(vd), e
        }, He = t => {
            const e = {$: He};
            return e.blocked = t.vector(Fd), e.users = t.vector(vd), e
        }, _e = t => {
            const e = {$: _e};
            return e.count = t.int(), e.blocked = t.vector(Fd), e.users = t.vector(vd), e
        }, Oe = t => {
            const e = {$: Oe};
            return e.dialogs = t.vector(jd), e.messages = t.vector(Ad), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, Fe = t => {
            const e = {$: Fe};
            return e.count = t.int(), e.dialogs = t.vector(jd), e.messages = t.vector(Ad), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, Ve = t => {
            const e = {$: Ve};
            return e.messages = t.vector(Ad), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, qe = t => {
            const e = {$: qe}, s = t.int();
            return e.isInexact = !!(2 & s), e.count = t.int(), 1 & s && (e.nextRate = t.int()), e.messages = t.vector(Ad), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, Ke = t => {
            const e = {$: Ke};
            return e.chats = t.vector(kd), e
        }, Ge = t => {
            const e = {$: Ge};
            return e.fullChat = Md(t), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, ze = t => {
            const e = {$: ze};
            return e.pts = t.int(), e.ptsCount = t.int(), e.offset = t.int(), e
        }, We = t => {
            const e = {$: We};
            return e.message = Ad(t), e.pts = t.int(), e.ptsCount = t.int(), e
        }, Ye = t => {
            const e = {$: Ye};
            return e.id = t.int(), e.randomId = t.long(), e
        }, Qe = t => {
            const e = {$: Qe};
            return e.messages = t.vectorInt(), e.pts = t.int(), e.ptsCount = t.int(), e
        }, Je = t => {
            const e = {$: Je};
            return e.userId = t.int(), e.action = Zd(t), e
        }, Ze = t => {
            const e = {$: Ze};
            return e.chatId = t.int(), e.userId = t.int(), e.action = Zd(t), e
        }, Xe = t => {
            const e = {$: Xe};
            return e.participants = xd(t), e
        }, ts = t => {
            const e = {$: ts};
            return e.userId = t.int(), e.status = Cd(t), e
        }, es = t => {
            const e = {$: es};
            return e.userId = t.int(), e.firstName = t.string(), e.lastName = t.string(), e.username = t.string(), e
        }, ss = t => {
            const e = {$: ss};
            return e.userId = t.int(), e.date = t.int(), e.photo = Ed(t), e.previous = wd(t), e
        }, ns = t => {
            const e = {$: ns};
            return e.pts = t.int(), e.qts = t.int(), e.date = t.int(), e.seq = t.int(), e.unreadCount = t.int(), e
        }, is = t => {
            const e = {$: is};
            return e.date = t.int(), e.seq = t.int(), e
        }, rs = t => {
            const e = {$: rs};
            return e.newMessages = t.vector(Ad), e.newEncryptedMessages = t.vector(Yd), e.otherUpdates = t.vector(Vd), e.chats = t.vector(kd), e.users = t.vector(vd), e.state = qd(t), e
        }, as = t => {
            const e = {$: as};
            return e.newMessages = t.vector(Ad), e.newEncryptedMessages = t.vector(Yd), e.otherUpdates = t.vector(Vd), e.chats = t.vector(kd), e.users = t.vector(vd), e.intermediateState = qd(t), e
        }, os = () => ({$: os}), cs = t => {
            const e = {$: cs}, s = t.int();
            return e.isOut = !!(2 & s), e.isMentioned = !!(16 & s), e.isMediaUnread = !!(32 & s), e.isSilent = !!(8192 & s), e.id = t.int(), e.userId = t.int(), e.message = t.string(), e.pts = t.int(), e.ptsCount = t.int(), e.date = t.int(), 4 & s && (e.fwdFrom = vp(t)), 2048 & s && (e.viaBotId = t.int()), 8 & s && (e.replyToMsgId = t.int()), 128 & s && (e.entities = t.vector(mp)), e
        }, hs = t => {
            const e = {$: hs}, s = t.int();
            return e.isOut = !!(2 & s), e.isMentioned = !!(16 & s), e.isMediaUnread = !!(32 & s), e.isSilent = !!(8192 & s), e.id = t.int(), e.fromId = t.int(), e.chatId = t.int(), e.message = t.string(), e.pts = t.int(), e.ptsCount = t.int(), e.date = t.int(), 4 & s && (e.fwdFrom = vp(t)), 2048 & s && (e.viaBotId = t.int()), 8 & s && (e.replyToMsgId = t.int()), 128 & s && (e.entities = t.vector(mp)), e
        }, ls = t => {
            const e = {$: ls};
            return e.update = Vd(t), e.date = t.int(), e
        }, us = t => {
            const e = {$: us};
            return e.updates = t.vector(Vd), e.users = t.vector(vd), e.chats = t.vector(kd), e.date = t.int(), e.seqStart = t.int(), e.seq = t.int(), e
        }, ds = t => {
            const e = {$: ds};
            return e.updates = t.vector(Vd), e.users = t.vector(vd), e.chats = t.vector(kd), e.date = t.int(), e.seq = t.int(), e
        }, ps = t => {
            const e = {$: ps};
            return e.photos = t.vector(Dd), e.users = t.vector(vd), e
        }, gs = t => {
            const e = {$: gs};
            return e.count = t.int(), e.photos = t.vector(Dd), e.users = t.vector(vd), e
        }, ms = t => {
            const e = {$: ms};
            return e.photo = Dd(t), e.users = t.vector(vd), e
        }, fs = t => {
            const e = {$: fs};
            return e.type = Id(t), e.mtime = t.int(), e.bytes = t.bytes(), e
        }, ws = t => {
            const e = {$: ws}, s = t.int();
            return e.isIpv6 = !!(1 & s), e.isMediaOnly = !!(2 & s), e.isTcpoOnly = !!(4 & s), e.isCdn = !!(8 & s), e.isStatic = !!(16 & s), e.id = t.int(), e.ipAddress = t.string(), e.port = t.int(), 1024 & s && (e.secret = t.bytes()), e
        }, $s = t => {
            const e = {$: $s}, s = t.int();
            return e.isPhonecallsEnabled = !!(2 & s), e.isDefaultP2pContacts = !!(8 & s), e.isPreloadFeaturedStickers = !!(16 & s), e.isIgnorePhoneEntities = !!(32 & s), e.isRevokePmInbox = !!(64 & s), e.isBlockedMode = !!(256 & s), e.isPfsEnabled = !!(8192 & s), e.date = t.int(), e.expires = t.int(), e.testMode = wd(t), e.thisDc = t.int(), e.dcOptions = t.vector(Gd), e.dcTxtDomainName = t.string(), e.chatSizeMax = t.int(), e.megagroupSizeMax = t.int(), e.forwardedCountMax = t.int(), e.onlineUpdatePeriodMs = t.int(), e.offlineBlurTimeoutMs = t.int(), e.offlineIdleTimeoutMs = t.int(), e.onlineCloudTimeoutMs = t.int(), e.notifyCloudDelayMs = t.int(), e.notifyDefaultDelayMs = t.int(), e.pushChatPeriodMs = t.int(), e.pushChatLimit = t.int(), e.savedGifsLimit = t.int(), e.editTimeLimit = t.int(), e.revokeTimeLimit = t.int(), e.revokePmTimeLimit = t.int(), e.ratingEDecay = t.int(), e.stickersRecentLimit = t.int(), e.stickersFavedLimit = t.int(), e.channelsReadMediaPeriod = t.int(), 1 & s && (e.tmpSessions = t.int()), e.pinnedDialogsCountMax = t.int(), e.pinnedInfolderCountMax = t.int(), e.callReceiveTimeoutMs = t.int(), e.callRingTimeoutMs = t.int(), e.callConnectTimeoutMs = t.int(), e.callPacketTimeoutMs = t.int(), e.meUrlPrefix = t.string(), 128 & s && (e.autoupdateUrlPrefix = t.string()), 512 & s && (e.gifSearchUsername = t.string()), 1024 & s && (e.venueSearchUsername = t.string()), 2048 & s && (e.imgSearchUsername = t.string()), 4096 & s && (e.staticMapsProvider = t.string()), e.captionLengthMax = t.int(), e.messageLengthMax = t.int(), e.webfileDcId = t.int(), 4 & s && (e.suggestedLangCode = t.string()), 4 & s && (e.langPackVersion = t.int()), 4 & s && (e.baseLangPackVersion = t.int()), e
        }, ys = t => {
            const e = {$: ys};
            return e.country = t.string(), e.thisDc = t.int(), e.nearestDc = t.int(), e
        }, bs = t => {
            const e = {$: bs}, s = t.int();
            return e.isCanNotSkip = !!(1 & s), e.id = t.int(), e.version = t.string(), e.text = t.string(), e.entities = t.vector(mp), 2 & s && (e.document = Qd(t)), 4 & s && (e.url = t.string()), e
        }, Is = () => ({$: Is}), vs = t => {
            const e = {$: vs};
            return e.message = t.string(), e
        }, Es = t => {
            const e = {$: Es};
            return e.message = Yd(t), e.qts = t.int(), e
        }, Cs = t => {
            const e = {$: Cs};
            return e.chatId = t.int(), e
        }, ks = t => {
            const e = {$: ks};
            return e.chat = zd(t), e.date = t.int(), e
        }, Ms = t => {
            const e = {$: Ms};
            return e.chatId = t.int(), e.maxDate = t.int(), e.date = t.int(), e
        }, Ss = t => {
            const e = {$: Ss};
            return e.id = t.int(), e
        }, xs = t => {
            const e = {$: xs};
            return e.id = t.int(), e.accessHash = t.long(), e.date = t.int(), e.adminId = t.int(), e.participantId = t.int(), e
        }, Ps = t => {
            const e = {$: Ps};
            return e.id = t.int(), e.accessHash = t.long(), e.date = t.int(), e.adminId = t.int(), e.participantId = t.int(), e.gA = t.bytes(), e
        }, As = t => {
            const e = {$: As};
            return e.id = t.int(), e.accessHash = t.long(), e.date = t.int(), e.adminId = t.int(), e.participantId = t.int(), e.gAOrB = t.bytes(), e.keyFingerprint = t.long(), e
        }, Ls = t => {
            const e = {$: Ls};
            return e.id = t.int(), e
        }, Ns = () => ({$: Ns}), js = t => {
            const e = {$: js};
            return e.id = t.long(), e.accessHash = t.long(), e.size = t.int(), e.dcId = t.int(), e.keyFingerprint = t.int(), e
        }, Ds = t => {
            const e = {$: Ds};
            return e.randomId = t.long(), e.chatId = t.int(), e.date = t.int(), e.bytes = t.bytes(), e.file = Wd(t), e
        }, Ts = t => {
            const e = {$: Ts};
            return e.randomId = t.long(), e.chatId = t.int(), e.date = t.int(), e.bytes = t.bytes(), e
        }, Us = t => {
            const e = {$: Us};
            return e.random = t.bytes(), e
        }, Rs = t => {
            const e = {$: Rs};
            return e.g = t.int(), e.p = t.bytes(), e.version = t.int(), e.random = t.bytes(), e
        }, Bs = t => {
            const e = {$: Bs};
            return e.date = t.int(), e
        }, Hs = t => {
            const e = {$: Hs};
            return e.date = t.int(), e.file = Wd(t), e
        }, _s = t => {
            const e = {$: _s};
            return e.chatId = t.int(), e.userId = t.int(), e.inviterId = t.int(), e.date = t.int(), e.version = t.int(), e
        }, Os = t => {
            const e = {$: Os};
            return e.chatId = t.int(), e.userId = t.int(), e.version = t.int(), e
        }, Fs = t => {
            const e = {$: Fs};
            return e.dcOptions = t.vector(Gd), e
        }, Vs = t => {
            const e = {$: Vs}, s = t.int();
            return 1 & s && (e.document = Qd(t)), 4 & s && (e.ttlSeconds = t.int()), e
        }, qs = t => {
            const e = {$: qs};
            return e.id = t.long(), e
        }, Ks = t => {
            const e = {$: Ks}, s = t.int();
            return e.id = t.long(), e.accessHash = t.long(), e.fileReference = t.bytes(), e.date = t.int(), e.mimeType = t.string(), e.size = t.int(), 1 & s && (e.thumbs = t.vector(Td)), e.dcId = t.int(), e.attributes = t.vector(ep), e
        }, Gs = t => {
            const e = {$: Gs};
            return e.phoneNumber = t.string(), e.user = vd(t), e
        }, zs = t => {
            const e = {$: zs};
            return e.peer = bd(t), e
        }, Ws = () => ({$: Ws}), Ys = () => ({$: Ys}), Qs = t => {
            const e = {$: Qs};
            return e.userId = t.int(), e.blocked = wd(t), e
        }, Js = t => {
            const e = {$: Js};
            return e.peer = Jd(t), e.notifySettings = Rd(t), e
        }, Zs = () => ({$: Zs}), Xs = () => ({$: Xs}), tn = () => ({$: tn}), en = t => {
            const e = {$: en};
            return e.progress = t.int(), e
        }, sn = () => ({$: sn}), nn = t => {
            const e = {$: nn};
            return e.progress = t.int(), e
        }, rn = t => {
            const e = {$: rn};
            return e.progress = t.int(), e
        }, an = t => {
            const e = {$: an};
            return e.progress = t.int(), e
        }, on = () => ({$: on}), cn = () => ({$: cn}), hn = t => {
            const e = {$: hn};
            return e.myResults = t.vector(bd), e.results = t.vector(bd), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, ln = t => {
            const e = {$: ln}, s = t.int();
            return e.isPopup = !!(1 & s), 2 & s && (e.inboxDate = t.int()), e.type = t.string(), e.message = t.string(), e.media = Ld(t), e.entities = t.vector(mp), e
        }, un = () => ({$: un}), dn = () => ({$: dn}), pn = () => ({$: pn}), gn = t => {
            const e = {$: gn};
            return e.key = Xd(t), e.rules = t.vector(tp), e
        }, mn = () => ({$: mn}), fn = () => ({$: fn}), wn = () => ({$: wn}), $n = t => {
            const e = {$: $n};
            return e.users = t.vectorInt(), e
        }, yn = () => ({$: yn}), bn = () => ({$: bn}), In = t => {
            const e = {$: In};
            return e.users = t.vectorInt(), e
        }, vn = t => {
            const e = {$: vn};
            return e.rules = t.vector(tp), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, En = t => {
            const e = {$: En};
            return e.days = t.int(), e
        }, Cn = t => {
            const e = {$: Cn};
            return e.userId = t.int(), e.phone = t.string(), e
        }, kn = t => {
            const e = {$: kn};
            return e.w = t.int(), e.h = t.int(), e
        }, Mn = () => ({$: Mn}), Sn = t => {
            const e = {$: Sn}, s = t.int();
            return e.isMask = !!(2 & s), e.alt = t.string(), e.stickerset = op(t), 1 & s && (e.maskCoords = Np(t)), e
        }, xn = t => {
            const e = {$: xn}, s = t.int();
            return e.isRoundMessage = !!(1 & s), e.isSupportsStreaming = !!(2 & s), e.duration = t.int(), e.w = t.int(), e.h = t.int(), e
        }, Pn = t => {
            const e = {$: Pn}, s = t.int();
            return e.isVoice = !!(1024 & s), e.duration = t.int(), 1 & s && (e.title = t.string()), 2 & s && (e.performer = t.string()), 4 & s && (e.waveform = t.bytes()), e
        }, An = t => {
            const e = {$: An};
            return e.fileName = t.string(), e
        }, Ln = () => ({$: Ln}), Nn = t => {
            const e = {$: Nn};
            return e.hash = t.int(), e.stickers = t.vector(Qd), e
        }, jn = t => {
            const e = {$: jn};
            return e.emoticon = t.string(), e.documents = t.vectorLong(), e
        }, Dn = () => ({$: Dn}), Tn = t => {
            const e = {$: Tn};
            return e.hash = t.int(), e.sets = t.vector(cp), e
        }, Un = t => {
            const e = {$: Un};
            return 1 & t.int() && (e.folderId = t.int()), e.peer = bd(t), e.maxId = t.int(), e.stillUnreadCount = t.int(), e.pts = t.int(), e.ptsCount = t.int(), e
        }, Rn = t => {
            const e = {$: Rn};
            return e.peer = bd(t), e.maxId = t.int(), e.pts = t.int(), e.ptsCount = t.int(), e
        }, Bn = t => {
            const e = {$: Bn};
            return e.pts = t.int(), e.ptsCount = t.int(), e
        }, Hn = t => {
            const e = {$: Hn};
            return e.webpage = np(t), e.pts = t.int(), e.ptsCount = t.int(), e
        }, _n = t => {
            const e = {$: _n};
            return e.id = t.long(), e
        }, On = t => {
            const e = {$: On};
            return e.id = t.long(), e.date = t.int(), e
        }, Fn = t => {
            const e = {$: Fn}, s = t.int();
            return e.id = t.long(), e.url = t.string(), e.displayUrl = t.string(), e.hash = t.int(), 1 & s && (e.type = t.string()), 2 & s && (e.siteName = t.string()), 4 & s && (e.title = t.string()), 8 & s && (e.description = t.string()), 16 & s && (e.photo = Dd(t)), 32 & s && (e.embedUrl = t.string()), 32 & s && (e.embedType = t.string()), 64 & s && (e.embedWidth = t.int()), 64 & s && (e.embedHeight = t.int()), 128 & s && (e.duration = t.int()), 256 & s && (e.author = t.string()), 512 & s && (e.document = Qd(t)), 2048 & s && (e.documents = t.vector(Qd)), 1024 & s && (e.cachedPage = kg(t)), e
        }, Vn = t => {
            const e = {$: Vn};
            return e.webpage = np(t), e
        }, qn = t => {
            const e = {$: qn}, s = t.int();
            return e.isCurrent = !!(1 & s), e.isOfficialApp = !!(2 & s), e.isPasswordPending = !!(4 & s), e.hash = t.long(), e.deviceModel = t.string(), e.platform = t.string(), e.systemVersion = t.string(), e.apiId = t.int(), e.appName = t.string(), e.appVersion = t.string(), e.dateCreated = t.int(), e.dateActive = t.int(), e.ip = t.string(), e.country = t.string(), e.region = t.string(), e
        }, Kn = t => {
            const e = {$: Kn};
            return e.authorizations = t.vector(ip), e
        }, Gn = t => {
            const e = {$: Gn}, s = t.int();
            return e.isHasRecovery = !!(1 & s), e.isHasSecureValues = !!(2 & s), e.isHasPassword = !!(4 & s), 4 & s && (e.currentAlgo = pg(t)), 4 & s && (e.srpB = t.bytes()), 4 & s && (e.srpId = t.long()), 8 & s && (e.hint = t.string()), 16 & s && (e.emailUnconfirmedPattern = t.string()), e.newAlgo = pg(t), e.newSecureAlgo = gg(t), e.secureRandom = t.bytes(), e
        }, zn = t => {
            const e = {$: zn}, s = t.int();
            return 1 & s && (e.email = t.string()), 2 & s && (e.secureSettings = mg(t)), e
        }, Wn = t => {
            const e = {$: Wn};
            return e.emailPattern = t.string(), e
        }, Yn = t => {
            const e = {$: Yn};
            return e.geo = Ud(t), e.title = t.string(), e.address = t.string(), e.provider = t.string(), e.venueId = t.string(), e.venueType = t.string(), e
        }, Qn = () => ({$: Qn}), Jn = t => {
            const e = {$: Jn};
            return e.link = t.string(), e
        }, Zn = t => {
            const e = {$: Zn};
            return e.chat = kd(t), e
        }, Xn = t => {
            const e = {$: Xn}, s = t.int();
            return e.isChannel = !!(1 & s), e.isBroadcast = !!(2 & s), e.isPublic = !!(4 & s), e.isMegagroup = !!(8 & s), e.title = t.string(), e.photo = Dd(t), e.participantsCount = t.int(), 16 & s && (e.participants = t.vector(vd)), e
        }, ti = t => {
            const e = {$: ti};
            return e.inviterId = t.int(), e
        }, ei = t => {
            const e = {$: ei};
            return e.messages = t.vectorInt(), e.pts = t.int(), e.ptsCount = t.int(), e
        }, si = () => ({$: si}), ni = t => {
            const e = {$: ni};
            return e.id = t.long(), e.accessHash = t.long(), e
        }, ii = t => {
            const e = {$: ii};
            return e.shortName = t.string(), e
        }, ri = t => {
            const e = {$: ri}, s = t.int();
            return e.isArchived = !!(2 & s), e.isOfficial = !!(4 & s), e.isMasks = !!(8 & s), e.isAnimated = !!(32 & s), 1 & s && (e.installedDate = t.int()), e.id = t.long(), e.accessHash = t.long(), e.title = t.string(), e.shortName = t.string(), 16 & s && (e.thumb = Td(t)), 16 & s && (e.thumbDcId = t.int()), e.count = t.int(), e.hash = t.int(), e
        }, ai = t => {
            const e = {$: ai};
            return e.set = cp(t), e.packs = t.vector(sp), e.documents = t.vector(Qd), e
        }, oi = t => {
            const e = {$: oi}, s = t.int();
            return e.isSelf = !!(1024 & s), e.isContact = !!(2048 & s), e.isMutualContact = !!(4096 & s), e.isDeleted = !!(8192 & s), e.isBot = !!(16384 & s), e.isBotChatHistory = !!(32768 & s), e.isBotNochats = !!(65536 & s), e.isVerified = !!(131072 & s), e.isRestricted = !!(262144 & s), e.isMin = !!(1048576 & s), e.isBotInlineGeo = !!(2097152 & s), e.isSupport = !!(8388608 & s), e.isScam = !!(16777216 & s), e.id = t.int(), 1 & s && (e.accessHash = t.long()), 2 & s && (e.firstName = t.string()), 4 & s && (e.lastName = t.string()), 8 & s && (e.username = t.string()), 16 & s && (e.phone = t.string()), 32 & s && (e.photo = Ed(t)), 64 & s && (e.status = Cd(t)), 16384 & s && (e.botInfoVersion = t.int()), 262144 & s && (e.restrictionReason = t.vector(_g)), 524288 & s && (e.botInlinePlaceholder = t.string()), 4194304 & s && (e.langCode = t.string()), e
        }, ci = t => {
            const e = {$: ci};
            return e.command = t.string(), e.description = t.string(), e
        }, hi = t => {
            const e = {$: hi};
            return e.userId = t.int(), e.description = t.string(), e.commands = t.vector(lp), e
        }, li = t => {
            const e = {$: li};
            return e.text = t.string(), e
        }, ui = t => {
            const e = {$: ui};
            return e.buttons = t.vector(dp), e
        }, di = t => {
            const e = {$: di}, s = t.int();
            return e.isSelective = !!(4 & s), e
        }, pi = t => {
            const e = {$: pi}, s = t.int();
            return e.isSingleUse = !!(2 & s), e.isSelective = !!(4 & s), e
        }, gi = t => {
            const e = {$: gi}, s = t.int();
            return e.isResize = !!(1 & s), e.isSingleUse = !!(2 & s), e.isSelective = !!(4 & s), e.rows = t.vector(pp), e
        }, mi = t => {
            const e = {$: mi};
            return e.userId = t.int(), e.accessHash = t.long(), e
        }, fi = t => {
            const e = {$: fi};
            return e.userId = t.int(), e.accessHash = t.long(), e
        }, wi = t => {
            const e = {$: wi};
            return e.offset = t.int(), e.length = t.int(), e
        }, $i = t => {
            const e = {$: $i};
            return e.offset = t.int(), e.length = t.int(), e
        }, yi = t => {
            const e = {$: yi};
            return e.offset = t.int(), e.length = t.int(), e
        }, bi = t => {
            const e = {$: bi};
            return e.offset = t.int(), e.length = t.int(), e
        }, Ii = t => {
            const e = {$: Ii};
            return e.offset = t.int(), e.length = t.int(), e
        }, vi = t => {
            const e = {$: vi};
            return e.offset = t.int(), e.length = t.int(), e
        }, Ei = t => {
            const e = {$: Ei};
            return e.offset = t.int(), e.length = t.int(), e
        }, Ci = t => {
            const e = {$: Ci};
            return e.offset = t.int(), e.length = t.int(), e
        }, ki = t => {
            const e = {$: ki};
            return e.offset = t.int(), e.length = t.int(), e
        }, Mi = t => {
            const e = {$: Mi};
            return e.offset = t.int(), e.length = t.int(), e.language = t.string(), e
        }, Si = t => {
            const e = {$: Si};
            return e.offset = t.int(), e.length = t.int(), e.url = t.string(), e
        }, xi = t => {
            const e = {$: xi}, s = t.int();
            return e.isOut = !!(2 & s), e.id = t.int(), e.pts = t.int(), e.ptsCount = t.int(), e.date = t.int(), 512 & s && (e.media = Ld(t)), 128 & s && (e.entities = t.vector(mp)), e
        }, Pi = () => ({$: Pi}), Ai = t => {
            const e = {$: Ai};
            return e.channelId = t.int(), e.accessHash = t.long(), e
        }, Li = t => {
            const e = {$: Li};
            return e.channelId = t.int(), e
        }, Ni = t => {
            const e = {$: Ni};
            return e.channelId = t.int(), e.accessHash = t.long(), e
        }, ji = t => {
            const e = {$: ji}, s = t.int();
            return e.isCreator = !!(1 & s), e.isLeft = !!(4 & s), e.isBroadcast = !!(32 & s), e.isVerified = !!(128 & s), e.isMegagroup = !!(256 & s), e.isRestricted = !!(512 & s), e.isSignatures = !!(2048 & s), e.isMin = !!(4096 & s), e.isScam = !!(524288 & s), e.isHasLink = !!(1048576 & s), e.isHasGeo = !!(2097152 & s), e.isSlowmodeEnabled = !!(4194304 & s), e.id = t.int(), 8192 & s && (e.accessHash = t.long()), e.title = t.string(), 64 & s && (e.username = t.string()), e.photo = Pd(t), e.date = t.int(), e.version = t.int(), 512 & s && (e.restrictionReason = t.vector(_g)), 16384 & s && (e.adminRights = Ag(t)), 32768 & s && (e.bannedRights = Lg(t)), 262144 & s && (e.defaultBannedRights = Lg(t)), 131072 & s && (e.participantsCount = t.int()), e
        }, Di = t => {
            const e = {$: Di}, s = t.int();
            return e.isBroadcast = !!(32 & s), e.isMegagroup = !!(256 & s), e.id = t.int(), e.accessHash = t.long(), e.title = t.string(), 65536 & s && (e.untilDate = t.int()), e
        }, Ti = t => {
            const e = {$: Ti};
            return e.peer = bd(t), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, Ui = t => {
            const e = {$: Ui}, s = t.int();
            return e.isCanViewParticipants = !!(8 & s), e.isCanSetUsername = !!(64 & s), e.isCanSetStickers = !!(128 & s), e.isHiddenPrehistory = !!(1024 & s), e.isCanViewStats = !!(4096 & s), e.isCanSetLocation = !!(65536 & s), e.isHasScheduled = !!(524288 & s), e.id = t.int(), e.about = t.string(), 1 & s && (e.participantsCount = t.int()), 2 & s && (e.adminsCount = t.int()), 4 & s && (e.kickedCount = t.int()), 4 & s && (e.bannedCount = t.int()), 8192 & s && (e.onlineCount = t.int()), e.readInboxMaxId = t.int(), e.readOutboxMaxId = t.int(), e.unreadCount = t.int(), e.chatPhoto = Dd(t), e.notifySettings = Rd(t), e.exportedInvite = rp(t), e.botInfo = t.vector(up), 16 & s && (e.migratedFromChatId = t.int()), 16 & s && (e.migratedFromMaxId = t.int()), 32 & s && (e.pinnedMsgId = t.int()), 256 & s && (e.stickerset = cp(t)), 512 & s && (e.availableMinId = t.int()), 2048 & s && (e.folderId = t.int()), 16384 & s && (e.linkedChatId = t.int()), 32768 & s && (e.location = Bg(t)), 131072 & s && (e.slowmodeSeconds = t.int()), 262144 & s && (e.slowmodeNextSendDate = t.int()), e.pts = t.int(), e
        }, Ri = t => {
            const e = {$: Ri}, s = t.int();
            return e.isInexact = !!(2 & s), e.pts = t.int(), e.count = t.int(), e.messages = t.vector(Ad), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, Bi = t => {
            const e = {$: Bi};
            return e.title = t.string(), e
        }, Hi = t => {
            const e = {$: Hi}, s = t.int();
            return e.channelId = t.int(), 1 & s && (e.pts = t.int()), e
        }, _i = t => {
            const e = {$: _i};
            return e.channelId = t.int(), e
        }, Oi = t => {
            const e = {$: Oi};
            return e.message = Ad(t), e.pts = t.int(), e.ptsCount = t.int(), e
        }, Fi = t => {
            const e = {$: Fi};
            return 1 & t.int() && (e.folderId = t.int()), e.channelId = t.int(), e.maxId = t.int(), e.stillUnreadCount = t.int(), e.pts = t.int(), e
        }, Vi = t => {
            const e = {$: Vi};
            return e.channelId = t.int(), e.messages = t.vectorInt(), e.pts = t.int(), e.ptsCount = t.int(), e
        }, qi = t => {
            const e = {$: qi};
            return e.channelId = t.int(), e.id = t.int(), e.views = t.int(), e
        }, Ki = t => {
            const e = {$: Ki}, s = t.int();
            return e.isFinal = !!(1 & s), e.pts = t.int(), 2 & s && (e.timeout = t.int()), e
        }, Gi = t => {
            const e = {$: Gi}, s = t.int();
            return e.isFinal = !!(1 & s), 2 & s && (e.timeout = t.int()), e.dialog = jd(t), e.messages = t.vector(Ad), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, zi = t => {
            const e = {$: zi}, s = t.int();
            return e.isFinal = !!(1 & s), e.pts = t.int(), 2 & s && (e.timeout = t.int()), e.newMessages = t.vector(Ad), e.otherUpdates = t.vector(Vd), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, Wi = t => {
            const e = {$: Wi};
            return e.userId = t.int(), e.date = t.int(), e
        }, Yi = t => {
            const e = {$: Yi};
            return e.userId = t.int(), e.inviterId = t.int(), e.date = t.int(), e
        }, Qi = t => {
            const e = {$: Qi}, s = t.int();
            return e.userId = t.int(), 1 & s && (e.rank = t.string()), e
        }, Ji = t => {
            const e = {$: Ji};
            return e.count = t.int(), e.participants = t.vector(wp), e.users = t.vector(vd), e
        }, Zi = t => {
            const e = {$: Zi};
            return e.participant = wp(t), e.users = t.vector(vd), e
        }, Xi = t => {
            const e = {$: Xi};
            return e.userId = t.int(), e
        }, tr = t => {
            const e = {$: tr};
            return e.userId = t.int(), e.inviterId = t.int(), e.date = t.int(), e
        }, er = t => {
            const e = {$: er};
            return e.chatId = t.int(), e.userId = t.int(), e.isAdmin = wd(t), e.version = t.int(), e
        }, sr = t => {
            const e = {$: sr};
            return e.channelId = t.int(), e
        }, nr = t => {
            const e = {$: nr};
            return e.title = t.string(), e.chatId = t.int(), e
        }, ir = t => {
            const e = {$: ir}, s = t.int();
            return e.isPopup = !!(1 & s), e.id = Bp(t), e.text = t.string(), e.entities = t.vector(mp), 2 & s && (e.minAgeConfirm = t.int()), e
        }, rr = t => {
            const e = {$: rr};
            return e.stickerset = hp(t), e
        }, ar = t => {
            const e = {$: ar}, s = t.int();
            return e.isMasks = !!(1 & s), e.order = t.vectorLong(), e
        }, or = () => ({$: or}), cr = t => {
            const e = {$: cr};
            return e.url = t.string(), e.thumbUrl = t.string(), e.contentUrl = t.string(), e.contentType = t.string(), e.w = t.int(), e.h = t.int(), e
        }, hr = t => {
            const e = {$: hr};
            return e.url = t.string(), e.photo = Dd(t), e.document = Qd(t), e
        }, lr = t => {
            const e = {$: lr};
            return e.nextOffset = t.int(), e.results = t.vector(yp), e
        }, ur = () => ({$: ur}), dr = t => {
            const e = {$: dr};
            return e.hash = t.int(), e.gifs = t.vector(Qd), e
        }, pr = () => ({$: pr}), gr = t => {
            const e = {$: gr}, s = t.int();
            return e.message = t.string(), 2 & s && (e.entities = t.vector(mp)), 4 & s && (e.replyMarkup = gp(t)), e
        }, mr = t => {
            const e = {$: mr}, s = t.int();
            return e.isNoWebpage = !!(1 & s), e.message = t.string(), 2 & s && (e.entities = t.vector(mp)), 4 & s && (e.replyMarkup = gp(t)), e
        }, fr = t => {
            const e = {$: fr}, s = t.int();
            return e.id = t.string(), e.type = t.string(), 2 & s && (e.title = t.string()), 4 & s && (e.description = t.string()), 8 & s && (e.url = t.string()), 16 & s && (e.thumb = Kp(t)), 32 & s && (e.content = Kp(t)), e.sendMessage = bp(t), e
        }, wr = t => {
            const e = {$: wr}, s = t.int();
            return e.isGallery = !!(1 & s), e.queryId = t.long(), 2 & s && (e.nextOffset = t.string()), 4 & s && (e.switchPm = Mp(t)), e.results = t.vector(Ip), e.cacheTime = t.int(), e.users = t.vector(vd), e
        }, $r = t => {
            const e = {$: $r}, s = t.int();
            return e.queryId = t.long(), e.userId = t.int(), e.query = t.string(), 1 & s && (e.geo = Ud(t)), e.offset = t.string(), e
        }, yr = t => {
            const e = {$: yr}, s = t.int();
            return e.userId = t.int(), e.query = t.string(), 1 & s && (e.geo = Ud(t)), e.id = t.string(), 2 & s && (e.msgId = kp(t)), e
        }, br = () => ({$: br}), Ir = t => {
            const e = {$: Ir};
            return e.link = t.string(), e.html = t.string(), e
        }, vr = t => {
            const e = {$: vr}, s = t.int();
            return 1 & s && (e.fromId = t.int()), 32 & s && (e.fromName = t.string()), e.date = t.int(), 2 & s && (e.channelId = t.int()), 4 & s && (e.channelPost = t.int()), 8 & s && (e.postAuthor = t.string()), 16 & s && (e.savedFromPeer = bd(t)), 16 & s && (e.savedFromMsgId = t.int()), e
        }, Er = t => {
            const e = {$: Er};
            return e.message = Ad(t), e.pts = t.int(), e.ptsCount = t.int(), e
        }, Cr = t => {
            const e = {$: Cr};
            return e.channelId = t.int(), e.id = t.int(), e
        }, kr = () => ({$: kr}), Mr = () => ({$: Mr}), Sr = () => ({$: Sr}), xr = () => ({$: xr}), Pr = t => {
            const e = {$: Pr};
            return e.length = t.int(), e
        }, Ar = t => {
            const e = {$: Ar};
            return e.length = t.int(), e
        }, Lr = t => {
            const e = {$: Lr};
            return e.length = t.int(), e
        }, Nr = t => {
            const e = {$: Nr};
            return e.pattern = t.string(), e
        }, jr = t => {
            const e = {$: jr};
            return e.text = t.string(), e.url = t.string(), e
        }, Dr = t => {
            const e = {$: Dr};
            return e.text = t.string(), e.data = t.bytes(), e
        }, Tr = t => {
            const e = {$: Tr};
            return e.text = t.string(), e
        }, Ur = t => {
            const e = {$: Ur};
            return e.text = t.string(), e
        }, Rr = t => {
            const e = {$: Rr}, s = t.int();
            return e.isSamePeer = !!(1 & s), e.text = t.string(), e.query = t.string(), e
        }, Br = t => {
            const e = {$: Br};
            return e.rows = t.vector(pp), e
        }, Hr = t => {
            const e = {$: Hr}, s = t.int();
            return e.isAlert = !!(2 & s), e.isHasUrl = !!(8 & s), e.isNativeUi = !!(16 & s), 1 & s && (e.message = t.string()), 4 & s && (e.url = t.string()), e.cacheTime = t.int(), e
        }, _r = t => {
            const e = {$: _r}, s = t.int();
            return e.queryId = t.long(), e.userId = t.int(), e.peer = bd(t), e.msgId = t.int(), e.chatInstance = t.long(), 1 & s && (e.data = t.bytes()), 2 & s && (e.gameShortName = t.string()), e
        }, Or = t => {
            const e = {$: Or}, s = t.int();
            return e.isCaption = !!(1 & s), e
        }, Fr = t => {
            const e = {$: Fr};
            return e.message = Ad(t), e.pts = t.int(), e.ptsCount = t.int(), e
        }, Vr = t => {
            const e = {$: Vr}, s = t.int();
            return e.geo = Ud(t), e.period = t.int(), 4 & s && (e.replyMarkup = gp(t)), e
        }, qr = t => {
            const e = {$: qr}, s = t.int();
            return e.geo = Ud(t), e.title = t.string(), e.address = t.string(), e.provider = t.string(), e.venueId = t.string(), e.venueType = t.string(), 4 & s && (e.replyMarkup = gp(t)), e
        }, Kr = t => {
            const e = {$: Kr}, s = t.int();
            return e.phoneNumber = t.string(), e.firstName = t.string(), e.lastName = t.string(), e.vcard = t.string(), 4 & s && (e.replyMarkup = gp(t)), e
        }, Gr = t => {
            const e = {$: Gr}, s = t.int();
            return e.id = t.string(), e.type = t.string(), 1 & s && (e.photo = Dd(t)), 2 & s && (e.document = Qd(t)), 4 & s && (e.title = t.string()), 8 & s && (e.description = t.string()), e.sendMessage = bp(t), e
        }, zr = t => {
            const e = {$: zr};
            return e.dcId = t.int(), e.id = t.long(), e.accessHash = t.long(), e
        }, Wr = t => {
            const e = {$: Wr}, s = t.int();
            return e.queryId = t.long(), e.userId = t.int(), e.msgId = kp(t), e.chatInstance = t.long(), 1 & s && (e.data = t.bytes()), 2 & s && (e.gameShortName = t.string()), e
        }, Yr = t => {
            const e = {$: Yr};
            return e.text = t.string(), e.startParam = t.string(), e
        }, Qr = t => {
            const e = {$: Qr};
            return e.dialogs = t.vector(jd), e.messages = t.vector(Ad), e.chats = t.vector(kd), e.users = t.vector(vd), e.state = qd(t), e
        }, Jr = t => {
            const e = {$: Jr};
            return e.peer = bd(t), e.rating = t.double(), e
        }, Zr = () => ({$: Zr}), Xr = () => ({$: Xr}), ta = () => ({$: ta}), ea = () => ({$: ea}), sa = () => ({$: sa}),
        na = t => {
            const e = {$: na};
            return e.category = xp(t), e.count = t.int(), e.peers = t.vector(Sp), e
        }, ia = () => ({$: ia}), ra = t => {
            const e = {$: ra};
            return e.categories = t.vector(Pp), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, aa = t => {
            const e = {$: aa};
            return e.offset = t.int(), e.length = t.int(), e.userId = t.int(), e
        }, oa = t => {
            const e = {$: oa};
            return e.offset = t.int(), e.length = t.int(), e.userId = yd(t), e
        }, ca = t => {
            const e = {$: ca};
            return e.channelId = t.int(), e.maxId = t.int(), e
        }, ha = t => {
            const e = {$: ha};
            return e.peer = bd(t), e.draft = Ap(t), e
        }, la = t => {
            const e = {$: la};
            return 1 & t.int() && (e.date = t.int()), e
        }, ua = t => {
            const e = {$: ua}, s = t.int();
            return e.isNoWebpage = !!(2 & s), 1 & s && (e.replyToMsgId = t.int()), e.message = t.string(), 8 & s && (e.entities = t.vector(mp)), e.date = t.int(), e
        }, da = () => ({$: da}), pa = () => ({$: pa}), ga = t => {
            const e = {$: ga};
            return e.hash = t.int(), e.sets = t.vector(Lp), e.unread = t.vectorLong(), e
        }, ma = () => ({$: ma}), fa = () => ({$: fa}), wa = t => {
            const e = {$: wa};
            return e.hash = t.int(), e.packs = t.vector(sp), e.stickers = t.vector(Qd), e.dates = t.vectorInt(), e
        }, $a = () => ({$: $a}), ya = t => {
            const e = {$: ya};
            return e.count = t.int(), e.sets = t.vector(Lp), e
        }, ba = () => ({$: ba}), Ia = t => {
            const e = {$: Ia};
            return e.sets = t.vector(Lp), e
        }, va = t => {
            const e = {$: va};
            return e.set = cp(t), e.cover = Qd(t), e
        }, Ea = () => ({$: Ea}), Ca = () => ({$: Ca}), ka = t => {
            const e = {$: ka};
            return e.set = cp(t), e.covers = t.vector(Qd), e
        }, Ma = t => {
            const e = {$: Ma};
            return e.n = t.int(), e.x = t.double(), e.y = t.double(), e.zoom = t.double(), e
        }, Sa = () => ({$: Sa}), xa = t => {
            const e = {$: xa}, s = t.int();
            return e.id = t.long(), e.accessHash = t.long(), e.shortName = t.string(), e.title = t.string(), e.description = t.string(), e.photo = Dd(t), 1 & s && (e.document = Qd(t)), e
        }, Pa = t => {
            const e = {$: Pa};
            return e.game = jp(t), e
        }, Aa = t => {
            const e = {$: Aa};
            return e.text = t.string(), e
        }, La = t => {
            const e = {$: La};
            return e.gameId = t.long(), e.score = t.int(), e
        }, Na = t => {
            const e = {$: Na};
            return e.pos = t.int(), e.userId = t.int(), e.score = t.int(), e
        }, ja = t => {
            const e = {$: ja};
            return e.scores = t.vector(Dp), e.users = t.vector(vd), e
        }, Da = t => {
            const e = {$: Da};
            return e.pts = t.int(), e
        }, Ta = t => {
            const e = {$: Ta};
            return e.channelId = t.int(), e.webpage = np(t), e.pts = t.int(), e.ptsCount = t.int(), e
        }, Ua = t => {
            const e = {$: Ua};
            return e.count = t.int(), e.chats = t.vector(kd), e
        }, Ra = () => ({$: Ra}), Ba = t => {
            const e = {$: Ba};
            return e.text = t.string(), e
        }, Ha = t => {
            const e = {$: Ha};
            return e.text = Tp(t), e
        }, _a = t => {
            const e = {$: _a};
            return e.text = Tp(t), e
        }, Oa = t => {
            const e = {$: Oa};
            return e.text = Tp(t), e
        }, Fa = t => {
            const e = {$: Fa};
            return e.text = Tp(t), e
        }, Va = t => {
            const e = {$: Va};
            return e.text = Tp(t), e
        }, qa = t => {
            const e = {$: qa};
            return e.text = Tp(t), e.url = t.string(), e.webpageId = t.long(), e
        }, Ka = t => {
            const e = {$: Ka};
            return e.text = Tp(t), e.email = t.string(), e
        }, Ga = t => {
            const e = {$: Ga};
            return e.texts = t.vector(Tp), e
        }, za = () => ({$: za}), Wa = t => {
            const e = {$: Wa};
            return e.text = Tp(t), e
        }, Ya = t => {
            const e = {$: Ya};
            return e.text = Tp(t), e
        }, Qa = t => {
            const e = {$: Qa};
            return e.author = Tp(t), e.publishedDate = t.int(), e
        }, Ja = t => {
            const e = {$: Ja};
            return e.text = Tp(t), e
        }, Za = t => {
            const e = {$: Za};
            return e.text = Tp(t), e
        }, Xa = t => {
            const e = {$: Xa};
            return e.text = Tp(t), e
        }, to = t => {
            const e = {$: to};
            return e.text = Tp(t), e.language = t.string(), e
        }, eo = t => {
            const e = {$: eo};
            return e.text = Tp(t), e
        }, so = () => ({$: so}), no = t => {
            const e = {$: no};
            return e.name = t.string(), e
        }, io = t => {
            const e = {$: io};
            return e.items = t.vector(vg), e
        }, ro = t => {
            const e = {$: ro};
            return e.text = Tp(t), e.caption = Tp(t), e
        }, ao = t => {
            const e = {$: ao};
            return e.text = Tp(t), e.caption = Tp(t), e
        }, oo = t => {
            const e = {$: oo}, s = t.int();
            return e.photoId = t.long(), e.caption = Ig(t), 1 & s && (e.url = t.string()), 1 & s && (e.webpageId = t.long()), e
        }, co = t => {
            const e = {$: co}, s = t.int();
            return e.isAutoplay = !!(1 & s), e.isLoop = !!(2 & s), e.videoId = t.long(), e.caption = Ig(t), e
        }, ho = t => {
            const e = {$: ho};
            return e.cover = Up(t), e
        }, lo = t => {
            const e = {$: lo}, s = t.int();
            return e.isFullWidth = !!(1 & s), e.isAllowScrolling = !!(8 & s), 2 & s && (e.url = t.string()), 4 & s && (e.html = t.string()), 16 & s && (e.posterPhotoId = t.long()), 32 & s && (e.w = t.int()), 32 & s && (e.h = t.int()), e.caption = Ig(t), e
        }, uo = t => {
            const e = {$: uo};
            return e.url = t.string(), e.webpageId = t.long(), e.authorPhotoId = t.long(), e.author = t.string(), e.date = t.int(), e.blocks = t.vector(Up), e.caption = Ig(t), e
        }, po = t => {
            const e = {$: po};
            return e.items = t.vector(Up), e.caption = Ig(t), e
        }, go = t => {
            const e = {$: go};
            return e.items = t.vector(Up), e.caption = Ig(t), e
        }, mo = () => ({$: mo}), fo = () => ({$: fo}), wo = () => ({$: wo}), $o = () => ({$: $o}), yo = () => ({$: yo}),
        bo = () => ({$: bo}), Io = () => ({$: Io}), vo = t => {
            const e = {$: vo}, s = t.int();
            return e.isPinned = !!(1 & s), 2 & s && (e.folderId = t.int()), e.peer = ig(t), e
        }, Eo = t => {
            const e = {$: Eo}, s = t.int();
            return 2 & s && (e.folderId = t.int()), 1 & s && (e.order = t.vector(ig)), e
        }, Co = t => {
            const e = {$: Co};
            return e.data = t.string(), e
        }, ko = t => {
            const e = {$: ko};
            return e.data = Bp(t), e
        }, Mo = t => {
            const e = {$: Mo};
            return e.queryId = t.long(), e.data = Bp(t), e.timeout = t.int(), e
        }, So = t => {
            const e = {$: So};
            return e.label = t.string(), e.amount = t.long(), e
        }, xo = t => {
            const e = {$: xo}, s = t.int();
            return e.isTest = !!(1 & s), e.isNameRequested = !!(2 & s), e.isPhoneRequested = !!(4 & s), e.isEmailRequested = !!(8 & s), e.isShippingAddressRequested = !!(16 & s), e.isFlexible = !!(32 & s), e.isPhoneToProvider = !!(64 & s), e.isEmailToProvider = !!(128 & s), e.currency = t.string(), e.prices = t.vector(Hp), e
        }, Po = t => {
            const e = {$: Po};
            return e.id = t.string(), e.providerChargeId = t.string(), e
        }, Ao = t => {
            const e = {$: Ao}, s = t.int();
            return e.currency = t.string(), e.totalAmount = t.long(), e.payload = t.bytes(), 1 & s && (e.info = Vp(t)), 2 & s && (e.shippingOptionId = t.string()), e.charge = Op(t), e
        }, Lo = t => {
            const e = {$: Lo}, s = t.int();
            return e.isShippingAddressRequested = !!(2 & s), e.isTest = !!(8 & s), e.title = t.string(), e.description = t.string(), 1 & s && (e.photo = Kp(t)), 4 & s && (e.receiptMsgId = t.int()), e.currency = t.string(), e.totalAmount = t.long(), e.startParam = t.string(), e
        }, No = t => {
            const e = {$: No};
            return e.streetLine1 = t.string(), e.streetLine2 = t.string(), e.city = t.string(), e.state = t.string(), e.countryIso2 = t.string(), e.postCode = t.string(), e
        }, jo = t => {
            const e = {$: jo}, s = t.int();
            return 1 & s && (e.name = t.string()), 2 & s && (e.phone = t.string()), 4 & s && (e.email = t.string()), 8 & s && (e.shippingAddress = Fp(t)), e
        }, Do = t => {
            const e = {$: Do};
            return e.text = t.string(), e
        }, To = t => {
            const e = {$: To};
            return e.currency = t.string(), e.totalAmount = t.long(), e
        }, Uo = t => {
            const e = {$: Uo};
            return e.id = t.string(), e.title = t.string(), e
        }, Ro = t => {
            const e = {$: Ro};
            return e.url = t.string(), e.accessHash = t.long(), e.size = t.int(), e.mimeType = t.string(), e.attributes = t.vector(ep), e
        }, Bo = t => {
            const e = {$: Bo};
            return e.size = t.int(), e.mimeType = t.string(), e.fileType = Id(t), e.mtime = t.int(), e.bytes = t.bytes(), e
        }, Ho = t => {
            const e = {$: Ho}, s = t.int();
            return e.isCanSaveCredentials = !!(4 & s), e.isPasswordMissing = !!(8 & s), e.botId = t.int(), e.invoice = _p(t), e.providerId = t.int(), e.url = t.string(), 16 & s && (e.nativeProvider = t.string()), 16 & s && (e.nativeParams = Bp(t)), 1 & s && (e.savedInfo = Vp(t)), 2 & s && (e.savedCredentials = qp(t)), e.users = t.vector(vd), e
        }, _o = t => {
            const e = {$: _o}, s = t.int();
            return 1 & s && (e.id = t.string()), 2 & s && (e.shippingOptions = t.vector(Gp)), e
        }, Oo = t => {
            const e = {$: Oo};
            return e.updates = Kd(t), e
        }, Fo = t => {
            const e = {$: Fo}, s = t.int();
            return e.date = t.int(), e.botId = t.int(), e.invoice = _p(t), e.providerId = t.int(), 1 & s && (e.info = Vp(t)), 2 & s && (e.shipping = Gp(t)), e.currency = t.string(), e.totalAmount = t.long(), e.credentialsTitle = t.string(), e.users = t.vector(vd), e
        }, Vo = t => {
            const e = {$: Vo}, s = t.int();
            return e.isHasSavedCredentials = !!(2 & s), 1 & s && (e.savedInfo = Vp(t)), e
        }, qo = t => {
            const e = {$: qo};
            return e.tmpPassword = t.bytes(), e.validUntil = t.int(), e
        }, Ko = t => {
            const e = {$: Ko};
            return e.id = t.string(), e.title = t.string(), e.prices = t.vector(Hp), e
        }, Go = t => {
            const e = {$: Go};
            return e.queryId = t.long(), e.userId = t.int(), e.payload = t.bytes(), e.shippingAddress = Fp(t), e
        }, zo = t => {
            const e = {$: zo}, s = t.int();
            return e.queryId = t.long(), e.userId = t.int(), e.payload = t.bytes(), 1 & s && (e.info = Vp(t)), 2 & s && (e.shippingOptionId = t.string()), e.currency = t.string(), e.totalAmount = t.long(), e
        }, Wo = t => {
            const e = {$: Wo};
            return e.phoneCall = zp(t), e
        }, Yo = t => {
            const e = {$: Yo};
            return e.id = t.long(), e
        }, Qo = t => {
            const e = {$: Qo}, s = t.int();
            return e.isVideo = !!(32 & s), e.id = t.long(), e.accessHash = t.long(), e.date = t.int(), e.adminId = t.int(), e.participantId = t.int(), e.protocol = Yp(t), 1 & s && (e.receiveDate = t.int()), e
        }, Jo = t => {
            const e = {$: Jo}, s = t.int();
            return e.isVideo = !!(32 & s), e.id = t.long(), e.accessHash = t.long(), e.date = t.int(), e.adminId = t.int(), e.participantId = t.int(), e.gAHash = t.bytes(), e.protocol = Yp(t), e
        }, Zo = t => {
            const e = {$: Zo}, s = t.int();
            return e.isVideo = !!(32 & s), e.id = t.long(), e.accessHash = t.long(), e.date = t.int(), e.adminId = t.int(), e.participantId = t.int(), e.gB = t.bytes(), e.protocol = Yp(t), e
        }, Xo = t => {
            const e = {$: Xo}, s = t.int();
            return e.isP2pAllowed = !!(32 & s), e.id = t.long(), e.accessHash = t.long(), e.date = t.int(), e.adminId = t.int(), e.participantId = t.int(), e.gAOrB = t.bytes(), e.keyFingerprint = t.long(), e.protocol = Yp(t), e.connections = t.vector(Wp), e.startDate = t.int(), e
        }, tc = t => {
            const e = {$: tc}, s = t.int();
            return e.isNeedRating = !!(4 & s), e.isNeedDebug = !!(8 & s), e.isVideo = !!(32 & s), e.id = t.long(), 1 & s && (e.reason = Rp(t)), 2 & s && (e.duration = t.int()), e
        }, ec = t => {
            const e = {$: ec};
            return e.id = t.long(), e.ip = t.string(), e.ipv6 = t.string(), e.port = t.int(), e.peerTag = t.bytes(), e
        }, sc = t => {
            const e = {$: sc}, s = t.int();
            return e.isUdpP2p = !!(1 & s), e.isUdpReflector = !!(2 & s), e.minLayer = t.int(), e.maxLayer = t.int(), e
        }, nc = t => {
            const e = {$: nc};
            return e.phoneCall = zp(t), e.users = t.vector(vd), e
        }, ic = t => {
            const e = {$: ic}, s = t.int();
            return e.isVideo = !!(4 & s), e.callId = t.long(), 1 & s && (e.reason = Rp(t)), 2 & s && (e.duration = t.int()), e
        }, rc = () => ({$: rc}), ac = t => {
            const e = {$: ac};
            return e.progress = t.int(), e
        }, oc = t => {
            const e = {$: oc};
            return e.dcId = t.int(), e.fileToken = t.bytes(), e.encryptionKey = t.bytes(), e.encryptionIv = t.bytes(), e.fileHashes = t.vector(rg), e
        }, cc = t => {
            const e = {$: cc};
            return e.requestToken = t.bytes(), e
        }, hc = t => {
            const e = {$: hc};
            return e.bytes = t.bytes(), e
        }, lc = t => {
            const e = {$: lc};
            return e.dcId = t.int(), e.publicKey = t.string(), e
        }, uc = t => {
            const e = {$: uc};
            return e.publicKeys = t.vector(Qp), e
        }, dc = t => {
            const e = {$: dc};
            return e.channel = kd(t), e
        }, pc = t => {
            const e = {$: pc};
            return e.key = t.string(), e.value = t.string(), e
        }, gc = t => {
            const e = {$: gc}, s = t.int();
            return e.key = t.string(), 1 & s && (e.zeroValue = t.string()), 2 & s && (e.oneValue = t.string()), 4 & s && (e.twoValue = t.string()), 8 & s && (e.fewValue = t.string()), 16 & s && (e.manyValue = t.string()), e.otherValue = t.string(), e
        }, mc = t => {
            const e = {$: mc};
            return e.key = t.string(), e
        }, fc = t => {
            const e = {$: fc};
            return e.langCode = t.string(), e.fromVersion = t.int(), e.version = t.int(), e.strings = t.vector(Jp), e
        }, wc = t => {
            const e = {$: wc}, s = t.int();
            return e.isOfficial = !!(1 & s), e.isRtl = !!(4 & s), e.isBeta = !!(8 & s), e.name = t.string(), e.nativeName = t.string(), e.langCode = t.string(), 2 & s && (e.baseLangCode = t.string()), e.pluralCode = t.string(), e.stringsCount = t.int(), e.translatedCount = t.int(), e.translationsUrl = t.string(), e
        }, $c = t => {
            const e = {$: $c};
            return e.langCode = t.string(), e
        }, yc = t => {
            const e = {$: yc};
            return e.difference = Zp(t), e
        }, bc = t => {
            const e = {$: bc}, s = t.int();
            return e.isCanEdit = !!(1 & s), e.isSelf = !!(2 & s), e.userId = t.int(), 2 & s && (e.inviterId = t.int()), e.promotedBy = t.int(), e.date = t.int(), e.adminRights = Ag(t), 4 & s && (e.rank = t.string()), e
        }, Ic = t => {
            const e = {$: Ic}, s = t.int();
            return e.isLeft = !!(1 & s), e.userId = t.int(), e.kickedBy = t.int(), e.date = t.int(), e.bannedRights = Lg(t), e
        }, vc = t => {
            const e = {$: vc};
            return e.prevValue = t.string(), e.newValue = t.string(), e
        }, Ec = t => {
            const e = {$: Ec};
            return e.prevValue = t.string(), e.newValue = t.string(), e
        }, Cc = t => {
            const e = {$: Cc};
            return e.prevValue = t.string(), e.newValue = t.string(), e
        }, kc = t => {
            const e = {$: kc};
            return e.prevPhoto = Dd(t), e.newPhoto = Dd(t), e
        }, Mc = t => {
            const e = {$: Mc};
            return e.newValue = wd(t), e
        }, Sc = t => {
            const e = {$: Sc};
            return e.newValue = wd(t), e
        }, xc = t => {
            const e = {$: xc};
            return e.message = Ad(t), e
        }, Pc = t => {
            const e = {$: Pc};
            return e.prevMessage = Ad(t), e.newMessage = Ad(t), e
        }, Ac = t => {
            const e = {$: Ac};
            return e.message = Ad(t), e
        }, Lc = () => ({$: Lc}), Nc = () => ({$: Nc}), jc = t => {
            const e = {$: jc};
            return e.participant = wp(t), e
        }, Dc = t => {
            const e = {$: Dc};
            return e.prevParticipant = wp(t), e.newParticipant = wp(t), e
        }, Tc = t => {
            const e = {$: Tc};
            return e.prevParticipant = wp(t), e.newParticipant = wp(t), e
        }, Uc = t => {
            const e = {$: Uc};
            return e.id = t.long(), e.date = t.int(), e.userId = t.int(), e.action = Xp(t), e
        }, Rc = t => {
            const e = {$: Rc};
            return e.events = t.vector(tg), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, Bc = () => ({$: Bc}), Hc = t => {
            const e = {$: Hc};
            return e.audioId = t.long(), e.caption = Ig(t), e
        }, _c = t => {
            const e = {$: _c};
            return e.clientId = t.long(), e.importers = t.int(), e
        }, Oc = () => ({$: Oc}), Fc = () => ({$: Fc}), Vc = t => {
            const e = {$: Vc};
            return e.hash = t.int(), e.packs = t.vector(sp), e.stickers = t.vector(Qd), e
        }, qc = () => ({$: qc}), Kc = t => {
            const e = {$: Kc};
            return e.channelId = t.int(), e.messages = t.vectorInt(), e
        }, Gc = () => ({$: Gc}), zc = t => {
            const e = {$: zc};
            return e.prevStickerset = op(t), e.newStickerset = op(t), e
        }, Wc = t => {
            const e = {$: Wc};
            return e.message = t.string(), e
        }, Yc = t => {
            const e = {$: Yc};
            return e.channelId = t.int(), e.availableMinId = t.int(), e
        }, Qc = t => {
            const e = {$: Qc};
            return e.newValue = wd(t), e
        }, Jc = t => {
            const e = {$: Jc};
            return e.geo = Ud(t), e.period = t.int(), e
        }, Zc = t => {
            const e = {$: Zc};
            return e.url = t.string(), e
        }, Xc = t => {
            const e = {$: Xc};
            return e.url = t.string(), e.userId = t.int(), e
        }, th = t => {
            const e = {$: th};
            return e.url = t.string(), e.chatId = t.int(), e
        }, eh = t => {
            const e = {$: eh};
            return e.url = t.string(), e.chatInvite = ap(t), e
        }, sh = t => {
            const e = {$: sh};
            return e.url = t.string(), e.set = Lp(t), e
        }, nh = t => {
            const e = {$: nh};
            return e.urls = t.vector(sg), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, ih = () => ({$: ih}), rh = t => {
            const e = {$: rh};
            return e.count = t.int(), e
        }, ah = t => {
            const e = {$: ah};
            return e.hash = t.long(), e.botId = t.int(), e.domain = t.string(), e.browser = t.string(), e.platform = t.string(), e.dateCreated = t.int(), e.dateActive = t.int(), e.ip = t.string(), e.region = t.string(), e
        }, oh = t => {
            const e = {$: oh};
            return e.authorizations = t.vector(ng), e.users = t.vector(vd), e
        }, ch = t => {
            const e = {$: ch};
            return e.offset = t.int(), e.length = t.int(), e
        }, hh = t => {
            const e = {$: hh};
            return e.offset = t.int(), e.length = t.int(), e
        }, lh = t => {
            const e = {$: lh};
            return e.domain = t.string(), e
        }, uh = t => {
            const e = {$: uh};
            return e.peer = bd(t), e
        }, dh = () => ({$: dh}), ph = t => {
            const e = {$: ph};
            return e.hash = t.int(), e.sets = t.vector(Lp), e
        }, gh = t => {
            const e = {$: gh};
            return e.offset = t.int(), e.limit = t.int(), e.hash = t.bytes(), e
        }, mh = t => {
            const e = {$: mh};
            return e.url = t.string(), e.size = t.int(), e.mimeType = t.string(), e.attributes = t.vector(ep), e
        }, fh = t => {
            const e = {$: fh};
            return e.expires = t.int(), e
        }, wh = t => {
            const e = {$: wh};
            return e.expires = t.int(), e.peer = bd(t), e.chats = t.vector(kd), e.users = t.vector(vd), e
        }, $h = t => {
            const e = {$: $h};
            return e.expires = t.int(), e
        }, yh = t => {
            const e = {$: yh};
            return e.expires = t.int(), e.termsOfService = $p(t), e
        }, bh = () => ({$: bh}), Ih = t => {
            const e = {$: Ih};
            return e.id = t.long(), e.accessHash = t.long(), e.size = t.int(), e.dcId = t.int(), e.date = t.int(), e.fileHash = t.bytes(), e.secret = t.bytes(), e
        }, vh = t => {
            const e = {$: vh};
            return e.data = t.bytes(), e.dataHash = t.bytes(), e.secret = t.bytes(), e
        }, Eh = t => {
            const e = {$: Eh};
            return e.phone = t.string(), e
        }, Ch = t => {
            const e = {$: Ch};
            return e.email = t.string(), e
        }, kh = () => ({$: kh}), Mh = () => ({$: Mh}), Sh = () => ({$: Sh}), xh = () => ({$: xh}), Ph = () => ({$: Ph}),
        Ah = () => ({$: Ah}), Lh = () => ({$: Lh}), Nh = () => ({$: Nh}), jh = () => ({$: jh}), Dh = () => ({$: Dh}),
        Th = () => ({$: Th}), Uh = () => ({$: Uh}), Rh = () => ({$: Rh}), Bh = t => {
            const e = {$: Bh}, s = t.int();
            return e.type = hg(t), 1 & s && (e.data = og(t)), 2 & s && (e.frontSide = ag(t)), 4 & s && (e.reverseSide = ag(t)), 8 & s && (e.selfie = ag(t)), 64 & s && (e.translation = t.vector(ag)), 16 & s && (e.files = t.vector(ag)), 32 & s && (e.plainData = cg(t)), e.hash = t.bytes(), e
        }, Hh = t => {
            const e = {$: Hh};
            return e.type = hg(t), e.dataHash = t.bytes(), e.field = t.string(), e.text = t.string(), e
        }, _h = t => {
            const e = {$: _h};
            return e.type = hg(t), e.fileHash = t.bytes(), e.text = t.string(), e
        }, Oh = t => {
            const e = {$: Oh};
            return e.type = hg(t), e.fileHash = t.bytes(), e.text = t.string(), e
        }, Fh = t => {
            const e = {$: Fh};
            return e.type = hg(t), e.fileHash = t.bytes(), e.text = t.string(), e
        }, Vh = t => {
            const e = {$: Vh};
            return e.type = hg(t), e.fileHash = t.bytes(), e.text = t.string(), e
        }, qh = t => {
            const e = {$: qh};
            return e.type = hg(t), e.fileHash = t.vector(Bytes), e.text = t.string(), e
        }, Kh = t => {
            const e = {$: Kh};
            return e.data = t.bytes(), e.hash = t.bytes(), e.secret = t.bytes(), e
        }, Gh = t => {
            const e = {$: Gh}, s = t.int();
            return e.requiredTypes = t.vector(fg), e.values = t.vector(lg), e.errors = t.vector(ug), e.users = t.vector(vd), 1 & s && (e.privacyPolicyUrl = t.string()), e
        }, zh = t => {
            const e = {$: zh};
            return e.emailPattern = t.string(), e.length = t.int(), e
        }, Wh = t => {
            const e = {$: Wh};
            return e.values = t.vector(lg), e.credentials = dg(t), e
        }, Yh = t => {
            const e = {$: Yh};
            return e.types = t.vector(hg), e
        }, Qh = () => ({$: Qh}), Jh = t => {
            const e = {$: Jh}, s = t.int();
            return e.isUpdateApp = !!(1 & s), e.message = t.string(), 2 & s && (e.entities = t.vector(mp)), e
        }, Zh = t => {
            const e = {$: Zh};
            return e.id = t.long(), e
        }, Xh = t => {
            const e = {$: Xh}, s = t.int();
            return e.isUnread = !!(1 & s), e.peer = ig(t), e
        }, tl = t => {
            const e = {$: tl};
            return e.count = t.int(), e
        }, el = () => ({$: el}), sl = () => ({$: sl}), nl = () => ({$: nl}), il = t => {
            const e = {$: il};
            return e.salt = t.bytes(), e
        }, rl = t => {
            const e = {$: rl};
            return e.salt = t.bytes(), e
        }, al = t => {
            const e = {$: al};
            return e.secureAlgo = gg(t), e.secureSecret = t.bytes(), e.secureSecretId = t.long(), e
        }, ol = t => {
            const e = {$: ol};
            return e.salt1 = t.bytes(), e.salt2 = t.bytes(), e.g = t.int(), e.p = t.bytes(), e
        }, cl = t => {
            const e = {$: cl};
            return e.type = hg(t), e.hash = t.bytes(), e.text = t.string(), e
        }, hl = t => {
            const e = {$: hl};
            return e.type = hg(t), e.fileHash = t.bytes(), e.text = t.string(), e
        }, ll = t => {
            const e = {$: ll};
            return e.type = hg(t), e.fileHash = t.vector(Bytes), e.text = t.string(), e
        }, ul = t => {
            const e = {$: ul}, s = t.int();
            return e.isNativeNames = !!(1 & s), e.isSelfieRequired = !!(2 & s), e.isTranslationRequired = !!(4 & s), e.type = hg(t), e
        }, dl = t => {
            const e = {$: dl};
            return e.types = t.vector(fg), e
        }, pl = () => ({$: pl}), gl = t => {
            const e = {$: gl};
            return e.hash = t.int(), e.countriesLangs = Bp(t), e
        }, ml = t => {
            const e = {$: ml};
            return e.key = t.string(), e.value = $g(t), e
        }, fl = () => ({$: fl}), wl = t => {
            const e = {$: wl};
            return e.value = wd(t), e
        }, $l = t => {
            const e = {$: $l};
            return e.value = t.double(), e
        }, yl = t => {
            const e = {$: yl};
            return e.value = t.string(), e
        }, bl = t => {
            const e = {$: bl};
            return e.value = t.vector($g), e
        }, Il = t => {
            const e = {$: Il};
            return e.value = t.vector(wg), e
        }, vl = t => {
            const e = {$: vl};
            return e.userId = t.int(), e.id = t.int(), e
        }, El = t => {
            const e = {$: El};
            return e.chatId = t.int(), e.id = t.int(), e.version = t.int(), e
        }, Cl = () => ({$: Cl}), kl = t => {
            const e = {$: kl};
            return e.text = Tp(t), e
        }, Ml = t => {
            const e = {$: Ml};
            return e.text = Tp(t), e
        }, Sl = t => {
            const e = {$: Sl};
            return e.text = Tp(t), e
        }, xl = t => {
            const e = {$: xl};
            return e.text = Tp(t), e.phone = t.string(), e
        }, Pl = t => {
            const e = {$: Pl};
            return e.documentId = t.long(), e.w = t.int(), e.h = t.int(), e
        }, Al = t => {
            const e = {$: Al};
            return e.text = Tp(t), e
        }, Ll = t => {
            const e = {$: Ll}, s = t.int();
            return e.isHeader = !!(1 & s), e.isAlignCenter = !!(8 & s), e.isAlignRight = !!(16 & s), e.isValignMiddle = !!(32 & s), e.isValignBottom = !!(64 & s), 128 & s && (e.text = Tp(t)), 2 & s && (e.colspan = t.int()), 4 & s && (e.rowspan = t.int()), e
        }, Nl = t => {
            const e = {$: Nl};
            return e.cells = t.vector(yg), e
        }, jl = t => {
            const e = {$: jl}, s = t.int();
            return e.isBordered = !!(1 & s), e.isStriped = !!(2 & s), e.title = Tp(t), e.rows = t.vector(bg), e
        }, Dl = t => {
            const e = {$: Dl};
            return e.text = Tp(t), e.credit = Tp(t), e
        }, Tl = t => {
            const e = {$: Tl};
            return e.text = Tp(t), e
        }, Ul = t => {
            const e = {$: Ul};
            return e.blocks = t.vector(Up), e
        }, Rl = t => {
            const e = {$: Rl};
            return e.num = t.string(), e.text = Tp(t), e
        }, Bl = t => {
            const e = {$: Bl};
            return e.num = t.string(), e.blocks = t.vector(Up), e
        }, Hl = t => {
            const e = {$: Hl};
            return e.items = t.vector(Eg), e
        }, _l = t => {
            const e = {$: _l}, s = t.int();
            return e.isOpen = !!(1 & s), e.blocks = t.vector(Up), e.title = Tp(t), e
        }, Ol = t => {
            const e = {$: Ol}, s = t.int();
            return e.url = t.string(), e.webpageId = t.long(), 1 & s && (e.title = t.string()), 2 & s && (e.description = t.string()), 4 & s && (e.photoId = t.long()), 8 & s && (e.author = t.string()), 16 & s && (e.publishedDate = t.int()), e
        }, Fl = t => {
            const e = {$: Fl};
            return e.title = Tp(t), e.articles = t.vector(Cg), e
        }, Vl = t => {
            const e = {$: Vl};
            return e.geo = Ud(t), e.zoom = t.int(), e.w = t.int(), e.h = t.int(), e.caption = Ig(t), e
        }, ql = t => {
            const e = {$: ql}, s = t.int();
            return e.isPart = !!(1 & s), e.isRtl = !!(2 & s), e.isV2 = !!(4 & s), e.url = t.string(), e.blocks = t.vector(Up), e.photos = t.vector(Dd), e.documents = t.vector(Qd), e
        }, Kl = () => ({$: Kl}), Gl = t => {
            const e = {$: Gl};
            return e.text = Tp(t), e.name = t.string(), e
        }, zl = t => {
            const e = {$: zl};
            return e.name = t.string(), e
        }, Wl = () => ({$: Wl}), Yl = t => {
            const e = {$: Yl};
            return e.message = t.string(), e.entities = t.vector(mp), e.author = t.string(), e.date = t.int(), e
        }, Ql = () => ({$: Ql}), Jl = t => {
            const e = {$: Jl}, s = t.int();
            return e.pollId = t.long(), 1 & s && (e.poll = Sg(t)), e.results = Pg(t), e
        }, Zl = t => {
            const e = {$: Zl};
            return e.text = t.string(), e.option = t.bytes(), e
        }, Xl = t => {
            const e = {$: Xl};
            e.id = t.long();
            const s = t.int();
            return e.isClosed = !!(1 & s), e.question = t.string(), e.answers = t.vector(Mg), e
        }, tu = t => {
            const e = {$: tu}, s = t.int();
            return e.isChosen = !!(1 & s), e.option = t.bytes(), e.voters = t.int(), e
        }, eu = t => {
            const e = {$: eu}, s = t.int();
            return e.isMin = !!(1 & s), 2 & s && (e.results = t.vector(xg)), 4 & s && (e.totalVoters = t.int()), e
        }, su = t => {
            const e = {$: su};
            return e.poll = Sg(t), e.results = Pg(t), e
        }, nu = t => {
            const e = {$: nu};
            return e.onlines = t.int(), e
        }, iu = t => {
            const e = {$: iu};
            return e.url = t.string(), e
        }, ru = t => {
            const e = {$: ru};
            return e.type = t.string(), e.bytes = t.bytes(), e
        }, au = t => {
            const e = {$: au}, s = t.int();
            return e.isChangeInfo = !!(1 & s), e.isPostMessages = !!(2 & s), e.isEditMessages = !!(4 & s), e.isDeleteMessages = !!(8 & s), e.isBanUsers = !!(16 & s), e.isInviteUsers = !!(32 & s), e.isPinMessages = !!(128 & s), e.isAddAdmins = !!(512 & s), e
        }, ou = t => {
            const e = {$: ou}, s = t.int();
            return e.isViewMessages = !!(1 & s), e.isSendMessages = !!(2 & s), e.isSendMedia = !!(4 & s), e.isSendStickers = !!(8 & s), e.isSendGifs = !!(16 & s), e.isSendGames = !!(32 & s), e.isSendInline = !!(64 & s), e.isEmbedLinks = !!(128 & s), e.isSendPolls = !!(256 & s), e.isChangeInfo = !!(1024 & s), e.isInviteUsers = !!(32768 & s), e.isPinMessages = !!(131072 & s), e.untilDate = t.int(), e
        }, cu = t => {
            const e = {$: cu};
            return e.peer = bd(t), e.defaultBannedRights = Lg(t), e.version = t.int(), e
        }, hu = t => {
            const e = {$: hu};
            return e.prevBannedRights = Lg(t), e.newBannedRights = Lg(t), e
        }, lu = t => {
            const e = {$: lu};
            return e.message = Ad(t), e
        }, uu = () => ({$: uu}), du = t => {
            const e = {$: du};
            return e.hash = t.int(), e.wallpapers = t.vector(Hd), e
        }, pu = t => {
            const e = {$: pu}, s = t.int();
            return e.isBlur = !!(2 & s), e.isMotion = !!(4 & s), 1 & s && (e.backgroundColor = t.int()), 8 & s && (e.intensity = t.int()), e
        }, gu = t => {
            const e = {$: gu}, s = t.int();
            return e.isDisabled = !!(1 & s), e.isVideoPreloadLarge = !!(2 & s), e.isAudioPreloadNext = !!(4 & s), e.isPhonecallsLessData = !!(8 & s), e.photoSizeMax = t.int(), e.videoSizeMax = t.int(), e.fileSizeMax = t.int(), e
        }, mu = t => {
            const e = {$: mu};
            return e.low = jg(t), e.medium = jg(t), e.high = jg(t), e
        }, fu = t => {
            const e = {$: fu};
            return e.keyword = t.string(), e.emoticons = t.vector(String), e
        }, wu = t => {
            const e = {$: wu};
            return e.keyword = t.string(), e.emoticons = t.vector(String), e
        }, $u = t => {
            const e = {$: $u};
            return e.langCode = t.string(), e.fromVersion = t.int(), e.version = t.int(), e.keywords = t.vector(Dg), e
        }, yu = t => {
            const e = {$: yu};
            return e.url = t.string(), e
        }, bu = () => ({$: bu}), Iu = () => ({$: Iu}), vu = t => {
            const e = {$: vu};
            return e.volumeId = t.long(), e.localId = t.int(), e
        }, Eu = t => {
            const e = {$: Eu}, s = t.int();
            return e.isAutofillNewBroadcasts = !!(1 & s), e.isAutofillPublicGroups = !!(2 & s), e.isAutofillNewCorrespondents = !!(4 & s), e.id = t.int(), e.title = t.string(), 8 & s && (e.photo = Pd(t)), e
        }, Cu = t => {
            const e = {$: Cu}, s = t.int();
            return e.isPinned = !!(4 & s), e.folder = Ug(t), e.peer = bd(t), e.topMessage = t.int(), e.unreadMutedPeersCount = t.int(), e.unreadUnmutedPeersCount = t.int(), e.unreadMutedMessagesCount = t.int(), e.unreadUnmutedMessagesCount = t.int(), e
        }, ku = t => {
            const e = {$: ku};
            return e.folderId = t.int(), e
        }, Mu = t => {
            const e = {$: Mu};
            return e.peer = bd(t), e.folderId = t.int(), e
        }, Su = t => {
            const e = {$: Su};
            return e.folderPeers = t.vector(Rg), e.pts = t.int(), e.ptsCount = t.int(), e
        }, xu = t => {
            const e = {$: xu};
            return e.peer = $d(t), e.msgId = t.int(), e.userId = t.int(), e
        }, Pu = t => {
            const e = {$: Pu};
            return e.peer = $d(t), e.msgId = t.int(), e.channelId = t.int(), e
        }, Au = t => {
            const e = {$: Au};
            return e.peer = $d(t), e.msgId = t.int(), e.userId = t.int(), e
        }, Lu = t => {
            const e = {$: Lu};
            return e.peer = $d(t), e.msgId = t.int(), e.channelId = t.int(), e
        }, Nu = () => ({$: Nu}), ju = () => ({$: ju}), Du = () => ({$: Du}), Tu = t => {
            const e = {$: Tu};
            return e.prevValue = t.int(), e.newValue = t.int(), e
        }, Uu = t => {
            const e = {$: Uu}, s = t.int();
            return e.text = t.string(), 1 & s && (e.fwdText = t.string()), e.url = t.string(), e.buttonId = t.int(), e
        }, Ru = t => {
            const e = {$: Ru}, s = t.int();
            return e.isRequestWriteAccess = !!(1 & s), e.text = t.string(), 2 & s && (e.fwdText = t.string()), e.url = t.string(), e.bot = yd(t), e
        }, Bu = t => {
            const e = {$: Bu}, s = t.int();
            return e.isRequestWriteAccess = !!(1 & s), e.bot = vd(t), e.domain = t.string(), e
        }, Hu = t => {
            const e = {$: Hu};
            return e.url = t.string(), e
        }, _u = () => ({$: _u}), Ou = t => {
            const e = {$: Ou};
            return e.chats = t.vectorInt(), e
        }, Fu = t => {
            const e = {$: Fu};
            return e.chats = t.vectorInt(), e
        }, Vu = t => {
            const e = {$: Vu};
            return e.offset = t.int(), e.length = t.int(), e
        }, qu = t => {
            const e = {$: qu};
            return e.offset = t.int(), e.length = t.int(), e
        }, Ku = t => {
            const e = {$: Ku};
            return e.offset = t.int(), e.length = t.int(), e
        }, Gu = t => {
            const e = {$: Gu};
            return e.peer = bd(t), e.settings = Bd(t), e
        }, zu = () => ({$: zu}), Wu = t => {
            const e = {$: Wu};
            return e.geoPoint = Ud(t), e.address = t.string(), e
        }, Yu = t => {
            const e = {$: Yu};
            return e.peer = bd(t), e.expires = t.int(), e.distance = t.int(), e
        }, Qu = t => {
            const e = {$: Qu};
            return e.peers = t.vector(Hg), e
        }, Ju = t => {
            const e = {$: Ju};
            return e.prevValue = Bg(t), e.newValue = Bg(t), e
        }, Zu = t => {
            const e = {$: Zu};
            return e.prevValue = t.int(), e.newValue = t.int(), e
        }, Xu = t => {
            const e = {$: Xu};
            return 1 & t.int() && (e.termsOfService = $p(t)), e
        }, td = t => {
            const e = {$: td};
            return e.url = t.string(), e
        }, ed = () => ({$: ed}), sd = t => {
            const e = {$: sd};
            return e.message = Ad(t), e
        }, nd = t => {
            const e = {$: nd};
            return e.peer = bd(t), e.messages = t.vectorInt(), e
        }, id = t => {
            const e = {$: id};
            return e.platform = t.string(), e.reason = t.string(), e.text = t.string(), e
        }, rd = () => ({$: rd}), ad = t => {
            const e = {$: ad}, s = t.int();
            return e.isCreator = !!(1 & s), e.isDefault = !!(2 & s), e.id = t.long(), e.accessHash = t.long(), e.slug = t.string(), e.title = t.string(), 4 & s && (e.document = Qd(t)), e.installsCount = t.int(), e
        }, od = () => ({$: od}), cd = t => {
            const e = {$: cd};
            return e.hash = t.int(), e.themes = t.vector(Og), e
        }, hd = t => {
            const e = {$: hd};
            return e.theme = Og(t), e
        }, ld = () => ({$: ld}), ud = t => {
            let s = t.uint32();
            switch (s) {
                case 4082920705:
                    return at(t);
                case 558156313:
                    return ot(t);
                case 2663516424:
                    return ft(t);
                case 1945237724:
                    return wt(t);
                case 812830625:
                    return yt(t);
                case 1658238041:
                    return bt(t);
                case 2817521681:
                    return It(t);
                case 3987424379:
                    return vt(t);
                case 85337187:
                    return X(t);
                case 2043348061:
                    return tt(t);
                case 3504867164:
                    return et(t);
                case 1003222836:
                    return nt(t);
                case 1188831161:
                    return it(t);
                case 2795351554:
                    return rt(t);
                case 1579864942:
                    return ct();
                case 3447252358:
                    return ht();
                case 2755319991:
                    return lt(t);
                case 2924480661:
                    return dt(t);
                case 880243653:
                    return pt(t);
                case 3793765884:
                    return gt(t);
                case 1658015945:
                    return mt(t);
                case 1577067778:
                    return Me(t);
                case 3439659286:
                    return Se(t);
                case 1148485274:
                    return Xu(t);
                case 3162085175:
                    return Et();
                case 2574415285:
                    return Ct();
                case 3751189549:
                    return xe(t);
                case 2941295904:
                    return Pe(t);
                case 537022650:
                    return Ft(t);
                case 2474924225:
                    return oi(t);
                case 471437699:
                    return uu();
                case 1881892265:
                    return du(t);
                case 3992026130:
                    return Ne(t);
                case 3075189202:
                    return Ue();
                case 3941105218:
                    return Re(t);
                case 2010127419:
                    return Be(t);
                case 3809980286:
                    return os();
                case 2437922577:
                    return cs(t);
                case 377562760:
                    return hs(t);
                case 2027216577:
                    return ls(t);
                case 1918567619:
                    return us(t);
                case 1957577280:
                    return ds(t);
                case 301019932:
                    return xi(t);
                case 471043349:
                    return He(t);
                case 2416444065:
                    return _e(t);
                case 2356252295:
                    return Ve(t);
                case 3371027998:
                    return qe(t);
                case 2569416247:
                    return Ri(t);
                case 1951620897:
                    return rh(t);
                case 364538944:
                    return Oe(t);
                case 1910543603:
                    return Fe(t);
                case 4041467286:
                    return tl(t);
                case 2228326789:
                    return Bn(t);
                case 3025955281:
                    return ze(t);
                case 2172921549:
                    return Ae(t);
                case 1694474197:
                    return Ke(t);
                case 2631405892:
                    return Ua(t);
                case 3856126364:
                    return Ge(t);
                case 2775329342:
                    return ns(t);
                case 1567990072:
                    return is(t);
                case 16030880:
                    return rs(t);
                case 2835028353:
                    return as(t);
                case 1258196845:
                    return Da(t);
                case 1326562017:
                    return Vt();
                case 3973537164:
                    return qt(t);
                case 539045032:
                    return ms(t);
                case 157948117:
                    return fs(t);
                case 4052539972:
                    return oc(t);
                case 856375399:
                    return $s(t);
                case 2384074613:
                    return ys(t);
                case 497489295:
                    return bs(t);
                case 3294258486:
                    return Is();
                case 415997816:
                    return vs(t);
                case 2378853029:
                    return ps(t);
                case 352657236:
                    return gs(t);
                case 3236054581:
                    return Us(t);
                case 740433629:
                    return Rs(t);
                case 2877210784:
                    return Ss(t);
                case 1006044124:
                    return xs(t);
                case 3363328638:
                    return Ps(t);
                case 4199992886:
                    return As(t);
                case 332848423:
                    return Ls(t);
                case 1443858741:
                    return Bs(t);
                case 2492727090:
                    return Hs(t);
                case 398898678:
                    return Gs(t);
                case 3004386717:
                    return hn(t);
                case 1352683077:
                    return vn(t);
                case 3100684255:
                    return En(t);
                case 2131196633:
                    return Ti(t);
                case 4050950690:
                    return Ln();
                case 3831077821:
                    return Nn(t);
                case 3898999491:
                    return Dn();
                case 3992797279:
                    return Tn(t);
                case 1038967584:
                    return ae();
                case 1766936791:
                    return oe(t);
                case 1457575028:
                    return ce(t);
                case 3421653312:
                    return he(t);
                case 2676290718:
                    return le();
                case 2628808919:
                    return Vs(t);
                case 2737690112:
                    return Vn(t);
                case 784356159:
                    return Yn(t);
                case 4256272392:
                    return Pa(t);
                case 2220168007:
                    return Lo(t);
                case 2084316681:
                    return Jc(t);
                case 1272375192:
                    return su(t);
                case 307276766:
                    return Kn(t);
                case 2904965624:
                    return Gn(t);
                case 2589733861:
                    return zn(t);
                case 326715557:
                    return Wn(t);
                case 1776236393:
                    return Qn();
                case 4230874556:
                    return Jn(t);
                case 1516793212:
                    return Zn(t);
                case 3754096014:
                    return Xn(t);
                case 3054118054:
                    return ai(t);
                case 946083368:
                    return ba();
                case 904138920:
                    return Ia(t);
                case 4117684904:
                    return Ji(t);
                case 4028055529:
                    return ih();
                case 3503927651:
                    return Zi(t);
                case 1041346555:
                    return Ki(t);
                case 2763835134:
                    return Gi(t);
                case 543450958:
                    return zi(t);
                case 922273905:
                    return qs(t);
                case 2611125441:
                    return Ks(t);
                case 1158290442:
                    return lr(t);
                case 3892468898:
                    return ur();
                case 772213157:
                    return dr(t);
                case 2491197512:
                    return wr(t);
                case 1571494644:
                    return Ir(t);
                case 649453030:
                    return Or(t);
                case 911761060:
                    return Hr(t);
                case 3727060725:
                    return ia();
                case 1891070632:
                    return ra(t);
                case 3039597469:
                    return el();
                case 863093588:
                    return Qr(t);
                case 82699215:
                    return pa();
                case 4171073765:
                    return ga(t);
                case 186120336:
                    return fa();
                case 586395571:
                    return wa(t);
                case 1338747336:
                    return ya(t);
                case 2587622809:
                    return ja(t);
                case 3943987176:
                    return _n(t);
                case 3313949212:
                    return On(t);
                case 4200915314:
                    return Fn(t);
                case 2240058483:
                    return mo();
                case 2104790276:
                    return Co(t);
                case 568808380:
                    return Bo(t);
                case 1062645411:
                    return Ho(t);
                case 1342771681:
                    return Fo(t);
                case 3510966403:
                    return _o(t);
                case 1314881805:
                    return Oo(t);
                case 3628142905:
                    return td(t);
                case 3680828724:
                    return qo(t);
                case 4220511292:
                    return Vo(t);
                case 3968000320:
                    return nc(t);
                case 4004045934:
                    return cc(t);
                case 2845821519:
                    return hc(t);
                case 1462101002:
                    return uc(t);
                case 4085629430:
                    return fc(t);
                case 3985307469:
                    return Rc(t);
                case 2660214483:
                    return Fc();
                case 4085198614:
                    return Vc(t);
                case 235081943:
                    return nh(t);
                case 3256830334:
                    return Ns();
                case 1248893260:
                    return js(t);
                case 3981887996:
                    return oh(t);
                case 223655517:
                    return dh();
                case 1359533640:
                    return ph(t);
                case 3768459192:
                    return fh(t);
                case 737668643:
                    return wh(t);
                case 3811614591:
                    return $h(t);
                case 686618977:
                    return yh(t);
                case 411017418:
                    return Bh(t);
                case 2905480408:
                    return Gh(t);
                case 2166326607:
                    return zh(t);
                case 1722786150:
                    return Qh();
                case 1783556146:
                    return Jh(t);
                case 1304052993:
                    return Zh(t);
                case 1064139624:
                    return fl();
                case 3342098026:
                    return wl(t);
                case 736157604:
                    return $l(t);
                case 3072226938:
                    return yl(t);
                case 4148447075:
                    return bl(t);
                case 2579616925:
                    return Il(t);
                case 3216634967:
                    return pl();
                case 2694370991:
                    return gl(t);
                case 4006239459:
                    return wc(t);
                case 2349199817:
                    return zl(t);
                case 4088278765:
                    return Wl();
                case 32192344:
                    return Yl(t);
                case 4030849616:
                    return nu(t);
                case 1202287072:
                    return iu(t);
                case 2755118061:
                    return Le(t);
                case 1674235686:
                    return mu(t);
                case 1556570557:
                    return $u(t);
                case 2775937949:
                    return yu(t);
                case 2463316494:
                    return Bu(t);
                case 2408320590:
                    return Hu(t);
                case 2849430303:
                    return _u();
                case 1211967244:
                    return rd();
                case 4158196960:
                    return ad(t);
                case 4095653410:
                    return od();
                case 2137482273:
                    return cd(t);
                default:
                    throw e(s)
            }
        }, dd = t => {
            let s = t.uint32();
            switch (s) {
                case 85337187:
                    return X(t);
                default:
                    throw e(s)
            }
        }, pd = t => {
            let s = t.uint32();
            switch (s) {
                case 2043348061:
                    return tt(t);
                case 3504867164:
                    return et(t);
                default:
                    throw e(s)
            }
        }, gd = t => {
            let s = t.uint32();
            switch (s) {
                case 3045658042:
                    return st(t);
                default:
                    throw e(s)
            }
        }, md = t => {
            let s = t.uint32();
            switch (s) {
                case 1003222836:
                    return nt(t);
                case 1188831161:
                    return it(t);
                case 2795351554:
                    return rt(t);
                default:
                    throw e(s)
            }
        }, fd = t => {
            let s = t.uint32();
            switch (s) {
                case 155834844:
                    return ut(t);
                default:
                    throw e(s)
            }
        }, wd = t => {
            let s = t.uint32();
            switch (s) {
                case 3162085175:
                    return Et();
                case 2574415285:
                    return Ct();
                default:
                    throw e(s)
            }
        }, $d = t => {
            let s = t.uint32();
            switch (s) {
                case 2134579434:
                    return kt();
                case 2107670217:
                    return Mt();
                case 396093539:
                    return St(t);
                case 2072935910:
                    return mi(t);
                case 548253432:
                    return Ni(t);
                case 398123750:
                    return Au(t);
                case 2627073979:
                    return Lu(t);
                default:
                    throw e(s)
            }
        }, yd = t => {
            let s = t.uint32();
            switch (s) {
                case 3112732367:
                    return xt();
                case 4156666175:
                    return Pt();
                case 3626575894:
                    return fi(t);
                case 756118935:
                    return xu(t);
                default:
                    throw e(s)
            }
        }, bd = t => {
            let s = t.uint32();
            switch (s) {
                case 2645671021:
                    return At(t);
                case 3134252475:
                    return Lt(t);
                case 3185435954:
                    return Li(t);
                default:
                    throw e(s)
            }
        }, Id = t => {
            let s = t.uint32();
            switch (s) {
                case 2861972229:
                    return Nt();
                case 1086091090:
                    return jt();
                case 8322574:
                    return Dt();
                case 3403786975:
                    return Tt();
                case 172975040:
                    return Ut();
                case 2921222285:
                    return Rt();
                case 1384777335:
                    return Bt();
                case 1258941372:
                    return Ht();
                case 3016663268:
                    return _t();
                case 276907596:
                    return Ot();
                default:
                    throw e(s)
            }
        }, vd = t => {
            let s = t.uint32();
            switch (s) {
                case 537022650:
                    return Ft(t);
                case 2474924225:
                    return oi(t);
                default:
                    throw e(s)
            }
        }, Ed = t => {
            let s = t.uint32();
            switch (s) {
                case 1326562017:
                    return Vt();
                case 3973537164:
                    return qt(t);
                default:
                    throw e(s)
            }
        }, Cd = t => {
            let s = t.uint32();
            switch (s) {
                case 164646985:
                    return Kt();
                case 3988339017:
                    return Gt(t);
                case 9203775:
                    return zt(t);
                case 3798942449:
                    return un();
                case 129960444:
                    return dn();
                case 2011940674:
                    return pn();
                default:
                    throw e(s)
            }
        }, kd = t => {
            let s = t.uint32();
            switch (s) {
                case 2611140608:
                    return Wt(t);
                case 1004149726:
                    return Yt(t);
                case 120753115:
                    return Qt(t);
                case 3541734942:
                    return ji(t);
                case 681420594:
                    return Di(t);
                default:
                    throw e(s)
            }
        }, Md = t => {
            let s = t.uint32();
            switch (s) {
                case 461151667:
                    return Jt(t);
                case 763976820:
                    return Ui(t);
                default:
                    throw e(s)
            }
        }, Sd = t => {
            let s = t.uint32();
            switch (s) {
                case 3369552190:
                    return Zt(t);
                case 3658699658:
                    return Xi(t);
                case 3805733942:
                    return tr(t);
                default:
                    throw e(s)
            }
        }, xd = t => {
            let s = t.uint32();
            switch (s) {
                case 4237298731:
                    return Xt(t);
                case 1061556205:
                    return te(t);
                default:
                    throw e(s)
            }
        }, Pd = t => {
            let s = t.uint32();
            switch (s) {
                case 935395612:
                    return ee();
                case 1197267925:
                    return se(t);
                default:
                    throw e(s)
            }
        }, Ad = t => {
            let s = t.uint32();
            switch (s) {
                case 2212879956:
                    return ne(t);
                case 1160515173:
                    return ie(t);
                case 2652479990:
                    return re(t);
                default:
                    throw e(s)
            }
        }, Ld = t => {
            let s = t.uint32();
            switch (s) {
                case 1038967584:
                    return ae();
                case 1766936791:
                    return oe(t);
                case 1457575028:
                    return ce(t);
                case 3421653312:
                    return he(t);
                case 2676290718:
                    return le();
                case 2628808919:
                    return Vs(t);
                case 2737690112:
                    return Vn(t);
                case 784356159:
                    return Yn(t);
                case 4256272392:
                    return Pa(t);
                case 2220168007:
                    return Lo(t);
                case 2084316681:
                    return Jc(t);
                case 1272375192:
                    return su(t);
                default:
                    throw e(s)
            }
        }, Nd = t => {
            let s = t.uint32();
            switch (s) {
                case 3064919984:
                    return ue();
                case 2791541658:
                    return de(t);
                case 3047280218:
                    return pe(t);
                case 2144015272:
                    return ge(t);
                case 2514746351:
                    return me();
                case 1217033015:
                    return fe(t);
                case 2997787404:
                    return we(t);
                case 4171036136:
                    return ti(t);
                case 2513611922:
                    return Bi(t);
                case 1371385889:
                    return sr(t);
                case 2958420718:
                    return nr(t);
                case 2495428845:
                    return kr();
                case 2679813636:
                    return da();
                case 2460428406:
                    return La(t);
                case 2402399015:
                    return Ao(t);
                case 1080663248:
                    return To(t);
                case 2162236031:
                    return ic(t);
                case 1200788123:
                    return Oc();
                case 4209418070:
                    return Wc(t);
                case 2884218878:
                    return lh(t);
                case 455635795:
                    return Wh(t);
                case 3646710100:
                    return Yh(t);
                case 4092747638:
                    return Ql();
                default:
                    throw e(s)
            }
        }, jd = t => {
            let s = t.uint32();
            switch (s) {
                case 739712882:
                    return $e(t);
                case 1908216652:
                    return Cu(t);
                default:
                    throw e(s)
            }
        }, Dd = t => {
            let s = t.uint32();
            switch (s) {
                case 590459437:
                    return ye(t);
                case 3497329829:
                    return be(t);
                default:
                    throw e(s)
            }
        }, Td = t => {
            let s = t.uint32();
            switch (s) {
                case 236446268:
                    return Ie(t);
                case 2009052699:
                    return ve(t);
                case 3920049402:
                    return Ee(t);
                case 3769678894:
                    return ru(t);
                default:
                    throw e(s)
            }
        }, Ud = t => {
            let s = t.uint32();
            switch (s) {
                case 286776671:
                    return Ce();
                case 43446532:
                    return ke(t);
                default:
                    throw e(s)
            }
        }, Rd = t => {
            let s = t.uint32();
            switch (s) {
                case 2941295904:
                    return Pe(t);
                default:
                    throw e(s)
            }
        }, Bd = t => {
            let s = t.uint32();
            switch (s) {
                case 2172921549:
                    return Ae(t);
                default:
                    throw e(s)
            }
        }, Hd = t => {
            let s = t.uint32();
            switch (s) {
                case 2755118061:
                    return Le(t);
                default:
                    throw e(s)
            }
        }, _d = t => {
            let s = t.uint32();
            switch (s) {
                case 4178692500:
                    return je(t);
                default:
                    throw e(s)
            }
        }, Od = t => {
            let s = t.uint32();
            switch (s) {
                case 3489825848:
                    return De(t);
                default:
                    throw e(s)
            }
        }, Fd = t => {
            let s = t.uint32();
            switch (s) {
                case 1444661369:
                    return Te(t);
                default:
                    throw e(s)
            }
        }, Vd = t => {
            let s = t.uint32();
            switch (s) {
                case 522914557:
                    return We(t);
                case 1318109142:
                    return Ye(t);
                case 2718806245:
                    return Qe(t);
                case 1548249383:
                    return Je(t);
                case 2590370335:
                    return Ze(t);
                case 125178264:
                    return Xe(t);
                case 469489699:
                    return ts(t);
                case 2805148531:
                    return es(t);
                case 2503031564:
                    return ss(t);
                case 314359194:
                    return Es(t);
                case 386986326:
                    return Cs(t);
                case 3030575245:
                    return ks(t);
                case 956179895:
                    return Ms(t);
                case 3930787420:
                    return _s(t);
                case 1851755554:
                    return Os(t);
                case 2388564083:
                    return Fs(t);
                case 2163009562:
                    return Qs(t);
                case 3200411887:
                    return Js(t);
                case 3957614617:
                    return ln(t);
                case 3996854058:
                    return gn(t);
                case 314130811:
                    return Cn(t);
                case 2627162079:
                    return Un(t);
                case 791617983:
                    return Rn(t);
                case 2139689491:
                    return Hn(t);
                case 1757493555:
                    return ei(t);
                case 3942934523:
                    return Hi(t);
                case 3067369046:
                    return _i(t);
                case 1656358105:
                    return Oi(t);
                case 856380452:
                    return Fi(t);
                case 3279233481:
                    return Vi(t);
                case 2560699211:
                    return qi(t);
                case 3062896985:
                    return er(t);
                case 1753886890:
                    return rr(t);
                case 196268545:
                    return ar(t);
                case 1135492588:
                    return or();
                case 2473931806:
                    return pr();
                case 1417832080:
                    return $r(t);
                case 239663460:
                    return yr(t);
                case 457133559:
                    return Er(t);
                case 2555978869:
                    return Cr(t);
                case 3879028705:
                    return _r(t);
                case 3825430691:
                    return Fr(t);
                case 4191320666:
                    return Wr(t);
                case 634833351:
                    return ca(t);
                case 3995842921:
                    return ha(t);
                case 1461528386:
                    return ma();
                case 2588027936:
                    return $a();
                case 2720652550:
                    return Ea();
                case 861169551:
                    return Ca();
                case 1081547008:
                    return Ta(t);
                case 1852826908:
                    return vo(t);
                case 4195302562:
                    return Eo(t);
                case 2199371971:
                    return ko(t);
                case 2610053286:
                    return Mo(t);
                case 3771582784:
                    return Go(t);
                case 1563376297:
                    return zo(t);
                case 2869914398:
                    return Wo(t);
                case 1180041828:
                    return $c(t);
                case 1442983757:
                    return yc(t);
                case 3843135853:
                    return qc();
                case 2307472197:
                    return Kc(t);
                case 1887741886:
                    return Gc();
                case 1893427255:
                    return Yc(t);
                case 3781450179:
                    return Xh(t);
                case 1279515160:
                    return vl(t);
                case 3775771465:
                    return El(t);
                case 2896258427:
                    return Jl(t);
                case 1421875280:
                    return cu(t);
                case 422972864:
                    return Su(t);
                case 1786671974:
                    return Gu(t);
                case 3031420848:
                    return Qu(t);
                case 967122427:
                    return sd(t);
                case 2424728814:
                    return nd(t);
                case 2182544291:
                    return hd(t);
                default:
                    throw e(s)
            }
        }, qd = t => {
            let s = t.uint32();
            switch (s) {
                case 2775329342:
                    return ns(t);
                default:
                    throw e(s)
            }
        }, Kd = t => {
            let s = t.uint32();
            switch (s) {
                case 3809980286:
                    return os();
                case 2437922577:
                    return cs(t);
                case 377562760:
                    return hs(t);
                case 2027216577:
                    return ls(t);
                case 1918567619:
                    return us(t);
                case 1957577280:
                    return ds(t);
                case 301019932:
                    return xi(t);
                default:
                    throw e(s)
            }
        }, Gd = t => {
            let s = t.uint32();
            switch (s) {
                case 414687501:
                    return ws(t);
                default:
                    throw e(s)
            }
        }, zd = t => {
            let s = t.uint32();
            switch (s) {
                case 2877210784:
                    return Ss(t);
                case 1006044124:
                    return xs(t);
                case 3363328638:
                    return Ps(t);
                case 4199992886:
                    return As(t);
                case 332848423:
                    return Ls(t);
                default:
                    throw e(s)
            }
        }, Wd = t => {
            let s = t.uint32();
            switch (s) {
                case 3256830334:
                    return Ns();
                case 1248893260:
                    return js(t);
                default:
                    throw e(s)
            }
        }, Yd = t => {
            let s = t.uint32();
            switch (s) {
                case 3977822488:
                    return Ds(t);
                case 594758406:
                    return Ts(t);
                default:
                    throw e(s)
            }
        }, Qd = t => {
            let s = t.uint32();
            switch (s) {
                case 922273905:
                    return qs(t);
                case 2611125441:
                    return Ks(t);
                default:
                    throw e(s)
            }
        }, Jd = t => {
            let s = t.uint32();
            switch (s) {
                case 2681474008:
                    return zs(t);
                case 3033021260:
                    return Ws();
                case 3221737155:
                    return Ys();
                case 3591563503:
                    return Cl();
                default:
                    throw e(s)
            }
        }, Zd = t => {
            let s = t.uint32();
            switch (s) {
                case 381645902:
                    return Zs();
                case 4250847477:
                    return Xs();
                case 2710034031:
                    return tn();
                case 3916839660:
                    return en(t);
                case 3576656887:
                    return sn();
                case 4082227115:
                    return nn(t);
                case 3520285222:
                    return rn(t);
                case 2852968932:
                    return an(t);
                case 393186209:
                    return on();
                case 1653390447:
                    return cn();
                case 3714748232:
                    return wo();
                case 2297593788:
                    return rc();
                case 608050278:
                    return ac(t);
                default:
                    throw e(s)
            }
        }, Xd = t => {
            let s = t.uint32();
            switch (s) {
                case 3157175088:
                    return mn();
                case 1343122938:
                    return br();
                case 1030105979:
                    return fo();
                case 961092808:
                    return Kl();
                case 1777096355:
                    return bu();
                case 2517966829:
                    return Iu();
                case 3516589165:
                    return Nu();
                case 1124062251:
                    return ld();
                default:
                    throw e(s)
            }
        }, tp = t => {
            let s = t.uint32();
            switch (s) {
                case 4294843308:
                    return fn();
                case 1698855810:
                    return wn();
                case 1297858060:
                    return $n(t);
                case 4169726490:
                    return yn();
                case 2339628899:
                    return bn();
                case 209668535:
                    return In(t);
                case 415136107:
                    return Ou(t);
                case 2897086096:
                    return Fu(t);
                default:
                    throw e(s)
            }
        }, ep = t => {
            let s = t.uint32();
            switch (s) {
                case 1815593308:
                    return kn(t);
                case 297109817:
                    return Mn();
                case 1662637586:
                    return Sn(t);
                case 250621158:
                    return xn(t);
                case 2555574726:
                    return Pn(t);
                case 358154344:
                    return An(t);
                case 2550256375:
                    return Sa();
                default:
                    throw e(s)
            }
        }, sp = t => {
            let s = t.uint32();
            switch (s) {
                case 313694676:
                    return jn(t);
                default:
                    throw e(s)
            }
        }, np = t => {
            let s = t.uint32();
            switch (s) {
                case 3943987176:
                    return _n(t);
                case 3313949212:
                    return On(t);
                case 4200915314:
                    return Fn(t);
                case 2240058483:
                    return mo();
                default:
                    throw e(s)
            }
        }, ip = t => {
            let s = t.uint32();
            switch (s) {
                case 2902578717:
                    return qn(t);
                default:
                    throw e(s)
            }
        }, rp = t => {
            let s = t.uint32();
            switch (s) {
                case 1776236393:
                    return Qn();
                case 4230874556:
                    return Jn(t);
                default:
                    throw e(s)
            }
        }, ap = t => {
            let s = t.uint32();
            switch (s) {
                case 1516793212:
                    return Zn(t);
                case 3754096014:
                    return Xn(t);
                default:
                    throw e(s)
            }
        }, op = t => {
            let s = t.uint32();
            switch (s) {
                case 4290128789:
                    return si();
                case 2649203305:
                    return ni(t);
                case 2250033312:
                    return ii(t);
                case 42402760:
                    return ed();
                default:
                    throw e(s)
            }
        }, cp = t => {
            let s = t.uint32();
            switch (s) {
                case 4004802343:
                    return ri(t);
                default:
                    throw e(s)
            }
        }, hp = t => {
            let s = t.uint32();
            switch (s) {
                case 3054118054:
                    return ai(t);
                default:
                    throw e(s)
            }
        }, lp = t => {
            let s = t.uint32();
            switch (s) {
                case 3262826695:
                    return ci(t);
                default:
                    throw e(s)
            }
        }, up = t => {
            let s = t.uint32();
            switch (s) {
                case 2565348666:
                    return hi(t);
                default:
                    throw e(s)
            }
        }, dp = t => {
            let s = t.uint32();
            switch (s) {
                case 2734311552:
                    return li(t);
                case 629866245:
                    return jr(t);
                case 1748655686:
                    return Dr(t);
                case 2976541737:
                    return Tr(t);
                case 4235815743:
                    return Ur(t);
                case 90744648:
                    return Rr(t);
                case 1358175439:
                    return Aa(t);
                case 2950250427:
                    return Do(t);
                case 280464681:
                    return Uu(t);
                case 3492708308:
                    return Ru(t);
                default:
                    throw e(s)
            }
        }, pp = t => {
            let s = t.uint32();
            switch (s) {
                case 2002815875:
                    return ui(t);
                default:
                    throw e(s)
            }
        }, gp = t => {
            let s = t.uint32();
            switch (s) {
                case 2688441221:
                    return di(t);
                case 4094724768:
                    return pi(t);
                case 889353612:
                    return gi(t);
                case 1218642516:
                    return Br(t);
                default:
                    throw e(s)
            }
        }, mp = t => {
            let s = t.uint32();
            switch (s) {
                case 3146955413:
                    return wi(t);
                case 4194588573:
                    return $i(t);
                case 1868782349:
                    return yi(t);
                case 1827637959:
                    return bi(t);
                case 1859134776:
                    return Ii(t);
                case 1692693954:
                    return vi(t);
                case 3177253833:
                    return Ei(t);
                case 2188348256:
                    return Ci(t);
                case 681706865:
                    return ki(t);
                case 1938967520:
                    return Mi(t);
                case 1990644519:
                    return Si(t);
                case 892193368:
                    return aa(t);
                case 546203849:
                    return oa(t);
                case 2607407947:
                    return ch(t);
                case 1280209983:
                    return hh(t);
                case 2622389899:
                    return Vu(t);
                case 3204879316:
                    return qu(t);
                case 34469328:
                    return Ku(t);
                default:
                    throw e(s)
            }
        }, fp = t => {
            let s = t.uint32();
            switch (s) {
                case 4002160262:
                    return Pi();
                case 2951442734:
                    return Ai(t);
                case 707290417:
                    return Pu(t);
                default:
                    throw e(s)
            }
        }, wp = t => {
            let s = t.uint32();
            switch (s) {
                case 367766557:
                    return Wi(t);
                case 2737347181:
                    return Yi(t);
                case 2156729764:
                    return Qi(t);
                case 3435051951:
                    return bc(t);
                case 470789295:
                    return Ic(t);
                default:
                    throw e(s)
            }
        }, $p = t => {
            let s = t.uint32();
            switch (s) {
                case 2013922064:
                    return ir(t);
                default:
                    throw e(s)
            }
        }, yp = t => {
            let s = t.uint32();
            switch (s) {
                case 372165663:
                    return cr(t);
                case 2624914441:
                    return hr(t);
                default:
                    throw e(s)
            }
        }, bp = t => {
            let s = t.uint32();
            switch (s) {
                case 1984755728:
                    return gr(t);
                case 2357159394:
                    return mr(t);
                case 3072515685:
                    return Vr(t);
                case 2324063644:
                    return qr(t);
                case 416402882:
                    return Kr(t);
                default:
                    throw e(s)
            }
        }, Ip = t => {
            let s = t.uint32();
            switch (s) {
                case 295067450:
                    return fr(t);
                case 400266251:
                    return Gr(t);
                default:
                    throw e(s)
            }
        }, vp = t => {
            let s = t.uint32();
            switch (s) {
                case 3962798704:
                    return vr(t);
                default:
                    throw e(s)
            }
        }, Ep = t => {
            let s = t.uint32();
            switch (s) {
                case 1923290508:
                    return Mr();
                case 1948046307:
                    return Sr();
                case 577556219:
                    return xr();
                default:
                    throw e(s)
            }
        }, Cp = t => {
            let s = t.uint32();
            switch (s) {
                case 1035688326:
                    return Pr(t);
                case 3221273506:
                    return Ar(t);
                case 1398007207:
                    return Lr(t);
                case 2869151449:
                    return Nr(t);
                default:
                    throw e(s)
            }
        }, kp = t => {
            let s = t.uint32();
            switch (s) {
                case 2299280777:
                    return zr(t);
                default:
                    throw e(s)
            }
        }, Mp = t => {
            let s = t.uint32();
            switch (s) {
                case 1008755359:
                    return Yr(t);
                default:
                    throw e(s)
            }
        }, Sp = t => {
            let s = t.uint32();
            switch (s) {
                case 3989684315:
                    return Jr(t);
                default:
                    throw e(s)
            }
        }, xp = t => {
            let s = t.uint32();
            switch (s) {
                case 2875595611:
                    return Zr();
                case 344356834:
                    return Xr();
                case 104314861:
                    return ta();
                case 3172442442:
                    return ea();
                case 371037736:
                    return sa();
                case 511092620:
                    return Bc();
                case 2822794409:
                    return ju();
                case 4226728176:
                    return Du();
                default:
                    throw e(s)
            }
        }, Pp = t => {
            let s = t.uint32();
            switch (s) {
                case 4219683473:
                    return na(t);
                default:
                    throw e(s)
            }
        }, Ap = t => {
            let s = t.uint32();
            switch (s) {
                case 453805082:
                    return la(t);
                case 4253970719:
                    return ua(t);
                default:
                    throw e(s)
            }
        }, Lp = t => {
            let s = t.uint32();
            switch (s) {
                case 1678812626:
                    return va(t);
                case 872932635:
                    return ka(t);
                default:
                    throw e(s)
            }
        }, Np = t => {
            let s = t.uint32();
            switch (s) {
                case 2933316530:
                    return Ma(t);
                default:
                    throw e(s)
            }
        }, jp = t => {
            let s = t.uint32();
            switch (s) {
                case 3187238203:
                    return xa(t);
                default:
                    throw e(s)
            }
        }, Dp = t => {
            let s = t.uint32();
            switch (s) {
                case 1493171408:
                    return Na(t);
                default:
                    throw e(s)
            }
        }, Tp = t => {
            let s = t.uint32();
            switch (s) {
                case 3695018575:
                    return Ra();
                case 1950782688:
                    return Ba(t);
                case 1730456516:
                    return Ha(t);
                case 3641877916:
                    return _a(t);
                case 3240501956:
                    return Oa(t);
                case 2616769429:
                    return Fa(t);
                case 1816074681:
                    return Va(t);
                case 1009288385:
                    return qa(t);
                case 3730443734:
                    return Ka(t);
                case 2120376535:
                    return Ga(t);
                case 3983181060:
                    return kl(t);
                case 3355139585:
                    return Ml(t);
                case 55281185:
                    return Sl(t);
                case 483104362:
                    return xl(t);
                case 136105807:
                    return Pl(t);
                case 894777186:
                    return Gl(t);
                default:
                    throw e(s)
            }
        }, Up = t => {
            let s = t.uint32();
            switch (s) {
                case 324435594:
                    return za();
                case 1890305021:
                    return Wa(t);
                case 2415565343:
                    return Ya(t);
                case 3132089824:
                    return Qa(t);
                case 3218105580:
                    return Ja(t);
                case 4046173921:
                    return Za(t);
                case 1182402406:
                    return Xa(t);
                case 3228621118:
                    return to(t);
                case 1216809369:
                    return eo(t);
                case 3676352904:
                    return so();
                case 3456972720:
                    return no(t);
                case 3840442385:
                    return io(t);
                case 641563686:
                    return ro(t);
                case 1329878739:
                    return ao(t);
                case 391759200:
                    return oo(t);
                case 2089805750:
                    return co(t);
                case 972174080:
                    return ho(t);
                case 2826014149:
                    return lo(t);
                case 4065961995:
                    return uo(t);
                case 1705048653:
                    return po(t);
                case 52401552:
                    return go(t);
                case 4011282869:
                    return dc(t);
                case 2151899626:
                    return Hc(t);
                case 504660880:
                    return Al(t);
                case 3209554562:
                    return jl(t);
                case 2592793057:
                    return Hl(t);
                case 1987480557:
                    return _l(t);
                case 370236054:
                    return Fl(t);
                case 2756656886:
                    return Vl(t);
                default:
                    throw e(s)
            }
        }, Rp = t => {
            let s = t.uint32();
            switch (s) {
                case 2246320897:
                    return $o();
                case 3767910816:
                    return yo();
                case 1471006352:
                    return bo();
                case 4210550985:
                    return Io();
                default:
                    throw e(s)
            }
        }, Bp = t => {
            let s = t.uint32();
            switch (s) {
                case 2104790276:
                    return Co(t);
                default:
                    throw e(s)
            }
        }, Hp = t => {
            let s = t.uint32();
            switch (s) {
                case 3408489464:
                    return So(t);
                default:
                    throw e(s)
            }
        }, _p = t => {
            let s = t.uint32();
            switch (s) {
                case 3272254296:
                    return xo(t);
                default:
                    throw e(s)
            }
        }, Op = t => {
            let s = t.uint32();
            switch (s) {
                case 3926049406:
                    return Po(t);
                default:
                    throw e(s)
            }
        }, Fp = t => {
            let s = t.uint32();
            switch (s) {
                case 512535275:
                    return No(t);
                default:
                    throw e(s)
            }
        }, Vp = t => {
            let s = t.uint32();
            switch (s) {
                case 2426158996:
                    return jo(t);
                default:
                    throw e(s)
            }
        }, qp = t => {
            let s = t.uint32();
            switch (s) {
                case 3452074527:
                    return Uo(t);
                default:
                    throw e(s)
            }
        }, Kp = t => {
            let s = t.uint32();
            switch (s) {
                case 475467473:
                    return Ro(t);
                case 4190682310:
                    return mh(t);
                default:
                    throw e(s)
            }
        }, Gp = t => {
            let s = t.uint32();
            switch (s) {
                case 3055631583:
                    return Ko(t);
                default:
                    throw e(s)
            }
        }, zp = t => {
            let s = t.uint32();
            switch (s) {
                case 1399245077:
                    return Yo(t);
                case 462375633:
                    return Qo(t);
                case 2280307539:
                    return Jo(t);
                case 2575058250:
                    return Zo(t);
                case 2269294207:
                    return Xo(t);
                case 1355435489:
                    return tc(t);
                default:
                    throw e(s)
            }
        }, Wp = t => {
            let s = t.uint32();
            switch (s) {
                case 2639009728:
                    return ec(t);
                default:
                    throw e(s)
            }
        }, Yp = t => {
            let s = t.uint32();
            switch (s) {
                case 2730177995:
                    return sc(t);
                default:
                    throw e(s)
            }
        }, Qp = t => {
            let s = t.uint32();
            switch (s) {
                case 3380800186:
                    return lc(t);
                default:
                    throw e(s)
            }
        }, Jp = t => {
            let s = t.uint32();
            switch (s) {
                case 3402727926:
                    return pc(t);
                case 1816636575:
                    return gc(t);
                case 695856818:
                    return mc(t);
                default:
                    throw e(s)
            }
        }, Zp = t => {
            let s = t.uint32();
            switch (s) {
                case 4085629430:
                    return fc(t);
                default:
                    throw e(s)
            }
        }, Xp = t => {
            let s = t.uint32();
            switch (s) {
                case 3873421349:
                    return vc(t);
                case 1427671598:
                    return Ec(t);
                case 1783299128:
                    return Cc(t);
                case 1129042607:
                    return kc(t);
                case 460916654:
                    return Mc(t);
                case 648939889:
                    return Sc(t);
                case 3924306968:
                    return xc(t);
                case 1889215493:
                    return Pc(t);
                case 1121994683:
                    return Ac(t);
                case 405815507:
                    return Lc();
                case 4170676210:
                    return Nc();
                case 3810276568:
                    return jc(t);
                case 3872931198:
                    return Dc(t);
                case 3580323600:
                    return Tc(t);
                case 2982398631:
                    return zc(t);
                case 1599903217:
                    return Qc(t);
                case 771095562:
                    return hu(t);
                case 2399639107:
                    return lu(t);
                case 2725218331:
                    return Tu(t);
                case 241923758:
                    return Ju(t);
                case 1401984889:
                    return Zu(t);
                default:
                    throw e(s)
            }
        }, tg = t => {
            let s = t.uint32();
            switch (s) {
                case 995769920:
                    return Uc(t);
                default:
                    throw e(s)
            }
        }, eg = t => {
            let s = t.uint32();
            switch (s) {
                case 1558266229:
                    return _c(t);
                default:
                    throw e(s)
            }
        }, sg = t => {
            let s = t.uint32();
            switch (s) {
                case 1189204285:
                    return Zc(t);
                case 2377921334:
                    return Xc(t);
                case 2686132985:
                    return th(t);
                case 3947431965:
                    return eh(t);
                case 3154794460:
                    return sh(t);
                default:
                    throw e(s)
            }
        }, ng = t => {
            let s = t.uint32();
            switch (s) {
                case 3402187762:
                    return ah(t);
                default:
                    throw e(s)
            }
        }, ig = t => {
            let s = t.uint32();
            switch (s) {
                case 3849174789:
                    return uh(t);
                case 1363483106:
                    return ku(t);
                default:
                    throw e(s)
            }
        }, rg = t => {
            let s = t.uint32();
            switch (s) {
                case 1648543603:
                    return gh(t);
                default:
                    throw e(s)
            }
        }, ag = t => {
            let s = t.uint32();
            switch (s) {
                case 1679398724:
                    return bh();
                case 3760683618:
                    return Ih(t);
                default:
                    throw e(s)
            }
        }, og = t => {
            let s = t.uint32();
            switch (s) {
                case 2330640067:
                    return vh(t);
                default:
                    throw e(s)
            }
        }, cg = t => {
            let s = t.uint32();
            switch (s) {
                case 2103482845:
                    return Eh(t);
                case 569137759:
                    return Ch(t);
                default:
                    throw e(s)
            }
        }, hg = t => {
            let s = t.uint32();
            switch (s) {
                case 2636808675:
                    return kh();
                case 1034709504:
                    return Mh();
                case 115615172:
                    return Sh();
                case 2698015819:
                    return xh();
                case 2577698595:
                    return Ph();
                case 3420659238:
                    return Ah();
                case 4231435598:
                    return Lh();
                case 2299755533:
                    return Nh();
                case 2340959368:
                    return jh();
                case 2581823594:
                    return Dh();
                case 3926060083:
                    return Th();
                case 3005262555:
                    return Uh();
                case 2386339822:
                    return Rh();
                default:
                    throw e(s)
            }
        }, lg = t => {
            let s = t.uint32();
            switch (s) {
                case 411017418:
                    return Bh(t);
                default:
                    throw e(s)
            }
        }, ug = t => {
            let s = t.uint32();
            switch (s) {
                case 3903065049:
                    return Hh(t);
                case 12467706:
                    return _h(t);
                case 2257201829:
                    return Oh(t);
                case 3845639894:
                    return Fh(t);
                case 2054162547:
                    return Vh(t);
                case 1717706985:
                    return qh(t);
                case 2258466191:
                    return cl(t);
                case 2702460784:
                    return hl(t);
                case 878931416:
                    return ll(t);
                default:
                    throw e(s)
            }
        }, dg = t => {
            let s = t.uint32();
            switch (s) {
                case 871426631:
                    return Kh(t);
                default:
                    throw e(s)
            }
        }, pg = t => {
            let s = t.uint32();
            switch (s) {
                case 3562713238:
                    return sl();
                case 982592842:
                    return ol(t);
                default:
                    throw e(s)
            }
        }, gg = t => {
            let s = t.uint32();
            switch (s) {
                case 4883767:
                    return nl();
                case 3153255840:
                    return il(t);
                case 2252807570:
                    return rl(t);
                default:
                    throw e(s)
            }
        }, mg = t => {
            let s = t.uint32();
            switch (s) {
                case 354925740:
                    return al(t);
                default:
                    throw e(s)
            }
        }, fg = t => {
            let s = t.uint32();
            switch (s) {
                case 2191366618:
                    return ul(t);
                case 41187252:
                    return dl(t);
                default:
                    throw e(s)
            }
        }, wg = t => {
            let s = t.uint32();
            switch (s) {
                case 3235781593:
                    return ml(t);
                default:
                    throw e(s)
            }
        }, $g = t => {
            let s = t.uint32();
            switch (s) {
                case 1064139624:
                    return fl();
                case 3342098026:
                    return wl(t);
                case 736157604:
                    return $l(t);
                case 3072226938:
                    return yl(t);
                case 4148447075:
                    return bl(t);
                case 2579616925:
                    return Il(t);
                default:
                    throw e(s)
            }
        }, yg = t => {
            let s = t.uint32();
            switch (s) {
                case 878078826:
                    return Ll(t);
                default:
                    throw e(s)
            }
        }, bg = t => {
            let s = t.uint32();
            switch (s) {
                case 3770729957:
                    return Nl(t);
                default:
                    throw e(s)
            }
        }, Ig = t => {
            let s = t.uint32();
            switch (s) {
                case 1869903447:
                    return Dl(t);
                default:
                    throw e(s)
            }
        }, vg = t => {
            let s = t.uint32();
            switch (s) {
                case 3106911949:
                    return Tl(t);
                case 635466748:
                    return Ul(t);
                default:
                    throw e(s)
            }
        }, Eg = t => {
            let s = t.uint32();
            switch (s) {
                case 1577484359:
                    return Rl(t);
                case 2564655414:
                    return Bl(t);
                default:
                    throw e(s)
            }
        }, Cg = t => {
            let s = t.uint32();
            switch (s) {
                case 3012615176:
                    return Ol(t);
                default:
                    throw e(s)
            }
        }, kg = t => {
            let s = t.uint32();
            switch (s) {
                case 2928221164:
                    return ql(t);
                default:
                    throw e(s)
            }
        }, Mg = t => {
            let s = t.uint32();
            switch (s) {
                case 1823064809:
                    return Zl(t);
                default:
                    throw e(s)
            }
        }, Sg = t => {
            let s = t.uint32();
            switch (s) {
                case 3578961158:
                    return Xl(t);
                default:
                    throw e(s)
            }
        }, xg = t => {
            let s = t.uint32();
            switch (s) {
                case 997055186:
                    return tu(t);
                default:
                    throw e(s)
            }
        }, Pg = t => {
            let s = t.uint32();
            switch (s) {
                case 1465219162:
                    return eu(t);
                default:
                    throw e(s)
            }
        }, Ag = t => {
            let s = t.uint32();
            switch (s) {
                case 1605510357:
                    return au(t);
                default:
                    throw e(s)
            }
        }, Lg = t => {
            let s = t.uint32();
            switch (s) {
                case 2668758040:
                    return ou(t);
                default:
                    throw e(s)
            }
        }, Ng = t => {
            let s = t.uint32();
            switch (s) {
                case 2704228536:
                    return pu(t);
                default:
                    throw e(s)
            }
        }, jg = t => {
            let s = t.uint32();
            switch (s) {
                case 3527867719:
                    return gu(t);
                default:
                    throw e(s)
            }
        }, Dg = t => {
            let s = t.uint32();
            switch (s) {
                case 3585325561:
                    return fu(t);
                case 594408994:
                    return wu(t);
                default:
                    throw e(s)
            }
        }, Tg = t => {
            let s = t.uint32();
            switch (s) {
                case 3162490573:
                    return vu(t);
                default:
                    throw e(s)
            }
        }, Ug = t => {
            let s = t.uint32();
            switch (s) {
                case 4283715173:
                    return Eu(t);
                default:
                    throw e(s)
            }
        }, Rg = t => {
            let s = t.uint32();
            switch (s) {
                case 3921323624:
                    return Mu(t);
                default:
                    throw e(s)
            }
        }, Bg = t => {
            let s = t.uint32();
            switch (s) {
                case 3216354699:
                    return zu();
                case 547062491:
                    return Wu(t);
                default:
                    throw e(s)
            }
        }, Hg = t => {
            let s = t.uint32();
            switch (s) {
                case 3393592157:
                    return Yu(t);
                default:
                    throw e(s)
            }
        }, _g = t => {
            let s = t.uint32();
            switch (s) {
                case 3497176244:
                    return id(t);
                default:
                    throw e(s)
            }
        }, Og = t => {
            let s = t.uint32();
            switch (s) {
                case 1211967244:
                    return rd();
                case 4158196960:
                    return ad(t);
                default:
                    throw e(s)
            }
        };

    function Fg(t) {
        return parseInt(t) === t
    }

    function Vg(t) {
        if (!Fg(t.length)) return !1;
        for (var e = 0; e < t.length; e++) if (!Fg(t[e]) || t[e] < 0 || t[e] > 255) return !1;
        return !0
    }

    function qg(t, e) {
        if (t instanceof ArrayBuffer && (t = new Uint8Array(t)), t.buffer && ArrayBuffer.isView(t) && t instanceof Uint8Array) return e && (t = t.slice ? t.slice() : Array.prototype.slice.call(t)), t;
        if (Array.isArray(t)) {
            if (!Vg(t)) throw new Error("Array contains invalid value: " + t);
            return new Uint8Array(t)
        }
        if (Fg(t.length) && Vg(t)) return new Uint8Array(t);
        throw new Error("unsupported array-like object")
    }

    function Kg(t) {
        return new Uint8Array(t)
    }

    function Gg(t, e, s, n, i) {
        null == n && null == i || (t = t.slice ? t.slice(n, i) : Array.prototype.slice.call(t, n, i)), e.set(t, s)
    }

    var zg = {16: 10, 24: 12, 32: 14},
        Wg = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188, 99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145],
        Yg = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22],
        Qg = [82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125],
        Jg = [3328402341, 4168907908, 4000806809, 4135287693, 4294111757, 3597364157, 3731845041, 2445657428, 1613770832, 33620227, 3462883241, 1445669757, 3892248089, 3050821474, 1303096294, 3967186586, 2412431941, 528646813, 2311702848, 4202528135, 4026202645, 2992200171, 2387036105, 4226871307, 1101901292, 3017069671, 1604494077, 1169141738, 597466303, 1403299063, 3832705686, 2613100635, 1974974402, 3791519004, 1033081774, 1277568618, 1815492186, 2118074177, 4126668546, 2211236943, 1748251740, 1369810420, 3521504564, 4193382664, 3799085459, 2883115123, 1647391059, 706024767, 134480908, 2512897874, 1176707941, 2646852446, 806885416, 932615841, 168101135, 798661301, 235341577, 605164086, 461406363, 3756188221, 3454790438, 1311188841, 2142417613, 3933566367, 302582043, 495158174, 1479289972, 874125870, 907746093, 3698224818, 3025820398, 1537253627, 2756858614, 1983593293, 3084310113, 2108928974, 1378429307, 3722699582, 1580150641, 327451799, 2790478837, 3117535592, 0, 3253595436, 1075847264, 3825007647, 2041688520, 3059440621, 3563743934, 2378943302, 1740553945, 1916352843, 2487896798, 2555137236, 2958579944, 2244988746, 3151024235, 3320835882, 1336584933, 3992714006, 2252555205, 2588757463, 1714631509, 293963156, 2319795663, 3925473552, 67240454, 4269768577, 2689618160, 2017213508, 631218106, 1269344483, 2723238387, 1571005438, 2151694528, 93294474, 1066570413, 563977660, 1882732616, 4059428100, 1673313503, 2008463041, 2950355573, 1109467491, 537923632, 3858759450, 4260623118, 3218264685, 2177748300, 403442708, 638784309, 3287084079, 3193921505, 899127202, 2286175436, 773265209, 2479146071, 1437050866, 4236148354, 2050833735, 3362022572, 3126681063, 840505643, 3866325909, 3227541664, 427917720, 2655997905, 2749160575, 1143087718, 1412049534, 999329963, 193497219, 2353415882, 3354324521, 1807268051, 672404540, 2816401017, 3160301282, 369822493, 2916866934, 3688947771, 1681011286, 1949973070, 336202270, 2454276571, 201721354, 1210328172, 3093060836, 2680341085, 3184776046, 1135389935, 3294782118, 965841320, 831886756, 3554993207, 4068047243, 3588745010, 2345191491, 1849112409, 3664604599, 26054028, 2983581028, 2622377682, 1235855840, 3630984372, 2891339514, 4092916743, 3488279077, 3395642799, 4101667470, 1202630377, 268961816, 1874508501, 4034427016, 1243948399, 1546530418, 941366308, 1470539505, 1941222599, 2546386513, 3421038627, 2715671932, 3899946140, 1042226977, 2521517021, 1639824860, 227249030, 260737669, 3765465232, 2084453954, 1907733956, 3429263018, 2420656344, 100860677, 4160157185, 470683154, 3261161891, 1781871967, 2924959737, 1773779408, 394692241, 2579611992, 974986535, 664706745, 3655459128, 3958962195, 731420851, 571543859, 3530123707, 2849626480, 126783113, 865375399, 765172662, 1008606754, 361203602, 3387549984, 2278477385, 2857719295, 1344809080, 2782912378, 59542671, 1503764984, 160008576, 437062935, 1707065306, 3622233649, 2218934982, 3496503480, 2185314755, 697932208, 1512910199, 504303377, 2075177163, 2824099068, 1841019862, 739644986],
        Zg = [2781242211, 2230877308, 2582542199, 2381740923, 234877682, 3184946027, 2984144751, 1418839493, 1348481072, 50462977, 2848876391, 2102799147, 434634494, 1656084439, 3863849899, 2599188086, 1167051466, 2636087938, 1082771913, 2281340285, 368048890, 3954334041, 3381544775, 201060592, 3963727277, 1739838676, 4250903202, 3930435503, 3206782108, 4149453988, 2531553906, 1536934080, 3262494647, 484572669, 2923271059, 1783375398, 1517041206, 1098792767, 49674231, 1334037708, 1550332980, 4098991525, 886171109, 150598129, 2481090929, 1940642008, 1398944049, 1059722517, 201851908, 1385547719, 1699095331, 1587397571, 674240536, 2704774806, 252314885, 3039795866, 151914247, 908333586, 2602270848, 1038082786, 651029483, 1766729511, 3447698098, 2682942837, 454166793, 2652734339, 1951935532, 775166490, 758520603, 3000790638, 4004797018, 4217086112, 4137964114, 1299594043, 1639438038, 3464344499, 2068982057, 1054729187, 1901997871, 2534638724, 4121318227, 1757008337, 0, 750906861, 1614815264, 535035132, 3363418545, 3988151131, 3201591914, 1183697867, 3647454910, 1265776953, 3734260298, 3566750796, 3903871064, 1250283471, 1807470800, 717615087, 3847203498, 384695291, 3313910595, 3617213773, 1432761139, 2484176261, 3481945413, 283769337, 100925954, 2180939647, 4037038160, 1148730428, 3123027871, 3813386408, 4087501137, 4267549603, 3229630528, 2315620239, 2906624658, 3156319645, 1215313976, 82966005, 3747855548, 3245848246, 1974459098, 1665278241, 807407632, 451280895, 251524083, 1841287890, 1283575245, 337120268, 891687699, 801369324, 3787349855, 2721421207, 3431482436, 959321879, 1469301956, 4065699751, 2197585534, 1199193405, 2898814052, 3887750493, 724703513, 2514908019, 2696962144, 2551808385, 3516813135, 2141445340, 1715741218, 2119445034, 2872807568, 2198571144, 3398190662, 700968686, 3547052216, 1009259540, 2041044702, 3803995742, 487983883, 1991105499, 1004265696, 1449407026, 1316239930, 504629770, 3683797321, 168560134, 1816667172, 3837287516, 1570751170, 1857934291, 4014189740, 2797888098, 2822345105, 2754712981, 936633572, 2347923833, 852879335, 1133234376, 1500395319, 3084545389, 2348912013, 1689376213, 3533459022, 3762923945, 3034082412, 4205598294, 133428468, 634383082, 2949277029, 2398386810, 3913789102, 403703816, 3580869306, 2297460856, 1867130149, 1918643758, 607656988, 4049053350, 3346248884, 1368901318, 600565992, 2090982877, 2632479860, 557719327, 3717614411, 3697393085, 2249034635, 2232388234, 2430627952, 1115438654, 3295786421, 2865522278, 3633334344, 84280067, 33027830, 303828494, 2747425121, 1600795957, 4188952407, 3496589753, 2434238086, 1486471617, 658119965, 3106381470, 953803233, 334231800, 3005978776, 857870609, 3151128937, 1890179545, 2298973838, 2805175444, 3056442267, 574365214, 2450884487, 550103529, 1233637070, 4289353045, 2018519080, 2057691103, 2399374476, 4166623649, 2148108681, 387583245, 3664101311, 836232934, 3330556482, 3100665960, 3280093505, 2955516313, 2002398509, 287182607, 3413881008, 4238890068, 3597515707, 975967766],
        Xg = [1671808611, 2089089148, 2006576759, 2072901243, 4061003762, 1807603307, 1873927791, 3310653893, 810573872, 16974337, 1739181671, 729634347, 4263110654, 3613570519, 2883997099, 1989864566, 3393556426, 2191335298, 3376449993, 2106063485, 4195741690, 1508618841, 1204391495, 4027317232, 2917941677, 3563566036, 2734514082, 2951366063, 2629772188, 2767672228, 1922491506, 3227229120, 3082974647, 4246528509, 2477669779, 644500518, 911895606, 1061256767, 4144166391, 3427763148, 878471220, 2784252325, 3845444069, 4043897329, 1905517169, 3631459288, 827548209, 356461077, 67897348, 3344078279, 593839651, 3277757891, 405286936, 2527147926, 84871685, 2595565466, 118033927, 305538066, 2157648768, 3795705826, 3945188843, 661212711, 2999812018, 1973414517, 152769033, 2208177539, 745822252, 439235610, 455947803, 1857215598, 1525593178, 2700827552, 1391895634, 994932283, 3596728278, 3016654259, 695947817, 3812548067, 795958831, 2224493444, 1408607827, 3513301457, 0, 3979133421, 543178784, 4229948412, 2982705585, 1542305371, 1790891114, 3410398667, 3201918910, 961245753, 1256100938, 1289001036, 1491644504, 3477767631, 3496721360, 4012557807, 2867154858, 4212583931, 1137018435, 1305975373, 861234739, 2241073541, 1171229253, 4178635257, 33948674, 2139225727, 1357946960, 1011120188, 2679776671, 2833468328, 1374921297, 2751356323, 1086357568, 2408187279, 2460827538, 2646352285, 944271416, 4110742005, 3168756668, 3066132406, 3665145818, 560153121, 271589392, 4279952895, 4077846003, 3530407890, 3444343245, 202643468, 322250259, 3962553324, 1608629855, 2543990167, 1154254916, 389623319, 3294073796, 2817676711, 2122513534, 1028094525, 1689045092, 1575467613, 422261273, 1939203699, 1621147744, 2174228865, 1339137615, 3699352540, 577127458, 712922154, 2427141008, 2290289544, 1187679302, 3995715566, 3100863416, 339486740, 3732514782, 1591917662, 186455563, 3681988059, 3762019296, 844522546, 978220090, 169743370, 1239126601, 101321734, 611076132, 1558493276, 3260915650, 3547250131, 2901361580, 1655096418, 2443721105, 2510565781, 3828863972, 2039214713, 3878868455, 3359869896, 928607799, 1840765549, 2374762893, 3580146133, 1322425422, 2850048425, 1823791212, 1459268694, 4094161908, 3928346602, 1706019429, 2056189050, 2934523822, 135794696, 3134549946, 2022240376, 628050469, 779246638, 472135708, 2800834470, 3032970164, 3327236038, 3894660072, 3715932637, 1956440180, 522272287, 1272813131, 3185336765, 2340818315, 2323976074, 1888542832, 1044544574, 3049550261, 1722469478, 1222152264, 50660867, 4127324150, 236067854, 1638122081, 895445557, 1475980887, 3117443513, 2257655686, 3243809217, 489110045, 2662934430, 3778599393, 4162055160, 2561878936, 288563729, 1773916777, 3648039385, 2391345038, 2493985684, 2612407707, 505560094, 2274497927, 3911240169, 3460925390, 1442818645, 678973480, 3749357023, 2358182796, 2717407649, 2306869641, 219617805, 3218761151, 3862026214, 1120306242, 1756942440, 1103331905, 2578459033, 762796589, 252780047, 2966125488, 1425844308, 3151392187, 372911126],
        tm = [1667474886, 2088535288, 2004326894, 2071694838, 4075949567, 1802223062, 1869591006, 3318043793, 808472672, 16843522, 1734846926, 724270422, 4278065639, 3621216949, 2880169549, 1987484396, 3402253711, 2189597983, 3385409673, 2105378810, 4210693615, 1499065266, 1195886990, 4042263547, 2913856577, 3570689971, 2728590687, 2947541573, 2627518243, 2762274643, 1920112356, 3233831835, 3082273397, 4261223649, 2475929149, 640051788, 909531756, 1061110142, 4160160501, 3435941763, 875846760, 2779116625, 3857003729, 4059105529, 1903268834, 3638064043, 825316194, 353713962, 67374088, 3351728789, 589522246, 3284360861, 404236336, 2526454071, 84217610, 2593830191, 117901582, 303183396, 2155911963, 3806477791, 3958056653, 656894286, 2998062463, 1970642922, 151591698, 2206440989, 741110872, 437923380, 454765878, 1852748508, 1515908788, 2694904667, 1381168804, 993742198, 3604373943, 3014905469, 690584402, 3823320797, 791638366, 2223281939, 1398011302, 3520161977, 0, 3991743681, 538992704, 4244381667, 2981218425, 1532751286, 1785380564, 3419096717, 3200178535, 960056178, 1246420628, 1280103576, 1482221744, 3486468741, 3503319995, 4025428677, 2863326543, 4227536621, 1128514950, 1296947098, 859002214, 2240123921, 1162203018, 4193849577, 33687044, 2139062782, 1347481760, 1010582648, 2678045221, 2829640523, 1364325282, 2745433693, 1077985408, 2408548869, 2459086143, 2644360225, 943212656, 4126475505, 3166494563, 3065430391, 3671750063, 555836226, 269496352, 4294908645, 4092792573, 3537006015, 3452783745, 202118168, 320025894, 3974901699, 1600119230, 2543297077, 1145359496, 387397934, 3301201811, 2812801621, 2122220284, 1027426170, 1684319432, 1566435258, 421079858, 1936954854, 1616945344, 2172753945, 1330631070, 3705438115, 572679748, 707427924, 2425400123, 2290647819, 1179044492, 4008585671, 3099120491, 336870440, 3739122087, 1583276732, 185277718, 3688593069, 3772791771, 842159716, 976899700, 168435220, 1229577106, 101059084, 606366792, 1549591736, 3267517855, 3553849021, 2897014595, 1650632388, 2442242105, 2509612081, 3840161747, 2038008818, 3890688725, 3368567691, 926374254, 1835907034, 2374863873, 3587531953, 1313788572, 2846482505, 1819063512, 1448540844, 4109633523, 3941213647, 1701162954, 2054852340, 2930698567, 134748176, 3132806511, 2021165296, 623210314, 774795868, 471606328, 2795958615, 3031746419, 3334885783, 3907527627, 3722280097, 1953799400, 522133822, 1263263126, 3183336545, 2341176845, 2324333839, 1886425312, 1044267644, 3048588401, 1718004428, 1212733584, 50529542, 4143317495, 235803164, 1633788866, 892690282, 1465383342, 3115962473, 2256965911, 3250673817, 488449850, 2661202215, 3789633753, 4177007595, 2560144171, 286339874, 1768537042, 3654906025, 2391705863, 2492770099, 2610673197, 505291324, 2273808917, 3924369609, 3469625735, 1431699370, 673740880, 3755965093, 2358021891, 2711746649, 2307489801, 218961690, 3217021541, 3873845719, 1111672452, 1751693520, 1094828930, 2576986153, 757954394, 252645662, 2964376443, 1414855848, 3149649517, 370555436],
        em = [1374988112, 2118214995, 437757123, 975658646, 1001089995, 530400753, 2902087851, 1273168787, 540080725, 2910219766, 2295101073, 4110568485, 1340463100, 3307916247, 641025152, 3043140495, 3736164937, 632953703, 1172967064, 1576976609, 3274667266, 2169303058, 2370213795, 1809054150, 59727847, 361929877, 3211623147, 2505202138, 3569255213, 1484005843, 1239443753, 2395588676, 1975683434, 4102977912, 2572697195, 666464733, 3202437046, 4035489047, 3374361702, 2110667444, 1675577880, 3843699074, 2538681184, 1649639237, 2976151520, 3144396420, 4269907996, 4178062228, 1883793496, 2403728665, 2497604743, 1383856311, 2876494627, 1917518562, 3810496343, 1716890410, 3001755655, 800440835, 2261089178, 3543599269, 807962610, 599762354, 33778362, 3977675356, 2328828971, 2809771154, 4077384432, 1315562145, 1708848333, 101039829, 3509871135, 3299278474, 875451293, 2733856160, 92987698, 2767645557, 193195065, 1080094634, 1584504582, 3178106961, 1042385657, 2531067453, 3711829422, 1306967366, 2438237621, 1908694277, 67556463, 1615861247, 429456164, 3602770327, 2302690252, 1742315127, 2968011453, 126454664, 3877198648, 2043211483, 2709260871, 2084704233, 4169408201, 0, 159417987, 841739592, 504459436, 1817866830, 4245618683, 260388950, 1034867998, 908933415, 168810852, 1750902305, 2606453969, 607530554, 202008497, 2472011535, 3035535058, 463180190, 2160117071, 1641816226, 1517767529, 470948374, 3801332234, 3231722213, 1008918595, 303765277, 235474187, 4069246893, 766945465, 337553864, 1475418501, 2943682380, 4003061179, 2743034109, 4144047775, 1551037884, 1147550661, 1543208500, 2336434550, 3408119516, 3069049960, 3102011747, 3610369226, 1113818384, 328671808, 2227573024, 2236228733, 3535486456, 2935566865, 3341394285, 496906059, 3702665459, 226906860, 2009195472, 733156972, 2842737049, 294930682, 1206477858, 2835123396, 2700099354, 1451044056, 573804783, 2269728455, 3644379585, 2362090238, 2564033334, 2801107407, 2776292904, 3669462566, 1068351396, 742039012, 1350078989, 1784663195, 1417561698, 4136440770, 2430122216, 775550814, 2193862645, 2673705150, 1775276924, 1876241833, 3475313331, 3366754619, 270040487, 3902563182, 3678124923, 3441850377, 1851332852, 3969562369, 2203032232, 3868552805, 2868897406, 566021896, 4011190502, 3135740889, 1248802510, 3936291284, 699432150, 832877231, 708780849, 3332740144, 899835584, 1951317047, 4236429990, 3767586992, 866637845, 4043610186, 1106041591, 2144161806, 395441711, 1984812685, 1139781709, 3433712980, 3835036895, 2664543715, 1282050075, 3240894392, 1181045119, 2640243204, 25965917, 4203181171, 4211818798, 3009879386, 2463879762, 3910161971, 1842759443, 2597806476, 933301370, 1509430414, 3943906441, 3467192302, 3076639029, 3776767469, 2051518780, 2631065433, 1441952575, 404016761, 1942435775, 1408749034, 1610459739, 3745345300, 2017778566, 3400528769, 3110650942, 941896748, 3265478751, 371049330, 3168937228, 675039627, 4279080257, 967311729, 135050206, 3635733660, 1683407248, 2076935265, 3576870512, 1215061108, 3501741890],
        sm = [1347548327, 1400783205, 3273267108, 2520393566, 3409685355, 4045380933, 2880240216, 2471224067, 1428173050, 4138563181, 2441661558, 636813900, 4233094615, 3620022987, 2149987652, 2411029155, 1239331162, 1730525723, 2554718734, 3781033664, 46346101, 310463728, 2743944855, 3328955385, 3875770207, 2501218972, 3955191162, 3667219033, 768917123, 3545789473, 692707433, 1150208456, 1786102409, 2029293177, 1805211710, 3710368113, 3065962831, 401639597, 1724457132, 3028143674, 409198410, 2196052529, 1620529459, 1164071807, 3769721975, 2226875310, 486441376, 2499348523, 1483753576, 428819965, 2274680428, 3075636216, 598438867, 3799141122, 1474502543, 711349675, 129166120, 53458370, 2592523643, 2782082824, 4063242375, 2988687269, 3120694122, 1559041666, 730517276, 2460449204, 4042459122, 2706270690, 3446004468, 3573941694, 533804130, 2328143614, 2637442643, 2695033685, 839224033, 1973745387, 957055980, 2856345839, 106852767, 1371368976, 4181598602, 1033297158, 2933734917, 1179510461, 3046200461, 91341917, 1862534868, 4284502037, 605657339, 2547432937, 3431546947, 2003294622, 3182487618, 2282195339, 954669403, 3682191598, 1201765386, 3917234703, 3388507166, 0, 2198438022, 1211247597, 2887651696, 1315723890, 4227665663, 1443857720, 507358933, 657861945, 1678381017, 560487590, 3516619604, 975451694, 2970356327, 261314535, 3535072918, 2652609425, 1333838021, 2724322336, 1767536459, 370938394, 182621114, 3854606378, 1128014560, 487725847, 185469197, 2918353863, 3106780840, 3356761769, 2237133081, 1286567175, 3152976349, 4255350624, 2683765030, 3160175349, 3309594171, 878443390, 1988838185, 3704300486, 1756818940, 1673061617, 3403100636, 272786309, 1075025698, 545572369, 2105887268, 4174560061, 296679730, 1841768865, 1260232239, 4091327024, 3960309330, 3497509347, 1814803222, 2578018489, 4195456072, 575138148, 3299409036, 446754879, 3629546796, 4011996048, 3347532110, 3252238545, 4270639778, 915985419, 3483825537, 681933534, 651868046, 2755636671, 3828103837, 223377554, 2607439820, 1649704518, 3270937875, 3901806776, 1580087799, 4118987695, 3198115200, 2087309459, 2842678573, 3016697106, 1003007129, 2802849917, 1860738147, 2077965243, 164439672, 4100872472, 32283319, 2827177882, 1709610350, 2125135846, 136428751, 3874428392, 3652904859, 3460984630, 3572145929, 3593056380, 2939266226, 824852259, 818324884, 3224740454, 930369212, 2801566410, 2967507152, 355706840, 1257309336, 4148292826, 243256656, 790073846, 2373340630, 1296297904, 1422699085, 3756299780, 3818836405, 457992840, 3099667487, 2135319889, 77422314, 1560382517, 1945798516, 788204353, 1521706781, 1385356242, 870912086, 325965383, 2358957921, 2050466060, 2388260884, 2313884476, 4006521127, 901210569, 3990953189, 1014646705, 1503449823, 1062597235, 2031621326, 3212035895, 3931371469, 1533017514, 350174575, 2256028891, 2177544179, 1052338372, 741876788, 1606591296, 1914052035, 213705253, 2334669897, 1107234197, 1899603969, 3725069491, 2631447780, 2422494913, 1635502980, 1893020342, 1950903388, 1120974935],
        nm = [2807058932, 1699970625, 2764249623, 1586903591, 1808481195, 1173430173, 1487645946, 59984867, 4199882800, 1844882806, 1989249228, 1277555970, 3623636965, 3419915562, 1149249077, 2744104290, 1514790577, 459744698, 244860394, 3235995134, 1963115311, 4027744588, 2544078150, 4190530515, 1608975247, 2627016082, 2062270317, 1507497298, 2200818878, 567498868, 1764313568, 3359936201, 2305455554, 2037970062, 1047239e3, 1910319033, 1337376481, 2904027272, 2892417312, 984907214, 1243112415, 830661914, 861968209, 2135253587, 2011214180, 2927934315, 2686254721, 731183368, 1750626376, 4246310725, 1820824798, 4172763771, 3542330227, 48394827, 2404901663, 2871682645, 671593195, 3254988725, 2073724613, 145085239, 2280796200, 2779915199, 1790575107, 2187128086, 472615631, 3029510009, 4075877127, 3802222185, 4107101658, 3201631749, 1646252340, 4270507174, 1402811438, 1436590835, 3778151818, 3950355702, 3963161475, 4020912224, 2667994737, 273792366, 2331590177, 104699613, 95345982, 3175501286, 2377486676, 1560637892, 3564045318, 369057872, 4213447064, 3919042237, 1137477952, 2658625497, 1119727848, 2340947849, 1530455833, 4007360968, 172466556, 266959938, 516552836, 0, 2256734592, 3980931627, 1890328081, 1917742170, 4294704398, 945164165, 3575528878, 958871085, 3647212047, 2787207260, 1423022939, 775562294, 1739656202, 3876557655, 2530391278, 2443058075, 3310321856, 547512796, 1265195639, 437656594, 3121275539, 719700128, 3762502690, 387781147, 218828297, 3350065803, 2830708150, 2848461854, 428169201, 122466165, 3720081049, 1627235199, 648017665, 4122762354, 1002783846, 2117360635, 695634755, 3336358691, 4234721005, 4049844452, 3704280881, 2232435299, 574624663, 287343814, 612205898, 1039717051, 840019705, 2708326185, 793451934, 821288114, 1391201670, 3822090177, 376187827, 3113855344, 1224348052, 1679968233, 2361698556, 1058709744, 752375421, 2431590963, 1321699145, 3519142200, 2734591178, 188127444, 2177869557, 3727205754, 2384911031, 3215212461, 2648976442, 2450346104, 3432737375, 1180849278, 331544205, 3102249176, 4150144569, 2952102595, 2159976285, 2474404304, 766078933, 313773861, 2570832044, 2108100632, 1668212892, 3145456443, 2013908262, 418672217, 3070356634, 2594734927, 1852171925, 3867060991, 3473416636, 3907448597, 2614737639, 919489135, 164948639, 2094410160, 2997825956, 590424639, 2486224549, 1723872674, 3157750862, 3399941250, 3501252752, 3625268135, 2555048196, 3673637356, 1343127501, 4130281361, 3599595085, 2957853679, 1297403050, 81781910, 3051593425, 2283490410, 532201772, 1367295589, 3926170974, 895287692, 1953757831, 1093597963, 492483431, 3528626907, 1446242576, 1192455638, 1636604631, 209336225, 344873464, 1015671571, 669961897, 3375740769, 3857572124, 2973530695, 3747192018, 1933530610, 3464042516, 935293895, 3454686199, 2858115069, 1863638845, 3683022916, 4085369519, 3292445032, 875313188, 1080017571, 3279033885, 621591778, 1233856572, 2504130317, 24197544, 3017672716, 3835484340, 3247465558, 2220981195, 3060847922, 1551124588, 1463996600],
        im = [4104605777, 1097159550, 396673818, 660510266, 2875968315, 2638606623, 4200115116, 3808662347, 821712160, 1986918061, 3430322568, 38544885, 3856137295, 718002117, 893681702, 1654886325, 2975484382, 3122358053, 3926825029, 4274053469, 796197571, 1290801793, 1184342925, 3556361835, 2405426947, 2459735317, 1836772287, 1381620373, 3196267988, 1948373848, 3764988233, 3385345166, 3263785589, 2390325492, 1480485785, 3111247143, 3780097726, 2293045232, 548169417, 3459953789, 3746175075, 439452389, 1362321559, 1400849762, 1685577905, 1806599355, 2174754046, 137073913, 1214797936, 1174215055, 3731654548, 2079897426, 1943217067, 1258480242, 529487843, 1437280870, 3945269170, 3049390895, 3313212038, 923313619, 679998e3, 3215307299, 57326082, 377642221, 3474729866, 2041877159, 133361907, 1776460110, 3673476453, 96392454, 878845905, 2801699524, 777231668, 4082475170, 2330014213, 4142626212, 2213296395, 1626319424, 1906247262, 1846563261, 562755902, 3708173718, 1040559837, 3871163981, 1418573201, 3294430577, 114585348, 1343618912, 2566595609, 3186202582, 1078185097, 3651041127, 3896688048, 2307622919, 425408743, 3371096953, 2081048481, 1108339068, 2216610296, 0, 2156299017, 736970802, 292596766, 1517440620, 251657213, 2235061775, 2933202493, 758720310, 265905162, 1554391400, 1532285339, 908999204, 174567692, 1474760595, 4002861748, 2610011675, 3234156416, 3693126241, 2001430874, 303699484, 2478443234, 2687165888, 585122620, 454499602, 151849742, 2345119218, 3064510765, 514443284, 4044981591, 1963412655, 2581445614, 2137062819, 19308535, 1928707164, 1715193156, 4219352155, 1126790795, 600235211, 3992742070, 3841024952, 836553431, 1669664834, 2535604243, 3323011204, 1243905413, 3141400786, 4180808110, 698445255, 2653899549, 2989552604, 2253581325, 3252932727, 3004591147, 1891211689, 2487810577, 3915653703, 4237083816, 4030667424, 2100090966, 865136418, 1229899655, 953270745, 3399679628, 3557504664, 4118925222, 2061379749, 3079546586, 2915017791, 983426092, 2022837584, 1607244650, 2118541908, 2366882550, 3635996816, 972512814, 3283088770, 1568718495, 3499326569, 3576539503, 621982671, 2895723464, 410887952, 2623762152, 1002142683, 645401037, 1494807662, 2595684844, 1335535747, 2507040230, 4293295786, 3167684641, 367585007, 3885750714, 1865862730, 2668221674, 2960971305, 2763173681, 1059270954, 2777952454, 2724642869, 1320957812, 2194319100, 2429595872, 2815956275, 77089521, 3973773121, 3444575871, 2448830231, 1305906550, 4021308739, 2857194700, 2516901860, 3518358430, 1787304780, 740276417, 1699839814, 1592394909, 2352307457, 2272556026, 188821243, 1729977011, 3687994002, 274084841, 3594982253, 3613494426, 2701949495, 4162096729, 322734571, 2837966542, 1640576439, 484830689, 1202797690, 3537852828, 4067639125, 349075736, 3342319475, 4157467219, 4255800159, 1030690015, 1155237496, 2951971274, 1757691577, 607398968, 2738905026, 499347990, 3794078908, 1011452712, 227885567, 2818666809, 213114376, 3034881240, 1455525988, 3414450555, 850817237, 1817998408, 3092726480],
        rm = [0, 235474187, 470948374, 303765277, 941896748, 908933415, 607530554, 708780849, 1883793496, 2118214995, 1817866830, 1649639237, 1215061108, 1181045119, 1417561698, 1517767529, 3767586992, 4003061179, 4236429990, 4069246893, 3635733660, 3602770327, 3299278474, 3400528769, 2430122216, 2664543715, 2362090238, 2193862645, 2835123396, 2801107407, 3035535058, 3135740889, 3678124923, 3576870512, 3341394285, 3374361702, 3810496343, 3977675356, 4279080257, 4043610186, 2876494627, 2776292904, 3076639029, 3110650942, 2472011535, 2640243204, 2403728665, 2169303058, 1001089995, 899835584, 666464733, 699432150, 59727847, 226906860, 530400753, 294930682, 1273168787, 1172967064, 1475418501, 1509430414, 1942435775, 2110667444, 1876241833, 1641816226, 2910219766, 2743034109, 2976151520, 3211623147, 2505202138, 2606453969, 2302690252, 2269728455, 3711829422, 3543599269, 3240894392, 3475313331, 3843699074, 3943906441, 4178062228, 4144047775, 1306967366, 1139781709, 1374988112, 1610459739, 1975683434, 2076935265, 1775276924, 1742315127, 1034867998, 866637845, 566021896, 800440835, 92987698, 193195065, 429456164, 395441711, 1984812685, 2017778566, 1784663195, 1683407248, 1315562145, 1080094634, 1383856311, 1551037884, 101039829, 135050206, 437757123, 337553864, 1042385657, 807962610, 573804783, 742039012, 2531067453, 2564033334, 2328828971, 2227573024, 2935566865, 2700099354, 3001755655, 3168937228, 3868552805, 3902563182, 4203181171, 4102977912, 3736164937, 3501741890, 3265478751, 3433712980, 1106041591, 1340463100, 1576976609, 1408749034, 2043211483, 2009195472, 1708848333, 1809054150, 832877231, 1068351396, 766945465, 599762354, 159417987, 126454664, 361929877, 463180190, 2709260871, 2943682380, 3178106961, 3009879386, 2572697195, 2538681184, 2236228733, 2336434550, 3509871135, 3745345300, 3441850377, 3274667266, 3910161971, 3877198648, 4110568485, 4211818798, 2597806476, 2497604743, 2261089178, 2295101073, 2733856160, 2902087851, 3202437046, 2968011453, 3936291284, 3835036895, 4136440770, 4169408201, 3535486456, 3702665459, 3467192302, 3231722213, 2051518780, 1951317047, 1716890410, 1750902305, 1113818384, 1282050075, 1584504582, 1350078989, 168810852, 67556463, 371049330, 404016761, 841739592, 1008918595, 775550814, 540080725, 3969562369, 3801332234, 4035489047, 4269907996, 3569255213, 3669462566, 3366754619, 3332740144, 2631065433, 2463879762, 2160117071, 2395588676, 2767645557, 2868897406, 3102011747, 3069049960, 202008497, 33778362, 270040487, 504459436, 875451293, 975658646, 675039627, 641025152, 2084704233, 1917518562, 1615861247, 1851332852, 1147550661, 1248802510, 1484005843, 1451044056, 933301370, 967311729, 733156972, 632953703, 260388950, 25965917, 328671808, 496906059, 1206477858, 1239443753, 1543208500, 1441952575, 2144161806, 1908694277, 1675577880, 1842759443, 3610369226, 3644379585, 3408119516, 3307916247, 4011190502, 3776767469, 4077384432, 4245618683, 2809771154, 2842737049, 3144396420, 3043140495, 2673705150, 2438237621, 2203032232, 2370213795],
        am = [0, 185469197, 370938394, 487725847, 741876788, 657861945, 975451694, 824852259, 1483753576, 1400783205, 1315723890, 1164071807, 1950903388, 2135319889, 1649704518, 1767536459, 2967507152, 3152976349, 2801566410, 2918353863, 2631447780, 2547432937, 2328143614, 2177544179, 3901806776, 3818836405, 4270639778, 4118987695, 3299409036, 3483825537, 3535072918, 3652904859, 2077965243, 1893020342, 1841768865, 1724457132, 1474502543, 1559041666, 1107234197, 1257309336, 598438867, 681933534, 901210569, 1052338372, 261314535, 77422314, 428819965, 310463728, 3409685355, 3224740454, 3710368113, 3593056380, 3875770207, 3960309330, 4045380933, 4195456072, 2471224067, 2554718734, 2237133081, 2388260884, 3212035895, 3028143674, 2842678573, 2724322336, 4138563181, 4255350624, 3769721975, 3955191162, 3667219033, 3516619604, 3431546947, 3347532110, 2933734917, 2782082824, 3099667487, 3016697106, 2196052529, 2313884476, 2499348523, 2683765030, 1179510461, 1296297904, 1347548327, 1533017514, 1786102409, 1635502980, 2087309459, 2003294622, 507358933, 355706840, 136428751, 53458370, 839224033, 957055980, 605657339, 790073846, 2373340630, 2256028891, 2607439820, 2422494913, 2706270690, 2856345839, 3075636216, 3160175349, 3573941694, 3725069491, 3273267108, 3356761769, 4181598602, 4063242375, 4011996048, 3828103837, 1033297158, 915985419, 730517276, 545572369, 296679730, 446754879, 129166120, 213705253, 1709610350, 1860738147, 1945798516, 2029293177, 1239331162, 1120974935, 1606591296, 1422699085, 4148292826, 4233094615, 3781033664, 3931371469, 3682191598, 3497509347, 3446004468, 3328955385, 2939266226, 2755636671, 3106780840, 2988687269, 2198438022, 2282195339, 2501218972, 2652609425, 1201765386, 1286567175, 1371368976, 1521706781, 1805211710, 1620529459, 2105887268, 1988838185, 533804130, 350174575, 164439672, 46346101, 870912086, 954669403, 636813900, 788204353, 2358957921, 2274680428, 2592523643, 2441661558, 2695033685, 2880240216, 3065962831, 3182487618, 3572145929, 3756299780, 3270937875, 3388507166, 4174560061, 4091327024, 4006521127, 3854606378, 1014646705, 930369212, 711349675, 560487590, 272786309, 457992840, 106852767, 223377554, 1678381017, 1862534868, 1914052035, 2031621326, 1211247597, 1128014560, 1580087799, 1428173050, 32283319, 182621114, 401639597, 486441376, 768917123, 651868046, 1003007129, 818324884, 1503449823, 1385356242, 1333838021, 1150208456, 1973745387, 2125135846, 1673061617, 1756818940, 2970356327, 3120694122, 2802849917, 2887651696, 2637442643, 2520393566, 2334669897, 2149987652, 3917234703, 3799141122, 4284502037, 4100872472, 3309594171, 3460984630, 3545789473, 3629546796, 2050466060, 1899603969, 1814803222, 1730525723, 1443857720, 1560382517, 1075025698, 1260232239, 575138148, 692707433, 878443390, 1062597235, 243256656, 91341917, 409198410, 325965383, 3403100636, 3252238545, 3704300486, 3620022987, 3874428392, 3990953189, 4042459122, 4227665663, 2460449204, 2578018489, 2226875310, 2411029155, 3198115200, 3046200461, 2827177882, 2743944855],
        om = [0, 218828297, 437656594, 387781147, 875313188, 958871085, 775562294, 590424639, 1750626376, 1699970625, 1917742170, 2135253587, 1551124588, 1367295589, 1180849278, 1265195639, 3501252752, 3720081049, 3399941250, 3350065803, 3835484340, 3919042237, 4270507174, 4085369519, 3102249176, 3051593425, 2734591178, 2952102595, 2361698556, 2177869557, 2530391278, 2614737639, 3145456443, 3060847922, 2708326185, 2892417312, 2404901663, 2187128086, 2504130317, 2555048196, 3542330227, 3727205754, 3375740769, 3292445032, 3876557655, 3926170974, 4246310725, 4027744588, 1808481195, 1723872674, 1910319033, 2094410160, 1608975247, 1391201670, 1173430173, 1224348052, 59984867, 244860394, 428169201, 344873464, 935293895, 984907214, 766078933, 547512796, 1844882806, 1627235199, 2011214180, 2062270317, 1507497298, 1423022939, 1137477952, 1321699145, 95345982, 145085239, 532201772, 313773861, 830661914, 1015671571, 731183368, 648017665, 3175501286, 2957853679, 2807058932, 2858115069, 2305455554, 2220981195, 2474404304, 2658625497, 3575528878, 3625268135, 3473416636, 3254988725, 3778151818, 3963161475, 4213447064, 4130281361, 3599595085, 3683022916, 3432737375, 3247465558, 3802222185, 4020912224, 4172763771, 4122762354, 3201631749, 3017672716, 2764249623, 2848461854, 2331590177, 2280796200, 2431590963, 2648976442, 104699613, 188127444, 472615631, 287343814, 840019705, 1058709744, 671593195, 621591778, 1852171925, 1668212892, 1953757831, 2037970062, 1514790577, 1463996600, 1080017571, 1297403050, 3673637356, 3623636965, 3235995134, 3454686199, 4007360968, 3822090177, 4107101658, 4190530515, 2997825956, 3215212461, 2830708150, 2779915199, 2256734592, 2340947849, 2627016082, 2443058075, 172466556, 122466165, 273792366, 492483431, 1047239e3, 861968209, 612205898, 695634755, 1646252340, 1863638845, 2013908262, 1963115311, 1446242576, 1530455833, 1277555970, 1093597963, 1636604631, 1820824798, 2073724613, 1989249228, 1436590835, 1487645946, 1337376481, 1119727848, 164948639, 81781910, 331544205, 516552836, 1039717051, 821288114, 669961897, 719700128, 2973530695, 3157750862, 2871682645, 2787207260, 2232435299, 2283490410, 2667994737, 2450346104, 3647212047, 3564045318, 3279033885, 3464042516, 3980931627, 3762502690, 4150144569, 4199882800, 3070356634, 3121275539, 2904027272, 2686254721, 2200818878, 2384911031, 2570832044, 2486224549, 3747192018, 3528626907, 3310321856, 3359936201, 3950355702, 3867060991, 4049844452, 4234721005, 1739656202, 1790575107, 2108100632, 1890328081, 1402811438, 1586903591, 1233856572, 1149249077, 266959938, 48394827, 369057872, 418672217, 1002783846, 919489135, 567498868, 752375421, 209336225, 24197544, 376187827, 459744698, 945164165, 895287692, 574624663, 793451934, 1679968233, 1764313568, 2117360635, 1933530610, 1343127501, 1560637892, 1243112415, 1192455638, 3704280881, 3519142200, 3336358691, 3419915562, 3907448597, 3857572124, 4075877127, 4294704398, 3029510009, 3113855344, 2927934315, 2744104290, 2159976285, 2377486676, 2594734927, 2544078150],
        cm = [0, 151849742, 303699484, 454499602, 607398968, 758720310, 908999204, 1059270954, 1214797936, 1097159550, 1517440620, 1400849762, 1817998408, 1699839814, 2118541908, 2001430874, 2429595872, 2581445614, 2194319100, 2345119218, 3034881240, 3186202582, 2801699524, 2951971274, 3635996816, 3518358430, 3399679628, 3283088770, 4237083816, 4118925222, 4002861748, 3885750714, 1002142683, 850817237, 698445255, 548169417, 529487843, 377642221, 227885567, 77089521, 1943217067, 2061379749, 1640576439, 1757691577, 1474760595, 1592394909, 1174215055, 1290801793, 2875968315, 2724642869, 3111247143, 2960971305, 2405426947, 2253581325, 2638606623, 2487810577, 3808662347, 3926825029, 4044981591, 4162096729, 3342319475, 3459953789, 3576539503, 3693126241, 1986918061, 2137062819, 1685577905, 1836772287, 1381620373, 1532285339, 1078185097, 1229899655, 1040559837, 923313619, 740276417, 621982671, 439452389, 322734571, 137073913, 19308535, 3871163981, 4021308739, 4104605777, 4255800159, 3263785589, 3414450555, 3499326569, 3651041127, 2933202493, 2815956275, 3167684641, 3049390895, 2330014213, 2213296395, 2566595609, 2448830231, 1305906550, 1155237496, 1607244650, 1455525988, 1776460110, 1626319424, 2079897426, 1928707164, 96392454, 213114376, 396673818, 514443284, 562755902, 679998e3, 865136418, 983426092, 3708173718, 3557504664, 3474729866, 3323011204, 4180808110, 4030667424, 3945269170, 3794078908, 2507040230, 2623762152, 2272556026, 2390325492, 2975484382, 3092726480, 2738905026, 2857194700, 3973773121, 3856137295, 4274053469, 4157467219, 3371096953, 3252932727, 3673476453, 3556361835, 2763173681, 2915017791, 3064510765, 3215307299, 2156299017, 2307622919, 2459735317, 2610011675, 2081048481, 1963412655, 1846563261, 1729977011, 1480485785, 1362321559, 1243905413, 1126790795, 878845905, 1030690015, 645401037, 796197571, 274084841, 425408743, 38544885, 188821243, 3613494426, 3731654548, 3313212038, 3430322568, 4082475170, 4200115116, 3780097726, 3896688048, 2668221674, 2516901860, 2366882550, 2216610296, 3141400786, 2989552604, 2837966542, 2687165888, 1202797690, 1320957812, 1437280870, 1554391400, 1669664834, 1787304780, 1906247262, 2022837584, 265905162, 114585348, 499347990, 349075736, 736970802, 585122620, 972512814, 821712160, 2595684844, 2478443234, 2293045232, 2174754046, 3196267988, 3079546586, 2895723464, 2777952454, 3537852828, 3687994002, 3234156416, 3385345166, 4142626212, 4293295786, 3841024952, 3992742070, 174567692, 57326082, 410887952, 292596766, 777231668, 660510266, 1011452712, 893681702, 1108339068, 1258480242, 1343618912, 1494807662, 1715193156, 1865862730, 1948373848, 2100090966, 2701949495, 2818666809, 3004591147, 3122358053, 2235061775, 2352307457, 2535604243, 2653899549, 3915653703, 3764988233, 4219352155, 4067639125, 3444575871, 3294430577, 3746175075, 3594982253, 836553431, 953270745, 600235211, 718002117, 367585007, 484830689, 133361907, 251657213, 2041877159, 1891211689, 1806599355, 1654886325, 1568718495, 1418573201, 1335535747, 1184342925];

    function hm(t) {
        for (var e = [], s = 0; s < t.length; s += 4) e.push(t[s] << 24 | t[s + 1] << 16 | t[s + 2] << 8 | t[s + 3]);
        return e
    }

    var lm = function (t) {
        Object.defineProperty(this, "key", {value: qg(t, !0)}), this._prepare()
    };
    lm.prototype._prepare = function () {
        var t = zg[this.key.length];
        if (null == t) throw new Error("invalid key size (must be 16, 24 or 32 bytes)");
        this._Ke = [], this._Kd = [];
        for (var e = 0; e <= t; e++) this._Ke.push([0, 0, 0, 0]), this._Kd.push([0, 0, 0, 0]);
        var s, n = 4 * (t + 1), i = this.key.length / 4, r = hm(this.key);
        for (e = 0; e < i; e++) s = e >> 2, this._Ke[s][e % 4] = r[e], this._Kd[t - s][e % 4] = r[e];
        for (var a, o = 0, c = i; c < n;) {
            if (a = r[i - 1], r[0] ^= Yg[a >> 16 & 255] << 24 ^ Yg[a >> 8 & 255] << 16 ^ Yg[255 & a] << 8 ^ Yg[a >> 24 & 255] ^ Wg[o] << 24, o += 1, 8 != i) for (e = 1; e < i; e++) r[e] ^= r[e - 1]; else {
                for (e = 1; e < i / 2; e++) r[e] ^= r[e - 1];
                a = r[i / 2 - 1], r[i / 2] ^= Yg[255 & a] ^ Yg[a >> 8 & 255] << 8 ^ Yg[a >> 16 & 255] << 16 ^ Yg[a >> 24 & 255] << 24;
                for (e = i / 2 + 1; e < i; e++) r[e] ^= r[e - 1]
            }
            for (e = 0; e < i && c < n;) h = c >> 2, l = c % 4, this._Ke[h][l] = r[e], this._Kd[t - h][l] = r[e++], c++
        }
        for (var h = 1; h < t; h++) for (var l = 0; l < 4; l++) a = this._Kd[h][l], this._Kd[h][l] = rm[a >> 24 & 255] ^ am[a >> 16 & 255] ^ om[a >> 8 & 255] ^ cm[255 & a]
    }, lm.prototype.encrypt = function (t) {
        if (16 != t.length) throw new Error("invalid plaintext size (must be 16 bytes)");
        for (var e = this._Ke.length - 1, s = [0, 0, 0, 0], n = hm(t), i = 0; i < 4; i++) n[i] ^= this._Ke[0][i];
        for (var r = 1; r < e; r++) {
            for (i = 0; i < 4; i++) s[i] = Jg[n[i] >> 24 & 255] ^ Zg[n[(i + 1) % 4] >> 16 & 255] ^ Xg[n[(i + 2) % 4] >> 8 & 255] ^ tm[255 & n[(i + 3) % 4]] ^ this._Ke[r][i];
            n = s.slice()
        }
        var a, o = Kg(16);
        for (i = 0; i < 4; i++) a = this._Ke[e][i], o[4 * i] = 255 & (Yg[n[i] >> 24 & 255] ^ a >> 24), o[4 * i + 1] = 255 & (Yg[n[(i + 1) % 4] >> 16 & 255] ^ a >> 16), o[4 * i + 2] = 255 & (Yg[n[(i + 2) % 4] >> 8 & 255] ^ a >> 8), o[4 * i + 3] = 255 & (Yg[255 & n[(i + 3) % 4]] ^ a);
        return o
    }, lm.prototype.decrypt = function (t) {
        if (16 != t.length) throw new Error("invalid ciphertext size (must be 16 bytes)");
        for (var e = this._Kd.length - 1, s = [0, 0, 0, 0], n = hm(t), i = 0; i < 4; i++) n[i] ^= this._Kd[0][i];
        for (var r = 1; r < e; r++) {
            for (i = 0; i < 4; i++) s[i] = em[n[i] >> 24 & 255] ^ sm[n[(i + 3) % 4] >> 16 & 255] ^ nm[n[(i + 2) % 4] >> 8 & 255] ^ im[255 & n[(i + 1) % 4]] ^ this._Kd[r][i];
            n = s.slice()
        }
        var a, o = Kg(16);
        for (i = 0; i < 4; i++) a = this._Kd[e][i], o[4 * i] = 255 & (Qg[n[i] >> 24 & 255] ^ a >> 24), o[4 * i + 1] = 255 & (Qg[n[(i + 3) % 4] >> 16 & 255] ^ a >> 16), o[4 * i + 2] = 255 & (Qg[n[(i + 2) % 4] >> 8 & 255] ^ a >> 8), o[4 * i + 3] = 255 & (Qg[255 & n[(i + 1) % 4]] ^ a);
        return o
    };

    class um {
        constructor(t) {
            this.setBytes(t)
        }

        setBytes(t) {
            t = qg(t, !0), this._counter = t
        }

        increment() {
            for (var t = 15; t >= 0; t--) {
                if (255 !== this._counter[t]) {
                    this._counter[t]++;
                    break
                }
                this._counter[t] = 0
            }
        }
    }

    class dm {
        constructor(t, e) {
            this.description = "Counter", this.name = "ctr", e instanceof um || (e = new um(e)), this._counter = e, this._remainingCounter = null, this._remainingCounterIndex = 16, this._aes = new lm(t)
        }

        encrypt(t) {
            var e = qg(t, !0);
            for (let t = 0; t < e.length; t++) 16 === this._remainingCounterIndex && (this._remainingCounter = this._aes.encrypt(this._counter._counter), this._remainingCounterIndex = 0, this._counter.increment()), e[t] ^= this._remainingCounter[this._remainingCounterIndex++];
            return e
        }
    }

    function pm(t, e, s = 0) {
        for (var n = 0; n < 16; n++) t[s + n] ^= e[n]
    }

    dm.prototype.decrypt = dm.prototype.encrypt;

    async function gm(t) {
        return new Uint8Array(await crypto.subtle.digest("SHA-1", t))
    }

    async function mm(t) {
        return new Uint8Array(await crypto.subtle.digest("SHA-256", t))
    }

    function fm(...t) {
        const e = [], s = [""];
        let n = !1;
        for (let i of t) if (i.byteLength) {
            let t = [], r = new Uint8Array(i);
            for (let e = 0; e < r.byteLength; e++) t.push((r[e] < 16 ? "0" : "") + r[e].toString(16));
            s[0] += "%c" + t.join(" ") + " ", s.push("color: #ff5000"), e.push(t.join(" ")), n = !0
        } else s[0] += i + " ", e.push(i + "");
        n ? console.log(...s) : console.log(...t), document.getElementsByClassName("console")[0].innerHTML += e.join(" ") + "\n"
    }

    function wm(t) {
        const e = new Uint8Array(t);
        return crypto.getRandomValues(e), e
    }

    function $m(t) {
        const e = new Array(t.byteLength);
        for (let s = 0; s < t.byteLength; s++) e[s] = t[s] < 16 ? "0" + t[s].toString(16) : t[s].toString(16);
        return bigInt(e.join(""), 16)
    }

    function ym(t, e) {
        return bm(t.toString(16), e)
    }

    function bm(t, e) {
        for (e || (e = Math.ceil(t.length / 2)); t.length < 2 * e;) t = "0" + t;
        const s = new Uint8Array(e);
        for (let n = 0; n < e; n++) s[n] = parseInt(t.slice(2 * n, 2 * n + 2), 16);
        return s
    }

    lm.Counter = um, lm.CTR = dm, lm.IGE = class {
        constructor(t, e) {
            this.description = "Infinite Garble Extension", this.name = "ige", this._aes = new lm(t), this._iv = e, this._ivp = null
        }

        encrypt(t) {
            if (t.length % 16 != 0) throw new Error("invalid plaintext size (must be multiple of 16 bytes)");
            const e = Kg(t.length);
            let s = Kg(16);
            null === this._ivp && (this._ivp = this._iv.slice(0, 16), this._iv2p = this._iv.slice(16, 32));
            for (let n = 0; n < t.length; n += 16) {
                const i = t.slice(n, n + 16);
                Gg(t, s, 0, n, n + 16), pm(s, this._ivp), pm(s = this._aes.encrypt(s), this._iv2p), Gg(s, e, n), this._ivp = e.slice(n, n + 16), this._iv2p = i
            }
            return e
        }

        decrypt(t) {
            if (t.length % 16 != 0) throw new Error("invalid ciphertext size (must be multiple of 16 bytes)");
            const e = Kg(t.length);
            let s = Kg(16);
            null === this._ivp && (this._ivp = this._iv.slice(0, 16), this._iv2p = this._iv.slice(16, 32));
            for (let n = 0; n < t.length; n += 16) {
                const i = t.slice(n, n + 16);
                Gg(t, s, 0, n, n + 16), pm(s, this._iv2p), pm(s = this._aes.decrypt(s), this._ivp), Gg(s, e, n), this._ivp = i, this._iv2p = e.slice(n, n + 16)
            }
            return e
        }
    };
    const Im = "0123456789ABCDEF";

    function vm(t) {
        const e = new Array(2 * t.byteLength);
        for (let s = 0; s < t.byteLength; s++) e[2 * s] = Im[t[s] >> 4], e[2 * s + 1] = Im[15 & t[s]];
        return e.join("")
    }

    function Em(t, e) {
        if (t.byteLength != e.byteLength) return !1;
        for (var s = 0; s < t.byteLength; s++) if (t[s] != t[s]) return !1;
        return !0
    }

    function Cm(...t) {
        let e = 0;
        for (let s of t) "number" == typeof s ? e = Math.ceil(e / s) * s : e += s.byteLength;
        let s = new Uint8Array(e), n = 0;
        for (let i of t) "number" == typeof i ? s.set(wm(e - n), n) : (s.set(i instanceof ArrayBuffer ? new Uint8Array(i) : i, n), n += i.byteLength);
        return s
    }

    function km(t, e) {
        let s = new Uint8Array(t.byteLength);
        for (let n = 0; n < t.byteLength; n++) s[n] = t[n] ^ e[n];
        return s
    }

    async function Mm(t, e, s) {
        const n = s ? 8 : 0, i = await mm(Cm(e, t.slice(n, 36 + n))), r = await mm(Cm(t.slice(40 + n, 76 + n), e)),
            a = Cm(i.slice(0, 8), r.slice(8, 24), i.slice(24, 32)),
            o = Cm(r.slice(0, 8), i.slice(8, 24), r.slice(24, 32));
        return new lm.IGE(a, o)
    }

    let Sm = window.tlRepr = function (t, e = 1) {
        if (t.$) {
            let s = t.$.name;
            for (let n in t) "$" != n && (s += "\n" + "  ".repeat(e) + n + " → " + Sm(t[n], e + 1));
            return s
        }
        if (t instanceof Array) {
            let s = "vector[" + t.length + "]";
            for (let n = 0; n < t.length; n++) s += "\n" + "  ".repeat(e) + "#" + n + " → " + Sm(t[n], e + 1);
            return s
        }
        if (t && void 0 !== t.byteLength) {
            const e = [];
            for (let s = 0; s < t.byteLength; s++) e.push((t[s] < 16 ? "0" : "") + t[s].toString(16));
            return e.join(" ")
        }
        return "string" == typeof t ? "`" + t + "`" : t && t.toString ? t.toString() : t + ""
    };
    const xm = mm, Pm = (t, e) => mm(Cm(e, t, e)), Am = async (t, e, s) => await Pm(await async function (t, e, s, n) {
        return new Uint8Array(await crypto.subtle.deriveBits({
            name: "PBKDF2",
            hash: t,
            salt: s,
            iterations: n
        }, await crypto.subtle.importKey("raw", e, {name: "PBKDF2"}, !1, ["deriveBits"]), 512))
    }("SHA-512", await (async (t, e, s) => await Pm(await Pm(t, e), s))(t, e, s), e, 1e5), s);
    const Lm = document.createElement("div");
    Lm.style.overflowY = "scroll", document.body.appendChild(Lm);
    const Nm = Lm.offsetWidth - Lm.clientWidth;
    Lm.remove();
    const jm = "PointerEvent" in window, Dm = new WeakMap;

    function Tm(t) {
        return document.getElementsByClassName(t)[0]
    }

    function Um(t) {
        return t instanceof Node || (t = Tm(t)), Dm.get(t)
    }

    function Rm(t) {
        t.rippleEl = t.createPart(t.el, "ripple"), t.rippleEl.className = "a-ripple", t.rippleWaveEl = null, t.on("mousedown", (function (e) {
            t.rippleWaveEl && t.rippleWaveEl.remove();
            const s = t.el.getBoundingClientRect(), n = Math.min(t.el.offsetHeight, t.el.offsetWidth, 100),
                i = t.rippleWaveEl = document.createElement("div");
            i.className = "a-ripple__wave", i.style.width = n + "px", i.style.height = n + "px", i.style.left = e.clientX - s.left - n / 2 + "px", i.style.top = e.clientY - s.top - n / 2 + "px", t.rippleEl.appendChild(i), t.listenOnce(i, "animationend", () => {
                t.rippleWaveEl.remove()
            })
        }))
    }

    const Bm = 36;

    function Hm(t, e) {
        let s;
        t.scrollThumbEl = t.createPart(e.parentNode, "scroll-thumb"), t.scrollThumbEl.className = "a-scroll__thumb", e.style.marginRight = `${-Nm}px`;
        const n = n => {
            const i = (n.screenY - s.initY) / s.initK;
            t.onScrollPosUpdated ? t.onScrollPosUpdated(s.initScrollTop + i, s.initScrollBottom - i) : e.scrollTop = s.initScrollTop + i
        }, i = e => {
            t.unlisten(s.scrollListener), t.unlisten(s.stopListener), jm && t.scrollThumbEl.releasePointerCapture(e.pointerId), s = null
        }, r = (t, e) => {
            const s = Math.min(e / t, 1);
            let n = Math.min(Math.max(e * s, Bm), e);
            return {k: (e - n) / (t - e), thumbHeight: n}
        }, a = s => {
            const {k: n, thumbHeight: i} = r(e.scrollHeight, e.clientHeight);
            t.scrollThumbEl.style.height = `${i}px`, t.scrollThumbEl.style.top = `${e.offsetTop + e.scrollTop * n}px`, t.scrollThumbEl.classList.toggle("is-hidden", e.scrollHeight <= e.clientHeight)
        };
        t.listen(t.scrollThumbEl, jm ? "pointerdown" : "mousedown", a => {
            const {k: o} = r(e.scrollHeight, e.clientHeight);
            s = {
                scrollListener: t.listen(jm ? t.scrollThumbEl : document, jm ? "pointermove" : "mousemove", n),
                stopListener: t.listen(jm ? t.scrollThumbEl : document, jm ? "pointerup" : "mouseup", i),
                initY: a.screenY,
                initK: o,
                initScrollTop: e.scrollTop,
                initScrollBottom: e.scrollHeight - e.scrollTop
            }, jm && t.scrollThumbEl.setPointerCapture(a.pointerId), a.preventDefault(), a.stopPropagation()
        }), t.listen(e, "scroll", a), t.on("scrolled", a)
    }

    class _m {
        constructor(t, e = {}, s) {
            var n, i;
            this.app = t, !s || this.template && this.template.children.length > s.children.length ? (this.el = this.template.cloneNode(!0), s && (this.el.className = s.className, s.parentNode.replaceChild(this.el, s))) : this.el = s, this.constructor.componentName && this.el.classList.add(this.constructor.componentName), this.classList = this.el.classList, this.listeners = [], this.watchers = [], _m.initComponents(t, this.el), n = this.el, i = this, Dm.set(n, i)
        }

        init() {
        }

        get template() {
            return this.constructor.template
        }

        parts(t) {
            const e = this.constructor.componentName;
            return this.el.getElementsByClassName(e + "__" + t)
        }

        part(t) {
            return this.parts(t)[0]
        }

        component(t) {
            return Um(this.part(t))
        }

        createPart(t, e, s = "div") {
            const n = document.createElement(s);
            return n.className = this.constructor.componentName + "__" + e, t.appendChild(n), n
        }

        emit(t, ...e) {
            for (let {eventName: s, listener: n} of this.listeners) if (t == s) {
                let t = n(...e);
                if (void 0 !== t) return t
            }
        }

        listen(t, e, s, n = !0) {
            let i = {part: t, eventName: e, listener: s.bind(this), params: n};
            return this.listeners.push(i), t && t.addEventListener(e, i.listener, n), i
        }

        unlisten({part: t, eventName: e, listener: s, params: n}) {
            t.removeEventListener(e, s, n)
        }

        listenOnce(t, e, s, n = !0) {
            let i = (...n) => {
                s.apply(this, n), t.removeEventListener(e, i);
                const a = this.listeners.indexOf(r, 1);
                a > -1 && this.listeners.splice(a)
            }, r = this.listen(t, e, i, n);
            return r
        }

        on(...t) {
            this.listen(this.el, ...t)
        }

        watch(t, e, ...s) {
            const n = {storage: t, id: e, watcher: this.app[t].watch(e, ...s)};
            return this.watchers.push(n), n
        }

        unwatch(t) {
            for (let {storage: e, id: s, watcher: n} of t) this.app[e].unwatch(s, [n])
        }

        watchUser(...t) {
            return this.watch("users", ...t)
        }

        watchChat(...t) {
            return this.watch("chats", ...t)
        }

        watchMessage(...t) {
            return this.watch("messages", ...t)
        }

        watchDialog(...t) {
            return this.watch("dialogs", ...t)
        }

        destroy() {
            for (let {part: t, eventName: e, listener: s} of this.listeners) t && t.removeEventListener(e, s);
            this.unwatch(this.watchers), this.el.remove()
        }
    }

    _m.initComponents = (t, e = document) => {
        const s = [];
        for (let n in _m.components) {
            let i = e.getElementsByClassName(n);
            for (let e of i) Um(e) || s.push(new _m.components[n](t, e.dataset, e))
        }
        for (let t of s) t.init()
    };
    const Om = Math.min(200, .5 * Math.min(innerWidth, innerHeight));

    class Fm extends _m {
        constructor(t, e, s) {
            super(t, e, s), this.contentEl = this.createPart(this.el, "items"), Hm(this, this.contentEl), this.isOpen = !1, this.trigger = e.trigger || "click", this.triggerNode = e.triggerNode || this.el.parentNode, this.triggerNode && ("focus" == this.trigger ? (this.listen(this.triggerNode, "click", this.toggle.bind(this, !0)), this.listen(this.triggerNode, "focus", this.toggle.bind(this, !0)), this.listen(this.triggerNode, "blur", this.toggle.bind(this, !1)), this.listen(this.triggerNode, "keydown", t => {
                "Escape" == t.key && this.toggle(!1)
            }, !0)) : (this.listen(document, "click", this.toggle.bind(this, !1), !1), this.listen(this.triggerNode, "click", t => {
                t.stopPropagation(), this.toggle()
            }, !1)))
        }

        toggle(t) {
            this.onMouseMove && this.unlisten(this.onMouseMove), this.isOpen = !0 === t || !1 === t ? t : !this.isOpen, this.el.parentNode.classList.toggle("is-menu-open", this.isOpen), this.el.classList.toggle("is-active", this.isOpen), this.isOpen && "click" == this.trigger && (this.onMouseMove = this.listen(document, "mousemove", t => {
                const e = this.el.getBoundingClientRect(),
                    s = t.clientX < e.left ? e.left - t.clientX : t.clientX > e.right ? t.clientX - e.right : 0,
                    n = t.clientY < e.top ? e.top - t.clientY : t.clientY > e.bottom ? t.clientY - e.bottom : 0;
                Math.hypot(s, n) > Om && this.toggle(!1)
            }))
        }
    }

    class Vm extends _m {
        constructor(t, {peerId: e}, s) {
            super(t, {peerId: e}, s);
            const {dialogs: n, messages: i, users: r, chats: a} = t;
            this.peerId = e;
            const o = n.get(e, "peer");
            this.photoEl = this.part("photo"), this.onlineIndicatorEl = this.part("online-indicator"), this.titleEl = this.part("title"), this.readIconEl = this.part("read-icon"), this.timeEl = this.part("time"), this.authorEl = this.part("author"), this.contentEl = this.part("content"), this.unreadCountEl = this.part("unread-count"), this.pinnedIconEl = this.part("pinned-icon"), Rm(this), this.watchDialog(e, ["unreadCount", "isPinned"], (t, e) => {
                t ? (this.unreadCountEl.textContent = t, this.unreadCountEl.classList.add("is-active")) : e ? (this.unreadCountEl.textContent = "", this.unreadCountEl.classList.add("is-active", "is-pinned")) : this.unreadCountEl.classList.remove("is-active")
            }), this.watchDialog(e, ["topMessage", "readOutboxMaxId"], (t, e) => {
                this.readIconEl.classList.toggle("is-read", e >= t)
            });
            let c = [], h = "", l = "";
            if (this.watchDialog(e, ["topMessage"], s => {
                const {isOut: n, fromId: a, date: u} = i.get(`${e}_${s}`);
                this.unwatch(c), this.readIconEl.classList.toggle("is-active", !!n), this.timeEl.textContent = this.app.formatDate(u), o.$ != At && (h = r.get(a, "isSelf") ? "You" : r.get(a, "firstName")), c = [this.watchMessage(`${e}_${s}`, ["isSending"], t => {
                    this.readIconEl.classList.toggle("is-sending", !!t)
                }), this.watchMessage(`${e}_${s}`, ["isFailed"], t => {
                    this.readIconEl.classList.toggle("is-failed", !!t)
                }), this.watchMessage(`${e}_${s}`, ["message", "media"], (e, s) => {
                    l = !l && s ? t.formatMediaDescription(s) : e, this.authorEl.textContent = h, this.contentEl.textContent = l
                })]
            }), this.watchDialog(e, ["notifySettings"], t => {
                this.el.classList.toggle("is-muted", !t || !!t.isSilent || !!t.muteUntil)
            }), o.$ == At) {
                const t = o.userId;
                r.get(t, "isSelf") ? (this.el.classList.add("is-self"), this.titleEl.textContent = "Saved Messages") : (this.watchUser(t, ["firstName", "lastName", "isDeleted"], this.app.userNameUpdater(this.titleEl)), this.watchUser(t, ["photo", "firstName", "lastName", "title", "isDeleted"], this.app.peerPhotoUpdater(this.photoEl, this.peerId)), this.watchUser(t, ["status"], t => {
                    t && this.onlineIndicatorEl.classList.toggle("is-active", t.$ == Gt)
                }), this.watchUser(t, ["typing"], t => {
                    this.contentEl.textContent = t ? "typing…" : l
                }))
            } else {
                this.authorEl.classList.add("is-active");
                const e = o.chatId || o.channelId, s = a.get(e);
                this.authorEl.classList.toggle("is-active", o.$ == Lt || s.isMegagroup), this.watchChat(e, ["title"], t => {
                    this.titleEl.textContent = t
                }), this.watchChat(e, ["photo", "firstName", "lastName", "title", "isDeleted"], this.app.peerPhotoUpdater(this.photoEl, this.peerId)), this.watchChat(e, ["typing"], e => {
                    const s = t.formatTyping(e);
                    s ? (this.authorEl.textContent = s, this.contentEl.textContent = "typing…") : (this.authorEl.textContent = h, this.contentEl.textContent = l)
                })
            }
        }

        updateNeighbours({peerId: t}, {peerId: e}) {
            const s = this.app.dialogs.get(this.peerId), n = this.app.dialogs.get(e);
            n && s.isPinned != n.isPinned ? (this.delimiterEl = this.createPart(this.el, "delimiter"), this.el.parentNode.insertBefore(this.delimiterEl, this.el.nextSibling)) : this.delimiterEl && this.killSiblings()
        }

        getTopmostSibling() {
            return this.el
        }

        getBottommostSibling() {
            return this.delimiterEl || this.el
        }

        killSiblings() {
            this.delimiterEl && (this.delimiterEl.remove(), delete this.delimiterEl)
        }
    }

    const qm = "http://www.w3.org/2000/svg", Km = 60,
        Gm = "(?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\u0023-\\u0039]\\ufe0f?\\u20e3|\\u3299|\\u3297|\\u303d|\\u3030|\\u24c2|\\ud83c[\\udd70-\\udd71]|\\ud83c[\\udd7e-\\udd7f]|\\ud83c\\udd8e|\\ud83c[\\udd91-\\udd9a]|\\ud83c[\\udde6-\\uddff]|[\\ud83c[\\ude01\\uddff]|\\ud83c[\\ude01-\\ude02]|\\ud83c\\ude1a|\\ud83c\\ude2f|[\\ud83c[\\ude32\\ude02]|\\ud83c\\ude1a|\\ud83c\\ude2f|\\ud83c[\\ude32-\\ude3a]|[\\ud83c[\\ude50\\ude3a]|\\ud83c[\\ude50-\\ude51]|\\u203c|\\u2049|[\\u25aa-\\u25ab]|\\u25b6|\\u25c0|[\\u25fb-\\u25fe]|\\u00a9|\\u00ae|\\u2122|\\u2139|\\ud83c\\udc04|[\\u2600-\\u26FF]|\\u2b05|\\u2b06|\\u2b07|\\u2b1b|\\u2b1c|\\u2b50|\\u2b55|\\u231a|\\u231b|\\u2328|\\u23cf|[\\u23e9-\\u23f3]|[\\u23f8-\\u23fa]|\\ud83c\\udccf|\\u2934|\\u2935|[\\u2190-\\u21ff]|\\u2764\\ufe0f)";

    class zm extends _m {
        constructor(t, {messageId: e}, s) {
            super(t, {messageId: e}, s);
            const {messages: n, users: i} = t;
            this.messageId = e;
            const r = n.get(e), a = r.media && r.media.$, {isPost: o, isOut: c, fwdFrom: h, replyToMsgId: l} = r,
                u = this.isSelf = !c && !!i.get(r.fromId, "isSelf"), d = r.toId.$ == Lt || r.toId.$ == Li;
            if (this.userpicEl = this.part("userpic"), this.contentEl = this.part("content"), this.statusEl = this.part("status"), this.timeEl = this.part("time"), c && (this.readIconEl = this.createPart(this.statusEl, "read-icon")), this.timeEl.textContent = t.formatTime(r.date), !d || o || c || u || [oe, Vs, he].includes(a) || (this.authorNameEl = this.createPart(this.contentEl, "author-name"), this.watchUser(r.fromId, ["firstName", "lastName", "isDeleted"], this.app.userNameUpdater(this.authorNameEl))), !d || o || c || u || this.watchUser(r.fromId, ["photo", "firstName", "lastName", "title", "isDeleted"], this.app.peerPhotoUpdater(this.userpicEl, `u${r.fromId}`)), this.listen(this.authorNameEl, "click", () => {
                t.mainController.selectProfile(r.fromId, !0)
            }), this.listen(this.userpicEl, "click", () => {
                t.mainController.selectProfile(r.fromId, !0)
            }), c && (this.watchDialog(r.$peerId, ["readOutboxMaxId"], t => {
                this.readIconEl.classList.toggle("is-read", t >= r.id)
            }), this.watchMessage(e, ["isSending"], t => {
                this.readIconEl.classList.toggle("is-sending", !!t)
            }), this.watchMessage(e, ["isFailed"], t => {
                this.readIconEl.classList.toggle("is-failed", !!t)
            })), h && (this.fwdTitleEl = this.createPart(this.contentEl, "fwd-title"), this.fwdTitleEl.textContent = "Forwarded Message", this.fwdNameEl = this.createPart(this.contentEl, "fwd-name"), h.fromName ? this.fwdNameEl.textContent = h.fromName : h.fromId && this.watchUser(h.fromId, ["firstName", "lastName", "isDeleted"], this.app.userNameUpdater(this.fwdNameEl)), this.el.classList.add("is-fwd")), l) {
                let e = !1;
                if (a && a == Vs) {
                    const s = t.getDocumentAttrs(r.media.document);
                    (s.sticker || s.video && s.video.isRoundMessage) && (e = !0)
                }
                e && this.el.classList.add("is-ext-reply"), this.replyToEl = this.createPart(e ? this.el : this.contentEl, "reply-to"), e && this.el.insertBefore(this.replyToEl, this.contentEl), this.replyToTitleEl = this.createPart(this.replyToEl, "reply-to-title"), this.replyToContentEl = this.createPart(this.replyToEl, "reply-to-content"), this.watchMessage(`${r.$peerId}_${l}`, ["media", "fromId", "message"], async (e, s, n) => {
                    if (this.watchUser(s, ["firstName", "lastName", "isDeleted"], this.app.userNameUpdater(this.replyToTitleEl)), this.replyToContentEl.textContent = n || t.formatMediaDescription(e), e && e.$ == oe) {
                        this.replyToPhoto || (this.replyToPhoto = this.createPart(this.replyToEl, "reply-to-photo"), this.replyToEl.insertBefore(this.replyToPhoto, this.replyToTitleEl));
                        const t = this.app.files.getMediaPhoto(e.photo, 32 * devicePixelRatio, 32 * devicePixelRatio);
                        if (!t || !t.isReady) {
                            const t = this.app.files.getCachedMediaPhoto(e.photo.sizes, !0);
                            t && (this.replyToPhoto.style.backgroundImage = `url(${t})`)
                        }
                        t && (this.replyToPhoto.style.backgroundImage = `url(${await t})`)
                    }
                })
            }
            if (a && a != ae) switch (a) {
                case oe:
                    this.initPhotoLike(({photo: t}, e) => {
                        this.updatePhoto(t, !e)
                    }), this.listen(this.photoEl, "click", () => {
                        t.mainController.openMediaViewer(r.media, r.fromId, r.message)
                    });
                    break;
                case Vs:
                    if (r.media.document) {
                        const e = t.getDocumentAttrs(r.media.document);
                        if ("image/gif" == r.media.document.mimeType) {
                            this.el.classList.add("is-gif"), this.initPhotoLike(({document: t}, s) => {
                                this.updateGIF(t, e, !s)
                            });
                            break
                        }
                        if (e.sticker) {
                            if (this.el.classList.add("is-sticker"), this.stickerEl = this.createPart(this.contentEl, "sticker"), e.w && e.h) {
                                let {w: t, h: s} = e;
                                t > s ? (t = 256, s = e.h * (t / e.w)) : (s = 256, t = e.w * (s / e.h)), this.stickerEl.style.width = t + "px", this.stickerEl.style.height = s + "px"
                            } else this.stickerEl.style.width = "256px", this.stickerEl.style.height = "256px";
                            this.updateSticker(r.media.document, e);
                            break
                        }
                        if (e.video) {
                            this.el.classList.add("is-gif"), this.el.classList.toggle("is-round", !!e.video.isRoundMessage), this.initPhotoLike(({document: t}, s) => {
                                this.updateVideoGIF(t, e, !s)
                            });
                            break
                        }
                        if (e.audio) {
                            this.el.classList.add("is-audio"), this.iconEl = this.createPart(this.contentEl, "icon"), e.audio.waveform && (this.waveformEl = this.renderWaveform(this.contentEl, e.audio.waveform)), e.audio.title && (this.titleEl = this.createPart(this.contentEl, "title"), this.titleEl.textContent = (e.audio.performer ? e.audio.performer + " — " : "") + e.audio.title), this.subtitleEl = this.createPart(this.contentEl, "subtitle"), this.subtitleEl.textContent = t.formatDuration(e.audio.duration);
                            break
                        }
                    }
                    this.el.classList.add("is-doc"), this.iconEl = this.createPart(this.contentEl, "icon"), this.titleEl = this.createPart(this.contentEl, "title"), this.subtitleEl = this.createPart(this.contentEl, "subtitle"), this.watchMessage(e, ["media"], e => {
                        if (e && e.document) {
                            const s = t.getDocumentAttrs(e.document);
                            this.iconEl.textContent = t.getExtension(s.fileName), this.titleEl.textContent = s.fileName, this.subtitleEl.textContent = t.formatFilesize(e.document.size)
                        }
                    }), console.log(r.media.document);
                    break;
                case he:
                    this.el.classList.add("is-contact"), this.iconEl = this.createPart(this.contentEl, "icon"), this.titleEl = this.createPart(this.contentEl, "title"), this.subtitleEl = this.createPart(this.contentEl, "subtitle"), this.titleEl.textContent = r.media.firstName + (r.media.lastName ? " " + r.media.lastName : ""), this.subtitleEl.textContent = t.formatPhone(r.media.phoneNumber), this.watchUser(r.media.userId, ["photo", "firstName", "lastName", "title", "isDeleted"], this.app.peerPhotoUpdater(this.iconEl, `u${r.media.userId}`));
                    break;
                case Vn:
                    this.initParagraphs(), this.watchMessage(e, ["message", "entities"], (t, e) => {
                        this.rebuildParagraphs(t, e)
                    });
                    break;
                case ce:
                case Yn:
                case Pa:
                case Lo:
                case Jc:
                case su:
                case le:
                    this.el.classList.add("is-unsupported"), this.initParagraphs(), this.rebuildParagraphs("This type of message is not yet supported.")
            } else this.initParagraphs(), this.watchMessage(e, ["message", "entities"], (t, e) => {
                this.rebuildParagraphs(t, e);
                const s = this.getEmojiCount(t);
                this.el.classList.toggle("is-emoji", s > 0), this.el.classList.toggle("is-emoji-lg", 1 == s), this.el.classList.toggle("is-emoji-md", 2 == s), this.el.classList.toggle("is-emoji-sm", 3 == s)
            });
            o ? (this.el.classList.add("is-post"), this.el.classList.add("is-in")) : (this.el.classList.toggle("is-in", !c), this.el.classList.toggle("is-out", c))
        }

        destroy() {
            this.animation && this.animation.destroy(), super.destroy()
        }

        initParagraphs() {
            this.textEls = [], this.fakeStatusEl = this.statusEl.cloneNode(!0), this.fakeStatusEl.classList.add("is-fake"), this.contentEl.appendChild(this.fakeStatusEl)
        }

        initPhotoLike(t) {
            this.photoEl = this.createPart(this.contentEl, "photo"), this.el.classList.add("is-photo"), this.photoSvg = document.createElementNS(qm, "svg"), this.photoSvg.setAttributeNS(null, "class", "a-message-item__photo-svg"), this.photoEl.appendChild(this.photoSvg), this.loaderEl = this.createPart(this.photoEl, "loader"), this.loaderEl.classList.add("a-loader"), this.initParagraphs(), this.watchMessage(this.messageId, ["media", "message", "entities"], (e, s, n) => {
                s ? (this.rebuildParagraphs(s, n), this.el.classList.remove("is-textless")) : this.el.classList.add("is-textless"), t(e, s)
            })
        }

        renderWaveform(t, e) {
            const s = document.createElementNS(qm, "svg");
            s.setAttributeNS(null, "class", "a-message-item__waveform-svg");
            let n = e.byteLength;
            for (let t = 0; t < n; t++) {
                let n = e[t] / 255 * 23;
                const i = document.createElementNS(qm, "rect");
                i.setAttributeNS(null, "x", 4 * t), i.setAttributeNS(null, "y", 23 - n), i.setAttributeNS(null, "width", 2), i.setAttributeNS(null, "height", n), i.setAttributeNS(null, "rx", 2), i.setAttributeNS(null, "ry", 2), i.setAttributeNS(null, "fill", "currentColor"), s.appendChild(i)
            }
            const i = 4 * n - 2;
            return s.setAttributeNS(null, "width", i), s.setAttributeNS(null, "height", 23), s.setAttributeNS(null, "viewBox", `0 0 ${i} 23`), t.appendChild(s), s
        }

        rebuildSingleParagraph(t, e, s, n) {
            let i = 0, r = 0;
            for (t.textContent = "", r = 0; r < s.length; r++) {
                const a = s[r].offset - n, o = a + s[r].length;
                if (a >= e.length) break;
                a > i && t.appendChild(document.createTextNode(e.slice(i, a)));
                let c, h, l = "span";
                switch (s[r].$) {
                    case Ei:
                        l = "b";
                        break;
                    case Ci:
                        l = "i";
                        break;
                    case Vu:
                        c = "is-underlined";
                        break;
                    case Mi:
                        l = "pre";
                        break;
                    case ki:
                        l = "code";
                        break;
                    case qu:
                        l = "s";
                        break;
                    case Ku:
                        l = "blockquote";
                        break;
                    case Ii:
                        l = "a", h = e.slice(a, o);
                        break;
                    case Si:
                        l = "a", h = s[r].url;
                        break;
                    case ch:
                        l = "a", h = `tel:${e.slice(a, o)}`;
                        break;
                    case $i:
                    case yi:
                    case bi:
                    case vi:
                    case aa:
                    case oa:
                    case hh:
                        c = "is-link"
                }
                const u = document.createElement(l);
                c && (u.className = c), h && (u.href = h, u.rel = "noreferrer", u.target = "_blank"), u.textContent = e.slice(a, o), t.appendChild(u), i = o
            }
            s.splice(0, r), i < e.length && t.appendChild(document.createTextNode(e.slice(i)))
        }

        rebuildParagraphs(t, e = []) {
            const s = t ? t.split("\n") : [];
            for (let t = s.length; t < this.textEls.length; t++) this.textEls[t].remove();
            this.textEls = this.textEls.slice(0, s.length), e.sort((t, e) => t.offset - e.offset);
            let n = 0;
            for (let t = 0; t < this.textEls.length; t++) this.rebuildSingleParagraph(this.textEls[t], s[t], e, n), n += s[t].length + 1;
            if (s.length != this.textEls.length) if (s.length == this.textEls.length + 1) {
                const t = document.createElement("div");
                t.className = this.constructor.componentName + "__text", this.rebuildSingleParagraph(t, s[s.length - 1], e, n), this.textEls.push(t), this.contentEl.insertBefore(t, this.fakeStatusEl)
            } else {
                const t = document.createDocumentFragment();
                for (let i = this.textEls.length; i < s.length; i++) this.textEls.push(this.createPart(t, "text")), this.rebuildSingleParagraph(this.textEls[i], s[i], e, n), n += s[i].length + 1, t.appendChild(this.textEls[i]);
                this.contentEl.insertBefore(t, this.fakeStatusEl)
            }
        }

        getTopmostSibling() {
            return this.dateEl || this.el
        }

        getBottommostSibling() {
            return this.el
        }

        killSiblings() {
            this.dateEl && (this.dateEl.remove(), delete this.dateEl)
        }

        updateNeighbours({messageId: t}, {messageId: e}) {
            const s = this.app.messages.get(t), n = this.app.messages.get(this.messageId), i = this.app.messages.get(e);
            if (this.el.classList.toggle("is-st", !s || n.fromId != s.fromId || Math.abs(n.date - s.date) > Km), this.el.classList.toggle("is-en", !i || n.fromId != i.fromId || Math.abs(n.date - i.date) > Km), s) {
                const t = new Date(1e3 * s.date), e = new Date(1e3 * n.date);
                t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate() ? this.killSiblings() : (this.dateEl = this.createPart(this.el, "date"), this.dateEl.textContent = this.app.formatDay(n.date), this.el.parentNode.insertBefore(this.dateEl, this.el))
            }
        }

        getPhotoSize({sizes: t}) {
            let e = null;
            for (let s of t) s.w && s.h && (!e || s.w > e.w || s.h > e.h) && (e = s);
            return e ? {width: e.w, height: e.h} : {width: 380, height: 180}
        }

        getEmojiCount(t) {
            if (!t || t.length > 12 || !t.length) return null;
            for (let e = 1; e <= 3; e++) if (t.match(new RegExp(`^${Gm}{${e}}$`))) return e;
            return null
        }

        updatePhotoContainer(t, e, s, n) {
            const i = this.app.messages.get(this.messageId), r = Math.min(.2 * innerWidth, 100),
                a = Math.min(.6 * innerWidth, 380), o = Math.min(1.2 * innerHeight, 60),
                c = Math.min(.8 * innerHeight, 700), h = e / t;
            let l = Math.min(Math.max(t, r), a), u = Math.min(Math.max(l * h, o), c);
            l = u / h, this.photoSvg.setAttribute("width", l), this.photoSvg.setAttribute("height", u - (n && !n.isRoundMessage ? 2 : 0));
            const d = Math.floor(1e8 * Math.random());
            s && (i.isPost || this.isSelf || i.fwdFrom ? this.photoSvg.innerHTML = `<defs><clipPath id="clip${d}"><rect width="${l}" height="${u}" rx="12" /></clipPath></defs>` : i.isOut ? this.photoSvg.innerHTML = `<defs><clipPath id="clip${d}">\n          <use href="#message-tail" transform="translate(${l - 2}, ${u}) scale(-1, -1)"/>\n          <rect width="12" height="12" x="${l - 21}" y="${u - 12}"/><rect width="${l - 9}" height="${u}" rx="12" />\n        </clipPath></defs>` : this.photoSvg.innerHTML = `<defs><clipPath id="clip${d}">\n          <use href="#message-tail" transform="translate(2, ${u}) scale(1, -1)"/>\n          <rect width="12" height="12" x="9" y="${u - 12}"/><rect width="${l - 9}" height="${u}" x="9" rx="12" />\n        </clipPath></defs>`), this.photoImg = document.createElementNS("http://www.w3.org/2000/svg", "image"), this.photoImg.setAttribute("width", l), this.photoImg.setAttribute("height", u), this.photoImg.setAttribute("preserveAspectRatio", "xMinYMin slice"), n && n.isRoundMessage ? this.photoImg.setAttributeNS(null, "clip-path", "url(#message-circle)") : s && this.photoImg.setAttributeNS(null, "clip-path", `url(#clip${d})`), this.photoSvg.appendChild(this.photoImg), n && (this.videoFO = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject"), this.videoFO.setAttribute("width", l), this.videoFO.setAttribute("height", u), this.videoFO.setAttribute("preserveAspectRatio", "xMinYMin slice"), this.videoEl = document.createElement("video"), this.videoEl.style.width = `${l}px`, this.videoEl.style.height = `${u}px`, this.videoEl.width = t, this.videoEl.height = e, this.videoEl.autoplay = !0, this.videoEl.muted = !0, this.videoEl.loop = !0, this.videoFO.appendChild(this.videoEl), n.isRoundMessage ? this.videoFO.setAttributeNS(null, "clip-path", "url(#message-circle)") : s && this.videoFO.setAttributeNS(null, "clip-path", `url(#clip${d})`), this.photoSvg.appendChild(this.videoFO))
        }

        async updateGIF(t, e, s) {
            if (t && t.$ != qs) {
                const {w: n, h: i} = e;
                this.updatePhotoContainer(n, i, s), this.loaderEl.classList.add("is-active");
                let r = this.app.files.getDocumentData(t).promise;
                if (!r || !r.isReady) {
                    const e = this.app.files.getCachedMediaPhoto(t.thumbs, !0);
                    e && this.photoImg.setAttributeNS("http://www.w3.org/1999/xlink", "href", e)
                }
                r && this.photoImg.setAttributeNS("http://www.w3.org/1999/xlink", "href", await r), this.loaderEl.classList.remove("is-active")
            } else this.photoEl.style.display = "none", this.loaderEl.classList.remove("is-active")
        }

        async updateVideoGIF(t, e, s) {
            if (t && t.$ != qs) {
                const {w: i, h: r} = e.video;
                this.updatePhotoContainer(i, r, s, e.video), this.loaderEl.classList.add("is-active");
                let a = this.app.files.getDocumentData(t).promise;
                if (!a || !a.isReady) {
                    const e = this.app.files.getCachedMediaPhoto(t.thumbs, !0);
                    e && this.photoImg.setAttributeNS("http://www.w3.org/1999/xlink", "href", e)
                }
                if (a) {
                    var n = document.createElement("source");
                    n.type = "video/mp4", n.src = await a, this.videoEl.appendChild(n)
                }
                this.loaderEl.classList.remove("is-active")
            } else this.photoEl.style.display = "none", this.loaderEl.classList.remove("is-active")
        }

        async updatePhoto(t, e) {
            if (t && t.$ != ye) {
                const {width: s, height: n} = this.getPhotoSize(t);
                this.loaderEl.classList.add("is-active"), this.updatePhotoContainer(s, n, e);
                const i = this.app.files.getMediaPhoto(t, 380 * devicePixelRatio, 60 * devicePixelRatio);
                if (!i || !i.isReady) {
                    const e = this.app.files.getCachedMediaPhoto(t.sizes, !0);
                    e && this.photoImg.setAttributeNS("http://www.w3.org/1999/xlink", "href", e)
                }
                i && this.photoImg.setAttributeNS("http://www.w3.org/1999/xlink", "href", await i), this.loaderEl.classList.remove("is-active")
            } else this.photoEl.style.display = "none", this.loaderEl.classList.remove("is-active")
        }

        async updateSticker(t) {
            const e = "application/x-tgsticker" == t.mimeType;
            let s;
            if (!(s = e ? this.app.files.getCompressedStickerData(t, await this.app.pako) : this.app.files.getDocumentPhoto(t, 256 * devicePixelRatio, 256 * devicePixelRatio)) || !s.isReady) {
                const e = this.app.files.getCachedMediaPhoto(t.thumbs);
                e && (this.stickerEl.style.backgroundImage = `url(${e})`)
            }
            if (e) {
                const t = JSON.parse(new TextDecoder("utf-8").decode(await s));
                this.stickerEl.style.background = "none", this.animation = (await this.app.lottie).loadAnimation({
                    container: this.stickerEl,
                    renderer: "svg",
                    loop: !0,
                    autoplay: !1,
                    animationData: t
                }), this.listen(this.stickerEl, "mouseenter", () => {
                    this.animation.isPaused && (this.animation.loop = !0, this.animation.goToAndPlay(0))
                }), this.listen(this.stickerEl, "mouseleave", () => {
                    this.animation.loop = !1
                })
            } else this.stickerEl.style.backgroundImage = `url(${await s})`
        }
    }

    class Wm extends _m {
        constructor(t, {messageId: e}, s) {
            super(t, {messageId: e}, s);
            const {messages: n, users: i} = t;
            this.messageId = e;
            const r = n.get(e);
            this.el.textContent = this.app.formatServiceAction(r)
        }

        getTopmostSibling() {
            return this.el
        }

        getBottommostSibling() {
            return this.el
        }

        killSiblings() {
        }

        updateNeighbours({messageId: t}, {messageId: e}) {
        }
    }

    const Ym = "PointerEvent" in window;

    class Qm extends _m {
        constructor(t, e, s) {
            super(t, e, s), Tm("overlays").appendChild(this.el), this.photoEl = this.part("photo"), this.closeBtn = this.part("close-btn"), this.confirmBtn = this.part("confirm-btn"), this.listen(this.closeBtn, "click", this.hide.bind(this)), this.listen(this.confirmBtn, "click", this.confirm.bind(this)), this.listen(this.photoEl, Ym ? "pointerdown" : "mousedown", this.onMouseDown.bind(this)), this.listen(this.photoEl, "wheel", this.onMouseWheel.bind(this))
        }

        show() {
            Tm("overlays").classList.add("is-active"), this.el.classList.add("is-active")
        }

        hide() {
            this.el.classList.remove("is-active"), this.el.remove(), Tm("overlays").firstChild || Tm("overlays").classList.remove("is-active"), this.destroy()
        }

        setImage(t) {
            this.image = t, this.photoEl.insertBefore(t, this.photoEl.firstChild), this.sourceWidth = t.width, this.sourceHeight = t.height, this.aspect = this.sourceWidth / this.sourceHeight, this.x = 0, this.y = 0;
            let e = 360, s = 360;
            this.sourceWidth > this.sourceHeight ? (e = s * this.aspect, this.x = -.5 * (e - s)) : (s = e * this.aspect, this.y = -.5 * (s - e)), this.scale = e / this.sourceWidth, this.minScale = this.scale, this.maxScale = Math.max(this.minScale, 2), t.style.position = "absolute", this.updateScale()
        }

        updateScale() {
            const t = this.sourceWidth * this.scale, e = this.sourceHeight * this.scale;
            this.image.style.width = `${t}px`, this.image.style.height = `${e}px`, this.image.style.transform = `translate(${this.x}px,${this.y}px)`
        }

        restrictTranslate() {
            this.x = Math.max(Math.min(this.x, 0), -(this.sourceWidth * this.scale - 360)), this.y = Math.max(Math.min(this.y, 0), -(this.sourceHeight * this.scale - 360))
        }

        confirm() {
            const t = document.createElement("canvas");
            t.width = 360, t.height = 360, t.getContext("2d").drawImage(this.image, -this.x / this.scale, -this.y / this.scale, 360 / this.scale, 360 / this.scale, 0, 0, 360, 360), t.toBlob(t => {
                const e = new FileReader;
                e.onloadend = () => {
                    this.emit("confirm", t, e.result), this.hide()
                }, e.readAsArrayBuffer(t)
            }, "image/jpeg")
        }

        onMouseDown(t) {
            this.dragInfo && this.onMouseUp(t), this.dragInfo = {
                initMx: t.screenX,
                initMy: t.screenY,
                initX: this.x,
                initY: this.y,
                moveListener: this.listen(Ym ? this.photoEl : document, Ym ? "pointermove" : "mousemove", this.onMouseMove.bind(this)),
                upListener: this.listen(Ym ? this.photoEl : document, Ym ? "pointerup" : "mouseup", this.onMouseUp.bind(this))
            }, Ym && this.photoEl.setPointerCapture(t.pointerId), t.preventDefault()
        }

        onMouseMove(t) {
            const e = t.screenX, s = t.screenY;
            this.x = this.dragInfo.initX + (e - this.dragInfo.initMx), this.y = this.dragInfo.initY + (s - this.dragInfo.initMy), this.restrictTranslate(), this.image.style.transform = `translate(${this.x}px,${this.y}px)`, t.preventDefault()
        }

        onMouseUp(t) {
            this.unlisten(this.dragInfo.moveListener), this.unlisten(this.dragInfo.upListener), Ym && this.photoEl.releasePointerCapture(t.pointerId), delete this.dragInfo
        }

        onMouseWheel(t) {
            const e = this.photoEl.getBoundingClientRect(), s = t.clientX - e.left, n = t.clientY - e.top;
            let i = t.delta || t.wheelDelta;
            i = Math.max(-1, Math.min(1, i));
            const r = (s - this.x) / this.scale, a = (n - this.y) / this.scale;
            this.scale += .15 * i * this.scale, this.scale = Math.max(this.minScale, Math.min(this.maxScale, this.scale)), this.x = s - r * this.scale, this.y = n - a * this.scale, this.restrictTranslate(), this.updateScale()
        }
    }

    class Jm extends _m {
        constructor(t, {peerId: e}, s) {
            super(t, {peerId: e}, s);
            const {dialogs: n, chats: i, users: r} = this.app;
            this.peerId = e;
            const a = n.get(e, "peer");
            if (this.messageList = this.component("messages"), this.messageList.getItemComponent = t => {
                return this.app.messages.get(t).$ == re ? Wm : zm
            }, this.messageList.getItemProps = t => ({messageId: t}), this.messageList.itemEvents = [], this.messageList.connectTo(this.app.getMessageList(e)), this.chatpicEl = this.part("chatpic"), this.nameEl = this.part("name"), this.subtitleEl = this.part("subtitle"), this.newMessageEl = this.part("new-message"), this.newMessageInput = this.part("new-input"), this.newMessageInput.addEventListener("input", this.onNewMessageInput.bind(this)), this.newMessageInput.addEventListener("keydown", this.onSendKeydown.bind(this)), this.newMessageSendBtn = this.component("new-send-button"), this.newMessageSendBtn.on("click", this.onSendClick.bind(this)), this.attachPhotoItem = this.part("attach-menu-photo"), this.listen(this.attachPhotoItem, "click", () => {
                this.attachInput.setAttribute("accept", "image/*"), this.isAttaching = "image", this.attachInput.click()
            }), this.attachDocumentItem = this.part("attach-menu-document"), this.listen(this.attachDocumentItem, "click", () => {
                this.attachInput.setAttribute("accept", ""), this.isAttaching = "document", this.attachInput.click()
            }), this.attachInput = this.part("attach-input"), this.listen(this.attachInput, "change", () => {
                if (this.attachInput.files && this.attachInput.files[0]) {
                    const e = this.isAttaching, s = this.attachInput.files[0], n = new FileReader;
                    n.onload = async () => {
                        const i = this.newMessageInput.innerText.trim();
                        this.newMessageInput.innerText = "";
                        const r = new Uint8Array(n.result), a = await t.files.uploadFile(r, s.name).promise;
                        this.app.sendMessage({
                            message: i,
                            media: {$$: "document" == e ? p : d, file: a, mimeType: s.type, attributes: []}
                        })
                    }, n.readAsArrayBuffer(s)
                }
            }), this.isSelf = !1, this.isChannel = !1, this.isWithUserpics = !1, a.$ == At) this.isSelf = r.get(a.userId, "isSelf"); else {
                const t = i.get(a.chatId || a.channelId);
                this.isWithUserpics = a.$ == Lt || t.isMegagroup, this.isChannel = a.$ == Li && !t.isMegagroup
            }
            if (this.messageList.el.classList.toggle("is-with-userpics", this.isWithUserpics), this.messageList.el.classList.toggle("is-self", this.isSelf), this.messageList.el.classList.toggle("is-channel", this.isChannel), a.$ == At) {
                const s = a.userId;
                this.watchUser(s, ["photo", "firstName", "lastName", "title", "isDeleted"], t.peerPhotoUpdater(this.chatpicEl, e)), this.watchUser(s, ["firstName", "lastName", "isDeleted"], t.userNameUpdater(this.nameEl)), this.watchUser(s, ["status", "typing", "isBot"], (e, s, n) => {
                    n ? this.subtitleEl.textContent = "bot" : (e && this.subtitleEl.classList.toggle("is-online", e.$ == Gt), this.subtitleEl.textContent = s ? "typing…" : t.formatStatus(e))
                }), this.listen(this.chatpicEl, "click", () => {
                    t.mainController.selectProfile(s, !0)
                }), this.listen(this.nameEl, "click", () => {
                    t.mainController.selectProfile(s, !0)
                })
            } else {
                const s = a.chatId || a.channelId;
                this.watchChat(s, ["photo", "firstName", "lastName", "title", "isDeleted"], t.peerPhotoUpdater(this.chatpicEl, e)), this.watchChat(s, ["title"], t => {
                    this.nameEl.textContent = t
                }), this.full = null;
                try {
                    a.$ == Lt ? t.tg.call(B, {chatId: s}).then(({fullChat: t, users: e, chats: s}) => {
                        this.full = t, this.onSubtitleChange()
                    }) : t.tg.call(Q, {
                        channel: {
                            $$: w,
                            channelId: s,
                            accessHash: i.get(s, "accessHash")
                        }
                    }).then(({fullChat: t, users: e, chats: s}) => {
                        this.full = t, this.onSubtitleChange()
                    })
                } catch (t) {
                    console.error(t)
                }
                this.onlineCount = null, this.onlineUpdateInterval = setInterval(this.onlineUpdate.bind(this), 1e4), this.onlineUpdate(), this.watchChat(s, ["typing"], t => {
                    this.typing = t, this.onSubtitleChange()
                }), this.listen(this.chatpicEl, "click", () => {
                    t.mainController.selectProfile(s, !1)
                }), this.listen(this.nameEl, "click", () => {
                    t.mainController.selectProfile(s, !1)
                })
            }
            this.messageList.queryInitialItems(), this.newMessageEl.classList.toggle("is-active", !this.isChannel)
        }

        async init() {
        }

        destroy() {
            clearInterval(this.onlineUpdateInterval), super.destroy()
        }

        async onlineUpdate() {
            const t = this.app.getInputPeer(this.peerId);
            if (t.$$ == $ && !this.isChannel) {
                const e = await this.app.tg.call(Z, {peer: t});
                e.onlines !== this.onlineCount && (this.onlineCount = e.onlines, this.onSubtitleChange())
            }
        }

        onSubtitleChange() {
            const t = [];
            if (this.typing) for (let e in this.typing) t.push(this.app.users.get(e, "firstName"));
            if (t.length) 1 == t.length ? this.subtitleEl.textContent = `${t[0]} is typing…` : 2 == t.length ? this.subtitleEl.textContent = `${t[0]} and ${t[1]} are typing…` : 3 == t.length ? this.subtitleEl.textContent = `${t[0]}, ${t[1]} and ${t[2]} are typing…` : this.subtitleEl.textContent = `${this.app.formatNumber(t.length)} people are typing…`; else if (this.full) {
                const t = this.full.participantsCount || this.full.participants && this.full.participants.participants && this.full.participants.participants.length;
                this.onlineCount ? this.subtitleEl.textContent = `${this.app.formatNumber(t)} members, ${this.app.formatNumber(this.onlineCount)} online` : this.subtitleEl.textContent = `${this.app.formatNumber(t)} members`
            }
        }

        onNewMessageInput() {
            const t = this.newMessageInput.innerText;
            this.newMessageInput.classList.toggle("is-empty", !t.length), this.newMessageSendBtn.classList.toggle("is-record", !t.length), this.newMessageSendBtn.classList.toggle("is-send", !!t.length), this.messageList.el.classList.contains("is-bottom-flush") && (this.messageList.el.scrollTop = this.messageList.el.scrollHeight - this.messageList.el.offsetHeight)
        }

        onSendKeydown(t) {
            "Enter" == t.key && (t.ctrlKey || t.metaKey) && (this.onSendClick(t), t.preventDefault())
        }

        onSendClick(t) {
            t.preventDefault();
            const e = this.newMessageInput.innerText.trim();
            e && (this.app.sendMessage({message: e}), this.newMessageInput.innerText = "", this.onNewMessageInput())
        }
    }

    class Zm extends _m {
        constructor(t, {id: e, isUser: s}, n) {
            if (super(t, {
                id: e,
                isUser: s
            }, n), this.id = e, this.isUser = s, this.photoEl = this.part("photo"), this.nameEl = this.part("name"), this.subtitleEl = this.part("subtitle"), this.bioEl = this.part("bio"), this.bioRow = this.part("row-bio"), this.bioLabel = this.part("label-bio"), this.usernameEl = this.part("username"), this.usernameLabel = this.part("label-username"), this.phoneEl = this.part("phone"), this.usernameRow = this.part("row-username"), this.phoneRow = this.part("row-phone"), this.membersTab = this.part("tab-members"), this.membersTab.classList.toggle("is-hidden", s), this.audioTab = this.part("tab-audio"), this.audioTab.classList.toggle("is-hidden", !s), s) this.watchUser(e, ["photo", "firstName", "lastName", "title", "isDeleted"], t.peerPhotoUpdater(this.photoEl, "u" + e)), this.watchUser(e, ["firstName", "lastName", "isDeleted"], t.userNameUpdater(this.nameEl)), this.watchUser(e, ["status", "typing", "isBot"], (e, s, n) => {
                n ? this.subtitleEl.textContent = "bot" : (e && this.subtitleEl.classList.toggle("is-online", e.$ == Gt), this.subtitleEl.textContent = s ? "typing…" : t.formatStatus(e))
            }), this.watchUser(e, ["username"], t => {
                this.usernameRow.classList.toggle("is-hidden", !t), this.usernameEl.textContent = t
            }), this.watchUser(e, ["phone"], t => {
                this.phoneRow.classList.toggle("is-hidden", !t), this.phoneEl.textContent = t
            }), this.loadFullUser(); else {
                const s = t.chats.get(e);
                this.isChannel = s.$ == ji;
                const n = (this.isChannel ? "c" : "g") + e;
                this.bioLabel.textContent = "About", this.usernameLabel.textContent = "Link", this.phoneRow.classList.add("is-hidden"), this.watchChat(e, ["photo", "firstName", "lastName", "title", "isDeleted"], t.peerPhotoUpdater(this.photoEl, n)), this.watchChat(e, ["title"], t => {
                    this.nameEl.textContent = t
                }), this.watchChat(e, ["username"], t => {
                    this.usernameRow.classList.toggle("is-hidden", !t), this.usernameEl.textContent = t
                }), this.loadFullChat()
            }
            this.closeBtn = this.part("close-button"), this.listen(this.closeBtn, "click", () => {
                t.mainController.closeRightPanel()
            })
        }

        setLoading(t) {
        }

        async loadFullUser() {
            const t = await this.app.tg.call(L, {
                id: {
                    $$: f,
                    userId: this.id,
                    accessHash: this.app.users.get(this.id, "accessHash")
                }
            });
            this.bioRow.classList.toggle("is-hidden", !t.about), this.bioEl.innerText = t.about, console.log(t)
        }

        async loadFullChat() {
            let t;
            t = this.isChannel ? (await this.app.tg.call(Q, {
                channel: {
                    $$: w,
                    channelId: this.id,
                    accessHash: this.app.chats.get(this.id, "accessHash")
                }
            })).fullChat : (await this.app.tg.call(B, {chatId: chatId})).fullChat, console.log(t);
            const e = t.participantsCount || t.participants && t.participants.participants && t.participants.participants.length;
            this.bioRow.classList.toggle("is-hidden", !t.about), this.bioEl.textContent = t.about, this.subtitleEl.innerText = `${this.app.formatNumber(e)} members`
        }
    }

    class Xm extends _m {
        constructor(t, {media: e, fromId: s, caption: n}, i) {
            super(t, {
                media: e,
                fromId: s,
                caption: n
            }, i), Tm("overlays").appendChild(this.el), console.log(e), this.userpicEl = this.part("userpic"), this.nameEl = this.part("name"), this.watchUser(s, ["photo", "firstName", "lastName", "title", "isDeleted"], t.peerPhotoUpdater(this.userpicEl, "u" + s)), this.watchUser(s, ["firstName", "lastName", "isDeleted"], t.userNameUpdater(this.nameEl)), this.dateEl = this.part("date"), this.dateEl.textContent = t.formatFullDate(e.photo.date), this.deleteBtn = this.part("delete-button"), this.forwardBtn = this.part("forward-button"), this.downloadBtn = this.part("download-button"), this.closeBtn = this.part("close-button"), this.listen(this.closeBtn, "click", () => {
                this.app.mainController.closeMediaViewer()
            }), this.contentEl = this.part("content"), this.photoImg = this.part("photo"), this.captionEl = this.part("caption"), this.captionEl.textContent = n, this.loaderEl = this.createPart(this.contentEl, "loader"), this.loaderEl.classList.add("a-loader"), this.loaderEl.classList.add("is-active");
            const r = t.files.getMediaPhoto(e.photo, innerWidth * devicePixelRatio, innerHeight * devicePixelRatio);
            if (!r || !r.isReady) {
                const s = t.files.getCachedMediaPhoto(e.photo.sizes, !0);
                s && (this.photoImg.src = s)
            }
            r && r.then(t => {
                this.photoImg.src = t
            }), this.loaderEl.classList.remove("is-active"), Tm("overlays").classList.add("is-active")
        }

        destroy() {
            this.el.remove(), Tm("overlays").firstChild || Tm("overlays").classList.remove("is-active"), super.destroy()
        }

        setLoading(t) {
            this.loaderEl.classList.toggle("is-active", !!t)
        }
    }

    const tf = _m.components = {
        "a-checkbox": class extends _m {
            constructor(t, e, s) {
                super(t, e, s), this.label = e.label, this.labelEl = this.part("label"), this.labelEl.textContent = this.label, this.inputEl = this.part("input"), this.checked = this.inputEl.checked = void 0 !== e.checked, this.on("change", () => {
                    this.checked = this.inputEl.checked
                })
            }

            on(t, e, s = !0) {
                "change" === t ? this.listen(this.inputEl, t, e, s) : super.on(t, e, s)
            }
        },
        "a-button": class extends _m {
            constructor(t, e, s) {
                super(t, e, s), Rm(this), this.label = this.el.childNodes[0].textContent, this.loaderEl = this.createPart(this.el, "loader"), this.loaderEl.classList.add("a-loader")
            }

            setLoading(t) {
                this.el.childNodes[0].textContent = t ? "Please wait…" : this.label, this.loaderEl.classList.toggle("is-active", !!t)
            }
        },
        "a-text-input": class extends _m {
            constructor(t, e, s) {
                super(t, e, s), this.label = e.label, this.autocomplete = e.autocomplete, this.type = e.type || "text", this.inputEl = this.part("input"), this.on("input", this.onInput), this.labelEl = this.part("label"), this.labelEl.textContent = this.label, this.buttonEl = this.part("button"), "password" == this.type && (this.el.classList.add("is-password"), this.buttonEl.classList.remove("is-hidden"), this.setMasked(!0), this.listen(this.buttonEl, "click", t => {
                    this.inputEl.blur(), this.setMasked(!this.masked), t.stopPropagation()
                })), void 0 !== this.autocomplete && (this.el.setAttribute("tabindex", 0), this.inputEl.setAttribute("name", "search"), this.el.classList.add("is-autocomplete"), this.buttonEl.classList.remove("is-hidden"), this.listen(this.inputEl, "click", () => {
                    this.inputEl.select()
                }), this.listen(this.inputEl, "keydown", t => {
                    if (this.filtered.length) if ("Enter" == t.key) this.selectItem(this.hoverIndex), t.preventDefault(); else if ("ArrowDown" == t.key) {
                        this.itemEls[this.hoverIndex].classList.remove("is-selected");
                        for (let t = 1; t <= this.filtered.length; t++) if (this.filtered[(this.hoverIndex + t) % this.filtered.length]) {
                            this.hoverIndex = (this.hoverIndex + t) % this.filtered.length, this.itemEls[this.hoverIndex].classList.add("is-selected"), this.itemEls[this.hoverIndex].scrollIntoView({block: "nearest"});
                            break
                        }
                        t.preventDefault()
                    } else if ("ArrowUp" == t.key) {
                        this.itemEls[this.hoverIndex].classList.remove("is-selected");
                        for (let t = 1; t <= this.filtered.length; t++) if (this.filtered[(this.hoverIndex + this.filtered.length - t) % this.filtered.length]) {
                            this.hoverIndex = (this.hoverIndex + this.filtered.length - t) % this.filtered.length, this.itemEls[this.hoverIndex].classList.add("is-selected"), this.itemEls[this.hoverIndex].scrollIntoView({block: "nearest"});
                            break
                        }
                        t.preventDefault()
                    }
                })), this.value = this.inputEl.value
            }

            init() {
                if (void 0 !== this.autocomplete) {
                    const t = this.createPart(this.el, "autocomplete");
                    t.classList.add("is-bottom-full"), this.autocompleteMenu = new Fm(this.app, {trigger: "focus"}, t)
                }
            }

            update() {
                if (this.labelEl.classList.toggle("is-hidden", !this.inputEl.value.length), void 0 === this.autocomplete || !this.autocompleteData) return;
                const t = this.inputEl.value.toLocaleLowerCase();
                this.hoverIndex = -1;
                let e = 0;
                for (let s = 0; s < this.autocompleteData.length; s++) {
                    const n = this.autocompleteData[s];
                    this.filtered[s] = !t || n.name.toLocaleLowerCase().startsWith(t), this.filtered[s] && (-1 == this.hoverIndex && (this.hoverIndex = s), e++), this.itemEls[s].classList.toggle("is-hidden", !this.filtered[s]), this.itemEls[s].classList.toggle("is-selected", s == this.hoverIndex)
                }
                this.emptyEl.classList.toggle("is-hidden", !!e)
            }

            setValue(t) {
                this.value = this.inputEl.value = t, this.update()
            }

            setMasked(t) {
                this.masked = t, this.el.classList.toggle("is-masked", t), this.inputEl.type = t ? "password" : "text"
            }

            setAutocomplete(t) {
                this.autocompleteData = t, this.emptyEl = document.createElement("div"), this.emptyEl.textContent = "Nothing found", this.emptyEl.className = "a-menu-item is-empty is-hidden", this.autocompleteMenu.contentEl.appendChild(this.emptyEl), this.itemEls = new Array(t.length), this.filtered = new Array(t.length);
                for (let e = 0; e < t.length; e++) {
                    const t = this.autocompleteData[e], s = document.createElement("div");
                    s.className = "a-menu-item", s.innerHTML = `<div class="a-menu-item__icon">${t.emoji}</div>${t.name}<div class="a-menu-item__value">${t.phones[0]}</div>`, s.addEventListener("click", this.selectItem.bind(this, e)), s.addEventListener("mouseenter", this.hoverItem.bind(this, e)), this.autocompleteMenu.contentEl.appendChild(s), this.itemEls[e] = s, this.filtered[e] = !0
                }
                this.activeIndex = -1
            }

            setAutocompleteIndex(t) {
                this.activeIndex = t, this.setHoverIndex(t), this.setValue(-1 == t ? "" : this.autocompleteData[t].name)
            }

            setHoverIndex(t) {
                this.hoverIndex = t;
                for (let t = 0; t < this.autocompleteData.length; t++) this.itemEls[t].classList.toggle("is-selected", t == this.hoverIndex)
            }

            selectItem(t) {
                this.autocompleteMenu.toggle(!1), this.setAutocompleteIndex(t), this.emit("select", this.autocompleteData[t])
            }

            hoverItem(t) {
                this.setHoverIndex(t)
            }

            setError(t, e = !0) {
                this.error = t, this.autoClearError = e, this.labelEl.textContent = t, this.el.classList.add("is-invalid")
            }

            clearError() {
                delete this.error, delete this.autoClearError, this.labelEl.textContent = this.label, this.el.classList.remove("is-invalid")
            }

            focus() {
                this.inputEl.focus()
            }

            onInput(t) {
                this.error && this.autoClearError && this.clearError(), this.value = this.inputEl.value, this.update()
            }

            on(t, e, s = !0) {
                "input" === t ? this.listen(this.inputEl, t, e, s) : "select" === t ? this.listen(null, t, e, s) : super.on(t, e, s)
            }
        },
        "a-search-input": class extends _m {
            constructor(t, e, s) {
                super(t, e, s)
            }
        },
        "a-dropdown": class extends _m {
            constructor(t, e, s) {
                super(t, e, s), this.label = e.label, this.labelEl = this.part("label"), this.labelEl.textContent = this.label
            }
        },
        "a-list": class extends _m {
            constructor(t, e, s) {
                super(t, e, s), Hm(this, this.el), this.loaderEl = this.part("loader"), this.contentEl = this.part("content"), this.isReversed = void 0 !== e.reversed, this.itemComps = [], this.itemEvents = [], this.activeIndex = null, this.autoscrollDistance = 5, this.preloadDistance = .7 * window.innerHeight, this.on("scroll", this.onScroll.bind(this))
            }

            setLoading(t) {
                this.loaderEl.classList.toggle("is-active", !!t)
            }

            connectTo(t) {
                this.provider && this.provider.unbindComponent(this), this.provider = t, t.bindComponent(this)
            }

            updateScroll() {
                this.el.classList.toggle("is-top-flush", 0 == this.el.scrollTop), this.el.classList.toggle("is-bottom-flush", this.el.scrollTop == this.el.scrollHeight - this.el.offsetHeight), this.emit("scrolled")
            }

            onScrollPosUpdated(t, e) {
                this.isReversed ? this.el.scrollTop = this.el.scrollHeight - e : this.el.scrollTop = t
            }

            async queryInitialItems() {
                this.setLoading(!0), await this.provider.getInitial(), this.setLoading(!1)
            }

            clearItems() {
                for (let t of this.itemComps) t.destroy();
                this.itemComps = []
            }

            setItems(t) {
                this.clearItems(), this.appendItems(t, !0), this.isReversed && (this.el.scrollTop = this.el.scrollHeight - this.el.offsetHeight, this.updateScroll())
            }

            appendItems(t, e) {
                this.insertItems(t, -1, e)
            }

            prependItems(t, e) {
                this.insertItems(t, 0, e)
            }

            moveItem(t, e) {
                console.log("moving ", this.itemComps[t].peerId, " from ", t, " to ", e), this.itemComps[t].killSiblings(), this.contentEl.insertBefore(this.itemComps[t].el, this.itemComps[e].getTopmostSibling()), this.itemComps.splice(e, 0, ...this.itemComps.splice(t, 1))
            }

            insertItems(t, e, s) {
                return new Promise((n, i) => {
                    let r = !1;
                    r = this.isReversed == (-1 == e) ? this.el.scrollTop <= this.autoscrollDistance : this.el.scrollTop >= this.el.scrollHeight - this.el.offsetHeight - this.autoscrollDistance;
                    const a = this.el.scrollTop, o = this.el.scrollHeight, c = [],
                        h = document.createDocumentFragment();
                    for (let e = 0; e < t.length; e++) {
                        const s = new (this.getItemComponent(t[e], e))(this.app, this.getItemProps(t[e], e));
                        c.push(s);
                        for (let t of this.itemEvents) s.on(t, this.onItemEvent.bind(this, t, s))
                    }
                    this.isReversed && c.reverse();
                    for (let t = 0; t < c.length; t++) {
                        const e = c[t];
                        h.appendChild(e.el), e.updateNeighbours(t > 0 && c[t - 1], t < c.length - 1 && c[t + 1])
                    }
                    let l;
                    this.isReversed ? (-1 == e ? (this.contentEl.insertBefore(h, this.contentEl.firstChild), this.itemComps = c.concat(this.itemComps)) : (this.contentEl.insertBefore(h, this.itemComps.length && e > 0 ? this.itemComps[this.itemComps.length - e].getTopmostSibling() : null), this.itemComps.splice(e, 0, ...c)), l = this.el.scrollHeight - this.el.offsetHeight) : (-1 == e ? (this.contentEl.appendChild(h), this.itemComps = this.itemComps.concat(c)) : (this.contentEl.insertBefore(h, this.itemComps.length ? this.itemComps[e].getTopmostSibling() : null), this.itemComps.splice(e, 0, ...c)), l = 0), r && !s ? (this.el.scrollTo({
                        left: 0,
                        top: l,
                        behavior: "smooth"
                    }), this.updateScroll(), n()) : this.isReversed == (-1 == e) ? (this.el.scrollTop = a + this.el.scrollHeight - o, this.updateScroll(), n()) : (this.updateScroll(), n())
                })
            }

            setActivePeer(t) {
                for (let e = 0; e < this.itemComps.length; e++) this.itemComps[e].el.classList.toggle("is-active", this.itemComps[e].peerId == t)
            }

            onItemEvent(t, e, s) {
                this.emit(`item-${t}`, s, e)
            }

            async onScroll(t) {
                if (this.updateScroll(), this.preloadPromise) return;
                let e;
                if (this.el.scrollTop <= this.preloadDistance ? e = this.isReversed ? "end" : "start" : this.el.scrollTop >= this.el.scrollHeight - this.el.offsetHeight - this.preloadDistance && (e = this.isReversed ? "start" : "end"), e) {
                    this.preloadPromise = "start" == e ? this.provider.getPreceding(!0) : this.provider.getFollowing(!0);
                    try {
                        await this.preloadPromise
                    } catch (t) {
                        fm(t)
                    }
                    delete this.preloadPromise
                }
            }
        },
        "a-dialog-item": Vm,
        "a-message-item": zm,
        "a-service-item": Wm,
        "a-menu": Fm,
        "a-menu-item": class extends _m {
            constructor(t, e, s) {
                super(t, e, s), Rm(this)
            }
        },
        "a-crop-popup": Qm,
        "a-dialog": Jm,
        "a-profile": Zm,
        "a-media-viewer": Xm
    };
    for (let t in tf) tf[t].componentName = t;
    const ef = document.getElementById("templates");
    for (; ef.childElementCount;) {
        let t = ef.firstElementChild;
        t.remove();
        const e = t.classList[0];
        e in tf ? tf[e].template = t : console.warn(`Found a template for ${e}, but no such component is declared yet.`)
    }
    ef.remove(), window.getComponent = Um;
    const sf = 1220, nf = "e9bac3af3eef81acd2d8576c14a9dfd0";
    const rf = [{phones: ["+7 840", "+7 940", "+995 44"], name: "Abkhazia", code: "AB"}, {
            phones: ["+93"],
            name: "Afghanistan",
            code: "AF",
            emoji: "🇦🇫"
        }, {phones: ["+358 18"], name: "Åland Islands", code: "AX", emoji: "🇦🇽"}, {
            phones: ["+355"],
            name: "Albania",
            code: "AL",
            emoji: "🇦🇱"
        }, {phones: ["+213"], name: "Algeria", code: "DZ", emoji: "🇩🇿"}, {
            phones: ["+1 684"],
            name: "American Samoa",
            code: "AS",
            emoji: "🇦🇸"
        }, {phones: ["+376"], name: "Andorra", code: "AD", emoji: "🇦🇩"}, {
            phones: ["+244"],
            name: "Angola",
            code: "AO",
            emoji: "🇦🇴"
        }, {phones: ["+1 264"], name: "Anguilla", code: "AI", emoji: "🇦🇮"}, {
            phones: ["+1 268"],
            name: "Antigua & Barbuda",
            code: "AG",
            emoji: "🇦🇬"
        }, {phones: ["+54"], name: "Argentina", code: "AR", emoji: "🇦🇷"}, {
            phones: ["+374"],
            name: "Armenia",
            code: "AM",
            emoji: "🇦🇲"
        }, {phones: ["+297"], name: "Aruba", code: "AW", emoji: "🇦🇼"}, {
            phones: ["+247"],
            name: "Ascension",
            code: "SH",
            emoji: "🇸🇭"
        }, {phones: ["+61"], name: "Australia", code: "AU", emoji: "🇦🇺"}, {
            phones: ["+672"],
            name: "Australian External Territories",
            code: "AU",
            emoji: "🇦🇺"
        }, {phones: ["+43"], name: "Austria", code: "AT", emoji: "🇦🇹"}, {
            phones: ["+994"],
            name: "Azerbaijan",
            code: "AZ",
            emoji: "🇦🇿"
        }, {phones: ["+1 242"], name: "Bahamas", code: "BS", emoji: "🇧🇸"}, {
            phones: ["+973"],
            name: "Bahrain",
            code: "BH",
            emoji: "🇧🇭"
        }, {phones: ["+880"], name: "Bangladesh", code: "BD", emoji: "🇧🇩"}, {
            phones: ["+1 246"],
            name: "Barbados",
            code: "BB",
            emoji: "🇧🇧"
        }, {phones: ["+1 268"], name: "Barbuda", code: "AG", emoji: "🇦🇬"}, {
            phones: ["+375"],
            name: "Belarus",
            code: "BY",
            emoji: "🇧🇾"
        }, {phones: ["+32"], name: "Belgium", code: "BE", emoji: "🇧🇪"}, {
            phones: ["+501"],
            name: "Belize",
            code: "BZ",
            emoji: "🇧🇿"
        }, {phones: ["+229"], name: "Benin", code: "BJ", emoji: "🇧🇯"}, {
            phones: ["+1 441"],
            name: "Bermuda",
            code: "BM",
            emoji: "🇧🇲"
        }, {phones: ["+975"], name: "Bhutan", code: "BT", emoji: "🇧🇹"}, {
            phones: ["+591"],
            name: "Bolivia",
            code: "BO",
            emoji: "🇧🇴"
        }, {phones: ["+599 7"], name: "Caribbean Netherlands", code: "BQ", emoji: "🇧🇶"}, {
            phones: ["+387"],
            name: "Bosnia & Herzegovina",
            code: "BA",
            emoji: "🇧🇦"
        }, {phones: ["+267"], name: "Botswana", code: "BW", emoji: "🇧🇼"}, {
            phones: ["+55"],
            name: "Brazil",
            code: "BR",
            emoji: "🇧🇷"
        }, {phones: ["+246"], name: "British Indian Ocean Territory", code: "IO", emoji: "🇮🇴"}, {
            phones: ["+1 284"],
            name: "British Virgin Islands",
            code: "VG",
            emoji: "🇻🇬"
        }, {phones: ["+673"], name: "Brunei", code: "BN", emoji: "🇧🇳"}, {
            phones: ["+359"],
            name: "Bulgaria",
            code: "BG",
            emoji: "🇧🇬"
        }, {phones: ["+226"], name: "Burkina Faso", code: "BF", emoji: "🇧🇫"}, {
            phones: ["+95"],
            name: "Myanmar (Burma)",
            code: "MM",
            emoji: "🇲🇲"
        }, {phones: ["+257"], name: "Burundi", code: "BI", emoji: "🇧🇮"}, {
            phones: ["+855"],
            name: "Cambodia",
            code: "KH",
            emoji: "🇰🇭"
        }, {phones: ["+237"], name: "Cameroon", code: "CM", emoji: "🇨🇲"}, {
            phones: ["+1"],
            name: "Canada",
            code: "CA",
            emoji: "🇨🇦"
        }, {phones: ["+238"], name: "Cape Verde", code: "CV", emoji: "🇨🇻"}, {
            phones: ["+1 345"],
            name: "Cayman Islands",
            code: "KY",
            emoji: "🇰🇾"
        }, {phones: ["+236"], name: "Central African Republic", code: "CF", emoji: "🇨🇫"}, {
            phones: ["+235"],
            name: "Chad",
            code: "TD",
            emoji: "🇹🇩"
        }, {phones: ["+56"], name: "Chile", code: "CL", emoji: "🇨🇱"}, {
            phones: ["+86"],
            name: "China",
            code: "CN",
            emoji: "🇨🇳"
        }, {phones: ["+61"], name: "Christmas Island", code: "CX", emoji: "🇨🇽"}, {
            phones: ["+61"],
            name: "Cocos (Keeling) Islands",
            code: "CC",
            emoji: "🇨🇨"
        }, {phones: ["+57"], name: "Colombia", code: "CO", emoji: "🇨🇴"}, {
            phones: ["+269"],
            name: "Comoros",
            code: "KM",
            emoji: "🇰🇲"
        }, {phones: ["+242"], name: "Congo - Brazzaville", code: "CG", emoji: "🇨🇬"}, {
            phones: ["+243"],
            name: "Congo - Kinshasa",
            code: "CD",
            emoji: "🇨🇩"
        }, {phones: ["+682"], name: "Cook Islands", code: "CK", emoji: "🇨🇰"}, {
            phones: ["+506"],
            name: "Costa Rica",
            code: "CR",
            emoji: "🇨🇷"
        }, {phones: ["+225"], name: "Côte d’Ivoire", code: "CI", emoji: "🇨🇮"}, {
            phones: ["+385"],
            name: "Croatia",
            code: "HR",
            emoji: "🇭🇷"
        }, {phones: ["+53"], name: "Cuba", code: "CU", emoji: "🇨🇺"}, {
            phones: ["+599 9"],
            name: "Curaçao",
            code: "CW",
            emoji: "🇨🇼"
        }, {phones: ["+357"], name: "Cyprus", code: "CY", emoji: "🇨🇾"}, {
            phones: ["+420"],
            name: "Czech Republic",
            code: "CZ",
            emoji: "🇨🇿"
        }, {phones: ["+45"], name: "Denmark", code: "DK", emoji: "🇩🇰"}, {
            phones: ["+246"],
            name: "Diego Garcia",
            code: "DG",
            emoji: "🇩🇬"
        }, {phones: ["+253"], name: "Djibouti", code: "DJ", emoji: "🇩🇯"}, {
            phones: ["+1 767"],
            name: "Dominica",
            code: "DM",
            emoji: "🇩🇲"
        }, {
            phones: ["+1 809", "+1 829", "+1 849"],
            name: "Dominican Republic",
            code: "DO",
            emoji: "🇩🇴"
        }, {phones: ["+670"], name: "Timor-Leste", code: "TL", emoji: "🇹🇱"}, {
            phones: ["+593"],
            name: "Ecuador",
            code: "EC",
            emoji: "🇪🇨"
        }, {phones: ["+20"], name: "Egypt", code: "EG", emoji: "🇪🇬"}, {
            phones: ["+503"],
            name: "El Salvador",
            code: "SV",
            emoji: "🇸🇻"
        }, {phones: ["+240"], name: "Equatorial Guinea", code: "GQ", emoji: "🇬🇶"}, {
            phones: ["+291"],
            name: "Eritrea",
            code: "ER",
            emoji: "🇪🇷"
        }, {phones: ["+372"], name: "Estonia", code: "EE", emoji: "🇪🇪"}, {
            phones: ["+251"],
            name: "Ethiopia",
            code: "ET",
            emoji: "🇪🇹"
        }, {phones: ["+500"], name: "Falkland Islands", code: "FK", emoji: "🇫🇰"}, {
            phones: ["+298"],
            name: "Faroe Islands",
            code: "FO",
            emoji: "🇫🇴"
        }, {phones: ["+679"], name: "Fiji", code: "FJ", emoji: "🇫🇯"}, {
            phones: ["+358"],
            name: "Finland",
            code: "FI",
            emoji: "🇫🇮"
        }, {phones: ["+33"], name: "France", code: "FR", emoji: "🇫🇷"}, {
            phones: ["+594"],
            name: "French Guiana",
            code: "GF",
            emoji: "🇬🇫"
        }, {phones: ["+689"], name: "French Polynesia", code: "PF", emoji: "🇵🇫"}, {
            phones: ["+241"],
            name: "Gabon",
            code: "GA",
            emoji: "🇬🇦"
        }, {phones: ["+220"], name: "Gambia", code: "GM", emoji: "🇬🇲"}, {
            phones: ["+995"],
            name: "Georgia",
            code: "GE",
            emoji: "🇬🇪"
        }, {phones: ["+49"], name: "Germany", code: "DE", emoji: "🇩🇪"}, {
            phones: ["+233"],
            name: "Ghana",
            code: "GH",
            emoji: "🇬🇭"
        }, {phones: ["+350"], name: "Gibraltar", code: "GI", emoji: "🇬🇮"}, {
            phones: ["+30"],
            name: "Greece",
            code: "GR",
            emoji: "🇬🇷"
        }, {phones: ["+299"], name: "Greenland", code: "GL", emoji: "🇬🇱"}, {
            phones: ["+1 473"],
            name: "Grenada",
            code: "GD",
            emoji: "🇬🇩"
        }, {phones: ["+590"], name: "Guadeloupe", code: "GP", emoji: "🇬🇵"}, {
            phones: ["+1 671"],
            name: "Guam",
            code: "GU",
            emoji: "🇬🇺"
        }, {phones: ["+502"], name: "Guatemala", code: "GT", emoji: "🇬🇹"}, {
            phones: ["+44"],
            name: "Guernsey",
            code: "GG",
            emoji: "🇬🇬"
        }, {phones: ["+224"], name: "Guinea", code: "GN", emoji: "🇬🇳"}, {
            phones: ["+245"],
            name: "Guinea-Bissau",
            code: "GW",
            emoji: "🇬🇼"
        }, {phones: ["+592"], name: "Guyana", code: "GY", emoji: "🇬🇾"}, {
            phones: ["+509"],
            name: "Haiti",
            code: "HT",
            emoji: "🇭🇹"
        }, {phones: ["+504"], name: "Honduras", code: "HN", emoji: "🇭🇳"}, {
            phones: ["+852"],
            name: "Hong Kong SAR China",
            code: "HK",
            emoji: "🇭🇰"
        }, {phones: ["+36"], name: "Hungary", code: "HU", emoji: "🇭🇺"}, {
            phones: ["+354"],
            name: "Iceland",
            code: "IS",
            emoji: "🇮🇸"
        }, {phones: ["+91"], name: "India", code: "IN", emoji: "🇮🇳"}, {
            phones: ["+62"],
            name: "Indonesia",
            code: "ID",
            emoji: "🇮🇩"
        }, {phones: ["+98"], name: "Iran", code: "IR", emoji: "🇮🇷"}, {
            phones: ["+964"],
            name: "Iraq",
            code: "IQ",
            emoji: "🇮🇶"
        }, {phones: ["+353"], name: "Ireland", code: "IE", emoji: "🇮🇪"}, {
            phones: ["+972"],
            name: "Israel",
            code: "IL",
            emoji: "🇮🇱"
        }, {phones: ["+39"], name: "Italy", code: "IT", emoji: "🇮🇹"}, {
            phones: ["+1 876"],
            name: "Jamaica",
            code: "JM",
            emoji: "🇯🇲"
        }, {phones: ["+47 79"], name: "Svalbard & Jan Mayen", code: "SJ", emoji: "🇸🇯"}, {
            phones: ["+81"],
            name: "Japan",
            code: "JP",
            emoji: "🇯🇵"
        }, {phones: ["+44"], name: "Jersey", code: "JE", emoji: "🇯🇪"}, {
            phones: ["+962"],
            name: "Jordan",
            code: "JO",
            emoji: "🇯🇴"
        }, {phones: ["+7 7"], name: "Kazakhstan", code: "KZ", emoji: "🇰🇿"}, {
            phones: ["+254"],
            name: "Kenya",
            code: "KE",
            emoji: "🇰🇪"
        }, {phones: ["+686"], name: "Kiribati", code: "KI", emoji: "🇰🇮"}, {
            phones: ["+850"],
            name: "North Korea",
            code: "KP",
            emoji: "🇰🇵"
        }, {phones: ["+82"], name: "South Korea", code: "KR", emoji: "🇰🇷"}, {
            phones: ["+965"],
            name: "Kuwait",
            code: "KW",
            emoji: "🇰🇼"
        }, {phones: ["+996"], name: "Kyrgyzstan", code: "KG", emoji: "🇰🇬"}, {
            phones: ["+856"],
            name: "Laos",
            code: "LA",
            emoji: "🇱🇦"
        }, {phones: ["+371"], name: "Latvia", code: "LV", emoji: "🇱🇻"}, {
            phones: ["+961"],
            name: "Lebanon",
            code: "LB",
            emoji: "🇱🇧"
        }, {phones: ["+266"], name: "Lesotho", code: "LS", emoji: "🇱🇸"}, {
            phones: ["+231"],
            name: "Liberia",
            code: "LR",
            emoji: "🇱🇷"
        }, {phones: ["+218"], name: "Libya", code: "LY", emoji: "🇱🇾"}, {
            phones: ["+423"],
            name: "Liechtenstein",
            code: "LI",
            emoji: "🇱🇮"
        }, {phones: ["+370"], name: "Lithuania", code: "LT", emoji: "🇱🇹"}, {
            phones: ["+352"],
            name: "Luxembourg",
            code: "LU",
            emoji: "🇱🇺"
        }, {phones: ["+853"], name: "Macau SAR China", code: "MO", emoji: "🇲🇴"}, {
            phones: ["+389"],
            name: "Macedonia",
            code: "MK",
            emoji: "🇲🇰"
        }, {phones: ["+261"], name: "Madagascar", code: "MG", emoji: "🇲🇬"}, {
            phones: ["+265"],
            name: "Malawi",
            code: "MW",
            emoji: "🇲🇼"
        }, {phones: ["+60"], name: "Malaysia", code: "MM", emoji: "🇲🇲"}, {
            phones: ["+960"],
            name: "Maldives",
            code: "MV",
            emoji: "🇲🇻"
        }, {phones: ["+223"], name: "Mali", code: "ML", emoji: "🇲🇱"}, {
            phones: ["+356"],
            name: "Malta",
            code: "MT",
            emoji: "🇲🇹"
        }, {phones: ["+692"], name: "Marshall Islands", code: "MH", emoji: "🇲🇭"}, {
            phones: ["+596"],
            name: "Martinique",
            code: "MQ",
            emoji: "🇲🇶"
        }, {phones: ["+222"], name: "Mauritania", code: "MR", emoji: "🇲🇷"}, {
            phones: ["+230"],
            name: "Mauritius",
            code: "MU",
            emoji: "🇲🇺"
        }, {phones: ["+262"], name: "Mayotte", code: "YT", emoji: "🇾🇹"}, {
            phones: ["+52"],
            name: "Mexico",
            code: "MX",
            emoji: "🇲🇽"
        }, {phones: ["+691"], name: "Micronesia", code: "FM", emoji: "🇫🇲"}, {
            phones: ["+373"],
            name: "Moldova",
            code: "MD",
            emoji: "🇲🇩"
        }, {phones: ["+377"], name: "Monaco", code: "MC", emoji: "🇲🇨"}, {
            phones: ["+976"],
            name: "Mongolia",
            code: "MN",
            emoji: "🇲🇳"
        }, {phones: ["+382"], name: "Montenegro", code: "ME", emoji: "🇲🇪"}, {
            phones: ["+1 664"],
            name: "Montserrat",
            code: "MS",
            emoji: "🇲🇸"
        }, {phones: ["+212"], name: "Morocco", code: "MA", emoji: "🇲🇦"}, {
            phones: ["+258"],
            name: "Mozambique",
            code: "MZ",
            emoji: "🇲🇿"
        }, {phones: ["+264"], name: "Namibia", code: "NA", emoji: "🇳🇦"}, {
            phones: ["+674"],
            name: "Nauru",
            code: "NR",
            emoji: "🇳🇷"
        }, {phones: ["+977"], name: "Nepal", code: "NP", emoji: "🇳🇵"}, {
            phones: ["+31"],
            name: "Netherlands",
            code: "NL",
            emoji: "🇳🇱"
        }, {phones: ["+687"], name: "New Caledonia", code: "NC", emoji: "🇳🇨"}, {
            phones: ["+64"],
            name: "New Zealand",
            code: "NZ",
            emoji: "🇳🇿"
        }, {phones: ["+505"], name: "Nicaragua", code: "NI", emoji: "🇳🇮"}, {
            phones: ["+227"],
            name: "Niger",
            code: "NE",
            emoji: "🇳🇪"
        }, {phones: ["+234"], name: "Nigeria", code: "NG", emoji: "🇳🇬"}, {
            phones: ["+683"],
            name: "Niue",
            code: "NU",
            emoji: "🇳🇺"
        }, {phones: ["+672"], name: "Norfolk Island", code: "NF", emoji: "🇳🇫"}, {
            phones: ["+1 670"],
            name: "Northern Mariana Islands",
            code: "MP",
            emoji: "🇲🇵"
        }, {phones: ["+47"], name: "Norway", code: "NO", emoji: "🇳🇴"}, {
            phones: ["+968"],
            name: "Oman",
            code: "OM",
            emoji: "🇴🇲"
        }, {phones: ["+92"], name: "Pakistan", code: "PK", emoji: "🇵🇰"}, {
            phones: ["+680"],
            name: "Palau",
            code: "PW",
            emoji: "🇵🇼"
        }, {phones: ["+970"], name: "Palestinian Territories", code: "PS", emoji: "🇵🇸"}, {
            phones: ["+507"],
            name: "Panama",
            code: "PA",
            emoji: "🇵🇦"
        }, {phones: ["+675"], name: "Papua New Guinea", code: "PG", emoji: "🇵🇬"}, {
            phones: ["+595"],
            name: "Paraguay",
            code: "PY",
            emoji: "🇵🇾"
        }, {phones: ["+51"], name: "Peru", code: "PE", emoji: "🇵🇪"}, {
            phones: ["+63"],
            name: "Philippines",
            code: "PH",
            emoji: "🇵🇭"
        }, {phones: ["+64"], name: "Pitcairn Islands", code: "PN", emoji: "🇵🇳"}, {
            phones: ["+48"],
            name: "Poland",
            code: "PL",
            emoji: "🇵🇱"
        }, {phones: ["+351"], name: "Portugal", code: "PT", emoji: "🇵🇹"}, {
            phones: ["+1 787", "+1 939"],
            name: "Puerto Rico",
            code: "PR",
            emoji: "🇵🇷"
        }, {phones: ["+974"], name: "Qatar", code: "QA", emoji: "🇶🇦"}, {
            phones: ["+262"],
            name: "Réunion",
            code: "RE",
            emoji: "🇷🇪"
        }, {phones: ["+40"], name: "Romania", code: "RO", emoji: "🇷🇴"}, {
            phones: ["+7"],
            name: "Russia",
            code: "RU",
            emoji: "🇷🇺"
        }, {phones: ["+250"], name: "Rwanda", code: "RW", emoji: "🇷🇼"}, {
            phones: ["+590"],
            name: "St. Barthélemy",
            code: "BL",
            emoji: "🇧🇱"
        }, {phones: ["+290"], name: "St. Helena", code: "SH", emoji: "🇸🇭"}, {
            phones: ["+1 869"],
            name: "St. Kitts & Nevis",
            code: "KN",
            emoji: "🇰🇳"
        }, {phones: ["+1 758"], name: "St. Lucia", code: "LC", emoji: "🇱🇨"}, {
            phones: ["+590"],
            name: "St. Martin (France)",
            code: "MF",
            emoji: "🇲🇫"
        }, {phones: ["+508"], name: "St. Pierre and Miquelon", code: "PM", emoji: "🇵🇲"}, {
            phones: ["+1 784"],
            name: "St. Vincent and the Grenadines",
            code: "VC",
            emoji: "🇻🇨"
        }, {phones: ["+685"], name: "Samoa", code: "WS", emoji: "🇼🇸"}, {
            phones: ["+378"],
            name: "San Marino",
            code: "SM",
            emoji: "🇸🇲"
        }, {phones: ["+239"], name: "São Tomé & Príncipe", code: "ST", emoji: "🇸🇹"}, {
            phones: ["+966"],
            name: "Saudi Arabia",
            code: "SA",
            emoji: "🇸🇦"
        }, {phones: ["+221"], name: "Senegal", code: "SN", emoji: "🇸🇳"}, {
            phones: ["+381"],
            name: "Serbia",
            code: "RS",
            emoji: "🇷🇸"
        }, {phones: ["+248"], name: "Seychelles", code: "SC", emoji: "🇸🇨"}, {
            phones: ["+232"],
            name: "Sierra Leone",
            code: "SL",
            emoji: "🇸🇱"
        }, {phones: ["+65"], name: "Singapore", code: "SG", emoji: "🇸🇬"}, {
            phones: ["+599 3"],
            name: "Sint Eustatius",
            code: "BQ",
            emoji: "🇧🇶"
        }, {phones: ["+1 721"], name: "Sint Maarten", code: "SX", emoji: "🇸🇽"}, {
            phones: ["+421"],
            name: "Slovakia",
            code: "SK",
            emoji: "🇸🇰"
        }, {phones: ["+386"], name: "Slovenia", code: "SI", emoji: "🇸🇮"}, {
            phones: ["+677"],
            name: "Solomon Islands",
            code: "SB",
            emoji: "🇸🇧"
        }, {phones: ["+252"], name: "Somalia", code: "SO", emoji: "🇸🇴"}, {
            phones: ["+27"],
            name: "South Africa",
            code: "ZA",
            emoji: "🇿🇦"
        }, {
            phones: ["+500"],
            name: "South Georgia & South Sandwich Islands",
            code: "GS",
            emoji: "🇬🇸"
        }, {phones: ["+995 34"], name: "South Ossetia"}, {
            phones: ["+211"],
            name: "South Sudan",
            code: "SS",
            emoji: "🇸🇸"
        }, {phones: ["+34"], name: "Spain", code: "ES", emoji: "🇪🇸"}, {
            phones: ["+94"],
            name: "Sri Lanka",
            code: "LK",
            emoji: "🇱🇰"
        }, {phones: ["+249"], name: "Sudan", code: "SD", emoji: "🇸🇩"}, {
            phones: ["+597"],
            name: "Suriname",
            code: "SR",
            emoji: "🇸🇷"
        }, {phones: ["+47 79"], name: "Svalbard", code: "SJ", emoji: "🇸🇯"}, {
            phones: ["+268"],
            name: "Swaziland",
            code: "SZ",
            emoji: "🇸🇿"
        }, {phones: ["+46"], name: "Sweden", code: "SE", emoji: "🇸🇪"}, {
            phones: ["+41"],
            name: "Switzerland",
            code: "CH",
            emoji: "🇨🇭"
        }, {phones: ["+963"], name: "Syria", code: "SY", emoji: "🇸🇾"}, {
            phones: ["+886"],
            name: "Taiwan",
            code: "TW",
            emoji: "🇹🇼"
        }, {phones: ["+992"], name: "Tajikistan", code: "TJ", emoji: "🇹🇯"}, {
            phones: ["+255"],
            name: "Tanzania",
            code: "TZ",
            emoji: "🇹🇿"
        }, {phones: ["+66"], name: "Thailand", code: "TH", emoji: "🇹🇭"}, {
            phones: ["+228"],
            name: "Togo",
            code: "TG",
            emoji: "🇹🇬"
        }, {phones: ["+690"], name: "Tokelau", code: "TK", emoji: "🇹🇰"}, {
            phones: ["+676"],
            name: "Tonga",
            code: "TO",
            emoji: "🇹🇴"
        }, {phones: ["+1 868"], name: "Trinidad & Tobago", code: "TT", emoji: "🇹🇹"}, {
            phones: ["+216"],
            name: "Tunisia",
            code: "TN",
            emoji: "🇹🇳"
        }, {phones: ["+90"], name: "Turkey", code: "TR", emoji: "🇹🇷"}, {
            phones: ["+993"],
            name: "Turkmenistan",
            code: "TM",
            emoji: "🇹🇲"
        }, {phones: ["+1 649"], name: "Turks & Caicos Islands", code: "TC", emoji: "🇹🇨"}, {
            phones: ["+688"],
            name: "Tuvalu",
            code: "TV",
            emoji: "🇹🇻"
        }, {phones: ["+256"], name: "Uganda", code: "UG", emoji: "🇺🇬"}, {
            phones: ["+380"],
            name: "Ukraine",
            code: "UA",
            emoji: "🇺🇦"
        }, {phones: ["+971"], name: "United Arab Emirates", code: "AE", emoji: "🇦🇪"}, {
            phones: ["+44"],
            name: "United Kingdom",
            code: "GB",
            emoji: "🇬🇧"
        }, {phones: ["+1"], name: "United States", code: "US", emoji: "🇺🇸"}, {
            phones: ["+598"],
            name: "Uruguay",
            code: "UY",
            emoji: "🇺🇾"
        }, {phones: ["+1 340"], name: "U.S. Virgin Islands", code: "VI", emoji: "🇻🇮"}, {
            phones: ["+998"],
            name: "Uzbekistan",
            code: "UZ",
            emoji: "🇺🇿"
        }, {phones: ["+678"], name: "Vanuatu", code: "VU", emoji: "🇻🇺"}, {
            phones: ["+58"],
            name: "Venezuela",
            code: "VE",
            emoji: "🇻🇪"
        }, {phones: ["+39 06 698", "+379"], name: "Vatican City", code: "VA", emoji: "🇻🇦"}, {
            phones: ["+84"],
            name: "Vietnam",
            code: "VN",
            emoji: "🇻🇳"
        }, {phones: ["+681"], name: "Wallis & Futuna", code: "WF", emoji: "🇼🇫"}, {
            phones: ["+967"],
            name: "Yemen",
            code: "YE",
            emoji: "🇾🇪"
        }, {phones: ["+260"], name: "Zambia", code: "ZM", emoji: "🇿🇲"}, {
            phones: ["+255"],
            name: "Zanzibar"
        }, {phones: ["+263"], name: "Zimbabwe", code: "ZW", emoji: "🇿🇼"}].filter(t => !!t.emoji),
        af = ["Idle", "Tracking", "Close", "CloseAndPeek", "CloseAndPeekToIdle"],
        of = {phone: 0, code: 1, password: 2, info: 3};

    class cf extends _m {
        constructor(t, e) {
            super(t, null, e), this.tg = t.tg, this.steps = {
                phone: Tm("login__step-phone"),
                code: Tm("login__step-code"),
                password: Tm("login__step-password"),
                info: Tm("login__step-info")
            }, this.logoEl = Tm("login__logo"), this.monkeyEl = Tm("login__monkey"), this.userpicBtnEl = Tm("login__userpic-btn"), this.userpicEl = Tm("login__userpic"), this.phoneInput = Um("login__phone"), this.sendCodeBtn = Um("login__send-code"), this.phoneInput.on("keydown", t => {
                "Enter" == t.key && this.sendCode()
            }), this.phoneInput.on("input", () => {
                const t = this.phoneInput.value.replace(/[^0-9]/g, "");
                if (this.sendCodeBtn.classList.toggle("is-hidden", !t.length), t.length && -1 != this.countryInput.activeIndex) {
                    const e = rf[this.countryInput.activeIndex];
                    for (let s of e.phones) if (t.startsWith(s.replace(/[^0-9]/g, ""))) return;
                    this.countryInput.setAutocompleteIndex(-1)
                }
            }), this.countryInput = Um("login__country"), this.countryInput.setAutocomplete(rf), this.countryInput.on("select", t => {
                const e = this.phoneInput.value.replace(/[^0-9]/g, "");
                for (let s of t.phones) if (e.startsWith(s.replace(/[^0-9]/g, ""))) return;
                this.phoneInput.setValue(t.phones[0] + " "), this.phoneInput.inputEl.focus()
            }), this.phoneTitleEl = Tm("login__title-phone"), this.monkeyCodeEl = Tm("login__monkey-code"), this.phoneEditBtn = Tm("login__title-phone-edit"), this.listen(this.phoneEditBtn, "click", () => {
                this.setStep("phone")
            }), this.codeInput = Um("login__code"), this.sendCodeBtn.on("click", this.sendCode.bind(this)), this.codeInput.on("input", () => {
                clearInterval(this.monkeyIdleInterval), this.isTrackingPlayed || (this.playMonkeyAnimation("Tracking"), this.isTrackingPlayed = !0), this.floodTimer || this.codeInput.value.length !== this.sentCode.type.length || this.signIn()
            }), this.keepSignedCheck = Um("login__keep-signed-in"), this.keepSignedCheck.on("change", () => {
                t.setPersistance(this.keepSignedCheck.checked)
            }), this.checkPasswordBtn = Um("login__check-password"), this.passwordInput = Um("login__password"), this.passwordInput.on("keydown", t => {
                "Enter" == t.key && (t.preventDefault(), this.checkPassword())
            }), this.passwordInput.on("focus", () => {
                this.passwordInput.masked ? this.playMonkeyAnimation("Close", 0, 49) : this.playMonkeyAnimation("CloseAndPeek")
            }), this.passwordInput.on("blur", () => {
                this.passwordInput.masked ? this.playMonkeyAnimation("Close", 49, 98) : this.playMonkeyAnimation("CloseAndPeekToIdle")
            }), this.checkPasswordBtn.on("click", this.checkPassword.bind(this)), this.firstNameInput = Um("login__first-name"), this.firstNameInput.on("keydown", t => {
                "Enter" == t.key && this.signUp()
            }), this.lastNameInput = Um("login__last-name"), this.lastNameInput.on("keydown", t => {
                "Enter" == t.key && this.signUp()
            }), this.signUpBtn = Um("login__save-info"), this.signUpBtn.on("click", this.signUp.bind(this)), this.userpicInput = Tm("login__userpic-input"), this.userpicInput.addEventListener("change", t => {
                if (this.userpicInput.files && this.userpicInput.files[0]) {
                    this.userpicCropPopup = new Qm(this.app), this.userpicCropPopup.on("confirm", (t, e) => {
                        this.userpicEl.style.backgroundImage = `url(${URL.createObjectURL(t)})`, this.userpicBytes = new Uint8Array(e)
                    }), this.userpicCropPopup.show();
                    const t = new FileReader;
                    t.onload = () => {
                        var e = new Image;
                        e.onload = () => {
                            this.userpicCropPopup.setImage(e)
                        }, e.src = t.result
                    }, t.readAsDataURL(this.userpicInput.files[0])
                }
            }), this.userpicEl.addEventListener("click", t => {
                this.userpicInput.click()
            }), this.loadMonkeyAnimations()
        }

        async loadMonkeyAnimations() {
            const t = {};
            this.monkey = {}, this.monkeyEls = {};
            for (let e of af) this.monkeyEls[e] = Tm(`login__monkey-${e.toLowerCase()}`), this.monkey[e] = new Promise((s, n) => {
                t[e] = s
            });
            const e = await this.app.pako, s = await this.app.lottie;
            for (let n of af) {
                const i = await fetch(`./anims/TwoFactorSetupMonkey${n}.tgs`), r = await i.arrayBuffer(),
                    a = JSON.parse(new TextDecoder("utf-8").decode(e.inflate(r))), o = s.loadAnimation({
                        container: this.monkeyEls[n],
                        renderer: "svg",
                        loop: !1,
                        autoplay: !1,
                        animationData: a
                    });
                t[n](o)
            }
        }

        async activate() {
            this.el.classList.add("is-active"), this.setStep("phone");
            const t = await this.tg.call(q);
            if ("phone" == this.currentStep && "" == this.phoneInput.value && !this.countryInput.autocompleteMenu.isOpen) for (let e = 0; e < rf.length; e++) if (rf[e].code == t.country) {
                this.countryInput.selectItem(e);
                break
            }
        }

        deactivate() {
            this.el.classList.remove("is-active")
        }

        async setMonkeyIdleAnimation(t, e = 0, s = 0) {
            this.monkeyIdleInterval && clearInterval(this.monkeyIdleInterval), this.monkeyIdleInterval = setInterval(() => {
                this.playMonkeyAnimation(t, e, s)
            }, 6e3)
        }

        async playMonkeyAnimation(t, e = 0, s = 0) {
            this.monkeyActiveAnim = t + "-" + e;
            for (let e of af) this.monkeyEls[e].style.display = t == e ? "block" : "none";
            const n = await this.monkey[t];
            s || (s = n.totalFrames), console.log(e, s, n.totalFrames), n.segments = [[e, s]], n.isPaused && (n.checkSegments(0), n.play())
        }

        setStep(t) {
            for (let e in this.steps) this.steps[e].classList.toggle("is-hidden-left", of[e] < of[t]), this.steps[e].classList.toggle("is-hidden-right", of[e] > of[t]), this.steps[e].classList.toggle("is-active", e == t);
            this.logoEl.classList.toggle("is-active", "phone" == t), this.monkeyEl.classList.toggle("is-active", "phone" != t && "info" != t), this.userpicEl.classList.toggle("is-active", "info" == t), "phone" == t ? this.phoneInput.focus() : "code" == t ? (this.setMonkeyIdleAnimation("Idle"), this.playMonkeyAnimation("Idle"), this.isTrackingPlayed = !1, this.codeInput.focus()) : "password" == t ? this.passwordInput.focus() : "info" == t && this.firstNameInput.focus(), this.currentStep = t
        }

        async sendCode() {
            this.sendCodeBtn.setLoading(!0);
            try {
                this.sentCode = await this.tg.call(k, {
                    phoneNumber: this.phoneInput.value.replace(/[^0-9]/g, ""),
                    apiId: sf,
                    apiHash: nf,
                    settings: {$$: v}
                }), console.log(this.sentCode), this.phoneTitleEl.textContent = this.phoneInput.value, this.setStep("code")
            } catch (t) {
                this.onError(this.phoneInput, t)
            }
            this.sendCodeBtn.setLoading(!1)
        }

        async checkPassword() {
            const t = this.passwordInput.value;
            if (!t.length) return;
            this.checkPasswordBtn.setLoading(!0);
            const e = await this.tg.call(z), {A: s, M1: n} = await async function (t, e, s, n, i, r) {
                const a = new TextEncoder, o = bigInt(e);
                e = ym(o, 256);
                const c = $m(s), h = $m(wm(256)), l = ym(o.modPow(h, c)), u = $m(r), d = $m(await xm(Cm(s, e))),
                    p = $m(await xm(Cm(l, r))), g = $m(await Am(a.encode(t), n, i)), m = o.modPow(g, c),
                    f = d.multiply(m).mod(c);
                let w = u.subtract(f).mod(c);
                w.isNegative() && (w = w.add(c));
                const $ = ym(w.modPow(h.add(p.multiply(g)), c)), y = await xm($);
                return {A: l, M1: await xm(Cm(km(await xm(s), await xm(e)), await xm(n), await xm(i), l, r, y))}
            }(t, e.currentAlgo.g, e.currentAlgo.p, e.currentAlgo.salt1, e.currentAlgo.salt2, e.srpB);
            try {
                const t = await this.tg.call(W, {password: {$$: I, srpId: e.srpId, a: s, m1: n}});
                this.onAuth(t)
            } catch (t) {
                this.onError(this.passwordInput, t)
            }
            this.checkPasswordBtn.setLoading(!1)
        }

        async signUp() {
            this.signUpBtn.setLoading(!0);
            try {
                const t = await this.tg.call(M, {
                    phoneNumber: this.phoneInput.value.replace(/[^0-9]/g, ""),
                    phoneCodeHash: this.sentCode.phoneCodeHash,
                    firstName: this.firstNameInput.value,
                    lastName: this.lastNameInput.value
                });
                this.userpicBytes && (this.app.updateUserpic(this.userpicBytes), this.userpicBytes = null), this.onAuth(t)
            } catch (t) {
                this.onError(this.firstNameInput, t)
            }
            this.signUpBtn.setLoading(!1)
        }

        async signIn() {
            try {
                const t = await this.tg.call(S, {
                    phoneNumber: this.phoneInput.value.replace(/[^0-9]/g, ""),
                    phoneCode: this.codeInput.value,
                    phoneCodeHash: this.sentCode.phoneCodeHash
                });
                this.onAuth(t)
            } catch (t) {
                "SESSION_PASSWORD_NEEDED" == t.errorMessage ? this.setStep("password") : this.onError(this.codeInput, t)
            }
        }

        onError(t, e) {
            this.floodTimer && (clearInterval(this.floodTimer), this.floodTimer = null), t.setError(this.app.formatError(e), !e.isPermanent), e.timeout && (this.floodTimer = setInterval(() => {
                --e.timeout ? t.setError(this.app.formatError(e), !e.isPermanent) : (t.clearError(), clearInterval(this.floodTimer), this.floodTimer = null)
            }, 1e3))
        }

        async onAuth(t) {
            t.$ != Xu ? this.app.login(t) : this.setStep("info")
        }
    }

    class hf extends _m {
        constructor(t, e) {
            super(t, null, e), this.tg = t.tg, this.dialogList = Um("left__dialogs"), this.dialogList.connectTo(this.app.dialogList), this.dialogList.getItemComponent = () => Vm, this.dialogList.getItemProps = t => ({peerId: t}), this.dialogList.itemEvents = ["click"], this.dialogList.on("item-click", (t, e, s) => {
                this.dialogList.setActivePeer(e.peerId), this.selectDialog(e.peerId)
            }), Tm("left__menu-log-out").addEventListener("click", this.app.logout.bind(this.app)), this.centerEl = Tm("center"), this.centerEmptyEl = Tm("center__empty"), this.activeDialog = null, this.onKeyDown = t => {
                "Escape" == t.key && (this.activeDialog && this.activeDialog.destroy(), this.dialogList.setActivePeer(null), this.centerEmptyEl.classList.remove("is-hidden"), t.preventDefault(), t.stopPropagation())
            }
        }

        deactivate() {
            this.el.classList.remove("is-active"), this.centerEmptyEl.classList.remove("is-hidden"), document.removeEventListener("keydown", this.onKeyDown, !0)
        }

        async activate() {
            this.el.classList.add("is-active"), this.dialogList.queryInitialItems(), document.addEventListener("keydown", this.onKeyDown, !0)
        }

        async selectDialog(t) {
            if (this.activeDialog && this.activeDialog.destroy(), this.app.dialogs.get(t, "unreadCount")) {
                if ("c" == t[0]) {
                    const e = parseInt(t.slice(1));
                    this.app.tg.call(Y, {
                        channel: {
                            $$: w,
                            channelId: e,
                            accessHash: this.app.chats.get(e, "accessHash")
                        }, maxId: 0
                    })
                } else this.app.tg.call(T, {peer: this.app.getInputPeer(t), maxId: 0});
                this.app.dialogs.mergeId(t, {unreadCount: 0})
            }
            this.activeDialog = new Jm(this.app, {peerId: t}), this.centerEl.appendChild(this.activeDialog.el), setTimeout(() => {
                this.activeDialog.newMessageInput.focus()
            }, 200), this.app.setActiveDialog(t), this.centerEmptyEl.classList.add("is-hidden"), this.closeRightPanel()
        }

        async selectProfile(t, e) {
            this.closeRightPanel(), this.activeRightPanel = new Zm(this.app, {
                id: t,
                isUser: e
            }), this.el.appendChild(this.activeRightPanel.el)
        }

        async openMediaViewer(t, e, s = "") {
            this.closeMediaViewer(), t && t.photo && t.photo.sizes ? this.activeMediaViewer = new Xm(this.app, {
                media: t,
                fromId: e,
                caption: s
            }) : console.warn("trying to open", t)
        }

        closeRightPanel() {
            this.activeRightPanel && this.activeRightPanel.destroy(), this.activeRightPanel = null
        }

        closeMediaViewer() {
            this.activeMediaViewer && this.activeMediaViewer.destroy(), this.activeMediaViewer = null
        }
    }

    class lf {
        constructor(t, e) {
            this.lo = t, this.hi = e || 0, this.lo < 0 && (this.lo += 4294967296), this.hi < 0 && (this.hi += 4294967296)
        }

        static fromString(t, e) {
            if (t.startsWith("0x") && (t = t.substr(2), e = 16), 16 === e) {
                const e = t.substr(-8), s = t.substr(0, t.length - e.length);
                return new lf(parseInt(e, 16), parseInt(s, 16))
            }
            return Error("Radixes other than 16 are not supported yet.")
        }

        static fromByteArray(t, e = 0) {
            const s = t[0] | t[1] << 8 | t[2] << 16 | t[3] << 24, n = t[4] | t[5] << 8 | t[6] << 16 | t[7] << 24;
            return new lf(s, n)
        }

        toBigInt() {
            return bigInt(this.toString(16), 16)
        }

        toByteArray(t, e = 0) {
            t[e] = 255 & this.lo, t[e + 1] = this.lo >> 8 & 255, t[e + 2] = this.lo >> 16 & 255, t[e + 3] = this.lo >>> 24 & 255, t[e + 4] = 255 & this.hi, t[e + 5] = this.hi >> 8 & 255, t[e + 6] = this.hi >> 16 & 255, t[e + 7] = this.hi >>> 24 & 255
        }

        equals(t) {
            return null != t && (t instanceof lf ? this.hi === t.hi && this.lo === t.lo : "number" == typeof t ? 0 === this.hi && this.lo === t : "byteLength" in t && (8 === t.byteLength && t[0] === (255 & this.lo) && t[1] === (this.lo >> 8 & 255) && t[2] === (this.lo >> 16 & 255) && t[3] === (this.lo >>> 24 & 255) && t[4] === (255 & this.hi) && t[5] === (this.hi >> 8 & 255) && t[6] === (this.hi >> 16 & 255) && t[7] === (this.hi >>> 24 & 255)))
        }

        gte(t) {
            return this.hi > t.hi || this.hi == t.hi && this.lo >= t.lo
        }

        valueOf() {
            return 4294967295 * this.hi + this.lo
        }

        toString(t) {
            return 16 == t ? this.hi.toString(16) + this.lo.toString(16).padStart(8, "0") : this.hi <= 1048575 ? this.valueOf().toString(t) : void 0 === t ? this.toString(16) : "~" + this.valueOf().toString(t)
        }
    }

    let uf = new TextDecoder;

    class df {
        constructor(t, e) {
            if (t instanceof ArrayBuffer ? (this.buffer = t, t = new Uint8Array(t)) : this.buffer = t.buffer, this.data = new DataView(this.buffer, t.byteOffset, t.byteLength), this.byteArray = t, e) this.offset = 0, this.padTo = 0; else {
                if (this.byteArray.byteLength < 1) throw Error("Buffer is empty");
                if (this.byteArray[0] >= 1 && this.byteArray[0] <= 126) this.totalLength = 4 * this.byteArray[0], this.offset = 1, this.padTo = 1; else {
                    if (127 !== this.byteArray[0]) throw Error(`Unexpected first byte: ${this.byteArray[0]}`);
                    if (this.byteArray.byteLength < 4) throw Error("Buffer is too small");
                    this.totalLength = 4 * (this.byteArray[1] + (this.byteArray[2] << 8) + (this.byteArray[3] << 16)), this.offset = 4, this.padTo = 0
                }
                if (this.offset + this.totalLength !== this.byteArray.byteLength) throw Error(`Invalid packet size: ${this.totalLength}`);
                if (4 == this.totalLength) return void (this.errorCode = -this.int());
                if (this.totalLength < 20) throw Error(`Expected body to be at least 20 bytes long, got only ${this.totalLength}`);
                this.authKeyId = this.long(), this.isEncrypted = 0 != this.authKeyId, this.isEncrypted ? this.messageKey = this.int128() : (this.messageId = this.long(), this.length = this.uint32())
            }
        }

        async decrypt(t, e = !0) {
            const s = this.byteArray.slice(this.offset);
            if (s.byteLength % 16) throw Error(`Invalid payload size: should be a multiple of 16, got ${s.byteLength}`);
            const n = (await Mm(t, this.messageKey, e)).decrypt(s);
            this.buffer = n.buffer,
                this.data = new DataView(this.buffer),
                this.byteArray = n,
                this.offset = 0,
                this.padTo = 0,
                this.isDecrypted = !0,
                this.salt = this.long(),
                this.sessionId = this.long(),
                this.messageId = this.long(),
                this.seqNo = this.uint32(),
                this.length = this.uint32()
        }

        pad() {
            for (; this.offset % 4 != this.padTo;) this.offset++
        }

        int() {
            const t = this.data.getInt32(this.offset, !0);
            return this.offset += 4, t
        }

        uint32() {
            const t = this.data.getUint32(this.offset, !0);
            return this.offset += 4, t
        }

        long() {
            return new lf(this.uint32(), this.uint32())
        }

        double() {
            const t = this.data.getFloat64(this.offset, !0);
            return this.offset += 8, t
        }

        int128() {
            return this.byteArray.slice(this.offset, this.offset += 16)
        }

        int256() {
            return this.byteArray.slice(this.offset, this.offset += 32)
        }

        bytes() {
            let t = this.byteArray[this.offset++];
            254 == t && (t = this.byteArray[this.offset++] | this.byteArray[this.offset++] << 8 | this.byteArray[this.offset++] << 16);
            const e = this.byteArray.slice(this.offset, this.offset += t);
            return this.pad(), e
        }

        string() {
            return uf.decode(this.bytes())
        }

        vectorInt() {
            const t = this.uint32();
            if (481674261 === t) {
                const t = this.uint32(), e = new Array(t);
                for (let s = 0; s < t; s++) e[s] = this.int();
                return e
            }
            throw Error(`Unexpected constructor for Vector<int>: 0x${t.toString(16)}`)
        }

        vectorLong() {
            const t = this.uint32();
            if (481674261 === t) {
                const t = this.uint32(), e = new Array(t);
                for (let s = 0; s < t; s++) e[s] = this.long();
                return e
            }
            throw Error(`Unexpected constructor for Vector<long>: 0x${t.toString(16)}`)
        }

        vector(t, e) {
            let s = this.uint32();
            481674261 === s && (s = this.uint32());
            const n = new Array(s);
            for (let i = 0; i < s; i++) n[i] = t(this, e);
            return n
        }

        object() {
            const t = this.uint32();
            if (571849917 === t) return ud(this);
            throw Error(`Unexpected constructor for Object: 0x${t.toString(16)}`)
        }

        expectEmpty() {
            if (this.offset !== this.totalLength + 1) throw new Error(`Message is not parsed completely, ${this.totalLength - this.offset + 1} bytes remaining!`);
            return !0
        }
    }

    let pf = new TextEncoder;

    class gf {
        constructor() {
            this.count = 0
        }

        uint32() {
            this.count += 4
        }

        int() {
            this.count += 4
        }

        long() {
            this.count += 8
        }

        double() {
            this.count += 8
        }

        int128() {
            this.count += 16
        }

        int256() {
            this.count += 32
        }

        string(t) {
            this.bytes(t.byteLength ? t : pf.encode(t))
        }

        bytes(t) {
            if ("string" == typeof t) return this.string(t);
            for (this.count += t.byteLength + (t.byteLength < 254 ? 1 : 4); this.count % 4;) this.count++
        }

        vector(t) {
            this.count += 8;
            for (let e of t) e.$$(this, e)
        }

        vectorInt(t) {
            this.count += 4 * t.length + 8
        }

        vectorLong(t) {
            this.count += 8 * t.length + 8
        }
    }

    class mf {
        constructor(t, e) {
            this.constr = t, this.params = e;
            const s = new gf;
            this.body(s), this.length = s.count
        }

        body(t) {
            this.constr(t, this.params)
        }

        initBuffer(t, e = 0) {
            this.buffer = new ArrayBuffer(t), this.data = new DataView(this.buffer), this.byteArray = new Uint8Array(this.buffer), this.offset = e, this.padTo = e % 4
        }

        initAbridged(t) {
            this.totalLength = t;
            let e = t / 4;
            e < 127 ? (this.initBuffer(t + 1, 1), this.byteArray[0] = e) : (this.initBuffer(t + 4, 4), this.byteArray[0] = 127, this.byteArray[1] = 255 & e, this.byteArray[2] = e >> 8 & 255, this.byteArray[3] = e >> 16 & 255)
        }

        getData() {
            return this.initBuffer(this.length), this.body(this), this.byteArray
        }

        getMessage(t) {
            return this.initAbridged(this.length + 20), this.long(0), this.long(t), this.uint32(this.length), this.body(this), this.byteArray
        }

        async getEncryptedMessage(t, e, s, n, i) {
            const r = (32 + this.length + 12) % 16, a = 12 + (r ? 16 - r : 0);
            this.initAbridged(56 + this.length + a);
            const o = (await gm(e)).slice(12, 20);
            this.long(o), this.offset += 16;
            const c = this.offset;
            this.long(s), this.long(n), this.long(t), this.int(i), this.uint32(this.length), this.body(this), this.byteArray.set(wm(a), this.offset), this.offset += a;
            const h = this.byteArray.slice(c, this.offset), l = (await mm(Cm(e.slice(88, 120), h))).slice(8, 24),
                u = (await Mm(e, l, !1)).encrypt(h);
            return this.byteArray.set(l, c - 16), this.byteArray.set(u, c), this.byteArray
        }

        uint32(t) {
            this.data.setUint32(this.offset, t, !0), this.offset += 4
        }

        int(t) {
            this.data.setInt32(this.offset, t, !0), this.offset += 4
        }

        long(t) {
            if ("number" == typeof t) this.data.setUint32(this.offset, t, !0); else if ("hi" in t && "lo" in t) this.data.setUint32(this.offset, t.lo, !0), this.data.setUint32(this.offset + 4, t.hi, !0); else if (t.byteLength) t instanceof Uint8Array || (t = new Uint8Array(t, 0, 8)), this.byteArray.set(t, this.offset); else {
                if (!(t instanceof Array)) throw t instanceof bigInt ? Error("Converting big int to long is not supported") : Error("Expected long value as ArrayBuffer/TypedArray/Number/[Number, Number], but got ", t);
                this.data.setUint32(this.offset, t[0], !0), this.data.setUint32(this.offset + 4, t[1], !0)
            }
            this.offset += 8
        }

        double(t) {
            this.data.setFloat64(this.offset, t, !0), this.offset += 8
        }

        int128(t) {
            t instanceof bigInt && (t = ym(t, 16)), this.byteArray.set(t, this.offset), this.offset += 16
        }

        int256(t) {
            t instanceof bigInt && (t = ym(t, 32)), this.byteArray.set(t, this.offset), this.offset += 32
        }

        string(t) {
            this.bytes(t.byteLength ? t : pf.encode(t))
        }

        bytes(t) {
            if ("string" == typeof t) return this.string(t);
            for (t.byteLength < 254 ? this.byteArray[this.offset++] = t.byteLength : (this.byteArray[this.offset++] = 254, this.byteArray[this.offset++] = 255 & t.byteLength, this.byteArray[this.offset++] = t.byteLength >> 8 & 255, this.byteArray[this.offset++] = t.byteLength >> 16 & 255), this.byteArray.set(t, this.offset), this.offset += t.byteLength; this.offset % 4 != this.padTo;) this.offset++
        }

        vector(t) {
            this.uint32(481674261), this.uint32(t.length);
            for (let e of t) e.$$(this, e)
        }

        vectorInt(t) {
            this.uint32(481674261), this.uint32(t.length);
            for (let e of t) this.int(e)
        }

        vectorLong(t) {
            this.uint32(481674261), this.uint32(t.length);
            for (let e of t) this.long(e)
        }
    }

    const ff = new Worker("scripts/worker.js"), wf = {};
    ff.onmessage = function (t) {
        const e = wf[t.data.n];
        e && (e.resolve([bigInt(t.data.p, 16), bigInt(t.data.q, 16), t.data.it]), delete wf[t.data.n])
    };
    const $f = [{
        modulus: "c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6f91f8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e580230e3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b8465fcd6fffeed114011df91c059caedaf97625f6c96ecc74725556934ef781d866b34f011fce4d835a090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b6dd27665722c46b60e5df680fb16b210607ef217652e60236c255f6a28315f4083a96791d7214bf64c1df4fd0db1944fb26a2a57031b32eee64ad15a8ba68885cde74a5bfc920f6abf59ba5c75506373e7130f9042da922179251f",
        exponent: "010001"
    }, {
        modulus: "aeec36c8ffc109cb099624685b97815415657bd76d8c9c3e398103d7ad16c9bba6f525ed0412d7ae2c2de2b44e77d72cbf4b7438709a4e646a05c43427c7f184debf72947519680e651500890c6832796dd11f772c25ff8f576755afe055b0a3752c696eb7d8da0d8be1faf38c9bdd97ce0a77d3916230c4032167100edd0f9e7a3a9b602d04367b689536af0d64b613ccba7962939d3b57682beb6dae5b608130b2e52aca78ba023cf6ce806b1dc49c72cf928a7199d22e3d7ac84e47bc9427d0236945d10dbd15177bab413fbf0edfda09f014c7a7da088dde9759702ca760af2b8e4e97cc055c617bd74c3d97008635b98dc4d621b4891da9fb0473047927",
        exponent: "010001"
    }, {
        modulus: "bdf2c77d81f6afd47bd30f29ac76e55adfe70e487e5e48297e5a9055c9c07d2b93b4ed3994d3eca5098bf18d978d54f8b7c713eb10247607e69af9ef44f38e28f8b439f257a11572945cc0406fe3f37bb92b79112db69eedf2dc71584a661638ea5becb9e23585074b80d57d9f5710dd30d2da940e0ada2f1b878397dc1a72b5ce2531b6f7dd158e09c828d03450ca0ff8a174deacebcaa22dde84ef66ad370f259d18af806638012da0ca4a70baa83d9c158f3552bc9158e69bf332a45809e1c36905a5caa12348dd57941a482131be7b2355a5f4635374f3bd3ddf5ff925bf4809ee27c1e67d9120c5fe08a9de458b1b4a3c5d0a428437f2beca81f4e2d5ff",
        exponent: "010001"
    }, {
        modulus: "b3f762b739be98f343eb1921cf0148cfa27ff7af02b6471213fed9daa0098976e667750324f1abcea4c31e43b7d11f1579133f2b3d9fe27474e462058884e5e1b123be9cbbc6a443b2925c08520e7325e6f1a6d50e117eb61ea49d2534c8bb4d2ae4153fabe832b9edf4c5755fdd8b19940b81d1d96cf433d19e6a22968a85dc80f0312f596bd2530c1cfb28b5fe019ac9bc25cd9c2a5d8a0f3a1c0c79bcca524d315b5e21b5c26b46babe3d75d06d1cd33329ec782a0f22891ed1db42a1d6c0dea431428bc4d7aabdcf3e0eb6fda4e23eb7733e7727e9a1915580796c55188d2596d2665ad1182ba7abf15aaa5a8b779ea996317a20ae044b820bff35b6e8a1",
        exponent: "010001"
    }, {
        modulus: "be6a71558ee577ff03023cfa17aab4e6c86383cff8a7ad38edb9fafe6f323f2d5106cbc8cafb83b869cffd1ccf121cd743d509e589e68765c96601e813dc5b9dfc4be415c7a6526132d0035ca33d6d6075d4f535122a1cdfe017041f1088d1419f65c8e5490ee613e16dbf662698c0f54870f0475fa893fc41eb55b08ff1ac211bc045ded31be27d12c96d8d3cfc6a7ae8aa50bf2ee0f30ed507cc2581e3dec56de94f5dc0a7abee0be990b893f2887bd2c6310a1e0a9e3e38bd34fded2541508dc102a9c9b4c95effd9dd2dfe96c29be647d6c69d66ca500843cfaed6e440196f1dbe0e2e22163c61ca48c79116fa77216726749a976a1c4b0944b5121e8c01",
        exponent: "010001"
    }];
    let yf = async function () {
        let t = [];
        for (let {pem: e, modulus: s, exponent: n} of $f) {
            const e = new mf((t, {n: e, e: s}) => {
                t.string(e), t.string(s)
            }, {n: bm(s), e: bm(n)}), i = await gm(e.getData());
            t.push({modulus: $m(bm(s)), exponent: $m(bm(n)), fingerprint: lf.fromByteArray(i.slice(-8))})
        }
        return t
    }();
    const bf = 16, If = 6e4;

    class vf {
        constructor({delegate: t, url: e, secret: s, auth: n = null, timeOffset: i = 0, gzipInflater: r}) {
            this.delegate = t, this.url = e, this.secret = s, this.auth = n, this.timeOffset = i, this.gzipInflater = r, this.earliestUnacknowledged = null, this.ackTimeout = null, this.ackInbox = [], this.ackOutbox = [], this.isReady = !1, this.newSession(), this.socket = new WebSocket(e, "binary");
            for (let t of ["onWebsocketError", "onWebsocketConnect", "onWebsocketDisconnect", "onWebsocketData"]) this[t] = this[t].bind(this);
            this.socket.addEventListener("error", this.onWebsocketError), this.socket.addEventListener("open", this.onWebsocketConnect), this.socket.addEventListener("close", this.onWebsocketDisconnect), this.socket.addEventListener("message", this.onWebsocketData)
        }

        newSession() {
            this.seqNo = 0, this.lastMessageId = new lf(0), this.sessionId = wm(8)
        }

        destroy() {
            clearTimeout(this.ackTimeout), this.socket.removeEventListener("error", this.onWebsocketError), this.socket.removeEventListener("open", this.onWebsocketConnect), this.socket.removeEventListener("close", this.onWebsocketDisconnect), this.socket.removeEventListener("message", this.onWebsocketData), 1 == this.socket.readyState && this.socket.close()
        }

        nextMessageId() {
            const t = Date.now(), e = Math.floor(t / 1e3) + this.timeOffset, s = t % 1e3,
                n = (i = 65535, Math.floor(Math.random() * i));
            var i;
            let r = new lf(s << 21 | n << 3 | 4, e);
            return this.lastMessageId.gte(r) && (r = new lf(this.lastMessageId.lo + 4, this.lastMessageId.hi)), this.lastMessageId = r, r
        }

        nextSeqNo(t = !0) {
            let e = 2 * this.seqNo;
            return t && (e++, this.seqNo++), e
        }

        async generateObfuscationKeys() {
            const t = wm(64), e = t.buffer;
            new DataView(e).setUint32(56, 4025479151, !0);
            const s = new ArrayBuffer(e.byteLength), n = new Uint8Array(s);
            for (let e = 0; e < s.byteLength; e++) n[s.byteLength - e - 1] = t[e];
            let i = new Uint8Array(e, 8, 32);
            this.encryptIV = new Uint8Array(16), this.encryptIV.set(new Uint8Array(e, 40, 16));
            let r = new Uint8Array(s, 8, 32);
            this.decryptIV = new Uint8Array(16), this.decryptIV.set(new Uint8Array(s, 40, 16)), this.secret && (i = await mm(Cm(i, secret)), r = await mm(Cm(r, secret))), this.encryptAES = new lm.CTR(i, this.encryptIV), this.decryptAES = new lm.CTR(r, this.decryptIV);
            const a = await this.obfuscate(e);
            return t.set(new Uint8Array(a, 56, 8), 56), t
        }

        async obfuscate(t) {
            return this.encryptAES.encrypt(t).buffer
        }

        async deobfuscate(t) {
            return this.decryptAES.decrypt(t).buffer
        }

        sendObfuscatedMessage(t, e, s = !1, n = !0) {
            const i = this.nextMessageId(), r = this.nextSeqNo(), a = new mf(t, e),
                o = s ? a.getEncryptedMessage(i, this.auth.key, this.auth.salt, this.sessionId, r) : a.getMessage(i);
            return s && n && this.ackOutbox.push({
                messageId: i,
                seqNo: r,
                constr: t,
                params: e,
                isEncrypted: s
            }), (async () => {
                this.socket.send(await this.obfuscate(await o))
            })(), i
        }

        sendEncryptedMessage(t, e, s) {
            return this.sendObfuscatedMessage(t, e, !0, s)
        }

        async onWebsocketConnect(t) {
            const e = await this.generateObfuscationKeys();
            this.socket.send(e), this.auth ? (this.onMessage = this.onEncryptedMessage, this.isReady = !0, this.delegate.onReady(this.auth)) : (this.nonce = wm(16), this.onMessage = this.onPQChallenge, this.sendObfuscatedMessage(o, {nonce: this.nonce}))
        }

        onWebsocketDisconnect(t) {
            this.delegate && this.delegate.onDisconnect(-t.code, t.reason)
        }

        onWebsocketError(t) {
            this.delegate && this.delegate.onError(-2, "Websocket error")
        }

        onWebsocketData(t) {
            const e = new FileReader;
            e.onload = async t => {
                const e = await this.deobfuscate(t.target.result), s = new df(e);
                if (s.errorCode) return this.delegate.onError(s.errorCode, `Transport error: ${s.errorCode}`);
                if (s.isEncrypted) {
                    const t = (await gm(this.auth.key)).slice(-8);
                    if (!this.auth || !s.authKeyId.equals(t)) return this.delegate.onError(-1, `Received encrypted message with unknown authKeyId: ${s.authKeyId}`);
                    await s.decrypt(this.auth.key)
                }
                this.onMessage(s)
            }, e.readAsArrayBuffer(t.data)
        }

        onMessage(t) {
            this.delegate.onError(-1, `Server sent some data when it was not expected: ${t}`)
        }

        async onPQChallenge(t) {
            const e = dd(t);
            if (!Em(this.nonce, e.nonce)) return this.delegate.onError(-1, "Received invalid nonce from server");
            this.serverNonce = e.serverNonce, fm("Received PQ challenge: ", e);
            const n = await async function (t) {
                const e = await yf;
                for (let s of e) for (let e of t) if (s.fingerprint.equals(e)) return s;
                return null
            }(e.serverPublicKeyFingerprints);
            if (null === n) return this.delegate.onError(-1, "Unable to find a public key for given any of provided fingerprints");
            const i = await (a = $m(e.pq), new Promise((t, e) => {
                const s = a.toString(16);
                wf[s] = {resolve: t, reject: e}, ff.postMessage({n: s})
            }));
            var a;
            this.newNonce = wm(32);
            const o = new mf(s, {
                pq: e.pq,
                p: ym(i[0]),
                q: ym(i[1]),
                nonce: this.nonce,
                serverNonce: this.serverNonce,
                newNonce: this.newNonce
            }).getData(), c = wm(255);
            c.set(await gm(o), 0), c.set(o, 20);
            const h = (l = n, ym($m(c).modPow(l.exponent, l.modulus), 256));
            var l;
            this.sendObfuscatedMessage(r, {
                nonce: this.nonce,
                serverNonce: this.serverNonce,
                p: ym(i[0]),
                q: ym(i[1]),
                publicKeyFingerprint: n.fingerprint,
                encryptedData: h
            }), this.onMessage = this.onDHParams
        }

        async onDHParams(t) {
            const e = pd(t);
            if (fm("Received DH params: ", e), e.$ != et) return this.delegate.onError(-1, "Server failed to send DH params");
            if (!Em(this.nonce, e.nonce) || !Em(this.serverNonce, e.serverNonce)) return this.delegate.onError(-1, "Received invalid nonce from server");
            this.tmpAesKey = Cm(await gm(Cm(this.newNonce, this.serverNonce)), (await gm(Cm(this.serverNonce, this.newNonce))).slice(0, 12)), this.tmpAesIV = Cm((await gm(Cm(this.serverNonce, this.newNonce))).slice(12, 20), await gm(Cm(this.newNonce, this.newNonce)), this.newNonce.slice(0, 4));
            const s = new lm.IGE(this.tmpAesKey, this.tmpAesIV).decrypt(e.encryptedAnswer), n = s.slice(0, 20),
                i = new df(s.slice(20), !0), r = gd(i);
            return Em(n, await gm(s.slice(20, 20 + i.offset))) ? Em(r.nonce, this.nonce) ? Em(r.serverNonce, this.serverNonce) ? (this.timeOffset = Math.floor(Date.now() / 1e3) - r.serverTime, this.delegate.onTimeOffsetUpdated(this.timeOffset), this.dhPrime = $m(r.dhPrime), this.g = bigInt(r.g), this.gA = $m(r.gA), void this.generateDH()) : this.delegate.onError(-1, "Received invalid server nonce from server") : this.delegate.onError(-1, "Received invalid nonce from server") : this.delegate.onError(-1, "Invalid hash for DH params")
        }

        async generateDH(t = 0) {
            const e = $m(wm(256));
            this.auth = {
                key: ym(this.gA.modPow(e, this.dhPrime)),
                salt: lf.fromByteArray(km(this.newNonce.slice(0, 8), this.serverNonce.slice(0, 8)))
            }, this.authKeyAuxHash = (await gm(this.auth.key)).slice(0, 8);
            const s = new mf(n, {
                nonce: this.nonce,
                serverNonce: this.serverNonce,
                retryId: t,
                gB: ym(this.g.modPow(e, this.dhPrime))
            }).getData(), i = new lm.IGE(this.tmpAesKey, this.tmpAesIV).encrypt(Cm(await gm(s), s, 16));
            this.sendObfuscatedMessage(a, {
                nonce: this.nonce,
                serverNonce: this.serverNonce,
                encryptedData: i
            }), this.onMessage = this.onDHAnswer
        }

        async onDHAnswer(t) {
            const e = md(t);
            let s;
            switch (e.$) {
                case nt:
                    if (!Em(s = (await gm(Cm(this.newNonce, new Uint8Array([1]), this.authKeyAuxHash))).slice(4, 20), e.newNonceHash1)) return this.delegate.onError(-1, "Invalid DH answer hash");
                    fm("Auth key generated"), this.onMessage = this.onEncryptedMessage, this.isReady = !0, this.delegate.onReady(this.auth);
                    break;
                case it:
                    if (!Em(s = (await gm(Cm(this.newNonce, new Uint8Array([2]), this.authKeyAuxHash))).slice(4, 20), e.newNonceHash2)) return this.delegate.onError(-1, "Invalid DH answer hash");
                    fm("Received DH answer retry: ", e), this.generateDH(this.authKeyAuxHash);
                    break;
                case rt:
                    return Em(s = (await gm(Cm(this.newNonce, new Uint8Array([3]), this.authKeyAuxHash))).slice(4, 20), e.newNonceHash3) ? this.delegate.onError(-1, "Received DH answer fail") : this.delegate.onError(-1, "Invalid DH answer hash");
                default:
                    return this.delegate.onError(-1, `Unexpected DH answer ${e.$.toString(16)}`)
            }
        }

        ackNow() {
            this.ackInbox.length && (this.sendEncryptedMessage(i, {msgIds: this.ackInbox}, !1), this.ackInbox = []), this.earliestUnacknowledged = null
        }

        ackLater(t) {
            const e = Date.now();
            this.earliestUnacknowledged || (this.earliestUnacknowledged = e), this.ackInbox.push(t), this.ackInbox.length >= bf || this.earliestUnacknowledged + If < e ? (this.ackNow(), clearTimeout(this.ackTimeout), this.ackTimeout = null) : this.ackTimeout || (this.ackTimeout = setTimeout(this.ackNow.bind(this), this.earliestUnacknowledged + If - e))
        }

        onEncryptedMessage(t) {
            const e = ud(t);
            this.processMessage(t.messageId, t.seqNo, e)
        }

        async processMessage(t, e, s) {
            switch (this.ackLater(t), s.$) {
                case wt:
                    for (let t of s.messages) this.processMessage(t.msgId, t.seqNo, t.body);
                    return;
                case yt:
                    s = (await this.gzipInflater).inflate(s.packedData);
                    let n = new df(s, !0);
                    return this.processMessage(t, e, ud(n));
                case bt:
                    for (let t of s.msgIds) for (let e = 0; e < this.ackOutbox.length; e++) if (t.equals(this.ackOutbox[e].messageId)) {
                        this.ackOutbox.splice(e, 1);
                        break
                    }
                    return;
                case at:
                    let i = s.result;
                    if (i.$ == yt) {
                        i = (await this.gzipInflater).inflate(i.packedData);
                        let t = new df(i, !0);
                        i = ud(t)
                    }
                    return void this.delegate.onRPCResult(s.reqMsgId, i);
                case ft:
                    return void (this.auth.salt.equals(s.serverSalt) || (this.auth.salt = s.serverSalt, this.delegate.onAuthUpdated(this.auth)));
                case It:
                    return void this.delegate.onError(-1, `Received bad message notification, code ${s.errorCode}.`);
                case vt:
                    this.auth.salt = s.newServerSalt;
                    for (let t = 0; t < this.ackOutbox.length; t++) {
                        const {messageId: e, constr: n, params: i, isEncrypted: r} = this.ackOutbox[t];
                        if (e.equals(s.badMsgId)) {
                            this.ackOutbox.splice(t, 1);
                            const s = this.sendObfuscatedMessage(n, i, r);
                            this.delegate.onMessageResent(e, s);
                            break
                        }
                    }
                    return void this.delegate.onAuthUpdated(this.auth);
                case os:
                    return void fm("Updates too long received");
                case ls:
                    return void this.delegate.onUpdatePts(s.update, s.date, s.update.pts, "ptsCount" in s.update ? s.update.ptsCount : 1);
                case cs:
                case hs:
                    const {isOut: r, isMentioned: a, isMediaUnread: o, isSilent: c, id: h, message: l, date: u, fwdFrom: d, viaBotId: p, replyToMsgId: g, entities: m} = s,
                        f = {
                            $: We,
                            message: {
                                $: ie,
                                isOut: r,
                                isMentioned: a,
                                isMediaUnread: o,
                                isSilent: c,
                                id: h,
                                message: l,
                                date: u,
                                fwdFrom: d,
                                viaBotId: p,
                                replyToMsgId: g,
                                entities: m
                            }
                        };
                    return s.$ == cs ? r ? f.message.toId = {
                        $: At,
                        userId: s.userId
                    } : (f.message.fromId = s.userId, f.message.toId = {
                        $: At,
                        userId: 0
                    }) : s.$ == hs && (f.message.fromId = s.fromId, f.message.toId = {
                        $: Lt,
                        chatId: s.chatId
                    }), void this.delegate.onUpdatePts(f, s.date, s.pts, "ptsCount" in s ? s.ptsCount : 1);
                case us:
                case ds:
                    return void this.processUpdates(s);
                default:
                    console.warn(`Message ${s.$.name} is decoded, but NOT processed. Check if it's important: `), fm(window.tlRepr(s))
            }
        }

        processUpdates(t) {
            this.delegate.onUsersChats(t);
            for (let e of t.updates) "pts" in e && this.delegate.onUpdatePts(e, t.date, e.pts, "ptsCount" in e ? e.ptsCount : 1);
            this.delegate.onUpdatesSeq(t.updates, t.date, t.seq, t.seqStart ? t.seqStart : t.seq)
        }
    }

    const Ef = 105, Cf = 1220, kf = {1: "pluto", 2: "venus", 3: "aurora", 4: "vesta", 5: "flora"};

    class Mf {
        constructor({delegate: t, dc: e, auth: s, timeOffset: n = 0, testMode: i = !1, trackState: r, isSignedIn: a, gzipInflater: o}) {
            this.delegate = t, this.auth = s, this.timeOffset = n, this.testMode = i, this.trackState = r, this.isSignedIn = a, this.gzipInflater = o, this.seq = 0, this.pts = {0: 0}, this.qts = 0, this.waitingForTransport = [], this.waitingForResponse = [], this.changeDc(e, s)
        }

        destroy() {
            this.delegate = null, this.transport && this.transport.destroy()
        }

        reconnect(t) {
            this.isInited = !1, this.transport && this.transport.destroy(), console.log("trying to connect to ", this.ipAddress), this.transport = new vf({
                delegate: this,
                url: `wss://${kf[this.id]}.web.telegram.org:443/apiws${this.testMode ? "_test" : ""}`,
                auth: t,
                timeOffset: this.timeOffset,
                gzipInflater: this.gzipInflater
            })
        }

        async initState() {
            if (this.trackState && this.isSignedIn) {
                const {pts: t, qts: e, date: s, seq: n, unreadCount: i} = await this.call(H);
                this.pts = {0: t}, this.qts = e, this.seq = n, this.delegate.onUnreadCount(i)
            }
        }

        async changeDc({id: t, ipAddress: e, secret: s = null}, n) {
            this.id = t, this.ipAddress = e, this.secret = s, this.reconnect(n), await this.initState()
        }

        performCall(t, e) {
            return new Promise((s, n) => {
                const i = this.transport.sendEncryptedMessage(t, e);
                this.waitingForResponse.push({constr: t, params: e, messageId: i, resolve: s, reject: n})
            })
        }

        call(t, e = {}) {
            return this.transport.isReady ? this.isInited ? this.performCall(t, e) : (e.$$ = t, this.isInited = !0, console.log("initing"), this.performCall(G, {
                layer: Ef,
                query: {
                    $$: K,
                    apiId: Cf,
                    deviceModel: "Browser",
                    systemVersion: "1.0",
                    appVersion: "1.0",
                    systemLangCode: "ru",
                    langPack: "",
                    langCode: "ru",
                    query: e
                }
            })) : new Promise((s, n) => {
                this.waitingForTransport.push({constr: t, params: e, resolve: s, reject: n})
            })
        }

        async onReady(t) {
            if (await this.delegate.onAuth(this, t), this.transport.isReady) {
                for (let {constr: t, params: e, resolve: s, reject: n} of this.waitingForTransport) this.call(t, e).then(s).catch(n);
                this.waitingForTransport = []
            }
        }

        onError(t, e) {
            404 == t && this.reconnect(), this.delegate.onTransportError(this, {errorCode: t, errorMessage: e})
        }

        onDisconnect() {
            fm("Socket disconnected, reconnecting"), this.reconnect(this.transport.auth)
        }

        onAuthUpdated(t) {
            this.delegate.onAuthUpdated(this, t)
        }

        onTimeOffsetUpdated(t) {
            this.delegate.onTimeOffsetUpdated(this, t)
        }

        onMessageResent(t, e) {
            for (let s of this.waitingForResponse) s.messageId.equals(t) && (s.messageId = e)
        }

        async onRPCResult(t, e) {
            for (let s = 0; s < this.waitingForResponse.length; s++) {
                const n = this.waitingForResponse[s];
                if (n.messageId.equals(t)) {
                    if (e.$ == ot) {
                        const t = await this.delegate.onRPCError(this, e, n);
                        t && n.reject(t)
                    } else {
                        if (e.$ == Oe || e.$ == Fe) for (let t of e.dialogs) t.peer.channelId && t.pts && (this.pts[t.peer.channelId] = t.pts); else if (e.$ == Ri && n.params.peer && n.params.peer.channelId) this.pts[n.params.peer.channelId] = e.pts; else if (e.$ == ds) {
                            this.onUsersChats(e);
                            for (let t of e.updates) this.delegate.onUpdate(this, t, e.date)
                        } else e.$ == Se && this.delegate.onSignedIn(this, e.user);
                        n.resolve(e)
                    }
                    this.waitingForResponse.splice(s, 1)
                }
            }
        }

        onUsersChats(t) {
            this.delegate.onUsersChats(this, t)
        }

        onUpdatePts(t, e, s, n) {
            let i = t.channelId || 0;
            t.$ != Oi && t.$ != Er || (i = t.message.toId.channelId, t.$ == Oi && (n = 0)), s && i in this.pts && this.pts[i] + n !== s ? this.pts[i] + n < s ? (fm("PTS gap between updates, ", i, t, s, n, this.pts[i]), this.pts[i] = s, this.delegate.onUpdate(this, t, e)) : fm("already processed PTS, ", i, t, s, n, this.pts[i]) : (s && (this.pts[i] = s), this.delegate.onUpdate(this, t, e))
        }

        onUpdatesSeq(t, e, s, n) {
            for (let i of t) "pts" in i || (this.seq + 1 === n ? (this.seq = s, this.delegate.onUpdate(this, i, e)) : this.seq + 1 < n && fm("SEQ gap between updates"))
        }
    }

    class Sf {
        constructor({delegate: t, initialDc: e, testMode: s = !1, auth: n = {}, timeOffset: i = 0, isSignedIn: r = !1, gzipInflater: a}) {
            this.delegate = t, this.initialDc = e, this.auth = n, this.timeOffset = i, this.testMode = s, this.isSignedIn = r, this.gzipInflater = a, this.fileDcs = {}, this.mainDc = new Mf({
                delegate: this,
                dc: this.initialDc,
                testMode: s,
                auth: n[this.initialDc.id],
                timeOffset: i,
                trackState: !0,
                isSignedIn: r,
                gzipInflater: a
            })
        }

        call(...t) {
            return this.mainDc.call(...t)
        }

        callDc(t, ...e) {
            return t == this.mainDc.id ? this.call(...e) : t in this.fileDcs ? this.fileDcs[t].call(...e) : (this.fileDcs[t] = new Mf({
                delegate: this,
                dc: this.selectDc(t),
                testMode: this.testMode,
                auth: this.auth[t],
                timeOffset: this.timeOffset,
                gzipInflater: this.gzipInflater
            }), this.fileDcs[t].call(...e))
        }

        selectDc(t) {
            if (!this.config) throw Error("Config is not yet received!");
            for (let e of this.config.dcOptions) if (e.id == t && (80 == e.port || 443 == e.port) && !e.isIpv6) return e;
            throw Error(`DC with id = ${t} was not found in config!`)
        }

        async changeMainDc(t) {
            this.mainDc.changeDc(this.selectDc(t)), this.delegate.onMainDcChanged({
                id: this.mainDc.id,
                ipAddress: this.mainDc.ipAddress
            })
        }

        setSignedIn(t) {
            if (this.isSignedIn != t) {
                this.isSignedIn = this.mainDc.isSignedIn = t;
                for (let e in this.fileDcs) this.fileDcs[e].isSignedIn = t;
                this.isSignedIn && this.mainDc.initState()
            }
        }

        async onAuth(t, e) {
            this.auth[t.id] = e, t !== this.mainDc || this.config ? t !== this.mainDc && await t.call(A, await this.call(P, {dcId: t.id})) : this.config = await this.call(V), this.delegate.onAuthUpdated(this.auth)
        }

        onAuthUpdated(t, e) {
            this.auth[t.id] = e, this.delegate.onAuthUpdated(this.auth)
        }

        onSignedIn(t, e) {
            this.setSignedIn(!0), this.delegate.onSignedIn(e)
        }

        onTimeOffsetUpdated(t, e) {
            this.timeOffset = e, this.delegate.onTimeOffsetUpdated(e)
        }

        onTransportError(t, {errorCode: e, errorMessage: s}) {
            fm(`Transport error ${e}: ${s}`)
        }

        async onRPCError(t, {errorCode: e, errorMessage: s}, {constr: n, params: i, resolve: r, reject: a}) {
            fm(`RPC error ${e}: ${s}`), fm(`RPC call was: ${n.name}`, i);
            let o, c = {errorCode: e, errorMessage: s};
            return (o = s.match(/^(PHONE|NETWORK|USER)_MIGRATE_(\d+)$/)) ? (await this.changeMainDc(parseInt(o[2])), this.call(n, i).then(r).catch(a), !1) : (o = s.match(/^FILE_MIGRATE_(\d+)$/)) ? (this.callDc(parseInt(o[2]), n, i).then(r).catch(a), !1) : ((o = s.match(/^FLOOD_WAIT_(\d+)$/)) ? (c.errorMessage = "FLOOD_WAIT", c.isPermanent = !0, c.timeout = parseInt(o[1])) : 401 == e && t === this.mainDc && (this.setSignedIn(!1), this.delegate.onAuthRevoked()), c)
        }

        onUsersChats(t, e) {
            this.delegate.onUsersChats(e)
        }

        onUpdate(t, e, s) {
            this.delegate.onUpdate(e, s)
        }

        onUnreadCount(t, e) {
            this.delegate.onUnreadCount(e)
        }
    }

    qt.equals = (t, e) => t.photoId.equals(e.photoId), Pe.equals = (t, e) => t.isSilent === e.isSilent && t.muteUntil === e.muteUntil;

    class xf {
        constructor() {
            this.values = {}, this.watchers = {}
        }

        getId(t) {
            return t.id
        }

        get(t, e) {
            return t in this.values ? e ? this.values[t][e] : this.values[t] : null
        }

        containsId(t) {
            return t in this.values
        }

        storeId(t, e, {skipExisting: s, mergeFields: n} = {}) {
            if (s && t in this.values) return this.values[t];
            e.$id = t, this.values[t] || (this.values[t] = {});
            const i = this.values[t], r = {};
            let a = !1;
            for (let t in e) {
                let s = !1;
                t in i && "typing" != t ? e[t] instanceof lf ? s = !e[t].equals(i[t]) : "object" != typeof e[t] ? s = e[t] != i[t] : e[t].$ && e[t].$ !== i[t].$ ? s = !0 : e[t].$ && e[t].$.equals && (s = !e[t].$.equals(e[t], i[t])) : s = !0, s && (i[t] = e[t], r[t] = !0, a = !0)
            }
            if (!n) for (let t in i) t in e || (delete i[t], r[t] = !0, a = !0);
            if (a) {
                let s = this.watchers[t] || [];
                for (let {fields: t, watcher: n} of s) for (let s of t) if (s in r) {
                    n(...t.map(t => e[t]));
                    break
                }
            }
            return this.values[t]
        }

        store(t, e) {
            return this.storeId(this.getId(t), t, e)
        }

        mergeId(t, e) {
            return this.storeId(t, e, {mergeFields: !0})
        }

        merge(t) {
            return this.storeId(this.getId(t), t, {mergeFields: !0})
        }

        relocateIds(t, e) {
            this.values[e] = this.values[t], this.watchers[e] = this.watchers[t], delete this.values[t], delete this.watchers[t]
        }

        watch(t, e, s) {
            if (t in this.values) {
                const n = this.values[t];
                s(...e.map(t => n[t]))
            }
            t in this.watchers || (this.watchers[t] = []);
            const n = {fields: e, watcher: s};
            return t in this.watchers ? this.watchers[t].push(n) : this.watchers[t] = [n], n
        }

        unwatch(t, e) {
            t in this.watchers && (this.watchers[t] = this.watchers[t].filter(t => !e.includes(t)))
        }
    }

    function Pf(t) {
        switch (t.$) {
            case At:
                return `u${t.userId}`;
            case Li:
                return `c${t.channelId}`;
            case Lt:
                return `g${t.chatId}`
        }
    }

    function Af(t) {
        return t.$ == ne ? "empty" : t.isOut || t.toId.$ != At ? Pf(t.toId) : `u${t.fromId}`
    }

    class Lf extends xf {
        getId(t) {
            return Pf(t.peer)
        }
    }

    class Nf extends xf {
        getId(t) {
            return t.$peerId + "_" + t.id
        }

        contains(t) {
            return `${Af(t)}_${t.id}` in this.values
        }

        merge(t, ...e) {
            return t.$peerId || (t.$peerId = Af(t)), super.merge(t, ...e)
        }

        store(t, ...e) {
            return t.$peerId || (t.$peerId = Af(t)), super.store(t, ...e)
        }
    }

    const jf = bm("ffd8ffe000104a46494600010100000100010000ffdb004300281c1e231e19282321232d2b28303c64413c37373c7b585d4964918099968f808c8aa0b4e6c3a0aadaad8a8cc8ffcbdaeef5ffffff9bc1fffffffaffe6fdfff8ffdb0043012b2d2d3c353c76414176f8a58ca5f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8ffc00011080000000003012200021101031101ffc4001f0000010501010101010100000000000000000102030405060708090a0bffc400b5100002010303020403050504040000017d01020300041105122131410613516107227114328191a1082342b1c11552d1f02433627282090a161718191a25262728292a3435363738393a434445464748494a535455565758595a636465666768696a737475767778797a838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae1e2e3e4e5e6e7e8e9eaf1f2f3f4f5f6f7f8f9faffc4001f0100030101010101010101010000000000000102030405060708090a0bffc400b51100020102040403040705040400010277000102031104052131061241510761711322328108144291a1b1c109233352f0156272d10a162434e125f11718191a262728292a35363738393a434445464748494a535455565758595a636465666768696a737475767778797a82838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae2e3e4e5e6e7e8e9eaf2f3f4f5f6f7f8f9faffda000c03010002110311003f00"),
        Df = bm("ffd9");

    class Tf {
        constructor(t) {
            let e, s;
            this.promise = new Promise((t, n) => {
                e = t, s = n
            }), this.resolve = e, this.reject = s, this.id = t, this.progress = 0, this.result = null, this.error = null
        }

        static uploadTask(t, e, s) {
            const n = new Tf(`u-${t.toString()}`);
            return n.fileId = t, n.bytes = e, n.name = s, n
        }

        static downloadTask(t, e) {
            const s = new Tf(`d-${e.id.toString()}`);
            return s.dcId = t, s.location = e, s
        }
    }

    class Uf extends xf {
        constructor(t) {
            super(), this.app = t, this.tg = t.tg, this.uploadQueue = [], this.downloadQueue = []
        }

        getFile(t, e, s) {
            const n = new Promise(async (i, r) => {
                try {
                    const r = await this.tg.callDc(t, F, {location: e, offset: 0, limit: 1048576});
                    let a = "";
                    switch (r.type.$) {
                        case Dt:
                            a = "image/jpeg";
                            break;
                        case Tt:
                            a = "image/gif";
                            break;
                        case Ut:
                            a = "image/png";
                            break;
                        case Rt:
                            a = "application/pdf";
                            break;
                        case Bt:
                            a = "audio/mpeg";
                            break;
                        case Ht:
                            a = "video/quicktime";
                            break;
                        case _t:
                            a = "video/mp4";
                            break;
                        case Ot:
                            a = "image/webp"
                    }
                    n.isReady = !0, i(s ? r.bytes : Uf.bytesToFile(r.bytes, a))
                } catch (t) {
                    n.isRejected = !0, r(t)
                }
            });
            return n.isReady = !1, n
        }

        static bytesToFile(t, e = "image/jpeg") {
            return URL.createObjectURL(new Blob([t], {type: e}))
        }

        getPeerPhoto(t, e, s = !1) {
            const n = s ? e.photoBig : e.photoSmall;
            if (n.$url) return n.$url;
            const i = this.getFile(e.dcId, {
                $$: C,
                isBig: s,
                peer: this.app.getInputPeer(t),
                volumeId: n.volumeId,
                localId: n.localId
            });
            return n.$url = i, i
        }

        selectPreferableSize(t, e, s) {
            let n = null;
            for (let i of t) i.w >= e && i.h >= s && (!n || n.w > i.w || n.h > i.h) && (n = i);
            if (!n) for (let e of t) e.w && e.h && (!n || n.w < e.w || n.h < e.h) && (n = e);
            return n
        }

        getMediaPhoto({id: t, sizes: e, dcId: s, fileReference: n, accessHash: i}, r, a) {
            let o = this.selectPreferableSize(e, r, a);
            if (!o) return null;
            const c = o.location;
            if (c.$url) return c.$url;
            const h = this.getFile(s, {$$: E, thumbSize: o.type, id: t, fileReference: n, accessHash: i});
            return c.$url = h, c.$url.width = o.w, c.$url.height = o.h, h
        }

        getCachedMediaPhoto(t, e) {
            let s = null;
            for (let e of t) e.bytes && (s = e.bytes);
            if (!s) return null;
            let n = s;
            return e && ((n = Cm(jf, s.slice(3), Df))[164] = s[1], n[166] = s[2]), Uf.bytesToFile(n)
        }

        getCompressedStickerData(t, e) {
            const {id: s, dcId: n, fileReference: i, accessHash: r} = t;
            if (t.$data) return t.$data;
            const a = this.getFile(n, {
                $$: g,
                id: s,
                accessHash: r,
                fileReference: i,
                thumbSize: ""
            }, !0).then(t => e.inflate(t));
            return t.$data = a, a
        }

        getDocumentData(t) {
            console.log("getting document", t);
            const {id: e, dcId: s, fileReference: n, accessHash: i} = t;
            if (t.$data) return t.$data;
            const r = Tf.downloadTask(s, {$$: g, id: e, accessHash: i, fileReference: n, thumbSize: ""});
            return this.store(r), this.downloadQueue.push(r.id), 1 != this.downloadQueue.length || this.uploadQueue.length || this.checkQueue(), t.$data = r.promise, r
        }

        getDocumentPhoto(t, e, s) {
            const {id: n, thumbs: i, dcId: r, fileReference: a, accessHash: o} = t;
            let c = this.selectPreferableSize(i, e, s), h = "";
            if (c && c.w >= e && c.h >= s ? h = c.type : c = t, c.$url) return c.$url;
            const l = this.getFile(r, {$$: g, id: n, accessHash: o, fileReference: a, thumbSize: h});
            return c.$url = l, l
        }

        uploadFile(t, e = "") {
            const s = lf.fromByteArray(wm(8)), n = Tf.uploadTask(s, t, e);
            return this.store(n), this.uploadQueue.push(n.id), 1 != this.uploadQueue.length || this.downloadQueue.length || this.checkQueue(), n
        }

        async checkQueue() {
            do {
                for (; this.uploadQueue.length;) {
                    const {id: t, fileId: e, bytes: s, name: n, resolve: i} = this.get(this.uploadQueue[0]),
                        r = Math.ceil(s.byteLength / 131072);
                    for (let n = 0; n < r; n++) {
                        const i = 131072 * n, r = Math.min(131072 * (n + 1), s.byteLength), a = s.slice(i, r);
                        await this.tg.call(O, {fileId: e, filePart: n, bytes: a});
                        this.mergeId(t.toString(), {progress: r / s.byteLength})
                    }
                    const a = {$$: u, id: e, parts: r, name: n, md5Checksum: ""};
                    this.mergeId(t.toString(), {result: a}), i(a), this.uploadQueue.shift()
                }
                if (this.downloadQueue.length) {
                    const {id: t, dcId: e, location: s, resolve: n} = this.get(this.downloadQueue[0]),
                        i = await this.getFile(e, s);
                    this.mergeId(t.toString(), {result: i}), n(i), this.downloadQueue.shift()
                }
            } while (this.uploadQueue.length > 0 || this.downloadQueue.length > 0)
        }
    }

    class Rf {
        constructor(t) {
            this.tg = t, this.chunks = [[]], this.components = []
        }

        bindComponent(t) {
            this.components.push(t)
        }

        unbindComponent(t) {
            const e = this.components.indexOf(t);
            -1 != e && this.components.splice(e, 1)
        }

        append(t, e = 0, ...s) {
            this.chunks[e] = this.chunks[e].concat(t);
            const n = this.components.map(e => e.appendItems(t, ...s));
            return Promise.all(n)
        }

        prepend(t, e = 0, ...s) {
            this.chunks[e] = t.concat(this.chunks[e]);
            const n = this.components.map(e => e.prependItems(t, ...s));
            return Promise.all(n)
        }

        move(t, e) {
            const s = this.chunks[0].indexOf(t);
            if (console.log("[list] move ", t, " from ", s, " to ", e), -1 != s && this.chunks[0].splice(s, 1), this.chunks[0].splice(e, 0, t), -1 == s) {
                const s = this.components.map(s => s.insertItems([t], e));
                return Promise.all(s)
            }
            {
                const t = this.components.map(t => t.moveItem(s, e));
                return Promise.all(t)
            }
        }

        delete(t) {
        }

        clear(...t) {
            const e = this.components.map(e => e.clearItems(...t));
            return Promise.all(e)
        }

        replace(t) {
            this.chunks = [t];
            for (let e of this.components) e.setItems(t)
        }

        switcheroo(t, e) {
            const s = this.chunks[0].indexOf(t);
            s > -1 && (this.chunks[0][s] = e)
        }

        getInitial() {
            return this.chunks[0]
        }

        getNear(t) {
        }

        getFollowing(t) {
        }

        getPreceding(t) {
        }
    }

    class Bf extends Rf {
        constructor(t, e) {
            super(t.tg), this.app = t, this.peerId = e
        }

        async loadMessages(t = 0) {
            let e = await this.tg.call(D, {
                peer: this.app.getInputPeer(this.peerId),
                offsetId: t,
                offsetDate: 0,
                addOffset: 0,
                limit: 40,
                maxId: 0,
                minId: 0,
                hash: 0
            });
            const s = this.app.storeData(e), n = [];
            for (let t of s.messages) t.replyToMsgId && !this.app.messages.containsId(`${this.peerId}_${t.replyToMsgId}`) && n.push({
                $$: y,
                id: t.replyToMsgId
            });
            return n.length && this.tg.call(N, {id: n}).then(t => this.app.storeData(t)), s.messages.map(t => t.$id)
        }

        async getInitial() {
            this.clear(), this.replace(await this.loadMessages())
        }

        async getFollowing(...t) {
            if (!this.chunks[0].length) return !0;
            const e = this.chunks[0][this.chunks[0].length - 1].split("_");
            return this.append(await this.loadMessages(e[1]), 0, ...t)
        }
    }

    class Hf extends Rf {
        constructor(t) {
            super(t.tg), this.app = t
        }

        bumpMessage(t) {
            if (this.app.dialogs.get(t.$peerId, "isPinned")) return;
            let e = 0;
            for (let t = 0; t < this.chunks[0].length; t++) if (!this.app.dialogs.get(this.chunks[0][t], "isPinned")) {
                e = t;
                break
            }
            this.move(t.$peerId, e)
        }

        async loadDialogs(t) {
            let e, s;
            t && (e = this.app.dialogs.get(t), s = this.app.messages.get(`${t}_${e.topMessage}`));
            let n = {
                offsetDate: t ? s.date : 0,
                offsetId: t ? e.topMessage : 0,
                offsetPeer: t ? this.app.getInputPeer(t) : {$$: c},
                limit: 50,
                hash: 0
            };
            console.log(n);
            let i = await this.tg.call(j, n);
            return this.app.storeData(i).dialogs.map(t => t.$id)
        }

        async getInitial() {
            this.replace(await this.loadDialogs())
        }

        async getFollowing(...t) {
            if (!this.chunks[0].length) return !0;
            const e = this.chunks[0][this.chunks[0].length - 1], s = await this.loadDialogs(e);
            return this.append(s.filter(t => !this.chunks[0].includes(t)), 0, ...t)
        }
    }

    const _f = "#test" == location.hash, Of = {id: 2, ipAddress: _f ? "149.154.167.40" : "149.154.167.50"}, Ff = {
            AUTH_RESTART: () => "Try again",
            PHONE_NUMBER_INVALID: () => "Invalid Phone",
            PHONE_CODE_INVALID: () => "Invalid Code",
            PHONE_CODE_EXPIRED: () => "Code Expired",
            PASSWORD_HASH_INVALID: () => "Invalid Password",
            PHONE_PASSWORD_FLOOD: () => "Too many failed login attempts, try later",
            FLOOD_WAIT: ({timeout: t}) => `Please wait for ${t} seconds`
        },
        Vf = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function qf() {
        let t, e;
        const s = new Promise((s, n) => {
            t = s, e = n
        });
        return s.resolve = t, s.reject = e, s
    }

    const Kf = window.app = new class {
        constructor() {
            const t = {};
            let e = 0, s = Of;
            if (this.persistance = !0, localStorage.auth) try {
                const e = JSON.parse(localStorage.auth);
                for (let s in e) t[s] = {key: bm(e[s].key), salt: lf.fromString(e[s].salt, 16)};
                fm("Auth data loaded: ", t)
            } catch (t) {
            }
            if (localStorage.timeOffset && (e = parseInt(localStorage.timeOffset) || 0), localStorage.mainDc) try {
                s = JSON.parse(localStorage.mainDc)
            } catch (t) {
            }
            if (localStorage.user) try {
                this.user = JSON.parse(localStorage.user)
            } catch (t) {
            }
            this.pako = qf(), this.lottie = qf(), this.tg = new Sf({
                delegate: this,
                initialDc: s,
                testMode: _f,
                auth: t,
                timeOffset: e,
                isSignedIn: !!this.user,
                gzipInflater: this.pako
            }), this.users = new xf, this.chats = new xf, this.messages = new Nf, this.dialogs = new Lf, this.files = new Uf(this), this.dialogList = new Hf(this), this.messageLists = {}, this.activePeerId = null, this.temporaryMessageIds = {}, function (t) {
                _m.initComponents(t)
            }(this), this.loginController = new cf(this, Tm("login")), this.mainController = new hf(this, Tm("main")), this.setLayout(this.tg.isSignedIn ? "main" : "login"), this.tg.isSignedIn && this.tg.call(L, {id: {$$: l}}).then(t => {
                this.user = t, localStorage.user = JSON.stringify(t)
            }), Tm("app").style.display = "block"
        }

        setLayout(t) {
            "login" == t ? (this.mainController.deactivate(), this.loginController.activate()) : "main" == t && (this.loginController.deactivate(), this.mainController.activate())
        }

        setPersistance(t) {
            this.persistance = t, t || (delete localStorage.user, delete localStorage.auth, delete localStorage.mainDc, delete localStorage.timeOffset)
        }

        getDocumentAttrs(t) {
            let e = {};
            for (let s of t.attributes) switch (s.$) {
                case kn:
                    e.w = s.w, e.h = s.h;
                    break;
                case An:
                    e.fileName = s.fileName;
                    break;
                case Mn:
                    e.isAnimated = !0;
                    break;
                case Sa:
                    e.hasStickers = !0;
                    break;
                case Pn:
                    e.audio = s;
                    break;
                case Sn:
                    e.sticker = s;
                    break;
                case xn:
                    e.video = s
            }
            return e
        }

        formatFullDate(t) {
            return this.formatDay(t) + " at " + this.formatDate(t)
        }

        formatDate(t) {
            const e = new Date(1e3 * t);
            return e.getHours() + ":" + (e.getMinutes() < 10 ? "0" : "") + e.getMinutes()
        }

        formatDay(t) {
            const e = new Date, s = new Date(1e3 * t);
            return s.getFullYear() == e.getFullYear() && s.getMonth() == e.getMonth() && s.getDate() == e.getDate() ? "Today" : Vf[s.getMonth()] + " " + s.getDate()
        }

        formatTime(t) {
            const e = new Date(1e3 * t);
            return e.getHours() + ":" + (e.getMinutes() < 10 ? "0" : "") + e.getMinutes()
        }

        formatDuration(t) {
            const e = Math.floor(t / 60) % 60, s = t % 60;
            return t > 3600 ? `${Math.floor(t / 3600)}:${e < 10 ? "0" : ""}${e}:${s < 10 ? "0" : ""}${s}` : `${e}:${s < 10 ? "0" : ""}${s}`
        }

        formatStatus(t) {
            if (!t || t.$ == Kt) return "";
            switch (t.$) {
                case Gt:
                    return "online";
                case zt:
                    const e = Date.now() / 1e3 - t.wasOnline;
                    return e < 40 ? "last seen just now" : e < 100 ? "last seen a minute ago" : e < 3e3 ? `last seen ${Math.round(e / 60)} minutes ago` : e < 5400 ? "last seen an hour ago" : e < 84600 ? `last seen ${Math.round(e / 60 / 60)} hours ago` : e < 172800 ? "last seen yesterday" : e < 561600 ? `last seen ${Math.round(e / 60 / 60 / 24)} days ago` : e < 907200 ? "last seen a week ago" : e < 2592e3 ? `last seen ${Math.round(e / 60 / 60 / 24 / 7)} weeks ago` : e < 3944700 ? "last seen a month ago" : e < 30242700 ? `last seen ${Math.round(e / 60 / 60 / 24 / 30.4375)} months ago` : e < 47336400 ? "last seen a year ago" : `last seen ${Math.round(e / 60 / 60 / 24 / 365.25)} years ago`;
                case pn:
                    return "last seen in a month";
                case dn:
                    return "last seen in a week";
                case un:
                    return "last seen recently"
            }
            return ""
        }

        formatMediaDescription(t) {
            if (t) switch (t.$) {
                case oe:
                    return "Photo";
                case ce:
                    return "Geolocation";
                case he:
                    return "Contact";
                case Vs:
                    if (t.document) {
                        const e = this.getDocumentAttrs(t.document);
                        if (e.sticker) return "Sticker" + (e.sticker.alt ? ` ${e.sticker.alt}` : "");
                        if (e.video) return "GIF";
                        if (e.audio) return "Audio"
                    }
                    return "Document";
                case Vn:
                    return "Web page";
                case Yn:
                    return "Venue";
                case Pa:
                    return "Game";
                case Lo:
                    return "Photo";
                case Jc:
                    return "Geolocation";
                case su:
                    return "Poll"
            }
            return ""
        }

        formatNumber(t) {
            return t.toLocaleString()
        }

        formatServiceAction({action: t, fromId: e}) {
            let s, n, i, r;
            switch (e && (n = (s = this.users.get(e)).firstName + (s.lastName ? " " + s.lastName : "")), t.users && (1 == t.users.length && t.users[0] == e ? r = !0 : i = t.users.map(t => {
                const e = this.users.get(t);
                return e.firstName + (e.lastName ? " " + e.lastName : "")
            }).join(", ")), t.$) {
                case de:
                    return `Chat "${t.title} was created`;
                case pe:
                    return `Chat was renamed to "${t.title}"`;
                case ge:
                    return "Chat photo was updated";
                case me:
                    return "Chat photo was removed";
                case fe:
                    return r ? `${n} joined the chat` : `${n} invited ${i}`;
                case we:
                    return r ? `${n} left the chat` : `${n} removed ${i}`;
                case ti:
                    return `${n} joined via invite link`;
                case Bi:
                    return "Channel was created";
                case sr:
                case nr:
                    return "Chat migrated to supergroup";
                case kr:
                    return `${n} pinned a message`;
                case da:
                    return "Chat history was cleared";
                case La:
                    return `${n} scored ${t.score} points`;
                case ic:
                    return "Phone call";
                case Oc:
                    return `${n} took a screenshot`;
                case Wc:
                    return t.message;
                case lh:
                    return `Bot @${t.domain} was allowed access to messages`;
                case Ql:
                    return `${n} joined Telegram`;
                case Wh:
                case Yh:
                case Ao:
                case To:
                case ue:
                    return "Empty Message"
            }
        }

        getExtension(t) {
            if (!t) return "";
            const e = t.split(".");
            return e.length < 2 ? "" : e.pop()
        }

        formatFilesize(t) {
            return t >= 1073741824 ? `${(.1 * Math.round(t / 107374182.4)).toFixed(1)} GB` : t >= 1048576 ? `${(.1 * Math.round(t / 104857.6)).toFixed(1)} MB` : t >= 1024 ? `${(.1 * Math.round(t / 102.4)).toFixed(1)} KB` : `${t} B`
        }

        formatPhone(t) {
            return t
        }

        formatError(t) {
            return t.errorMessage in Ff ? Ff[t.errorMessage](t) : t.errorMessage
        }

        formatTyping(t) {
            if (!t) return "";
            const e = [];
            for (let s in t) e.push(this.users.get(s, "firstName"));
            return e.join(", ")
        }

        storeData({users: t = [], chats: e = [], messages: s = [], dialogs: n = []}, i) {
            return {
                users: t.map(t => this.users.store(t, {skipExisting: i})),
                chats: e.map(t => this.chats.store(t, {skipExisting: i})),
                messages: s.map(t => this.messages.store(t, {skipExisting: i})),
                dialogs: n.map(t => this.dialogs.store(t, {skipExisting: i}))
            }
        }

        storeNewMessage(t) {
            const e = this.messages.contains(t);
            if (t = this.messages.store(t), !e) {
                let e = t.toId;
                t.isOut || e.$ != At || (e = {
                    $: At,
                    userId: t.fromId
                }), this.dialogs.containsId(t.$peerId) || this.tg.call(J, {
                    peers: [{
                        $$: b,
                        peer: this.getInputPeer(t.$peerId)
                    }]
                }).then(t => this.storeData(t));
                const s = {peer: e, topMessage: t.id}, n = this.dialogs.get(t.$peerId, "unreadCount") || 0;
                t.$peerId == this.activePeerId && n ? (s.unreadCount = 0, this.tg.call(T, {
                    peer: this.getInputPeer(t.$peerId),
                    maxId: 0
                })) : s.unreadCount = n + 1, this.dialogs.mergeId(t.$peerId, s), t.$peerId == this.activePeerId && this.getMessageList(t.$peerId).prepend([t.$id]), this.dialogList.bumpMessage(t)
            }
        }

        async sendMessage(t) {
            const e = function (t) {
                const e = parseInt(t.slice(1));
                switch (t[0]) {
                    case"u":
                        return {$: At, userId: e};
                    case"c":
                        return {$: Li, channelId: e};
                    case"g":
                        return {$: Lt, chatId: e}
                }
            }(this.activePeerId);
            let s = !0;
            e.$ == At && (s = !this.users.get(e.userId, "isSelf")), t.randomId = lf.fromByteArray(wm(8)), t.peer = this.getInputPeer(this.activePeerId);
            const n = this.tg.call(t.media ? R : U, t);
            let i;
            if (t.media) switch (t.media.$$) {
                case d:
                    i = {$: oe, photo: {}};
                    break;
                case d:
                    i = {$: Vs, document: {}}
            }
            this.storeNewMessage({
                id: t.randomId.toString(),
                isOut: s,
                media: i,
                message: t.message,
                date: Math.floor(Date.now() / 1e3),
                fromId: e.userId,
                toId: e
            }), this.temporaryMessageIds[t.randomId.toString()] = {peerId: this.activePeerId}, console.log("sent: ", await n)
        }

        async updateUserpic(t) {
            const e = await this.files.uploadFile(t, "userpic.jpg").promise;
            return await this.tg.call(_, {file: e})
        }

        userNameUpdater(t) {
            return (e, s, n) => {
                t.textContent = n ? "Deleted Account" : e + (s ? " " + s : "")
            }
        }

        peerPhotoUpdater(t, e) {
            return async (s, n, i, r, a) => {
                a ? (t.classList.remove("is-empty"), t.textContent = "", t.style.backgroundImage = "url(./images/dialog-deleted-userpic.svg)") : s && s.$ != ee && s.$ != Vt ? (t.classList.remove("is-empty"), t.textContent = "", t.style.backgroundImage = `url(${await this.files.getPeerPhoto(e, s)})`) : (t.classList.add("is-empty"), t.textContent = r ? r[0] : n[0] + (i ? i[0] : ""))
            }
        }

        getInputPeer(t) {
            const e = parseInt(t.slice(1));
            switch (t[0]) {
                case"u":
                    return {$$: m, userId: e, accessHash: this.users.get(e, "accessHash")};
                case"c":
                    return {$$: $, channelId: e, accessHash: this.chats.get(e, "accessHash")};
                case"g":
                    return {$$: h, chatId: e};
                default:
                    throw Error("Unexpected peer", t)
            }
        }

        getMessageList(t) {
            return t in this.messageLists || (this.messageLists[t] = new Bf(this, t)), this.messageLists[t]
        }

        setActiveDialog(t) {
            this.activePeerId = t
        }

        onAuthUpdated(t) {
            if (this.persistance) {
                const e = {};
                for (let s in t) e[s] = {key: vm(t[s].key), salt: t[s].salt.toString(16)};
                localStorage.auth = JSON.stringify(e)
            }
        }

        onAuthRevoked() {
            delete this.user, delete localStorage.user, this.setLayout("login")
        }

        onSignedIn(t) {
            this.persistance && (localStorage.user = JSON.stringify(t))
        }

        onMainDcChanged(t) {
            this.persistance && (localStorage.mainDc = JSON.stringify(t))
        }

        onTimeOffsetUpdated(t) {
            this.persistance && (localStorage.timeOffset = t)
        }

        login() {
            this.setLayout("main")
        }

        async logout() {
            await this.tg.call(x), this.tg.setSignedIn(!1), this.onAuthRevoked()
        }

        onUsersChats(t) {
            this.storeData(t, !0)
        }

        onUpdate(t, e) {
            switch (t.$) {
                case We:
                case Oi:
                    return void this.storeNewMessage(t.message);
                case Fr:
                case Er:
                    return void this.messages.merge(t.message);
                case Ye:
                    const e = t.randomId.toString();
                    if (e in this.temporaryMessageIds) {
                        const s = this.temporaryMessageIds[e].peerId;
                        this.messages.relocateIds(`${s}_${e}`, `${s}_${t.id}`), this.messages.mergeId(`${s}_${t.id}`, {id: t.id}), s == this.activePeerId && this.getMessageList(s).switcheroo(`${s}_${e}`, `${s}_${t.id}`), this.dialogs.get(s).topMessage == e && this.dialogs.mergeId(s, {topMessage: t.id}), delete this.temporaryMessageIds[e]
                    }
                    return;
                case es:
                    return void this.users.mergeId(t.userId, {
                        firstName: t.firstName,
                        lastName: t.lastName,
                        username: t.username
                    });
                case ss:
                    return void this.users.mergeId(t.userId, {photo: t.photo});
                case Cn:
                    return void this.users.mergeId(t.userId, {phone: t.phone});
                case ts:
                    return void this.users.mergeId(t.userId, {status: t.status});
                case Je:
                    const s = this.users.get(t.userId, "typing");
                    if (s && s.$timeout && (clearTimeout(s.$timeout), delete s.$timeout), t.action.$ == Xs) this.users.mergeId(t.userId, {typing: !1}); else {
                        const e = t.action;
                        this.users.mergeId(t.userId, {typing: e}), e.$timeout = setTimeout(() => {
                            this.users.mergeId(t.userId, {typing: !1})
                        }, 6e3)
                    }
                    return;
                case Ze:
                    const n = this.chats.get(t.chatId, "typing") || {};
                    return t.userId in n && (clearTimeout(n[t.userId].$timeout), delete n[t.userId].$timeout), void (t.action.$ == Xs ? (delete n[t.userId], this.chats.mergeId(t.chatId, {typing: n})) : (n[t.userId] = t.action, this.chats.mergeId(t.chatId, {typing: n}), n[t.userId].$timeout = setTimeout(() => {
                        const e = this.chats.get(t.chatId, "typing") || {};
                        delete e[t.userId], this.chats.mergeId(t.chatId, {typing: e})
                    }, 6e3)));
                case Un:
                    return void this.dialogs.merge({
                        peer: t.peer,
                        readInboxMaxId: t.maxId,
                        unreadCount: t.stillUnreadCount
                    });
                case Rn:
                    return void this.dialogs.merge({peer: t.peer, readOutboxMaxId: t.maxId});
                case Fi:
                    return void this.dialogs.merge({
                        peer: {$: Li, channelId: t.channelId},
                        readInboxMaxId: t.maxId,
                        unreadCount: t.stillUnreadCount
                    });
                case ca:
                    return void this.dialogs.merge({peer: {$: Li, channelId: t.channelId}, readOutboxMaxId: t.maxId});
                case Js:
                    return void (t.peer.$ == zs && this.dialogs.merge({
                        peer: t.peer.peer,
                        notifySettings: t.notifySettings
                    }));
                case qi:
                    return this.chats.get(t.channelId) ? void this.messages.merge({
                        toId: {
                            $: Li,
                            channelId: t.channelId
                        }, id: t.id, views: t.views
                    }) : void fm(`Update about unknown channel: ${t.channelId}`);
                default:
                    fm(`Received an update ${t.$.name}:`, t)
            }
        }

        onUnreadCount(t) {
        }
    };
    window.libraryLoaded = function (t) {
        console.log(t), Kf[t].resolve(window[t])
    }
}();