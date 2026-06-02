import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("reset_password_token");
    const email = params.get("email");

    if (!token) {
      navigate("/?dialog=auth&step=forgot-password", { replace: true });
      return;
    }

    const target = new URLSearchParams({
      dialog: "auth",
      step: "signup-passcode-create",
      reset_password_token: token,
    });

    if (email) {
      target.set("email", email);
    }

    navigate(`/?${target.toString()}`, { replace: true });
  }, [navigate, location.search]);

  return null;
};

export default ResetPassword;
