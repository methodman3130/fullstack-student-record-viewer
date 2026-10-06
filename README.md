# Student Record Viewer

A Vite + React student dashboard built from the supplied guided-project references. Bootstrap provides the interface, while an Express + MongoDB API supplies persisted records, user accounts, and full record management.

## Included features

- Reusable `StudentCard` and `StudentList` components
- Controlled search and section-filter inputs
- `reduce()`-based average calculation and derived 75% pass/fail status
- Filtered-record, passing-record, and class-average summaries
- Bootstrap responsive cards, forms, badges, and empty state
- **Register, log in, and log out** with hashed passwords and signed session tokens
- **Add, edit, and delete students** from the dashboard once signed in
- MongoDB models, seed script, and a REST API

## Run with local starter data

```bash
npm run dev
```

The starter records load by default, so no database is required to explore the read-only UI. Accounts and record management need the API.

## Enable MongoDB and accounts

1. In `server`, copy `env.example` to `.env` and set `MONGODB_URI` and a long random `JWT_SECRET`.
2. Run `npm install --prefix server`.
3. Seed the database with `npm run seed`.
4. Start the API with `npm run server`.
5. In the project root, copy `env.example` to `.env` and set `VITE_USE_API=true`.
6. Start the Vite app with `npm run dev`, then register an account from the dashboard.

The React app fetches `VITE_API_URL` instead of its bundled starter records. If the API is unavailable, it falls back to the starter data in read-only mode.

### Server environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | yes | MongoDB connection string (local or Atlas). |
| `JWT_SECRET` | yes | Secret used to sign session tokens. |
| `CLIENT_ORIGIN` | no | Comma-separated browser origins allowed to call the API with credentials. Defaults to `http://localhost:5173`. |
| `PORT` | no | API port. Defaults to `5000`. |
| `NODE_ENV` | no | Set to `production` to issue secure, cross-site session cookies. |

## API

Reading records is public; every write requires a signed-in user.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | — | Create an account and start a session |
| `POST` | `/api/auth/login` | — | Start a session |
| `POST` | `/api/auth/logout` | — | Clear the session cookie |
| `GET` | `/api/auth/me` | required | Return the signed-in user |
| `GET` | `/api/students` | — | List all students |
| `POST` | `/api/students` | required | Create a student |
| `PUT` | `/api/students/:id` | required | Update a student |
| `DELETE` | `/api/students/:id` | required | Delete a student |

### How sessions work

Passwords are hashed with bcrypt and never leave the server. On register or login the API issues a JWT both as an `httpOnly` cookie and in the response body; the client stores the latter and sends it as a `Bearer` token, so the app works whether or not third-party cookies are allowed. Logging out clears both. Set `NODE_ENV=production` when the API and the site are on different domains so the cookie is issued as `Secure; SameSite=None`.
