import jwt from "jsonwebtoken"

export const ghostURL = 'http://localhost:2368'
export const wordpressURL = "https://www.legal-wires.com"

export const key = "66dadcc1dced8f3ca417823a:20152ace7f4dd9587852ec11d84379929a29f8743a74eefa7b01f65b0075bd03";
export const ghostAPIURL = `${ghostURL}/ghost/api/admin/posts/`;
export const btcWiresApiUrl = `${wordpressURL}/wp-json/wp/v2/posts?_embed=true&`;
export const uploadToGhostFilesUrl = `${ghostURL}/ghost/api/admin/files/upload`;


export const [id, secret] = key.split(':');


export const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '55m',
    audience: `/admin/`
});
export const GhostHeader = { Authorization: `Ghost ${token}` };
