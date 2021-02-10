export class Snowflake {
  constructor(public id: string) {}
  public get asUser(): string {
    return `<@!${this.id}>`;
  }
}
