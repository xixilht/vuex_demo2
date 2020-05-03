import Vue from 'vue'
import Vuex from 'vuex'

// axios 发起请求是异步操作
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的任务列表
    list: [],
    // 文本框的内容
    inputValue: 'aaa',
    // 下一个Id
    nextId: 5,
    // 视图的key值，默认展示所有数据
    viewKey: 'all'
  },
  mutations: {
    initList(state, list) {
      state.list = list
    },
    // 为 state 中的 inputValue 赋值
    setInputValue(state, val) {
      state.inputValue = val
    },
    // 添加列表项目
    addItem(state) {
      const obj = {
        // 一般真实项目中的id都是自动生成的，现在纯前端，只能模拟
        id: state.nextId,
        info: state.inputValue.trim(),
        // 表示任务处于未完成状态
        done: false
      }
      state.list.push(obj)
      state.nextId += 1
      state.inputValue = ''
    },
    // 根据Id删除对应的任务事项
    removeItem(state, id) {
      // 根据id查找对应项的索引
      // 当数组中的元素在测试条件时返回 true 时, findIndex() 返回符合条件的元素的索引位置，之后的值不会再调用执行函数。
      // 如果没有符合条件的元素返回 -1
      const i = state.list.findIndex(x => x.id === id)
      // 根据索引，删除对应的元素
      if (i !== -1) {
        // splice：在list数组中从i这个位置的索引删除一项
        state.list.splice(i, 1)
      }
    },
    // 修改列表项的选中状态
    changeStatus(state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.status
      }
    },
    // 清除已完成的任务
    cleanDone(state) {
      // filter运行完成后会返回一个过滤筛选后的数组,
      // 会把 x.done === false 已完成的事项数据筛选出来,
      // 返回给 list
      state.list = state.list.filter(x => x.done === false)
    },
    // 修改视图的关键字
    changeViewKey(state, key) {
      state.viewKey = key
    }
  },
  // 应该将异步的操作定义到 actions 对应的节点中
  actions: {
    getList(context) {
      axios.get('/list.json').then(({ data }) => {
        console.log(data)
        context.commit('initList', data)
      })
    }
  },
  // getters作用：给数据进行一个包装，只显示希望看到的数据
  getters: {
    // 统计未完成的任务的条数
    unDoneLength(state) {
      return state.list.filter(x => x.done === false).length
    },
    // 实现任务列表数据的按需切换
    infoList(state) {
      if (state.viewKey === 'all') {
        return state.list
      }
      if (state.viewKey === 'undone') {
        return state.list.filter(x => !x.done)
      }
      if (state.viewKey === 'done') {
        return state.list.filter(x => x.done)
      }
      return state.list
    }
  },
  modules: {
  }
})
