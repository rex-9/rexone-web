import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LayoutPage from "../LayoutPage";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const next = searchParams.get("next");
    const nextQuery =
      next && next.startsWith("/") && !next.startsWith("//")
        ? `&next=${encodeURIComponent(next)}`
        : "";

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
