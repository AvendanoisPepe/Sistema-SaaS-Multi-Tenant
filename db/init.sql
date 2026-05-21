-- ============================================
-- TABLAS
-- ============================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Tabla puente: un usuario puede estar en varios workspaces con roles distintos
CREATE TABLE user_workspaces (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    workspace_id INT NOT NULL REFERENCES workspaces(id),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'editor', 'lector'))
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    workspace_id INT NOT NULL REFERENCES workspaces(id)
);

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- Usuario de prueba
-- Password: "password123" hasheada con bcrypt
INSERT INTO users (name, email, password) VALUES (
    'Juan Gonzalez',
    'juan@example.com',
    '$2b$12$A.IUo9vI7b9EkyFMqDe76.I90dqaveUjPDSxLiU1E6jWDlk9s32UW'
);

-- Workspaces
INSERT INTO workspaces (name) VALUES ('Workspace Alfa');
INSERT INTO workspaces (name) VALUES ('Workspace Beta');

-- Roles del usuario:
--   Workspace Alfa (id=1) → Admin
--   Workspace Beta (id=2) → Lector
INSERT INTO user_workspaces (user_id, workspace_id, role) VALUES (1, 1, 'admin');
INSERT INTO user_workspaces (user_id, workspace_id, role) VALUES (1, 2, 'lector');

-- Proyectos en Workspace Alfa
INSERT INTO projects (name, description, workspace_id) VALUES
    ('Rediseño Web', 'Modernizar el sitio corporativo', 1),
    ('App Móvil', 'Desarrollar aplicación para iOS y Android', 1);

-- Proyectos en Workspace Beta
INSERT INTO projects (name, description, workspace_id) VALUES
    ('Campaña Q3', 'Estrategia de marketing para el tercer trimestre', 2),
    ('Análisis de Datos', 'Revisión de métricas de usuarios', 2);