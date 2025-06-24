import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = "ap-northeast-1"; // Mock environment variable for testing
process.env.TABLE_NAME = "SpaceTable-064ea141c547"; // Mock environment variable for testing

handler(
  {
    httpMethod: "POST",
    body: JSON.stringify({
      location: "Osaka updated",
      name: "Space 1 updated",
    }),
  } as any,
  {} as any
).then((result) => {
  console.log(result);
})