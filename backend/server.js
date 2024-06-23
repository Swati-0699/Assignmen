const express = require("express");
const cors = require("cors");
const db = require("./dbConnection");
const bcrypt = require("bcryptjs");
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`::: SERVER IS RUNNING ON PORT ${PORT} :::`);
});

// Password Encryption Function
function EncryptPassword(bodyPassword) {
  if (!bodyPassword) {
    throw new Error("Password is required");
  }
  const saltRounds = 10;
  return bcrypt.hashSync(bodyPassword, saltRounds);
}

// User Registration
app.post("/register", (req, res) => {
  try {
    let { name, phone, email, gender, password } =
      req.body;
    let is_admin = false;
    let is_active = true;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ error: "Phone and password are required fields" });
    }

    let encryptedPassword = EncryptPassword(password);

    const checkPhoneSQL = "SELECT phone FROM employee_details WHERE phone = ?";
    const insertSQL =
      "INSERT INTO employee_details(`name`,`phone`,`email`,`gender`,`password`,`is_admin`,`is_active`) VALUES (?)";

    db.query(checkPhoneSQL, [phone], (err, data) => {
      if (err) {
        console.error("Error checking phone in the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (data.length > 0) {
        return res.status(409).json({ error: "Phone number already exists" });
      }

      let values = [
        name,
        phone,
        email,
        gender,
        encryptedPassword,
        is_admin,
        is_active,
      ];
      db.query(insertSQL, [values], (err, data) => {
        if (err) {
          console.error("Error inserting into the database:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login
app.post("/login", (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ error: "Phone and password are required fields" });
    }

    const sql =
      "SELECT * FROM employee_details WHERE phone = ? AND is_active = 1";
    db.query(sql, [phone], (err, data) => {
      if (err) {
        console.error("Error fetching from database:", err);
        return res.status(500).json({ error: "SQL Error" });
      }

      if (data.length === 0) {
        return res
          .status(401)
          .json({ error: "Invalid phone number or user not found" });
      }

      const user = data[0];
      const passwordMatches = bcrypt.compareSync(password, user.password);

      if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid password" });
      }

      if (user.is_admin) {
        return res.json("success_admin");
      } else if (!user.is_admin) {
        return res.json("success_user");
      } else {
        return res.status(401).json({ error: "Invalid login details" });
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin View User Details
app.get("/getAllUsers", (req, res) => {
  try {
    const sql =
      "SELECT user_id, name, phone, email, gender, is_active FROM employee_details WHERE is_admin = 0 AND is_active = 1";
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin Add User
app.post("/adminAddUser", (req, res) => {
  try {
    let { name, phone, email, gender } = req.body;
    let password = null;
    let is_admin = false;
    let is_active = true;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const checkPhoneSQL = "SELECT phone FROM employee_details WHERE phone = ?";
    const insertSQL =
      "INSERT INTO employee_details(`name`,`phone`,`email`,`gender`,`password`,`is_admin`,`is_active`) VALUES (?,?,?,?,?,?,?)";

    db.query(checkPhoneSQL, [phone], (err, phoneData) => {
      if (err) {
        console.error("Error checking phone in the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (phoneData.length > 0) {
        return res.status(409).json({ error: "Phone number already exists" });
      }

      let values = [
        name,
        phone,
        email,
        gender,
        password,
        is_admin,
        is_active,
      ];
      db.query(insertSQL, values, (err, data) => {
        if (err) {
          console.error("Error inserting into the database:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json(data);
      });
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin Edit User
app.put("/adminEditUser", (req, res) => {
  try {
    const { name, phone, email, gender, user_id } =
      req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const sql =
      "UPDATE employee_details SET name=?, phone=?, email=?, gender=? WHERE user_id = ?";
    const values = [
      name,
      phone,
      email,
      gender,
      user_id,
    ];

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error("Error updating the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } catch (error) {
    console.error("Error editing user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin Delete User
app.put("/adminDeleteUser/:user_id", (req, res) => {
  try {
    let user_id = req.params.user_id;

    const updateEmployeeDetailsSQL =
      "UPDATE employee_details SET is_active = 0 WHERE user_id = ?";

    db.query(updateEmployeeDetailsSQL, [user_id], (err, result) => {
      if (err) {
        console.error("Error updating employee_details:", err);
        return res
          .status(500)
          .json({ error: "Error updating employee_details" });
      }
      return res.send("Details soft deleted successfully from both tables");
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
