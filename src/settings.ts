import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { log } from "./log.js";
import { PROVIDER_ENV_VARS } from "./provider-env.js";

const SETTINGS_PATH = join(homedir(), ".pi", "agent", "settings.json");

/**
 * Read `enabledProviders` from ~/.pi/agent/settings.json.
 * Returns undefined if the field is absent or settings.json doesn't exist.
 */
export function readEnabledProviders(): string[] | undefined {
	if (!existsSync(SETTINGS_PATH)) {
		log("settings.json not found", { path: SETTINGS_PATH });
		return undefined;
	}

	try {
		const content = stripJsonComments(readFileSync(SETTINGS_PATH, "utf-8"));
		const parsed = JSON.parse(content) as Record<string, unknown>;

		if (Array.isArray(parsed.enabledProviders)) {
			return parsed.enabledProviders.filter((p): p is string => typeof p === "string");
		}

		log("enabledProviders not found or not an array in settings.json");
		return undefined;
	} catch (err) {
		log("error reading settings.json", { error: String(err) });
		return undefined;
	}
}

/**
 * Delete env vars for all providers NOT in the enabled list.
 * Must run before pi loads models (in the extension factory, not in session_start).
 * Returns the list of deleted env vars so they can be restored if needed.
 */
export function suppressProviderEnvVars(enabledProviders: string[]): Record<string, string> {
	const enabledSet = new Set(enabledProviders);
	const deleted: Record<string, string> = {};

	for (const [provider, envVars] of Object.entries(PROVIDER_ENV_VARS) as [string, string[]][]) {
		if (enabledSet.has(provider)) continue;

		for (const envVar of envVars) {
			const value = process.env[envVar];
			if (value) {
				deleted[envVar] = value;
				delete process.env[envVar];
			}
		}
	}

	return deleted;
}

/** Strip // line comments and trailing commas (JSONC support) */
function stripJsonComments(input: string): string {
	return input
		.replace(/"(?:\\.|[^"\\])*"|\/\/[^\n]*/g, (m) => (m[0] === '"' ? m : ""))
		.replace(/"(?:\\.|[^"\\])*"|,(\s*[}\]])/g, (m, tail) => tail ?? (m[0] === '"' ? m : ""));
}
