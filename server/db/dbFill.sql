-- Insertar datos en la tabla de clínicas
INSERT INTO clinics (name, address, location) VALUES
('Clínica San José', 'Calle Ficticia 123, Ciudad, MX', 'https://goo.gl/maps/xyz'),
('Clínica Vida Saludable', 'Avenida Siempre Viva 456, Ciudad, MX', 'https://goo.gl/maps/abc'),
('Clínica Médica Integral', 'Boulevard El Sol 789, Ciudad, MX', 'https://goo.gl/maps/def');

-- Insertar datos en la tabla de pacientes
INSERT INTO patients (first_name, last_name, birth_date, email, phone, password, curp) VALUES
('Juan', 'Pérez', '1990-05-15', 'juan.perez@example.com', '555-1234', 'password123', 'JUAP900515HDFRZZ03'),
('Ana', 'Gómez', '1985-08-20', 'ana.gomez@example.com', '555-5678', 'password456', 'ANAG850820MDFRZZ02'),
('Carlos', 'López', '1992-12-30', 'carlos.lopez@example.com', '555-8765', 'password789', 'CALC921230HDFRZZ01');

-- Insertar datos en la tabla de especialidades
INSERT INTO specialties (name, description) VALUES
('Cardiología', 'Especialidad médica enfocada en el tratamiento de enfermedades del corazón.'),
('Dermatología', 'Especialidad médica que trata las enfermedades de la piel, cabello y uñas.'),
('Pediatría', 'Especialidad médica dedicada a la salud de los niños.');

-- Insertar datos en la tabla de doctores
INSERT INTO doctors (first_name, last_name, specialty_id, email, phone, password, clinic_id, consulting_room) VALUES
('María', 'Fernández', 1, 'maria.fernandez@example.com', '555-1122', 'doctor123', 1, 'Consultorio 101'),
('Luis', 'Martínez', 2, 'luis.martinez@example.com', '555-3344', 'doctor456', 2, 'Consultorio 102'),
('Sandra', 'Hernández', 3, 'sandra.hernandez@example.com', '555-5566', 'doctor789', 3, 'Consultorio 103');

-- Insertar datos en la tabla de tratamientos
INSERT INTO treatments (patient_id, doctor_id, description, start_date, end_date) VALUES
(1, 1, 'Tratamiento para hipertensión', '2024-10-01', '2024-12-01'),
(2, 2, 'Tratamiento para acné severo', '2024-09-15', '2024-11-15'),
(3, 3, 'Tratamiento para resfriado común', '2024-11-01', '2024-11-10');

-- Insertar datos en la tabla de dietas
INSERT INTO diets (patient_id, description, start_date, end_date, dish_id) VALUES
(1, 'Dieta baja en sodio', '2024-10-01', '2024-10-15', 1),
(2, 'Dieta rica en proteínas', '2024-09-15', '2024-09-30', 2),
(3, 'Dieta balanceada', '2024-11-01', '2024-11-15', 3);

-- Insertar datos en la tabla de platillos
INSERT INTO dishes (name, description) VALUES
('Ensalada de pollo', 'Ensalada fresca con pollo a la parrilla, vegetales y aderezo.'),
('Sopa de lentejas', 'Sopa nutritiva con lentejas, zanahorias y cebolla.'),
('Filete de pescado', 'Filete de pescado a la plancha acompañado de papas y verduras.');

-- Insertar datos en la tabla de ingredientes
INSERT INTO ingredients (name) VALUES
('Pollo'),
('Lentejas'),
('Pescado');

-- Insertar datos en la tabla de relación platillos e ingredientes
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity) VALUES
(1, 1, '200g'),
(2, 2, '150g'),
(3, 3, '250g');

-- Insertar datos en la tabla de medicamentos
INSERT INTO medications (name, description) VALUES
('Paracetamol', 'Medicamento para el dolor y la fiebre.'),
('Ibuprofeno', 'Antiinflamatorio para dolor y fiebre.'),
('Amoxicilina', 'Antibiótico para infecciones bacterianas.');

-- Insertar datos en la tabla de relación tratamientos y medicamentos
INSERT INTO treatment_medications (treatment_id, medication_id, dose, frequency) VALUES
(1, 1, '500mg', 'Cada 8 horas'),
(2, 2, '200mg', 'Cada 12 horas'),
(3, 3, '250mg', 'Cada 8 horas');

-- Insertar datos en la tabla de condiciones médicas
INSERT INTO medical_conditions (name, description) VALUES
('Hipertensión', 'Condición médica caracterizada por presión arterial alta.'),
('Acné', 'Enfermedad de la piel caracterizada por la aparición de granos y espinillas.'),
('Resfriado común', 'Infección viral que afecta las vías respiratorias superiores.');

-- Insertar datos en la tabla de relación pacientes y condiciones médicas
INSERT INTO patient_conditions (patient_id, condition_id, diagnosis_date, notes) VALUES
(1, 1, '2024-10-01', 'Hipertensión leve detectada durante revisión.'),
(2, 2, '2024-09-15', 'Acné severo, tratamiento con antibióticos recomendado.'),
(3, 3, '2024-11-01', 'Resfriado común, reposo recomendado.');

-- Insertar datos en la tabla de alergias
INSERT INTO allergies (name, description) VALUES
('Polvo', 'Alergia al polvo que causa estornudos y congestión.'),
('Polen', 'Alergia al polen que puede provocar fiebre del heno.'),
('Maní', 'Alergia alimentaria al maní que puede causar reacciones graves.');

-- Insertar datos en la tabla de severidad de alergias
INSERT INTO allergy_severity (level) VALUES
('Levele'),
('Moderado'),
('Severo');

-- Insertar datos en la tabla de relación pacientes y alergias
INSERT INTO patient_allergies (patient_id, allergy_id, severity_id, reaction, notes) VALUES
(1, 1, 1, 'Estornudos', 'No se requiere tratamiento, solo evitar polvo.'),
(2, 2, 2, 'Fiebre del heno', 'Uso de antihistamínicos recomendado.'),
(3, 3, 3, 'Reacción alérgica severa', 'Requiere epinefrina en caso de exposición.');

-- Insertar datos en la tabla intermedia de relación paciente-doctor
INSERT INTO patient_doctor (patient_id, doctor_id, assigned_date) VALUES
(1, 1, '2024-10-01'),
(2, 2, '2024-09-15'),
(3, 3, '2024-11-01');

-- Insertar datos en la tabla de solicitudes de conexión
INSERT INTO connection_requests (patient_id, doctor_id, status_id) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3);

-- Insertar datos en los estados de conexión
INSERT INTO request_statuses (status) VALUES
('Pendiente'),
('Aceptada'),
('Rechazada'),
('Expirada');