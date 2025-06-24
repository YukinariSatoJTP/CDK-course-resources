import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from "uuid";

const s3Client = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context){
 
  const command = new ListBucketsCommand({});
  const listBucketsCommand = (await s3Client.send(command)).Buckets;
 
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(
      "Hello from Lambda! here are your buckets: " + JSON.stringify(listBucketsCommand)
    ),
  };
  console.log("Event: ", event);
  return response;
}

export { handler };