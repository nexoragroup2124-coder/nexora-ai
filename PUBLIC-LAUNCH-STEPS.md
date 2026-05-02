# Publish Nexora For Everyone

Your current app is local only while the address starts with `file:///`.

## Easiest Public Launch: Netlify

1. Go to https://app.netlify.com/drop
2. Open this Nexora folder on your computer.
3. Drag the whole folder into Netlify Drop.
4. Wait for upload to finish.
5. Netlify gives you a public link.
6. Share that link with anyone.

That is the fastest way to let the world open Nexora.

## Better Launch: GitHub + Netlify

1. Create a GitHub repo named `nexora`.
2. Upload all files from this folder.
3. Go to Netlify.
4. Click `Add new site`.
5. Choose `Import from Git`.
6. Pick your `nexora` repo.
7. Build command: leave empty.
8. Publish directory: `.`
9. Click `Deploy`.

## Important

The public version can show the Nexora app to everyone. For real paid AI usage, you still need:

- Backend server
- Hidden API keys
- User login
- Payments
- Message limits

Do not publish your private API key inside the frontend.
