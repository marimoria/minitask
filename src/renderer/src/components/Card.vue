<template>
	<div class="card pixel-corners-border" draggable="true" @dragstart="onDragStart($event)">
		<div class="card_tick" :class="status">
			<div v-if="status == 'todo'" class="card_tick--todo">⭕</div>
			<div v-if="status == 'progress'" class="card_tick--progress">🟠</div>
			<div v-if="status == 'done'" class="card_tick--done">🟢</div>
		</div>
		<div class="card_info">
			<div class="card_info--task">{{ task.taskDesc }}</div>
		</div>
		<div class="card_del_button" @click="handleDelete()">🗑️</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		task: {
			type: Object,
			required: true
		},
		status: {
			type: String,
			required: true,
			validator: (value) => ['todo', 'progress', 'done'].includes(value)
		}
	});

	const cardEvents = defineEmits(['deleted', 'moved']);

	function handleDelete() {
		cardEvents('deleted', props.task.id, props.status);
	}

	function onDragStart(event) {
		event.dataTransfer.setData(
			'text/plain',
			JSON.stringify({
				id: props.task.id,
				from: props.status
			})
		);
	}
</script>

<style scoped lang="scss">
	.card {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0.7rem;
		gap: 0.5rem;

		background-color: #ffffff;
		border-radius: 16px;
		border: 2px solid #ccc;

		font-family: 'PixelFont';

		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;

		&:hover {
			cursor: pointer;
			transform: translateY(-2px);
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		}
	}

	.card_tick {
		font-size: 1rem;

		&:hover {
			cursor: pointer;
		}
	}

	.card_info {
		&--task {
			font-size: 0.95rem;
			color: #333;
		}
	}
</style>
