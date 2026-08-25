import AppRoutes from "../../AppRoutes";
import { api } from "../../services/api.service";
import { IApiEnvelope, IApiResponse, IUser } from "../../models";

export interface ISignInResponseData {
  user?: IUser;
  token?: string;
  otp_sent?: boolean;
  remaining_attempts?: number;
  cooldown_remaining?: number;
  failed_attempts?: number;
}

export interface IGoogleSignInStartData {
  password_required: boolean;
  challenge_token?: string;
  user?: IUser;
  token?: string;
  existing_user?: boolean;
}

export interface IGoogleSignInCompleteData {
  user: IUser;
  token: string;
}

class AuthService {
  async signInWithEmailOrUsername(
    signinKey: string,
    password: string,
  ): Promise<IApiResponse<IApiEnvelope<ISignInResponseData>>> {
    const response = await api.post<ISignInResponseData>(
      AppRoutes.server.public.SIGN_IN_EMAIL,
      {
        user: { signin_key: signinKey, password },
      },
    );
    return response;
  }

  async signInWithToken(
    token: string,
  ): Promise<IApiResponse<IApiEnvelope<{ user: IUser; token: string }>>> {
    const response = await api.post<{ user: IUser; token: string }>(
      AppRoutes.server.public.SIGN_IN_TOKEN,
      { token },
    );
    return response;
  }

  async signInWithGoogle(
    token: string,
  ): Promise<IApiResponse<IApiEnvelope<IGoogleSignInStartData>>> {
    const response = await api.post<IGoogleSignInStartData>(
      AppRoutes.server.public.SIGN_IN_GOOGLE,
      { token },
    );
    return response;
  }

  async completeGoogleSignIn(
    passcode: string,
    challengeToken: string,
  ): Promise<IApiResponse<IApiEnvelope<IGoogleSignInCompleteData>>> {
    const response = await api.post<IGoogleSignInCompleteData>(
      AppRoutes.server.public.SIGN_IN_GOOGLE_COMPLETE,
      {
        password: passcode,
        challenge_token: challengeToken,
      },
    );
    return response;
  }

  async signUpWithEmail(
    username: string,
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<IApiResponse<IApiEnvelope<undefined>>> {
    const response = await api.post<undefined>(
      AppRoutes.server.public.SIGN_UP,
      {
        user: {
          username,
          name,
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
  ): Promise<IApiResponse<IApiEnvelope<{ user: IUser; token: string }>>> {
    const response = await api.post<{ user: IUser; token: string }>(
      `${AppRoutes.server.public.CONFIRM_CODE}`,
      {
        signin_key: emailOrUsername,
        confirmation_code: confirmationCode,
      },
    );
    return response;
  }

  async sendConfirmationEmail(
    emailOrUsername: string,
  ): Promise<IApiResponse<IApiEnvelope<undefined>>> {
    const response = await api.post<undefined>(
      `${AppRoutes.server.public.SEND_EMAIL_CODE}`,
      { signin_key: emailOrUsername },
    );
    return response;
  }

  async sendForgotPasswordMail(
    email: string,
  ): Promise<IApiResponse<IApiEnvelope<undefined>>> {
    const response = await api.post<undefined>(
      AppRoutes.server.public.FORGOT_PASSWORD,
      { email },
    );
    return response;
  }

  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<IApiResponse<IApiEnvelope<undefined>>> {
    const response = await api.put<undefined>(
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

  async signOut(): Promise<IApiResponse<IApiEnvelope<null>>> {
    const response = await api.delete<null>(
      AppRoutes.server.protected.SIGN_OUT,
    );
    return response;
  }
}

export default new AuthService();
