import { createAsyncThunk } from '@reduxjs/toolkit';
import { postChatMessage } from '../../services/chatApi';
import { saveChatMessage, getChatMessages } from '../../services/chatSupabaseApi';
import { uploadImageApi } from '../../services/uploadApi';
import { addMessage, setLoading, setChatHistory } from './chatSlice';

interface SendMessagePayload {
  prompt: string;
  file: File | null;
}


export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ prompt, file }: SendMessagePayload, { dispatch, getState }) => {
    dispatch(setLoading(true));

    let imageUrl: string | undefined = undefined;
    let uploadedImagePath: string | undefined = undefined;

    // 1. If there is a file, upload it first.
    if (file) {
      try {
        const uploadResponse = await uploadImageApi(file);
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        imageUrl = `${apiBaseUrl}${uploadResponse.filePath}`;
        uploadedImagePath = uploadResponse.filePath;
      } catch (error) {
        console.error('Error uploading image:', error);
        dispatch(addMessage({ 
          id: Date.now().toString(), 
          text: 'Image upload failed. Please try again.', 
          sender: 'ai', 
          isError: true 
        }));
        dispatch(setLoading(false));
        return;
      }
    }

    // 2. Add user's message to chat history immediately & Supabase 저장
    const state: any = getState();
    const user_id = state.auth?.user?.id;
    const userMessage = {
      id: Date.now().toString(),
      text: prompt,
      sender: 'user' as 'user',
      image: uploadedImagePath,
    };
    dispatch(addMessage(userMessage));
    if (user_id) {
      await saveChatMessage({
        user_id,
        role: 'user',
        message: prompt,
        image_url: imageUrl,
      });
    }

    // 3. Send the prompt and optional image URL to the chat API.
    try {
      const response = await postChatMessage({ input: prompt, imageUrl });
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: response.output_text,
        sender: 'ai' as 'ai',
      };
      dispatch(addMessage(aiMessage));
      if (user_id) {
        await saveChatMessage({
          user_id,
          role: 'ai',
          message: response.output_text,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch(addMessage({ 
        id: (Date.now() + 1).toString(), 
        text: 'Error communicating with the AI. Please check your API key and server status.', 
        sender: 'ai',
        isError: true 
      }));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchChatHistory',
  async (_, { dispatch, getState }) => {
    const state: any = getState();
    const user_id = state.auth?.user?.id;
    if (!user_id) return;
    try {
      const messages = await getChatMessages(user_id);
      const reduxMessages = messages.map((msg) => ({
        id: msg.id || Date.now().toString(),
        text: msg.message,
        sender: (msg.role === 'user' ? 'user' : 'ai') as 'user' | 'ai',
        image: msg.image_url,
      }));
      dispatch(setChatHistory(reduxMessages));
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  }
);
