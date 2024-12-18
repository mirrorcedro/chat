import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import logo from '../assets/spotvibelogo.png';
import io from 'socket.io-client';

const Home = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('user', user);

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
      console.log("current user Details", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  /*** socket connection */
  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socketConnection.on('onlineUser', (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const basePath = location.pathname === '/';

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>

      {/**message component**/}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div className={`justify-center items-center flex-col gap-8 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
        <div className='text-center'>
          <img src={logo} width={200} alt='SpotVibe logo' />
        </div>

        <div className="text-center mt-4 max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Welcome to SpotVibe!</h2>
          <p className="text-lg text-slate-600 mb-6">
            Discover a world of music, products, events, and community interaction on SpotVibe. Whether you're an artist, producer, fan or our customer, there's something for everyone!
          </p>
          
          <p className="text-lg text-slate-600 mb-6">
            Have questions or need help? You can easily chat with our community of helpers or other users. Select or search a user  and start chatting to get the support you need!
          </p>
        </div>

        <div className="flex gap-6 mt-6 justify-center">
          <button 
            className="px-8 py-3 bg-blue-600 text-white text-xl rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate('/')}
          >
            Chat with Helpers
          </button>

          <button 
            className="px-8 py-3 bg-green-600 text-white text-xl rounded-lg hover:bg-green-700 transition"
            onClick={() => navigate('/events')}
          >
            Explore Events
          </button>

          <button 
            className="px-8 py-3 bg-yellow-500 text-white text-xl rounded-lg hover:bg-yellow-600 transition"
            onClick={() => navigate('/products')}
          >
            Shop Products
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-md text-slate-500">
            Select a user from the platform and easily connect with them for real-time chat. You can also explore exciting events and shop for products from artists and producers. Get started now and join the SpotVibe community!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
