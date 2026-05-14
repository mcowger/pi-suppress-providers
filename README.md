# pi-suppress-providers

A [pi](https://github.com/earendil-works/pi-mono) extension that limits which providers appear in model selection, even when API keys for other providers are present in the environment.

## Problem

Pi makes all providers available whenever their API keys are found in the environment. For example, if `OPENROUTER_API_KEY` is set, all OpenRouter models appear in the model selector regardless of what you want. The same happens with `GH_TOKEN` and GitHub Copilot models, or any other provider with a key in your env.

## Solution

This extension reads `enabledProviders` from `settings.json` and temporarily removes the environment variables for non-enabled providers before pi loads its model registry. After pi resolves which models are available, the env vars are restored so they remain accessible to bash commands and other tools.

## Installation

### Option 1: As a local path package (recommended)

Add to `~/.pi/agent/settings.json`:

```json
{
  "enabledProviders": ["openrouter"],
  "packages": ["/path/to/pi-suppress-providers"]
}
```

### Option 2: Copy to extensions directory

```bash
cp -r /path/to/pi-suppress-providers ~/.pi/agent/extensions/
```

### Option 3: One-off with --extension flag

```bash
pi --extension /path/to/pi-suppress-providers/index.ts
```

## Configuration

In `~/.pi/agent/settings.json`, add the `enabledProviders` array with the provider names you want to keep:

```json
{
  "enabledProviders": ["openrouter"]
}
```

With this config, only OpenRouter models will be available. All other providers (anthropic, openai, copilot, etc.) are hidden from model selection.

If `enabledProviders` is not set or is empty, the extension does nothing.

## How It Works

1. At extension load time (before pi resolves models), reads `enabledProviders` from `settings.json`
2. Temporarily deletes the env vars for all non-enabled providers
3. Pi's model registry sees no auth for those providers, so they don't appear in `getAvailable()`
4. On `session_start`, restores the env vars so bash commands and other tools can still use them

## Supported Providers

Provider names must match the names pi uses internally:

| Provider | Env Var(s) |
|----------|-----------|
| `anthropic` | `ANTHROPIC_API_KEY`, `ANTHROPIC_OAUTH_TOKEN` |
| `amazon-bedrock` | `AWS_PROFILE`, `AWS_ACCESS_KEY_ID`, `AWS_BEARER_TOKEN_BEDROCK` |
| `openai` | `OPENAI_API_KEY` |
| `azure-openai-responses` | `AZURE_OPENAI_API_KEY` |
| `deepseek` | `DEEPSEEK_API_KEY` |
| `google` | `GEMINI_API_KEY` |
| `google-vertex` | `GOOGLE_CLOUD_API_KEY`, `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, `GOOGLE_APPLICATION_CREDENTIALS` |
| `groq` | `GROQ_API_KEY` |
| `cerebras` | `CEREBRAS_API_KEY` |
| `xai` | `XAI_API_KEY` |
| `openrouter` | `OPENROUTER_API_KEY` |
| `vercel-ai-gateway` | `AI_GATEWAY_API_KEY` |
| `mistral` | `MISTRAL_API_KEY` |
| `minimax` | `MINIMAX_API_KEY` |
| `minimax-cn` | `MINIMAX_CN_API_KEY` |
| `moonshotai` | `MOONSHOT_API_KEY` |
| `huggingface` | `HF_TOKEN` |
| `fireworks` | `FIREWORKS_API_KEY` |
| `together` | `TOGETHER_API_KEY` |
| `opencode` | `OPENCODE_API_KEY` |
| `opencode-go` | `OPENCODE_API_KEY` |
| `github-copilot` | `COPILOT_GITHUB_TOKEN`, `GH_TOKEN`, `GITHUB_TOKEN` |
| `kimi-coding` | `KIMI_API_KEY` |
| `cloudflare-workers-ai` | `CLOUDFLARE_API_KEY` |
| `cloudflare-ai-gateway` | `CLOUDFLARE_API_KEY` |
| `xiaomi` | `XIAOMI_API_KEY` |
| `xiaomi-token-plan-cn` | `XIAOMI_TOKEN_PLAN_CN_API_KEY` |
| `xiaomi-token-plan-ams` | `XIAOMI_TOKEN_PLAN_AMS_API_KEY` |
| `xiaomi-token-plan-sgp` | `XIAOMI_TOKEN_PLAN_SGP_API_KEY` |
