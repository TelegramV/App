export type resPQ = {
    nonce: Uint8Array | number[],
    server_nonce: Uint8Array | number[],
    pq: Uint8Array | number[],
    server_public_key_fingerprints: Array<string | number[] | Uint8Array>,
}

export type p_q_inner_data = {
    pq: Uint8Array | number[],
    p: Uint8Array | number[],
    q: Uint8Array | number[],
    nonce: Uint8Array | number[],
    server_nonce: Uint8Array | number[],
    new_nonce: Uint8Array | number[],
}

export type server_DH_params_fail = {
    nonce: Uint8Array | number[],
    server_nonce: Uint8Array | number[],
    new_nonce_hash: Uint8Array | number[],
}

export type server_DH_params_ok = {
    nonce: Uint8Array | number[],
    server_nonce: Uint8Array | number[],
    encrypted_answer: Uint8Array | number[],
}

export type server_DH_inner_data = {
    nonce: Uint8Array | number[],
    server_nonce: Uint8Array | number[],
    g: number,
    dh_prime: Uint8Array | number[],
    g_a: Uint8Array | number[],
    server_time: number,
}

export type client_DH_inner_data = {
    nonce: Uint8Array | number[],
    server_nonce: Uint8Array | number[],
    retry_id: string | number[] | Uint8Array,
    g_b: Uint8Array | number[],
}

export type dh_gen_ok = {
    nonce: Uint8Array | number[],
    server_nonce: Uint8Array | number[],
    new_nonce_hash1: Uint8Array | number[],
}

export type dh_gen_retry = {
    nonce: Uint8Array | number[],
    server_nonce: Uint8Array | number[],
    new_nonce_hash2: Uint8Array | number[],
}

export type dh_gen_fail = {
    nonce: Uint8Array | number[],
    server_nonce: Uint8Array | number[],
    new_nonce_hash3: Uint8Array | number[],
}

export type rpc_result = {
    req_msg_id: string | number[] | Uint8Array,
    result: Object,
}

export type rpc_error = {
    error_code: number,
    error_message: string,
}

export type rpc_answer_unknown = {
}

export type rpc_answer_dropped_running = {
}

export type rpc_answer_dropped = {
    msg_id: string | number[] | Uint8Array,
    seq_no: number,
    bytes: number,
}

export type future_salt = {
    valid_since: number,
    valid_until: number,
    salt: string | number[] | Uint8Array,
}

export type future_salts = {
    req_msg_id: string | number[] | Uint8Array,
    now: number,
    salts: Array<future_salt>,
}

export type pong = {
    msg_id: string | number[] | Uint8Array,
    ping_id: string | number[] | Uint8Array,
}

export type destroy_session_ok = {
    session_id: string | number[] | Uint8Array,
}

export type destroy_session_none = {
    session_id: string | number[] | Uint8Array,
}

export type new_session_created = {
    first_msg_id: string | number[] | Uint8Array,
    unique_id: string | number[] | Uint8Array,
    server_salt: string | number[] | Uint8Array,
}

export type msg_container = {
    messages: Array<Message>,
}

export type message = {
    msg_id: string | number[] | Uint8Array,
    seqno: number,
    bytes: number,
    body: Object,
}

export type msg_copy = {
    orig_message: Message,
}

export type gzip_packed = {
    packed_data: Uint8Array | number[],
}

export type msgs_ack = {
    msg_ids: Array<string | number[] | Uint8Array>,
}

export type bad_msg_notification = {
    bad_msg_id: string | number[] | Uint8Array,
    bad_msg_seqno: number,
    error_code: number,
}

export type bad_server_salt = {
    bad_msg_id: string | number[] | Uint8Array,
    bad_msg_seqno: number,
    error_code: number,
    new_server_salt: string | number[] | Uint8Array,
}

export type msg_resend_req = {
    msg_ids: Array<string | number[] | Uint8Array>,
}

export type msgs_state_req = {
    msg_ids: Array<string | number[] | Uint8Array>,
}

export type msgs_state_info = {
    req_msg_id: string | number[] | Uint8Array,
    info: Uint8Array | number[],
}

export type msgs_all_info = {
    msg_ids: Array<string | number[] | Uint8Array>,
    info: Uint8Array | number[],
}

export type msg_detailed_info = {
    msg_id: string | number[] | Uint8Array,
    answer_msg_id: string | number[] | Uint8Array,
    bytes: number,
    status: number,
}

export type msg_new_detailed_info = {
    answer_msg_id: string | number[] | Uint8Array,
    bytes: number,
    status: number,
}

type ResPQ = resPQ
type P_Q_inner_data = p_q_inner_data
type Server_DH_Params = server_DH_params_fail | server_DH_params_ok
type Server_DH_inner_data = server_DH_inner_data
type Client_DH_Inner_Data = client_DH_inner_data
type Set_client_DH_params_answer = dh_gen_ok | dh_gen_retry | dh_gen_fail
type RpcResult = rpc_result
type RpcError = rpc_error
type RpcDropAnswer = rpc_answer_unknown | rpc_answer_dropped_running | rpc_answer_dropped
type FutureSalt = future_salt
type FutureSalts = future_salts
type Pong = pong
type DestroySessionRes = destroy_session_ok | destroy_session_none
type NewSession = new_session_created
type MessageContainer = msg_container
type Message = message
type MessageCopy = msg_copy
type Object = gzip_packed
type MsgsAck = msgs_ack
type BadMsgNotification = bad_msg_notification | bad_server_salt
type MsgResendReq = msg_resend_req
type MsgsStateReq = msgs_state_req
type MsgsStateInfo = msgs_state_info
type MsgsAllInfo = msgs_all_info
type MsgDetailedInfo = msg_detailed_info | msg_new_detailed_info
