export default defineEventHandler(async (event) => {
  return {
    hasPlatform: !!event.context?._platform,
    hasCloudflare: !!event.context?._platform?.cloudflare,
    hasEnv: !!event.context?._platform?.cloudflare?.env,
    bindings: event.context?._platform?.cloudflare?.env ? Object.keys(event.context._platform.cloudflare.env) : [],
    globalEnv: typeof globalThis.__env__ !== 'undefined' ? Object.keys(globalThis.__env__) : [],
  }
})
