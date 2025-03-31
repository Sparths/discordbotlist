export interface User {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string
  flags?: number
  banner?: string | null
  accentColor?: number
  premiumType?: number
  publicFlags?: number
  locale?: string
  mfaEnabled?: boolean
  verified?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  user: User
  accessToken: string
  expiresAt: number
}

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string
  verified?: boolean
  flags?: number
  banner?: string | null
  accent_color?: number
  premium_type?: number
  public_flags?: number
  locale?: string
  mfa_enabled?: boolean
}

export interface DiscordTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

