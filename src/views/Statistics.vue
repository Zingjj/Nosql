<template>
  <div>
    <el-col :span="12">
      <cardOne></cardOne>
    </el-col>
    <el-col :span="12">
      <cardTwo></cardTwo>
    </el-col>
  </div>
</template>

<script>
import StatisticCardOne from "@/components/StatisticCardOne.vue";
import StatisticCardTwo from "@/components/StatisticCardTwo.vue";
export default {
  name: "statistics",
  data() {
    return {};
  },
  components: {
    cardOne: StatisticCardOne,
    cardTwo: StatisticCardTwo
  }
};
</script>