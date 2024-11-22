import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router
const UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: UPLOADTHING_TOKEN,
  }
  // Apply an (optional) custom config:
  // config: { ... },
});
