import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Button, Container, Table } from 'react-bootstrap';
import ClientFormModal from './ClientFormModal';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [error, setError] = useState('');
    
    // Estados para controlar la ventana modal
    const [showModal, setShowModal] = useState(false);
    const [clientToEdit, setClientToEdit] = useState(null);

    const obtenerClientes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No estás autenticado. Por favor, inicia sesión.');
                return;
            }
            const response = await axios.get('http://localhost:4000/api/clients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClients(response.data);
        } catch (err) {
            setError('Error al cargar los clientes desde el servidor.');
            console.error(err);
        }
    };

    // useEffect ahora está DEBAJO de obtenerClientes para que no marque error
    useEffect(() => {
        obtenerClientes();
    }, []);

    const eliminarCliente = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:4000/api/clients/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClients(clients.filter((client) => client._id !== id));
                alert('✅ Cliente eliminado satisfactoriamente');
            } catch (err) {
                alert('Error al eliminar el cliente. ¿Tienes permisos de administrador?');
                console.error(err);
            }
        }
    };

    // Funciones de los botones para abrir el Modal
    const handleOpenNew = () => {
        setClientToEdit(null);
        setShowModal(true);
    };

    const handleOpenEdit = (client) => {
        setClientToEdit(client);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Clientes 👥</h2>
                <Button variant="success" onClick={handleOpenNew}> + Nuevo Cliente</Button>
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
                    {clients.length > 0 ? (
                        clients.map((client) => (
                            <tr key={client._id}>
                                <td>{client.idCliente}</td>
                                <td>{client.nombreCliente}</td>
                                <td>{client.email}</td>
                                <td>{client.preferenciasCliente}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleOpenEdit(client)}>Editar</Button>
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

        {/* Aquí está conectado el Modal de Crear/Editar */}
        <ClientFormModal
            show={showModal}
            handleClose={handleCloseModal}
            clientToEdit={clientToEdit}
            refreshClients={obtenerClientes}
        />
        </Container>
    );
};

export default ClientList;