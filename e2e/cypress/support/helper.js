class Helper {

    responseToToken(resp) {
        return resp.body['user'].token;
    }

}

export default Helper;