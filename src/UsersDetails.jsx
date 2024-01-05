import React, { useState, useEffect } from 'react';
import axios from 'axios';



const UsersDetails = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editUserId, setEditUserId] = useState(null);


  useEffect(() => {

    axios.get('https://65981c73668d248edf24245a.mockapi.io/crud/users').then((response) => {
      setUsers(response.data);
      const limitedData = response.data.slice(0, 4);
      setUsers(limitedData);
    });
  }, []);

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      alert('Name and Email are required.');
      return;
    }

    axios
      .post('https://65981c73668d248edf24245a.mockapi.io/crud/users', newUser)
      .then((response) => {
        setUsers([...users, response.data]);
        setNewUser({ name: '', email: '' });
        alert('Added successfully');
      })
      .catch((error) => {
        console.error('Error adding user:', error);
      });
  };

  const handleUpdateUser = () => {
    const { name, email } = newUser;

    if (editUserId !== null) {
  
      axios
        .put(`https://65981c73668d248edf24245a.mockapi.io/crud/users/${editUserId}`, { name, email })
        .then((response) => {
          setUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) => (user.id === editUserId ? response.data : user));
            return updatedUsers;
          });
          setNewUser({ name: '', email: '' });
          setEditUserId(null);
        })
        .catch((error) => {
          console.error('Error updating user:', error);
        });

    }
  };


  const handleEditUser = (userId) => {
    const selectedUser = users.find((user) => user.id === userId);


    setNewUser({ name: selectedUser.name, email: selectedUser.email });

    setEditUserId(userId);

  };

  const handleDeleteUser = (userId) => {

    axios.delete(`https://65981c73668d248edf24245a.mockapi.io/crud/users/${userId}`).then(() => {
      setUsers(users.filter((user) => user.id !== userId));
    });
  };

  return (
    <>


      <div className="container container-with-border" style={{ border: '1px solid #333' }}>
        <div className='row'>
          <div className='userlist' style={{ display: 'flex', alignItems: 'center' }}>
            <h1>User List</h1>
         
          </div>

          <h4>{editUserId !== null ? 'Update User' : 'Add User'}</h4>
          <div className="d-flex align-items-center mb-2 list-unstyled">

            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="form-control mr-3"
            />


            <input
              type="text"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="form-control mr-3"
            />

            <button
              type='button'
              className='btn btn-success btn-sm mr-3'
              onClick={editUserId !== null ? handleUpdateUser : handleAddUser}
            >
              {editUserId !== null ? 'Update' : 'Add'}
            </button>

          </div>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm ml-2"
                      onClick={() => handleEditUser(user.id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </>
  );
};

export default UsersDetails;
