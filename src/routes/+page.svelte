<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import PantryItem from '$lib/custom-components/PantryItem.svelte';
	import { itemStore } from '$lib/stores/itemstore.js';
	import {
		Dialog,
		DialogTitle,
		DialogFooter,
		DialogTrigger,
		DialogContent,
		DialogDescription,
	} from '$lib/components/ui/dialog/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';

	let items;
	itemStore.subscribe((value) => {
		items = value;
	});

	let newItem = '';
	let isDialogOpen = false;

	const isObjectEmpty = (objectName) => {
		return (
			Object.keys(objectName).length === 0 && objectName.constructor === Object
		);
	};

	const handleAddItem = (newItem) => {
		addItem(newItem);
		getInventory();
		newItem = '';
		isDialogOpen = false;
	};

	const addItem = async (itemName) => {
		const res = await fetch(`/api/addItem`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ itemName: itemName }),
		});
		const data = await res.json();
		console.log(data);
	};

	const getInventory = async () => {
		const res = await fetch(`/api/getInventory`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await res.json();
		console.log(data);
		itemStore.set(data);
	};

	onMount(() => {
		getInventory();
	});
</script>

<head>
	<title>Pantry Tracker</title>
</head>

<Dialog bind:open={isDialogOpen}>
	<div class="flex flex-col justify-center items-center h-screen">
		<h1
			class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8"
		>
			Pantry Tracker
		</h1>
		<div class="flex flex-col overflow-y-auto h-3/5 mb-8">
			{#if isObjectEmpty(items)}
				<p>No items in your pantry. Click "Add Item" to add.</p>
			{:else}
				{#each Object.keys(items) as itemId}
					<PantryItem
						item={items[itemId].name}
						count={items[itemId].count}
						{itemId}
					/>
				{/each}
			{/if}
		</div>
		<DialogTrigger
			class="m-2 p-3"
			variant="outline"
			size="md"
			on:click={() => (isDialogOpen = true)}
		>
			Add Item
		</DialogTrigger>
	</div>

	<DialogContent>
		<DialogTitle>Add Item</DialogTitle>
		<DialogDescription>Add a new item to your pantry</DialogDescription>
		<p>Item name</p>
		<Input bind:value={newItem} />
		<DialogFooter>
			<Button on:click={handleAddItem(newItem)}>Add</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
