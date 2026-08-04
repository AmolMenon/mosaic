import { ProviderError } from "../base/ProviderErrors";

export class ExtractionFailure extends ProviderError {}
export class NormalizationFailure extends ProviderError {}
export class ValidationFailure extends ProviderError {}
