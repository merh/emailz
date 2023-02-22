function returnError(callback, code, err) {
    callback(null, {
        statusCode: code,
        headers: {
            /* Required for CORS support to work */
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "PATCH, OPTIONS",
        },
        body: JSON.stringify({ error: err })
    })

}

export { returnError }