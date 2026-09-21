import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Button, Container, Table } from 'react-bootstrap';
import VehicleFormModal from './VehicleFormModal';

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [vehicleToEdit, setVehicleToEdit] = useState(null);

    const obtenerVehiculos = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return setError('No estás autenticado.');
            
            const response = await axios.get('http://localhost:4000/api/vehicles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVehicles(response.data);
        } catch (err) {
            setError('Error al cargar los vehículos.');
            console.error(err);
        }
    };

    useEffect(() => { obtenerVehiculos(); }, []);

    const eliminarVehiculo = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:4000/api/vehicles/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVehicles(vehicles.filter((v) => v._id !== id));
                alert('✅ Vehículo eliminado');
            } catch (err) {
                alert('Error al eliminar. ¿Tienes permisos de admin?');
            }
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Inventario de Vehículos 🚗</h2>
                <Button variant="success" onClick={() => { setVehicleToEdit(null); setShowModal(true); }}>
                    + Nuevo Vehículo
                </Button>
            </div>
        
            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>VIN</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Año</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.length > 0 ? (
                        vehicles.map((v) => (
                            <tr key={v._id}>
                                <td>{v.vin}</td>
                                <td>{v.marca}</td>
                                <td>{v.modelo}</td>
                                <td>{v.anioFabricacion}</td>
                                <td>${v.precioVenta}</td>
                                <td>{v.estadoVehiculo}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => { setVehicleToEdit(v); setShowModal(true); }}>Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => eliminarVehiculo(v._id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" className="text-center">No hay vehículos registrados.</td></tr>
                    )}
                </tbody>
            </Table>

            <VehicleFormModal show={showModal} handleClose={() => setShowModal(false)} vehicleToEdit={vehicleToEdit} refreshVehicles={obtenerVehiculos} />
        </Container>
    );
};

export default VehicleList;
