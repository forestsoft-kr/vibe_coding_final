import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import './styles/index.scss';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from './services/supabaseClient';
import { setAuth, clearAuth } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(setAuth({ user: session.user, accessToken: session.access_token }));
        navigate('/chat');
      } else {
        dispatch(clearAuth());
        navigate('/'); // Navigate to landing page on logout
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [dispatch, navigate]);

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;