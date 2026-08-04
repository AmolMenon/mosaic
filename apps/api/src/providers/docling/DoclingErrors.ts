import { ProviderError } from "../base/ProviderErrors";

export class UnsupportedDocument extends ProviderError {}
export class CorruptedPDF extends ProviderError {}
export class EncryptedPDF extends ProviderError {}
export class ParsingFailure extends ProviderError {}
export class PartialExtraction extends ProviderError {}
