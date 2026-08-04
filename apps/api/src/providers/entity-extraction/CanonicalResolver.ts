export class CanonicalResolver {
  private aliases: Record<string, string> = {
    "LC": "L Catterton",
    "L Catterton Partners": "L Catterton",
    "Acme": "Acme Corp"
  };

  resolve(normalizedText: string, entityType: string): string {
    if (entityType === 'Company' && this.aliases[normalizedText]) {
      return this.aliases[normalizedText];
    }
    return normalizedText;
  }
}
