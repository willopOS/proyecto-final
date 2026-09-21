import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const VehicleFormModal = ({ show, handleClose, vehicleToEdit, refreshVehicles }) => {
    // Todos los campos basados en tu modelo real
    const [vin, setVin] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [tipoVehiculo, setTipoVehiculo] = useState('');
    const [anioFabricacion, setAnioFabricacion] = useState('');
    const [kilometraje, setKilometraje] = useState('');
    const [estado, setEstado] = useState('');
    const [precioVenta, setPrecioVenta] = useState('');
    const [estadoVehiculo, setEstadoVehiculo] = useState('');

    useEffect(() => {
        if (vehicleToEdit) {
            setVin(vehicleToEdit.vin || '');
            setMarca(vehicleToEdit.marca || '');
            setModelo(vehicleToEdit.modelo || '');
            setTipoVehiculo(vehicleToEdit.tipoVehiculo || '');
            setAnioFabricacion(vehicleToEdit.anioFabricacion || '');
            setKilometraje(vehicleToEdit.kilometraje || '');
            setEstado(vehicleToEdit.estado || '');
            setPrecioVenta(vehicleToEdit.precioVenta || '');
            setEstadoVehiculo(vehicleToEdit.estadoVehiculo || '');
        } else {
            setVin(''); setMarca(''); setModelo(''); setTipoVehiculo('');
            setAnioFabricacion(''); setKilometraje(''); setEstado('');
            setPrecioVenta(''); setEstadoVehiculo('Disponible');
        }
    }, [vehicleToEdit, show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Empaquetamos exactamente los nombres que espera Mongo
            const vehicleData = { 
                vin, marca, modelo, tipoVehiculo, 
                anioFabricacion: Number(anioFabricacion), 
                kilometraje, estado, 
                precioVenta: Number(precioVenta), 
                estadoVehiculo 
            };

            if (vehicleToEdit) {
                await axios.put(`http://localhost:4000/api/vehicles/${vehicleToEdit._id}`, vehicleData, config);
                alert('✅ Vehículo actualizado con éxito');
            } else {
                await axios.post('http://localhost:4000/api/vehicles', vehicleData, config);
                alert('✅ Vehículo registrado con éxito');
            }

            refreshVehicles();
            handleClose();
        } catch (error) {
            console.error(error);
            alert('❌ Error al guardar. Verifica la consola.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{vehicleToEdit ? 'Editar Vehículo' : 'Nuevo Vehículo'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>VIN</Form.Label>
                                <Form.Control type="text" value={vin} onChange={(e) => setVin(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Marca</Form.Label>
                                <Form.Control type="text" value={marca} onChange={(e) => setMarca(e.target.value)} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Modelo</Form.Label>
                                <Form.Control type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo (Ej: Turismo, SUV)</Form.Label>
                                <Form.Control type="text" value={tipoVehiculo} onChange={(e) => setTipoVehiculo(e.target.value)} required />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Año de Fab.</Form.Label>
                                <Form.Control type="number" value={anioFabricacion} onChange={(e) => setAnioFabricacion(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio Venta ($)</Form.Label>
                                <Form.Control type="number" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} required />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Kilometraje</Form.Label>
                                <Form.Control type="text" value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} placeholder="Ej: 0 km" required />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-4">
                                <Form.Label>Estado (Nuevo/Usado)</Form.Label>
                                <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)} required>
                                    <option value="">Selecciona...</option>
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Usado">Usado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-4">
                                <Form.Label>Disponibilidad</Form.Label>
                                <Form.Select value={estadoVehiculo} onChange={(e) => setEstadoVehiculo(e.target.value)} required>
                                    <option value="Disponible">Disponible</option>
                                    <option value="Vendido">Vendido</option>
                                    <option value="Reservado">Reservado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" className="me-2" onClick={handleClose}>Cancelar</Button>
                        <Button variant="dark" type="submit">{vehicleToEdit ? 'Guardar Cambios' : 'Registrar Vehículo'}</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default VehicleFormModal;