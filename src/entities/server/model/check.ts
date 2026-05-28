import type { ServerCheckResult } from './types';

export type CheckTone = 'success' | 'warning' | 'error' | 'info';

/**
 * Человекочитаемая интерпретация результата remote/connect и remote/ping.
 * Успех определяется по `connected === true`, а не по HTTP-коду.
 */
export function describeServerCheck(result: ServerCheckResult): {
  tone: CheckTone;
  title: string;
} {
  if (result.connected) {
    return {
      tone: 'success',
      title: result.method ? `Connected (via ${result.method})` : 'Connected',
    };
  }
  switch (result.status) {
    case 'AUTH_FAILED':
      return { tone: 'error', title: 'Invalid credentials' };
    case 'UNREACHABLE':
      return { tone: 'info', title: 'Server unreachable' };
    case 'TIMEOUT':
      return { tone: 'info', title: 'Connection timed out' };
    case 'ERROR':
      return { tone: 'error', title: 'Session check failed' };
    default:
      return { tone: 'error', title: 'Connection failed' };
  }
}
