import { Amplify } from "aws-amplify";
import { SignInOutput, fetchAuthSession, signIn } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = "ap-northeast-1";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_kIwjfrvCr",
      userPoolClientId: "3l9spd18ac3pkqto9hvhc3g46c",
      identityPoolId: "ap-northeast-1:ae94f7d1-3e72-4a21-8ed1-f87f13147931",
    },
  },
});

export class AuthService {
  public async login(username: string, password: string) {
    const signInOutput: SignInOutput = await signIn({
      username: username,
      password: password,
      options: { authFlowType: "USER_PASSWORD_AUTH" },
    });
    return signInOutput;
  }

  public async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens?.idToken?.toString();
  }

  public async generateTemporaryCredentials() {
    const idToken = await this.getIdToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/ap-northeast-1_kIwjfrvCr`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: "ap-northeast-1:ae94f7d1-3e72-4a21-8ed1-f87f13147931",
        logins: {
          [cognitoIdentityPool]: idToken || "",
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
