import axios from 'axios';
import { useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // Estados para guardar lo que el usuario escribe
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Hook de React Router para redirigir tras el login
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        setError('');

        try {
        const response = await axios.post('http://localhost:4000/api/auth/login', {
            email,
            password
        });

        // Guardamos el token en el Storage del navegador
        localStorage.setItem('token', response.data.token);

        // Redirigimos al panel principal
        window.location.href = '/clientes';
        } catch (err) {
            setError('Credenciales inválidas o error en el servidor. Inténtalo de nuevo.');
            console.error(err);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '400px' }} className="shadow-sm">
                <Card.Body>
                    <h3 className="text-center mb-4">Iniciar Sesión</h3>
                    
                    {/* Muestra alerta roja si hay un error */}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa tu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="dark" type="submit" className="w-100">
                            Entrar al Panel
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
