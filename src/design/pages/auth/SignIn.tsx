import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LayoutPage from "../LayoutPage";
import { getSafePostAuthRoute } from "../../../utils/authRedirect.util";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const next = getSafePostAuthRoute(searchParams.get("next"));
    const nextQuery = `&next=${encodeURIComponent(next)}`;

    // Redirect to home with dialog=auth param.
    navigate(`/?dialog=auth${nextQuery}`, { replace: true });
  }, [navigate, searchParams]);

  return (
    <LayoutPage>
      <div />
    </LayoutPage>
  );
};

export default SignIn;
