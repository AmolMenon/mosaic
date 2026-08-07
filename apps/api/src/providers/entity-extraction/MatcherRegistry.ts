import { EntityMatcher } from "./matchers/EntityMatcher";

export class MatcherRegistry {
  private matchers: EntityMatcher[] = [];

  register(matcher: EntityMatcher): void {
    this.matchers.push(matcher);
  }

  getMatchers(): EntityMatcher[] {
    return this.matchers;
  }
}
