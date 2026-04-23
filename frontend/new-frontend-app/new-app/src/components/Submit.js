import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Submit() {
  const location = useLocation();
  const navigate = useNavigate();

  const problemId = location.state?.problemId;

  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔐 Check login
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Please login first ❌");
      navigate("/login");
    }
  }, [navigate]);

  // ⚠️ Check problemId
  useEffect(() => {
    if (!problemId) {
      alert("No problem selected ❌");
      navigate("/problems");
    }
  }, [problemId, navigate]);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async () => {
    if (!code) {
      alert("Please write some code ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          problemId: problemId,
          code: code,
          input: input,
        }),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      const data = await res.json();
      console.log("Response:", data);

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Submission failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SMART STATUS FIX
  const getStatus = () => {
    if (!result) return "";

    const output = result.output?.trim().replace(/\s+/g, " ");

    // If backend gives expectedOutput → use proper compare
    if (result.expectedOutput) {
      const expected = result.expectedOutput.trim().replace(/\s+/g, " ");

      return output === expected ? "Accepted" : "Wrong Answer";
    }

    // Fallback (best guess)
    // If backend already says Accepted → trust it
    if (result.status === "Accepted") {
      return "Accepted";
    }

    // Otherwise keep backend result
    return result.status;
  };

  const finalStatus = getStatus();

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Submit Solution</h2>

      <p>
        <b>Problem ID:</b> {problemId}
      </p>

      {/* Code Editor */}
      <textarea
        rows="10"
        cols="50"
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <br />
      <br />

      {/* Input */}
      <input
        type="text"
        placeholder="Enter input (optional)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br />
      <br />

      {/* Submit Button */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Running..." : "Submit Code"}
      </button>

      <br />
      <br />
      {result && (
        <div style={{ border: "1px solid black", padding: "10px" }}>
          <h3>Result</h3>

          {(() => {
            // 🔥 Normalize output
            const cleanOutput = result.output?.trim().replace(/\s+/g, " ");

            // If backend sends expectedOutput
            const cleanExpected = result.expectedOutput
              ?.trim()
              .replace(/\s+/g, " ");

            let finalStatus = result.status;

            // ✅ Proper comparison if expected exists
            if (cleanExpected) {
              finalStatus =
                cleanOutput === cleanExpected ? "Accepted" : "Wrong Answer";
            } else {
              // ⚠️ fallback: if backend says accepted OR output looks valid
              if (result.status === "Accepted") {
                finalStatus = "Accepted";
              }
            }

            return (
              <p>
                <b>Status:</b>{" "}
                <span
                  style={{
                    color: finalStatus === "Accepted" ? "green" : "red",
                  }}
                >
                  {finalStatus}
                </span>
              </p>
            );
          })()}

          <p>
            <b>Output:</b> {result.output}
          </p>
        </div>
      )}
    </div>
  );
}

export default Submit;
