<template>
	<div class="board_app">
		<div class="board_app--header">
			<img src="../assets/images/icon.png" alt="" class="header--icon" />
			<h1 class="header--title">Mini Tasks</h1>
		</div>
		<div class="board_app--columns">
			<div class="columns--todo">
				<div class="columns_header">
					<img src="../assets/images/todo_icon.png" class="columns_header--icon" />
					<h2 class="columns_header--title_todo">To Do</h2>
				</div>
				<div class="columns_cards_area">
					<Card :task="'Feed the dog'" :status="'todo'" />
					<Card :task="'Water my plants'" :status="'todo'" />
				</div>
				<div class="columns_add_task">
					<input type="text" placeholder="New task..." class="add_task--input" />
					<button class="add_task--button">Add</button>
				</div>
			</div>

			<div class="columns--progress">
				<div class="columns_header">
					<img src="../assets/images/progress_icon.png" class="columns_header--icon" />
					<h2 class="columns_header--title_progress">Progress</h2>
				</div>
				<div class="columns_cards_area">
					<Card :task="'Math homework'" :status="'progress'" />
				</div>
			</div>

			<div class="columns--done">
				<div class="columns_header">
					<img src="../assets/images/done_icon.png" class="columns_header--icon" />
					<h2 class="columns_header--title_progress">Done</h2>
				</div>
				<div class="columns_cards_area">
					<Card :task="'Buy groceries'" :status="'done'" />
					<Card :task="'Read article'" :status="'done'" />
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
