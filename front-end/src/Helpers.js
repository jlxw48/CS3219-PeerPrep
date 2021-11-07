function resHasMessage(res) {
    return res.data && res.data.data && res.data.data.message;
}

function getResMessage(res) {
    return res.data.data.message;
}

export { resHasMessage, getResMessage };