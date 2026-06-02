import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract email from URL if provided and redirect to auth dialog forgot-password step.
    const params = new URLSearchParams(location.search);
    const email = params.get("email");

    if (email) {
      navigate(`/?dialog=auth&step=forgot-password&email=${encodeURIComponent(email)}`, {
        replace: true,
      });
    } else {
      navigate("/?dialog=auth&step=forgot-password", { replace: true });
    }
  }, [navigate, location]);

  return null;
};

export default ForgotPassword;
