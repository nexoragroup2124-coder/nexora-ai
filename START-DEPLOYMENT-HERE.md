# Nexora AI Deployment Guide

This repository is now ready for Netlify deployment with a working Nexora Cloud backend function.

## Deploy on Netlify

1. Go to https://app.netlify.com and sign in with GitHub.
2. Add a new site and import the repository `nexora-ai`.
3. Use these settings:
   - Build command: leave blank
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
4. In Netlify site settings ? Build & deploy ? Environment, add:
   - `AI_API_KEY` = your OpenAI-compatible API key
   - `AI_API_URL` = `https://api.openai.com/v1/chat/completions`
   - `AI_MODEL` = `gpt-4o-mini` (or another compatible model)

## How it works

- The app frontend is served from `index.html` and `app.js`.
- The cloud backend route is handled by `netlify/functions/chat.js`.
- In the app settings, choose **Nexora Cloud backend**.
- The frontend will call `/api/chat` or `/.netlify/functions/chat` automatically.

## Ready to launch

- Push this repo to GitHub if it is not already there.
- Netlify will auto-deploy after the push.
- Open your new site URL and test the chat experience.

## Notes

- If you want a custom provider, update `AI_API_URL` and `AI_MODEL` accordingly.
- You can also host the Express backend in `server.js` separately if you prefer a full backend service.
