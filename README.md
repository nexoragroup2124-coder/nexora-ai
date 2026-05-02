# Nexora

Nexora is a browser-based AI chat app with a ChatGPT-style workspace, local chat history, multiple assistant modes, export tools, and optional API-provider settings.

## Run Locally

Open `index.html` in a browser.

For the best app-like behavior, serve the folder with any static server:

```bash
npx serve .
```

Then open the local URL shown by the command.

## Publish For The World

You can deploy Nexora as a static website on Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any normal web host.

### Simple Hosting Steps

1. Create a GitHub repository named `nexora`.
2. Upload these files:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.webmanifest`
   - `service-worker.js`
   - `icons/`
3. Connect the repository to your hosting provider.
4. Use the project root as the publish directory.
5. Deploy.

No build command is required.

## Important Production Security

The current app can connect to OpenAI-compatible or xAI-compatible chat endpoints from the browser, but public apps should not put a real private API key in frontend code or ask users to share your key.

For a real public AI product:

1. Add a small backend API such as `/api/chat`.
2. Store your provider API key as a server environment variable.
3. Have the browser call your backend.
4. Have your backend call the AI provider.
5. Add rate limits, abuse protection, logging, and payment controls.

This protects your API key and stops strangers from using your account without limits.

## Model Provider Plan

Nexora should be its own original product. It can connect to model providers through official APIs or approved compatible APIs:

- OpenAI-compatible APIs
- xAI-compatible APIs
- Gemini-compatible backend adapter
- Perplexity-compatible APIs
- Custom LLM providers
- Approved voice assistant APIs

Do not copy ChatGPT, Siri, Alexa, Gemini, Perplexity, or xAI branding. Mention providers only as integrations or supported connection options.

## Language Plan

The app now includes a language selector for:

- English
- Hindi
- Telugu
- Tamil
- Gujarati
- Marathi
- Kannada
- Malayalam

For production quality, hire native speakers or use a professional translation workflow before launch.

## Earning Money

Simple pricing structure:

- Free: limited messages per day
- Pro: monthly subscription with more messages and better models
- Team: shared workspace and higher limits
- Credits: extra paid usage for heavy users

Before charging users, add login, payments, rate limits, API budget limits, privacy policy, and terms.

## Connect Real AI On Netlify

Nexora now includes a Netlify backend function at:

```text
/api/chat
```

Set these environment variables in Netlify:

```text
AI_API_KEY=your_provider_api_key
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-4o-mini
```

You can also use another OpenAI-compatible provider by changing `AI_API_URL` and `AI_MODEL`.

In the Nexora app settings, choose:

```text
Nexora Cloud backend
```

Then the public website will call your backend instead of exposing your API key in the browser.

## Make It Installable

Nexora includes:

- `manifest.webmanifest`
- `service-worker.js`
- SVG app icons

After deployment, visitors can install it from supported browsers as a Progressive Web App.

## Suggested Launch Checklist

- Buy a domain such as `nexora.ai` or `nexora.app` if available.
- Add a backend proxy for AI calls.
- Add login and user accounts.
- Add billing if you plan to offer paid usage.
- Add privacy policy and terms pages.
- Test on desktop and mobile.
- Deploy to a global hosting provider.
