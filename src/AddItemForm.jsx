import React, { useState } from 'react';

const AddItemForm = ({ onAddItem }) => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!itemName || !description || !imageFile) {
      setError('All fields are required.');
      return;
    }

    // Create a FormData object and add the item
    const formData = new FormData();
    formData.append('itemName', itemName);
    formData.append('description', description);
    formData.append('imageFile', imageFile);

    onAddItem(formData);
    setItemName('');
    setDescription('');
    setImageFile(null);
  };

  const handleCancel = () => {
    setItemName('');
    setDescription('');
    setImageFile(null);
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div
      className="container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f8c8dc, #f0f0f0)',
        padding: '50px 20px',
        minHeight: '100vh',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '30px',
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          border: '1px solid #ddd',
        }}
      >
        <h3 className="text-center" style={{ color: '#4b0082', fontWeight: 'bold' }}>Add Item</h3>

        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

        <div className="mb-3">
          <label htmlFor="itemName" className="form-label">Item Name</label>
          <input
            type="text"
            className="form-control"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            style={{
              borderRadius: '10px',
              padding: '10px',
              border: '1px solid #ddd',
              transition: 'border-color 0.3s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = '#4b0082'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              borderRadius: '10px',
              padding: '10px',
              border: '1px solid #ddd',
              transition: 'border-color 0.3s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = '#4b0082'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="imageFile" className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            id="imageFile"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{
              borderRadius: '10px',
              padding: '10px',
              border: '1px solid #ddd',
              transition: 'border-color 0.3s ease',
            }}
            onFocus={(e) => e.target.style.borderColor = '#4b0082'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        {imageFile && (
          <div className="mb-3" style={{ textAlign: 'center' }}>
            <h5 style={{ color: '#4b0082' }}>Selected Image:</h5>
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Selected"
              style={{ width: '100%', borderRadius: '10px', marginTop: '10px' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: '#4b0082',
              color: '#fff',
              padding: '10px',
              borderRadius: '10px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
              flex: 1,
              marginRight: '10px',
            }}
          >
            Add Item
          </button>

          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: '#ddd',
              color: '#333',
              padding: '10px',
              borderRadius: '10px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
              flex: 1,
            }}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;
