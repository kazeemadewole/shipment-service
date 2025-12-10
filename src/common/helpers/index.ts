import { config } from '../config';
import cryptoRandomString from 'crypto-random-string';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

type CasingType = 'lowercase' | 'uppercase';

export const slugify = (str: string, casing: CasingType = 'lowercase', separator: string = '_') => {
  let slugifiedStr = str
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, separator);

  while (slugifiedStr.startsWith(separator)) {
    slugifiedStr = slugifiedStr.substring(1);
  }

  while (slugifiedStr.endsWith(separator)) {
    slugifiedStr = slugifiedStr.substring(0, slugifiedStr.length - 1);
  }

  if (casing === 'lowercase') {
    slugifiedStr = slugifiedStr.toLowerCase();
  } else if (casing === 'uppercase') {
    slugifiedStr = slugifiedStr.toUpperCase();
  }

  return slugifiedStr;
};

export function titleCase(str: string) {
  if (!str) return '-';
  return str
    .toLowerCase()
    .split(' ')
    .map(function (word: string) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function stringToBoolean(str: string) {
  str = String(str).trim().toLowerCase();
  if (str === 'false') return false;
  if (str === 'true') return true;
  return null; // or handle other cases as needed
}

export const generateCode = (size = 5) => {
  return cryptoRandomString({
    length: size,
    type: 'numeric',
  });
};

export const hash = (data: string, algo: string = 'sha256') => {
  const hash = crypto.createHash(algo);
  const hashObj = hash.update(data, 'utf-8');
  return hashObj.digest('hex');
};

export const generateToken = (payload: object) => {
  const options: jwt.SignOptions = {
    expiresIn: '4d',
  };
  const secretOrPrivateKey = config.JWT_SECRET as jwt.Secret;
  return jwt.sign(payload, secretOrPrivateKey, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET as jwt.Secret);
};

export const getAuthToken = (req): string | undefined => {
  const token = req.headers['x-access-token'] || req.headers.authorization || req.headers.token || req.body.token;
  return (token && token.replace(/^Bearer\s+/, '')) || undefined;
};
