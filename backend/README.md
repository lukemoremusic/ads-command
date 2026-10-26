# ADS COMMAND Backend
This separate Node.js server is deployed to Render with **Root Directory** = `backend`, **Build Command** = `npm install`, and **Start Command** = `npm start`.

Environment variables:
- `OPENAI_API_KEY`: secret OpenAI API credential
- `ADMIN_API_TOKEN`: independently generated long random bearer token (minimum 32 random bytes recommended). Do not store it in a public repo or share it in chats.

Routes:
- `GET /health`: public readiness summary; never exposes API secrets
- `POST /api/analyze`: protected with `Authorization: Bearer <ADMIN_API_TOKEN>`, JSON body: `{"genre":"Techno","spent":100,"savesBefore":1000,"savesAfter":1100,"notes":""}`

This backend is an early *private testing* scaffold only. It does not automatically connect to the Windows app, manage user accounts, access TikTok, or launch ads. Before a production deployment, implement authenticated sessions, secure authorization/role boundaries, durable rate limiting, backend job processing, audit logging and cost controls. Never embed `ADMIN_API_TOKEN` in a publicly distributed desktop executable.

The Spotify save difference is observational and not proof of ad attribution.
