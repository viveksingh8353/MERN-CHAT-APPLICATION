import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserSidebarQuery } from '../featurs/messageApi';
import { useDispatch, useSelector } from 'react-redux';
import { selecetUsers } from '../featurs/authSlice';
import { useSocketContext } from '../context/SocketContext';

const Sidebar = () => {
  const { data, isLoading, isError } = useGetUserSidebarQuery();
  const [activeUser, setActiveUser] = useState(null); // Track the active user
  const { selectUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { onlineUsers } = useSocketContext(); // Get online users from socket context

  const handleSelect = (user) => {
    setActiveUser(user._id); // Set the active user
    dispatch(selecetUsers(user));
    navigate('/chat');
  };

  if (isLoading) {
    return (
      <div className="w-64 bg-gray-800 text-white h-screen p-4 flex items-center justify-center">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-64 bg-gray-800 text-white h-screen p-4 flex items-center justify-center">
        <span className="text-red-500">Failed to load users.</span>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-lg font-bold mb-4">Chat Users</h2>
      <ul className="space-y-2">
        {data?.map((user) => {
          const isOnline = onlineUsers?.includes(user._id); // Check if the user is online
          return (
            <li
              key={user._id}
              className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                activeUser === user._id ? 'bg-blue-500' : 'bg-gray-700'
              } hover:bg-gray-600`}
              onClick={() => handleSelect(user)}
            >
              <span>{user.fullName}</span>
              <span
                className={`w-3 h-3 rounded-full ${
                  isOnline ? 'bg-green-500' : 'bg-red-100'
                }`}
                title={isOnline ? 'Online' : 'Offline'}
              ></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
