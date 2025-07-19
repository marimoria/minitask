import eslintConfig from '@electron-toolkit/eslint-config';
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
	{ ignores: ['**/node_modules', '**/dist', '**/out'] },
	eslintConfig,
	...eslintPluginVue.configs['flat/recommended'],
	{
		files: ['**/*.vue'],
		rules: {
			'prettier/prettier': [
				'error',
				{
					useTabs: true,
					tabWidth: 4,
					vueIndentScriptAndStyle: true,
					endOfLine: 'auto'
				}
			]
		},
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				},
				extraFileExtensions: ['.vue']
			}
		}
	},
	{
		files: ['**/*.{js,jsx,vue}'],
		rules: {
			'vue/require-default-prop': 'off',
			'vue/multi-word-component-names': 'off'
		}
	},
	eslintConfigPrettier
];
