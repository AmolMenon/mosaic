import { ProviderError } from "../base/ProviderErrors";

export class ContextBuildingFailure extends ProviderError {}
export class LLMExecutionFailure extends ProviderError {}
export class SchemaValidationFailure extends ProviderError {}
export class EvidenceValidationFailure extends ProviderError {}
