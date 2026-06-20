-- CoachHub — Script de base de datos
-- Autor: Gonzalo Martinez Saura
-- CFGS DAW 2025/2026 — CIFP Carlos III

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS coachhub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE coachhub_db;

-- Las tablas las crea Hibernate automaticamente al arrancar el backend
-- Este script inserta los datos (seeders) iniciales necesarios

-- Ejercicios del catalogo (datos maestros)
INSERT INTO exercises (name, muscle_group, description) VALUES
('Press banca plano con barra', 'Pecho', 'Ejercicio compuesto para pectoral mayor con barra'),
('Press banca inclinado con barra', 'Pecho', 'Trabaja la porcion superior del pectoral'),
('Press banca declinado con barra', 'Pecho', 'Trabaja la porcion inferior del pectoral'),
('Press banca plano con mancuernas', 'Pecho', 'Mayor rango de movimiento que con barra'),
('Press banca inclinado con mancuernas', 'Pecho', 'Porcion superior del pectoral con mancuernas'),
('Aperturas con mancuernas en plano', 'Pecho', 'Ejercicio de aislamiento para pectoral'),
('Aperturas en polea cruzada', 'Pecho', 'Tension constante en el pectoral con polea'),
('Fondos en paralelas', 'Pecho', 'Ejercicio compuesto con peso corporal para pecho y triceps'),
('Press en maquina de pecho', 'Pecho', 'Maquina guiada para pectoral ideal para principiantes'),
('Pullover con mancuerna', 'Pecho', 'Trabaja pectoral y dorsal en el mismo movimiento'),
('Dominadas pronadas', 'Espalda', 'Ejercicio compuesto con peso corporal para dorsal ancho'),
('Dominadas supinas', 'Espalda', 'Mayor activacion del biceps que las dominadas pronadas'),
('Peso muerto convencional', 'Espalda', 'Ejercicio compuesto para espalda baja y posterior de pierna'),
('Peso muerto rumano', 'Espalda', 'Enfocado en isquiotibiales y espalda baja'),
('Remo con barra', 'Espalda', 'Ejercicio compuesto para espalda media y dorsal'),
('Remo con mancuerna a una mano', 'Espalda', 'Permite mayor rango de movimiento que el remo con barra'),
('Remo en polea baja sentado', 'Espalda', 'Maquina de cable para espalda media'),
('Jalones al pecho en polea alta', 'Espalda', 'Alternativa a dominadas para trabajar el dorsal'),
('Jalones tras nuca en polea alta', 'Espalda', 'Variante que trabaja el dorsal desde otro angulo'),
('Remo en maquina', 'Espalda', 'Maquina guiada para espalda media ideal para principiantes'),
('Face pull en polea', 'Espalda', 'Trabaja deltoides posterior y manguito rotador'),
('Encogimientos con barra', 'Espalda', 'Ejercicio de aislamiento para trapecio'),
('Hiperextensiones en banco', 'Espalda', 'Trabaja espalda baja y gluteos'),
('Press militar con barra de pie', 'Hombros', 'Ejercicio compuesto para deltoides anterior y medio'),
('Press militar con mancuernas sentado', 'Hombros', 'Variante con mancuernas para mayor rango de movimiento'),
('Elevaciones laterales con mancuernas', 'Hombros', 'Aislamiento para deltoides medio'),
('Elevaciones frontales con mancuernas', 'Hombros', 'Aislamiento para deltoides anterior'),
('Pajaros con mancuernas', 'Hombros', 'Aislamiento para deltoides posterior'),
('Elevaciones laterales en polea baja', 'Hombros', 'Tension constante en deltoides medio'),
('Press Arnold', 'Hombros', 'Variante del press que trabaja los tres fasciculos del deltoides'),
('Remo al menton con barra', 'Hombros', 'Trabaja deltoides medio y trapecio'),
('Curl con barra recta', 'Biceps', 'Ejercicio basico de aislamiento para biceps'),
('Curl con barra Z', 'Biceps', 'Menos tension en munecas que con barra recta'),
('Curl alternado con mancuernas', 'Biceps', 'Trabaja cada brazo de forma independiente'),
('Curl martillo con mancuernas', 'Biceps', 'Trabaja biceps y braquiorradial'),
('Curl en banco inclinado con mancuernas', 'Biceps', 'Mayor estiramiento del biceps en la posicion inicial'),
('Curl concentrado con mancuerna', 'Biceps', 'Maximo aislamiento del biceps'),
('Curl en polea baja', 'Biceps', 'Tension constante durante todo el recorrido'),
('Curl en maquina', 'Biceps', 'Maquina guiada para biceps ideal para principiantes'),
('Press frances con barra Z tumbado', 'Triceps', 'Ejercicio de aislamiento para las tres cabezas del triceps'),
('Extension de triceps en polea alta', 'Triceps', 'Aislamiento con cable para triceps'),
('Extension de triceps con cuerda en polea', 'Triceps', 'Permite separar las manos al final del movimiento'),
('Fondos en banco', 'Triceps', 'Ejercicio con peso corporal para triceps'),
('Press cerrado con barra', 'Triceps', 'Ejercicio compuesto para triceps y pecho'),
('Patadas de triceps con mancuerna', 'Triceps', 'Aislamiento para la cabeza larga del triceps'),
('Extension sobre cabeza con mancuerna', 'Triceps', 'Trabaja la cabeza larga del triceps en estiramiento'),
('Dips en maquina', 'Triceps', 'Maquina guiada para triceps ideal para principiantes'),
('Sentadilla con barra libre', 'Piernas', 'Ejercicio rey para cuadriceps gluteos e isquiotibiales'),
('Sentadilla goblet con mancuerna', 'Piernas', 'Variante accesible ideal para principiantes'),
('Sentadilla bulgara con mancuernas', 'Piernas', 'Trabaja cada pierna de forma independiente'),
('Prensa de piernas', 'Piernas', 'Maquina guiada para cuadriceps y gluteos'),
('Extension de cuadriceps en maquina', 'Piernas', 'Aislamiento para cuadriceps'),
('Zancadas con mancuernas', 'Piernas', 'Trabaja cuadriceps y gluteos con cada pierna por separado'),
('Zancadas con barra', 'Piernas', 'Variante de zancadas con mayor carga'),
('Sentadilla Hack con barra', 'Piernas', 'Enfocado en cuadriceps con menos carga lumbar'),
('Sentadilla en maquina Smith', 'Piernas', 'Maquina guiada para sentadilla con trayectoria fija'),
('Step up con mancuernas', 'Piernas', 'Sube a un banco con mancuernas para trabajar cuadriceps y gluteos'),
('Curl de isquiotibiales tumbado en maquina', 'Piernas', 'Aislamiento para isquiotibiales'),
('Curl de isquiotibiales sentado en maquina', 'Piernas', 'Variante sentada para isquiotibiales'),
('Hip thrust con barra', 'Piernas', 'Ejercicio principal para gluteo mayor'),
('Hip thrust en maquina', 'Piernas', 'Variante guiada del hip thrust'),
('Patada de gluteo en polea baja', 'Piernas', 'Aislamiento para gluteo mayor'),
('Buenos dias con barra', 'Piernas', 'Trabaja isquiotibiales y espalda baja'),
('Puente de gluteos en suelo', 'Piernas', 'Version accesible del hip thrust sin equipamiento'),
('Abduccion de cadera en maquina', 'Piernas', 'Aislamiento para gluteo medio'),
('Elevacion de talon de pie en maquina', 'Gemelos', 'Ejercicio principal para gemelo'),
('Elevacion de talon sentado en maquina', 'Gemelos', 'Trabaja el soleo con la rodilla flexionada'),
('Elevacion de talon con mancuerna a una pierna', 'Gemelos', 'Trabaja cada gemelo de forma independiente'),
('Elevacion de talon en prensa', 'Gemelos', 'Variante del gemelo en la maquina de prensa'),
('Crunch abdominal en suelo', 'Abdominales', 'Ejercicio basico para el recto abdominal'),
('Crunch en polea alta', 'Abdominales', 'Crunch con resistencia para mayor intensidad'),
('Plancha frontal', 'Abdominales', 'Ejercicio isometrico para core completo'),
('Plancha lateral', 'Abdominales', 'Trabaja el oblicuo externo e interno'),
('Elevacion de piernas tumbado', 'Abdominales', 'Trabaja la porcion inferior del recto abdominal'),
('Rueda abdominal', 'Abdominales', 'Ejercicio avanzado para core completo'),
('Russian twist con disco', 'Abdominales', 'Trabaja oblicuos con rotacion'),
('Encogimiento de rodillas en barra', 'Abdominales', 'Colgado de una barra sube las rodillas al pecho'),
('Dead bug', 'Abdominales', 'Ejercicio de estabilidad para core profundo'),
('Bird dog', 'Abdominales', 'Trabaja core y estabilidad lumbar simultaneamente'),
('Burpees', 'Funcional', 'Ejercicio de cuerpo completo de alta intensidad'),
('Salto a la comba', 'Funcional', 'Cardio de bajo impacto para calentamiento o HIIT'),
('Kettlebell swing', 'Funcional', 'Movimiento explosivo para posterior de pierna y core'),
('Turkish get up con kettlebell', 'Funcional', 'Ejercicio complejo de movilidad y fuerza'),
('Battle ropes', 'Funcional', 'Cardio y fuerza de tren superior con cuerdas de batalla'),
('Box jump', 'Funcional', 'Salto explosivo a una caja para potencia de piernas'),
('Farmer carry con mancuernas', 'Funcional', 'Caminar con mancuernas pesadas para grip y core'),
('Mountain climbers', 'Funcional', 'Ejercicio de core y cardio en posicion de plancha'),
('Thruster con mancuernas', 'Funcional', 'Combinacion de sentadilla frontal y press militar'),
('Pallof press en polea', 'Funcional', 'Ejercicio antirotacional para estabilidad de core');

-- Usuario coach de demo (contrasena: demo1234)
INSERT INTO users (name, email, password, role, is_active) VALUES
('Gonzalo Martinez', 'coach@coachhub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lkaG', 'COACH', 1);

-- Usuario atleta de demo (contrasena: demo1234)
INSERT INTO users (name, email, password, role, is_active, height, starting_weight, birth_date, gender, objective) VALUES
('Pedro Garcia', 'atleta@coachhub.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lkaG', 'ATHLETE', 1, 178, 82, '2000-03-15', 'MALE', 'GAIN_MUSCLE');

-- Vincular atleta con coach (ejecutar despues de los INSERT anteriores)
UPDATE users SET coach_id = (SELECT id FROM (SELECT id FROM users WHERE email = 'coach@coachhub.com') AS tmp)
WHERE email = 'atleta@coachhub.com';