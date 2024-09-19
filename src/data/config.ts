import ImageKit from "imagekit";
import jwt from "jsonwebtoken"
import multer from 'multer';
import { Request } from "express";



export const ghostURL = 'http://localhost:2368'
export const wordpressURL_BTCWIRES = "https://www.btcwires.com"
export const wordpressURL_Legal_WIRES = "https://www.legal-wires.com"
export const generateImageFromAIUrl = 'https://02dd-2401-4900-8842-6ede-a9dc-87a3-b96-c568.ngrok-free.app/TextToImage';
export const contentAPIKey = "2ea1717d19a2410c608bf0b5d4"
export const key = "66dadcc1dced8f3ca417823a:20152ace7f4dd9587852ec11d84379929a29f8743a74eefa7b01f65b0075bd03";
export const ghostAPIURL = `${ghostURL}/ghost/api/admin/posts/`;
export const ghostContentApiURL = `${ghostURL}/ghost/api/content/posts/`
export const btcWiresApiUrl = `${wordpressURL_Legal_WIRES}/wp-json/wp/v2/posts?_embed=true&`;
export const uploadToGhostFilesUrl = `${ghostURL}/ghost/api/admin/files/upload`;
export const [id, secret] = key.split(':');
export const jwt_secret = "om@"
export const public_Key_ImageKIT = "public_AcesgOoUdxRbJAm5NRJiyJGHSSY="
export const private_Key_ImageKIT = "private_uXGoLgm+b5VYD4v4SyzLi2u0GrA="
export const url_Endpoint_ImageKIT = "https://ik.imagekit.io/omjeem"
export const multerUpload = multer({ storage: multer.memoryStorage() });

export const token = () => {
    return jwt.sign({}, Buffer.from(secret, 'hex'), {
        keyid: id,
        algorithm: 'HS256',
        expiresIn: '5m',
        audience: `/admin/`
    });
}

export enum USER_TYPES {
    ADMIN = 'ADMIN',
    AD_MANAGER = 'AD_MANAGER',
    IMAGE_MANAGER = 'IMAGE_MANAGER',
    USER = 'USER'
}

export enum AD_TYPE {
    _280x540 = "_280x540",
    _728x90 = "_728x90",
    _280x280 = "_280x280",
    _280x50 = "_280x50"
}

export const imagekit = new ImageKit({
    publicKey: public_Key_ImageKIT,
    privateKey: private_Key_ImageKIT,
    urlEndpoint: url_Endpoint_ImageKIT
});

export interface CustomMiddlewareRequest extends Request {
    userId?: string;
    orgId?: string;
    userRole?: string;
    userName? : string;
}


