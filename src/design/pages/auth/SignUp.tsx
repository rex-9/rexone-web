import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPage from "../LayoutPage";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home with dialog=auth param
    navigate("/?dialog=auth", { replace: true });
  }, [navigate]);

  return (
    <LayoutPage>
      <div />
    </LayoutPage>
  );
};

export default SignUp;
