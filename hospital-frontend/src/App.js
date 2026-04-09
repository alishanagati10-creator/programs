import React, { useEffect, useState } from "react";

function App() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentTime: "",
  });

  useEffect(() => {
    // Fetch doctors
    fetch("http://localhost:8081/doctors/all")
      .then((res) => res.json())
      .then((data) => setDoctors(data));
  });

  // Fetch appointments

  useEffect(() => {
    const fetchAppointments = () => {
      fetch("http://localhost:8081/appointments/all")
        .then((res) => res.json())
        .then((data) => setAppointments(data))
        .catch((err) => console.error(err));
    };

    fetchAppointments(); // initial fetch

    const interval = setInterval(fetchAppointments, 5000); // refresh every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8081/appointments/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Appointment Booked");

        // refresh appointments
        return fetch("http://localhost:8081/appointments/all");
      })
      .then((res) => res.json())
      .then((data) => setAppointments(data));
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    background: "#667eea",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #667eea, #764ba2)",
        padding: "30px",
        fontFamily: "Segoe UI",
      }}
    >
      <h1 style={{ color: "white", textAlign: "center" }}>
        🏥 Hospital Management System
      </h1>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h2>👨‍⚕️ Doctors</h2>
        {doctors.map((doc) => (
          <div
            key={doc.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <h3>{doc.name}</h3>
            <p>{doc.specialization}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h2>📅 Appointments (Live)</h2>
        {appointments.length === 0 ? (
          <p>No appointments</p>
        ) : (
          Object.entries(
            appointments.reduce((acc, a) => {
              if (!acc[a.doctorId]) acc[a.doctorId] = [];
              acc[a.doctorId].push(a.tokenNumber);
              return acc;
            }, {}),
          ).map(([doctorId, queue]) => (
            <div
              key={doctorId}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              <p>Doctor ID: {doctorId}</p>
              <p>
                Queue: {queue.length > 0 ? queue.join(", ") : "No appointments"}
              </p>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginTop: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h2>➕ Book Appointment</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Patient ID"
            style={inputStyle}
            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
          />

          <select
            style={inputStyle}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
          >
            <option>Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.specialization})
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            style={inputStyle}
            onChange={(e) =>
              setForm({ ...form, appointmentTime: e.target.value })
            }
          />

          <button style={buttonStyle} type="submit">
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
export default App;
