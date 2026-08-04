import { ProviderHealth } from "../base/ProviderHealth";

export interface DoclingHealth extends ProviderHealth {
  pythonRuntimeStatus: "Healthy" | "Unavailable";
  doclingImportStatus: "Healthy" | "Unavailable";
  packageVersion: string;
}
