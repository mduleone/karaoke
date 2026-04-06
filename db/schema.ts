import { pgTable, text, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

export const songs = pgTable('songs', {
  id: uuid('id').primaryKey().defaultRandom(),
  artist: text('artist').notNull(),
  title: text('title').notNull(),
  notes: text('notes').notNull().default(''),
  username: text('username').notNull(),
  favorite: boolean('favorite').default(false),
  duet: boolean('duet').default(false),
  learn: boolean('learn').default(false),
  retry: boolean('retry').default(false),
  avoid: boolean('avoid').default(false),
  tags: text('tags').array().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const simpleUsers = pgTable('simple_users', {
  username: text('username').primaryKey(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const singingRecords = pgTable('singing_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  songId: uuid('song_id').references(() => songs.id),
  songName: text('song_name').notNull(),
  songArtist: text('song_artist').notNull(),
  username: text('username').notNull(),
  sungAt: timestamp('sung_at', { withTimezone: true }).notNull(),
});
