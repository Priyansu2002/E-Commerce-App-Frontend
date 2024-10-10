import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  return (
    <div className="checkoutPopup">
      <Modal 
        show={show} 
        onHide={handleClose} 
        style={{
          borderRadius: '15px',
          boxShadow: '0px 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa', borderBottom: 'none' }}>
          <Modal.Title style={{ fontSize: '1.6rem', fontWeight: '600', color: '#333' }}>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="checkout-item" 
                style={{ 
                  display: 'flex', 
                  marginBottom: '15px', 
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#f0f0f0',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  style={{ 
                    width: '80px',  // Resized width
                    height: '80px', // Resized height
                    marginRight: '15px', 
                    borderRadius: '8px' 
                  }} 
                />
                <div>
                  <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0' }}>{item.name}</p>
                  <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>Quantity: {item.quantity}</p>
                  <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>Price: ${item.price * item.quantity}</p>
                </div>
              </div>
            ))}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginTop: '20px' 
            }}>
              <h5 
                style={{ 
                  color: '#333', 
                  fontSize: '1.4rem', 
                  fontWeight: 'bold' 
                }}
              >
                Total: ${totalPrice}
              </h5>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#f8f9fa', borderTop: 'none' }}>
          <Button 
            variant="secondary" 
            onClick={handleClose} 
            style={{ 
              borderRadius: '8px', 
              padding: '10px 20px', 
              fontSize: '1rem' 
            }}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCheckout} 
            style={{ 
              borderRadius: '8px', 
              padding: '10px 20px', 
              fontSize: '1rem' 
            }}
          >
            Confirm Purchase
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CheckoutPopup;
