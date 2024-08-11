import { db } from '$lib/services/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

export const GET = async () => {
	try {
		const snapshot = query(collection(db, 'pantry'));
		const docs = await getDocs(snapshot);
		const items = {};
		docs.forEach((doc) => {
			items[doc.id] = { ...doc.data() };
		});
		return new Response(JSON.stringify(items), { status: 200 });
	} catch (error) {
		console.error('Error getting inventory from Firestore:', error);
		return new Response(JSON.stringify({ success: false }), { status: 500 });
	}
};
