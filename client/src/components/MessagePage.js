import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';  // Ensure this function handles the upload correctly
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import backgroundImage from '../assets/wallapaper.jpeg';
import { IoMdSend } from "react-icons/io";
import moment from 'moment';
import chatback1 from '../assets/chatback1.jpeg';
import chatback2 from '../assets/chatback2.jpeg';
import chatback3 from '../assets/chatback3.jpeg';
import chatback4 from '../assets/chatback4.jpeg';
import chatback5 from '../assets/chatback5.jpeg';
import chatback6 from '../assets/chatback6.jpeg';
import chatback7 from '../assets/chatback7.jpeg';
import chatback8 from '../assets/chat1.jpeg';
import chatback9 from '../assets/chat2.jpeg';
import chatback10 from '../assets/chat3.jpeg';
import chatback11 from '../assets/chat4.jpeg';
import chatback12 from '../assets/chat5.jpeg';
import chatback13 from '../assets/chat6.jpeg';
import chatback14 from '../assets/chat7.jpeg';

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const baseURL = useSelector(state => state?.user?.baseURL);  // Get baseURL from Redux
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const [deleteMessageModal, setDeleteMessageModal] = useState(null);
  const currentMessage = useRef(null);
  const [openBackgroundMenu, setOpenBackgroundMenu] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(backgroundImage);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload(prev => !prev);
  };

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];

    if (!file) return;

    setLoading(true);  // Start loading

    try {
      const uploadPhoto = await uploadFile(file, baseURL);  // Ensure `uploadFile` handles baseURL
      setMessage(prev => ({
        ...prev,
        [type]: uploadPhoto.url // Set the URL for the correct file type
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);  // End loading
      setOpenImageVideoUpload(false);
    }
  };

  const handleClearUpload = (type) => {
    setMessage(prev => ({
      ...prev,
      [type]: "" // Clear the uploaded file URL
    }));
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);
      socketConnection.emit('seen', params.userId);

      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      });

      socketConnection.on('message', (data) => {
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage(prev => ({
      ...prev,
      text: value
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        });
      }
    }
  };

  const handleDeleteMessage = (messageId, forEveryone) => {
    if (socketConnection) {
      socketConnection.emit('delete-message', {
        messageId,
        forEveryone
      });

      setAllMessage(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
      setDeleteMessageModal(null);
    }
  };

  const toggleBackgroundMenu = () => {
    setOpenBackgroundMenu(!openBackgroundMenu);
  };

  const changeBackground = (bg) => {
    setSelectedBackground(bg);
    setOpenBackgroundMenu(false);
  };

  return (
    <div style={{ backgroundImage: `url(${selectedBackground})` }} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={"/"} className='lg:hidden'>
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
            <p className='-my-2 text-sm'>
              {
                dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
              }
            </p>
          </div>
        </div>

        <div>
          <button onClick={toggleBackgroundMenu} className='cursor-pointer hover:text-primary'>
            <HiDotsVertical size={25} />
          </button>
        </div>
      </header>

      {/* Background Menu */}
      {openBackgroundMenu && (
        <div className="absolute top-16 right-4 shadow-lg rounded-lg w-44 p-2 z-20">
          <h4 className="text-center text-lg font-semibold">Select Background</h4>
          <div className="flex flex-col gap-2 mt-2">
            {[chatback1, chatback2, chatback3, chatback4, chatback5, chatback6, chatback7, chatback8, chatback9, chatback10, chatback11, chatback12, chatback13, chatback14]
            .map((bg, idx) => (
              <img
                key={idx}
                src={bg}
                alt={`Background ${idx + 1}`}
                className="w-16 h-16 cursor-pointer"
                onClick={() => changeBackground(bg)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Show all messages */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div key={index} className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"} relative`}>
              <div className='w-full'>
                {msg?.imageUrl && (
                  <img
                    src={msg?.imageUrl}
                    className='w-full h-full object-scale-down'
                    alt="message media"
                  />
                )}
                {msg?.videoUrl && (
                  <video
                    src={msg.videoUrl}
                    className='w-full h-full object-scale-down'
                    controls
                    alt="message media"
                  />
                )}
              </div>
              <p className='px-2'>{msg.text}</p>
              <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>

              {/* Message Delete Button */}
              {user._id === msg?.msgByUserId && (
                <button
                  className='absolute top-5 right-5 p-2 text-red-500 hover:text-red-700'
                  onClick={() => setDeleteMessageModal(msg._id)}
                >
                  <span className="text-sm">🗑️</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Send Message */}
      <section className='h-16 bg-white flex items-center px-4'>
        <div className='relative'>
          <button onClick={handleUploadImageVideoOpen} className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
            <FaPlus size={20} />
          </button>

          {/* Video and Image upload options */}
          {
            openImageVideoUpload && (
              <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                <form>
                  <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-primary'>
                      <FaImage size={18} />
                    </div>
                    <p>Image</p>
                  </label>
                  <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                    <div className='text-purple-500'>
                      <FaVideo size={18} />
                    </div>
                    <p>Video</p>
                  </label>

                  <input 
                    type='file'
                    id='uploadImage'
                    onChange={(e) => handleUpload(e, 'imageUrl')}
                    className='hidden'
                  />

                  <input 
                    type='file'
                    id='uploadVideo'
                    onChange={(e) => handleUpload(e, 'videoUrl')}
                    className='hidden'
                  />
                </form>
              </div>
            )
          }

          {/* Loading indicator */}
          {loading && <Loading />}

        </div>

        {/* Input Box */}
        <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
          <input
            type='text'
            placeholder='Type here message...'
            className='py-1 px-4 outline-none w-full h-full'
            value={message.text}
            onChange={handleOnChange}
          />
          <button className='text-primary hover:text-secondary'>
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
