-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[],
    platforms TEXT[] NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    hashtags TEXT[],
    location TEXT,
    mentions TEXT[],
    CONSTRAINT valid_status CHECK (status IN ('pending', 'posted', 'failed'))
);

-- Platform connections table
CREATE TABLE platform_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_platform CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'pinterest'))
);

-- Indexes
CREATE INDEX posts_user_id_idx ON posts(user_id);
CREATE INDEX platform_connections_user_id_idx ON platform_connections(user_id);
CREATE INDEX posts_scheduled_for_idx ON posts(scheduled_for); 