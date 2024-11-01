-- Insertar datos en la tabla de especialidades
INSERT INTO specialties (name, description) VALUES
('Cardiología', 'Especialidad médica que se ocupa del diagnóstico y tratamiento de enfermedades del corazón.'),
('Pediatría', 'Especialidad médica que se ocupa de la salud de los niños.'),
('Dermatología', 'Especialidad médica que se ocupa de las enfermedades de la piel.');

-- Insertar datos en la tabla de pacientes
INSERT INTO patients (first_name, last_name, birth_date, email, phone, password) VALUES
('Juan', 'Pérez', '1985-03-15', 'juan.perez@example.com', '555-1234', 'password123'),
('Ana', 'Gómez', '1990-07-22', 'ana.gomez@example.com', '555-5678', 'password456'),
('Luis', 'Martínez', '1978-12-30', 'luis.martinez@example.com', '555-8765', 'password789');

-- Insertar datos en la tabla de doctores
INSERT INTO doctors (first_name, last_name, specialty_id, email, phone, password) VALUES
('Carlos', 'Sánchez', 1, 'carlos.sanchez@example.com', '555-0001', 'pass123'),
('María', 'López', 2, 'maria.lopez@example.com', '555-0002', 'pass456'),
('Roberto', 'Torres', 3, 'roberto.torres@example.com', '555-0003', 'pass789');

-- Insertar datos en la tabla de tratamientos
INSERT INTO treatments (patient_id, doctor_id, description, start_date, end_date) VALUES
(1, 1, 'Chequeo general del corazón', '2023-10-01', '2023-10-15'),
(2, 2, 'Consulta pediátrica', '2023-09-10', NULL),
(3, 3, 'Revisión dermatológica', '2023-08-20', '2023-09-05');

-- Insertar datos en la tabla de platillos
INSERT INTO dishes (name, description) VALUES
('Ensalada César', 'Ensalada fresca con pollo, crutones y aderezo César.'),
('Sopa de Verduras', 'Sopa caliente con diversas verduras.'),
('Pasta Alfredo', 'Pasta con salsa cremosa de queso.');

-- Insertar datos en la tabla de ingredientes
INSERT INTO ingredients (name) VALUES
('Lechuga'),
('Pollo'),
('Crutones'),
('Queso Parmesano'),
('Aceite de Oliva'),
('Ajo'),
('Pasta');

-- Insertar datos en la tabla de dietas
INSERT INTO diets (patient_id, description, start_date, end_date, dish_id) VALUES
(1, 'Dieta baja en colesterol', '2023-10-01', '2023-10-31', 1),
(2, 'Dieta equilibrada para niños', '2023-09-01', '2023-09-30', 2),
(3, 'Dieta rica en fibra', '2023-08-01', NULL, 3);

-- Insertar datos en la tabla de citas médicas
INSERT INTO medical_appointments (patient_id, doctor_id, appointment_date, reason, location) VALUES
(1, 1, '2023-10-05 10:00:00', 'Chequeo cardíaco anual', 'Clínica Salud'),
(2, 2, '2023-09-15 14:30:00', 'Control de crecimiento', 'Clínica Infantil'),
(3, 3, '2023-09-01 09:00:00', 'Revisión de piel', 'Consultorio Dermatológico');

-- Insertar datos en la tabla de medicamentos
INSERT INTO medications (name, description) VALUES
('Aspirina', 'Medicamento para aliviar el dolor y reducir la inflamación.'),
('Amoxicilina', 'Antibiótico utilizado para tratar infecciones bacterianas.'),
('Loratadina', 'Antihistamínico utilizado para aliviar alergias.');

-- Insertar datos en la tabla de relación tratamientos y medicamentos
INSERT INTO treatment_medications (treatment_id, medication_id, dose, frequency) VALUES
(1, 1, '1 tableta diaria', 'Diario'),
(2, 2, '1 tableta cada 8 horas', 'Cada 8 horas'),
(3, 3, '1 tableta diaria', 'Diario');

-- Insertar datos en la tabla de condiciones médicas
INSERT INTO medical_conditions (name, description) VALUES
('Hipertensión', 'Condición médica en la que la presión arterial es persistentemente alta.'),
('Asma', 'Condición que afecta la respiración y causa dificultad para respirar.'),
('Diabetes', 'Enfermedad que afecta la forma en que el cuerpo utiliza la glucosa.');

-- Insertar datos en la tabla de relación pacientes y condiciones médicas
INSERT INTO patient_conditions (patient_id, condition_id, diagnosis_date, notes) VALUES
(1, 1, '2020-01-10', 'Controlado con medicación.'),
(2, 2, '2019-05-20', 'Usa inhalador.'),
(3, 3, '2018-03-15', 'Control de dieta necesario.');

-- Insertar datos en la tabla de alergias
INSERT INTO allergies (name, description) VALUES
('Polen', 'Alergia estacional causada por el polen.'),
('Nueces', 'Alergia a los frutos secos.'),
('Lactosa', 'Intolerancia a la lactosa presente en productos lácteos.');

-- Insertar datos en la tabla de relación pacientes y alergias
INSERT INTO patient_allergies (patient_id, allergy_id, severity, reaction, notes) VALUES
(1, 1, 'Leve', 'Estornudos y picazón en los ojos', 'Usa antihistamínicos.'),
(2, 2, 'Severa', 'Dificultad para respirar', 'Evitar nueces por completo.'),
(3, 3, 'Moderada', 'Malestar estomacal', 'Consulta con el médico.');
