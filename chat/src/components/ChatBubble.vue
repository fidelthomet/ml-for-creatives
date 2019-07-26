<template>
  <div class="chat-bubble" :class="[user]">
    <img :src="url"/>
    <div>{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'ChatBubble',
  props: {
    text: String,
    url: String,
    user: String
  }
}
</script>

<style scoped lang="scss">
.chat-bubble {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  &:nth-child(odd) {
    align-items: flex-end;
  }
}
</style>
