import { schedule } from "@netlify/functions";

declare var process: {
  env: {
    NETLIFY_REBUILD_HOOK: string;
  };
};

export const handler = schedule("15 8 1,15 * *", async (_) => {
  if (
    process.env.NETLIFY_REBUILD_HOOK == undefined ||
    process.env.NETLIFY_REBUILD_HOOK.trim() == ""
  ) {
    return {
      statusCode: 200,
    };
  }

  const url = new URL(process.env.NETLIFY_REBUILD_HOOK);

  await fetch(url.toString(), {
    method: "POST",
  });

  return {
    statusCode: 200,
  };
});
