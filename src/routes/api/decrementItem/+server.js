import { db } from '$lib/services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const POST = async ({ request }) => {
	const { itemId } = await request.json();
	try {
		const docRef = doc(db, 'pantry', itemId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const decrement = docSnap.data().count - 1;
			if (decrement > 0) {
				await updateDoc(docRef, { count: decrement });
			}
		}
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Error decrementing item in Firestore:', error);
		return new Response(JSON.stringify({ success: false }), { status: 500 });
	}
};
