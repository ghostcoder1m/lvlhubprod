import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    targetAudience: '',
    features: '',
    keywords: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      toast.error('Error fetching products');
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProductWithId = {
        ...newProduct,
        id: Date.now().toString(), // Generate a unique ID
        createdAt: new Date().toISOString()
      };

      const updatedProducts = [...products, newProductWithId];
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      
      toast.success('Product added successfully');
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: '',
        targetAudience: '',
        features: '',
        keywords: ''
      });
    } catch (error) {
      toast.error('Error adding product');
      console.error('Error adding product:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const updatedProducts = products.filter(product => product.id !== productId);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Error deleting product');
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="flex h-full gap-6">
      {/* Products List Section */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Product List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <span className="material-icons">delete</span>
                </button>
              </div>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="ml-2 text-gray-600">{product.category}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Price:</span>
                  <span className="ml-2 text-gray-600">${product.price}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Target Audience:</span>
                  <span className="ml-2 text-gray-600">{product.targetAudience}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Features:</span>
                  <p className="text-gray-600">{product.features}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Keywords:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.keywords.split(',').map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Form Section */}
      <div className="w-96 bg-white rounded-lg shadow-md p-6 h-fit">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Audience</label>
            <input
              type="text"
              name="targetAudience"
              value={newProduct.targetAudience}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Features</label>
            <textarea
              name="features"
              value={newProduct.features}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="List main product features"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Keywords</label>
            <input
              type="text"
              name="keywords"
              value={newProduct.keywords}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter keywords separated by commas"
              required
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Products; 