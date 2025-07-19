<template>
	<router-view v-slot="{ Component }">
		<Transition name="fade-slide-router" mode="out-in">
			<component :is="Component" :viewport="viewport" :device="device" />
		</Transition>
	</router-view>
</template>

<script setup>
	import './assets/styles/app.scss'; // global app styling

	import { onMounted } from 'vue';

	onMounted(() => {
		document.addEventListener('contextmenu', (e) => {
			e.preventDefault();
		});
	});
</script>
