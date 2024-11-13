import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserManagement.css';

const UserList = ({ users, onUpdate, onBlock, onUnblock, onDelete }) => (
  <tbody>
    {users.map(user => (
      <tr key={user._id}>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.mobile}</td>
        <td>
          <button className="action-button update" onClick={() => onUpdate(user)}>Update</button>
          {user.isBlocked ? (
            <button className="action-button unblock" onClick={() => onUnblock(user._id)}>Unblock</button>
          ) : (
            <button className="action-button block" onClick={() => onBlock(user._id)}>Block</button>
          )}
          <button className="action-button delete" onClick={() => onDelete(user._id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
);

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', mobile: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found');
        navigate('/');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/user/all-users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.status === 401) {
          const refreshResponse = await fetch('http://localhost:5000/api/user/refresh', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,
            },
          });

          if (!refreshResponse.ok) {
            setError('Session expired. Please log in again.');
            navigate('/');
            return;
          }

          const data = await refreshResponse.json();
          localStorage.setItem('token', data.token);
          return fetchUsers();
        }

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to fetch users: ${errorMessage}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('role');

    if (!isAuthenticated || (userRole !== 'admin' && userRole !== 'seller')) {
      navigate('/');
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const handleBlockUser = async (id) => {
    const updatedUsers = users.map(user => user._id === id ? { ...user, isBlocked: true } : user);
    setUsers(updatedUsers);

    try {
      const response = await fetch(`http://localhost:5000/api/user/block-user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (!response.ok) throw new Error('Failed to block user');
    } catch (error) {
      setError(error.message);
      setUsers(users); // Revert optimistic update
    }
  };

  const handleUnblockUser = async (id) => {
    const updatedUsers = users.map(user => user._id === id ? { ...user, isBlocked: false } : user);
    setUsers(updatedUsers);

    try {
      const response = await fetch(`http://localhost:5000/api/user/unblock-user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (!response.ok) throw new Error('Failed to unblock user');
    } catch (error) {
      setError(error.message);
      setUsers(users); // Revert optimistic update
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const updatedUsers = users.filter(user => user._id !== id);
    setUsers(updatedUsers);

    try {
      const response = await fetch(`http://localhost:5000/api/user/delete-user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (!response.ok) throw new Error('Failed to delete user');
    } catch (error) {
      setError(error.message);
      setUsers(users); // Revert optimistic update
    }
  };

  const handleUpdateUser = (user) => {
    setUpdatingUser(user);
    setNewUserData({ name: user.name, email: user.email, mobile: user.mobile }); // Populate with current user data
  };

  const handleSubmitUpdate = async () => {
    if (!updatingUser) return;

    const updatedUsers = users.map(user => user._id === updatingUser._id ? { ...user, ...newUserData } : user);
    setUsers(updatedUsers);

    try {
      const response = await fetch(`http://localhost:5000/api/user/update-user/${updatingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newUserData)
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update user: ${errorMessage}`);
      }
      // Optionally, refetch users here to ensure the latest data
      // await fetchUsers();
    } catch (error) {
      setError(error.message);
      setUsers(users); // Revert optimistic update
    } finally {
      setUpdatingUser(null); // Close the modal
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="user-management-container">
      <h2>Users</h2>
      <table className="user-management-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <UserList 
          users={users} 
          onUpdate={handleUpdateUser} 
          onBlock={handleBlockUser} 
          onUnblock={handleUnblockUser} 
          onDelete={handleDeleteUser} 
        />
      </table>

      {updatingUser && (
        <div className="modal">
          <h3>Update User</h3>
          <input
            type="text"
            placeholder="Name"
            value={newUserData.name}
            onChange={e => setNewUserData({ ...newUserData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUserData.email}
            onChange={e => setNewUserData({ ...newUserData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mobile"
            value={newUserData.mobile}
            onChange={e => setNewUserData({ ...newUserData, mobile: e.target.value })}
          />
          <button onClick={handleSubmitUpdate}>Update</button>
          <button onClick={() => setUpdatingUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
