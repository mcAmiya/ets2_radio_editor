export const useStore = defineStore('file', {
    // 转换为函数
    state: () => ({
        fileContent: null,
    }),
    actions: {
        // mutation 现在可以成为 action 了，不再用 `state` 作为第一个参数，而是用 `this`。
        setFileContent(content) {
            this.fileContent = content;
        },
    },
    // 其他选项...
});
