-- Tabla de pacientes
CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password TEXT NOT NULL
);

-- Tabla de doctores
CREATE TABLE doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  specialty_id INTEGER,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password TEXT NOT NULL,
  FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);

-- Tabla de especialidades
CREATE TABLE specialties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Tabla de tratamientos
CREATE TABLE treatments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER,
  doctor_id INTEGER,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Tabla de dietas
CREATE TABLE diets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  dish_id INTEGER,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (dish_id) REFERENCES dishes(id)
);

-- Tabla de citas médicas
CREATE TABLE medical_appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER,
  doctor_id INTEGER,
  appointment_date TIMESTAMP NOT NULL,
  reason TEXT,
  location TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Tabla de platillos
CREATE TABLE dishes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT
);

-- Tabla de ingredientes
CREATE TABLE ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Tabla de relación platillos e ingredientes
CREATE TABLE dish_ingredients (
  dish_id INTEGER,
  ingredient_id INTEGER,
  quantity TEXT,
  PRIMARY KEY (dish_id, ingredient_id),
  FOREIGN KEY (dish_id) REFERENCES dishes(id),
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

-- Tabla de medicamentos
CREATE TABLE medications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT
);

-- Tabla de relación tratamientos y medicamentos
CREATE TABLE treatment_medications (
  treatment_id INTEGER,
  medication_id INTEGER,
  dose TEXT,
  frequency TEXT,
  PRIMARY KEY (treatment_id, medication_id),
  FOREIGN KEY (treatment_id) REFERENCES treatments(id),
  FOREIGN KEY (medication_id) REFERENCES medications(id)
);

-- Tabla de condiciones médicas
CREATE TABLE medical_conditions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT
);

-- Tabla de relación pacientes y condiciones médicas
CREATE TABLE patient_conditions (
  patient_id INTEGER,
  condition_id INTEGER,
  diagnosis_date DATE,
  notes TEXT,
  PRIMARY KEY (patient_id, condition_id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (condition_id) REFERENCES medical_conditions(id)
);

-- Tabla de alergias
CREATE TABLE allergies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT
);

-- Tabla de severidad de alergias (catálogo)
CREATE TABLE allergy_severity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level TEXT NOT NULL UNIQUE
);

-- Tabla de relación pacientes y alergias
CREATE TABLE patient_allergies (
  patient_id INTEGER,
  allergy_id INTEGER,
  severity_id INTEGER,  -- Referencia al catálogo de severidad
  reaction TEXT,
  notes TEXT,
  PRIMARY KEY (patient_id, allergy_id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (allergy_id) REFERENCES allergies(id),
  FOREIGN KEY (severity_id) REFERENCES allergy_severity(id)
);

-- Tabla intermedia de relación paciente-doctor
CREATE TABLE patient_doctor (
  patient_id INTEGER,
  doctor_id INTEGER,
  assigned_date DATE,
  PRIMARY KEY (patient_id, doctor_id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
