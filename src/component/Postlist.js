import React, { useState, useEffect } from 'react';
import { fetchUsers, addUser, updateUser, deleteUser } from './Api'; // Update the API imports
import '../Userlist.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', username: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    getUsers();
  }, []);

  const handleAddUser = async () => {
    const user = await addUser(newUser);
    setUsers([...users, user]);
    setNewUser({ name: '', username: '', email: '' });
  };

  const handleUpdateUser = async () => {
    if (editingId !== null) {
      const updated = await updateUser(editingId, newUser);
      setUsers(users.map(user => (user.id === editingId ? updated : user)));
      setEditingId(null);
      setNewUser({ name: '', username: '', email: '' });
    }
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    setUsers(users.filter(user => user.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleEditClick = (user) => {
    setNewUser({ name: user.name, username: user.username, email: user.email });
    setEditingId(user.id);
  };

  return (
    <div className="user-list-container">
      <h1>Users</h1>
      <div className="new-user-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newUser.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleChange}
        />
        <button onClick={editingId ? handleUpdateUser : handleAddUser}>
          {editingId ? 'Update User' : 'Add User'}
        </button>
      </div>
      <ul className='user-list'>
        {users.map(user => (
          <li key={user.id} className='user-profile'>
            <div className='user-details'>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
            <div className='user-actions'>
              <button onClick={() => handleEditClick(user)}>Edit</button>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
