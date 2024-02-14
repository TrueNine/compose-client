/**
 * http mediaType
 */
export const MediaTypes = {
    jpg: "image/jpeg",
    js: "application/javascript",
    ts: "application/typescript",
    jsx: "text/jsx",
    tsx: "text/tsx",
    json5: "application/json5",
    txt: "text/plain",
    apk: "application/vnd.android.package-archive",
    apkx: "application/vnd.android.package-archive",
    xls: "application/x-javascript",
    xlsx: "application/msword",
    word: "application/msword",
    pdf: "application/pdf",
    exe: "application/x-msdownload",
    zip: "application/zip",
    tar: "application/x-tar",
    gz: "application/gzip",
    gzip: "application/gzip",
    rar: "application/x-rar-compressed",
    dll: "application/x-msdownload",
    "7z": "application/x-7z-compressed",
    java: "text/x-java-source",
    jar: "application/java-archive",
    md: "text/markdown",
    formData: "multipart/form-data",
    urlEncode: "application/x-www-form-urlencoded",
    json: "application/json",
    css: "text/css",
    html: "text/html",
    xml: "text/xml",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    ttf: "application/x-font-ttf",
    otf: "application/x-font-opentype",
    woff: "application/x-font-woff",
    woff2: "application/x-font-woff2",
    eot: "application/vnd.ms-fontobject",
    bmp: "image/bmp",
    mp3: "audio/mpeg",
    other: "application/octet-stream",
    jped: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
    flv: "video/x-flv",
    avi: "video/x-msvideo",
    wav: "audio/wav",
};

/**
 * http 返回头
 */
export const Headers = {
    contentType: "Content-Type",
    contentLength: "Content-Length",
    userAgent: "Usr-Agent",
    xDeviceId: "X-Device-Id",
    xRequireCleanAuthentication: "X-Require-Clean-Authentication",
    authorization: "Authorization",
    xRefreshToken: "X-Refresh",
};

/**
 * http Content-Type
 */
export const ContentTypes = {
    formType: {
        [Headers.contentType]: MediaTypes.urlEncode,
    },
    jsonType: {
        [Headers.contentType]: MediaTypes.json,
    },
};
