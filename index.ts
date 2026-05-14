import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { readEnabledProviders, suppressProviderEnvVars } from "./src/settings.js";

const enabledProviders = readEnabledProviders();
const savedEnv = enabledProviders && enabledProviders.length > 0 ? suppressProviderEnvVars(enabledProviders) : {};

export default function suppressProvidersExtension(pi: ExtensionAPI) {
	if (Object.keys(savedEnv).length === 0) return;

	// Restore env vars once pi has started and models are resolved
	pi.on("session_start", async () => {
		for (const [key, value] of Object.entries(savedEnv)) {
			process.env[key] = value;
		}
	});
}
