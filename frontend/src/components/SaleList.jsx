import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Button, Container, Table } from 'react-bootstrap';
import SaleFormModal from './SaleFormModal';

const SaleList = () => {
    const [sales, setSales] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [saleToEdit, setSaleToEdit] = useState(null);

    const obtenerVentas = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return setError('No estás autenticado.');
            
            const response = await axios.get('http://localhost:4000/api/sales', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSales(response.data);
        } catch (err) {
            setError('Error al cargar las ventas.');
            console.error(err);
        }
    };

    useEffect(() => { obtenerVentas(); }, []);

    const eliminarVenta = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este registro de venta?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:4000/api/sales/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSales(sales.filter((s) => s._id !== id));
                alert('✅ Venta eliminada');
                } catch (err) {
                    // Captura el mensaje exacto que envía Node.js
                    const mensajeBackend = err.response?.data?.message || err.response?.data?.error || err.message;
                    alert(`❌ Error del servidor al eliminar: ${mensajeBackend}`);
                    console.error(err);
                }
        }
    };

    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return '';
        // Ajustamos la zona horaria para que el día sea exacto
        const fecha = new Date(fechaISO);
        return new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000).toLocaleDateString('es-ES');
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Ventas 💸</h2>
                <Button variant="success" onClick={() => { setSaleToEdit(null); setShowModal(true); }}>
                    + Nueva Venta
                </Button>
            </div>
        
            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>Nº Venta</th>
                        <th>ID Vehículo</th>
                        <th>ID Cliente</th>
                        <th>Fecha Venta</th>
                        <th>Método Pago</th>
                        <th>Fecha Entrega</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length > 0 ? (
                        sales.map((s) => (
                            <tr key={s._id}>
                                <td>{s.idVenta}</td>
                                <td>{typeof s.vehiculoVendido === 'object' ? 'Ver Detalles' : s.vehiculoVendido}</td>
                                <td>{typeof s.clienteAsociado === 'object' ? 'Ver Detalles' : s.clienteAsociado}</td>
                                <td>{formatearFecha(s.fechaVenta)}</td>
                                <td>{s.metodoPago}</td>
                                <td>{formatearFecha(s.fechaEntrega)}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => { setSaleToEdit(s); setShowModal(true); }}>Editar</Button>
                                    <Button variant="danger" size="sm" onClick={() => eliminarVenta(s._id)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" className="text-center">No hay ventas registradas.</td></tr>
                    )}
                </tbody>
            </Table>

            <SaleFormModal show={showModal} handleClose={() => setShowModal(false)} saleToEdit={saleToEdit} refreshSales={obtenerVentas} />
        </Container>
    );
};

export default SaleList;
