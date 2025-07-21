<template>
	<div class="board_app">
		<div class="board_app--header">
			<img src="../assets/images/icon.png" class="header--icon" />
			<h1 class="header--title">Mini Tasks</h1>
		</div>

		<div class="board_app--columns">
			<div class="columns--todo pixel-corners">
				<div class="columns_header">
					<img src="../assets/images/todo_icon.png" class="columns_header--icon" />
					<h2 class="columns_header--title_todo">To-Do</h2>
				</div>
				<div
					class="columns_cards_area"
					:class="{ 'drop-hover': hoveredColumn === 'todo' }"
					@dragover.prevent
					@dragenter="hoveredColumn = 'todo'"
					@dragleave="hoveredColumn = null"
					@drop="moveTask($event, 'todo')"
				>
					<Card
						v-for="todoTask in tasks['todoTasks']"
						:key="todoTask.id"
						:status="'todo'"
						:task="todoTask"
						@deleted="deleteTask"
					/>
				</div>
				<div class="columns_add_task">
					<input
						v-model="newTaskDesc"
						type="text"
						class="add_task--input pixel-corners-2"
						placeholder="Insert new task..."
					/>
					<button class="add_task--button pixel-corners-2" @click="addTask">Add</button>
				</div>
			</div>

			<div class="columns--progress pixel-corners">
				<div class="columns_header">
					<img src="../assets/images/progress_icon.png" class="columns_header--icon" />
					<h2 class="columns_header--title_progress">Progress</h2>
				</div>
				<div
					class="columns_cards_area"
					:class="{ 'drop-hover': hoveredColumn === 'progress' }"
					@dragover.prevent
					@dragenter="hoveredColumn = 'progress'"
					@dragleave="hoveredColumn = null"
					@drop="moveTask($event, 'progress')"
				>
					<Card
						v-for="progressTask in tasks['progressTasks']"
						:key="progressTask.id"
						:status="'progress'"
						:task="progressTask"
						@deleted="deleteTask"
					/>
				</div>
			</div>

			<div class="columns--done pixel-corners">
				<div class="columns_header">
					<img src="../assets/images/done_icon.png" class="columns_header--icon" />
					<h2 class="columns_header--title_done">Done</h2>
				</div>
				<div
					class="columns_cards_area"
					:class="{ 'drop-hover': hoveredColumn === 'done' }"
					@dragover.prevent
					@dragenter="hoveredColumn = 'done'"
					@dragleave="hoveredColumn = null"
					@drop="moveTask($event, 'done')"
				>
					<Card
						v-for="doneTask in tasks['doneTasks']"
						:key="doneTask.id"
						:status="'done'"
						:task="doneTask"
						@deleted="deleteTask"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import Card from '../components/Card.vue';

	/*
	const isDev = import.meta.env.MODE === 'development';
	const API_ROOT = isDev ? 'http://localhost:5000' : 'http://127.0.0.1:5000';
	const API_URL = `${API_ROOT}/tasks`;
	*/

	const API_URL = '/api/tasks';

	const tasks = ref({});
	const newTaskDesc = ref('');
	const hoveredColumn = ref(null);

	async function fetchTasks() {
		return await fetch(API_URL).then((res) => res.json());
	}

	async function addTask() {
		const filteredDesc = newTaskDesc.value.trim();

		if (!filteredDesc) {
			return;
		}

		await fetch(API_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ taskDesc: filteredDesc })
		});

		newTaskDesc.value = '';
		tasks.value = await fetchTasks();
	}

	async function deleteTask(taskId, taskStatus) {
		tasks.value[`${taskStatus}Tasks`] = tasks.value[`${taskStatus}Tasks`].filter(
			(task) => task.id !== taskId
		);
		await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
	}

	async function moveTask(e, toStatus) {
		const droppedData = e.dataTransfer.getData('text/plain');

		if (!droppedData) {
			return;
		}

		const { id, from } = JSON.parse(droppedData);

		if (from === toStatus) {
			return;
		}

		// Backend move
		await fetch(`${API_URL}/move`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, from, to: toStatus })
		});

		// Frontend update
		const movedTask = tasks.value[`${from}Tasks`].find((task) => task.id === id);

		if (!movedTask) {
			return;
		}

		tasks.value[`${from}Tasks`] = tasks.value[`${from}Tasks`].filter((task) => task.id !== id);
		tasks.value[`${toStatus}Tasks`].push(movedTask);

		hoveredColumn.value = null;
	}

	onMounted(async () => {
		tasks.value = await fetchTasks();
	});
</script>

<style scoped lang="scss">
	@use '../assets/styles/home.scss';
</style>
