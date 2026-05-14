# pi-suppress-providers

A [pi](https://github.com/earendil-works/pi-mono) extension that suppresses (unregisters) providers not listed in `enabledProviders` in `settings.json`.

## Problem

Pi makes all providers available whenever their API keys are found in the environment. For example, if `OPENROUTER_API_KEY` is set, all OpenRouter models appear regardless of what you configure. The same happens with `GH_TOKEN` and GitHub Copilot models.

## Solution

This extension reads `enabledProviders` from `settings.json` and unregisters any provider not on that list at startup.

## Installation

### Option 1: As a local path package (recommended)

Add to `~/.pi/agent/settings.json`:

```json
{
  "enabledProviders": ["openrouter"],
  "packages": ["/path/to/pi-supress-providers"]
}
```

### Option 2: Copy to extensions directory

```bash
cp -r /path/to/pi-supress-providers ~/.pi/agent/extensions/
```

### Option 3: One-off with --extension flag

```bash
pi --extension /path/to/pi-supress-providers/index.ts
```

## Configuration

In `~/.pi/agent/settings.json`, add the `enabledProviders` array with the provider names you want to keep:

```json
{
  "enabledProviders": ["openrouter"]
}
```

With this config, only OpenRouter models will be available. All other providers (anthropic, openai, copilot, etc.) are unregistered.

If `enabledProviders` is not set or is empty, the extension does nothing.

## How It Works

1. On `session_start`, reads `enabledProviders` from `settings.json`
2. Lists all currently registered providers from the model registry
3. Calls `pi.unregisterProvider()` for each provider not in the enabled list
4. Logs which providers were suppressed and which were kept

Provider names must match the names pi uses internally (e.g., `anthropic`, `openai`, `google`, `openrouter`, `copilot`, `bedrock`, `xai`, `deepseek`, `mistral`, `ollama`, `groq`, `plexus`, etc.).
