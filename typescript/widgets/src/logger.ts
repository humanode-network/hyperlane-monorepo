import { Logger, rootLogger } from '@humanode-hyperlane/utils';

export const widgetLogger: Logger = rootLogger.child({ module: 'widgets' });
