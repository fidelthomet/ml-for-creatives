<template>
  <div id="app">
    <div class="chat">
      <ChatBubble v-for="(m, i) in messages" :key="`m${i}`" v-bind="m"/>
    </div>
  </div>
</template>

<script>
import ChatBubble from './components/ChatBubble.vue'

export default {
  name: 'app',
  components: {
    ChatBubble
  },
  data () {
    return {
      messages: []
    }
  },
  mounted () {
    this.messages.push({
      url: 'https://images.unsplash.com/photo-1458938354258-3e66eb36eb7b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      text: 'donut',
      user: 'left'
    })

    this.messages.push({
      url: 'https://images.unsplash.com/photo-1458938354258-3e66eb36eb7b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      text: 'donut',
      user: 'right'
    })

    this.messages.push({
      url: 'https://images.unsplash.com/photo-1458938354258-3e66eb36eb7b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      text: 'donut',
      user: 'left'
    })

    this.messages.push({
      url: 'https://images.unsplash.com/photo-1458938354258-3e66eb36eb7b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      text: 'donut',
      user: 'right'
    })

    this.messages.push({
      url: 'https://images.unsplash.com/photo-1458938354258-3e66eb36eb7b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max',
      text: 'donut',
      user: 'left'
    })
  }
}
</script>

<style lang="scss">
*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 100vh;
  overflow: hidden;
}
</style>
<style scoped lang="scss">
.chat {
  max-width: 540px;
  width: 100%;

}
</style>
