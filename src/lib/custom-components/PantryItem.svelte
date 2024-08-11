<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { Plus, Minus, Trash2 } from 'lucide-svelte';
	import { itemStore } from '$lib/stores/itemstore.js';

	export let item;
	export let count;
	export let itemId;

	let updateQueue = [];
	let isProcessing = false;

	const processQueue = async () => {
		if (isProcessing) return;
		isProcessing = true;

		while (updateQueue.length > 0) {
			const { itemId, action } = updateQueue.shift();
			const res = await fetch(`/api/${action}Item`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ itemId }),
			});
			const data = await res.json();
			if (!res.ok) {
				console.error(`Failed to ${action} item:`, data.message);
				if (action == 'increment') {
					count -= 1;
				} else if (action == 'decrement') {
					count += 1;
				}
				itemStore.update((items) => {
					items[itemId].count = count;
					return items;
				});
				// Optionally handle the error, e.g., revert the optimistic update
			}
		}

		isProcessing = false;
	};

	const incrementItem = () => {
		// Optimistically update the UI
		count += 1;
		itemStore.update((items) => {
			items[itemId].count = count;
			return items;
		});

		// Add to the queue
		updateQueue.push({ itemId, action: 'increment' });
		processQueue();
	};

	const decrementItem = () => {
		if (count > 0) {
			// Optimistically update the UI
			count -= 1;
			itemStore.update((items) => {
				items[itemId].count = count;
				return items;
			});

			// Add to the queue
			updateQueue.push({ itemId, action: 'decrement' });
			processQueue();
		}
	};

	const removeItem = async () => {
		try {
			const res = await fetch(`/api/removeItem`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ itemId }),
			});
			const data = await res.json();
			if (res.ok) {
				itemStore.update((items) => {
					delete items[itemId];
					return items;
				});
			} else {
				console.error('Failed to remove item:', data.message);
			}
		} catch (error) {
			console.error('Failed to remove item:', error);
		}
	};
</script>

<div
	class="m-3 flex flex-none justify-between items-start p-4 border-2 border-slate-50 rounded-md overflow-x-hidden"
>
	<div class="w-96">
		<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">{item}</h3>
		<p>Count: {count}</p>
	</div>
	<div class="flex">
		<Button class="m-2" on:click={incrementItem} variant="outline" size="icon">
			<Plus size={24} />
		</Button>
		<Button class="m-2" on:click={decrementItem} variant="outline" size="icon">
			<Minus size={24} />
		</Button>
		<Button
			class="m-2"
			on:click={() => removeItem()}
			variant="outline"
			size="icon"
		>
			<Trash2 size={24} color="red" />
		</Button>
	</div>
</div>
