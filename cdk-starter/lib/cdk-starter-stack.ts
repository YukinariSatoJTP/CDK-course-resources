import * as cdk from 'aws-cdk-lib';
import { CfnOutput, CfnParameter } from 'aws-cdk-lib';
import { CfnOutcome } from 'aws-cdk-lib/aws-frauddetector';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class L3Bucket extends Construct{
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id);
    new Bucket(this, 'L3Bucket', {
      lifecycleRules: [{
        expiration: cdk.Duration.days(expiration),
      }],
    });
  }
}

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    
    new CfnBucket(this, 'MyL1Bucket', {
      lifecycleConfiguration: {
        rules: [{
          expirationInDays: 1,
          status: 'Enabled',
        }],
      },
    });

    const duration = new CfnParameter(this, 'duration',{
      default: 6,
      minValue: 1,
      maxValue: 10,
      type: 'Number',
    })

    const MyL2Bucket = new Bucket(this, 'MyL2Bucket', {
      lifecycleRules: [{
        expiration: cdk.Duration.days(duration.valueAsNumber),
        }]
    })

    new CfnOutput(this, 'MyL2BucketName', {
      value: MyL2Bucket.bucketName,
      description: 'The name of the L2 bucket',
    });

    new L3Bucket(this, 'MyL3Bucket', 3);


  }
}
