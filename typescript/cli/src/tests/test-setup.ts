import {
  LogFormat,
  LogLevel,
  configureRootLogger,
} from '@humanode-hyperlane/utils';

// mute logging in tests
process.env.NODE_ENV === 'test' &&
  configureRootLogger(LogFormat.JSON, LogLevel.Off);
