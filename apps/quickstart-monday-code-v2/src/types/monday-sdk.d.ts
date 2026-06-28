declare module "monday-sdk-js" {
  interface MondayServerSdk {
    setToken(token: string): void;
    setApiVersion(version: string): void;
    api(query: string, options?: Record<string, unknown>): Promise<{ data: Record<string, unknown> }>;
  }

  function init(config?: Partial<{ token: string; apiVersion: string }>): MondayServerSdk;

  export default init;
}
