import { useState } from "react";
import { useRouter } from "next/router";

export default function Verify() {
  const router = useRouter();
  const { email } = router.query;
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.expiresAt) {
          localStorage.setItem("tokenExpiresAt", data.expiresAt);
        }
        router.push("/addSchool"); 
      } else {
        setMsg(data.error || "Verification failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setMsg("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div>
        <h2 className="h-home">Enter OTP</h2>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            required
          />
          <button className="otp-btn" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <p>{msg}</p>
      </div>
    </div>
  );
}
