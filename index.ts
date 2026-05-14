import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { log } from "./src/log.js";
import { readEnabledProviders } from "./src/settings.js";

export default function suppressProvidersExtension(pi: ExtensionAPI) {
	pi.on("session_start", async (_event, ctx) => {
		const enabledProviders = readEnabledProviders();
		if (!enabledProviders || enabledProviders.length === 0) {
			log("no enabledProviders configured, nothing to suppress");
			return;
		}

		const enabledSet = new Set(enabledProviders);

		// Collect unique provider names from all registered models
		const allModels = ctx.modelRegistry.getAll();
		const providerNames = [...new Set(allModels.map((m) => m.provider))];

		for (const provider of providerNames) {
			if (!enabledSet.has(provider)) {
				log("unregistering", { provider });
				pi.unregisterProvider(provider);
			}
		}

		const kept = providerNames.filter((p) => enabledSet.has(p));
		log("enabled", { providers: kept });
	});
}
