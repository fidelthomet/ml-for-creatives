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
    let serverIP = '192.168.10.188'

    const socket = new WebSocket(`ws://${serverIP}:8080`)
    const id = `${Math.random()}`

    socket.addEventListener('open', function (event) {
      socket.send(`init/${id}`)
    })

    socket.addEventListener('message', ({ data }) => {
      console.log(data)
      const data2 = JSON.parse(data)
      console.log('received', data)
      this.messages.push({
        url: data2.url,
        text: data2.label,
        user: 'left'
      })
    })
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Noto+Sans:400,400i,700,700i|Ubuntu+Mono|Ubuntu:400,500,700&subset=greek,latin-ext");

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Noto Sans", sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 100vh;
  overflow: hidden;
}
</style>
<style scoped lang="scss">
.chat {
  max-width: 840px;
  width: 100%;

}
</style>
