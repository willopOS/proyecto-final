import { useEffect, useState } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import ClientList from './components/ClientList';
import Login from './components/Login';
import SaleList from './components/SaleList';
import VehicleList from './components/VehicleList';

// Separamos el contenido en un componente interno para poder usar useNavigate()
function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Este useEffect lee el token cada vez que cargamos la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decodificamos el JWT manualmente para leer lo que hay dentro
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        console.error("Error al decodificar el token");
      }
    }
  }, []);

  const handleLogout = () => {
    // Borramos el token, limpiamos el estado y enviamos al login
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    // Forzamos recarga para limpiar todo rastro en memoria
    window.location.reload();
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">🚗 Concesionario Admin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/vehiculos">Vehículos</Nav.Link>
              <Nav.Link as={Link} to="/clientes">Clientes</Nav.Link>
              <Nav.Link as={Link} to="/ventas">Ventas</Nav.Link>
            </Nav>
            
            {/* Aquí agregamos la sección dinámica del usuario */}
            <Nav>
              {user ? (
                <div className="d-flex align-items-center">
                  <span className="text-light me-3">
                    👤 Rol: <strong className="text-warning">{user.rol || 'Usuario'}</strong>
                  </span>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
              )}
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<h2>Bienvenido al Panel de Control</h2>} />
          <Route path="/vehiculos" element={<VehicleList />} />
          <Route path="/clientes" element={<ClientList />} />
          <Route path="/ventas" element={<SaleList />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </>
  );
}

// El componente principal que envuelve todo en el Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
