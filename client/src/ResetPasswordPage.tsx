import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResetPasswordModal } from "./components/Modals/Authentication/ResetPasswordModal";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check both hash and search params
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const searchParams = new URLSearchParams(window.location.search);

      const accessToken =
        hashParams.get("access_token") || searchParams.get("access_token");
      const refreshToken =
        hashParams.get("refresh_token") || searchParams.get("refresh_token");
      const type = hashParams.get("type") || searchParams.get("type");

      if (accessToken && refreshToken && type === "recovery") {
        sessionStorage.setItem(
          "reset_tokens",
          JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
        );
        setShowModal(true);
      } else {
        navigate("/");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const handleModalClose = () => {
    setShowModal(false);
    sessionStorage.removeItem("reset_tokens");
    navigate("/");
  };

  return (
    <div>
      <ResetPasswordModal open={showModal} onOpenChange={handleModalClose} />
    </div>
  );
}
