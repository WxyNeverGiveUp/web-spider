<template>
    <div>
        <el-button type="primary" @click='back'>返回首页</el-button>
    </div>
</template>

<script>
    export default {
        name: 'back',
        methods: {
            back () {
                this.$router.push('/')
            }
        }  
    }
</script>

<style scoped>
    div {
        float: left;
    }
</style>




