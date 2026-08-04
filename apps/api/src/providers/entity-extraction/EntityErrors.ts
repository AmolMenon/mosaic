import { ProviderError } from "../base/ProviderErrors";

export class MatcherFailure extends ProviderError {}
export class NormalizationFailure extends ProviderError {}
export class ResolutionFailure extends ProviderError {}
export class RelationshipFailure extends ProviderError {}
