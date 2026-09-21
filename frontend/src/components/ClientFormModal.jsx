import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const ClientFormModal = ({ show, handleClose, clientToEdit, refreshClients }) => {
  // Estados para los campos del formulario
    const [nombreCliente, setNombreCliente] = useState('');
    const [email, setEmail] = useState('');
    const [preferenciasCliente, setPreferenciasCliente] = useState('');

    // Este useEffect vigila si le pasamos un cliente para editar
    useEffect(() => {
        if (clientToEdit) {
            // Si hay un cliente, llenamos los campos con sus datos
            setNombreCliente(clientToEdit.nombreCliente || '');
            setEmail(clientToEdit.email || '');
            setPreferenciasCliente(clientToEdit.preferenciasCliente || '');
        } else {
            // Si es un "Nuevo Cliente", dejamos los campos en blanco
            setNombreCliente('');
            setEmail('');
            setPreferenciasCliente('');
        }
    }, [clientToEdit, show]); // Se ejecuta cada vez que el modal se abre o cambia el cliente

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (clientToEdit) {
                // MODO EDITAR: Solo enviamos los datos modificables
                const clientData = { nombreCliente, email, preferenciasCliente };
                await axios.put(`http://localhost:4000/api/clients/${clientToEdit._id}`, clientData, config);
                alert('✅ Cliente actualizado con éxito');
            } else {
                // MODO CREAR: Generamos un idCliente aleatorio o basado en la fecha para cumplir con el backend
                // En una app real esto lo haría la BBDD de forma autoincremental, pero esto servirá perfectamente:
                const nuevoIdCliente = Math.floor(Math.random() * 100000);
                
                const newClientData = {
                    idCliente: nuevoIdCliente,
                    nombreCliente,
                    email,
                    preferenciasCliente
                };
                await axios.post('http://localhost:4000/api/clients', newClientData, config);
                alert('✅ Cliente creado con éxito');
            }

            refreshClients();
            handleClose();
        } catch (error) {
            console.error(error);
            alert('❌ Error al guardar el cliente. Verifica la consola.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{clientToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control
                            type="text"
                            value={nombreCliente}
                            onChange={(e) => setNombreCliente(e.target.value)}
                            required
                        />
                    </Form.Group>
                
                    <Form.Group className="mb-3">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Preferencias</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            value={preferenciasCliente}
                            onChange={(e) => setPreferenciasCliente(e.target.value)}
                            placeholder="Ej: SUVs, Asientos de cuero, Financiación..."
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" className="me-2" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="dark" type="submit">
                            {clientToEdit ? 'Guardar Cambios' : 'Registrar Cliente'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ClientFormModal;
