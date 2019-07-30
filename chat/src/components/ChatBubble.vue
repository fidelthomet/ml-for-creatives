<template>
  <div class="chat-bubble" :class="[user]">
    <div class="img"><img :src="url"/></div>
    <div class="text">{{ text }}</div>
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
  font-size: 0.9em;
  .text {
    border-radius: 0.5em;
    background-color: #f1f1f1;
    max-width: 60%;
    padding: 0.5em 1em;
    margin: 0.25em 0 1em;
    border-radius: 0.5em 0.5em 0.5em 0;
  }

  img {
    // max-width: 75%;
    display: block;
    max-width: 100%;
  }
  .img {
    border-radius: 0.5em;
    border: 2px solid #f1f1f1;
    overflow: hidden;
    background-color: #147efb;
    max-width: 60%;
  }
  &:nth-child(odd) {
    align-items: flex-end;
    .text {
      color: white;
      background-color: #147efb;
      border-radius: 0.5em 0.5em 0 0.5em;
    }
  }
}
</style>
