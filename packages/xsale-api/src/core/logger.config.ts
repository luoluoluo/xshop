import { LoggerService } from '@nestjs/common';

export class CustomLogger implements LoggerService {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: string, message: any, context?: any): string {
    const timestamp = this.getTimestamp();

    // 处理消息内容
    let messageStr: string;
    if (typeof message === 'object' && message !== null) {
      messageStr = JSON.stringify(message);
    } else {
      messageStr = String(message);
    }

    // 处理上下文内容
    let contextStr = '';
    if (context) {
      if (typeof context === 'string') {
        contextStr = ` [${context}]`;
      } else if (typeof context === 'object' && context !== null) {
        contextStr = ` ${JSON.stringify(context)}`;
      } else {
        contextStr = ` [${String(context)}]`;
      }
    }

    return `[${timestamp}] [${level}]${contextStr} ${messageStr}`;
  }

  log(message: any, context?: any) {
    console.log(this.formatMessage('LOG', message, context));
  }

  error(message: any, context?: any, trace?: string) {
    console.error(this.formatMessage('ERROR', message, context));
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: any, context?: any) {
    console.warn(this.formatMessage('WARN', message, context));
  }

  debug(message: any, context?: any) {
    console.debug(this.formatMessage('DEBUG', message, context));
  }

  verbose(message: any, context?: any) {
    console.log(this.formatMessage('VERBOSE', message, context));
  }
}

export const createLogger = (): CustomLogger => new CustomLogger();
