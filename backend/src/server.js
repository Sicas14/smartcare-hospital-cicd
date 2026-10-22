const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());


// TEST ROUTE

app.get("/", (req, res) => {
  res.json({
    message: "Smart Hospital Management System API",
    version: "0.1",
    status: "Running"
  });
});


// PATIENTS

app.get("/api/patients", (req, res) => {

  db.all(
    "SELECT * FROM patients ORDER BY id DESC",
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});


app.post("/api/patients", (req, res) => {

  const {
    name,
    age,
    gender,
    phone,
    address
  } = req.body;

  if (!name || !age || !gender) {
    return res.status(400).json({
      error: "Name, age and gender are required."
    });
  }

  const sql = `
    INSERT INTO patients
    (name, age, gender, phone, address)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      name,
      age,
      gender,
      phone || "",
      address || ""
    ],
    function (err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        message: "Patient added successfully",
        id: this.lastID
      });
    }
  );
});


// DOCTORS

app.get("/api/doctors", (req, res) => {

  db.all(
    "SELECT * FROM doctors ORDER BY id DESC",
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json(rows);
    }
  );
});


app.post("/api/doctors", (req, res) => {

  const {
    name,
    specialization,
    phone,
    email
  } = req.body;

  if (!name || !specialization) {
    return res.status(400).json({
      error: "Name and specialization are required."
    });
  }

  const sql = `
    INSERT INTO doctors
    (name, specialization, phone, email)
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      name,
      specialization,
      phone || "",
      email || ""
    ],
    function (err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        message: "Doctor added successfully",
        id: this.lastID
      });
    }
  );
});


// APPOINTMENTS

app.get("/api/appointments", (req, res) => {

  const sql = `
    SELECT
      appointments.id,
      patients.name AS patient_name,
      doctors.name AS doctor_name,
      doctors.specialization,
      appointments.appointment_date,
      appointments.appointment_time,
      appointments.reason,
      appointments.status

    FROM appointments

    JOIN patients
      ON appointments.patient_id = patients.id

    JOIN doctors
      ON appointments.doctor_id = doctors.id

    ORDER BY appointments.id DESC
  `;

  db.all(sql, [], (err, rows) => {

    if (err) {
      return res.status(500).json({
        error: err.message
      });
    }

    res.json(rows);
  });
});


app.post("/api/appointments", (req, res) => {

  const {
    patient_id,
    doctor_id,
    appointment_date,
    appointment_time,
    reason
  } = req.body;

  if (
    !patient_id ||
    !doctor_id ||
    !appointment_date ||
    !appointment_time
  ) {

    return res.status(400).json({
      error: "Patient, doctor, date and time are required."
    });
  }

  const sql = `
    INSERT INTO appointments
    (
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason || ""
    ],
    function (err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        message: "Appointment created successfully",
        id: this.lastID
      });
    }
  );
});


// APPOINTMENT STATUS

app.patch("/api/appointments/:id/status", (req, res) => {

  const { status } = req.body;

  const allowedStatuses = [
    "Scheduled",
    "Completed",
    "Cancelled"
  ];

  if (!allowedStatuses.includes(status)) {

    return res.status(400).json({
      error: "Invalid appointment status."
    });
  }

  db.run(
    `
    UPDATE appointments
    SET status = ?
    WHERE id = ?
    `,
    [status, req.params.id],
    function (err) {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.json({
        message: "Appointment status updated successfully"
      });
    }
  );
});


// DASHBOARD

app.get("/api/dashboard", (req, res) => {

  db.get(
    "SELECT COUNT(*) AS total FROM patients",
    [],
    (err, patients) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      db.get(
        "SELECT COUNT(*) AS total FROM doctors",
        [],
        (err, doctors) => {

          if (err) {
            return res.status(500).json({
              error: err.message
            });
          }

          db.get(
            `
            SELECT COUNT(*) AS total
            FROM appointments
            WHERE status = 'Scheduled'
            `,
            [],
            (err, appointments) => {

              if (err) {
                return res.status(500).json({
                  error: err.message
                });
              }

              res.json({
                patients: patients.total,
                doctors: doctors.total,
                scheduledAppointments:
                  appointments.total
              });
            }
          );
        }
      );
    }
  );
});


// START SERVER

app.listen(PORT, () => {

  console.log(
    `Smart Hospital API running at http://localhost:${PORT}`
  );

});