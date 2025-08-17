import { supabase } from './supabaseClient';

export interface ChatMessage {
	id?: string;
	user_id: string;
	role: 'user' | 'ai';
	message: string;
	image_url?: string;
	created_at?: string;
}

export async function saveChatMessage(msg: ChatMessage) {
	const { data, error } = await supabase
		.from('chat_messages')
		.insert([msg]);
	if (error) throw error;
	return data;
}

export async function getChatMessages(user_id: string) {
	const { data, error } = await supabase
		.from('chat_messages')
		.select('*')
		.eq('user_id', user_id)
		.order('created_at', { ascending: true });
	if (error) throw error;
	return data as ChatMessage[];
}
