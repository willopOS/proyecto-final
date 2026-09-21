import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const SaleFormModal = ({ show, handleClose, saleToEdit, refreshSales }) => {
    const [vehiculoVendido, setVehiculoVendido] = useState('');
    const [clienteAsociado, setClienteAsociado] = useState('');
    const [fechaVenta, setFechaVenta] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');

    // NUEVO: Estados para guardar las listas de la base de datos
    const [listaClientes, setListaClientes] = useState([]);
    const [listaVehiculos, setListaVehiculos] = useState([]);

    // Cargar listas de clientes y vehículos al abrir la app
    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // Pedimos ambas listas al mismo tiempo
                const [resClientes, resVehiculos] = await Promise.all([
                    axios.get('http://localhost:4000/api/clients', config),
                    axios.get('http://localhost:4000/api/vehicles', config)
                ]);
                
                setListaClientes(resClientes.data);
                setListaVehiculos(resVehiculos.data);
            } catch (error) {
                console.error("Error cargando listas para los desplegables", error);
            }
        };
        fetchDatos();
    }, []);

    useEffect(() => {
        if (saleToEdit) {
            setVehiculoVendido(typeof saleToEdit.vehiculoVendido === 'object' ? saleToEdit.vehiculoVendido._id : saleToEdit.vehiculoVendido || '');
            setClienteAsociado(typeof saleToEdit.clienteAsociado === 'object' ? saleToEdit.clienteAsociado._id : saleToEdit.clienteAsociado || '');
            setFechaVenta(saleToEdit.fechaVenta ? saleToEdit.fechaVenta.substring(0, 10) : '');
            setFechaEntrega(saleToEdit.fechaEntrega ? saleToEdit.fechaEntrega.substring(0, 10) : '');
            setMetodoPago(saleToEdit.metodoPago || '');
        } else {
            setVehiculoVendido(''); setClienteAsociado('');
            setFechaVenta(''); setFechaEntrega(''); setMetodoPago('Transacción bancaria');
        }
    }, [saleToEdit, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const saleData = { vehiculoVendido, clienteAsociado, fechaVenta, metodoPago, fechaEntrega };

            if (saleToEdit) {
                await axios.put(`http://localhost:4000/api/sales/${saleToEdit._id}`, saleData, config);
                alert('✅ Venta actualizada con éxito');
            } else {
                const idVenta = Math.floor(Math.random() * 100000);
                await axios.post('http://localhost:4000/api/sales', { idVenta, ...saleData }, config);
                alert('✅ Venta registrada con éxito');
            }
            refreshSales();
            handleClose();
        } catch (error) {
            const mensajeBackend = error.response?.data?.message || error.response?.data?.error || error.message;
            alert(`❌ Error del servidor al guardar: ${mensajeBackend}`);
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{saleToEdit ? 'Editar Venta' : 'Nueva Venta'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Vehículo Vendido</Form.Label>
                                {/* NUEVO: Menú desplegable bloqueado al editar */}
                                <Form.Select 
                                    value={vehiculoVendido} 
                                    onChange={(e) => setVehiculoVendido(e.target.value)} 
                                    required
                                    disabled={!!saleToEdit} 
                                >
                                    <option value="">Seleccione un vehículo...</option>
                                    {listaVehiculos.map(v => (
                                        <option key={v._id} value={v._id}>
                                            {v.marca} {v.modelo} (VIN: {v.vin})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cliente Asociado</Form.Label>
                                {/* NUEVO: Menú desplegable bloqueado al editar */}
                                <Form.Select 
                                    value={clienteAsociado} 
                                    onChange={(e) => setClienteAsociado(e.target.value)} 
                                    required
                                    disabled={!!saleToEdit}
                                >
                                    <option value="">Seleccione un cliente...</option>
                                    {listaClientes.map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.nombreCliente} ({c.email})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Venta</Form.Label>
                                <Form.Control type="date" value={fechaVenta} onChange={(e) => setFechaVenta(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Entrega</Form.Label>
                                <Form.Control type="date" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-4">
                                <Form.Label>Método de Pago</Form.Label>
                                <Form.Select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} required>
                                    <option value="Transacción bancaria">Transacción bancaria</option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Financiación">Financiación</option>
                                    <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" className="me-2" onClick={handleClose}>Cancelar</Button>
                        <Button variant="dark" type="submit">{saleToEdit ? 'Guardar Cambios' : 'Registrar Venta'}</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SaleFormModal;
