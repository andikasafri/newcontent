import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function refreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Create new access token
    return await createAccessToken({
      userId: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string
    });
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}

export async function createAccessToken(
  payload: { userId: string; email: string; role: string }
) {
  return await new SignJWT({
    ...payload,
    jti: nanoid(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);
}

export async function createRefreshToken(
  payload: { userId: string; email: string; role: string }
) {
  return await new SignJWT({
    ...payload,
    jti: nanoid(),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}