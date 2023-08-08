import { createStore } from 'vuex';

export default createStore({
  state: {
    fileContent: null,
  },
  mutations: {
    setFileContent(state, content) {
      state.fileContent = content;
    },
  },
  // 其他选项...
});
