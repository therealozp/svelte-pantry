import { db } from '$lib/services/firebase.js';
import { doc, setDoc, collection } from 'firebase/firestore';

export const POST = async ({ request }) => {
	const { itemName } = await request.json();
	try {
		// Create a new document reference with an auto-generated ID
		const docRef = doc(collection(db, 'pantry'));

		// Set the document with the initial data
		await setDoc(docRef, {
			name: itemName,
			count: 1, // Default quantity for new items
		});
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Error adding item to Firestore:', error);
		return new Response(JSON.stringify({ success: false }), { status: 500 });
	}
};
