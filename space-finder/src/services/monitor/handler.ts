import { SNSEvent } from "aws-lambda";


const webHookUrl =
  "https://hooks.slack.com/services/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";

async function handler(event: SNSEvent, context){
  for (const record of event.Records) {
    await fetch(webHookUrl, {
      method: 'POST',
      body: JSON.stringify({
        text: `New event received: ${record.Sns.Message}`,
      }),
    });
    
  }
}

export { handler };
