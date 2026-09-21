import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Button, Container, Table } from 'react-bootstrap';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState('');

    // useEffect se ejecuta automáticamente al cargar el componente
    useEffect(() => {
        obtenerClientes();
    }, []);

    const obtenerClientes = async () => {
        try {
        // Recuperamos el token del navegador
        const token = localStorage.getItem('token');
        
        if (!token) {
            setError('No estás autenticado. Por favor, inicia sesión.');
            return;
        }

        // Hacemos la petición GET enviando el token como escudo de seguridad
        const response = await axios.get('http://localhost:4000/api/clients', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Guardamos los clientes en el estado para que se pinten en la tabla
        setClients(response.data);
        } catch (err) {
            setError('Error al cargar los clientes desde el servidor.');
        console.error(err);
        }
    };

    const eliminarCliente = async (id) => {
    // Pedimos confirmación para no borrar por accidente
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        try {
            const token = localStorage.getItem('token');
            
            // Hacemos la petición DELETE al backend
            await axios.delete(`http://localhost:4000/api/clients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            });

            // Si se elimina con éxito en el backend, lo quitamos de la pantalla actualizando el estado
            setClients(clients.filter((client) => client._id !== id));
            alert('✅ Cliente eliminado satisfactoriamente');
        } catch (err) {
            alert('Error al eliminar el cliente. ¿Tienes permisos de administrador?');
            console.error(err);
        }
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Clientes 👥</h2>
                <Button variant="success"> + Nuevo Cliente</Button>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-dark">
                <tr>
                    <th>ID Cliente</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Preferencias</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    {/* Recorremos el array de clientes y pintamos una fila por cada uno */}
                    {clients.length > 0 ? (
                        clients.map((client) => (
                            <tr key={client._id}>
                                <td>{client.idCliente}</td>
                                <td>{client.nombreCliente}</td>
                                <td>{client.email}</td>
                                <td>{client.preferenciasCliente}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2">Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => eliminarCliente(client._id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No hay clientes registrados aún.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default ClientList;
