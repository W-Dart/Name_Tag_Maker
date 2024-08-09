import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const InputTable = (props) => {
    const [rows, setRows] = useState([]);
    const [newRow, setNewRow] = useState({ item_type: '', backing: '', first_name: '', last_name: '', pronouns: '', notes: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [mailLocation, setMailLocation] = useState('');
    const [orderName, setOrderName] = useState('');
    const [showDoubleCheck, setShowDoubleCheck] = useState(false);
    
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRow({ ...newRow, [name]: value });
    };

    const handleAddRow = () => {
        setRows([...rows, newRow]);
        setNewRow({ item_type: '', backing: '', first_name: '', last_name: '', pronouns: '', notes: '' });
    };

    const handleDeleteRow = () => {
        setRows(rows.slice(0, -1));
    };

    const handleSubmit = () => {
        setShowAlert(!showAlert);
        if (showAlert) {
            if (!orderName  || !mailLocation) {
                alert("Order name and mail location must be included!");
                setShowAlert(true);
            } else {
                setShowDoubleCheck(true);
                setShowAlert(true);
            }
            
        }
    };

    const handleCompleteRequest = () => {
        setShowDoubleCheck(false);
        alert("Your request has been submitted!");
    
        const requestData = {
            orderName,
            mailLocation,
            data: rows
        };
    
        fetch('http://localhost:3001/save-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data saved:', data);
            props.saveData(requestData);
            // Clear the form
            setRows([]);
            setOrderName('');
            setMailLocation('');
        })
        .catch(error => {
            console.error('There was an error saving the data!', error);
        });
    
        setShowAlert(false);
    }

    useEffect(() => {
        if (newRow.item_type !== 'Name Tag') {
            setNewRow(prevState => ({ ...prevState, backing: '' }));
        }
    }, [newRow.item_type]);

    return (
        <Container className="p-3">
            <Row>
                <Col xs={12} md={8}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Item Type</th>
                                <th>Name Tag Backing</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Pronouns (Optional)</th>
                                <th>Notes (Optional)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center">Enter request details below:</td>
                                </tr>
                            )}
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.item_type}</td>
                                    <td>{row.backing}</td>
                                    <td>{row.first_name}</td>
                                    <td>{row.last_name}</td>
                                    <td>{row.pronouns}</td>
                                    <td>{row.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                <Col xs={12} md={4}>
                    <Form className="w-100">
                        <Form.Group controlId="formItemType">
                            <Form.Label>Item Type</Form.Label>
                            <Form.Select
                                name="item_type"
                                value={newRow.item_type}
                                onChange={handleInputChange}
                                style={{ width: '100%' }}
                                disabled = {showAlert || showDoubleCheck}
                            >
                                <option value="">Select an item type</option>
                                <option value="Name Tag">Name Tag</option>
                                <option value="Door Tag (Sticker Only)">Door Tag (Sticker Only)</option>
                                <option value="Desk Plate with Holder">Desk Plate with Holder</option>
                                <option value="Desk Plate without Holder">Desk Plate without Holder</option>
                            </Form.Select>
                        </Form.Group>
                        {newRow.item_type === 'Name Tag' && (
                            <Form.Group controlId="formBacking">
                                <Form.Label>Name Tag Backing</Form.Label>
                                <Form.Select
                                    name="backing"
                                    value={newRow.backing}
                                    onChange={handleInputChange}
                                    style={{ width: '100%' }}
                                    disabled = {showAlert || showDoubleCheck}
                                >
                                    <option value="">Select Backing</option>
                                    <option value="Magnet">Magnet</option>
                                    <option value="Pin">Pin</option>
                                </Form.Select>
                            </Form.Group>
                        )}
                        <Form.Group controlId="formFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="first_name"
                                value={newRow.first_name}
                                onChange={handleInputChange}
                                style={{ width: '100%' }}
                                disabled = {showAlert || showDoubleCheck}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="last_name"
                                value={newRow.last_name}
                                onChange={handleInputChange}
                                style={{ width: '100%' }}
                                disabled = {showAlert || showDoubleCheck}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPronouns">
                            <Form.Label>Pronouns (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                name="pronouns"
                                value={newRow.pronouns}
                                onChange={handleInputChange}
                                style={{ width: '100%' }}
                                disabled = {showAlert || showDoubleCheck}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNotes">
                            <Form.Label>Notes (Optional)</Form.Label>
                            <Form.Control
                                type="text"
                                name="notes"
                                value={newRow.notes}
                                onChange={handleInputChange}
                                style={{ width: '100%' }}
                                disabled = {showAlert || showDoubleCheck}
                            />
                        </Form.Group>
                        <Button style={{marginTop: '1rem'}} variant="primary" onClick={handleAddRow} disabled = {showAlert || showDoubleCheck}>
                            Add Row
                        </Button>
                        <Button style={{marginTop: '1rem'}} variant="primary" onClick={handleDeleteRow} disabled = {showAlert || showDoubleCheck}>
                            Delete Row
                        </Button>
                    </Form>
                    {showAlert && (
                        <div>
                        <p style={{marginBottom: 0, marginTop:'0.5rem', color: 'red'}}>Enter mail location and name for the order: </p>
                        <Form>
                            <Form.Group controlId="mailLocation">
                                <Form.Label>Mail Location</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Mail Location"
                                    value={mailLocation}
                                    onChange={(e) => setMailLocation(e.target.value)}
                                    style={{ width: '100%' }}
                                    placeholder = "Ex. Sellery Hall Desk"
                                />
                            </Form.Group>
                            <Form.Group controlId="orderNmae">
                                <Form.Label>Order Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Order Name"
                                    value={orderName}
                                    onChange={(e) => setOrderName(e.target.value)}
                                    style={{ width: '100%' }}
                                    placeholder = "Ex. John Smith"
                                />
                            </Form.Group>
                        </Form>
                        </div>
                        
                    )}
                    {showDoubleCheck && (
                        <p style={{marginBottom: 0, marginTop:'0.5rem', color: 'red'}}>Please check that everything looks right.</p>
                    )}
                    <Button variant="success" onClick={showDoubleCheck ? handleCompleteRequest : handleSubmit} style={{ marginTop: '1rem' }}>
                         {showDoubleCheck ? "Complete Request" : showAlert ? "Confirm Submit" : "Submit"}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default InputTable;
