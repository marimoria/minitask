<template>
	<div class="card">
		<div class="card_tick" :class="status">
			<div v-if="status == 'todo'" class="card_tick--todo">⭕</div>
			<div v-if="status == 'progress'" class="card_tick--progress">🟠</div>
			<div v-if="status == 'done'" class="card_tick--done">🟢</div>
		</div>
		<div class="card_info">
			<div class="card_info--task">{{ task }}</div>
		</div>
	</div>
</template>

<script setup>
	import { defineProps } from 'vue';

	// eslint-disable-next-line no-unused-vars
	const props = defineProps({
		task: {
			type: String,
			required: true
		},
		status: {
			type: String,
			required: true,
			validator: (value) => ['todo', 'progress', 'done'].includes(value)
		}
	});
</script>

<style scoped lang="scss">
	.card {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0.8rem;
		gap: 0.5rem;

		background-color: #ffffff;
		border-radius: 16px;
		border: 2px solid #ccc;

		font-family: 'Segoe UI', sans-serif;

		&:hover {
			cursor: pointer;
		}
	}

	.card_tick {
		font-size: 1.3rem;

		&:hover {
			cursor: pointer;
		}
	}

	.card_info {
		&--task {
			font-size: 1.1rem;
			color: #333;
		}
	}
</style>
