import color from 'ansi-colors';

export class Logger {
  static debug(message: string, ...optionalData: unknown[]): void {
    console.debug(
      `${color.bold(color.gray('[DEBUG]:'))} ${message}`,
      ...optionalData
    );
  }
}
