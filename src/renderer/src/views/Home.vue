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
				<div class="columns_cards_area">
					<Card :task="'Water the plants'" :status="'todo'" />
					<Card :task="'Calculus homework'" :status="'todo'" />
					<Card :task="'English assignment'" :status="'todo'" />
				</div>
				<div class="columns_add_task">
					<input
						type="text"
						class="add_task--input pixel-corners-2"
						placeholder="Insert new task..."
					/>
					<button class="add_task--button pixel-corners-2">Add</button>
				</div>
			</div>

			<div class="columns--progress pixel-corners">
				<div class="columns_header">
					<img src="../assets/images/progress_icon.png" class="columns_header--icon" />
					<h2 class="columns_header--title_progress">Progress</h2>
				</div>
				<div class="columns_cards_area">
					<Card :task="'Biology review'" :status="'progress'" />
				</div>
			</div>

			<div class="columns--done pixel-corners">
				<div class="columns_header">
					<img src="../assets/images/done_icon.png" class="columns_header--icon" />
					<h2 class="columns_header--title_done">Done</h2>
				</div>
				<div class="columns_cards_area">
					<Card :task="'Statistics review'" :status="'done'" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import Card from '../components/Card.vue';
</script>

<style scoped lang="scss">
	@use '../assets/styles/home.scss';
</style>
