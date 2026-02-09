import { loggerInfo, loggerError, loggerWarn, loggerDebug, logMessage } from '@/utils/loggerUtils';

describe('loggerUtils', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call console.info via loggerInfo', () => {
    loggerInfo('test message', { key: 'value' }, 'context', 'file.ts', 'testFn');
    expect(console.info).toHaveBeenCalledTimes(1);
    const logged = JSON.parse((console.info as jest.Mock).mock.calls[0][0]);
    expect(logged.level).toBe('info');
    expect(logged.message).toBe('test message');
    expect(logged.payload).toEqual({ key: 'value' });
    expect(logged.context).toBe('context');
    expect(logged.fileName).toBe('file.ts');
    expect(logged.functionName).toBe('testFn');
  });

  it('should call console.error via loggerError', () => {
    loggerError('error message', null, 'ctx');
    expect(console.error).toHaveBeenCalledTimes(1);
    const logged = JSON.parse((console.error as jest.Mock).mock.calls[0][0]);
    expect(logged.level).toBe('error');
    expect(logged.message).toBe('error message');
    expect(logged.payload).toBeNull();
    expect(logged.context).toBe('ctx');
  });

  it('should call console.warn via loggerWarn', () => {
    loggerWarn('warning');
    expect(console.warn).toHaveBeenCalledTimes(1);
    const logged = JSON.parse((console.warn as jest.Mock).mock.calls[0][0]);
    expect(logged.level).toBe('warn');
    expect(logged.message).toBe('warning');
  });

  it('should call console.debug via loggerDebug', () => {
    loggerDebug('debug msg', { data: 123 });
    expect(console.debug).toHaveBeenCalledTimes(1);
    const logged = JSON.parse((console.debug as jest.Mock).mock.calls[0][0]);
    expect(logged.level).toBe('debug');
    expect(logged.message).toBe('debug msg');
    expect(logged.payload).toEqual({ data: 123 });
  });

  it('should include a timestamp in the log entry', () => {
    loggerInfo('timestamp test');
    const logged = JSON.parse((console.info as jest.Mock).mock.calls[0][0]);
    expect(logged.timestamp).toBeDefined();
    expect(new Date(logged.timestamp).getTime()).not.toBeNaN();
  });

  it('should omit undefined optional fields', () => {
    loggerInfo('minimal');
    const logged = JSON.parse((console.info as jest.Mock).mock.calls[0][0]);
    expect(logged).not.toHaveProperty('context');
    expect(logged).not.toHaveProperty('fileName');
    expect(logged).not.toHaveProperty('functionName');
    expect(logged).not.toHaveProperty('payload');
  });

  it('should call logMessage directly with correct console method', () => {
    logMessage('error', 'direct call');
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
