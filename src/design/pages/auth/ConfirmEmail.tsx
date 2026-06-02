import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ConfirmEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract signin_key from current URL and redirect to auth dialog at verify-email step
    const params = new URLSearchParams(location.search);
    const emailOrUsername = params.get("signin_key");

    if (emailOrUsername) {
      navigate(`/?dialog=auth&step=verify-email&email=${emailOrUsername}`, {
        replace: true,
      });
    } else {
      // No email provided, go to initial step
      navigate("/?dialog=auth", { replace: true });
    }
  }, [navigate, location]);

  return null;
};

export default ConfirmEmail;
