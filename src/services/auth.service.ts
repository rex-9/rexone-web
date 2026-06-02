import AppRoutes from "../AppRoutes";
import { api } from "./api.service";
import {
  IApiAuthResponse,
  IApiResponse,
  IGoogleSignInCompleteData,
  IGoogleSignInStartData,
} from "../models/api.model";
import { IUser } from "../models";

class AuthService {
  async signInWithEmailOrUsername(
    signinKey: string,
    password: string,
  ): Promise<
    IApiResponse<IApiAuthResponse<{ user: IUser; token: string } | undefined>>
  > {
    const response = await api.post<
      IApiAuthResponse<{ user: IUser; token: string }>
    >(AppRoutes.server.public.SIGN_IN_EMAIL, {
      user: { signin_key: signinKey, password },
    });
    return response;
  }

  async signInWithToken(
    token: string,
  ): Promise<IApiResponse<IApiAuthResponse<{ user: IUser; token: string }>>> {
    const response = await api.post<
      IApiAuthResponse<{ user: IUser; token: string }>
    >(AppRoutes.server.public.SIGN_IN_TOKEN, { token });
    return response;
  }

  async signInWithGoogle(
    token: string,
  ): Promise<IApiResponse<IApiAuthResponse<IGoogleSignInStartData>>> {
    const response = await api.post<IApiAuthResponse<IGoogleSignInStartData>>(
      AppRoutes.server.public.SIGN_IN_GOOGLE,
      { token },
    );
    return response;
  }

  async completeGoogleSignIn(
    passcode: string,
    challengeToken: string,
  ): Promise<IApiResponse<IApiAuthResponse<IGoogleSignInCompleteData>>> {
    const response = await api.post<
      IApiAuthResponse<IGoogleSignInCompleteData>
    >(AppRoutes.server.public.SIGN_IN_GOOGLE_COMPLETE, {
      passcode,
      challenge_token: challengeToken,
    });
    return response;
  }

  async signUpWithEmail(
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<IApiResponse<IApiAuthResponse<undefined>>> {
    const response = await api.post<IApiAuthResponse<undefined>>(
      AppRoutes.server.public.SIGN_UP,
      {
        user: {
          username,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      },
    );
    return response;
  }

  async confirmEmailWithCode(
    emailOrUsername: string,
    confirmationCode: string,
  ): Promise<IApiResponse<IApiAuthResponse<{ user: IUser; token: string }>>> {
    const response = await api.post<
      IApiAuthResponse<{ user: IUser; token: string }>
    >(`${AppRoutes.server.public.CONFIRM_CODE}`, {
      signin_key: emailOrUsername,
      confirmation_code: confirmationCode,
    });
    return response;
  }

  async sendConfirmationEmail(
    emailOrUsername: string,
  ): Promise<IApiResponse<IApiAuthResponse<undefined>>> {
    const response = await api.post<IApiAuthResponse<undefined>>(
      `${AppRoutes.server.public.SEND_EMAIL_CODE}`,
      { signin_key: emailOrUsername },
    );
    return response;
  }

  async sendForgotPasswordMail(
    email: string,
  ): Promise<IApiResponse<IApiAuthResponse<undefined>>> {
    const response = await api.post<IApiAuthResponse<undefined>>(
      AppRoutes.server.public.FORGOT_PASSWORD,
      { email },
    );
    return response;
  }

  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<IApiResponse<IApiAuthResponse<undefined>>> {
    const response = await api.put<IApiAuthResponse<undefined>>(
      AppRoutes.server.public.RESET_PASSWORD,
      {
        user: {
          reset_password_token: token,
          password,
          password_confirmation: passwordConfirmation,
        },
      },
    );
    return response;
  }

  async signOut(): Promise<IApiResponse<IApiAuthResponse<null>>> {
    const response = await api.delete<IApiAuthResponse<null>>(
      AppRoutes.server.protected.SIGN_OUT,
    );
    return response;
  }
}

export default new AuthService();
