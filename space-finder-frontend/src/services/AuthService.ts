import { Amplify } from "aws-amplify";
import {
  type SignInOutput,
  fetchAuthSession,
  signIn,
  signOut,
} from "@aws-amplify/auth";
import { AuthStack } from "../../../space-finder/outputs.json";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: AuthStack.SpaceUserPoolId,
      userPoolClientId: AuthStack.SpaceUserPoolClientId,
      identityPoolId: AuthStack.SpaceIdentityPoolId,
    },
  },
});
const awsRegion = "ap-northeast-1";

export class AuthService {
  private user: SignInOutput | undefined;
  private userName: string = "";
  public jwtToken: string | undefined;
  private temporatyCredentials: Object | undefined;

  public isAuthorized() {
    if(this.user){
      return true;
    }
    return false;
  }
  
  public async login(
    userName: string,
    password: string
  ): Promise<Object | undefined> {
    try {
      const idToken = (await fetchAuthSession()).tokens?.idToken;
      if (idToken) {
        await signOut();
      }
      const signInOutput: SignInOutput = await signIn({
        username: userName,
        password: password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });
      this.user = signInOutput;
      this.userName = userName;
      await this.generateIdToken();
      return this.user;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async getTemporaryCredentials() {
    if (this.temporatyCredentials) {
      return this.temporatyCredentials;
    }
    this.temporatyCredentials = await this.generateTempCredentials();
    return this.temporatyCredentials;
  }

  private async generateTempCredentials() {
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        clientConfig: {
          region: awsRegion,
        },
        identityPoolId: AuthStack.SpaceIdentityPoolId,
        logins: {
          [cognitoIdentityPool]: this.jwtToken!,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }

  private async generateIdToken() {
    const session = await fetchAuthSession();
    this.jwtToken = session.tokens?.idToken?.toString();
  }

  public getIdToken() {
    return this.jwtToken;
  }

  public getUserName() {
    return this.userName;
  }
}
