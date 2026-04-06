# MyKaraoke

A personal karaoke song list manager. Check it out at [mykaraoke.info](https://mykaraoke.info) — create an account and start tracking your songs.

Built with Next.js, Neon (serverless Postgres), and Drizzle ORM. Hosted on Netlify.

## Local Development

1. Clone the repo
2. `npm install`
3. Create `.env.local` with your Neon connection string:
   ```
   DATABASE_URL=your-neon-connection-string
   ```
4. `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Database

```bash
npm run db:push    # push schema changes to Neon
npm run db:seed    # one-time import from backup JSONs
npm run db:backup  # snapshot current data to scripts/*_backup.json
```
