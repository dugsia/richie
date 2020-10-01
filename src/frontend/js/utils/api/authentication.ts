/**
 * Session API
 * All request to CRUD session
 *
 * An utils to manage user session in Richie
 * session information are extracted from EDX cookies.
 * This means that EDX and Richie must be accessible through the same domain and
 * EDX must be configured to share cookies to Richie sub domain.
 *
 * "edxloggedin" cookie is used to know if an EDX session is active or not,
 * then user information are extracted from "edx-user-info" cookie.
 *
 *
 */
import { handle } from 'utils/errors/handle';
import { AuthenticationBackend } from 'types/commonDataProps';
import { ApiImplementation } from './lms';
import Base from './lms/base';
import EDX from './lms/edx';

const APIHandler = (): ApiImplementation => {
  const AUTHENTICATION: AuthenticationBackend = (window as any).__richie_frontend_context__?.context
    ?.authentication;
  if (!AUTHENTICATION) {
    const error = new Error('"authentication" is missing in frontend context.');
    handle(error);
    throw error;
  }

  switch (AUTHENTICATION.backend) {
    case 'richie.apps.courses.lms.base.BaseLMSBackend':
      return Base(AUTHENTICATION);
    case 'richie.apps.courses.lms.edx.TokenEdXLMSBackend':
      return EDX(AUTHENTICATION);
    default:
      throw new Error(`No Authentication Backend found for ${AUTHENTICATION.backend}.`);
  }
};

export const AuthenticationApi = APIHandler().user;
